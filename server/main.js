import app from './src/app.js'
import { connectDb } from './src/db/connect.db.js'

connectDb() 
    .then(() => {
        app.listen(process.env.PORT , () => {
            console.log(`Server is Running on Port ${process.env.PORT} and the DB is connected`)
        })
    })
    .catch((err) => {
        console.log("Failed to connect to DB" , err)
    })