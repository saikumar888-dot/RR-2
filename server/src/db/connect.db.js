import mongoose from "mongoose";

export const connectDb = async (req , res) => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)

        console.log(`Connected to the Database`)
    } catch (error) {
        console.log("Db failed because of " , error)
        process.exit(1)
    }
}