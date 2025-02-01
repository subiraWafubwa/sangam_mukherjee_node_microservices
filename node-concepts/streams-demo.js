// readable -> used for read
// writable -> used for write
// duplex -> used for read and write
// transform -> used for read and write, but can modify the data

const fs = require("fs");
const zlib = require("zlib");
const crypto = require("crypto");
const { Transform } = require("stream");

class EncryptString extends Transform {
  constructor(key, vector) {
    super();
    this.vector = vector; // Initialization Vector (IV)
    this.key = key; // Encryption key
  }

  _transform(chunk, encoding, callback) {
    // Create AES-256-CBC cipher
    const cipher = crypto.createCipheriv("aes-256-cbc", this.key, this.vector);

    // Encrypt the chunk and combine with final cipher block
    const encrypted = Buffer.concat([cipher.update(chunk), cipher.final()]);

    // Push encrypted data to the next stream
    this.push(encrypted);

    // Signal processing is complete
    callback();
  }
}

const key = crypto.randomBytes(32);
const vector = crypto.randomBytes(16);

const readableStream = fs.createReadStream("input.txt");

// new gzip object to compress the stream data
const gzipStream = zlib.createGzip();
const encryptString = new EncryptString(key, vector);
const writableStream = fs.createWriteStream("output.txt.gz.enc");

// read -> compress -> encrypt -> write
readableStream.pipe(gzipStream).pipe(encryptString).pipe(writableStream);

console.log("File compressed and encrypted successfully");
