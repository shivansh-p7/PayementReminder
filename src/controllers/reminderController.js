const ReminderModel = require("../models/reminderModel");
const { reminderScheduler } = require("../cron");
const UserModel = require("../models/userModel");
const cron=require('node-cron');


const createReminder = async (req, res) => {
    try {
        let { message, userId, remindAt,reminderFreq} = req.body;

        if(!message) return res.status(400).send({status:false, message:"message is required"})
        if(!/^[A-Z a-z 0-9]{1,100}$/.test(message)) return res.status(400).send({status:false, message:"message should be less than 100 letters"})

        if(!userId) return res.status(400).send({status:false, message:"message is required"})

        if(!remindAt) return res.status(400).send({status:false, message:"remindAt is required"})


        let userDetails = await UserModel.findOne({ _id: userId })
  
        reminderScheduler(req,res,userDetails)

    } catch (error) {
        
        return res.status(500).send({ status: false, message: error.message })
    }

};



const getReminders = async (req, res) => {

    try {
            let userId=req.query.userId
         
        let reminders = await ReminderModel.find({userId: userId }).select({ __v: 0, cronJobId: 0 })

        if (reminders.length == 0) return res.status(404).send({ status: false, message: "no reminders found" });
            reminders.reverse()
        return res.status(200).send({ status: true, data: reminders })

    } catch (error) {
        
        return res.status(500).send({ status: false, message: error.message })
  
    }

}


const deleteReminder = async (req, res) => {
    try {

        let reminderId = req.body.reminderId;
     

      const reminder = await ReminderModel.findByIdAndDelete(reminderId);
          
      
      if (!reminder) {
          return res.status(404).send({ status: false, message: "Reminder not found" });
      }

      // Stop and delete the cron job associated with the reminder
      if (reminder && reminder.cronJob) {
        const tasks = Array.from(cron.getTasks());
         
         const task = tasks.find(task => task[0] === reminder.cronJob);
       
          if (task) {
              task[1].stop();
          }
      }

        return res.status(200).send({status:true, message:"Reminder deleted successfully"})

    } catch (error) {

        
        return res.status(500).send({ status: false, message: error.message })

    }

}






module.exports = { createReminder, getReminders,deleteReminder }