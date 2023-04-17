const mongoose=require('mongoose');


const userSchema= new mongoose.Schema({
   
   fname: {
        type: String,
        required: true,
        trim: true

    },
    lname: {
        type: String,
        required: true,
        trim: true

    },
    profileImage: {
        type: String,
        default:"image.jpeg",
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    mobile: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password:{
        type: String,
        required: true,
        trim:true
    }

},{timestamps:true});

module.exports=mongoose.model("User",userSchema);