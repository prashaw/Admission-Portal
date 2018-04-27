var express=require("express");
var router=express.Router();
var Letsenrol=require("../models/states.js");

//get a list of approval college

router.get("/states",function(req,res)
{
	Letsenrol.find({},function(err,data)
		{
          if(err) throw err;
		}).then(function(states)
		{
			res.send(states);
		});
		

});

//add approval college in 	database

router.post("/states",function(req,res)
{
  Letsenrol.create(req.body).then(function(states)
  {
  	res.send(states);
  });
});
//delete data from database
router.delete("/states/:id",function(req,res,next)
  {
     Letsenrol.findByIdAndRemove({_id:req.params.id}).then(function(states)
     {
     	res.send(states);
     	
     });
     
  });
  router.put("/states/:id",function(req,res,next)
  {
     Letsenrol.findByIdAndUpdate({_id:req.params.id},req.body).then(function(states)
     {
        Letsenrol.findOne({_id:req.params.id}).then(function(states)
        {
                res.send(states);
        });
      
      
     });
     
  });

module.exports=router;