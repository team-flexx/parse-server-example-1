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
  

  //this breaks parse
  //find jobID and userID from employer SwipeRight
  // const params = { jobID: "31530", applicantIDPlainText: "AvDGgEMpI3"};
  // const isMatchBool = await Parse.Cloud.run("didEmployerSwipe?", params); //should be 1 or 0
  
  // logger.info(isMatchBool);

  //DIFERENT TEST
  Parse.Cloud.run("didEmployerSwipe?", { jobID: "31530", applicantIDPlainText: "AvDGgEMpI3"}).then(function(result) {
    console.log("result :" + JSON.stringify(result));
  }, function(error) {
    logger.info("something went wrong calling cloud function in cloud");
  });

}
);


Parse.Cloud.define("didEmployerSwipe?", async (request) => {
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