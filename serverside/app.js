const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Apartment = require('./model/app_mg');
const Maintenance  = require('./model/maintenance')
const Tenant = require('./model/tenant');
const Lease = require('./model/lease')


const app = express();

mongoose.connect('mongodb+srv://apartment_managment:apartmentgroup1@cluster0.httqlhs.mongodb.net/IT6203', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log("Connected to MongoDB");
})
.catch((err) => {
    console.log("Error connecting to MongoDB:", err);
});

app.use((req, res, next) => {
    console.log('This line is always called');
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept');
    next();
});

app.use(bodyParser.urlencoded({ extended: false })); 
app.use(bodyParser.json()); 

app.get('/apartment', (req, res) => {
    Apartment.find()
      .then((data) => {
        console.log(data)
        res.status(200).json(data); 
      })
      .catch((err) => {
        console.log('Error:', err);
        res.status(500).json({ error: err });
      });
});

app.get('/tenant', (req, res) => {
  Tenant.find()
    .then((data) => {
      console.log(data)
      res.status(200).json(data); 
    })
    .catch((err) => {
      console.log('Error:', err);
      res.status(500).json({ error: err });
    });
});

app.post('/apartment', (req, res, next) => {
    const { apartmentNumber, address, buildingNumber, bedrooms, bathrooms, price, squareFootage, amenities } = req.body;
  
    if (!apartmentNumber || !address || !buildingNumber || !bedrooms || !bathrooms || !price || !squareFootage) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }
  
    const apartmentAmenities = amenities || '';
  
    const apartment = new Apartment({
      apartmentNumber,
      address,
      buildingNumber,
      bedrooms,
      bathrooms,
      price,
      squareFootage,
      amenities: apartmentAmenities
    });
  
    apartment.save()
      .then(() => {
        console.log('Apartment saved successfully');
        res.status(201).json({ message: 'Apartment saved successfully', apartment });
      })
      .catch((err) => {
        console.error('Error:', err);
        res.status(500).json({ error: 'An error occurred while saving the apartment' });
      });
});

app.post('/tenant', (req, res, next) => {
  const { tenantId, fullName, email, phone, apartmentNumber, leaseStartDate, leaseEndDate } = req.body;

  if (!tenantId || !apartmentNumber || !fullName || !email || !phone || !leaseStartDate || !leaseEndDate) {
    return res.status(400).json({ error: 'All required fields must be provided' });
  }

  const tenant = new Tenant({
    tenantId,
    fullName,
    email,
    phone,
    apartmentNumber,
    leaseStartDate,
    leaseEndDate
  });

  tenant.save()
    .then(() => {
      console.log('tenant saved successfully');
      res.status(201).json({ message: 'tenant saved successfully', tenant });
    })
    .catch((err) => {
      console.error('Error:', err);
      res.status(500).json({ error: 'An error occurred while saving the tenant' });
    });
});


app.delete('/apartment/:apartmentNumber', (req, res, next) => {
    Apartment.deleteOne({ apartmentNumber: req.params.apartmentNumber })
        .then((result) => {
            if (result.deletedCount === 0) {
                return res.status(404).json({ message: 'Apartment not found' });
            }
            res.status(200).json({ message: 'Apartment deleted successfully' }); 
        })
        .catch((err) => {
            console.log('Error:', err);
            res.status(500).json({ error: err }); 
        });
});

app.delete('/tenant/:tenantId', (req, res, next) => {
  Tenant.deleteOne({ tenantId: req.params.tenantId })
      .then((result) => {
          if (result.deletedCount === 0) {
              return res.status(404).json({ message: 'tenant not found' });
          }
          res.status(200).json({ message: 'tenant deleted successfully' }); 
      })
      .catch((err) => {
          console.log('Error:', err);
          res.status(500).json({ error: err }); 
      });
});

app.put('/apartment/:apartmentNumber', (req, res, next) => {
    const apartmentNumber = req.params.apartmentNumber; 
    const updatedData = req.body; 

    Apartment.findOneAndUpdate({ apartmentNumber }, updatedData, { new: true })
        .then((updatedApartment) => {
            if (!updatedApartment) {
                return res.status(404).json({ message: 'Apartment not found' });
            }
            res.status(200).json({ message: 'Apartment updated successfully', apartment: updatedApartment });
        })
        .catch((err) => {
            console.log('Error:', err);
            res.status(500).json({ error: err });
        });
});

app.put('/tenant/:tenantId', (req, res, next) => {
  const tenantId = req.params.tenantId; 
  const updatedData = req.body; 

  Tenant.findOneAndUpdate({ tenantId }, updatedData, { new: true })
      .then((updatedTenant) => {
          if (!updatedTenant) {
              return res.status(404).json({ message: 'tenant not found' });
          }
          res.status(200).json({ message: 'tenant updated successfully', tenant: updatedTenant });
      })
      .catch((err) => {
          console.log('Error:', err);
          res.status(500).json({ error: err });
      });
});

app.get('/apartment/search', (req, res) => {
    const searchQuery = req.query.search.toLowerCase();  
    console.log('Search query received:', searchQuery);  

    Apartment.find({
        $or: [
            { apartmentNumber: { $regex: searchQuery, $options: 'i' } },  
            { address: { $regex: searchQuery, $options: 'i' } }          
        ]
    })
    .then((filteredApartments) => {
        if (filteredApartments.length > 0) {
            res.json(filteredApartments);  
        } else {
            res.status(404).json({ message: 'Apartment not found' });  
        }
    })
    .catch((err) => {
        console.log('Error:', err);
        res.status(500).json({ error: err });
    });
});

app.get('/tenant/search', (req, res) => {
  const searchQuery = req.query.search.toLowerCase();  
  console.log('Search query received:', searchQuery);  

  Tenant.find({
      $or: [
          { tenantId: { $regex: searchQuery, $options: 'i' } },  
          { address: { $regex: searchQuery, $options: 'i' } }          
      ]
  })
  .then((filteredTenants) => {
      if (filteredTenants.length > 0) {
          res.json(filteredTenants);  
      } else {
          res.status(404).json({ message: 'Tenant not found' });  
      }
  })
  .catch((err) => {
      console.log('Error:', err);
      res.status(500).json({ error: err });
  });
});

app.get('/maintenance', (req, res) => {
    Maintenance .find()
    .then((data) => {
      console.log(data)
      res.status(200).json(data); 
    })
    .catch((err) => {
      console.log('Error:', err);
      res.status(500).json({ error: err });
    });
  });

app.get('/leases', (req, res) => {
    Lease .find()
    .then((data) => {
      console.log(data)
      res.status(200).json(data); 
    })
    .catch((err) => {
      console.log('Error:', err);
      res.status(500).json({ error: err });
    });
});

app.post('/maintenance', (req, res, next) => {
    const { requestNumber, apartmentNumber, tenantName, issueDescription, requestDate, priority, status } = req.body;

    if (!requestNumber || !apartmentNumber || !tenantName || !issueDescription || !requestDate) {
        return res.status(400).json({ error: 'All required fields must be provided' });
    }

    const maintenancePriority = priority || 'Low';  
    const maintenanceStatus = status || 'Pending'; 

    const maintenanceRequest = new Maintenance({
        requestNumber,
        apartmentNumber,
        tenantName,
        issueDescription,
        requestDate,
        priority: maintenancePriority,
        status: maintenanceStatus
    });

    maintenanceRequest.save()
        .then(() => {
            console.log('Maintenance request saved successfully');
            res.status(201).json({ message: 'Maintenance request saved successfully', maintenanceRequest });
        })
        .catch((err) => {
            console.error('Error:', err);
            res.status(500).json({ error: 'An error occurred while saving the maintenance request' });
        });
});

app.post('/leases', (req, res, next) => {
  const { leaseNumber, apartmentNumber, tenantName, startDate, endDate, monthlyRent,securityDeposit, leaseterms,specialTerms } = req.body;

  if (!leaseNumber || !apartmentNumber || !tenantName || !startDate || !endDate || !monthlyRent || !securityDeposit || !leaseterms || !specialTerms) {
      return res.status(400).json({ error: 'All required fields must be provided' });
  }

  const leaseRequest = new Lease({
      leaseNumber,
      apartmentNumber,
      tenantName,
      startDate,
      endDate,
      monthlyRent,
      securityDeposit,
      leaseterms,
      specialTerms
  });

  leaseRequest.save()
      .then(() => {
          console.log('Lease request saved successfully');
          res.status(201).json({ message: 'Lease request saved successfully', leaseRequest });
      })
      .catch((err) => {
          console.error('Error:', err);
          res.status(500).json({ error: 'An error occurred while saving the Lease request' });
      });
});

app.delete('/maintenance/:requestNumber', (req, res, next) => {
    const { requestNumber } = req.params;

    Maintenance .deleteOne({ requestNumber })
        .then((result) => {
            if (result.deletedCount === 0) {
                return res.status(404).json({ message: 'Maintenance request not found' });
            }
            res.status(200).json({ message: 'Maintenance request deleted successfully' });
        })
        .catch((err) => {
            console.error('Error:', err);
            res.status(500).json({ error: 'An error occurred while deleting the maintenance request' });
        });
});

app.delete('/leases/:leaseNumber', (req, res, next) => {
  const { leaseNumber } = req.params;

  Lease .deleteOne({ leaseNumber })
      .then((result) => {
          if (result.deletedCount === 0) {
              return res.status(404).json({ message: 'Lease request not found' });
          }
          res.status(200).json({ message: 'Lease request deleted successfully' });
      })
      .catch((err) => {
          console.error('Error:', err);
          res.status(500).json({ error: 'An error occurred while deleting the Lease request' });
      });
});

app.put('/maintenance/:requestNumber', (req, res, next) => {
    const { requestNumber } = req.params;
    const updatedData = req.body;

    Maintenance .findOneAndUpdate({ requestNumber }, updatedData, { new: true })
        .then((updatedRequest) => {
            if (!updatedRequest) {
                return res.status(404).json({ message: 'Maintenance request not found' });
            }
            res.status(200).json({ message: 'Maintenance request updated successfully', maintenance: updatedRequest });
        })
        .catch((err) => {
            console.error('Error:', err);
            res.status(500).json({ error: 'An error occurred while updating the maintenance request' });
        });
});

app.put('/leases/:leaseNumber', (req, res, next) => {
  const { leaseNumber } = req.params;
  const updatedData = req.body;

  Lease .findOneAndUpdate({ leaseNumber }, updatedData, { new: true })
      .then((updatedRequest) => {
          if (!updatedRequest) {
              return res.status(404).json({ message: 'lease request not found' });
          }
          res.status(200).json({ message: 'lease request updated successfully', lease: updatedRequest });
      })
      .catch((err) => {
          console.error('Error:', err);
          res.status(500).json({ error: 'An error occurred while updating the lease request' });
      });
});

app.get('/maintenance/:requestNumber', (req, res, next) => {
    const requestNumber = req.params.requestNumber; 
    Maintenance .findOne({ requestNumber }) 
        .then((maintenance) => {
            if (!maintenance) {
                return res.status(404).json({ message: 'maintenance not found arif' });
            }
            res.status(200).json(maintenance);
        })
        .catch((err) => {
            console.log('Error:', err);
            res.status(500).json({ error: err });
        });
});


app.get('/leases/:leaseNumber', (req, res, next) => {
  const leaseNumber = req.params.leaseNumber; 
  Lease .findOne({ leaseNumber }) 
      .then((lease) => {
          if (!lease) {
              return res.status(404).json({ message: 'lease not found arif' });
          }
          res.status(200).json(lease);
      })
      .catch((err) => {
          console.log('Error:', err);
          res.status(500).json({ error: err });
      });
});


module.exports = app;