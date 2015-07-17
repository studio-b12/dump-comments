const {resolve} = require('path');
const {execFile} = require('child_process');

const tape = require('tape-catch');
const test = require('1-liners/test');
const plus = require('1-liners/plus');
const curry = require('1-liners/curry');

const title = curry(plus)('The CLI program:  ');
const getComments = resolve(__dirname, '../../module/bin/get-comments.js');
const $getComments = curry(execFile)(getComments);
const cwd = resolve(__dirname, '../mock-cwd');

tape(title('Prints usage'), (is) => {
  is.plan(8);

  $getComments([], (error, _, stderr) => {
    is.equal(error && error.code, 1,
      '`get-comments` fails…'
    );

    is.ok(
      test(stderr, /^usage:/i),
      '…and prints usage to stderr'
    );
  });

  $getComments(['--invalid', '--options', 'one.js'], {cwd},
    (error, _, stderr) => {
      is.equal(error && error.code, 1,
        '`get-comments --invalid --options one.js` fails…'
      );

      is.ok(
        test(stderr, /^usage:/i),
        '…and prints usage to stderr'
      );
    }
  );

  $getComments(['-h'], (error, stdout) => {
    is.equal(error, null,
      '`get-comments -h` succeeds…'
    );

    is.ok(
      test(stdout, /^usage:/i),
      '…and prints usage'
    );
  });

  $getComments(['--help'], (error, stdout) => {
    is.equal(error, null,
      '`get-comments --help` succeeds…'
    );

    is.ok(
      test(stdout, /SYNOPSIS/),
      '…and prints manpage-like help'
    );
  });
});