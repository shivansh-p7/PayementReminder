require("dotenv").config()
const cron=require("node-cron");
const ReminderModel=require("./models/reminderModel");
const moment=require("moment");

const accountSid=process.env.ACCOUNT_SID;
const authToken=process.env.AUTH_TOKEN

const client=require('twilio')(accountSid,authToken);




const reminderScheduler= async (req,res,userDetails)=>{
  
        const date = moment(req.body.remindAt); // use the reminder date as the schedule time
      
        let schedule = date.format('m H D * *');

        if(req.body.reminderFreq === "EveryDay") schedule = date.format('m H * * *');



       console.log(schedule,userDetails.mobile)
 
    const job=cron.schedule(schedule,()=>{

        client.messages.create({
           body:req.body.message,
           from: 'whatsapp:+14155238886',
           to: `whatsapp:+91${userDetails.mobile}`
    
    })
    .then(message => console.log(message.sid,"scheduled reminder"))
    .catch(err=>console.log(err.message))
    
    },{ scheduled: true, timezone: 'Asia/Kolkata' })

   
    job.start()


      req.body.cronJob=job.options.name; //adding cron name in reminder object

      //saving doc inn database
    let reminderDetails= await ReminderModel.create(req.body);

   return res.status(201).send({status:true,data:reminderDetails})
}


module.exports={reminderScheduler}