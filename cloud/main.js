Parse.Cloud.define('hello', function(req, res) {
  return 'not hi';
});

//use this to test cloud functions working
Parse.Cloud.define("gettingData", async (request) => {
  const query = new Parse.Query("User");
  query.equalTo("username", request.params.username);
  const results = await query.find();
  return results[0].get("applicantSwipes");
});

const logger = require('parse-server').logger;//need this to log data in Parse 

//function = the function to run after save, which takes one paramter, Parse.Cloud.TriggerRequest
Parse.Cloud.afterSave("SMApplicantSwipeRight",(request) =>{
  logger.info("from the aftersave method");

  //get jobID from applicant swipe right
  const swipedJobID = request.object.get("jobID");
  logger.info("the swiped job ID: "+ swipedJobID);//this is how to get the info from the joblisting

  //get userID from applicant swipe right
  const swipedAuthorInfo = request.object.get("author");
  const stringVersion = JSON.stringify(swipedAuthorInfo);
  const swipedUserID = stringVersion.substring(13, stringVersion.length-4);
  logger.info("swipedAuthorInfo stringified version: "+ swipedUserID);

  //get user POINTERRRRS
  const swipedUserPointer = request.user;
  
  //get job POINTERR
  const swipedJobPointer = request.object.get("jobPointer");
  logger.info("job pointer");
  logger.info(swipedJobPointer);

  const storeMatchBool = true; //set default to false
 
  Parse.Cloud.run("didEmployerSwipe", { jobID: swipedJobID, applicantIDPlainText: swipedUserID}).then(function(result) {
    logger.info("result :" + JSON.stringify(result));
    storeMatchBool = result;
    logger.info(storeMatchBool);
  }, function(error) {
    logger.info("something went wrong calling cloud function in cloud");
  });

  //add row
  if (storeMatchBool){ //if match exists
    logger.info("let's add a new row");
    var SMMatches = Parse.Object.extend("SMMatches");
    var aNewMatch = new SMMatches();
    aNewMatch.set("user", swipedUserID);
    aNewMatch.set("userPointer", swipedUserPointer); 
    aNewMatch.set("jobPointer", swipedJobPointer); //CHANGED THIS ONE LINE JUST NOW
    aNewMatch.set("employer", "n/a");
    aNewMatch.set("matchedJobID", swipedJobID);

    aNewMatch.save()
      .then((aNewMatch) => {
        // Execute any logic that should take place after the object is saved.
        alert('New object created with objectId: ' + aNewMatch.id);
      }, (error) => {
        // Execute any logic that should take place if the save fails.
        // error is a Parse.Error with an error code and message.
        alert('Failed to create new object, with error code: ' + error.message);
      });
  }
  else{
    logger.info("no new matches")
  }
}
);


Parse.Cloud.define("didEmployerSwipe", async (request) => {
  const query = new Parse.Query("SMEmployerSwipeRight");
  query.equalTo("jobID", request.params.jobID) && query.equalTo("applicantIDPlainText", request.params.applicantIDPlainText);
  const results = await query.find();
  //return results[0].get("createdAt");
  if (results == undefined || results.length == 0) {
    // array empty or does not exist
    return true; //employer didn't swipe  TODO:CHANGE THIS BACK TO FALSE
  }else{
    //logger.info(results[0].get("createdAt"));
    return true; //in xcode this returns 1
  } 
});

// Parse.Cloud.define("getMatchedData", async (request) => {
//   const query = new Parse.Query("SMMatches");
//   query.equalTo("user", request.params.user); //found that the user as matches, then we want return its pointers to job
//   const results = await query.find();
//   //return results[0].get("createdAt");
//   if (results == undefined || results.length == 0) {
//     // array empty or does not exist
//     logger.info("no matches for you"); //employer didn't swipe  TODO:CHANGE THIS BACK TO FALSE
//   }else{
//     logger.info("here are the results for your matches: " + JSON.stringify(results));

//     const wholeRequest = JSON.stringify(request);
//     var obj = JSON.parse(wholeRequest);
//     logger.info("heres the whole request but parsed" + JSON.stringify(obj));

//     const parsedJobPointer = Object.entries(obj);
//     logger.info("JOB INFO!!  :" + JSON.stringify(parsedJobPointer));

//     //LOOK AT ALL ROWS
//   } 
// });

Parse.Cloud.define("getMatchedData", async (request) => {
  const query = new Parse.Query("SMMatches");
  query.equalTo("user", request.params.user); //found that the user as matches, then we want return its pointers to job
  query.select("jobPointer"); //restrict field returned
  query.include("jobPointer");

  const matches = await query.find();
  // logger.info("matches to return: " + JSON.stringify(matches));
  const unwrappedMatches = matches.map(match => match["jobPointer"]);
  logger.info("matches to return: " + JSON.stringify(unwrappedMatches));
  return unwrappedMatches;
});