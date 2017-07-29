var express = require('express');
var router = express.Router();
var router1=express.Router();
var jsdom = require("jsdom").jsdom;
var window = jsdom().defaultView;
var HashMap = require('hashmap').HashMap;
var map = new HashMap();
var dialog=require('dialog');
var app = express();
var shuffle = require('shuffle-array');
//var paginate = require('express-paginate');
var paginate = require('pagination');
var session      = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var paginator = paginate.create('search', {prelink:'/playJava', current: 1, rowsPerPage: 5, totalResult: 10020});
var config = require('./config.js'); //config file contains all tokens and other private info
var funct = require('./index.js'); //funct file contains our helper functions for our Passport and database work
var bcrypt = require('bcryptjs');
var Q = require('q');
var config = require('./config.js'); //config file contains all tokens and other private info
var isUser=0;
var isAdmin=0;
var log4js = require( "log4js" );
var user;
log4js.configure( "./node_modules/Log4js/lib/log4js.json" );
var logger = log4js.getLogger( "test-file-appender" );
// log4js.getLogger("app") will return logger that prints log to the console
logger.debug("Hello log4js");// store log in file

var PropertiesReader = require('properties-reader');
var properties = PropertiesReader('./prop/property.file');

/*var logger = require('./logger');*/
  
//var logger = require('./log');
var sendgrid  = require('sendgrid')('inalanandita@gmail.com','9676910694','');
var email = new sendgrid.Email();

email.addTo("inala.n99@gmail.com");
email.setFrom("inalanandita@gmail.com");
email.setSubject("Sending with SendGrid is Fun");
email.setHtml("and easy to do anywhere, even with Node.js");

sendgrid.send(email);
var prop_java=properties.get('timer.timer.java');
var prop_testing=properties.get('timer.timer.testing');
var prop_c=properties.get('timer.timer.c');
var prop_vbscript=properties.get('timer.timer.vbscript');
var prop2=properties.get('session.session.time');
//app.use(app.router);

/*
 var monk = require('monk');
 var db = monk('mongodb://localhost:27017/Test');
 */
/*app.use(passport.initialize());
 app.use(passport.session());*/ // persistent login sessions
//app.use(flash()); // use connect-flash for flash messages stored in session
//var db = require('orchestrate')(config.db); //config.db holds Orchestrate token



//var document=require("document");
//var overlay = jsdom.("Quiz");
//overlay.style.visibility = "visible";

//gui = require('nw.gui');
//var alert = require('alert');
//var d = new dialog(window.jQuery);

//var timer=new Timer();


router.get('/', function(req, res) {
    console.log("hello timeup");
    logger.debug("login page");
    logger.debug("timer time"+prop2);
    /*logger.debug("hey home page");
    logger.debug('Running out of memory...');*/
    //logger.info('hello timeup log file');
    res.render("login", {
        title: 'Welcome Freshers Gate',
        "admin":isAdmin,
        "prop2":prop2

    });
});
/*router.get('/dashboard', function(req, res) {
    
    
    console.log("in dashboard");
    res.render("Dashboard.jade", {
        title:"Dashboard"
        

    });
});*/
/*router.post('/loginUser', passport.authenticate('local-signup', {

 successRedirect: '/timeup',
 failureRedirect: '/error',
 successFlash:'Welcome!',
 failureFlash : true
 })
 );*/
/*router.post('/loginUser', passport.authenticate('local-signup', {
 // This is the default destination upon successful login.
 successRedirect: '/',
 failureRedirect: '/error',
 successFlash: 'Welcome!',
 failureFlash: true
 }));*/

/* req.logIn(user, function(err){
 if (err) { return next(err); }
 });

 });

 */
router.post('/loginUser',function(req,res){
    passport.authenticate('local-signup')(req,res,function(){
        if(isUser==1 ){
            console.log("aftere local sign up");
            isUser=0;
            logger.debug("isAdmin"+isAdmin);
            logger.debug("timer time"+prop2);
            res.render("timeup", {
                title: 'Welcome Freshers Gate',
                "admin":isAdmin,    
                "prop2":prop2
            });

        }else{
            res.render("login", {
                title: 'Invalid Username or Password'


            });
        }

    })
});
router.post('/signupUser',function(req,res){
    console.log("am inside signupuser");
// Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var username = req.body.username1;
    user=username;
    var  manager=req.body.manager;
    var password1 = req.body.password;
    var password2=req.body.password_confirm;
    /* if(password1 !=password2){
     res.render("error", {
     title: 'Freshers Gate'


     });
     }*/

    var collection = db.get('Users');
    console.log("username"+username);
    collection.find({"username":username},function(e,docs){
        console.log("docs.len"+docs.length);
        if(docs.length ==0){
            collection.insert({

                "username": username,
                "manager":manager,
                "password": password1
            }, function (err, doc) {

                if (err) {
                    console.log("error in adding"+username);
                    // If it failed, return error
                    res.send("There was a problem adding the information to the database.");
                

            /* res.render("login", {
             title: 'Freshers Gate'


             });*/

            
            }
                else {
                        sendgrid.send({
                              to:       'inalanandita@gmail.com',
                              from:     'inala.n99@gmail.com',
                              subject:  'Hello World',
                              text:     'My first email through SendGrid.'
                            }, function(err, json) {
                              if (err) { return console.error(err); }
                              console.log(json);
                            });
                logger.debug("entering mail block");
                
                    logger.debug("added"+username);
                    res.render("login", {
                        title: 'Freshers Gate'


                    });
                }
            });

        }else{
            console.log("username already exists");
            res.render('login',{
                title:"Username already exists"
            });
        }


    });

});
/*logIn = function(user, options, done) {
 if (!this._passport) throw new Error('passport.initialize() middleware not in use');

 if (!done && typeof options === 'function') {
 done = options;
 options = {};
 }
 options = options || {};
 var property = this._passport.instance._userProperty || 'user';
 var session = (options.session === undefined) ? true : options.session;

 this[property] = user;
 if (session) {
 var self = this;
 this._passport.instance.serializeUser(user, function(err, obj) {
 if (err) { self[property] = null; return done(err); }
 self._passport.session.user = obj;
 done();
 });
 } else {
 done && done();
 }
 }*/

router.get('/timeup', function(req, res) {
    console.log("hello timeup");
    logger.debug("logout timeup again");
    res.render("timeup", {
        title: 'Timeup Freshers Gate',
        "admin":isAdmin,
		"prop2":prop2
        

    });
});
passport.serializeUser(function(user, done) {
    console.log("serializing " + user.username);
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    console.log("deserializing " + obj);
    done(null, obj);
});
ensureAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) { return next(); }

    // If the user is not authenticated, then we will start the authentication
    // process.  Before we do, let's store this originally requested URL in the
    // session so we know where to return the user later.

    req.session.redirectUrl = req.url;

    // Resume normal authentication...

    logger.info('User is not authenticated.');
    req.flash("warn", "You must be logged-in to do that.");
    //res.redirect('/timeup');
}
passport.use('local-signup', new LocalStrategy(
    {passReqToCallback : true}, //allows us to pass back the request to the callback
    function(req, username, password, done) {
        console.log("am inside passport local signup");
        console.log("username"+username);
        console.log("password"+password);
        user=username;
        var db=req.db;
        var collection=db.get("Users");
        collection.find({"username":username},function(e,docs){
            console.log("docs"+docs.length);
            if(docs.length!=0) {
                console.log(docs[0].username );
                console.log(docs[0].password);
                if (docs[0].username == username) {
                    if (docs[0].password == password) {
                        console.log("LOGGED IN AS: " + username);
                        // req.session.success = 'You are successfully logged in ' + username + '!';

                        console.log(done(null, docs));
                        isUser=1;
                        if(docs[0].username =="admin"){
                            isAdmin=1;
                        }
                        else{
                            isAdmin=0;
                        }
                        done(null, docs);

                    } else {
                        console.log("invalid password");
                        //done(null, username);
                        done(null, docs);
                    }


                }
            }else{

                console.log("LOG IN FAILED: " + username);
                req.session.failure = "UNSUCCESSFULL LOGIN" + username + '!';
                req.session.redirectUrl = req.url;
                req.flash("warn", "Unsuccessful login.");
                done(null, docs);
            }





        });


    }
));
router.localAuth = function (username, password) {
    console.log("am in localAuth indexjs");
    //var deferred = Q.defer();



}
exports.localReg = function (username, password) {
    var deferred = Q.defer();
    var hash = bcrypt.hashSync(password, 8);
    var user = {
        "username": username,
        "password": hash,
        "avatar": "http://placepuppy.it/images/homepage/Beagle_puppy_6_weeks.JPG"
    }
    //check if username is already assigned in our database
    db.get('Local-Users', username)
        .then(function (result){ //case in which user already exists in db
            console.log('username already exists');
            deferred.resolve(false); //username already exists
        })
        .fail(function (result) {//case in which user does not already exist in db
            console.log(result.body);
            if (result.body.message == 'The requested items could not be found.'){
                console.log('Username is free for use');
                db.put('local-users', username, user)
                    .then(function () {
                        console.log("USER: " + user);
                        deferred.resolve(user);
                    })
                    .fail(function (err) {
                        console.log("PUT FAIL:" + err.body);
                        deferred.reject(new Error(err.body));
                    });
            } else {
                deferred.reject(new Error(result.body));
            }
        });

    return deferred.promise;
};


/* jsdom.env(
    "https://iojs.org/dist/",
    ["http://code.jquery.com/jquery.js"],
    function (errors, window) {
        console.log("there have been", window.$("a").length - 4, "io.js releases!");
    }
); */
/*
 router.post('/loginUser', function(req, res) {
 console.log("am here inside loginUser");
 });
 */



router.post('/Quiz', function(req, res) {

    // set our internal db variable
    var db = req.db;
    var url=req.url;
    var id=req.body.questionNumber;
    var qName=req.body.questionName;
    var collection = db.get('Collection_MPF_Quiz');
    var qs=req.body.technology;
    /*console.log(JSON.Stringify(qs));
     var qSt=(JSON.Stringify(qs)).split(",");
     console.log("tech"+qs.toString()+m);*/
    /* var qSt=qs.split(",");*/

    console.log("technology selected"+qs[0]);

    collection.find({"Technology":qs[0]},function(e,docs){
        //console.log(docs);
        // var question = docs[0];
        //console.log("id href"+id);

        var i= 0,c=20;
        var qId=docs;
        var marks=0;
        var totalMarks=0;
        var x=0;
        var percent=0;
        var grad;
        while(qId[x]!=null && x<docs.length){
                  totalMarks=totalMarks+qId[x].Complexity;  
                  x++;
                }
        while(i<=docs.length-1) {
            
                
                var radioButton = "option" + c.toString();
                var radioName1 = req.body.valueOf(radioButton);
                
                
                var sam = JSON.stringify(radioName1);
                //console.log("indexOf"+sam.indexOf("],"));
                //console.log(sam);
                var sam2 = sam.split("],");
                var sam3 = sam2[3];
                var sam4 = sam3.split(",\"");
                logger.debug("question number"+id);
                logger.debug("sam4.length"+sam4.length);
                for (var j = 0; j <= sam4.length; j++) {
                qId.forEach(function (qId) {
                //logger.debug("sam4"+sam4[0]);
                if (id[j] == qId._id) {
                    
                    
                        var sam5 = sam4[j].split(":");
                        logger.debug("sam5" + sam5[1]);

                        var sam8 = (sam5[0].replace('option', '')).replace(/"/gi, '');
                        var sam9 = (sam5[1].replace(/"/gi, '').replace(/"/gi, '').replace(/}/gi, '').trim());
                        //console.log(sam9);
                        map.set(sam8, sam9);
                        logger.debug(" map"+map.get(sam8));
                        logger.debug("qId.Answer"+qId.Answer);
                        console.log("qId.Answer"+qId.Answer);
                        console.log("sam9"+sam9);
                        /*for (var k = 0; k < 2; k++) {
                            
                            logger.debug("db" + qId.Answer + qId.QuestionId);
                            logger.debug(sam8 + "-------" + qId.QuestionId);*/
                            if (sam9 == qId.Answer) {
                                marks = marks + (qId.Complexity) * 1;
                                logger.debug("marks"+marks);
                                
                                
                            }
                       // }
                        


                    

                }




            });
            c++;
            i++
        }
    }
        percent=Math.round((marks/totalMarks)*100);
        if(percent>=80 && percent<90){
            grad="B";
            logger.debug("grad"+grad);
        }
        else if(percent>=90 && percent<=99){
            grad="A";
            logger.debug("grad"+grad);
        }
        else if(percent==100){
            grad="A+";
            logger.debug("grad"+grad);
        }
        else{
            grad="C";
            logger.debug("grad"+grad);
        }
        console.log("marks in percent"+percent);
        console.log("marks"+marks);
        console.log("user"+user);
        var db = req.db;
        var url=req.url;

        var collection = db.get('Score_Reports');
        collection.find({"Resource_Mail_Id":user},function (err, docs) {

        if(docs.length==0){
           collection.insert({

                "Resource_Mail_Id": user,
                
                "Score":[
                marks
                ],
                "Attempts":[
                1
                ],
                "Technology":[qs[0]]
            },function(err, doc){
                if (err) {
                console.log(err);
                // If it failed, return error
                res.send("There was a problem inserted the information to the database.");
            }
            
            });
        }
        else{
            collection.update({"Resource_Mail_Id":user},
                {$push:{"Score":marks,"Attempts":1,"Technology":qs[0]}

            },function(err, doc){
                if (err) {
                console.log(err);
                // If it failed, return error
                res.send("There was a problem inserted the information to the database.");
            }
            
            });
        }
            
        });
        res.render("score", {
            title: 'Score Card',
            "marks": marks,
            "technology":qs[0],
            "admin":isAdmin,
            "totalMarks":totalMarks,
            "percentage":percent+"%",
            "grad":grad,
            "prop2":prop2
        });
    });


});


router.post('/reportScore', function(req, res) {
    var db = req.db;
    var url=req.url;

    var collection = db.get('Score_Reports');
    console.log("marks from score card"+req.body.marks);
    console.log("am here inside report score");
    console.log("usermail"+req.body.usermail);
    console.log("managermail"+req.body.managermail);
    console.log("technology attempted"+req.body.technology);
    var usermailId=req.body.usermail;
    var managermail=req.body.managermail;
    var marksScored=req.body.marks;
    var tech1=req.body.technology;
    collection.find({"Resource_Mail_Id":usermailId},function (err, docs) {

        if(docs.length==0){
           collection.insert({

                "Resource_Mail_Id": usermailId,
                "Manager_Mail_Id": managermail,
                "Score":[
                marksScored
                ],
                "Attempts":1,
                "Technology":tech1
            },function(err, doc){
                if (err) {
                console.log(err);
                // If it failed, return error
                res.send("There was a problem inserted the information to the database.");
            }
            else{
                console.log("inserted successfully ");
                res.render("timeup");
            }
            });
        }
        else{
            collection.update({"Resource_Mail_Id":usermailId},
                {$push:{"Score":marksScored,"Attempts":1,"Technology":tech1}

            },function(err, doc){
                if (err) {
                console.log(err);
                // If it failed, return error
                res.send("There was a problem inserted the information to the database.");
            }
            else{
                console.log("updated successfully ");
                res.render("timeup");
            }
            });
        }
            
        });
    
    });
    
  var addingQuestion3=function(req,collection){
            console.log("req.body.question"+req.body.question3)
            console.log("req.body.anwser"+req.body.answer3);
            console.log("req.body.complexity"+req.body.complexity3);
            var sec=req.body.selectedOption3;
            if(sec ==4){
            var optionSec=[req.body.option31,
                req.body.option32,
                req.body.option33,
                req.body.option34]


        }
        else if(sec ==2){
            var optionSec=[req.body.option35,
                req.body.option36]
        }
        else{
            var optionSec=[req.body.option37,
                req.body.option38,
                req.body.option39,
                req.body.option310,
                req.body.option311
            ]
        }

        collection.insert({

            "Technology" : req.body.tech,
            "Question":req.body.question3,
            "Answer":req.body.answer3,
            "Complexity":req.body.complexity3,
            "Options":optionSec

        }, function (err, doc) {

            if (err) {
                console.log(err);
                // If it failed, return error
                res.send("There was a problem adding the information to the database.");
            }
            else{
                console.log("successfully added question3");
                return;
            }
            
        });
    };
        
    var addingQuestion4=function(req,collection){
            console.log("req.body.question"+req.body.question4)
            console.log("req.body.anwser"+req.body.answer4);
            console.log("req.body.complexity"+req.body.complexity4);
            var sec=req.body.selectedOption4;
            if(sec ==4){
            var optionSec=[req.body.option41,
                req.body.option42,
                req.body.option43,
                req.body.option44]


        }
        else if(sec ==2){
            var optionSec=[req.body.option45,
                req.body.option46]
        }
        else{
            var optionSec=[req.body.option47,
                req.body.option48,
                req.body.option49,
                req.body.option410,
                req.body.option411
            ]
        }

        collection.insert({

            "Technology" : req.body.tech,
            "Question":req.body.question4,
            "Answer":req.body.answer4,
            "Complexity":req.body.complexity4,
            "Options":optionSec

        }, function (err, doc) {

            if (err) {
                console.log(err);
                // If it failed, return error
                res.send("There was a problem adding the information to the database.");
            }
            else{
                console.log("successfully added question4");
                return;
            }
            
        });
    };  
    








router.post('/addQuestion', function(req, res) {
    var db = req.db;
    var url=req.url;

    var collection = db.get('Collection_MPF_Quiz');
    var numberOfQuestions=req.body.noq;
    console.log("req.body.noq"+numberOfQuestions);
    if(numberOfQuestions == 1){
        addingQuestion1(req,collection);
        //res.render("timeup");
        res.redirect('/timeup');
        
    }
    else if(numberOfQuestions == 2){
        addingQuestion1(req,collection);
        addingQuestion2(req,collection);
        //res.render("timeup");
        res.redirect('/timeup');
        
    }
    else if(numberOfQuestions ==3){
        addingQuestion1(req,collection);
        addingQuestion2(req,collection);
        addingQuestion3(req,collection);
        //res.render("timeup");
        res.redirect('/timeup');
    }
    else if(numberOfQuestions ==4){
        addingQuestion1(req,collection);
        addingQuestion2(req,collection);
        addingQuestion3(req,collection);
        addingQuestion4(req,collection);
        //res.render("timeup");
        res.redirect('/timeup');
    }
    else{
        addingQuestion1(req,collection);
        addingQuestion2(req,collection);
        addingQuestion3(req,collection);
        addingQuestion4(req,collection);
        addingQuestion5(req,collection);
        //res.render("/");
        res.redirect('/timeup');
    }
    console.log("reached calling function");
    
    
});
var addingQuestion1=function(req,collection){
            console.log("req.body.tech"+req.body.tech);
            console.log("req.body.question"+req.body.question1)
            console.log("req.body.anwser"+req.body.answer1);
            console.log("req.body.complexity"+req.body.complexity1);
            var sec=req.body.selectedOption1;
            console.log("sec"+sec);
            if(sec ==4){
            var optionSec=[req.body.option11,
                req.body.option12,
                req.body.option13,
                req.body.option14]


        }
        else if(sec ==2){
            var optionSec=[req.body.option15,
                req.body.option16]
        }
        else{
            var optionSec=[req.body.option17,
                req.body.option18,
                req.body.option19,
                req.body.option110,
                req.body.option111
            ]
        }
        console.log("inserting docs");
        collection.insert({

            "Technology" : req.body.tech,
            "Question":req.body.question1,
            "Answer":req.body.answer1,
            "Complexity":req.body.complexity1,
            "Options":optionSec

        }, function (err, doc) {

            if (err) {
                console.log(err);
                // If it failed, return error
                res.send("There was a problem adding the information to the database.");
            }
            else{
                console.log("successfully added question1");
                return;
            }
            
        });
    };
    var addingQuestion2=function(req,collection){
            console.log("req.body.question"+req.body.question2)
            console.log("req.body.anwser"+req.body.answer2);
            console.log("req.body.complexity"+req.body.complexity2);
            var sec=req.body.selectedOption2;
            if(sec ==4){
            var optionSec=[req.body.option21,
                req.body.option22,
                req.body.option23,
                req.body.option24]


        }
        else if(sec ==2){
            var optionSec=[req.body.option25,
                req.body.option26]
        }
        else{
            var optionSec=[req.body.option27,
                req.body.option28,
                req.body.option29,
                req.body.option210,
                req.body.option211
            ]
        }

        collection.insert({

            "Technology" : req.body.tech,
            "Question":req.body.question2,
            "Answer":req.body.answer2,
            "Complexity":req.body.complexity2,
            "Options":optionSec

        }, function (err, doc) {

            if (err) {
                console.log(err);
                // If it failed, return error
                res.send("There was a problem adding the information to the database.");
            }
            else{
                console.log("successfully added question2");
                return;
            }
            
        });
    };
    var addingQuestion3=function(req,collection){
            console.log("req.body.tech"+req.body.tech);
            console.log("req.body.question"+req.body.question3)
            console.log("req.body.anwser"+req.body.answer3);
            console.log("req.body.complexity"+req.body.complexity3);
            var sec=req.body.selectedOption3;
            console.log("sec"+sec);
            if(sec ==4){
            var optionSec=[req.body.option31,
                req.body.option32,
                req.body.option33,
                req.body.option34]


        }
        else if(sec ==2){
            var optionSec=[req.body.option35,
                req.body.option36]
        }
        else{
            var optionSec=[req.body.option37,
                req.body.option38,
                req.body.option39,
                req.body.option310,
                req.body.option311
            ]
        }
        console.log("inserting docs");
        collection.insert({

            "Technology" : req.body.tech,
            "Question":req.body.question3,
            "Answer":req.body.answer3,
            "Complexity":req.body.complexity3,
            "Options":optionSec

        }, function (err, doc) {

            if (err) {
                console.log(err);
                // If it failed, return error
                res.send("There was a problem adding the information to the database.");
            }
            else{
                console.log("successfully added question3");
                return;
            }
            
        });
    }; 
    var addingQuestion4=function(req,collection){
            console.log("req.body.tech"+req.body.tech);
            console.log("req.body.question"+req.body.question4)
            console.log("req.body.anwser"+req.body.answer1);
            console.log("req.body.complexity"+req.body.complexity1);
            var sec=req.body.selectedOption1;
            console.log("sec"+sec);
            if(sec ==4){
            var optionSec=[req.body.option41,
                req.body.option42,
                req.body.option43,
                req.body.option44]


        }
        else if(sec ==2){
            var optionSec=[req.body.option45,
                req.body.option46]
        }
        else{
            var optionSec=[req.body.option47,
                req.body.option48,
                req.body.option49,
                req.body.option410,
                req.body.option411
            ]
        }
        console.log("inserting docs");
        collection.insert({

            "Technology" : req.body.tech,
            "Question":req.body.question4,
            "Answer":req.body.answer4,
            "Complexity":req.body.complexity4,
            "Options":optionSec

        }, function (err, doc) {

            if (err) {
                console.log(err);
                // If it failed, return error
                res.send("There was a problem adding the information to the database.");
            }
            else{
                console.log("successfully added question4");
                return;
            }
            
        });
    }; 
     var addingQuestion5=function(req,collection){
            console.log("req.body.tech"+req.body.tech);
            console.log("req.body.question"+req.body.question5)
            console.log("req.body.anwser"+req.body.answer5);
            console.log("req.body.complexity"+req.body.complexity5);
            var sec=req.body.selectedOption5;
            console.log("sec"+sec);
            if(sec ==4){
            var optionSec=[req.body.option51,
                req.body.option52,
                req.body.option53,
                req.body.option54]


        }
        else if(sec ==2){
            var optionSec=[req.body.option55,
                req.body.option56]
        }
        else{
            var optionSec=[req.body.option57,
                req.body.option58,
                req.body.option59,
                req.body.option510,
                req.body.option511
            ]
        }
        console.log("inserting docs");
        collection.insert({

            "Technology" : req.body.tech,
            "Question":req.body.question5,
            "Answer":req.body.answer5,
            "Complexity":req.body.complexity5,
            "Options":optionSec

        }, function (err, doc) {

            if (err) {
                console.log(err);
                // If it failed, return error
                res.send("There was a problem adding the information to the database.");
            }
            else{
                console.log("successfully added question5");
                return;
            }
            
        });
    };

router.get('/NewQuestion', function(req, res) {


    // console.log("hey count"+JSON.stringify(count));
    res.render("NewQuestion", {

        title: 'Freshers Gate',
        "prop2":prop2


    });

});
router.get('/dashboard', function(req, res) {


    console.log("hey inside dashboard");
    var db = req.db;
   
    var collection = db.get('Score_Reports');
    
    
   
    collection.find({},function(e,docs){
        console.log("score_reports"+JSON.stringify(docs));
    res.render("userlist", {

        title: 'Freshers Gate',
       "report":docs


    });
    console.log("done with dashboard");
});
});



/* GET Questions page. */
router.get('/playJava', function(req, res) {
    var db = req.db;
    //console.log(db.toString());
    var collection = db.get('Collection_MPF_Quiz');
    //var docs=collection.find({"Technology":"Java"});
    var ran=collection.find();
    // console.log(collection.find().toArray());
    collection.find({"Technology":"Java"},function(e,docs){
        //console.log(docs);
        // var question = docs[0];


        //console.log(docs);

        /*for(var i=0;i<docs.length;i++){
         var rand = docs[Math.ceil(Math.random()*i)];
         console.log(rand);
         }
         */
        shuffle(docs);
        // console.log(docs);
        console.log(paginator.getPaginationData());
        res.render("play", {

            title: 'Freshers Gate',
            "quiz": docs,
            "technology":"Java",
            "prop1":prop_java

        });
    });
});
router.get('/playVBScript', function(req, res) {
    var db = req.db;
    console.log(db.toString());
    var collection = db.get('Collection_MPF_Quiz');
    collection.find({"Technology":"VBScript"},function(e,docs){
        //console.log(docs);
        // var question = docs[0];
        console.log("question");
        shuffle(docs);
        res.render("play", {
            title: 'Freshers Gate',
            "quiz": docs,
            "technology":"VBScript",
            "prop1":prop_vbscript

        });
    });
});
router.get('/playTesting', function(req, res) {
    var db = req.db;
    console.log(db.toString());
    var collection = db.get('Collection_MPF_Quiz');
    collection.find({"Technology":"Testing"},function(e,docs){
        //console.log(docs);
        // var question = docs[0];
        console.log("question");
        shuffle(docs);
        res.render("play", {
            title: 'Freshers Gate',

            "quiz": docs,
            "technology":"Testing",
            "prop1":prop_testing

        });
    });
});
router.get('/playC', function(req, res) {
    var db = req.db;
    console.log(db.toString());
    var collection = db.get('Collection_MPF_Quiz');
    collection.find({"Technology":"C"},function(e,docs){
        //console.log(docs);
        // var question = docs[0];
        console.log("question");
        shuffle(docs);
        res.render("play", {
            title: 'Freshers Gate',
            "quiz": docs,
            "technology":"C",
            "prop1":prop_c

        });
    });
});
function timeUP() {


    //renderFile('timeup', {title: 'Time Up'});




}

module.exports = router;