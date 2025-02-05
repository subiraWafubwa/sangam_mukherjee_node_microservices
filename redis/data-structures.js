const redis = require("redis");

const client = redis.createClient({
  socket: {
    host: "127.0.0.1",
    port: 6379,
  },
});

client.on("error", (err) => console.error("Redis error:", err));

async function redisDataStructures() {
  try {
    await client.connect();
    console.log("Connected to Redis!");

    await client.set("user:email", "user1@gmail.com");
    console.log("User email: ", await client.get("user:email"));

    // Multiple key-value pairs
    await client.mSet(["user:age", "20", "user:location", "Nairobi"]);
    const [age, location] = await client.mGet(["user:age", "user:location"]);
    console.log(age, location);

    // Lists -> LPOP, RPOP, LPUSH, RPUSH, LRANGE and LLEN
    await client.lPush("notes", ["note1", "note2", "note3"]); // Adds to the left three notes
    const extractNotes = await client.lRange("notes", 0, -1); // Extracts all notes
    console.log("Extracted notes: ", extractNotes);
    const lpopped = await client.lPop("notes"); // Removes the leftmost note
    console.log("Popped value: ", lpopped); // Returns the popped value
    const leftPop = await client.lRange("notes", 0, -1);
    console.log("After Left pop: ", leftPop);
    const rPopped = await client.rPop("notes"); // Removes the rightmost note
    console.log("Popped value: ", rPopped); // Returns the popped value
    const rightPop = await client.lRange("notes", 0, -1);
    console.log("After Right pop: ", rightPop);
    await client.lPush("notes", "note0");
    const leftPush = await client.lRange("notes", 0, -1);
    console.log("After Left push: ", leftPush);
    await client.rPush("notes", "note4"); // Adds to the right
    const rightPush = await client.lRange("notes", 0, -1);
    console.log("After Right push: ", rightPush);
    const removedNote = await client.lRem("notes", 1, "note2"); // Removes a specific note
    console.log("Removed note: ", removedNote); // Returns the number of removed elements
    console.log("Remaining notes: ", await client.lRange("notes", 0, -1)); // Returns the remaining notes
    const listLength = await client.lLen("notes"); // Returns the length of the list
    console.log("Length of notes: ", listLength);
    await client.del("notes"); // Deletes the list

    // Sets -> SADD, SMEMBERS, SISMEMBER, SCARD, SREM
    await client.sAdd("user:nickname", ["John", "Doe", "JD"]);
    const extractUserNicknames = await client.sMembers("user:nickname");
    console.log("User nicknames: ", extractUserNicknames);
    console.log(
      "Is JD a member? ",
      await client.sIsMember("user:nickname", "JD")
    ); // Returns true if JD is a member
    console.log("Removed element: ", await client.sRem("user:nickname", "JD")); // Returns the number of removed elements
    console.log("Remaining members: ", await client.sMembers("user:nickname")); // Returns the remaining members
    console.log("Number of members: ", await client.sCard("user:nickname")); // Returns the number of elements in the set

    // Sorted Sets -> ZADD, ZRANGE, ZRANK, ZSCORE, ZREM, ZRANGEWITHSCORES
    // Setting priority queues
    await client.zAdd("cart", [
      {
        score: 100,
        value: "Cart 1",
      },
      {
        score: 150,
        value: "Cart 2",
      },
      {
        score: 20,
        value: "Cart 3",
      },
    ]);

    const getTopCartItems = await client.zRange("cart", 0, -1); // Returns all items in ascending order
    console.log("Get cart items", getTopCartItems);
    const extracteAllCartItemsInScore = await client.zRangeWithScores(
      "cart",
      0,
      -1
    ); // Returns all items with their scores
    console.log(
      "Extract all cart items with scores",
      extracteAllCartItemsInScore
    );

    const cartTwoRank = await client.zRank("cart", "Cart 2"); // Returns the rank of Cart 2
    console.log("Cart 2 rank: ", cartTwoRank);
  } catch (error) {
    console.error("Error connecting to Redis: ", error);
  } finally {
    await client.quit();
  }
}

redisDataStructures();
