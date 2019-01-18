const R = /^(.*):(\d+):(\d+):(.*):/;

module.exports = getStandardError;

function getStandardError(err) {
  let type = R.exec(err);
  type = type ? type[4].trim() : 'Error';
  return {
    component: 'general',
    formattedMessage: err,
    message: err,
    type
  };
}