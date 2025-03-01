import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  FormHelperText
} from '@mui/material';

const LeadForm = ({ open, onClose, onSave, initialData, channelPartners, companies }) => {
  const initialFormState = {
    leadType: 'my_lead',
    date: new Date().toISOString().split('T')[0],
    fullName: '',
    phone: '',
    email: '',
    purpose: '',
    budget: '',
    bhk: '',
    leadSource: '',
    leadStatus: 'New',
    financing: '',
    channelPartner: '',
    company: ''
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        date: new Date(initialData.date).toISOString().split('T')[0],
        company: initialData.company?._id || initialData.company,
        channelPartner: initialData.channelPartner?._id || initialData.channelPartner
      });
    } else {
      setFormData(initialFormState);
    }
    setErrors({});
  }, [initialData, open]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = 'Full name is required';
    if (!formData.phone) {
      newErrors.phone = 'Phone is required';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone must be 10 digits';
    }
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.purpose) newErrors.purpose = 'Purpose is required';
    if (!formData.company) {
      newErrors.company = 'Company is required';
    }
    if (formData.leadType === 'channel_partner' && !formData.channelPartner) {
      newErrors.channelPartner = 'Channel Partner is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(formData);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{initialData ? 'Edit Lead' : 'Add New Lead'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Lead Type</InputLabel>
              <Select
                value={formData.leadType}
                onChange={(e) => handleChange('leadType', e.target.value)}
                label="Lead Type"
              >
                <MenuItem value="my_lead">My Lead</MenuItem>
                <MenuItem value="channel_partner">Channel Partner Lead</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {formData.leadType === 'channel_partner' && (
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Channel Partner</InputLabel>
                <Select
                  value={formData.channelPartner}
                  onChange={(e) => handleChange('channelPartner', e.target.value)}
                  label="Channel Partner"
                  error={!!errors.channelPartner}
                >
                  <MenuItem value="">
                    <em>Select Channel Partner</em>
                  </MenuItem>
                  {channelPartners.map((partner) => (
                    <MenuItem key={partner.id} value={partner.id}>
                      {partner.fullName}
                    </MenuItem>
                  ))}
                </Select>
                {errors.channelPartner && (
                  <FormHelperText error>{errors.channelPartner}</FormHelperText>
                )}
              </FormControl>
            </Grid>
          )}

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Company</InputLabel>
              <Select
                value={formData.company}
                onChange={(e) => handleChange('company', e.target.value)}
                label="Company"
                error={!!errors.company}
              >
                <MenuItem value="">
                  <em>Select Company</em>
                </MenuItem>
                {companies.map((company) => (
                  <MenuItem key={company.id} value={company.id}>
                    {company.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.company && (
                <FormHelperText error>{errors.company}</FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Full Name"
              value={formData.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              error={!!errors.fullName}
              helperText={errors.fullName}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Phone"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              error={!!errors.phone}
              helperText={errors.phone}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              error={!!errors.email}
              helperText={errors.email}
              type="email"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Purpose</InputLabel>
              <Select
                value={formData.purpose}
                onChange={(e) => handleChange('purpose', e.target.value)}
                label="Purpose"
              >
                <MenuItem value="Buy">Buy</MenuItem>
                <MenuItem value="Rent">Rent</MenuItem>
                <MenuItem value="Invest">Invest</MenuItem>
                <MenuItem value="Resale">Resale</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Budget"
              value={formData.budget}
              onChange={(e) => handleChange('budget', e.target.value)}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>BHK</InputLabel>
              <Select
                value={formData.bhk}
                onChange={(e) => handleChange('bhk', e.target.value)}
                label="BHK"
              >
                <MenuItem value="1">1</MenuItem>
                <MenuItem value="2">2</MenuItem>
                <MenuItem value="3">3</MenuItem>
                <MenuItem value="4+">4+</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Lead Source</InputLabel>
              <Select
                value={formData.leadSource}
                onChange={(e) => handleChange('leadSource', e.target.value)}
                label="Lead Source"
              >
                <MenuItem value="Website">Website</MenuItem>
                <MenuItem value="Ads">Ads</MenuItem>
                <MenuItem value="Walk In">Walk In</MenuItem>
                <MenuItem value="Broker">Broker</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Lead Status</InputLabel>
              <Select
                value={formData.leadStatus}
                onChange={(e) => handleChange('leadStatus', e.target.value)}
                label="Lead Status"
              >
                <MenuItem value="New">New</MenuItem>
                <MenuItem value="Contacted">Contacted</MenuItem>
                <MenuItem value="Site Visit">Site Visit</MenuItem>
                <MenuItem value="Offer Made">Offer Made</MenuItem>
                <MenuItem value="Lost">Lost</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Financing</InputLabel>
              <Select
                value={formData.financing}
                onChange={(e) => handleChange('financing', e.target.value)}
                label="Financing"
              >
                <MenuItem value="Self">Self</MenuItem>
                <MenuItem value="Home Loan">Home Loan</MenuItem>
                <MenuItem value="Not Sure">Not Sure</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {initialData ? 'Update' : 'Add'} Lead
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LeadForm;