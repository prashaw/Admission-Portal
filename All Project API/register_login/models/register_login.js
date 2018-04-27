var mongoose=require("mongoose");
var Schema=mongoose.Schema();
var bcrypt = require('bcrypt-nodejs'); // Import Bcrypt Package
var titlize = require('mongoose-title-case');
var validate = require('mongoose-validator');

// name validator
var nameValidator = 
[
     validate({
        validator: 'isLength',
        arguments: [3, 40],
        message: 'name should be between {ARGS[0]} and {ARGS[1]} characters'
    })
];
// User E-mail Validator
var emailValidator = [
    validate({
        validator: 'matches',
       arguments: /^\w+@[a-zA-Z_]+?\.com{1,3}$/,
        message: 'is not a valid email'
    }),
    validate({
        validator: 'isLength',
        arguments: [3, 30],
        message: 'Email should be between 3 and 25 characters'
    })
];
//username name validator
var usernameValidator = 
[
      validate({
    validator: 'isLength',
    arguments: [3, 25],
    message: 'Username should be between {ARGS[0]} and {ARGS[1]} characters'
  })
];

// Password Validator
var passwordValidator = [
    
    validate({
        validator: 'isLength',
        arguments: [8, 250],
        message: 'Password should be between {ARGS[0]} and {ARGS[1]} characters'
    })
];
var UserSchema=new mongoose.Schema(
	{
       name: { type: String, required: true,validate:nameValidator},
       username: { type: String, lowercase: true, required: true,validate:usernameValidator},
       password: { type: String, required: true,validate:passwordValidator},
       email:    { type: String, required: true, lowercase: true, unique: true,validate:emailValidator},
       active:   {type:Boolean,required:true,default:false },
       temporarytoken:{type:String,required:true}
       
	});

// Middleware to ensure password is encrypted before saving user to database
UserSchema.pre('save', function(next)
 {
    var user = this;

    if (!user.isModified('password')) return next(); // If password was not changed or is new, ignore middleware

    // Function to encrypt password 
    bcrypt.hash(user.password, null, null, function(err, hash) {
        if (err) return next(err); // Exit if error is found
        user.password = hash; // Assign the hash to the user's password so it is saved in database encrypted
        next(); // Exit Bcrypt function
    });
});
//compare password
UserSchema.methods.comparePassword=function(password)
 {
    return bcrypt.compareSync(password,this.password);
 };
//mongoose titlize validation
//validation
UserSchema.plugin(titlize, {
  paths: [ 'name' ] // Array of path
}) 

module.exports=mongoose.model("User",UserSchema);