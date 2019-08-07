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

  const swipedJobID = request.object.get("jobID");
  logger.info("the swiped job ID: "+ swipedJobID);//this is how to get the info from the joblisting

  var swipedAuthorInfo = request.object.get("author");
  var someObject = {
    valueOf: function(){
    return swipedAuthorInfo;
  }};
  logger.info("swipedAuthorInfo stringified version: "+ someObject);
  
}
);

