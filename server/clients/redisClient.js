import redis from "redis";

const client = redis.createClient();

client.connect().then(() => {});

client.on("error", function (err) {
  console.log("Something went wrong ", err);
});

await client.flushAll();

export default client;
