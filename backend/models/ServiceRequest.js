const mongoose = require("mongoose");

const schema =
new mongoose.Schema(
{
customerName:String,
service:String,
dates:String,
plantCount:Number,
status:{
type:String,
default:"Pending"
},
address:String,
contact:String
},
{timestamps:true}
);

module.exports =
mongoose.model(
"ServiceRequest",
schema
);