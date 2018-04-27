var FacebookStrategy = require('passport-facebook').Strategy; // Import Passport-Facebook Package
var TwitterStrategy = require('passport-twitter').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var session=require("express-session");
var jwt=require("jsonwebtoken");
var secret="anamika";
var User=require('../register_login/models/register_login');



module.exports=function(app,passport)
{
       // Start Passport Configuration Settings
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: true, cookie: { secure: false } }));
// End Passport Configuration Settings
 passport.serializeUser(function(user, done)
 {
 	 token= jwt.sign({username:user.username,email:user.email},secret,{expiresIn:'24h'});
 	done(null,user.id);
 });

  // Deserialize Users once logged out    
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user); // Complete deserializeUser and return done
        });
    });
		passport.use(new FacebookStrategy({
		    clientID: '140772506556774',
		    clientSecret: "2ec974d80f7ea19aeead7c9ed2b1adf8",
		    callbackURL: "http://localhost:3000/auth/facebook/callback",
		    profileFields: ['id','name' ,'photos', 'email']		 
		     },
		   function(accessToken, refreshToken, profile, done)
		   {
		   console.log(profile);	

		    // find the user in the database based on their facebook id
            User.findOne( {email:profile._json.email} , function(err, user) 
            {

                // if the user is found, then log them in
                if(user && user !== null) {
                    return done(null, user); // user found, return that user
                } else {
                    var newUser = new User();
					    newUser.name =profile._json.first_name; //to split FB name and get just first name
					    newUser.username =profile._json.first_name;
					    newUser.password=accessToken;
					   newUser.email = profile._json.email;
					   newUser.active=true;
					   newUser.temporarytoken=false;
                    // save our user to the database
                    newUser.save(function(err) {
                    	console.log(newUser);
                         if(err){
					     //console.log(err);
					     done(err);
					    } else{
					     console.log("saving new user...");
					     done(null, newUser);
                        }
                    });
                }

            });
		    
           }
		));



        //twitter configuration
  
		passport.use(new TwitterStrategy({
		    consumerKey: 'Q7vKr6DvThuDQXzGqKolgn3ap',
		    consumerSecret:"W9P5pc82YDM0mhPvAyUKY1vKoZSa8NlfRSv0PqbmHdtTgOCVjN",
		    callbackURL: "http://localhost:3000/auth/twitter/callback",
		   userProfileURL: "https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true"
		  },
		  function(token, tokenSecret, profile, done) {
		  
		  	 User.findOne({email:profile._json.email}).select('username password email').exec(function(err,user)
		    {
                 console.log(profile);
		    	if (err) done (err);
		    	if(user && user!=null)
		    	{
		    		done(null,user);

		    	}else
		    	{
		    		var newUser = new User();
					    newUser.name =profile._json.name; //to split FB name and get just first name

					   newUser.username =profile.displayName; //Fb name's 0th index is first name
					   newUser.password= token;
					   newUser.email = profile._json.email;
					   newUser.active=true;
					   newUser.temporarytoken=false;
                    // save our user to the database
                    newUser.save(function(err) {
                    	console.log(newUser);
                         if(err){
					     //console.log(err);
					     done(err);
					    } else{
					     console.log("saving new user...");
					     done(null, newUser);
                        }
                    });
		    	}
		    });
		  }
		));
		//end of twitter configuration

		//google configuration
		
        passport.use(new GoogleStrategy({
	    clientID: "745545086054-qdl6tj0qdjv8rvbt0h10ab8mqgvhf57l.apps.googleusercontent.com",
	    clientSecret: "NTjTRLzQbtpW8fJY_iyU2FDW",
	    callbackURL: "http://localhost:3000/auth/google/callback",

       scope: ['https://www.googleapis.com/auth/userinfo.profile','https://www.googleapis.com/auth/userinfo.email']
	  },
		   function(accessToken, refreshToken, profile, done) {
		   	console.log(profile.emails[0].value);
		   	console.log(profile._json.displayName);
		   	console.log(profile._json.email);

		      User.findOne({email:profile.emails[0].value}).select('displayName password email').exec(function(err,user)
		    {
                console.log(profile);
		    	if (err) done (err);
		    	if(user && user!=null)
		    	{
		    		done(null,user);

		    	}else
		    	{
		    		var newUser = new User();
					    newUser.name =profile._json.displayName; //to split FB name and get just first name

					   newUser.username =profile._json.displayName; //Fb name's 0th index is first name
					   newUser.password= accessToken;
					   newUser.email = profile.emails[0].value;
					   newUser.active=true;
					   newUser.temporarytoken=false;
                    // save our user to the database
                    newUser.save(function(err) {
                         if(err){
					     console.log(err);
					     done(err);
					    } else{
					     console.log("saving new user...");
					     done(null, newUser);
                        }
                    });
		    	}
		    });
		  }
	   ));
      //end of google configuration 

        //google routes
        app.get('/connect/google', passport.authenticate('google', {scope: ['https://www.googleapis.com/auth/userinfo.profile','https://www.googleapis.com/auth/userinfo.email']}));
         // app.get('/auth/google', passport.authenticate('google', { scope:  [' https://www.googleapis.com/auth/plus.login', 'profile', 'email']}));
          app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/#/googleerror' }),function(req, res) 
          {
		    res.redirect('/#/google/'+token);
		  });	
        //end of google routes
		

		//twitter routes
		
		app.get('/auth/twitter', passport.authenticate('twitter'));
		app.get('/auth/twitter/callback',passport.authenticate('twitter', {failureRedirect: '/#/twittererror' }),function(req,res)
		{
			res.redirect('/#/twitter/'+token);
		});

		
		//facebook routes
		app.get('/auth/facebook',passport.authenticate('facebook', { scope: 'email' }));
		app.get('/auth/facebook/callback', passport.authenticate('facebook', {failureRedirect: '/#/facebookerror' }),function(req,res)
		{
			res.redirect('/#/facebook/'+token);
		});

		   return passport;
}