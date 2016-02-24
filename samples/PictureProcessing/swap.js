
self.onmessage = function(e) {
  // Presumably, this worker would create its own Uint8Array or alter the
  // ArrayBuffer (e.data) in some way. For this example, just send back the data
  // we were sent.
  var imageData = new Uint8ClampedArray(e.data.data);
  var length = imageData.length;
  var r;
  var b;
  var index = e.data.index;


  for (var i = 0; i < length; )
  {
    r = imageData[i];
    b = imageData[i+2];
    imageData[i+2] = r;
    imageData[i] = b;
    i += 4;
  }


  self.postMessage({data:imageData.buffer, index:index}, [imageData.buffer] );
};

self.onerror = function(message) {
  log('worker error');
};

function log(msg) {
  var object = {
    type: 'debug',
    msg: source() + msg + ' [' + time() + ']'
  };
  self.postMessage(object);
}

