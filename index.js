const app = require("./app")
const { connectToTheDatabase } = require("./dbconnect")

const PORT = process.env.PORT || 80
const DB_URL = process.env.DB_URL

connectToTheDatabase(DB_URL).then(() => {
    app.listen(PORT, () => {
        console.log("Server is running on port ", PORT)
    })
}).catch((err) => {
    console.log("Error occurred while connecting to the database ", err.message);
}
)
