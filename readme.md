# tsv-json-cli [![Build Status](https://travis-ci.com/papb/tsv-json-cli.svg?branch=master)](https://travis-ci.com/papb/tsv-json-cli)

> Convert between TSV and JSON (`string[][]`)


## Install

```
$ npm install --global tsv-json
```


## Usage

This CLI module provides two commands: `json2tsv` and `tsv2json`, which receive one or more paths (of files or folders) to process and convert. Folders are expanded into the `.tsv` or `.json` files they contain (not recursive). The conversion result for each file will be stored in a new file with the extra `.json` or `.tsv` extension.

### Example

```
current-folder
├── foo.json
├── whatever.txt
└── bar.tsv
```

* Calling `tsv2json .` in this situation is equivalent to calling `tsv2json bar.tsv` and will generate a file `bar.tsv.json` with the contents of `bar.tsv` converted to a JSON 2d-string-array.

* Calling `json2tsv .` in this situation is equivalent to calling `json2tsv foo.json` and will generate a file `foo.json.tsv` with the contents of `foo.json` converted to a TSV string.

### Notes

* The following flags are available:

  * `--help`: Show usage
  * `--version`: Show CLI version
  * `--force`: Allow overwriting files for the output

* Helpful errors messages are provided in case of problems (and the process will exit with code 1).

* No file will be overwritten unless the `--force` option is provided. For example, if you call `tsv2json .` twice in this example, the second call will fail as follows:

  ```
  [FAIL] bar.tsv: Refusing to overwrite "bar.tsv.json". Run with --force to overwrite.
  ```

* If multiple files are being processed, problems processing each file will be reported separately, and one failure does not prevent the other files to be processed. The output of the CLI will show which files worked fine and which ones had problems. The CLI will exit with status code 1 if there was one or more problems.


## Related

* [tsv-json](https://github.com/papb/tsv-json) - API for this module


## License

MIT © [Pedro Augusto de Paula Barbosa](https://github.com/papb)
