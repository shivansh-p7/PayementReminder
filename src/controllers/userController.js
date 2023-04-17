const { default: mongoose } = require("mongoose");
const UserModel=require("../models/userModel");
const jwt=require("jsonwebtoken")
const bcrypt=require('bcrypt');
const {isValidEmail,isValidMobileNumber,isValidpassword}=require('../validations/validator')
const { uploadImage } = require('../middlwares/aws')
const aws = require('aws-sdk');
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
        if (isDuplicateEmail.mobile == mobile) { return res.status(400).send({ status: false, message: `This mobile No.: ${mobile} is already exist!` }) }
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

const updateUser=async(req,res)=>{
  try {
      let {fname,lname,userId,email,mobile,image} = req.body;

      let final = {}
        

      if (fname) {
          if (!/^[a-zA-Z]{1,30}$/.test(fname)) return res.status(400).send({ status: false, message: "Please Enter Valid first-Name" })
          final.fname = fname
      }

      if (lname) {
       
          if (!/^[a-zA-Z]{1,30}$/.test(lname)) return res.status(400).send({ status: false, message: "Please Enter Valid Last-Name" })
          final.lname = lname
      }

      if (email) {
      
          if (!isValidEmail(email)) return res.status(400).send({ status: false, message: "Please Enter valid Email" })

          let isEmailExist = await UserModel.findOne({ email: email })
          if (isEmailExist) return res.status(400).send({ status: false, message: `This email Id.: ${email} is already exist!` })
          final.email = email
      }

      if (mobile) {
        
          if (!isValidMobileNumber(mobile)) return res.status(400).send({ status: false, message: "Please Enter valid mobile number" })

          let isMobileExit = await UserModel.findOne({ mobile: mobile })
          if (isMobileExit) return res.status(400).send({ status: false, message: `This mobile No.: ${mobile} is already exist!` })
          final.mobile = mobile
      }

      if (password) {
         
          if (!isValidpassword(password)) return res.status(400).send({ status: false, message: "Please put uppercase, lowercase, number, special character and length between 8 to 15" })

          const hashedPassword = await bcrypt.hash(password, 12)
          final.password = hashedPassword
      }

      let profileImages = req.files
        if (profileImages && profileImages.length > 0) {
            let url = await uploadImage(profileImages[0])
            final.profileImage = url
        }

        const updatedUser = await userModel.findOneAndUpdate({ _id: userId }, final, { new: true }).select({__v:0})
        if (!updatedUser) return res.status(404).send({ status: false, message: "User does not exist" })



        return res.status(200).send({ status: true, message: "Successfully Updated", data: updatedUser })

  } catch (error) {
      return res.status(500).send({ status: false, message: error.message })
  }
}

module.exports={userRegister,userLogin,getUser,updateUser}