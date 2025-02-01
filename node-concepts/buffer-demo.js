// Empty integer of 10 bytes -> Output: <Buffer 00 00 00 00 00 00 00 00 00 00>
const buffOne = Buffer.alloc(10);
console.log(buffOne);

// Specific integer of 10 bytes -> Output: <Buffer 01 01 01 01 01 01 01 01 01 01>
const buffTwo = Buffer.alloc(10, "a");
console.log(buffTwo);

// Buffer from string -> Output: <Buffer 48 65 6c 6c 6f>
const buffThree = Buffer.from("Hello");
console.log(buffThree);

// Buffer to string -> Output: "aaaaaaaaaa"
const stringOfBuffTwo = buffTwo.toString();
console.log(stringOfBuffTwo);

// Buffer from array -> Output: <Buffer 48 65 6c 6c 6f>
const buffFromStr = Buffer.from([72, 101, 108, 108, 111]);
console.log(buffFromStr);
