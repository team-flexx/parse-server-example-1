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
  
  const storeMatchBool = true; //set default to false
  //DIFERENT TEST
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
    return false; //employer didn't swipe
  }else{
    //logger.info(results[0].get("createdAt"));
    return true; //in xcode this returns 1
  } 
});