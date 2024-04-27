import { createClient } from "redis";

export const client = createClient({
    socket: {
        host: "localhost",
        port: 6379
    }
})

client.on("error", (err) => {
    console.log("Error " + err)
})

client.on("connect", () => {
    console.log("Connected to Redis")
})