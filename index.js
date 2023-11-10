import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import 'dotenv/config';

const app = express();
const port = 3000;
app.use(express.static("public"));
app.use(express.json());

//Mongodb localhost
//mongodb://127.0.0.1:27017/todolist

//Connecting Mongoose
mongoose.connect(process.env.connection)                       // It is a promise.
.then(() =>  {                                                 // If the promise is successfull.
    console.log("Connection is successfull!")
})    
.catch((err) => {                                              // If the promise fails.
    console.log(err)
}); 

app.use(bodyParser.urlencoded({extended : true}));

// Table Schema 
const todoschema = new mongoose.Schema({
    name : String,
    checkbox_status : Boolean
})

//Table
const Work = mongoose.model("Work" , todoschema)

//This will load up the page with all the tasks.
app.get("/" , (req,res) => {

    async function get_all_tasks(){

        const result = await Work.find();
 
        res.render("index.ejs" , {
            set_of_tasks : result
        })
    }

    get_all_tasks();

});

//This will add the task recieved from the frontend into the database.
app.post("/submit" , (req,res) => {

    const task_name = req.body["task"];

    const task = new Work({
        name : task_name,
        checkbox_status : false
    });

    task.save();

    //after adding the task in the database, we will redirect to "/" route where it will show the newly added task.
    res.redirect("/");
});

//This will remove the task from the database based on the id recieved from the frontend.
app.post("/update_task" , (req,res) => { 

    const delete_button_id = req.body.selected_deleted_button_id;

    async function delete_task(){
        await Work.deleteOne({ _id : delete_button_id });
    }

    delete_task();

    //after deleting the task in the database, we will redirect to "/" route where it will reflect the changes made.
    res.redirect("/");
});

//This will update the status of the checkbox
app.post("/update_checkbox" , (req,res) => { 

    const checkbox_id = req.body.selected_checkbox_id;
    let status;

    async function update_checkbox_status(){
        
        let record = await Work.findOne({_id : checkbox_id});
        status = record["checkbox_status"];

        if(status===false){
            await Work.updateOne({ _id : checkbox_id}, { $set: {checkbox_status : true } });
        }

        else{
            await Work.updateOne({ _id : checkbox_id}, { $set: {checkbox_status : false } });
        }
    }

    update_checkbox_status();

    //after deleting the task in the database, we will redirect to "/" route where it will reflect the changes made.
    res.redirect("/");
});


//This will start the server and it will represent the port number on which the local server is hosted.
app.listen(port , ()=>{
    console.log(`Listening at port ${port}`);
});