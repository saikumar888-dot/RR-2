import mongoose from "mongoose";
import Department from "../models/department.model.js";

const revenueSchema = new mongoose.Schema({
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    required: true
  } , 
  
  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    required: true
  } , 

  source : {
    type: String,
    required: true
  } , 

  clientName : String,

  amount : {
    type : Number , 
    required : true , 
    min : 0
  } , 

  currency : {
    type : String,
    default : "INR"
  } , 

  type: {
    type : String,
    enum : ["Recurring" , "OneTime"],
    required : true
  } , 

  billingCycle: {
    type: String,
    enum: ["single" , "monthly", "quarterly", "yearly", null],
    default: null
  } ,

  region : String , 

  receivedDate : {
    type : Date,
    required : true
  } ,

  invoiceNumber : String , 

  createdBy : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "User"
  } , 

  isActive : {
    type : Boolean , 
    default : true
  }
} , {
  timestamps: true
})

export default mongoose.model("Revenue" , revenueSchema)