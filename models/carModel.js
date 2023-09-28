const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  model: String,
  year: Number,
  maker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Maker',
  },
});

const Car = mongoose.model('Car', carSchema);

module.exports = Car;