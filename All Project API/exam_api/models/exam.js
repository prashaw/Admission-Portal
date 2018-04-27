var mongoose=require("mongoose");
var Schema=mongoose.Schema();
var Portal_Schema= new mongoose.Schema({
	id:{
		type:Number

	},
	ex:{
		type:String
	}
});

var Portal=mongoose.model('exam',Portal_Schema);
module.exports=Portal;