const express=require("express");
const app=express();
const path=require("path");
const dotenv=require("dotenv");
const mongoose=require("mongoose")

dotenv.config();
const PORT=process.env.PORT||3000;


app.use(express.static(path.join(__dirname,"public")));
app.get("/",(req,res)=>{
   // res.json({
   //     message:"hello world"
   // });
   res.sendFile(path.join(__dirname,"public","try.html"));
});

app.listen(3000,()=>{
    console.log("server is running on port 3000");
    mongoose.connect(process.env.MONGODB_URI,{
        useNewUrlParser:true,
        useUnifiedTopology:true,
    }).then(()=>{
        console.log("mongodb connected");
    }).catch((error)=>{
        console.log(error);
    });
});
