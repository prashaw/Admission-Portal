var mongoose=require('mongoose');
var Schema= mongoose.Schema();

//create portal schema and model
var Portal_Schema= new mongoose.Schema({
	SSc_passing_year:{
		type:String
	},
	SSc_total_percnt:{
		type:Number
	},
	SSc_cgpa:{
		type:Number

	},
	Hsc_board:[
	{
		board_name:{
			type:String
		}
	}],
		
	Hsc_stream:[
	{
		stream_name:{
			type:String
		}
	}],

	Hsc_passing_year:{
		type:String
	},
	Hsc_total:{

		type:Number

	},
	Hsc_pcb_pcm_percnt:{
		type:Number
	},
	Ug_name:{
		type:String

	},
	Ug_admit_year:{
		type:String
	},
	Ug_university:{
		type:String
	},

	Ug_percnt:{
		type:Number
	},
	email:{
		type:String
	}

});

var Portal=mongoose.model('Academic',Portal_Schema);
module.exports=Portal;