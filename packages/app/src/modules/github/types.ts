export interface GitHubRepository {
	id: number;
	node_id: string;
	name: string;
	full_name: string;
	private: boolean;
	owner: GithubUser;
	html_url: string;
	description: string;
	fork: boolean;
	url: string;
	forks_url: string;
	keys_url: string;
	collaborators_url: string;
	teams_url: string;
	hooks_url: string;
	issue_events_url: string;
	events_url: string;
	assignees_url: string;
	branches_url: string;
	tags_url: string;
	blobs_url: string;
	git_tags_url: string;
	git_refs_url: string;
	trees_url: string;
	statuses_url: string;
	languages_url: string;
	stargazers_url: string;
	contributors_url: string;
	subscribers_url: string;
	subscription_url: string;
	commits_url: string;
	git_commits_url: string;
	comments_url: string;
	issue_comment_url: string;
	contents_url: string;
	compare_url: string;
	merges_url: string;
	archive_url: string;
	downloads_url: string;
	issues_url: string;
	pulls_url: string;
	milestones_url: string;
	notifications_url: string;
	labels_url: string;
	releases_url: string;
	deployments_url: string;
	created_at: string;
	updated_at: string;
	pushed_at: string;
	git_url: string;
	ssh_url: string;
	clone_url: string;
	svn_url: string;
	homepage: string;
	size: number;
	stargazers_count: number;
	watchers_count: number;
	language: string;
	has_issues: boolean;
	has_projects: boolean;
	has_downloads: boolean;
	has_wiki: boolean;
	has_pages: boolean;
	has_discussions: boolean;
	forks_count: number;
	mirror_url: string | null;
	archived: boolean;
	disabled: boolean;
	open_issues_count: number;
	license: {
		key: string;
		name: string;
		spdx_id: string;
		url: string;
		node_id: string;
	};
	allow_forking: boolean;
	is_template: boolean;
	web_commit_signoff_required: boolean;
	topics: string[];
	visibility: string;
	forks: number;
	open_issues: number;
	watchers: number;
	default_branch: string;
}

export interface GitHubReadme {
	name: string;
	path: string;
	sha: string;
	size: number;
	url: string;
	html_url: string;
	git_url: string;
	download_url: string;
	type: 'file';
	content: string;
	encoding: 'base64' | 'utf-8';
	_links: {
		self: string;
		git: string;
		html: string;
	};
}

export interface GithubUser {
	login: string;
	id: number;
	node_id: string;
	avatar_url: string;
	gravatar_id: string;
	url: string;
	html_url: string;
	followers_url: string;
	following_url: string;
	gists_url: string;
	starred_url: string;
	subscriptions_url: string;
	organizations_url: string;
	repos_url: string;
	events_url: string;
	received_events_url: string;
	type: string;
	site_admin: boolean;
	name: string;
	company: string;
	blog: string;
	location: string;
	email: string | null;
	hireable: boolean | null;
	bio: string;
	twitter_username: string | null;
	public_repos: number;
	public_gists: number;
	followers: number;
	following: number;
	created_at: string;
	updated_at: string;
}

export interface GithubOrg {
	login: string;
	id: number;
	node_id: string;
	url: string;
	repos_url: string;
	events_url: string;
	hooks_url: string;
	issues_url: string;
	members_url: string;
	public_members_url: string;
	avatar_url: string;
	description: string;
	name: string;
	company: string | null;
	blog: string;
	location: string | null;
	email: string;
	twitter_username: string | null;
	is_verified: boolean;
	has_organization_projects: boolean;
	has_repository_projects: boolean;
	public_repos: number;
	public_gists: number;
	followers: number;
	following: number;
	html_url: string;
	created_at: string;
	updated_at: string;
	archived_at: string | null;
	type: string;
}

export interface GitHubActionRuns {
	total_count: number;
	workflow_runs: {
		id: number;
		node_id: string;
		head_branch: string;
		head_sha: string;
		run_number: number;
		event: string;
		status: string;
		conclusion: string;
		url: string;
		html_url: string;
		created_at: string;
		updated_at: string;
		jobs_url: string;
		logs_url: string;
		check_suite_url: string;
		artifacts_url: string;
		cancel_url: string;
		retry_url: string;
		workflow_url: string;
		actor: GithubUser;
		head_commit: {
			id: string;
			tree_id: string;
			message: string;
			timestamp: string;
			author: GithubUser;
			committer: GithubUser;
		};
		head_repository: GitHubRepository;
	}[];
}

export interface GithubRelease {
	url: string;
	assets_url: string;
	upload_url: string;
	html_url: string;
	id: number;
	author: GithubUser;
	node_id: string;
	tag_name: string;
	target_commitish: string;
	name: string;
	draft: boolean;
	prerelease: boolean;
	created_at: string;
	published_at: string;
	assets: {
		url: string;
		id: number;
		node_id: string;
		name: string;
		label: string;
		uploader: GithubUser;
		content_type: string;
		state: string;
		size: number;
		download_count: number;
		created_at: string;
		updated_at: string;
		browser_download_url: string;
	}[];
	tarball_url: string;
	zipball_url: string;
	body: string;
}

export interface GitHubIssue {
	url: string;
	repository_url: string;
	labels_url: string;
	comments_url: string;
	events_url: string;
	html_url: string;
	id: number;
	node_id: string;
	number: number;
	title: string;
	user: GithubUser;
	labels: {
		id: number;
		node_id: string;
		url: string;
		name: string;
		color: string;
		default: boolean;
		description: string;
	}[];
	state: string;
	locked: boolean;
	assignee: GithubUser;
	assignees: GithubUser[];
	milestone: unknown;
	created_at: string;
	updated_at: string;
	closed_at: string | null;
	author_association: string;
	active_lock_reason: string | null;
	body: string;
	reactions: {
		url: string;
		total_count: number;
		'+1': number;
		'-1': number;
		laugh: number;
		hooray: number;
		confused: number;
		heart: number;
		rocket: number;
		eyes: number;
	};
	timeline_url: string;
	performed_via_github_app: boolean;
	state_reason: string | null;
}

export interface GitHubPullRequest {
	url: string;
	id: number;
	node_id: string;
	html_url: string;
	diff_url: string;
	patch_url: string;
	issue_url: string;
	number: number;
	state: string;
	locked: boolean;
	title: string;
	user: {
		login: string;
		id: number;
		node_id: string;
		avatar_url: string;
		gravatar_id: string;
		url: string;
		html_url: string;
		followers_url: string;
		following_url: string;
		gists_url: string;
		starred_url: string;
		subscriptions_url: string;
		organizations_url: string;
		repos_url: string;
		events_url: string;
		received_events_url: string;
		type: string;
		site_admin: boolean;
	};
	body: string;
	created_at: string;
	updated_at: string;
	closed_at: string | null;
	merged_at: string | null;
	merge_commit_sha: string;
	assignee: GithubUser | null;
	assignees: GithubUser[] | null;
	requested_reviewers: GithubUser[];
	labels: {
		id: number;
		node_id: string;
		url: string;
		name: string;
		color: string;
		default: boolean;
		description: string;
	}[];
	milestone: unknown;
	draft: boolean;
	commits_url: string;
	review_comments_url: string;
	review_comment_url: string;
	comments_url: string;
	statuses_url: string;
	head: {
		label: string;
		ref: string;
		sha: string;
		user: GithubUser;
		repo: GitHubRepository;
	};
	base: {
		label: string;
		ref: string;
		sha: string;
		user: GithubUser;
		repo: GitHubRepository;
	};
	_links: {
		self: {
			href: string;
		};
		html: {
			href: string;
		};
		issue: {
			href: string;
		};
		comments: {
			href: string;
		};
		review_comments: {
			href: string;
		};
		review_comment: {
			href: string;
		};
		commits: {
			href: string;
		};
		statuses: {
			href: string;
		};
	};
	author_association: string;
	auto_merge: string | null;
	active_lock_reason: string | null;
}

export interface GithubResponse {
	'repos/:username/:repo/actions/runs': [[string, string], GitHubActionRuns];
	'repos/:username/:repo/readme': [[string, string], GitHubReadme];
	'repos/:username/:repo/issues': [[string, string, string], GitHubIssue[]];
	'repos/:username/:repo/pulls': [[string, string, string], GitHubPullRequest[]];
	'users/:username/repos': [[string], GitHubRepository[]];
	'users/:username': [[string], GithubUser];
	'user/orgs': [[], GithubOrg[]];
	'user/repos': [[], GitHubRepository[]];
	'orgs/:org/repos': [[string], GitHubRepository[]];
	user: [[], GithubUser];
}
