module.exports = loadModule;

// HELPER
function loadModule(sourcecode) {
  var script = window.document.createElement('script');
  if ('Module' in window) {
    var oldModule = window.Module;
    var exists = true;
  } else window.Module = {};
  script.text = `window.Module=((Module)=>{${sourcecode};return Module})()`;
  window.document.head.appendChild(script);
  window.document.head.removeChild(script);
  const compiler = window.Module;
  if (exists) window.Module = oldModule;
  else delete window.Module;
  return compiler;
}