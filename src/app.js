import express from 'express'
import userRouter from './routes/user.routes.js'

const app = express()

app.use(express.json(
    {
        limit:'16kb',
        extended: true
    }
))

app.use(express.static("public"))

app.use("/api/users", userRouter)

app.get("/", (req, res) => {
    res.send("api working")
})

export default app
