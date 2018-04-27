var express=require("express");
var router=express.Router();
var Letsenrol=require("../models/applycolg.js");
 


router.get("/applycolg/:email",function(req,res)
{
      Letsenrol.find({'email':req.params.email}).then(function(err,data)
      {
          res.send(err);
           res.send(data);

      });
});


//add approval college in 	database

router.post("/applycolg",function(req,res)
{
  Letsenrol.create(req.body).then(function(colg)
  {
  	res.send(colg);
  });
});


module.exports=router;