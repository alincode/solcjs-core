const solcVersion = require('solc-version');

module.exports = getVersion;

async function getVersion(_version) {
  if (typeof _version !== 'string') {
    let select = await solcVersion.versions();
    return select.releases[0];
  } else {
    return _version;
  }
}