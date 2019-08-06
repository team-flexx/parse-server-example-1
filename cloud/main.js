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
Parse.Cloud.define("tryFunction", async (request) =>{
  Parse.Cloud.afterSave(Parse.SMApplicantSwipeRight, (request, response) => {//pass in the whole joblisting
    //get params from applicant swipe right (jobID, userID)
    //go to employer's swipe and get jobID userID and check. NOTE: Need to add in userID into Parse
    //console.log("does .afterSave get triggered after something is swiped right?");
    
    if (!request.object.existed()){
      console.log("job didn't exist");
    }
    else{
      console.log("job existed");
    }
  });
  return "does anything work??? ";
});


