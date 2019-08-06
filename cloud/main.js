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

//an applicant swipe is saved, so we should look into that jobCard's employer, then
//and check: (is userID present &  jobID present?) if yes, then send that data to the
//matches view controller

//function = the function to run after save, which takes one paramter, Parse.Cloud.TriggerRequest
Parse.Cloud.afterSave(Parse.SMApplicantSwipeRight, 
  function(request)
  {
   return "something";
  }
);

