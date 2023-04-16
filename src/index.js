const express=require('express');
const mongoose=require('mongoose');
const route=require('./routes/route')
const cors=require('cors')
const app=express();

app.use(express.json());
app.use(cors())
mongoose.connect("mongodb+srv://shivanshsharma:76Xjx6fMmlcP51HZ@shivansh-p7.zwfahec.mongodb.net/reminderApplication")
     .then(()=>console.log("MongoDB is connected"))
     .catch((err)=>{console.log(err.message)});




app.use("/",route);



app.listen(5000,()=>{
    console.log("server is running on port 5000")
})