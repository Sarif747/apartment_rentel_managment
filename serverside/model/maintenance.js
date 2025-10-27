const mongoose = require('mongoose');

const maintenanceRequestSchema = new mongoose.Schema({
  requestNumber: {type: String,required: true,unique: true,},
  apartmentNumber: {type: String,required: true,},
  tenantName: {type: String,required: true,},
  issueDescription: {type: String,required: true,},
  requestDate: {type: String,required: true,},
  priority: {type: String},
  status: {type: String}
});

module.exports = mongoose.model('maintenance_mang', maintenanceRequestSchema, 'maintenance_mang');
