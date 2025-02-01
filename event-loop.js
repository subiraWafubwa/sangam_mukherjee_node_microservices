const fs = require("fs-extra");
const crypto = require("crypto");

console.log("1. script start");

// setTimeout()	-> Executes a function after a delay (Timers Phase).
// Delayed execution, debouncing
setTimeout(() => {
  console.log("2. setTimeout 0s callback (macrotask)");
}, 0);

setTimeout(() => {
  console.log("3. setTimeout 0s callback (macrotask)");
}, 0);

// setImmediate() -> Executes a function in the Check Phase.
// Running tasks after I/O events
setImmediate(() => {
  console.log("4. setImmediate callback");
});

// Promise.then() -> Executes code asynchronously (Microtasks).
// Handling asynchronous logic
Promise.resolve().then(() => {
  console.log("5. Promise Resolved");
});

// process.nextTick() -> Executes immediately after synchronous code
// Used when prioritizing urgent tasks
process.nextTick(() => {
  console.log("6. process.nextTick callback (microtask)");
});

// fs.readFile() -> Reads a file asynchronously (Poll Phase)
// File I/O operations
fs.readFile(__filename, () => {
  console.log("7. file read operation (I/O callback)");
});

// Executes clean-up callbacks
const readStream = fs.createReadStream(__filename);
readStream.close();
readStream.on("close", () => {
  console.log("8. Close callback executed");
});

// crypto.pbkdf2() -> Performs computationally expensive hashing.
// Used in encrypting passwords.
crypto.pbkdf2("secret", "salt", 10000, 64, "sha512", (err, key) => {
  if (err) throw err;
  console.log("9. pbkdf2 completed (CPU Intensive Task)");
});

console.log("10. script ends");
