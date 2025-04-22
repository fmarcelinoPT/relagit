import def from '@content/modules/actions/def.d.ts';
import { Grammar } from '@wooorm/starry-night';
import { RequireIdentifier } from '~/main/src/types';

import NotificationStore from '@app/stores/notification';
import { type IconName } from '@app/ui/Common/Icon';
import { addExtensions } from '@app/ui/Menu';
import { NotificationProps } from '@app/ui/Notification';
import * as Git from '@modules/git';
import { error } from '@modules/logger';
import LocationStore from '@stores/location';
import RepositoryStore, { type Repository } from '@stores/repository';
import { __RELAGIT_PATH__ } from '@stores/settings';

import pkj from '../../../../../package.json';
import { highlighter } from '../highlighter';
import { registerSettingsPane } from './app';
import { getExternalWorkflows } from './external';
import { getOptionsProxy } from './settings';

const sucrase = window.Native.DANGEROUS__NODE__REQUIRE('sucrase');
const path = window.Native.DANGEROUS__NODE__REQUIRE('path');
const fs = window.Native.DANGEROUS__NODE__REQUIRE('fs');

type action =
	| 'navigate'
	| 'all'
	| 'commit'
	| 'pull'
	| 'push'
	| 'repository_add'
	| 'repository_remove'
	| 'remote_fetch'
	| 'settings_update'
	| 'stash'
	| 'stash_pop';

const defFile = def.replace('{{VERSION}}', pkj.version);

export const iconFromAction = (act: action | action[]): IconName => {
	switch (Array.isArray(act) ? act[0] : act) {
		case 'all':
			return 'key-asterisk';
		case 'navigate':
			return 'arrow-right';
		case 'commit':
			return 'git-commit';
		case 'push':
			return 'arrow-up';
		case 'pull':
			return 'arrow-down';
		case 'repository_add':
			return 'plus';
		case 'repository_remove':
			return 'trash';
		case 'settings_update':
			return 'gear';
		case 'remote_fetch':
			return 'cloud';
		case 'stash':
			return 'archive';
		case 'stash_pop':
			return 'archive';
		default:
			return 'circle';
	}
};

type OptionTypes = 'string' | 'number' | 'boolean' | 'enum';

export interface WorkflowOptions {
	filename: string;
	id?: string;
	name: string;
	description?: string;
	hooks?: {
		[K in action]?: (
			event: K | action,
			...params: ParamsFromEventType<K>
		) => Promise<void> | void;
	};
	options?: {
		[key: string]: {
			type: OptionTypes;
			description: string;
			values?: string[];
			placeholder?: string;
		};
	};
}

export interface Theme {
	name: string;
	description?: string;
	accent?: string;
	main: string;
	authors: {
		name: string;
		url: string;
	}[];
}

export const __WORKFLOWS_PATH__ = path.join(__RELAGIT_PATH__, 'workflows');

if (!fs.existsSync(__RELAGIT_PATH__)) {
	fs.mkdirSync(__RELAGIT_PATH__);
}

if (
	!fs.existsSync(path.join(__RELAGIT_PATH__, 'index.d.ts')) ||
	defFile !== fs.readFileSync(path.join(__RELAGIT_PATH__, 'index.d.ts'), 'utf8')
) {
	fs.promises.writeFile(path.join(__RELAGIT_PATH__, 'index.d.ts'), defFile);
}

if (!fs.existsSync(path.join(__RELAGIT_PATH__, 'global.d.ts'))) {
	fs.promises.writeFile(
		path.join(__RELAGIT_PATH__, 'global.d.ts'),
		`export {};

declare global {
	const options: any;
}`
	);
}

export const extnames = (str: string) => {
	const extenstions = str.split('.');
	extenstions.shift();

	return `${extenstions.join('.')}`;
};

export const require = (id: string) => {
	if (id.startsWith('relagit')) {
		const submodule = id.split(':')[1];

		switch (submodule) {
			case 'themes':
				return {
					Theme: class _Theme {
						name: string;
						description?: string;
						accent?: string;
						main: string;
						authors: {
							name: string;
							url: string;
						}[];

						constructor(options: Theme) {
							this.name = options.name;
							this.description = options.description;
							this.accent = options.accent;
							this.main = options.main;
							this.authors = options.authors;
						}
					}
				};
			case 'actions':
				return {
					Workflow: class _Workflow {
						name: string;
						description?: string;
						hooks?: {
							[K in action]?: (
								event: K,
								...params: ParamsFromEventType<K>
							) => Promise<void> | void;
						};
						options?: {
							[key: string]: {
								type: OptionTypes;
								description: string;
								values?: string[];
								placeholder?: string;
							};
						};
						id?: string;

						constructor(options: WorkflowOptions) {
							this.name = options.name;
							this.description = options.description;
							this.hooks = options.hooks;
							this.options = options.options;
							this.id = options.id;
						}
					},
					defineWorkflow: (workflow: WorkflowOptions) => {
						return workflow;
					},
					context: getContext,
					notifications: {
						show: (props: NotificationProps): number => {
							return NotificationStore.add(props);
						},
						hide: (id: number) => {
							NotificationStore.remove(id);
						}
					},
					codeview: {
						registerGrammar: (grammar: Grammar | Grammar[]) => {
							if (!highlighter) {
								throw new Error(
									'Highlighter not initialized, try again in a few ms'
								);
							}

							highlighter.register(Array.isArray(grammar) ? grammar : [grammar]);
						},
						onceLoaded: (cb: () => void) => {
							const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

							let timeedOut = false;

							const check = async (): Promise<void> => {
								if (timeedOut) {
									throw new Error('Highlighter did not load in time');
								}

								if (!highlighter) {
									await sleep(10);
									return check();
								}

								cb();
							};

							setTimeout(() => {
								timeedOut = true;
							}, 100);

							return check();
						}
					},
					app: {
						registerSettingsPane,
						getInstalledWorkflows: () => {
							return Array.from(workflows);
						}
					},
					menu: {
						extend: addExtensions
					},
					cron
				};
			case 'client':
				return {};
		}

		return null;
	}

	return window.Native.DANGEROUS__NODE__REQUIRE(id as RequireIdentifier);
};

export const loadWorkflows = async () => {
	if (!fs.existsSync(__WORKFLOWS_PATH__)) {
		fs.mkdirSync(__WORKFLOWS_PATH__);
	}
	const externalWorkflows = getExternalWorkflows();

	const _workflows: {
		native?: string;
		plugin: string;
	}[] = externalWorkflows;

	const files = await fs.promises.readdir(__WORKFLOWS_PATH__);

	for (const file of files) {
		if (file.endsWith('.d.ts')) continue;
		if (!file.endsWith('.js') && !file.endsWith('.ts')) continue;

		if (_workflows.find((workflow) => workflow.plugin === file || workflow.native === file))
			continue;

		if (file.includes('.native.')) {
			if (files.includes(file.replace('.native.', '.'))) {
				_workflows.push({
					native: file,
					plugin: file.replace('.native.', '.')
				});
			}
		} else {
			if (files.includes(file.replace('.', '.native.'))) {
				_workflows.push({
					native: file.replace('.', '.native.'),
					plugin: file
				});
			}

			_workflows.push({
				plugin: file
			});
		}
	}

	for (const workflow of _workflows) {
		try {
			const data = await fs.promises.readFile(
				path.resolve(__WORKFLOWS_PATH__, workflow.plugin),
				'utf8'
			);

			let nativeValue = '';

			if (workflow.native) {
				nativeValue = await window.Native.listeners.LOAD_NATIVE_SCRIPT(
					sucrase
						.transform(
							await fs.promises.readFile(
								path.resolve(__WORKFLOWS_PATH__, workflow.native),
								'utf8'
							),
							{
								transforms: ['typescript', 'imports']
							}
						)
						.code.replaceAll(');, ', '); ') + // wtf sucrase
						'\n\nreturn exports.default || Object.keys(exports).length ? exports : module.exports || null;',
					workflow.native
				);
			}

			const fn = new Function(
				'require',
				'exports',
				'module',
				'console',
				'native',
				'options',
				sucrase
					.transform(data, {
						transforms: ['typescript', 'imports']
					})
					.code.replaceAll(');, ', '); ') + // wtf sucrase
					'\n\nreturn exports.default || Object.keys(exports).length ? exports : module.exports || null;'
			);

			const res = fn(
				require,
				{},
				{},
				makeConsole(path.basename(workflow.plugin)),
				window[nativeValue as keyof typeof window], // only way to pass functions around
				getOptionsProxy(workflow.plugin)
			);

			workflows.add({ ...(res.default || res), filename: workflow.plugin });
		} catch (e) {
			error('Failed to load workflow', e);
		}
	}
};

export const workflows = new Set<WorkflowOptions>();

type ParamsFromEventType<E extends action> =
	E extends 'commit' ? [Repository, { message: string; description: string }]
	: E extends 'push' ? [Repository]
	: E extends 'pull' ? [Repository]
	: E extends 'navigate' ? [Repository | undefined, GitFile | undefined]
	: E extends 'remote_fetch' ? [Repository, { name: string; url: string; type: string }[]]
	: E extends 'repository_add' ? [string]
	: E extends 'repository_remove' ? [string]
	: E extends 'settings_update' ? []
	: E extends 'stash' ? [Repository]
	: E extends 'stash_pop' ? [Repository]
	: E extends 'all' ? unknown[]
	: [Repository];

export const triggerWorkflow = async <E extends action>(
	event: E,
	...params: ParamsFromEventType<E>
) => {
	for (const workflow of workflows) {
		if (workflow.hooks?.[event]) {
			try {
				await workflow.hooks[event]!(event, ...params);
			} catch (e) {
				error(`Failed to trigger workflow "${workflow.name}"`, e);
			}
		}

		if (workflow.hooks?.all) {
			try {
				await workflow.hooks.all(event, ...params);
			} catch (e) {
				error(`Failed to trigger workflow "${workflow.name}"`, e);
			}
		}
	}
};

window._triggerWorkflow = triggerWorkflow;

const makeContext = (location: string | undefined) => {
	if (!location) return null;

	const context = {
		Git,
		Repository: {
			path: location,
			...(RepositoryStore.getByPath(location) ?? {})
		}
	};

	return context;
};

export const getContext = () => {
	return makeContext(LocationStore.selectedRepository?.path);
};

export const makeConsole = (prefix: string) => {
	return {
		log: (...args: unknown[]) => {
			console.log(`%c[${prefix}]`, 'color: #7AA2F7', ...args);
		},
		info: (...args: unknown[]) => {
			console.log(`%c[${prefix}]`, 'color: #7AA2F7', ...args);
		},
		warn: (...args: unknown[]) => {
			console.log(`%c[${prefix}]`, 'color: #e5c062', ...args);
		},
		error: (...args: unknown[]) => {
			console.log(`%c[${prefix}]`, 'color: #e56269', ...args);
		}
	};
};

interface CronStringsArray
	extends ReadonlyArray<`${number} ${'minute' | 'hour' | 'day' | 'month'}${'s' | ''}`> {
	readonly raw: readonly string[];
}

/**
 * A utility to generate CRON timings.
 * @param time - Either a CRON string `'*\/5 * * * * *'` or a template string `'5 minutes'` or a number `5`.
 * @returns - If a CRON or template string is passed, it returns a number. If a number is passed, it returns an object with the time in minutes, hours, days, months and years.
 * @example
 * cron`5 minutes` // returns 5
 * cron`*\/5 * * * * *` // returns 5
 */
const cron = <T extends CronStringsArray | number>(
	time: T
): T extends number ?
	{
		[unit in 'minutes' | 'hours' | 'days' | 'months']: number;
	}
:	number => {
	if (typeof time === 'number') {
		return {
			minutes: time * 60 * 1000,
			hours: time * 60 * 60 * 1000,
			days: time * 24 * 60 * 60 * 1000,
			months: time * 30 * 24 * 60 * 60 * 1000
		} as ReturnType<typeof cron<T>>;
	}

	const units = ['minute', 'hour', 'day', 'month'];

	const [value, unit] = time[0].split(' ');

	if (!units.includes(unit.replace(/s$/, ''))) {
		throw new Error('Invalid unit');
	}

	switch (unit.replace(/s$/, '')) {
		case 'minute':
			return (parseInt(value, 10) * 60 * 1000) as unknown as ReturnType<typeof cron<T>>;
		case 'hour':
			return (parseInt(value, 10) * 60 * 60 * 1000) as unknown as ReturnType<typeof cron<T>>;
		case 'day':
			return (parseInt(value, 10) * 24 * 60 * 60 * 1000) as unknown as ReturnType<
				typeof cron<T>
			>;
		case 'month':
			return (parseInt(value, 10) * 30 * 24 * 60 * 60 * 1000) as unknown as ReturnType<
				typeof cron<T>
			>;
	}

	throw new Error('Invalid input');
};

cron.schedule = (
	time: number,
	cb: () => void | Promise<void>,
	proxy: ReturnType<typeof getOptionsProxy>
) => {
	const now = Date.now();
	const lastRun = (proxy.__cronLastRun as number | undefined) || now;

	if (now - lastRun >= time) {
		cb();

		proxy.__cronLastRun = now;
	}

	if (!proxy.__cronLastRun) {
		proxy.__cronLastRun = now;
	}

	const timeout = setTimeout(() => cron.schedule(time, cb, proxy), time - (now - lastRun));

	return () => {
		clearTimeout(timeout);
	};
};
