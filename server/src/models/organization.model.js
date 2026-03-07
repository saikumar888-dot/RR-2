import mongoose from "mongoose";

const organizationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    } , 
    industry : String, 
    isActive : {
        type: Boolean,
        default: true
    }
} , {
    timestamps: true
})

export default mongoose.model("Organization" , organizationSchema)