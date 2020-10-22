import meow = require('meow');
import ensureError = require('ensure-error');
import chalk = require('chalk');
import jetpack = require('fs-jetpack');
import { basename as pathBasename } from 'path';
import { die } from './die';
import { expandToFiles } from './expand-to-files';
import { safeWrite } from './safe-write';
import { json2tsv, tsv2json } from 'tsv-json';

function _runCli(command: 'json2tsv' | 'tsv2json'): never {
	const sourceExtension = command === 'json2tsv' ? '.json' : '.tsv';
	const targetExtension = command === 'json2tsv' ? '.tsv' : '.json';

	const cli = meow(`
		Usage
		  $ ${command} path [morePaths...]

		Options
		  --help     Show this message and exit
		  --version  Show version
		  --force    Allow overwriting files on output

		Examples
		  $ ${command} .
		  $ ${command} foo${sourceExtension}
		  $ ${command} foo${sourceExtension} --force
	`, {
		flags: {
			force: {
				type: 'boolean',
				default: false
			}
		}
	});

	console.log();

	if (cli.input.length === 0) {
		die('Expected at least 1 argument.');
	}

	const filePaths = expandToFiles(cli.input, sourceExtension);
	const { force } = cli.flags;

	if (filePaths.length === 0) {
		die(`No ${sourceExtension} files found.`);
	}

	function workOnExistingFile(path: string): void {
		const contents = jetpack.read(path)!;
		let result: string;

		if (command === 'json2tsv') {
			let parsed: unknown;
			try {
				parsed = JSON.parse(contents);
			} catch {
				throw new Error('Invalid JSON file.');
			}

			result = json2tsv(parsed);
		} else {
			result = JSON.stringify(tsv2json(contents), undefined, '\t');
		}

		safeWrite(`${path}${targetExtension}`, result, force);
	}

	let absoluteSuccess = true;

	for (const path of filePaths) {
		const name = pathBasename(path);
		try {
			workOnExistingFile(path);
			console.log(chalk`{green [ OK ]} {blue ${name}} -> {green ${name}${targetExtension}}`);
		} catch (error: unknown) {
			absoluteSuccess = false;
			console.log(chalk`{red [FAIL]} {blue ${name}}: {red ${ensureError(error).message}}`);
		}
	}

	process.exit(absoluteSuccess ? 0 : 1);
}

export function runCli(command: 'json2tsv' | 'tsv2json'): never {
	try {
		_runCli(command);
	} catch (error: unknown) {
		die(ensureError(error).message);
	}
}
