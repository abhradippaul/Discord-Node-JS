import express from "express"
const app = express();
import UserRouter from "./routes/user.routes.js"
import ServerRouter from "./routes/server.routes.js"

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use("/api/v1/user", UserRouter)
app.use("/api/v1/server", ServerRouter)

app.get('/', (req, res) => {
  res.send('Hello World!');
});

export default app;