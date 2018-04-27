var express=require("express");
var router=express.Router();
var User=require("../models/register_login");
var jwt=require("jsonwebtoken");
var secret="anamika";
var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');
var crypto = require("crypto");

var options = {
  auth: {
    api_user: 'prashaw',
    api_key: 'anamika'
  }
}

var client = nodemailer.createTransport(sgTransport(options));


router.get("/users/:email",function(req,res)
{
  User.find({'email':req.params.email}).then(function(err,data)
    {
        res.send(err);
           res.send(data);

    });
    

});
router.post("/users",function(req,res)
{


   var user=new User();
        user.username = req.body.username; // Save username from request to User object
        user.password = req.body.password; // Save password from request to User object
        user.email = req.body.email; // Save email from request to User object
        user.name = req.body.name; // Save name from request to User object
        user.temporarytoken=jwt.sign({username:user.username,email:user.email},secret,{expiresIn:'24h'});
    if (req.body.username == null || req.body.username == '' || req.body.password == null || req.body.password == '' || req.body.email ==null || req.body.email == '' || req.body.name == null || req.body.name == '')
   {
    res.json({success:false, message:"ensure all fields were provided"});
   }
   else
   {
    
     user.save(function(err) 
        {
                if (err) 
              {

              
                    // Check if any validation errors exists (from user model)
                    if (err.errors != null)
                    {
                        if (err.errors.name) {
                            res.json({ success: false, message: err.errors.name.message }); // Display error in validation (name)
                        } else if (err.errors.email) {
                            res.json({ success: false, message: err.errors.email.message }); // Display error in validation (email)
                        } else if (err.errors.username) {
                            res.json({ success: false, message: err.errors.username.message }); // Display error in validation (username)
                        } else if (err.errors.password) {
                            res.json({ success: false, message: err.errors.password.message }); // Display error in validation (password)
                        } else {
                            res.json({ success: false, message: err }); // Display any other errors with validation
                        }
                    } else if (err) 
                    {
                        // Check if duplication error exists
                        if (err.code == 11000) {
                             {
                                res.json({ success: false, message: 'That user is already exists' }); // Display error if username already taken
                            } 
                        } else {
                            res.json({ success: false, message: err }); // Display any other error
                        }
                        //res.json({ success: false, message: err }); 
                  }
                        //res.json({ success: false, message: err }); 
                  
              }else
                 {
                  var email = {
                      from: 'Admission_Portal.com',
                      to: [user.email],
                      subject: 'User activation link',
                      text:  'Hello  ' +  user.name + ', thank you for registering at localhost.com. Please click on the following link to complete your activation:http://localhost:3000/api/activate/'+user.temporarytoken,
                      html: 'Hello<strong>'+user.name+'</strong> <br> Thank you for registering at Admission Portal. please click on the below link to complete the activation<br><br><a href="http://localhost:3000/#/activate/'+user.temporarytoken+'">http://localhost:3000/activate </a>'
                    };

                    client.sendMail(email, function(err, info){
                        if (err ){
                          console.log(error);
                        }
                        else {
                          console.log('Message sent: ' + info.response);
                        }
                    });
                   res.json({ success: true, message: "Account registered please check your email for activation link. " });
                 }
        });
   }
   

});


//user login route
router.post("/authenticate",function(req,res)
{
  User.findOne({username:req.body.username}).select('email username password active').exec(function(err,user)
  { 
    if(err) throw err;

    if(!user)
    {
      res.json({success:false,message:"could not authenticate user"});
    }
    else if(user)
    {
      if(req.body.password)
      {
      var validpassword=user.comparePassword(req.body.password);
      }
      else
      {
        res.json({success:false,message:"no password provided"});
      }
      if(!validpassword)
      {
        res.json({success:false,message:"could not authenticate password"});
      }else if(!user.active)
      {
        res.json({success:false,message:'Account is not yet activated. please check email for activation link'});
      }

      else
      {
       var token= jwt.sign({username:user.username,email:user.email},secret,{expiresIn:'24h'});
        res.json({success:true,message:"user authenticate", token:token});
      }
    }
  });
});
// Route to activate the user's account 
    router.put('/activate/:token', function(req, res) {
        User.findOne({ temporarytoken: req.params.token }, function(err, user) 
        {
            if (err) throw err;
            var token = req.params.token; // Save the token from URL for verification 
                // Function to verify the user's token
                jwt.verify(token, secret, function(err, decoded) {
                    if (err) {
                        res.json({ success: false, message: 'Activation link has expired.' }); // Token is expired
                    } else if (!user) {
                        res.json({ success: false, message: 'Activation link has expired.' }); // Token may be valid but does not match any user in the database
                    } else {
                        user.temporarytoken = false; // Remove temporary token
                        user.active = true; // Change account status to Activated
                        user.save(function(err){
                          if(err)
                          {
                            console.log(err);
                          }
                          else{
                            var email = {
                      from: 'Admission_Portal.com',
                      to: [user.email],
                      subject: 'User activation link',
                      text:  'Hello ' + user.name + ', your Account has been successfully activated',
                      html: 'Hello<strong>'+user.name+', your Account has been successfully activated'
                    };

                    client.sendMail(email, function(err, info){
                        if (err ){
                          console.log(error);
                        }
                        else {
                          console.log('Message sent: ' + info.response);
                        }
                    });

                            res.json({success:true,message:'Account activated'});
                          }
                        })
                        }
                      });
                    });
      });

// Route to send user's username to e-mail
    router.get('/resetusername/:email', function(req, res) {
        User.findOne({ email: req.params.email }).select('email name username').exec(function(err, user) {
            if (err) {
                res.json({ success: false, message: err }); // Error if cannot connect
            } else {
                if(!req.params.email)
                {
                  res.json({success:false,message:'no email was provided'});
                }
                else
                {
                if (!user) {
                    res.json({ success: false, message: 'E-mail was not found' }); // Return error if e-mail cannot be found in database
                } else {
                    // If e-mail found in database, create e-mail object
                    var email = {
                        from: 'Admission_Portal.com',
                        to: user.email,
                        subject: 'Localhost Username Request',
                        text: 'Hello ' + user.name + ', You recently requested your username. Please save it in your files: ' + user.username,
                        html: 'Hello<strong> ' + user.name + '</strong>,<br><br>You recently requested your username. Please save it in your files: ' + user.username
                    };

                    // Function to send e-mail to user
                    client.sendMail(email, function(err, info) {
                        if (err) {
                            console.log(err); // If error in sending e-mail, log to console/terminal
                        } else {
                            console.log(info); // Log confirmation to console
                        }
                    });
                    res.json({ success: true, message: 'Username has been sent to e-mail! ' }); // Return success message once e-mail has been sent
                }
              }
            }
        });
    });
    // Route to send user's username to e-mail
    router.get('/resetpassword/:email', function(req, res) 
    {
        User.findOne({ email: req.params.email }).select('email name username password').exec(function(err, user)
         {
            if (err) {
                res.json({ success: false, message: err }); // Error if cannot connect
            } else
             {
                if(!req.params.email)
                {
                  res.json({success:false,message:'no email was provided'});
                }
                else
                {
                  if (!user) {
                    res.json({ success: false, message: 'E-mail was not found' }); // Return error if e-mail cannot be found in database
                    } else {
                    // If e-mail found in database, create e-mail object
                        var id = crypto.randomBytes(4).toString('hex');
                         user.password=id;
                         user.save(function(err){
                          if(err)
                          {
                            console.log(err);
                          }
                          else{
                         var email = {
                        from: 'Admission_Portal.com',
                        to: user.email,
                        subject: 'Localhost password Request',
                        text: 'Hello ' + user.name + ', You recently requested your password. Please save it in your files: ' + id,
                        html: 'Hello<strong> ' + user.name + '</strong>,<br><br>You recently requested your password. Please save it in your files: ' + id
                    };

                    client.sendMail(email, function(err, info){
                        if (err ){
                          console.log(error);
                        }
                        else {
                          console.log('Message sent: ' + info.response);
                        }
                    });

                            res.json({ success: true, message: 'password has been sent to e-mail! ' }); // Return success message once e-mail has been sent
                          }
                        })
                     }
                 }
              }
         });
     });
router.use(function(req,res,next)
{
  var token =req.body.token||req.body.query||req.headers['x-access-token'];
  
  if (token) 
    {
      jwt.verify(token,secret,function(err,decoded)
      {
        if(err)
        {
          res.json({success:false,message:"Token invalid"});

        }else
        {
          req.decoded=decoded;
          next();
        }
      });
    }else{
      res.json({success:false,message:"no token provided"});
      
    }


});
 
router.post("/me",function(req,res)
{
  res.send(req.decoded);
});
module.exports=router;