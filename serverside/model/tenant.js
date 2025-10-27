const mongoose = require("mongoose");

const tenantSchema = new mongoose.Schema({
    tenantId: { type: String, required: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    apartmentNumber: { type: String, required: true },
    leaseStartDate: { type: String, required: true },
    leaseEndDate: { type: String, required: true },
});
  
module.exports  = mongoose.model("tenent_mang", tenantSchema, "tenent_mang");
