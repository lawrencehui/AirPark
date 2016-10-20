Template.connectionStatusBanner.helpers({
  isDisconnected: function(){
    var status = Session.get('connectionStatus');
    if(status === 0){
      return true;
    } else {
      return false;
    }
  },
  isReconnecting: function(){
    var status = Session.get('connectionStatus');
    if(status === 1){
      return true;
    } else {
      return false;
    }
  },
  statusText: function(){
    var status = Session.get('connectionStatus');
    switch(status) {
      case 0:
        return "No internet connection"
        break;
      case 1:
        return "Reconnecting to server"
        break;
      case 2:
        return "Connected"
        break;
      default:

    }
  }
});
