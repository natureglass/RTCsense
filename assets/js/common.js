 /* exported trace */

// Logging utility function.
function trace(arg) {
  var now = (window.performance.now() / 1000).toFixed(3);
  console.log(now + ': ', arg);
}

window.console.info = function(arg){
    if(typeof arg === 'object'){ console.warn(arg); } else {
        console.log('%c ' + arg, 'background: #ebf5ff; color: #000; border: solid 1px #c7e2fd;');
    }
}
