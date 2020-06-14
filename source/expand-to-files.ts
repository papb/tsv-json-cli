import jetpack = require('fs-jetpack');

export function expandToFiles(paths: string[], dirExpansionRequiredExtension?: string): string[] {
	const filePaths: string[] = [];

	for (const path of paths) {
		if (jetpack.exists(path) === 'file') {
			filePaths.push(jetpack.path(path));
		} else if (jetpack.exists(path) === 'dir') {
			for (const childName of jetpack.list(path)) {
				const childPath = jetpack.path(path, childName);
				const extensionValid = dirExpansionRequiredExtension ? childName.endsWith(dirExpansionRequiredExtension) : true;
				if (extensionValid && jetpack.exists(childPath) === 'file') {
					filePaths.push(childPath);
				}
			}
		} else if (jetpack.exists(path) === 'other') {
			throw new Error(`A symbolic link is not a valid input ("${path}").`);
		} else {
			throw new Error(`Unable to find "${path}" file/folder.`);
		}
	}

	return filePaths;
}
