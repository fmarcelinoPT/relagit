import { For, Show, createSignal } from 'solid-js';

import RepositoryStore, { IRepository } from '@app/stores/repository';
import { createStoreListener } from '@stores/index';
import { ILogCommit } from '@app/modules/git/log';
import LocationStore from '@stores/location';
import { t } from '@app/modules/i18n';
import * as logger from '@modules/logger';
import FileStore from '@stores/files';
import * as Git from '@modules/git';

import EmptyState from '@ui/Common/EmptyState';
import { showErrorModal } from '../Modal';
import Header from '@ui/Sidebar/Header';
import Item from '@ui/Sidebar/Item';
import Commit from './Commit';
import Footer from './Footer';

import './index.scss';

export interface ISidebarProps {
	sidebar: boolean;
}

export default (props: ISidebarProps) => {
	const files = createStoreListener([FileStore, LocationStore], () =>
		FileStore.getByRepositoryPath(LocationStore.selectedRepository?.path)
	);
	const historyOpen = createStoreListener([LocationStore], () => LocationStore.historyOpen);
	const [commits, setCommits] = createSignal<ILogCommit[]>([]);

	let lastRepository: IRepository | undefined;

	createStoreListener([RepositoryStore, LocationStore], async () => {
		if (!LocationStore.selectedRepository) return;

		setCommits(await Git.Log(LocationStore.selectedRepository));

		try {
			if (lastRepository === LocationStore.selectedRepository) return;

			lastRepository = LocationStore.selectedRepository;
		} catch (error) {
			showErrorModal(error, 'error.fetching');

			logger.error(error);
		}
	});

	return (
		<div
			classList={{ sidebar: true, 'sidebar-active': props.sidebar }}
			aria-role="sidebar"
			aria-hidden={props.sidebar}
		>
			<Header />
			<Show when={historyOpen()}>
				<div class="sidebar__commits">
					<Show
						when={commits()?.length}
						fallback={<EmptyState hint={t('sidebar.noCommits')} />}
					>
						<For each={commits()}>
							{(commit) => {
								return <Commit {...commit} />;
							}}
						</For>
					</Show>
				</div>
			</Show>
			<Show when={!historyOpen()}>
				<div class="sidebar__items">
					<Show
						when={files()?.length}
						fallback={<EmptyState hint={t('sidebar.upToDate')} />}
					>
						<For each={files()}>
							{(file) => {
								if (file.status === 'untracked') return null;

								return <Item {...file} />;
							}}
						</For>
					</Show>
				</div>
			</Show>
			<Show when={!historyOpen()}>
				<Footer />
			</Show>
		</div>
	);
};
