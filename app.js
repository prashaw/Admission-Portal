var express=require("express");
//set up express app
var app=express();
var mongoose=require("mongoose");
var passport=require("passport");
var social=require("./All Project API/passport/passport")(app,passport);
var bodyParser=require("body-parser");
var routes=require("./All Project API/approval_api/routes/api.js");
var state_routes=require("./All Project API/states_Api/routes/state_Api.js");


var applycolg=require("./All Project API/applycolg_api/routes/apply_api.js");
var acdemicdetails=require("./All Project API/Personal_api/routes/personal_api.js");

var personaldetails=require("./All Project API/Academic_api/route/academic_api.js");
var course=require("./All Project API/courses_Api/routes/course_api.js");
var exam=require("./All Project API/exam_api/routes/exam_api.js");
var user_rgister=require("./All Project API/register_login/routes/register_api.js");
//connect to mongodb
mongoose.connect("mongodb://localhost/Admission_portal",{ useMongoClient: true },function(err)
	{
		if (err)
		{
			console.log("not connected to the database" + err);
		}else
		{
			console.log("connected");
		}
	});

mongoose.Promise=global.Promise;
app.use(express.static(__dirname+'/Admission Portal'));
app.use(bodyParser.json());
app.use("/api",require("./All Project API/approval_api/routes/api.js"));
app.use("/api",require("./All Project API/states_Api/routes/state_Api.js"));

  
app.use("/api",require("./All Project API/applycolg_api/routes/apply_api.js"));
app.use("/api",require("./All Project API/Personal_api/routes/personal_api.js"));

app.use("/api",require("./All Project API/Academic_api/route/academic_api.js"));
app.use("/api",require("./All Project API/courses_Api/routes/course_api.js"));
app.use("/api",require("./All Project API/exam_api/routes/exam_api.js"));
app.use("/api",require("./All Project API/register_login/routes/register_api.js"));
// listen for request
 app.listen(process.env.port || 3000,function()
 {
 	console.log("now listening for request");
 });
