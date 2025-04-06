import express from 'express'
import cookieparser from 'cookie-parser'
import cors from 'cors'


import userRouter from './routes/user.routes.js'
import postRouter from './routes/post.routes.js'

const app = express()

app.use(express.json())

app.use(express.urlencoded(
    {
        extended: true
    }
))


app.use(cookieparser())

app.use(cors({
    origin: "*",
    credentials: true
}))

app.use(express.static("public"))

app.use("/api/users", userRouter)
app.use("/api/posts", postRouter)

app.get("/", (req, res) => {
    res.send("api working")
})

export default app
