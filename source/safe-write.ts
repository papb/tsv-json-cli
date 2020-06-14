import jetpack = require('fs-jetpack');
import { basename as pathBasename } from 'path';

export function safeWrite(filePath: string, contents: string, overwrite: boolean): void {
	const newFileExistence = jetpack.exists(filePath);
	if (newFileExistence === 'dir') {
		throw new Error(`Cannot create "${pathBasename(filePath)}": already exists (directory!)`);
	}

	if (!overwrite && newFileExistence === 'file') {
		throw new Error(`Refusing to overwrite "${pathBasename(filePath)}". Run with --force to overwrite.`);
	}

	jetpack.write(filePath, contents);
}
