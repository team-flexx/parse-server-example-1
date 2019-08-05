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
Parse.Cloud.afterSave("SMApplicantSwipeRight", (request) => { //pass in the whole joblisting
  //go to employer's swipe and get jobID userID and check. NOTE: Need to add in userID into Parse
  const query = new Parse.Query("SMEmployerSwipeRight"); 

  //get params from applicant swipe right (jobID, userID) 
  query.equalTo("jobID", request.params.jobID) && query.equalTo("applicantID, request.params.applicantID");
  
  const matchExistsArray = await query.find(); //this is an array of stuff that has the right one, and it SHOULD be one
  MediaKeySystemAccess.out.print(matchExistsArray[0]);
  if (matchExistsArray != undefined){
  //TODO: save a row to matched table in parse
  const SMMatches = Parse.Object.extend("SMMatches");
  const aNewMatch = new SMMatches();

  aNewMatch.set("user", "test");
  aNewMatch.set("employer", "test");
  aNewMatch.set("matchedJobID", "test");


  aNewMatch.save().then((aNewMatch) => {
    // Execute any logic that should take place after the object is saved.
    alert('New object created with objectId: ' + aNewMatch.id);
  }, (error) => {
    // Execute any logic that should take place if the save fails.
    // error is a Parse.Error with an error code and message.
    alert('Failed to create new object, with error code: ' + error.message);
  });
  
  }
});

