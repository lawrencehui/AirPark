Template.additionalInfoView.onRendered(function(){
  if(Session.get('evToggle_value')){
    $('#evToggle').prop("checked", true);
  }

  if(Session.get('disabled_value')){
    $('#disabledToggle').prop("checked", true);
  }

  if(Session.get('oversizedToggle_value')){
    $('#oversizedToggle').prop("checked", true);
  }
  
});


Template.additionalInfoView.events({
  'change #evToggle': function(event, template) {

    var isChecked = $('#evToggle').prop("checked");
    Session.set("evToggle_value", isChecked);
  },
  'change #disabledToggle': function(event, template) {

    var isChecked = $('#disabledToggle').prop("checked");
    Session.set("disabled_value", isChecked);
  },
  'change #oversizedToggle': function(event, template) {

    var isChecked = $('#oversizedToggle').prop("checked");
    Session.set("oversizedToggle_value", isChecked);
  },
});
