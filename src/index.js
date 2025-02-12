import dotenv from 'dotenv'

dotenv.config()

import app from "./app.js";
import dbConnect from './db/index.js';

dbConnect().then(
    app.listen(process.env.PORT || 8000, () => {
        console.log("server live")
    })
).catch((error) => {
    console.log(error.message)
})