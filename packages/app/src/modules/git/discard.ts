import FileStore, { GitFile } from '@app/stores/files';
import LocationStore from '@app/stores/location';
import { Repository } from '@app/stores/repository';

import { Git } from './core';

const path = window.Native.DANGEROUS__NODE__REQUIRE('path');
const fs = window.Native.DANGEROUS__NODE__REQUIRE('fs');

export const Discard = async (repository: Repository | undefined, file: GitFile) => {
	if (!repository || !file) {
		return;
	}

	if (
		LocationStore.selectedFile?.path == file.path &&
		LocationStore.selectedFile?.name == file.name
	) {
		LocationStore.setSelectedFile(undefined);
	}

	FileStore.removeFile(repository.path, file);

	if (file.status === 'added') {
		return fs.unlinkSync(path.join(repository.path, file.path, file.name));
	}

	const result = await Git({
		directory: repository.path,
		command: 'checkout',
		args: ['--', path.join(file.path, file.name)]
	});

	return result;
};
