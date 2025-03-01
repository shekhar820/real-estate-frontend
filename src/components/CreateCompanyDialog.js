import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';

const CreateCompanyDialog = ({ open, onClose, onSave, initialData }) => {
  const [companyData, setCompanyData] = useState({
    name: '',
    address: '',
    contactPerson: '',
    phone: '',
    email: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setCompanyData(initialData);
    } else {
      setCompanyData({
        name: '',
        address: '',
        contactPerson: '',
        phone: '',
        email: ''
      });
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors = {};
    
    // Company Name validation
    if (!companyData.name.trim()) {
      newErrors.name = 'Company name is required';
    }

    // Phone validation
    if (companyData.phone) {
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(companyData.phone)) {
        newErrors.phone = 'Phone number must be exactly 10 digits';
      }
    }

    // Email validation
    if (companyData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(companyData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    // Address validation
    if (!companyData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;
    
    // Special handling for phone numbers
    if (name === 'phone') {
      processedValue = value.replace(/\D/g, '').slice(0, 10);
    }

    setCompanyData(prev => ({
      ...prev,
      [name]: processedValue
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(companyData);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{initialData ? 'Edit Company' : 'Create New Company'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="name"
          label="Company Name"
          fullWidth
          required
          variant="outlined"
          value={companyData.name}
          onChange={handleChange}
          error={!!errors.name}
          helperText={errors.name}
        />
        <TextField
          margin="dense"
          name="address"
          label="Address"
          fullWidth
          required
          variant="outlined"
          value={companyData.address}
          onChange={handleChange}
          error={!!errors.address}
          helperText={errors.address}
          multiline
          rows={2}
        />
        <TextField
          margin="dense"
          name="contactPerson"
          label="Contact Person"
          fullWidth
          variant="outlined"
          value={companyData.contactPerson}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="phone"
          label="Phone"
          fullWidth
          variant="outlined"
          value={companyData.phone}
          onChange={handleChange}
          error={!!errors.phone}
          helperText={errors.phone}
        />
        <TextField
          margin="dense"
          name="email"
          label="Email"
          type="email"
          fullWidth
          variant="outlined"
          value={companyData.email}
          onChange={handleChange}
          error={!!errors.email}
          helperText={errors.email}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">
          {initialData ? 'Update' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateCompanyDialog;
