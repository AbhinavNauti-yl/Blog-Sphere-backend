import express from 'express'
import cookieparser from 'cookie-parser'
import cors from 'cors'


import userRouter from './routes/user.routes.js'
import postRouter from './routes/post.routes.js'
import commentRouter from './routes/comment.routes.js'
import PostCatagoriesRouter from './routes/postCategories.routes.js'

const app = express()

app.use(express.json())

app.use(express.urlencoded(
    {
        extended: true
    }
))



app.use(cors({
    origin: 'https://blog-sphere-t65e.onrender.com',
    credentials: true,
    exposedHeaders: "https://blog-sphere-t65e.onrender.com"
}))

app.use(cookieparser())
app.use(express.static("public"))

app.use("/api/users", userRouter)
app.use("/api/posts", postRouter)
app.use("/api/comments", commentRouter)
app.use("/api/postCategory", PostCatagoriesRouter)

app.get("/", (req, res) => {
    res.send("api working")
})

export default app
