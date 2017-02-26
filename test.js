var key = Uint8Array.from([
  0x54, 0x68, 0x61, 0x74, 0x73, 0x20, 0x6D, 0x79, 0x20, 0x4B, 0x75, 0x6E, 0x67, 0x20, 0x46, 0x75
]).buffer;

var plain = Uint8Array.from([
  0x54, 0x77, 0x6F, 0x20, 0x4F, 0x6E, 0x65, 0x20, 0x4E, 0x69, 0x6E, 0x65, 0x20, 0x54, 0x77, 0x6F
]).buffer;
var plain_view8 = new Uint8Array(plain);

var dump = function(buffer){
  if( buffer instanceof ArrayBuffer )
    buffer = new Uint8Array(buffer);
  var out = buffer.length + ':';
  var i;
  for(i=0; i<buffer.length; ++i){
    if( i % 16 == 0 )
      out += '\n';
    else
      out += ' ';
    if( buffer[i] < 16 )
      out += '0';
    out += buffer[i].toString(16);
  }
  console.log(out);
};

var scheduled_key = key_schedule(key);

dump(plain);
var cipher = encrypt_block(plain, scheduled_key);
dump(cipher);
var replain = decrypt_block(cipher, scheduled_key);
dump(replain);
