import test from 'ava';
import { getBinPathSync } from 'get-bin-path';
import tempy = require('tempy');
import jetpack = require('fs-jetpack');
import execa = require('execa');

const json2tsvPath = getBinPathSync({ name: 'json2tsv' });
const tsv2jsonPath = getBinPathSync({ name: 'tsv2json' });

const json = [
	['foo', 'bar'],
	['baz', 'qux']
];
const unquotedTsv = 'foo\tbar\nbaz\tqux';
const quotedTsv = '"foo"\t"bar"\n"baz"\t"qux"';

test('json2tsv', async t => {
	const dir = jetpack.cwd(tempy.directory());
	dir.write('foo.json', json);
	const result = await execa.node(json2tsvPath, ['foo.json'], { cwd: dir.cwd() });
	t.is(result.exitCode, 0);
	t.is(dir.exists('foo.json.tsv'), 'file');
	t.is(dir.read('foo.json.tsv'), quotedTsv);
});

test('json2tsv --force works correctly', async t => {
	const dir = jetpack.cwd(tempy.directory());
	dir.write('foo.json', json);
	dir.write('foo.json.tsv', 'whatever');
	const childProcessPromise = execa.node(json2tsvPath, ['foo.json'], { cwd: dir.cwd() });

	try {
		await childProcessPromise;
		t.fail('Should have thrown.');
	} catch {
		t.is(childProcessPromise.exitCode, 1);
		t.is(dir.read('foo.json.tsv'), 'whatever');
	}

	const result = await execa.node(json2tsvPath, ['foo.json', '--force'], { cwd: dir.cwd() });
	t.is(result.exitCode, 0);
	t.is(dir.read('foo.json.tsv'), quotedTsv);
});

test('json2tsv throws on invalid input', async t => {
	const dir = jetpack.cwd(tempy.directory());
	dir.write('foo.json', 'This is definitely not valid json.');
	const childProcessPromise = execa.node(json2tsvPath, ['foo.json'], { cwd: dir.cwd() });

	try {
		await childProcessPromise;
		t.fail('Should have thrown.');
	} catch {
		t.is(childProcessPromise.exitCode, 1);
		t.is(dir.exists('foo.json.tsv'), false);
	}
});

test('tsv2json', async t => {
	const dir = jetpack.cwd(tempy.directory());
	dir.write('unquoted.tsv', unquotedTsv);
	dir.write('quoted.tsv', quotedTsv);
	const result = await execa.node(tsv2jsonPath, ['.'], { cwd: dir.cwd() });
	t.is(result.exitCode, 0);
	t.is(dir.exists('unquoted.tsv.json'), 'file');
	t.is(dir.exists('quoted.tsv.json'), 'file');
	t.deepEqual(JSON.parse(dir.read('unquoted.tsv.json')), json);
	t.deepEqual(JSON.parse(dir.read('quoted.tsv.json')), json);
});
