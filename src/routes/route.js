const router=require('express').Router();
const {userRegister,userLogin,getUser}=require("../controllers/userController");
const {createReminder,deleteReminder, getReminders}=require("../controllers/reminderController");
const {Authentication}=require("../middlwares/middleware")

//___________________________________________userApi's____________________________

 router.post("/register",userRegister);
router.post("/login",userLogin);
router.get("/user",Authentication,getUser)







//__________________________________________________reminder'sApi________________________________


router.post("/reminder",createReminder);
router.get("/reminder",Authentication,getReminders);
router.delete("/reminder",Authentication,deleteReminder);












module.exports=router