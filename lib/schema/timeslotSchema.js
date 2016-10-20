timeslotSchema = new SimpleSchema({
  // ownerId : { type: String },
  spaceId : { type: String },
  timeslotDate: { type: String },
  timestampStart: {
    type: Number,
    optional: true
  },
  timestampEnd: {
    type: Number,
    optional: true
  },
  // timeslotStart: {
  //   type: Number,
  //   optional: true
  // },
  // timeslotEnd: {
  //   type: Number,
  //   optional: true
  // },
  timestampDate: {
    type: Number,
    optional: true
  },
  timeslotType: { type: Number,
                  optional: true},
                  //0: day parking
                  //1: night parking
                  //2: all day
                  //3: 9-10
                  //4: 10-11
                  //5: 11-12
                  //6: 12-13
                  //7: 13-14
                  //8: 14-15
                  //9: 15-16
                  //10: 16-17

  // timeslotPrice: { type: Number,
  //                  optional: true},
  isBooked: { type: Boolean,
              optional: true,
              defaultValue: false },
  isOccupied: { type: Boolean,
              optional: true,
              defaultValue: false }, // true when a time-crashing slot is booked
  bookeeId: { type: String,
              optional: true },
  // isCustom: {
  //   type: Boolean,
  //   optional: true,
  //   defaultValue: false
  // },
  dayOff: { type: Boolean,
            optional: true,
            defaultValue: false}
});
