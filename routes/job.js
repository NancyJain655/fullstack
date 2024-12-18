const express=require("express");
const router=express.Router();
const Job=require("../schema/job.schema")
const authMiddleware=require("../middleware/auth")
const dotenv=require("dotenv")
dotenv.config()
router.get("/",async(req,res)=>{
    const jobs=await Job.find();
    res.status(200).json(jobs)
});
router.get("/:id",async(req,res)=>{
    const {id}=req.params;
    const job=await Job.findById(id);
    if(!job){
        return res.status(404).json({message:"job not found"});
    }
    res.status(200).json(job);

});
router.delete("/:id",async(req,res)=>{
    const {id}=req.params;
    const job= await Job.findById(id);
    const userId=req.user.id;
    if(!job){
        return rex.status(404).json({message:"job not found"});
    }
    if(userId!==job.user.toString()){
        return res.status(401).json({message:"you are not authorised to delete this job"});
    }
    await Job.deleteOne({_id:id});
    res.status(200).json({message:"job deleted"});
});
router.post("/",authMiddleware,async (req,res)=>{
    const {companyName,jobPosition,salary,jobType}=req.body;
    if(!companyName|| !jobPosition|| !salary|| ! jobType){
        return res.status(400).json({message:"missing required fields"});
    }
    try{
    const user=req.user;
     const job= await Job.create({
        companyName,
        jobPosition,
        salary,
        jobType,
        user:user.id,

    });
    res.status(200).json(job);
} catch(err){
    console.log(err);
       res.status(500).json({message:"error in creating job"});
}
});
router.put("/:id",authMiddleware,async (req,res)=>{
    const {id}=req.params;
    const {companyName,jobPosition,salary,jobType}=req.body;
    const userId=req.user.id;
    const job= await Job.findById(id);
    if(!job){
        return res.status(404).json({message:"job not found"});
    }
    if(job.user.toString()!== userId){
        return res.status(401).json({message:"you are not authorised to update this job"});
    }
    try{
         
         await Job.findByIdAndUpdate(id,{
            companyName,
            jobPosition,
            salary,
            jobType,
        });
        res.status(200).json({message:"job updated"});
    } catch(err){
           res.status(500).json({message:"error in updating job"});
    }

})
module.exports=router;
