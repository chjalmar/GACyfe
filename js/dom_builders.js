function makeSelector(response, field, thenCall) {
	var opciones = [];
    
  for (var i = 0; i < response.result.items.length; i++) {
    opciones[i] = {
      id: response.result.items[i].id,
      name: response.result.items[i].name
    };
  }
    
  makeDropDownList(field, opciones);
  
  if (thenCall == queryCoreReportingApi) {
    
    makeQueryDataForm();
    
  }
  
  $("#" + field).change(function(){
    // Query next level
    if (thenCall == queryProperties) { 
      thenCall(this.value);
    } else if (thenCall == queryProfiles) {
      thenCall(response.result.items[0].accountId, this.value);
    } else if (thenCall == queryCoreReportingApi) {
      //Do nothing and wait for button click
      
    }
  });
}

function makeDropDownList(fieldname, optionList) {
  var combo = $("<select></select>").attr("id", fieldname).attr("name", fieldname);
    
  combo.append("<option selected>Seleccione</option>");
   
  $.each(optionList, function (i, el) {
    combo.append("<option value='" + el.id + "'>" + el.name + "</option>");
  });

  $(".container").append(combo);
  $(".container").append("<br>");
}

function makeQueryDataForm() {
  
  makeDatePicker();
  makeAnalyticSelector();
  makeEndpointBox();
  
  var but = $("<input type=submit>").attr("id", "sendRequest");
  
  $(".button-container").append(but);
  $(".button-container").append("<br>");
  
  $("#sendRequest").click(function(){
    queryCoreReportingApi($("#profiles").val(), $("#fecha").val(), $("#analytic").val());	
  });
  
}

function makeDatePicker() {
  var fecha = $("<input type=text>").attr("id", "fecha").attr("name", "fecha");
  
  $(".container").append(fecha);
  $(".container").append("<br>");
  
  $( "#fecha" ).datepicker({
    dateFormat: "yy-mm-dd"
  });	
}

function makeEndpointBox() {
  var campo = "Pegue aquí el Endpoint proporcionado por el API PUSH Widget de Cyfe:<br><input size=60 type=text id=endpoint>";
  $(".button-container").append(campo);
  $(".button-container").append("<br>");
}

function renderMetadataReport(results) {
  var allMetricsArray = getColumns(results);

  // Renders the results to a Dropdown
  
  makeDropDownList("analytic", allMetricsArray);
    
}
