var res = function(str){
  document.querySelector('#result').innerHTML += str.replace(/\n/g, '<br>') + '<br>';
};

var dump = function(buffer){
  if( buffer instanceof ArrayBuffer )
    buffer = new Uint8Array(buffer);
  var out = buffer.length + ':';
  var i;
  for(i=0; i<buffer.length; ++i){
    if( i % 16 == 0 )
      out += '<br>';
    else
      out += ' ';
    if( buffer[i] ){
      if( buffer[i] < 16 )
        out += '0';
      out += buffer[i].toString(16);
    }
    else
      out += '00';
  }
  res(out);
  res('<hr>');
};

document.querySelector('#go').onclick = function(){
  document.querySelector('#result').innerHTML = '';
  this.innerHTML = 'Running...';
  setTimeout(function(){
    var key = [
      0x54, 0x68, 0x61, 0x74, 0x73, 0x20, 0x6D, 0x79, 0x20, 0x4B, 0x75, 0x6E, 0x67, 0x20, 0x46, 0x75,
      0x54, 0x68, 0x61, 0x74, 0x73, 0x20, 0x6D, 0x79, 0x20, 0x4B, 0x75, 0x6E, 0x67, 0x20, 0x46, 0x75
    ].slice(0, parseInt(document.querySelector('[name=key]:checked').value)/8);
    var key_arraybuffer = Uint8Array.from(key).buffer;

    var plain = [];
    var i, j, n, match;
    n = parseInt(document.querySelector('#number').value);
    for(i=0; i<n; ++i){
      var str = 'Beautiful Cindy!';
      for(j=0; j<16; ++j)
        plain.push(str.charCodeAt(j));
    }
    var plain_arraybuffer = Uint8Array.from(plain).buffer;
    var plain_view8 = new Uint8Array(plain_arraybuffer);

    var test = function(methodGen, key, plain, cipher, replain){
      var begin_time = (new Date).getTime();
      var method = methodGen();
      var init_time = (new Date).getTime();
      var scheduled_key = method.key_schedule(key);
      var prepare_time = (new Date).getTime();
      var offset;
      var len = plain.length || plain.byteLength;
      for(offset=0; offset<len; offset+=16){
        method.encrypt_block(cipher, plain, offset, scheduled_key);
        method.decrypt_block(replain, cipher, offset, scheduled_key);
      }
      var done_time = (new Date).getTime();
      //dump(scheduled_key);

      if( document.querySelector('#show').checked ){
        res('plain text');
        dump(plain);
        res('cipher text');
        dump(cipher);
        res('plain text (decrypted)');
        dump(replain);
      }

      res('init time: ' + (init_time-begin_time) + ' clocks');
      res('prepare time: ' + (prepare_time-init_time) + ' clocks');
      res('calculate time: ' + (done_time-prepare_time) + ' clocks');
    };

    res('<hr><hr>vanilla');
    test(vanillaMethod, key, plain, new Array(plain.length), new Array(plain.length));

    res('<hr><hr>array_buffer');
    test(arraybufferMethod, key_arraybuffer, plain_arraybuffer, new ArrayBuffer(plain_arraybuffer.byteLength), new ArrayBuffer(plain_arraybuffer.byteLength));

    res('<hr><hr>asm');
    test(asmMethod, key, plain, new Array(plain.length), new Array(plain.length));

    document.querySelector('#go').innerHTML = 'Run';
  }, 100);
};
