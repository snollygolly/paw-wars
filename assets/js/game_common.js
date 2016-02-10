$( document ).ready(function() {
	$('[data-toggle="tooltip"]').tooltip({delay: { "show": 500, "hide": 100 }});
});


function displayAlert(type, message){
  alert = '<div class="alert alert-' + type + ' alert-dismissible" role="alert">';
  alert += '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' + message + '</div>';
  $("#alert-container").html(alert);
}

function updateHUD(lifeObj) {
  $("#hud-turn-value").html(lifeObj.current.turn);
  $("#hud-hp-value").html(lifeObj.current.health.points);
  $("#hud-cash-value").html(lifeObj.current.finance.cash);
  $("#hud-savings-value").html(lifeObj.current.finance.savings);
  $("#hud-debt-value").html(lifeObj.current.finance.debt);
  $("#hud-storage-value").html(lifeObj.current.storage.available);
  $("#hud-storage-total-value").html(lifeObj.current.storage.total);
}

function getObjFromArr(id, haystack){
  var i = 0;
  while (i < haystack.length){
    if (haystack[i].id == id){
      return haystack[i];
    }
    i++;
  }
  return false;
}

function toTitleCase(str)
{
  return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}
