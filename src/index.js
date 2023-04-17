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


app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type"
    );
    res.setHeader("Access-Control-Allow-Credentials", true);
next();
});


app.listen(5000,()=>{
    console.log("server is running on port 5000")
})