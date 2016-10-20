transactionsSchema = new SimpleSchema({
  btTransactionId:  { type: String },
  amount:           { type: Number },
  spaceId :         { type: String },
  // timeslotId :      { type: String },
  timeslotIdArray: {
    type: [String]
  },
  timeslotType: {
    type: Number,
    optional: true
  },
  timeslotArray: {
    type: [Number],
    optional: true
  },
  startTime: {
    type: Number,
    optional: true
  },
  endTime: {
    type: Number,
    optional: true
  },
  timeslotDate:     { type: String },
  // timeslotType:     { type: Number },
  timestampStart:   { type: Number },
  timestampEnd:     { type: Number },
  ownerId:          { type: String },
  bookeeId:         { type: String },
  car: {
    type: Object,
    optional: true
  },
  'car.model': {
    type: String
  },
  'car.number': {
    type: String
  },
  reportImgId:      { type: String,
                      optional: true },
  createdAt:        { type: Date,
                      autoValue: function(){
                        if(this.isInsert) {
                          return new Date();
                        } else {
                          this.unset();
                        }
                      }                         }
});
