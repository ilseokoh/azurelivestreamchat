var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var RoomSchema = new Schema({
title: {
        type: String,
        required: true,
        validate: [function(value) {return value.length <= 120}, 'Title is too long (120 char)'],
        default: 'New Room'
    },
  streamurl: String,
  deleted: {
    type: Boolean,
    default: false
  }
});

RoomSchema.virtual('date')
  .get(function(){
    return this._id.getTimestamp();
  });

mongoose.model('Room', RoomSchema);

