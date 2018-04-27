var express=require("express");
var router=express.Router();
var Letsenrol=require("../models/approval.js");
 
//get a list of approval college

router.get("/approval",function(req,res)
{
	Letsenrol.find({},function(err,data)
		{
          if(err) throw err;
		}).then(function(approval)
		{
			res.send(approval);
		});
		

});

//add approval college in 	database

router.post("/approval",function(req,res)
{
  Letsenrol.create(req.body).then(function(approval)
  {
  	res.send(approval);
  });
});
//delete data from database
router.delete("/approval/:id",function(req,res,next)
  {
     Letsenrol.findByIdAndRemove({_id:req.params.id}).then(function(approval)
     {
     	res.send(approval);
     	
     });
     
  });
  router.put("/approval/:id",function(req,res,next)
  {
     Letsenrol.findByIdAndUpdate({_id:req.params.id},req.body).then(function(approval)
     {
        Letsenrol.findOne({_id:req.params.id}).then(function(approval)
        {
                res.send(approval);
        });
      
      
     });
     
  });

module.exports=router;