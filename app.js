import express from "express"
const app = express();
import UserRouter from "./routes/user.routes.js"

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use("/api/v1/user", UserRouter)

app.get('/', (req, res) => {
  res.send('Hello World!');
});

export default app;