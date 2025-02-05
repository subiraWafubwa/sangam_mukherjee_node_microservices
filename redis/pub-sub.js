const redis = require("redis");

const client = redis.createClient({
  socket: {
    host: "127.0.0.1",
    port: 6379,
  },
});

client.on("error", (err) => console.error("Redis error:", err));

async function testAdditionalFeatures() {
  try {
    await client.connect();
    console.log("Connected to Redis!");

    // Pub/Sub
    const subscriber = client.duplicate(); // Creates a new client with the same credentials
    await subscriber.connect(); // Connects the subscriber to the redis server
    await subscriber.subscribe("dummy-channel", (message, channel) => {
      console.log(`Received message: ${message} from channel: ${channel}`);
    }); // Subscribes to a channel
    await client.publish("dummy-channel", "Hello, World!"); // Publish message to the dummy channel
    await client.publish("dummy-channel", "Hello, World Again!");
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for the subscriber to receive the messages
    await subscriber.unsubscribe("dummy-channel"); // Unsubscribes from the channel
    await subscriber.quit(); // Quits the subscriber

    //Pipelining and Transactions
    const multi = client.multi(); // Creates a new instance of the multi object

    multi.set("key-transaction1", "value1");
    multi.set("key-transaction2", "value2");
    multi.get("key-transaction1");
    multi.get("key-transaction2");

    const results = await multi.exec(); // Executes all commands in the pipeline
    console.log("Results: ", results);

    //Batch data operations
    const pipelineOne = client.multi();
    for (let i = 0; i < 1000; i++) {
      pipelineOne.set(`user:${i}:action`, `Action ${i}`);
    }
    await pipelineOne.exec();

    // Example 1
    const dummy = client.multi();
    dummy.incrBy("account:1234:balance", 100);
    dummy.decrBy("account:0000:balance", 100);

    const finalResults = await dummy.exec();
    console.log("Final Results: ", finalResults);

    // Cart Example
    item_count = 0;
    total_price = 0;
    const cart = client.multi();
    multi.hIncrBy(`cart:1234`, item_count, 1);
    multi.hIncrBy(`cart:1234`, total_price, 10);

    await cart.exec();
    console.log("Cart Items: ", item_count, ",", "Total price: ", total_price);

    // Example
    console.log("Performance Test");

    console.time("without pipelining");
    for (let i = 0; i < 1000; i++) {
      await client.set(`user:${i}`, `user_value${i}`);
    }
    console.timeEnd("without pipelining");

    console.time("with pipelining");
    const bigPipeline = client.multi();
    for (let i = 0; i < 1000; i++) {
      bigPipeline.set(`user:${i}`, `user_value: ${i}`);
    }
    await bigPipeline.exec();
    console.timeEnd("with pipelining");
  } catch (error) {
    console.error("Error connecting to Redis: ", error);
  } finally {
    await client.quit();
  }
}

testAdditionalFeatures();
