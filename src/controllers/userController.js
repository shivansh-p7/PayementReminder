const { default: mongoose } = require("mongoose");
const UserModel=require("../models/userModel");
const jwt=require("jsonwebtoken")
const bcrypt=require('bcrypt');
const {isValidEmail,isValidMobileNumber,isValidpassword,isValidImage}=require('../validations/validator')

const userRegister=async(req,res)=>{
try {
    let {fname,lname,mobile,email,password}=req.body;
     
    const regex=/^[A-Za-z]{1,30}$/
    if(!fname) return res.status.send({status:false, message:"firstName is required"})
    if(!regex.test(fname)) return res.status(400).send({status:false, message:"firstName should be less than 30 letters"})

    if(!lname) return res.status.send({status:false, message:"lastName is required"})
    if(!regex.test(lname)) return res.status(400).send({status:false, message:"lastName should be less than 30 letters"})
    
    if(!email) return res.status.send({status:false, message:"email is required"})
    if (!isValidEmail(email)) { return res.status(400).send({ status: false, message: 'Please enter valid emailId' }) }


    if(!mobile) return res.status.send({status:false, message:"mobile number is required"})
    if (!isValidMobileNumber(mobile)) { return res.status(400).send({ status: false, message: 'Please enter valid Indian Mobile Number' }) }

  
    //duplicate checking
    const isDuplicateEmail = await UserModel.findOne({ $or: [{ email: email }, { mobile: mobile }] })
    if (isDuplicateEmail) {
        if (isDuplicateEmail.email == email) { return res.status(400).send({ status: false, message: `This EmailId: ${email} is already exist!` }) }
        if (isDuplicateEmail.mobile == mobile) { return res.status(400).send({ status: false, message: `This Phone No.: ${mobile} is already exist!` }) }
    }

    if(!password) return res.status.send({status:false, message:"password is required"})
    if (!isValidpassword(password)) { return res.status(400).send({ status: false, message: " Password Should have  8 to 15 Characters which includes letters, atleast one special character and at least one Number." }) }




    req.body.password = await bcrypt.hash(password, 12); //passowrd hasing


    let userDetails= await UserModel.create(req.body)
      
  return res.status(201).send({status:true,data:userDetails})


} catch (error) {
    return res.status(500).send({status:false,message:error.message})
}
}


const userLogin=async(req,res)=>{

  try {
    let {email,password}=req.body;
   
    if(!email) return res.status.send({status:false, message:"email is required"})
    if (!isValidEmail(email)) { return res.status(400).send({ status: false, message: 'Please enter valid emailId' }) }
 
    
    if(!password) return res.status.send({status:false, message:"password is required"})
    

    let userDetails= await UserModel.findOne({email:email});

    if(!userDetails) return res.status(404).send({status:false,message:"Invalid request"})


    const matchPass = await bcrypt.compare(password, userDetails.password);// passowrd matching using bcrypt 
    if (!matchPass) return res.status(400).send({ status: false, message: "Password is wrong" });


    const token = jwt.sign( // creation of jwt for authentication purpose
        { email: userDetails.email, userId: userDetails._id },
        "fsoc-reminder-app",
        { expiresIn: "24h" }
    );

    return res.status(200).send({status:true,data:{userId:userDetails._id,token:token}})


  } catch (error) {
    console.log(error.message)
    return res.status(500).send({status:false,message:error.message})
  }

}


const getUser=async(req,res)=>{
    try {
        let userId = req.query.userId;

        if (!mongoose.isValidObjectId(userId)) return res.status(400).send({ status: false, message: "invalid userId" })



        let userDetails = await UserModel.findOne({ _id: userId}).select({ __v: 0 })
        if (!userDetails) return res.status(404).send({ status: false, message: "user Not found" })

        return res.status(200).send({ status: true, data: userDetails })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}



module.exports={userRegister,userLogin,getUser}