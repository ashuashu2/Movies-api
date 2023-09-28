const mongoose = require('mongoose');

const makerSchema = new mongoose.Schema({
  model: String,
  logo: String,
  tagline: String,
});

const Maker = mongoose.model('Maker', makerSchema);

module.exports = Maker;