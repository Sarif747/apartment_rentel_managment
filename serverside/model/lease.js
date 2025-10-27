const mongoose = require('mongoose');

const maintenanceRequestSchema = new mongoose.Schema({
    leaseNumber: {type: String,required: true,unique: true,},
    apartmentNumber: {type: String,required: true,},
    tenantName: {type: String,required: true,},
    startDate: {type: String,required: true,},
    endDate: {type: String,required: true,},
    monthlyRent: {type: Number,required: true,},
    securityDeposit: {type: Number,required: true,},
    leaseterms: {type: String},
    specialTerms: {type: String}
});

module.exports = mongoose.model('lease_mang', maintenanceRequestSchema, 'lease_mang');
