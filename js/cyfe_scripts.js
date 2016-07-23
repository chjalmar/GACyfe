function sendToCyfe(response, endpoint, fecha) {
  
  var dato = response.result.rows[0].toString();
  
  var datos_push = {
        "data":  [
                {
                        "Date":  fecha,
                        "Sesiones":  dato
                }
        ],
        "onduplicate":  {
                "Sesiones":  "replace"
        }
        };
  
  var datos_string = JSON.stringify(datos_push, null, 2);
  
  $.ajax({ type: 'POST',   
	    	 url: endpoint,
	    	 data:datos_string,
	    	 async: false,
	    	 success : function(text)
	    	 {
	    	     var formattedJson = JSON.stringify(text, null, 2);
             $("#cyfe-output").val(formattedJson);
	    	 }
	});	
}
