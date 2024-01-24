/**
 * Generated by RelaGit v{{VERSION}}
 *
 * DO NOT MODIFY THIS FILE DIRECTLY
 */

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


type ParamsFromEventType<E extends action> = E extends 'commit'
	? [Repository, { message: string; description: string }]
	: E extends 'push'
		? [Repository]
		: E extends 'pull'
			? [Repository]
			: E extends 'navigate'
    			? [Repository | undefined, GitFile | undefined]
				: E extends 'remote_fetch'
					? [Repository, { name: string; url: string; type: string }[]]
					: E extends 'repository_add'
						? [string]
						: E extends 'repository_remove'
							? [string]
							: E extends 'settings_update'
								? []
								: E extends 'stash'
									? [Repository]
									: E extends 'stash_pop'
										? [Repository]
										: E extends 'all'
											? unknown[]
											: [Repository];

interface WorkflowOptions {
	name: string;
	description?: string;
	hooks?: {
		[K in action]?: (event: K, ...params: ParamsFromEventType<K>) => Promise<void> | void;
	};
}

/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore - this is a global variable
type BufferEncoding =
	| 'ascii'
	| 'utf8'
	| 'utf-8'
	| 'utf16le'
	| 'ucs2'
	| 'ucs-2'
	| 'base64'
	| 'latin1'
	| 'binary'
	| 'hex';

interface Context {
	Git: {
		ListBranches: (repository: Repository | undefined) => Promise<Branch[]>;
		Checkout: (repository: Repository | undefined, branch: string) => Promise<void>;
		CreateBranch: (repository: Repository | undefined, branch: string) => Promise<void>;
		PushWithOrigin: (repository: Repository | undefined, branch: string) => Promise<void>;
		Stash: (repository: Repository | undefined) => Promise<void>;
		ListStash: (repository: Repository | undefined) => Promise<Record<number, string[]>>;
		PopStash: (repository: Repository | undefined, stash: GitFile) => Promise<void>;
		RemoveStash: (repository: Repository | undefined, stash: GitFile) => Promise<void>;
		PreviousCommit: (repository: Repository | undefined, sha?: string) => Promise<string>;
		Show: (repository: Repository | undefined, file: string) => Promise<PastCommit | undefined>;
		ShowOrigin: (
			repository: Repository | undefined,
			file: string,
			treeish?: string,
			encoding?: BufferEncoding
		) => Promise<string | null>;
		Discard: (repository: Repository | undefined, file: GitFile) => Promise<void>;
		Content: (file: string, repository: string | undefined) => Promise<string>;
		Analyse: (repository: string | undefined, file: string) => Promise<void>;
		Status: (repository: string | undefined) => Promise<GitFile[]>;
		Commit: (
			repository: Repository,
			message: string | undefined,
			body?: string
		) => Promise<string | undefined>;
		Remote: (directory: string) => Promise<
			{
				name: string;
				url: string;
				type: string;
			}[]
		>;
		Branch: (repository: string | undefined) => Promise<string>;
		Revert: (repository: Repository | undefined, commit: string) => Promise<void>;
		Clone: (url: string, path: string) => Promise<void>;
		Blame: (
			repo: string,
			file: string
		) => Promise<
			{
				hash?: string | undefined;
				author?: string | undefined;
				date: Date;
				message?: string | undefined;
				line?: string | undefined;
			}[]
		>;
		Reset: (repository: Repository | undefined, ref: string) => Promise<void>;
		Push: (repository: Repository | undefined) => Promise<void>;
		Diff: (file: string, repository: string | undefined) => Promise<void>;
		Init: (path: string) => Promise<void>;
		Pull: (repository: Repository | undefined) => Promise<void>;
		Log: (repository: Repository) => Promise<LogCommit[]>;
	};
	Repository: Repository;
}

interface Repository {
	draft?: boolean;
	id: string;
	path: string;
	name: string;
	remote: string;
	branch: string;
	commit: string;
	ahead: number;
	behind: number;
	lastFetched?: number;
}

type GitStatus =
	| 'added'
	| 'modified'
	| 'deleted'
	| 'untracked'
	| 'unknown'
	| 'unmerged'
	| 'copied'
	| 'renamed'
	| 'type-changed';

interface PastCommit {
	hash: string;
	files: {
		filename: string;
		path: string;
		diff: {
			files: {
				path: string;
				chunks: unknown[];
				type: 'AddedFile' | 'ChangedFile' | 'DeletedFile' | 'RenamedFile';
			}[];
			type: string;
		};
		status: GitStatus;
	}[];
}

interface DraftCommit {
	files: string[];
}

interface LogCommit {
	hash: string;
	tag?: string;
	refs: string;
	from?: string;
	to?: string;
	branch?: string;
	author: string;
	date: string;
	message: string;
	files: number;
	insertions: number;
	deletions: number;
}

interface Commit {
	message: string;
	description: string;
	files: string[];
}

type Branch = {
	gitName: string;
	name: string;
	path: string;
	relativeDate: string;
	isRemote: boolean;
	hasUpstream: boolean;
};

interface GitFile {
	id: string;
	name: string;
	path: string;
	status:
		| 'added'
		| 'modified'
		| 'deleted'
		| 'untracked'
		| 'unknown'
		| 'unmerged'
		| 'copied'
		| 'renamed'
		| 'type-changed';
}

interface ThemeOptions {
	name: string;
	description?: string;
	accent?: string;
	main: string;
}

interface Themes {
	/**
	 * Construct a new theme
	 * @example
	 * import { Theme } from "relagit:themes";
	 *
	 * export default new Theme({...})
	 */
	Theme: new (options: ThemeOptions) => void;
}

interface Actions {
	/**
	 * Construct a new workflow runner
	 * @example
	 * import { Workflow } from "relagit:actions";
	 *
	 * export default new Workflow({...})
	 */
	Workflow: new (options: WorkflowOptions) => void;
	/**
	 * When run in a workflow, will return current information about the state of the application.
	 * @returns {Context}
	 */
	context: () => Context;
}

// NOTE: uncomment these to use prettier, it throws an error when it sees the exported types below
// const Workflow = () => {};
// const context = () => {};
// const Theme = () => {};

declare module 'relagit:actions' {
	const { Workflow, context }: Actions;

	export { Workflow, context };
}

declare module 'relagit:themes' {
	const { Theme }: Themes;

	export { Theme };
}
