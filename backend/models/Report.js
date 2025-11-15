// models/Report.js
const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  filenames: [String],
  text: String,
  analysis: Object,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Report', ReportSchema);
