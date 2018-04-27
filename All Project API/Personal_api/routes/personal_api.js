var express=require("express");
var router=express.Router();
var Portal=require("../models/personal.js");

//get a the acdemic details

router.get("/personaldetails/:email",function(req,res)
{
	Portal.find({'email':req.params.email}).then(function(err,data)
		{
        res.send(err);
           res.send(data);

    });
		

});



//add academic detail in 	database

router.post("/personaldetails",function(req,res)
{
  Portal.create(req.body).then(function(data)
  {

  	res.send(data);
  });
});
//update
  router.put("/personaldetails/:id",function(req,res,next)
  {
     Portal.findByIdAndUpdate({_id:req.params.id},req.body).then(function(data)
     {
        Portal.findOne({_id:req.params.id}).then(function(data)
        {
                res.send(data);
        });
      
      
     });
     
  });

module.exports=router;