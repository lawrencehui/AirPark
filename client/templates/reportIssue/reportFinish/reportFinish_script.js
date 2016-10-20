Template.reportFinish.helpers({
  reportId: function(){
    return Router.current().params._id;
  },
  reportTime: function(){
    var date = Issues.findOne({_id: Router.current().params._id}).createdAt;
    return moment(date).format("hh:mm")
  },
  reportDate: function(){
    var date = Issues.findOne({_id: Router.current().params._id}).createdAt;
    return moment(date).format("DD.MM.YYYY")
  }
});

Template.reportFinish.events({
});

Template.reportFinish.onCreated(function(){
});

Template.reportFinish.onRendered(function(){
})
