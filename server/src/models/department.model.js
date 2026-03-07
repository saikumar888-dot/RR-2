import mongoose from "mongoose";

const departmentModel = new mongoose.Schema({
    organizationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organization",
        required: true
    },
    name : {
        type: String,
        required: true,
        unique: true
    } , 
    description: {
        type: String
    } , 
    headId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false,
        default: null 
    } , 
    budgetAllocated: {
        type: Number,
        default: 0
    } , 
    budgetUsed: {
        type: Number,
        default: 0
    }
} , {
    timestamps: true
})

const Department = mongoose.model("Department" , departmentModel)

export default Department