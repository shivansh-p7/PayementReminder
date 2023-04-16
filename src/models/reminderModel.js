const mongoose=require('mongoose');

const ObjectId=mongoose.Schema.Types.ObjectId;

const reminderSchema= new mongoose.Schema({
  
    message:{
        type:String,
        requried:true,
        trim:true
    },
    userId:{
        type:ObjectId,
        ref:"User"
    },
    remindAt:{
        type:String,
        requried:true
    },
    reminderFreq:{
        type:String,
        requried:true
    },
    cronJob:{
        type:String
    }

},{timestamps:true});

module.exports=mongoose.model("Reminders",reminderSchema);