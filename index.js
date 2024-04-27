import dotenv from "dotenv"
dotenv.config()
import app from "./app.js"
import { connectToTheDatabase } from "./dbconnect.js"
import { client } from "./client.js"

const port = process.env.PORT || 80
const db_url = process.env.DB_URL || ""

connectToTheDatabase(db_url).then(async () => {
    app.listen(port, () => {
        console.log("Server is running on port ", port)
    })
    // await client.connect()
}).catch((err) => {
    console.log("Error occurred while connecting to the database ", err.message);
})
