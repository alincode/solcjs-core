// https://solidity.readthedocs.io/en/v0.5.1/using-the-compiler.html?highlight=legacyAST#output-description

module.exports = standardTranslateJsonCompilerOutput;

// function writeOutput(data, version) {
//   const fileName = version.split('-')[0];
//   const jsonfile = require('jsonfile');
//   jsonfile.writeFile(`./test/wrapper/translate/output/${fileName}.json`, data, function (err) {
//     if (err) console.error(err);
//   });
// }

function standardTranslateJsonCompilerOutput ({ version, url }, data) {
  if (isMatchVersion(version, '0.1')) throw Error('don\'t support v0.1.x version.');

  try {
    // writeOutput(data, version);
    let output = Object.keys(data.contracts).map(name => {
      let contract = data.contracts[name];
      var {
        functionHashes,
      } = contract;

      const metadata = getMetadata(contract, name);

      var compilation = {
        name: getName(contract, name),
        abi: getABI(contract, name),
        sources: getSource(data, metadata, version, name),
        compiler: getCompile(metadata, version, url, name),
        assembly: {
          assembly: getAssembly(contract, name),
          opcodes: getOpcodes(contract, metadata, version)
        },
        binary: {
          bytecodes: {
            bytecode: getBytecode(contract, name),
            runtimeBytecode: getRuntimeBytecode(contract, name)
          },
          sourcemap: {
            srcmap: getSrcmap(contract, version),
            srcmapRuntime: getSrcmapRuntime(contract, version)
          },
        },
        metadata: {
          ast: getAST(name, data),
          devdoc: getDevDoc(contract, metadata, version),
          userdoc: getUserDoc(contract, metadata, version),
          functionHashes,
          gasEstimates: getGasEstimates(contract, name),
          analysis: (() => {
            return getAnalysis(data.errors);
          })()
        }
      };
      // console.log('=== stardard output ====');
      // console.log(compilation);
      return compilation;
    });
    return output;
  } catch (error) {
    console.error('[ERROR] parse standard output error');
    throw error;
  }
}

function isNewVersion(name) {
  return name === 'MyContract';
}

function getName(contract, name) {
  return isNewVersion(name) ? Object.keys(contract)[0] : name;
}

function getAnalysis(errors) {
  let result = { warnings: [], others: [] };
  for (let error in errors) {
    let errItem = errors[error];
    let type;
    if (errItem.type) {
      type = errItem.type.trim().toLowerCase();
    } else {
      type = errItem.split(':')[3];
    }
    if (type == 'warning') type = 'warnings';
    (result[type] || (result[type] = [])).push(errItem);
  }
  return result;
}

function getSrcmap(contract, version) {
  try {
    if (isMatchVersion(version, '0.5')) {
      let name = Object.keys(contract)[0];
      return contract[name].evm.bytecode.sourceMap;
    } else if (isMatchVersion(version, '0.4', '0.3')) {
      return contract.srcmap;
    } else {
      return;
    }
  } catch (error) {
    console.error('[ERROR] parse srcmap fail');
    throw error;
  }
}

function getBytecode(contract, name) {
  if (isNewVersion(name)) {
    let name = Object.keys(contract)[0];
    return contract[name].evm.bytecode.object;
  } else {
    return contract.bytecode;
  }
}

function getRuntimeBytecode(contract, name) {
  if (isNewVersion(name)) {
    let name = Object.keys(contract)[0];
    // return contract[name].evm.deployedBytecode;
    return contract[name].evm.deployedBytecode.object;
  } else {
    return contract.runtimeBytecode; 
  }
}

function getSrcmapRuntime(contract, version) {
  try {
    if (isMatchVersion(version, '0.5')) {
      let name = Object.keys(contract)[0];
      return contract[name].evm.bytecode.sourceMap;
    } else if (isMatchVersion(version, '0.4')) {
      return contract.srcmapRuntime;
    } else if (isMatchVersion(version, '0.3')) {
      return contract['srcmap-runtime'];
    } else {
      return;
    }
  } catch (error) {
    console.error('[ERROR] parse bytecode fail');
    throw error;
  }
}

function getOpcodes(contract, metadata, version) {
  try {
    if (isMatchVersion(version, '0.5')) {
      let name = Object.keys(contract)[0];
      return contract[name].evm.bytecode.opcodes;
    } else if (isMatchVersion(version, '0.4', '0.3', '0.2')) {
      return contract.opcodes;
    } else {
      return;
    }
  } catch (error) {
    console.error('[ERROR] parse opcodes fail');
    throw error;
  }
}

function getAssembly(contract, name) {
  if (isNewVersion(name)) {
    let name = Object.keys(contract)[0];
    return contract[name].evm.legacyAssembly;
  } else {
    return contract.assembly;
  }
}

function getGasEstimates(contract, name) {
  if (isNewVersion(name)) {
    let name = Object.keys(contract)[0];
    return contract[name].evm.gasEstimates;
  } else {
    return contract.gasEstimates;
  }
}

function getAST(name, data) {
  return isNewVersion(name) ? data.sources[name].ast : data.sources[''].AST;
}

function getUserDoc(contract, metadata, version) {
  try {
    if (isMatchVersion(version, '0.5')) {
      let name = Object.keys(contract)[0];
      return contract[name].userdoc;
    } else if (isMatchVersion(version, '0.4')) {
      return metadata.output.userdoc;
    } else {
      return;
    }
  } catch (error) {
    console.error('[ERROR] parse userdoc fail');
    throw error;
  }
}

function getDevDoc(contract, metadata, version) {
  try {
    if (isMatchVersion(version, '0.5')) {
      let name = Object.keys(contract)[0];
      return contract[name].devdoc;
    } else if (isMatchVersion(version, '0.4')) {
      return metadata.output.devdoc;
    } else {
      return;
    }
  } catch (error) {
    console.error('[ERROR] parse devdoc fail');
    throw error;
  }
}

function getABI(contract, name) {
  if (isNewVersion(name)) {
    let name = Object.keys(contract)[0];
    return contract[name].abi;
  } else {
    return JSON.parse(contract.interface);
  } 
}

function getMetadata(contract, name) {
  if (isNewVersion(name)) {
    let name = Object.keys(contract)[0];
    // let { metadata, abi, evm } 
    let { metadata } = contract[name];
    metadata = JSON.parse(metadata);
    // console.log('=== metadata ====');
    // console.log(metadata);
    return metadata;
  } else {
    return;
  }
}

function getCompile(metadata, version, url, name) {
  let language, evmVersion, optimizer, runs;
  if (isNewVersion(name)) {
    language = metadata.language.toLowerCase();
    evmVersion = metadata.settings.evmVersion;
    optimizer = metadata.settings.optimizer.enabled;
    runs = metadata.settings.optimizer.runs;
  } else {
    language = 'solidity';
    // evmVersion = metadata.settings.evmVersion;
    optimizer = true;
    runs = 200;
  }

  return {
    language,
    version: version,
    url,
    evmVersion,
    optimizer,
    runs,
  };
}

function getSource(data, metadata, version, name) {
  let sources = {};

  if (isMatchVersion(version, '0.5', '0.4')) {
    sources = {
      sourcecode: {
        keccak256: getKeccak256(metadata, version, name),
        urls: [] // DONT HAVE
      },
      compilationTarget: (metadata.settings.compilationTarget)[name],
      remappings: metadata.settings.remappings,
      libraries: metadata.settings.libraries,
      sourcelist: undefined
    };
  // } else if (isMatchVersion(version, '0.4')) {
  //   sources = {
  //     sourcecode: metadata.sources[''],
  //     compilationTarget: metadata.settings.compilationTarget[''],
  //     remappings: metadata.settings.remappings,
  //     libraries: metadata.settings.libraries,
  //     sourcelist: data.sourceList
    // };
  } else if (isMatchVersion(version, '0.3')) {
    sources = {
      sourcecode: '',
      compilationTarget: '',
      remappings: '',
      libraries: '',
      sourcelist: data.sourceList
    };
  } else {
    return;
  }
  return sources;
}

function getKeccak256(metadata, version, name) {
  try {
    if (isMatchVersion(version, '0.5')) {
      return metadata.sources[name].keccak256;
    } else {
      return metadata.sources[''];
    }
  } catch (error) {
    console.error('[ERROR] parse source keccak256 fail');
    throw error;
  }
}

function isMatchVersion(version, ...match) {
  for (let m of match) {
    if (version.indexOf(`v${m}.`) != -1) return true;
  }
  return false;
}