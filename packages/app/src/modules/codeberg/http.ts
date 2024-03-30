import AccountStore from '@app/stores/account';

import { CodebergResponse } from './types';

const CLIENT_ID = __CODEBERG_CLIENT_ID__;

export const regenerateCodebergToken = async () => {
	const next = 'https://codeberg.org/login/oauth/access_token';

	const response = await fetch(next, {
		method: 'POST',
		body: JSON.stringify({
			client_id: CLIENT_ID,
			code_verifier: await AccountStore.getKey('codeberg_verifier'),
			refresh_token: await AccountStore.getKey('codeberg_refresh'),
			grant_type: 'refresh_token'
		}),
		headers: {
			'Content-Type': 'application/json'
		}
	});

	if (!response.ok) {
		try {
			console.error(await response.text());
		} catch (e) {
			console.error(e);
		}
	}

	const res = (await response.json()) as { access_token: string; refresh_token: string };

	if (!res.access_token || !res.refresh_token) {
		return;
	}

	await Promise.allSettled([
		AccountStore.setKey('codeberg_access', res.access_token),
		AccountStore.setKey('codeberg_refresh', res.refresh_token)
	]);
};

type _HeadersInit = HeadersInit & {
	Accept: 'application/json' | 'application/html' | 'text/plain' | 'text/html';
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

let triedRegenerating = false;

export const Codeberg = <T extends keyof CodebergResponse>(
	path: T
): {
	headers: <R = CodebergResponse[T][1]>(
		headers: _HeadersInit
	) => {
		get: (...params: CodebergResponse[T][0]) => Promise<R>;
		post: (body: unknown, ...params: CodebergResponse[T][0]) => Promise<R>;
		stream: (
			limit: number,
			cb?: (response: R) => void,
			...params: CodebergResponse[T][0]
		) => Promise<R>;
	};
	get: (...params: CodebergResponse[T][0]) => Promise<CodebergResponse[T][1]>;
	post: (body: unknown, ...params: CodebergResponse[T][0]) => Promise<CodebergResponse[T][1]>;
	query: (query: Record<string, string>) => {
		get: (...params: CodebergResponse[T][0]) => Promise<CodebergResponse[T][1]>;
		post: (body: unknown, ...params: CodebergResponse[T][0]) => Promise<CodebergResponse[T][1]>;
		headers: <R = CodebergResponse[T][1]>(
			headers: _HeadersInit
		) => {
			get: (...params: CodebergResponse[T][0]) => Promise<R>;
			post: (body: unknown, ...params: CodebergResponse[T][0]) => Promise<R>;
			stream: (
				limit: number,
				cb?: (response: R) => void,
				...params: CodebergResponse[T][0]
			) => Promise<R>;
		};
		stream: (
			limit: number,
			cb?: (response: CodebergResponse[T][1]) => void,
			...params: CodebergResponse[T][0]
		) => Promise<CodebergResponse[T][1]>;
	};
	stream: (
		limit: number,
		cb?: (response: CodebergResponse[T][1]) => void,
		...params: CodebergResponse[T][0]
	) => Promise<CodebergResponse[T][1]>;
} => {
	let url = 'https://codeberg.org/api/v1/';
	triedRegenerating = false;

	switch (path) {
		case 'user/repos':
			url += 'user/repos?';
			break;
		case 'user':
			url += 'user?';
			break;
	}

	let headers: HeadersInit = {
		Accept: 'application/json'
	};

	let queryParams: Record<string, string> = {};

	const query = (queries: Record<string, string>) => {
		queryParams = queries;

		return {
			get,
			post,
			headers: headersFn,
			stream
		};
	};

	const get = async <R = CodebergResponse[T][1]>(
		...params: CodebergResponse[T][0]
	): Promise<R> => {
		url = url.replace(/\[([^\]]+)\]/g, (_, key) => params.shift() || key);

		const search = new URLSearchParams(url);

		for (const [key, value] of Object.entries(queryParams)) {
			search.set(key, value);
		}

		url = decodeURIComponent(search.toString());

		const res = await fetch(url, {
			headers: {
				Authorization: AccountStore.hasKey('codeberg_access')
					? `Bearer ${await AccountStore.getKey('codeberg_access')}`
					: '',
				...headers
			}
		});

		if (res.status === 401 && !triedRegenerating) {
			triedRegenerating = true;
			await regenerateCodebergToken();

			return get(...params);
		} else if (res.status !== 200) throw res.statusText;

		return (await ((headers as _HeadersInit)['Accept'] === 'application/json'
			? res.json()
			: res.text())) as R;
	};

	const post = async <R = CodebergResponse[T][1]>(
		body: unknown,
		...params: CodebergResponse[T][0]
	) => {
		url = url.replace(/\[([^\]]+)\]/g, (_, key) => params.shift() || key);

		const search = new URLSearchParams(url);

		for (const [key, value] of Object.entries(queryParams)) {
			search.set(key, value);
		}

		url = decodeURIComponent(search.toString());

		const res = await fetch(url, {
			method: 'POST',
			headers: {
				Authorization: AccountStore.hasKey('codeberg_access')
					? `Bearer ${await AccountStore.getKey('codeberg_access')}`
					: '',
				...headers
			},
			body: JSON.stringify(body)
		});

		if (res.status === 401) {
			throw 'Unauthorized';
		} else if (!res.status.toString().startsWith('2')) throw res.statusText;

		return (await ((headers as _HeadersInit)['Accept'] === 'application/json'
			? res.json()
			: res.text())) as R;
	};

	const stream = async <R = CodebergResponse[T][1]>(
		limit: number,
		cb?: ((response: R) => void) | undefined,
		...params: CodebergResponse[T][0]
	): Promise<R> => {
		let i = 1;
		let done = false;

		const out = [];

		url = url.replace(/\[([^\]]+)\]/g, (_, key) => params.shift() || key);

		while (!done && i < limit) {
			const search = new URLSearchParams(url);

			for (const [key, value] of Object.entries(queryParams)) {
				search.set(key, value);
			}

			search.set('page', i.toString());

			const res = await fetch(decodeURIComponent(search.toString()), {
				headers: {
					Authorization: AccountStore.hasKey('codeberg_access')
						? `Bearer ${await AccountStore.getKey('codeberg_access')}`
						: '',
					...headers
				}
			});

			if (res.status === 401) {
				throw 'Unauthorized';
			} else if (res.status !== 200) throw res.statusText;

			const items = (await ((headers as _HeadersInit)['Accept'] === 'application/json'
				? res.json()
				: res.text())) as R;

			if (!items || (items as []).length === 0) {
				done = true;
			}

			out.push(...(Array.isArray(items) ? items : []));

			cb?.(out as R);

			i++;

			await sleep(1);
		}

		return out as R;
	};

	const headersFn = (newHeaders: HeadersInit) => {
		headers = newHeaders;

		return {
			get,
			post,
			query,
			stream
		};
	};

	return {
		headers: headersFn,
		get,
		post,
		query,
		stream
	};
};
