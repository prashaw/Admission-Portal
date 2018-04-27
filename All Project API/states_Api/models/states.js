var mongoose=require("mongoose");
var Schema=mongoose.Schema();
var Letsenrol_Schema= new mongoose.Schema({
	id:{
		type:Number

	},
	text:{
		type:String
	}
});

var Letsenrol=mongoose.model('States',Letsenrol_Schema);
module.exports=Letsenrol;