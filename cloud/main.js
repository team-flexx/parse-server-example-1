Parse.Cloud.define('hello', function(req, res) {
  return 'not hi';
});

//use this to test cloud functions working
Parse.Cloud.define("gettingData", async (request) => {
  const query = new Parse.Query("User");
  query.equalTo("username", request.params.username);
  const results = await query.find();
  return results[0].get("applicantRejections");
});

const logger = require('parse-server').logger;//need this to log data in Parse 

//function = the function to run after save, which takes one paramter, Parse.Cloud.TriggerRequest
Parse.Cloud.afterSave("SMApplicantSwipeRight",(request) =>{
  logger.info("from the aftersave method");

  logger.info("the swiped job ID: "+ swipedJobID);//this is how to get the info from the joblisting
  const swipedAuthorInfo = request.object.get("author");
  const stringVersion = JSON.stringify(swipedAuthorInfo);
  const swipedUserID = stringVersion.substring(12,stringVersion.length-4);
  logger.info("swipedAuthorInfo stringified version: "+ swipedUserID);
  

}
);

