const redis = require("redis");

const client = redis.createClient({
  socket: {
    host: "127.0.0.1",
    port: 6379,
  },
});

client.on("error", (err) => console.error("Redis error:", err));

async function testRedisConnection() {
  try {
    await client.connect();
    console.log("Connected to Redis!");

    // Using set and get
    await client.set("name", "Subira");
    const extractValue = await client.get("name");
    console.log("Extracted value: ", extractValue);

    // Deleting the key
    console.log(await client.del("name"));

    // Increment and Decrement
    await client.set("age", 20);
    console.log("Initial age: ", await client.get("age"));
    await client.incr("age");
    console.log("Incremented age: ", await client.get("age"));

    await client.decr("age");
    console.log("Decremented age: ", await client.get("age"));
  } catch (error) {
    console.error("Error connecting to Redis: ", error);
  } finally {
    await client.quit();
  }
}

testRedisConnection();
