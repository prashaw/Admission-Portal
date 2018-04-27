
var app = angular.module("myapp", ["ngRoute","ui.bootstrap","angular-loading-bar","ngCookies"]);

app.config(function($routeProvider,$locationProvider,$httpProvider) 
{
	$httpProvider.interceptors.push('authinceptors');
    $routeProvider
    .when("/", {
        templateUrl : "pages/home.html",
        controller:"homecontroller"
    })
    .when("/college", {
        templateUrl : "pages/college.html",
        controller:    "mycontroller"
    })
    .when("/college/details/:id/:cnm", {
        templateUrl : "pages/collegedetail.html",
        controller:    "collegedetailcontroller"
    })
    .when("/login", {
        templateUrl : "pages/login.html",
        controller:    "logincontroller",
        authenticated:false
     })
    .when("/register", {
        templateUrl : "pages/register.html",
        controller:    "registercntrler",
        authenticated:false
    })
    .when('/logout', {
        templateUrl: 'pages/logout.html',
        authenticated:true
    })
    .when('/profile/', {
        templateUrl: 'pages/profile.html',
        controller:'profilecnntrl',
        authenticated:true
    })
    .when('/facebook/:token', {
        templateUrl: 'pages/home.html',
        controller:'facebookcntrlr',
        authenticated:false
    })
    .when('/facebookerror', {
        templateUrl: 'pages/login.html',
        controller:'facebookcntrlr',
        authenticated:false
     })
    .when('/twitter/:token', {
        templateUrl: 'pages/home.html',
        controller:'twittercntrlr',
        authenticated:false
     })
    .when('/twittererror', {
        templateUrl: 'pages/login.html',
        controller:'twittercntrlr',
       authenticated:false
     })
      .when('/google/:token', {
        templateUrl: 'pages/home.html',
        controller:'googlecntrlr',
        authenticated:false
    
    })
      .when('/googleerror', {
        templateUrl: 'pages/login.html',
        controller:'googlecntrlr',
        authenticated:false
    
     })
        .when("/contact", {
    	templateUrl : "pages/contact.html",
    	controller : "contactcontroller"
    })
    .when("/collegecomparator", {
    	templateUrl : "pages/collegecomparator.html",
    	controller : "collegecomparator"
    })
    
    .when("/activate/:token", {
    	templateUrl : "pages/activate.html",
    	controller : "activatecontroller"
    	
    })
    .when("/resetusername", {
    	templateUrl : "pages/username.html",
    	controller : "usernamecntrl",
    	authenticated:false
    })
    .when("/resetpassword", {
    	templateUrl : "pages/password.html",
    	controller : "resetpswrdcntrl",
    	authenticated:false
    })

    $locationProvider.hashPrefix(''); 

     new WOW().init();

});
//run to restrict routing   if(authtoken.isLogdIn())
app.run(["$rootScope","$location","authtoken",function($rootScope,$location,authtoken)
{
     $rootScope.$on("$routeChangeStart",function(event,next,current)
     {
       if(next.$$route.authenticated==true)
       {
          if(!authtoken.isLogdIn())
          {
            event.preventDefault();
            $location.path("/");
          }
       }else if (next.$$route.authenticated==false) 
       {
        if(authtoken.isLogdIn())
          {
            event.preventDefault();
            $location.path("/profile");
          }
          console.log("should not be authenticated");
       }else
       {
        console.log("authentication does not matter");
       }
     });
}]);
//pagination
app.filter('startFrom',function()
 {
 	return function(data,start)
 	{
 		if (!data || !data.length) { return; }
 		return data.slice(start);
 	}
 });
 //homecontroller
app.controller("homecontroller",function($scope)
{
    	  $scope.myInterval = 3000;
		 $scope.slides = 
  [
    
     
    {
       image: "assets/img/slider/portal_1.jpg"
    },
    {
      image: "assets/img/slider/portal_3.jpg" 
    },
      {
      image: "assets/img/slider/slide2.jpg" 
      }
  ];
});
//end of homecontroller

//collegecontroller

app.controller('mycontroller',["$scope","$http","$location",function($scope,$http,$location)
{     
    	$scope.pagination={
          currentPage:1,
          pageSize:70
    	};  
      
    $scope.approval_search="";
    $scope.aff_search="";
    $scope.exam_search="";
    $scope.branch_search="";
		$scope.search="";
    $scope.state_search="";
	$scope.course_search="";
	$scope.selectedStates = [];
	$scope.courseupdates=[];
    $scope.branchupdates=[];
    $scope.examupdates=[];
    $scope.affupdates=[];
    $scope.aprvlupdates=[];
    $scope.collegetypeupdates=[];
    $scope.coursetypeupdates=[];
    $scope.feesupdates=[];
    $scope.coursedurations=[];
    $scope.Accrediatations=[];
    $scope.filter_name=[];
      $http.get("https://core.letsenrol.com/api/partner-colleges-universities").success(function(response)
      {
      	$scope.mycolgdata=response;

        

      });

            $http.get("http://localhost:3000/api/states").success(function(response)
      {
      	$scope.data_list=response;
      });

       $http.get("http://localhost:3000/api/course").success(function(response)
      {
      	$scope.courses=response;
      });

        $http.get("http://localhost:3000/api/exam").success(function(response)
      {
      	$scope.examlist=response;
      });
       
        $http.get("https://core.letsenrol.com/api/affiliation").success(function(response)
      {
      	$scope.afmlist=response;
      });

        $http.get("http://localhost:3000/api/approval").success(function(response)
      {
      	$scope.aprvllist=response;
      });

        $scope.forbranches=function(x)
        {
        
        	 $http.get("https://core.letsenrol.com/api/branch/"+x).success(function(response)

		      {
		      	$scope.branches=response;
		      });

        }

  

	/*state uppdate*/
	 $scope.stateupdate=function(x,event,name)
        
        {
        	if(event.target.checked)
        	{
        	
			          
        			$scope.selectedStates.push(x);
        			$scope.filter_name.push(name);
        			 $scope.selectedFilter = true;
        			
        			 $scope.Apiupadate();      
            }else
              {  
     
        	  


			         var index  = $scope.selectedStates.indexOf(x);
                     var index1  = $scope.filter_name.indexOf(name);

			         $scope.selectedStates.splice(index,1);
			         $scope.filter_name.splice(index1,1);
			    	 
                        $scope.Apiupadate();      

               }

        }

   
  /*courses uppdate*/

   $scope.courseupdate=function(x,event,name)
        
        { 
        	if(event.target.checked)
        	{
        	
			          
        			$scope.courseupdates.push(x);
        			$scope.filter_name.push(name);
        			 $scope.selectedFilter = true;
        			
        			 $scope.Apiupadate();      
            }
	        else
	        {  
	     


				         var index  = $scope.courseupdates.indexOf(x);
	                     var index1  = $scope.filter_name.indexOf(name);

				         $scope.courseupdates.splice(index,1);
				          $scope.filter_name.splice(index1,1);
				    
				    	 $scope.Apiupadate();      	

	        }
        }
  

     
   
/*branch uppdate*/

 $scope.branchupdate=function(x,event,name)
        
        { 
        	if(event.target.checked)
        	{
        	
			          
        			$scope.branchupdates.push(x);
        			$scope.filter_name.push(name);
        			 $scope.selectedFilter = true;
        		
        			 $scope.Apiupadate();      
            }
		        else
		        {  
		     
		        	  

					         var index  = $scope.branchupdates.indexOf(x);
					         var index1  = $scope.branchupdates.indexOf(name);


					         $scope.branchupdates.splice(index,1);

					         $scope.filter_name.splice(index1,1);
					    	 
					    		

		                       $scope.Apiupadate();      
		        }
        }
 

   
/*exm uppdate*/

 $scope.examupdate=function(x,event,name)
        
        { 
        	if(event.target.checked)
        	{
        	
			          
        			$scope.examupdates.push(x);
        			$scope.filter_name.push(name);
        			 $scope.selectedFilter = true;
        		
        			 $scope.Apiupadate();      
            }
        else
        {  
     


			         var index  = $scope.examupdates.indexOf(x);

			         var index1  = $scope.filter_name.indexOf(name);

			         $scope.examupdates.splice(index,1);
			          $scope.filter_name.splice(index1,1);
			    	 
			    		
                        $scope.Apiupadate();      

			    	
			         
        }
     }


     
/*affiliationupdate uppdate*/

 $scope.affiliationupdate=function(x,event,name)
        
        { 
        	if(event.target.checked)
        	{
        	
			          
        			$scope.affupdates.push(x);
        			$scope.filter_name.push(name);
        			 $scope.selectedFilter = true;
        			
        			 $scope.Apiupadate();      
                }
		        else
		        {  
		     


					         var index  = $scope.affupdates.indexOf(x);
                             var index1  = $scope.filter_name.indexOf(name);


					         $scope.affupdates.splice(index,1);
					          $scope.filter_name.splice(index1,1);
					    
					    		

                               $scope.Apiupadate();      
		        }
        }
   

			/*aprvl uppdate*/

			       $scope.approvalupdate=function(x,event,name)
			    {
			        
			        
			        	if(event.target.checked)
			        	{
			        	
						          
			        			$scope.aprvlupdates.push(x);
			        			$scope.filter_name.push(name);
			        			 $scope.selectedFilter = true;
			        
			        			 $scope.Apiupadate();      
			            }
			        else
			        {  
			     
			        	  


						         var index  =$scope.aprvlupdates.indexOf(x);
                                 var index1  =$scope.filter_name.indexOf(name);

						         $scope.aprvlupdates.splice(index,1);
						         $scope.filter_name.splice(index1,1);
						    	 
						    		
                                   $scope.Apiupadate();      
			        }
			     
			    }
             /*college type update*/
			 $scope.collegetypeupdate=function(x,event,name)
			  {
				        if(event.target.checked)
				        	{
				        	
							          
				        			$scope.collegetypeupdates.push(x);
				        			$scope.filter_name.push(name);
				        			 $scope.selectedFilter = true;
				        			
				        		     $scope.Apiupadate();      

							         
				        }else
				        {  
				     


							         var index  =$scope.collegetypeupdates.indexOf(x);
                                     var index1  =$scope.filter_name.indexOf(name);

							         $scope.collegetypeupdates.splice(index,1);
							          $scope.filter_name.splice(index1,1);
							   
							    		
                                         $scope.Apiupadate();      

							    	
				        }
			  }

               
				     /*fees  update*/
		     $scope.feesupdate=function(x,event,name)
			  {
				        if(event.target.checked)
				        	{
				        	
							          
				        			$scope.feesupdates.push(x);
				        			$scope.filter_name.push(name);
				        			 $scope.selectedFilter = true;
				        		
				        		

							         
							        $scope.Apiupadate();      
				        }else
				        {  
				     


							         var index  =$scope.feesupdates.indexOf(x);
                                     var index1  =$scope.filter_name.indexOf(name);

							         $scope.feesupdates.splice(index,1);
							         $scope.filter_name.splice(index1,1);
							    
							    		 $scope.Apiupadate();      


				        }
			  }
               
               	     /*courseduration*/
		     $scope.courseduration=function(x,event,name)
			  {
				        if(event.target.checked)
				        	{
				        	
							          
				        			$scope.coursedurations.push(x);
				        			$scope.filter_name.push(name);
				        			 $scope.selectedFilter = true;
				        	
				                      $scope.Apiupadate();      
				        }else
				         {


							         var index  =$scope.coursedurations.indexOf(x);
							         var index1  =$scope.filter_name.indexOf(name);


							        $scope.coursedurations.splice(index,1);
							        $scope.filter_name.splice(index1,1);
							    	
							    		
                                      $scope.Apiupadate();      
				        }
			  } 


               	     /*coursetypeupdate*/
		     $scope.coursetypeupdate=function(x,event,name)
			  {
				        if(event.target.checked)
				        	{
				        	
							          
				        			$scope.coursetypeupdates.push(x);
				        				$scope.filter_name.push(name);
				        			 $scope.selectedFilter = true;
				        		
				        		
                                      $scope.Apiupadate();      
				        }else
				        {  
				     
				        	  // if ($scope.state !=null)
							        //  {


							         var index  =$scope.coursetypeupdates.indexOf(x);
							         var index1  =$scope.filter_name.indexOf(name);

							       $scope.coursetypeupdates.splice(index,1);
							       $scope.filter_name.splice(index1,1);
							    	
							    	 $scope.Apiupadate();      
				        }
			  } 


               	     /*Accrediatation*/
		     $scope.Accrediatation=function(x)
			  {
				     
				        	
							          
				        			$scope.Accrediatations.push(x);
				        
				        		

							         
							 $scope.Apiupadate();      
							        
			  }
			   



			  
		     


		       $scope.feeList=[
		            {
				        value: 5000,
				         text: "upto 5,000"
				    }, {
				        value: 10000
				        , text: "upto 10k"
				    }, {
				        value: 20000
				        , text: "upto 20k"
				    }, {
				        value: 30000
				        , text: "upto 30k"
				    }, {
				        value: 40000
				        , text: "upto 40k"
				    }, {
				        value: 60000
				        , text: "upto 60k"
				    }, {
				        value: 80000
				        , text: "upto 80k"
				    }];

				     /*Course duration list*/
			    $scope.durList=
			    [
			    {
			        value: 1
			        , text: "1 year"
			    }, {
			        value: 2
			        , text: "2 years"
			    }, {
			        value: 3
			        , text: "3 years"
			    }, {
			        value: 4
			        , text: "4 years"
			    }, {
			        value: 5
			        , text: "5 years"
			    }, {
			        value: 6
			        , text: "6 years"
			    }];
			/*college tyepe data*/
			      $scope.collegetypedata=
			[
				{
					id:1,
					text:"Private"
				},
				{
					id:3,
					text:"Public"
				},
				{
					id:4,
					text:"Public Private Partnership"
				}

			];

                                              

			/*course tyepe data*/                                     
			      $scope.coursetypedata=                
			[
				{
					id:4,
					text:"DISTANCE EDUCATION"
				},
				{
					id:1,
					text:"FULL TIME"
				},
				{
					id:3,
					text:"ONLINE"
				},
				{
					id:2,
					text:"PART TIME"
				}

			];
			
       $scope.Apiupadate=function()
       {
       	   $http.get("https://core.letsenrol.com/api/partner-colleges-universities?fstate="+$scope.selectedStates+"&fcity=&ftype="+$scope.collegetypeupdates +"&fcourses="+$scope.courseupdates+"&fbranches="+$scope.branchupdates+"&fexams="+$scope.examupdates+"&fcoursetype="+$scope.coursetypeupdates+"&fNBA="+$scope.Accrediatations+"&faffiliation="+$scope.affupdates+"&fapproval="+$scope.aprvlupdates+"&ffee="+$scope.feesupdates+"&fduration="+$scope.coursedurations).success(function(response)
			{
							            
							             
				$scope.mycolgdata=response;

		    });
       }
       $scope.collegedetail=function(id,slug)
       {
             $location.path("/college/details/"+ id+"/"+slug);
       }

}]);
    	
//end of collegecntrl
//college detail cntrlr
app.controller("collegedetailcontroller",["$scope","$http","$routeParams","$location","authtoken","auth",function($scope,$http,$routeParams,$location,authtoken,auth)
{    $scope.applymsg=false;
     $scope.id=$routeParams.id;
     $scope.cnm=$routeParams.cnm;
     var url="https://core.letsenrol.com/api/college-university/"+ $scope.id+"/"+$scope.cnm;
       $http.get(url).success(function(response)
      {
        $scope.collegedata=response;
      });
      $scope.applyForm=function(id,cnm)
      {
         if(authtoken.isLogdIn())
      {
          $scope.isLogdIn=true;
           auth.getuser().then(function(data)
        {
          
          $scope.username=data.data.username;
          $scope.useremail=data.data.email;

        })
      }else
      {
      	 $location.path("/login");
      	 $scope.isLogdIn=false;
      }
      }
      $scope.getbranch=function(id)
      {
        $http.get("https://core.letsenrol.com/api/college-course-branch/"+id).success(function(data)
        {  
           $scope.branches=data;
           
        })
      } 
      $scope.applycolg=function()
      {
      	
      	//application/x-www-form-urlencoded
      	var data = {
		                "course_name": $scope.course.coursename,
		                "branch_name": $scope.branch.br,
		                "email":$scope.useremail,
		                "college_name": $scope.collegedata.college_name,
		                "college_state":$scope.collegedata.college_state,
		                "college_city":$scope.collegedata.college_city,
		                "status":"APPLICATION PENDING WITH COLLEGE"
		            }
      	
		         var config = 
		           {
		                headers :
		                 {
		                     'Content-Type': 'application/json'
		                 }
		            }

		            
		            $http.post('http://localhost:3000/api/applycolg',data, config)
		            .success(function (data, status, headers, config) {
		         
		            	{
		            	
		            		$scope.applydata = data;
		            		$scope.msg="you have successfully apply to this college"	;
		            	}
		                
		            })
		            .error(function (data, status, headers, config) {

		            	  console.log(data);
		            });
      } 

       
}]);
//end of college detail cntrlr



//clgpredictor controller
app.controller('clgpredictorcontroller',["$scope","$http","$location",function($scope,$http,$location)
{
	$scope.showme=false;
		   $http.get("https://core.letsenrol.com/api/states").success(function(response)
		      {
		      	$scope.data_list=response;
		     

		      });
    
        
        	 $http.get("https://core.letsenrol.com/api/predictorbranch").success(function(response)

		      {
		      	$scope.branches=response;
		      
		      });
        	 $http.get("https://core.letsenrol.com/api/studentcategory").success(function(response)

		      {
		      	$scope.category=response;
		      	
		      });
          //submit form data 
        $scope.collegedetail=function(id,slug)
       {
             $location.path("/college/details/"+ id+"/"+slug);
       }

        $scope.SendData = function () 
        {

                   

		             var data =$.param( 
		             {
		                boardstate: $scope.boardstate,
		                branch: $scope.branch,
		                cat:$scope.cat,
		                ssc:$scope.ssc,
		                hsc:$scope.hsc,
		                pcm:$scope.pcm
		            });
		        
		         var config = 
		           {
		                headers :
		                 {
		                     'Content-Type': 'application/x-www-form-urlencoded'
		                 }
		            }

		            
		            $http.post('https://core.letsenrol.com/api/college-predictor',data, config)
		            .success(function (data, status, headers, config) {
		         
		            	{
		            		$scope.showme=true;
		            		$scope.PostDataResponse = data;	
		            	}
		                
		            })
		            .error(function (data, status, headers, config) {

		            	  $scope.ResponseDetails = "Data: " + data +
		                    "<hr />status: " + status +
		                    "<hr />headers: " + headers +
		                    "<hr />config: " + config;
		            });
        
       };
     
}]);

//maincontroller
app.controller('maincontroller',["$scope","$http","$location","$window","$timeout",function($scope,$http,$location,$window,$timeout)
  {
      
      $scope.loginCheck=true;

      $http.get("https://core.letsenrol.com/api/autocomplete").success(function(response)
      {
        $scope.dt=response;

       

      });

       $scope.complete = function(string)
          { 

               $scope.hidethis = false;  
               var output = [];  
               angular.forEach($scope.dt, function(colg){ 
              
                    if(colg.college_name.indexOf(string.toUpperCase()) >= 0)  
                    {  
                         output.push(colg);  
                    }  
               });  
               $scope.filtercolg = output;  
          }  
          $scope.fillTextbox = function(id,string)
          {  
          	   $scope.clg = string;
               $location.path("/college/details/"+ id+"/"+string);  
               $scope.hidethis = true;  
          }  
          $scope.fillbox = function()
          {  
                
               $scope.hidethis = true;

          }  

}]);
//registercntrler
app.controller('registercntrler',["$scope","$http","$location","$window","$timeout",function($scope,$http,$location,$window,$timeout)
{

    $scope.reguser=function()
    {
    	$scope.errMsg=false;
    	        var data =JSON.stringify( 
                     {
                   
                        username: $scope.username,
                        password: $scope.password,
                        email:$scope.email,
                        name:$scope.name 

                    });
    	        console.log(data);
    	        

    	        var config = {
                headers : {
                    'Content-Type': 'application/json'
                }
            }

            $http.post('http://localhost:3000/api/users', data, config)
            .success(function (data, status, headers, config) {
                 if(data.success)
                              {
                                $scope.successMsg=data.message; 
                                $timeout(function()
                                 {

                                   $location.path("/");
                               
                               },4000);
                              }

                              
                            else
                            {
                               $scope.errMsg=data.message;
                            }
            })
            .error(function (data, status, header, config) {
                $scope.ResponseDetails = "Data: " + data +
                    "<hr />status: " + status +
                    "<hr />headers: " + header +
                    "<hr />config: " + config;
            });
        };


    
}]);

//logincontroller
app.controller("logincontroller",function($scope,$http,$location,$timeout,$rootScope,$cookies,$cookieStore,authtoken,auth)
{   
    
	 
	$scope.loadme=false;
    
    $rootScope.$on('$routeChangeStart', function() 
   {
      
      if(authtoken.isLogdIn())
      {

        $scope.isLogdIn=true;
        
        auth.getuser().then(function(data)
        {
          
          $scope.username=data.data.username;
          $scope.useremail=data.data.email;

          $scope.loadme=true;

        
        })
      }else
      {
        
        $scope.isLogdIn=false;
        $scope.username="";
        $scope.useremail='';
        $scope.loadme=true;
      }
   });



   $scope.logindata=function()
   {
      $scope.errMsg=false;
      var data =JSON.stringify( 
                     {

                        username: $scope.username,
                        password: $scope.password
                      
                    });
    var config = 
                   {
                        headers :
                         {
                             'Content-Type': 'application/json'
                         }
                    }

    $http.post('http://localhost:3000/api/authenticate',data, config)
                    .success(function (data, status, headers, config){
                        {
                          
                           authtoken.setToken(data.token);

                          if(data.success)
                              {
                                $scope.successMsg=data.message; 
                                
                                 $timeout(function()
                                 {
                                 
                                   $location.path("/");
                                   
                                    
                                 },2000);                                    
                              }

                              
                            else
                            {
                               $scope.errMsg=data.message;
          
                            }
                        }
                        })

                    .error(function (data, status, headers, config) {

                          $scope.ResponseDetails = "Data: " + data +
                            "<hr />status: " + status +
                            "<hr />headers: " + headers +
                            "<hr />config: " + config;
                    });
                    
   };
          //logout 
                $scope.logout=function()
		        {
		          authtoken.logout();
		          $location.path("/logout");

		           $timeout(function()
		            {
		             $location.path("/"); 
		            },2000);
		        };
 });

//profilecnntrl
app.controller("profilecnntrl",function($scope,$http,$location,$timeout,$routeParams,$window,auth)
{
	$scope.dashboard=true;
    $scope.personaldetails="";
  	  $scope.academicDetails="";
  	   $scope.editMode1=false;
  	    $scope.editMode=false;
  	  $scope.academic=[];
  	  //get login username and email
  	  $scope.applycolgdata=[];
      
	           auth.getuser().then(function(data)
        {
          
          $scope.username=data.data.username;
          $scope.useremail=data.data.email;

        })
	  //apply college data
        $http.get("http://localhost:3000/api/applycolg/"+$scope.useremail).success(function(response)
      {
      	$scope.applycolgdata=response;
        console.log($scope.applycolgdata);
        

      });
        //get academic details of users
        $http.get("http://localhost:3000/api/personaldetails/"+$scope.useremail).success(function(response)
      {
      	$scope.academic=response;
       $scope._id=response[0]._id;
       $scope.name=response[0].name ;
       $scope.dateofbirth= response[0].dateofbirth;
       $scope.useremail= $scope.useremail;
       $scope.secondary_email= response[0].secondary_email;
       $scope.mobile_number= response[0].mobile_number;
       $scope.father_name= response[0].father_name;
       $scope.mother_name= response[0].mother_name;
       $scope.address= response[0].address;
       $scope.lane1= response[0].lane1;
        $scope.lane2= response[0].lane2;
       $scope.state= response[0].state;
       $scope.city= response[0].city;
       $scope.pincode= response[0].pincode;
        

      });
        //post personals details
         $scope.Postdata=function()
        {
        	var Postdata = {
		                "name": $scope.name,
		                "dateofbirth":$scope.dateofbirth,
		                "email": $scope.useremail,
		                "secondary_email":$scope.secondary_email,
		                "mobile_number":$scope.mobile_number,
		                "father_name":$scope.father_name,
		                "mother_name":$scope.mother_name,
		                "address":$scope.address,
		                "lane1":$scope.lane1,
		                "lane2":$scope.lane2,
		                "state":$scope.state,
		                "city":$scope.city,
		                "pincode":$scope.pincode
		            }
      	
		         var config = 
		           {
		                headers :
		                 {
		                     'Content-Type': 'application/json'
		                 }
		            }

		            
		            $http.post('http://localhost:3000/api/personaldetails',Postdata, config)
		            .success(function (data, status, headers, config) {
		         
		            	{
		            	
		            		$scope.postdata = data;	
		            	
		            	}
		                
		            })
		            .error(function (data, status, headers, config) {

		            	  console.log(data);
		            });
        }

      //update personals details
       $scope.update_personaldetails=function()
       {

       	   //update Api
       	  var data = {
		                "name": $scope.name,
		                "dateofbirth":$scope.dateofbirth,
		                "email": $scope.email,
		                "secondary_email":$scope.secondary_email,
		                "mobile_number":$scope.mobile_number,
		                "father_name":$scope.father_name,
		                "mother_name":$scope.mother_name,
		                "address":$scope.address,
		                "lane1":$scope.lane1,
		                "lane2":$scope.lane2,
		                "state":$scope.state,
		                "city":$scope.city,
		                "pincode":$scope.pincode
		             }
      	
		         var config = 
		           {
		                headers :
		                 {
		                     'Content-Type': 'application/json'
		                 }
		            }

		            
		            $http.put('http://localhost:3000/api/personaldetails/'+$scope._id,data, config)
		            .success(function (data, status, headers, config) {
		         
		            	{
		            	
		            		$scope.updatedata = data;


		            	}
		                
		            })
		            .error(function (data, status, headers, config) {

		            	  console.log(data);
		            });
       }

      $scope.Hsc_board=
   [
    {
        
        "board_name": "ALIGARH MUSLIM UNIVERSITY, ALIGARH."
    },
    {
        
        "board_name": "ANDHRA PRADESH BOARD OF INTERMEDIATE EDUCATION,  HYDERABAD"
    },
    {
        
        "board_name": "ANDHRA PRADESH BOARD OF SECONDARY EDUCATION, HYDERABAD"
    },
    {
        
        "board_name": "ANDHRA PRADESH OPEN SCHOOL SOCIETY, SCERT CAMPUS, HYDERABAD"
    },
    {
        
        "board_name": "ASSAM BOARD OF SECONDARY EDUCATION, GUWAHATI"
    },
    {
        
        "board_name": "ASSAM HIGHER SECONDARY EDUCATION COUNCIL, BAMUNIMAIDAN, GUWAHATI"
    },
    {
        
        "board_name": "BANASTHALI VIDYAPITH, BANASTHALI, RAJASTHAN"
    },
    {
        
        "board_name": "BIHAR INTERMEDIATE EDUCATION COUNCIL, PATNA"
    },
    {
        
        "board_name": "BIHAR SANSKRIT SHIKSHA BOARD, PATNA"
    },
    {
        
        "board_name": "BIHAR SCHOOL EXAMINATION BOARD, PATNA"
    },
    {
        
        "board_name": "CENTRAL BOARD OF SECONDARY EDUCATION, DELHI"
    },
    {
        
        "board_name": "CHHATISGARH BOARD OF SECONDARY EDUCATION, RAIPUR"
    },
    {
        
        "board_name": "COUNCIL FOR INDIAN SCHOOL CERTIFICATE EXAMINATIONS, NEW DELHI"
    },
    {
        
        "board_name": "DIRECTORATE OF ARMY EDUCATION, NEW DELHI."
    },
    {
        
        "board_name": "GOA BOARD OF SECONDARY & HIGHER SECONDARY EDUCATION, GOA"
    },
    {
        
        "board_name": "GUJARAT SECONDARY & HIGHER SECONDARY EDUCATION BOARD, GANDHI NAGAR"
    },
    {
        
        "board_name": "GURUKUL KANGRI VISHWAVIDYALAYA, HARIDWAR,"
    },
    {
        
        "board_name": "HARYANA BOARD OF EDUCATION, HANSI ROAD, BHIWANI"
    },
    {
        
        "board_name": "HARYANA OPEN SCHOOL, BHIWANI"
    },
    {
        
        "board_name": "HIMACHAL PRADESH BOARD OF SCHOOL EDUCATION, DHARAMSHALA"
    },
    {
        
        "board_name": "IGCSE PROGRAMME FROM UNIVERSITY OF CAMBRIDGE (INTERNATIONAL EXAM)"
    },
    {
        
        "board_name": "J&K STATE BOARD OF SCHOOL EDUCATION, JAMMU"
    },
    {
        
        "board_name": "J&K STATE OPEN SCHOOL, SRINAGAR"
    },
    {
        
        "board_name": "JAMIA MILIYA HAMDARD UNIVERSITY."
    },
    {
        
        "board_name": "JAMIA MILIYA ISLAMIA, NEW DELHI."
    },
    {
        
        "board_name": "JHARKHAND ACADEMIC COUNCIL, RANCHI"
    },
    {
        
        "board_name": "KARNATAKA BOARD OF THE PRE-UNIVERSITY EDUCATION, BANGALORE"
    },
    {
        
        "board_name": "KARNATAKA OPEN SCHOOL, J.S.S. MAHA VIDYA PEETH, MYSORE"
    },
    {
        
        "board_name": "KARNATAKA SECONDARY EDUCATION EXAMINATION BORAD, BANGALORE"
    },
    {
        
        "board_name": "KERALA BOARD OF HIGHER SECONDARY EDUCATION, THIRUVANANTHAPURAM"
    },
    {
        
        "board_name": "KERALA BOARD OF PUBLIC EXAMINATIONS, PAREEKSHA BHAWAN, THIRUVANANTHPURAM"
    },
    {
        
        "board_name": "KERALA STATE OPEN SCHOOL, THIRUVANANTHAPURAM"
    },
    {
        
        "board_name": "M.P. STATE OPEN SCHOOL, BHOPAL"
    },
    {
        
        "board_name": "MADHYA PRADESH BOARD OF SECONDARY EDUCATION, BHOPAL"
    },
    {
       
        "board_name": "MAHARASHTRA STATE BOARD OF SECONDARY AND HIGHER SECONDARY EDUCATION, PUNE"
    },
    {
        
        "board_name": "MANIPUR BOARD OF SECONDARY EDUCATION, IMPHAL"
    },
    {
        
        "board_name": "MANIPUR COUNCIL OF HIGHER SECONDARY EDUCATION, IMPHAL"
    },
    {
        
        "board_name": "MEGHALAYA BOARD OF SCHOOL EDUCATION, MEGHALAYA"
    },
    {
        
        "board_name": "MIZORAM BOARD OF SCHOOL EDUCATION CHALTLAN, AIZAWL"
    },
    {
        
        "board_name": "NAGALAND BOARD OF SCHOOL EDUCATION, KOHIMA"
    },
    {
        
        "board_name": "NATIONAL INSTITUTE OF OPEN SCHOOLING (FORMARLY NATIONAL OPEN SCHOOL), NEW DELHI"
    },
    {
        
        "board_name": "ORISSA BOARD OF SECONDARY EDUCATION, CUTTACK"
    },
    {
        
        "board_name": "ORISSA COUNCIL OF HIGHER SECONDARY EDUCATION BHUBANESWAR"
    },
    {
      
        "board_name": "PUNJAB SCHOOL EDUCATION BOARD, MOHALI"
    },
    {
        
        "board_name": "RAJASTHAN BOARD OF SECONDARY EDUCATION, AJMER"
    },
    {
       
        "board_name": "RAJASTHAN STATE OPEN SCHOOL, JAIPUR"
    },
    {
        
        "board_name": "RASHTRIYA SANSKRIT SANSTHAN, NEW DELHI."
    },
    {
        

        "board_name": "TAMIL NADU BOARD OF HIGHER SECONDARY EDUCATION, CHENNAI"
    },
    {
        
        "board_name": "TAMIL NADU BOARD OF SECONDARY EDUCATION, CHENNAI"
    },
    {
        
        "board_name": "TRIPURA BOARD OF SECONDARY EDUCATION, AGARTALA, TRIPURA WEST"
    },
    {
        
        "board_name": "U.P. BOARD OF HIGH SCHOOL & INTERMEDIATE EDUCATION, ALLAHABAD"
    },
    {
        
        "board_name": "UTTRANCHAL SHIKSHA EVM PARIKSHA PARISHAD, RAM NAGAR, NANITAL"
    },
    {
        
        "board_name": "WEST BENGAL BOARD OF MADRASA EDUCATION"
    },
    {
        
        "board_name": "WEST BENGAL BOARD OF SECONDARY EDUCATION, CALCUTTA"
    },
    {
        
        "board_name": "WEST BENGAL COUNCIL FOR RABINDRA OPEN SCHOOLING"
    },
    {
        
        "board_name": "WEST BENGAL COUNCIL OF HIGHER SECONDARY EDUCATION, CALCUTTA"
    }
]
       //academic details
    $scope.postacademic_data=function()
    {
       var academicdata = {
		                "SSc_passing_year": $scope.year.year,
		                "SSc_total_percnt":$scope.ssc_total_percentage,
		                "SSc_cgpa": $scope.ssc_cgpa,
		                "Hsc_board":$scope.hsc.board_name,
		                "Hsc_stream":$scope.stream.stream_name,
		                "Hsc_passing_year":$scope.hsc_passing_year_selected,
		                "Hsc_total":$scope.hsc_total_percentage,
		                "Hsc_pcb_pcm_percnt":$scope.hsc_pcb_pcm_percentage,
		                "Ug_name":$scope.ug_name,
		                "Ug_admit_year":$scope.ug_admit_year,
		                "Ug_university":$scope.ug_university,
		                "Ug_percnt":$scope.ug_percentage,
		                "email":$scope.useremail
		            }
      	
		         var config = 
		           {
		                headers :
		                 {
		                     'Content-Type': 'application/json'
		                 }
		            }

		            
		            $http.post('http://localhost:3000/api/academicdetails',academicdata, config)
		            .success(function (data, status, headers, config) {
		         
		            	{
		            	
		            		$scope.academic_data = data;	
		            	
		            	}
		                
		            })
		            .error(function (data, status, headers, config) {

		            	  console.log(data);
		            });
    }

   //get academic details

     $http.get("http://localhost:3000/api/academicdetails/"+$scope.useremail).success(function(response)
      {
                        $scope.acad_data=response;
                        $scope.ssc_passing_year= response[0].SSc_passing_year;
		                $scope.ssc_total_percnt=response[0].SSc_total_percnt;
		                $scope.ssc_cgpa=response[0].SSc_cgpa;
		                $scope.hsc_board=response[0].Hsc_board[0].board_name;
		                $scope.hsc_stream=response[0].Hsc_stream[0].stream_name;
		                $scope.hsc_passing_year=response[0].Hsc_passing_year;
		                $scope.hsc_total=response[0].Hsc_total;
		                $scope.hsc_pcb_pcm_percnt=response[0].Hsc_pcb_pcm_percnt;
		                $scope.ug_name=response[0].Ug_name;
		                $scope.ug_admit_year=response[0].Ug_admit_year;
		                $scope.ug_university=response[0].Ug_university;
		                $scope.ug_percnt=response[0].Ug_percnt;
		                $scope.email=$scope.useremail;

      });

     //update academics details
     /*
       $scope.update_academicdetails=function()
       {

       	   //update Api
       	  var data = {
		                "SSc_passing_year": $scope.year.year,
		                "SSc_total_percnt":$scope.ssc_total_percentage,
		                "SSc_cgpa": $scope.ssc_cgpa,
		                "Hsc_board":$scope.hsc.board_name,
		                "Hsc_stream":$scope.stream.stream_name,
		                "Hsc_passing_year":$scope.hsc_passing_year_selected,
		                "Hsc_total":$scope.hsc_total_percentage,
		                "Hsc_pcb_pcm_percnt":$scope.hsc_pcb_pcm_percentage,
		                "Ug_name":$scope.ug_name,
		                "Ug_admit_year":$scope.ug_admit_year,
		                "Ug_university":$scope.ug_university,
		                "Ug_percnt":$scope.ug_percentage,
		                "email":$scope.useremail
		             }
      	
		         var config = 
		           {
		                headers :
		                 {
		                     'Content-Type': 'application/json'
		                 }
		            }

		            
		            $http.put('http://localhost:3000/api/academicdetails/'+$scope._id,data, config)
		            .success(function (data, status, headers, config) {
		         
		            	{
		            	
		            		$scope.updateacademicdata = data;


		            	}
		                
		            })
		            .error(function (data, status, headers, config) {

		            	  console.log(data);
		            });
       }*/
         $scope.year=[
  	  {year:2000},{year:2001},{year:2002},{year:2003},
  	   {
  	  	
  	  	year:2004
  	  },
  	   {
  	  	
  	  	year:2005
  	  },
  	    {
  	  	
  	  	year:2006
  	  },
  	    {
  	  	
  	  	year:2007
  	  },
  	    {
  	  	
  	  	year:2008
  	  },
  	    {
  	  	
  	  	year:2009
  	  },
  	    {
  	  	
  	  	year:2010
  	  },
  	    {
  	  	
  	  	year:2011
  	  },
  	    {
  	  	
  	  	year:2012
  	  },
  	    {
  	  	
  	  	year:2013
  	  },
  	    {
  	  	
  	  	year:2014
  	  },
  	    {
  	  	
  	  	year:2015
  	  },
  	   {
  	  	
  	  	year:2016
  	  },
  	  {
  	  	
  	  	year:2017
  	  }
  	  ]
  	  $scope.Hsc_stream=[
    {
        
        "stream_name": "ART"
    },
    {
        
        "stream_name": "COMMERCE"
    },
    {
        
        "stream_name": "SCIENCE WITH BIOLOGY"
    },
    {
        
        "stream_name": "SCIENCE WITH MATH"
    }
]

});
//activatecntrlr
app.controller("activatecontroller",function($scope,$routeParams,auth,$location,$timeout)
{
	$scope.successMsg=false;
	$scope.errMsg=false;
	var token=$routeParams.token;
	console.log(token);
	auth.activeAccount(token).then(function(data){
		console.log(data);
      if(data.data.success)
      {
      	$scope.successMsg=data.data.message;
      	$timeout(function()
      	{
      		$location.path("/login");
      	},1000);
      }else{
      	$scope.errMsg=data.data.message;
      	$timeout(function()
      	{
      		$location.path("/login");
      	},1000);
      }
	})
   
});
//facebookcntrlr

app.controller("facebookcntrlr",function($scope,$http,$location,$timeout,$routeParams,$window,auth)
{
   $scope.facebookerrormsg=false;
   var absUrl = $location.absUrl();
   console.log(absUrl);
   if($location.absUrl()=="http://localhost:3000/#/facebookerror")
   {
    $scope.facebookerrormsg="Facebook email not found in database";
   }else
   {
     auth.facebook($routeParams.token);
      $timeout(function()
            {
             $location.path("/"); 
            },2000);
      
  }
});
//twittercntrlr controller

app.controller("twittercntrlr",function($scope,$http,$location,$timeout,$routeParams,$window,auth)
{
   $scope.twittererrMsg=false;
   var absUrl = $location.absUrl();
   console.log(absUrl);
   if($location.absUrl()=="http://localhost:3000/#/twittererror")
   {
    $scope.twittererrMsg="twitter email not found in database";
   }else
   {
     auth.facebook($routeParams.token);
      $timeout(function()
            {
             $location.path("/"); 
            },2000);
      
  }
});
//googlecntrlr
app.controller("googlecntrlr",function($scope,$http,$location,$timeout,$routeParams,$window,auth)
{
   $scope.googleerrMsg=false;
   var absUrl = $location.absUrl();
   console.log(absUrl);
   if($location.absUrl()=="http://localhost:3000/#/googleerror")
   {
    $scope.googleerrMsg="google email not found in database";
   }else
   {
     auth.facebook($routeParams.token);
      $timeout(function()
            {
             $location.path("/"); 
            },2000);
      
  }
});

app.controller('contactcontroller', function(){
	this.questions  = faq;

});
 // data for faq in contact controller
var faq = [
{
	q : "What is Admission Portal ?",
	a: "Admission Portal is an interactive online education portal that provides assistance to students and parents through the entire registration/admission process to renowned institutes in India. It is a perfect platform with a blend of interactivity and inclusiveness where students are enabled to search and register themselves at their desired institute. ",
},
{
	q: "What are the main features of this portal ?",
	a: "Our services and features extend from forming the list of best colleges as per your preferences, to providing with their detailed information, to assisting you in selecting the most suitable college, to guiding you through the admission process. ",
},
{
	q: "Are there any charges for the services? ",
	a: "No, our services are free of cost. ",
},
{
	q: "Why should I apply through Admission portal? ",
	a: "Apply through Admission portal because we are the platform through which you can connect with various educational entities while sitting at your home. We treat your problem as our own, and our free services would be like the cherry on the top. ",
},
{
	q: "How do I find colleges of different state? ",
	a: "To find the desired college, click on the 'College' icon at the top of the website and enter the state name with the type of colleges and then click on 'Search'. A list of the colleges in the desired state will emerge. You can also refine your search by mentioning the course name, duration of course, fee, year of establishment, etc. ",
},
{
	q: "How to I register on Admission portal ? ",
	a: "It's a very simple process. Click on 'Register' and enter your personal details like name, email and phone number to register yourself on Admission portal. ",
}
];

// college comparator controller

app.controller("collegecomparator", ["$scope", "$http", "$location", "$window", "$timeout" , function($scope, $http, $location, $window, $timeout ){
  $scope.loginCheck = true;

  $http.get("https://core.letsenrol.com/api/autocomplete").success(function(response){
    $scope.dt = response;
  });
   $scope.complete1 = function(string)
          { 

               $scope.hidethis1 = false; 
               var output = [];  
               angular.forEach($scope.dt, function(colg){ 
              
                    if(colg.college_name.indexOf(string.toUpperCase()) >= 0)  
                    {  
                         output.push(colg);  
                    }  
               });  
               $scope.filtercolg1 = output;  
          }  
          $scope.fillTextbox1 = function(id,string1, string2)
          {  
               cid1 = id;
               cslug1 = string2;
               $scope.clg1 = string1; 
               $scope.hidethis1 = true;  
           
          }  
          $scope.fillbox1 = function()
          {  
               $scope.hidethis1 = true;   
              
          }   
          $scope.clgdetails1 = function(){
             $scope.hidediv1 = true;
          
             $http.get("https://core.letsenrol.com/api/college-university/"+cid1+"/"+cslug1).success(function(response){
              $scope.clgdata1 =response[0];
             });
          }
          $scope.getbranch1 = function(courseShow1){
              course1 = courseShow1.id;
              $http.get("https://core.letsenrol.com/api/college-course-branch/"+course1).success(function(response){
                $scope.brlist1 = response;
              });
          }

          $scope.complete2 = function(string)
          { 

               $scope.hidethis2 = false; 
               var output = [];  
               angular.forEach($scope.dt, function(colg){ 
              
                    if(colg.college_name.indexOf(string.toUpperCase()) >= 0)  
                    {  
                         output.push(colg);  
                    }  
               });  
               $scope.filtercolg2 = output;  
          }  
          $scope.fillTextbox2 = function(id,string1, string2)
          {  
               cid2 = id;
               cslug2 = string2;
               $scope.clg2 = string1; 
               $scope.hidethis2 = true;  
           
          }  
          $scope.fillbox2 = function()
          {  
               $scope.hidethis2 = true;   
              
          }   
          $scope.clgdetails2 = function(){
             $scope.hidediv2 = true;
          
             $http.get("https://core.letsenrol.com/api/college-university/"+cid2+"/"+cslug2).success(function(response){
              $scope.clgdata2 =response[0];
             });
          }

          $scope.getbranch2 = function(courseShow2){
              course2 = courseShow2.id;
              $http.get("https://core.letsenrol.com/api/college-course-branch/"+course2).success(function(response){
                $scope.brlist2 = response;
              });
          }
          $scope.complete3 = function(string)
          { 

               $scope.hidethis3 = false; 
               var output = [];  
               angular.forEach($scope.dt, function(colg){ 
              
                    if(colg.college_name.indexOf(string.toUpperCase()) >= 0)  
                    {  
                         output.push(colg);  
                    }  
               });  
               $scope.filtercolg3 = output;  
          }  
          $scope.fillTextbox3 = function(id,string1, string2)
          {  
               cid3 = id;
               cslug3 = string2;
               $scope.clg3 = string1; 
               $scope.hidethis3 = true;  
           
          }  
          $scope.fillbox3 = function()
          {  
               $scope.hidethis3 = true;   
              
          }   
          $scope.clgdetails3 = function(){
             $scope.hidediv3 = true;
          
             $http.get("https://core.letsenrol.com/api/college-university/"+cid3+"/"+cslug3).success(function(response){
              $scope.clgdata3 =response[0];
             });
          }
          $scope.getbranch3 = function(courseShow3){
              course3 = courseShow3.id;
              $http.get("https://core.letsenrol.com/api/college-course-branch/"+course3).success(function(response){
                $scope.brlist3 = response;
              });
          }
}]);



 //usernamecntrl
 app.controller("usernamecntrl", function($scope,$http)
 {
 	$scope.sendemail=function(valid)
 	{
 		$scope.errMsg=false;
 		$scope.disabled=true;
 	  if(valid)
 	  {

	 	 $http.get("http://localhost:3000/api/resetusername/"+$scope.email).success(function(response)
	      {
	      	

	        if(response.success)
	        {
              $scope.successMsg=response.message;
	        }else{
              $scope.disabled=false;
              $scope.errMsg=response.message;
	        }

	      });
	  }
	  else
	  {
	  	$scope.disabled=false;
	  	$scope.errMsg="please enter valid email";
	  }
 	}
 });
 //resetpswrdcntrl
 app.controller("resetpswrdcntrl", function($scope,$http)
 {
   $scope.sendPassword=function(valid)
 	{
 		$scope.errMsg=false;
 		$scope.disabled=true;
 	  if(valid)
 	  {

	 	 $http.get("http://localhost:3000/api/resetpassword/"+$scope.email).success(function(response)
	      {
	      	

	        if(response.success)
	        {
              $scope.successMsg=response.message;
	        }else{
              $scope.disabled=false;
              $scope.errMsg=response.message;
	        }

	      });
	  }
	  else
	  {
	  	$scope.disabled=false;
	  	$scope.errMsg="please enter valid email";
	  }
 	}
 });

//custom factory

app.factory("auth",function(authtoken,$http,$q)
{
   var authorization={};
   authorization.facebook=function(token)
   {
    authtoken.setToken(token);
   };
   
   authorization.getuser=function()
   {
    if(authtoken.getToken())
    {
    	var config = 
                   {
                        headers :
                         {
                             'Content-Type': 'application/json'
                         }
                    }
      return $http.post('http://localhost:3000/api/me');
    }else
    {
      $q.reject({message:"user has no token"});
    }
   }
   authorization.activeAccount=function(token)
   {
   	return $http.put("http://localhost:3000/api/activate/"+token)
   }
   
   return authorization;
});

app.factory("authtoken",function($window)
{
  var authfactory={};

  authfactory.setToken=function(token)
  {
    if(token)
    {
    $window.localStorage.setItem("token",token);
    }
    else
    {
      $window.localStorage.removeItem("token");
    }
  };
  authfactory.logout=function()
  {
    authfactory.setToken();
  };
  
  authfactory.getToken=function()
  {
    return $window.localStorage.getItem("token");
  };
  authfactory.isLogdIn=function()
  {
    if(authfactory.getToken())
    {
      return true;
    }
    else
    {
      return false;
    }
  };
  
  return authfactory;
});

app.factory("authinceptors",function(authtoken)
{
  var authinceptorfactory={};
  authinceptorfactory.request=function(config)
  {
    var token=authtoken.getToken();
    if(token)config.headers['x-access-token']=token;
    return config;
  }
  return authinceptorfactory;
  })
  