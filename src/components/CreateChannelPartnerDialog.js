import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const CreateChannelPartnerDialog = ({ open, onClose, onSave, initialData }) => {
  const [partnerData, setPartnerData] = useState({
    fullName: '',
    email: '',
    phone: '',
    reraNumber: '',
    agencyName: '',
    partnerType: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setPartnerData(initialData);
    } else {
      setPartnerData({
        fullName: '',
        email: '',
        phone: '',
        reraNumber: '',
        agencyName: '',
        partnerType: ''
      });
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors = {};
    
    // Full Name validation
    if (!partnerData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!partnerData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(partnerData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation
    const phoneRegex = /^\d{10}$/;
    if (!partnerData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(partnerData.phone)) {
      newErrors.phone = 'Phone number must be exactly 10 digits';
    }

    // RERA validation
    if (partnerData.reraNumber && partnerData.reraNumber.length < 5) {
      newErrors.reraNumber = 'RERA number must be at least 5 characters';
    }

    // Agency Name validation
    if (!partnerData.agencyName.trim()) {
      newErrors.agencyName = 'Agency name is required';
    }

    // Partner Type validation
    if (!partnerData.partnerType) {
      newErrors.partnerType = 'Partner type is required';
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

    setPartnerData(prev => ({
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
      onSave(partnerData);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initialData ? 'Edit Channel Partner' : 'Create Channel Partner'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="fullName"
          label="Full Name"
          fullWidth
          required
          variant="outlined"
          value={partnerData.fullName}
          onChange={handleChange}
          error={!!errors.fullName}
          helperText={errors.fullName}
          sx={{ mb: 2 }}
        />
        <TextField
          margin="dense"
          name="email"
          label="Email"
          type="email"
          fullWidth
          required
          variant="outlined"
          value={partnerData.email}
          onChange={handleChange}
          error={!!errors.email}
          helperText={errors.email}
          sx={{ mb: 2 }}
        />
        <TextField
          margin="dense"
          name="phone"
          label="Phone"
          fullWidth
          required
          variant="outlined"
          value={partnerData.phone}
          onChange={handleChange}
          error={!!errors.phone}
          helperText={errors.phone}
          sx={{ mb: 2 }}
        />
        <TextField
          margin="dense"
          name="reraNumber"
          label="RERA Number"
          fullWidth
          variant="outlined"
          value={partnerData.reraNumber}
          onChange={handleChange}
          error={!!errors.reraNumber}
          helperText={errors.reraNumber}
          sx={{ mb: 2 }}
        />
        <TextField
          margin="dense"
          name="agencyName"
          label="Agency Name"
          fullWidth
          required
          variant="outlined"
          value={partnerData.agencyName}
          onChange={handleChange}
          error={!!errors.agencyName}
          helperText={errors.agencyName}
          sx={{ mb: 2 }}
        />
        <FormControl fullWidth required error={!!errors.partnerType}>
          <InputLabel>Partner Type</InputLabel>
          <Select
            name="partnerType"
            value={partnerData.partnerType}
            label="Partner Type"
            onChange={handleChange}
          >
            <MenuItem value="individual">Individual</MenuItem>
            <MenuItem value="agency">Agency</MenuItem>
            <MenuItem value="broker">Broker</MenuItem>
          </Select>
        </FormControl>
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

export default CreateChannelPartnerDialog;
