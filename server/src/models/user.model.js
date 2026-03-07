import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    organizationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organization",
        required: true
    } ,
    name: {
        type: String,
        required: true,
        trim: true
    } , 
    email : { 
        type: String,
        required: true,
        unique: true,
        lowercase: true
    } , 
    passwordHash : {
        type : String,
        required : true
    } ,
    role : {
        type: String,
        enum: ["CEO" , "HOD" , "FINANCE" , "ADMIN"],
        required: true
    } , 
    departmentId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Department",
        default : null
    } , 
    isActive : {
        type : Boolean ,
        default : true
    } , 
    lastLoginAt: Date
} , {
    timestamps : true
})

userSchema.index({ email : 2 })

export default mongoose.model("User" , userSchema)