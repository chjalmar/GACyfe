jQuery(document).ready(function($){
	// Add an event listener to the 'auth-button'.
  $("auth-button").click(authorize);
  
});
  
function authorize(event) {
  
  // Replace with your client ID from the developer console.
  var CLIENT_ID = '493750528357-5f9qqhkb6oukcpmc81atd7oti9v3im4c.apps.googleusercontent.com';

  // Set authorized scope.
  var SCOPES = ['https://www.googleapis.com/auth/analytics.readonly'];
  
  
  // Handles the authorization flow.
  // `immediate` should be false when invoked from the button click.
  var useImmdiate = event ? false : true;
  var authData = {
    client_id: CLIENT_ID,
    scope: SCOPES,
    immediate: useImmdiate
  };

  gapi.auth.authorize(authData, function(response) {
    var authButton = document.getElementById('auth-button');
    if (response.error) {
      authButton.hidden = false;
    }
    else {
      authButton.hidden = true;
      queryAccounts();
    }
  });
}

function queryAccounts() {
  // Load the Google Analytics client library.
  gapi.client.load('analytics', 'v3').then(function() {
    // Get a list of all Google Analytics accounts for this user
    gapi.client.analytics.management.accounts.list().then(handleAccounts);
  });
}


function handleAccounts(response) {
  // Handles the response from the accounts list method.
  if (response.result.items && response.result.items.length) {
    // Get the first Google Analytics account.
    
    makeSelector(response, "accounts", queryProperties);
    
  } else {
    console.log('No accounts found for this user.');
  }
}

function queryProperties(accountId) {
  // Get a list of all the properties for the selected account 
  
  gapi.client.analytics.management.webproperties.list(
      {'accountId': accountId})
    .then(handleProperties)
    .then(null, function(err) {
      // Log any errors.
      console.log(err);
  });
}


function handleProperties(response) {
  // Handles the response from the webproperties list method.
  if (response.result.items && response.result.items.length) {

    // Query for Views (Profiles).
    
    makeSelector(response, "properties", queryProfiles);
    
  } else {
    console.log('No properties found for this user.');
  }
}


function queryProfiles(accountId, propertyId) {
  // Get a list of all Views (Profiles) for the selected property
  // of the first Account.
  gapi.client.analytics.management.profiles.list({
      'accountId': accountId,
      'webPropertyId': propertyId
  })
  .then(handleProfiles)
  .then(null, function(err) {
      // Log any errors.
      console.log(err);
  });
}


function handleProfiles(response) {
  // Handles the response from the profiles list method.
  if (response.result.items && response.result.items.length) {
    // Get the first View (Profile) ID.
    //var firstProfileId = response.result.items[0].id;

    // Query the Core Reporting API.
    //queryCoreReportingApi(firstProfileId);
    
    makeSelector(response, "profiles", queryCoreReportingApi);
    
  } else {
    console.log('No views (profiles) found for this user.');
  }
}


function queryCoreReportingApi(profileId, fecha, metric) {
  // Query the Core Reporting API for the number sessions for
  // the past seven days.
  gapi.client.analytics.data.ga.get({
    'ids': 'ga:' + profileId,
    'start-date': fecha,
    'end-date': fecha,
    'metrics': metric
  })
  .then(function(response) {
    var formattedJson = JSON.stringify(response.result, null, 2);
    $("#query-output").val(formattedJson);
    sendToCyfe(response, $("#endpoint").val(), fecha);
  })
  .then(null, function(err) {
      // Log any errors.
      console.log(err);
  });
}

function makeAnalyticSelector() {
  var request = gapi.client.analytics.metadata.columns.list({
      'reportType': 'ga'
  });
  request.execute(renderMetadataReport);
}

function  getColumns(results) {
  var arreglo = [];
  if (results) {
    var columns = results.items;
    var cont = 0;
    for (var i = 0; i < columns.length; i++) {
      if (columns[i].attributes.status != "DEPRECATED") {
        var uiName = columns[i].attributes.uiName + " (" + columns[i].id + ")";
        arreglo[cont] = {
          id: columns[i].id,
          name: uiName
        };
        cont++;
      }
    }
  }
  return arreglo;
}