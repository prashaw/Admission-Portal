var mongoose=require('mongoose');
var Schema= mongoose.Schema();

//create portal schema and model
var Portal_Schema= new mongoose.Schema({
	name:{
		type:String
	},
	dateofbirth:{
		type:Date

	},
	email:{
		type:String,lowercase: true, required: true,unique: true
	},
	secondary_email:{
		type:String,lowercase: true,unique:true
	},
	mobile_number:{
		type:Number
	},
	father_name:{

		type:String

	},
	mother_name:{
		type:String
	},
	address:{
		type:String

	},
	lane1:{
		type:String
	},
	lane2:{
		type:String
	},

	state:{
		type:String
	},
	city:{
		type:String
	},
	pincode:{
		type:Number
	}

});

var Portal=mongoose.model('Personal',Portal_Schema);
module.exports=Portal;