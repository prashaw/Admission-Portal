var mongoose=require('mongoose');
var Schema= mongoose.Schema();
//create letsenrol schema and model
var Portal_Schema= new mongoose.Schema({
	course_name:{
		type:String
	},
	branch_name:{
		type:String
	},
	email:{
		type:String
	},
	college_name:{
		type:String
	},
	college_state:{
		type:String
	},
	college_city:{
		type:String
	},
	status:{
		type:String
	}


});

var Letsenrol=mongoose.model('ApplyColg',Portal_Schema);
module.exports=Letsenrol;