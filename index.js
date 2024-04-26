import dotenv from "dotenv"
dotenv.config()
import app from "./app.js"
import { connectToTheDatabase } from "./dbconnect.js"

const port = process.env.PORT || 80
const db_url = process.env.DB_URL || ""

connectToTheDatabase(db_url).then(() => {
    app.listen(port, () => {
        console.log("Server is running on port ", port)
    })
}).catch((err) => {
    console.log("Error occurred while connecting to the database ", err.message);
})
