var mongoose=require("mongoose");
var Schema=mongoose.Schema();
var Portal_Schema= new mongoose.Schema({
	id:{
		type:Number

	},
	coursename:{
		type:String
	}
});

var Portal=mongoose.model('courses',Portal_Schema);
module.exports=Portal;