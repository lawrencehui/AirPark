issueSchema = new SimpleSchema({
  transactionId: {
    type: String
  },
  reporter: {
    type: String
  },
  type: {
    type: String
  },
  issueText: {
    type: String,
    optional: true
  },
  reportImg: {
    type: String
  },
  createdAt: {
    type: Date,
    autoform: {
      omit: true
    },
    autoValue: function(){
      if(this.isInsert) {
        return new Date();
      } else {
        this.unset();
      }
    }
  },
})
