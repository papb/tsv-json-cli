import chalk = require('chalk');

export function die(message: string): never {
	console.error(chalk.red(message) + '\n');
	process.exit(1);
}
