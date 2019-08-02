Parse.Cloud.define('hello', function(req, res) {
  return 'not hi';
});


Parse.Cloud.define("gettingData", async (request) => {
  const query = new Parse.Query("SMJobs");
  query.equalTo("companyName", request.params.companyName);
  const results = await query.find();
  return results[0].companyName;
});