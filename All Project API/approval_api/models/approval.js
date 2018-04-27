var mongoose=require('mongoose');
var Schema= mongoose.Schema();
//create letsenrol schema and model
var Letsenrol_Schema= new mongoose.Schema({
	approval:{
		type:String

	},
	id:{
		type:Number
	}
});

var Letsenrol=mongoose.model('letsenrol',Letsenrol_Schema);
module.exports=Letsenrol;