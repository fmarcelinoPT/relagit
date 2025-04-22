import { GenericStore } from '.';

import { CommitStyle } from '@app/modules/commits';
import { ObjectToDotProp, ResolvePropDeep, ValidLocale } from '@app/modules/i18n';
import { RecursivePartial } from '@app/shared';

const path = window.Native.DANGEROUS__NODE__REQUIRE('path');
const fs = window.Native.DANGEROUS__NODE__REQUIRE('fs');

export const __RELAGIT_PATH__ = window.Native.RELAGIT_PATH;
export const __EXTERNAL_PATH__ = path.join(__RELAGIT_PATH__, 'external.json');
export const __REPOSITORIES_PATH__ = path.join(__RELAGIT_PATH__, 'repositories.json');
export const __SETTINGS_PATH__ = path.join(__RELAGIT_PATH__, 'settings.json');

export type Settings = {
	telemetry: {
		metrics: boolean;
	};
	commit: {
		styles: Record<string, CommitStyle>;
		enforceStyle: boolean;
		preferParens: boolean;
		annotate: boolean;
		cloneMethod: 'ssh' | 'http';
	};
	ai: {
		termsAccepted: boolean;
		api_key: string;
		provider:
			| 'none'
			| 'gpt-3.5'
			| 'gpt-4'
			| 'gpt-4o'
			| 'gemini-pro'
			| 'gemini-1.5-pro'
			| 'claude-haiku'
			| 'claude-sonnet'
			| 'claude-opus';
	};
	popout: {
		position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
		height: number;
		width: number;
		x: number;
		y: number;
	};
	onboarding: {
		dismissed: boolean;
		step: number;
	};
	ui: {
		theme: 'light' | 'dark' | 'system';
		vibrancy: string | boolean;
		expandedSettings: boolean;
		fontFamily: string;
		accentColor: string;
		thinIcons: boolean;
		userThemes: string[];
	};
	window: {
		x: number;
		y: number;
		width: number;
		height: number;
	};
	autoFetch: boolean;
	locale: ValidLocale;
	externalEditor: (typeof import('../modules/editor'))['editors'][number]['exec'] | 'custom';
	customEditor: string;
	activeRepository: string | null;
	repositories: string[];
};

// we need to add commit.styles because `ObjectToDotProp` will only include `commit.styles.${string}`
export type SettingsKey =
	| ObjectToDotProp<Settings>
	| 'commit.styles'
	| 'commit'
	| 'ui'
	| 'onboarding';

const validatePath = () => {
	if (!fs.existsSync(__RELAGIT_PATH__)) {
		fs.mkdirSync(__RELAGIT_PATH__);
	}

	if (!fs.existsSync(__SETTINGS_PATH__)) {
		fs.writeFileSync(__SETTINGS_PATH__, '{}');
	}

	if (!fs.existsSync(__REPOSITORIES_PATH__)) {
		fs.writeFileSync(__REPOSITORIES_PATH__, '[]');
	}

	if (!fs.existsSync(__EXTERNAL_PATH__)) {
		fs.writeFileSync(__EXTERNAL_PATH__, '[]');
	}
};

const SettingsStore = new (class SettingsStore extends GenericStore {
	#record: RecursivePartial<Settings> = {};
	#emitDebounce: NodeJS.Timeout | null = null;

	emit() {
		if (this.#emitDebounce) return;

		this.#emitDebounce = setTimeout(() => {
			this.#emitDebounce = null;

			super.emit();
		}, 2000);

		super.emit();
	}

	constructor() {
		super();

		validatePath();

		this.load();

		window.Native.listeners.WATCHER.add(__SETTINGS_PATH__, () => {
			this.load();

			this.emit();
		});
	}

	get settings() {
		return this.#record;
	}

	getSetting<T extends SettingsKey>(key: T): ResolvePropDeep<Settings, T> {
		const parts = key.split('.');

		let current: string | object = this.#record;

		for (const path of parts) {
			current = (current as Record<string, string>)[path];

			if (!current) break;
		}

		return current as ResolvePropDeep<Settings, T>;
	}

	setSetting<T extends SettingsKey>(key: T, value: ResolvePropDeep<Settings, T>) {
		const parts = key.split('.');

		let current: string | object = this.#record;

		for (const part of parts.slice(0, -1)) {
			if (!(current as Record<string, object>)[part]) {
				(current as Record<string, object>)[part] = {};
			}

			current = (current as Record<string, object>)[part];
		}

		(current as Record<string, unknown>)[parts[parts.length - 1]] = value;

		this.save();
		this.emit();

		window._triggerWorkflow('settings_update');
	}

	save() {
		const settings = structuredClone(this.#record);
		delete settings.repositories;

		fs.writeFileSync(__SETTINGS_PATH__, JSON.stringify(settings, null, 4));

		const repositories = this.getSetting('repositories');

		fs.writeFileSync(__REPOSITORIES_PATH__, JSON.stringify(repositories, null, 4));
	}

	load() {
		if (fs.existsSync(__SETTINGS_PATH__)) {
			let settings: RecursivePartial<Settings> = {};

			let json = fs.readFileSync(__SETTINGS_PATH__, 'utf-8');

			if (!json || !json.length) return;

			try {
				json = json.replace(/(?<! )}\s?}$/, '}'); // attempt to recover from corrupt settings file
			} catch (error) {}

			try {
				settings = JSON.parse(json) as Settings;

				for (const [key, value] of Object.entries(settings)) {
					(this.#record as Record<string, unknown>)[key] = value;
				}

				if (!(this.#record as Record<string, unknown>)['theme']) {
					(this.#record as Record<string, unknown>)['theme'] = 'system';
				}
			} catch (error) {
				window._showErrorModal(error, 'error.corruptSettings');
			}
		}

		if (fs.existsSync(__REPOSITORIES_PATH__)) {
			const json = fs.readFileSync(__REPOSITORIES_PATH__, 'utf-8');

			if (!json || !json.length) return;

			try {
				let repositories: string[] = [];

				repositories = JSON.parse(json) as string[];

				this.#record.repositories = repositories;
			} catch (error) {
				window._showErrorModal(error, 'error.corruptSettings');
			}
		}
	}
})();

export default SettingsStore;
