const translateJsonCompilerOutput = require('./solc-wrapper/translate/standardTranslateJsonCompilerOutput');
const getCompileOutput = require('./getCompileOutput');
const getStandardError = require('./getStandardError');

module.exports = wrapperCompile;

function wrapperCompile(oldSolc, sourcecode, readCallback) {
  return new Promise(function (resolve, reject) {
    // format output
    let output = getCompileOutput(oldSolc, sourcecode, readCallback);
    if (!output.contracts) throw Error('compile fail');
    if (!Object.keys(output.contracts).length) {
      let err = output.errors[0];
      if (typeof err === 'string') err = getStandardError(err);
      return reject(err);
    }
    const translateOutput = translateJsonCompilerOutput(oldSolc.opts, output);
    resolve(translateOutput);
  });
}