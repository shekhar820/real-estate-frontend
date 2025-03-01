import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config/api';

// MUI Components
import {
  Box,
  Button,
  Container,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme,
  Card,
  CardContent,
  Tabs,
  Tab,
  Dialog,
  Chip,
  Link,
  Snackbar
} from '@mui/material';

// MUI Icons
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BusinessIcon from '@mui/icons-material/Business';
import PeopleIcon from '@mui/icons-material/People';

// Custom Components
import LeadForm from './LeadForm';
import ChannelPartnerForm from './ChannelPartnerForm';
import CompanyForm from './CompanyForm';
import CreateCompanyDialog from './CreateCompanyDialog';
import CreateChannelPartnerDialog from './CreateChannelPartnerDialog';

const RealEstateProject = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [activeTab, setActiveTab] = useState(0);
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);
  const [isChannelPartnerFormOpen, setIsChannelPartnerFormOpen] = useState(false);
  const [isCompanyFormOpen, setIsCompanyFormOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedPartner, setSelectedPartner] = useState('');
  const [companies, setCompanies] = useState([]);
  const [channelPartners, setChannelPartners] = useState([]);
  const [leads, setLeads] = useState([]);
  const [editingLead, setEditingLead] = useState(null);
  const [editingChannelPartner, setEditingChannelPartner] = useState(null);
  const [editingCompany, setEditingCompany] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    fetchLeads();
    fetchCompanies();
    fetchChannelPartners();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/leads`);
      setLeads(response.data);
    } catch (error) {
      console.error('Error fetching leads:', error);
      setSnackbar({
        open: true,
        message: 'Failed to fetch leads. Please try again.',
        severity: 'error'
      });
    }
  };

  const fetchCompanies = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/companies`);
      setCompanies(response.data);
    } catch (error) {
      console.error('Error fetching companies:', error);
      setSnackbar({
        open: true,
        message: 'Failed to fetch companies. Please try again.',
        severity: 'error'
      });
    }
  };

  const fetchChannelPartners = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/channelPartners`);
      if (response.data) {
        setChannelPartners(response.data);
      }
    } catch (error) {
      console.error('Error fetching channel partners:', error);
      setSnackbar({
        open: true,
        message: 'Failed to fetch channel partners. Please try again.',
        severity: 'error'
      });
    }
  };

  const handleAddLead = async (leadData) => {
    try {
      const formattedData = {
        ...leadData,
        date: new Date(leadData.date).toISOString(),
        company: leadData.company || '',
        channelPartner: leadData.leadType === 'channel_partner' ? leadData.channelPartner : ''
      };

      if (editingLead) {
        await axios.put(`${API_BASE_URL}/leads/${editingLead.id}`, formattedData);
      } else {
        const response = await axios.post(`${API_BASE_URL}/leads`, formattedData);
        if (response.data) {
          await fetchLeads();
        }
      }
      setEditingLead(null);
      setIsLeadFormOpen(false);
      await fetchLeads();
    } catch (error) {
      console.error('Error saving lead:', error);
      setSnackbar({
        open: true,
        message: 'Failed to save lead. Please try again.',
        severity: 'error'
      });
    }
  };

  const handleEditLead = (lead) => {
    setEditingLead({
      ...lead,
      id: lead.id,
      company: lead.company || '',
      channelPartner: lead.channelPartner || ''
    });
    setIsLeadFormOpen(true);
  };

  const handleDeleteLead = async (id) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await axios.delete(`${API_BASE_URL}/leads/${id}`);
        await fetchLeads();
      } catch (error) {
        console.error('Error deleting lead:', error);
        setSnackbar({
          open: true,
          message: 'Failed to delete lead. Please try again.',
          severity: 'error'
        });
      }
    }
  };

  const handleAddChannelPartner = async (partnerData) => {
    try {
      if (editingChannelPartner) {
        await axios.put(`${API_BASE_URL}/channelPartners/${editingChannelPartner.id}`, partnerData);
      } else {
        const response = await axios.post(`${API_BASE_URL}/channelPartners`, partnerData);
        if (response.data) {
          await fetchChannelPartners();
        }
      }
      setEditingChannelPartner(null);
      setIsChannelPartnerFormOpen(false);
      await fetchChannelPartners();
    } catch (error) {
      console.error('Error saving channel partner:', error);
      setSnackbar({
        open: true,
        message: 'Failed to save channel partner. Please try again.',
        severity: 'error'
      });
    }
  };

  const handleEditChannelPartner = (partner) => {
    setEditingChannelPartner({
      ...partner,
      id: partner.id
    });
    setIsChannelPartnerFormOpen(true);
  };

  const handleDeleteChannelPartner = async (id) => {
    if (window.confirm('Are you sure you want to delete this channel partner?')) {
      try {
        await axios.delete(`${API_BASE_URL}/channelPartners/${id}`);
        await fetchChannelPartners();
      } catch (error) {
        console.error('Error deleting channel partner:', error);
        setSnackbar({
          open: true,
          message: 'Failed to delete channel partner. Please try again.',
          severity: 'error'
        });
      }
    }
  };

  const handleAddCompany = async (companyData) => {
    try {
      if (editingCompany) {
        await axios.put(`${API_BASE_URL}/companies/${editingCompany.id || editingCompany._id}`, companyData);
      } else {
        await axios.post(`${API_BASE_URL}/companies`, companyData);
      }
      await fetchCompanies();
      setEditingCompany(null);
      setIsCompanyFormOpen(false);
      setSnackbar({
        open: true,
        message: 'Company saved successfully!',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error saving company:', error);
      setSnackbar({
        open: true,
        message: 'Failed to save company. Please try again.',
        severity: 'error'
      });
    }
  };

  const handleEditCompany = (company) => {
    setEditingCompany(company);
    setIsCompanyFormOpen(true);
  };

  const handleDeleteCompany = async (id) => {
    if (window.confirm('Are you sure you want to delete this company?')) {
      try {
        await axios.delete(`${API_BASE_URL}/companies/${id}`);
        await fetchCompanies();
      } catch (error) {
        console.error('Error deleting company:', error);
        setSnackbar({
          open: true,
          message: 'Failed to delete company. Please try again.',
          severity: 'error'
        });
      }
    }
  };

  const filteredLeads = leads.filter(lead => {
    const companyMatch = !selectedCompany || lead.company === selectedCompany;
    const partnerMatch = !selectedPartner || lead.channelPartner === selectedPartner;
    return companyMatch && partnerMatch;
  });

  const renderLeadsTab = () => (
    <Box>
      <Box sx={{ 
        display: 'flex', 
        gap: 2,
        mb: 3
      }}>
        <FormControl sx={{ minWidth: 200 }} size="small">
          <InputLabel>Filter by Company</InputLabel>
          <Select
            value={selectedCompany}
            label="Filter by Company"
            onChange={(e) => setSelectedCompany(e.target.value)}
          >
            <MenuItem value="">All Companies</MenuItem>
            {companies.map((company) => (
              <MenuItem key={company.id || company._id} value={company.id || company._id}>
                {company.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 200 }} size="small">
          <InputLabel>Filter by Partner</InputLabel>
          <Select
            value={selectedPartner}
            label="Filter by Partner"
            onChange={(e) => setSelectedPartner(e.target.value)}
          >
            <MenuItem value="">All Partners</MenuItem>
            {channelPartners.map((partner) => (
              <MenuItem key={partner.id || partner._id} value={partner.id || partner._id}>
                {partner.fullName} - {partner.agencyName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <TableContainer>
        <Table sx={{ 
          '& .MuiTableCell-root': {
            py: 2,
            px: 2,
            fontSize: '0.875rem'
          },
          '& .MuiTableCell-head': {
            fontWeight: 600,
            color: 'text.secondary'
          }
        }}>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Lead Type</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Full Name</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Purpose</TableCell>
              <TableCell>Budget</TableCell>
              <TableCell>BHK</TableCell>
              <TableCell>Lead Source</TableCell>
              <TableCell>Lead Status</TableCell>
              <TableCell>Financing</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredLeads.map((lead) => (
              <TableRow key={lead.id || lead._id} hover>
                <TableCell>{lead.date ? new Date(lead.date).toLocaleDateString() : 'N/A'}</TableCell>
                <TableCell>{lead.leadType === 'channel_partner' ? 'Channel Partner' : 'My Lead'}</TableCell>
                <TableCell>{lead.company ? lead.company.name : 'N/A'}</TableCell>
                <TableCell>{lead.fullName}</TableCell>
                <TableCell>{lead.phone}</TableCell>
                <TableCell>{lead.email}</TableCell>
                <TableCell>{lead.purpose}</TableCell>
                <TableCell>{lead.budget}</TableCell>
                <TableCell>{lead.bhk}</TableCell>
                <TableCell>{lead.leadSource}</TableCell>
                <TableCell>
                  <Chip 
                    label={lead.leadStatus} 
                    size="small"
                    sx={{
                      bgcolor: 
                        lead.leadStatus === 'New' ? '#E3F2FD' :
                        lead.leadStatus === 'Contacted' ? '#E8F5E9' :
                        lead.leadStatus === 'Qualified' ? '#FFF3E0' :
                        lead.leadStatus === 'Lost' ? '#FFEBEE' :
                        '#F5F5F5',
                      color:
                        lead.leadStatus === 'New' ? '#1976D2' :
                        lead.leadStatus === 'Contacted' ? '#43A047' :
                        lead.leadStatus === 'Qualified' ? '#FB8C00' :
                        lead.leadStatus === 'Lost' ? '#E53935' :
                        '#757575',
                    }}
                  />
                </TableCell>
                <TableCell>{lead.financing}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => handleEditLead(lead)}>
                    <EditIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDeleteLead(lead.id || lead._id)}>
                    <DeleteIcon fontSize="small" sx={{ color: 'error.main' }} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const renderCompaniesTab = () => (
    <Box>
      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Company Name</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Website</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {companies.map((company) => (
              <TableRow key={company.id || company._id} hover>
                <TableCell>{company.name}</TableCell>
                <TableCell>{company.phone}</TableCell>
                <TableCell>{company.email}</TableCell>
                <TableCell>
                  {company.website && (
                    <Link href={company.website} target="_blank" rel="noopener">
                      {company.website}
                    </Link>
                  )}
                </TableCell>
                <TableCell>{company.address}</TableCell>
                <TableCell>{company.description}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => handleEditCompany(company)}>
                    <EditIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDeleteCompany(company.id || company._id)}>
                    <DeleteIcon fontSize="small" sx={{ color: 'error.main' }} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const renderPartnersTab = () => (
    <Box>
      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Full Name</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Partner Type</TableCell>
              <TableCell>Agency Name</TableCell>
              <TableCell>RERA Number</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {channelPartners.map((partner) => (
              <TableRow key={partner.id || partner._id} hover>
                <TableCell>{partner.fullName}</TableCell>
                <TableCell>{partner.phone}</TableCell>
                <TableCell>{partner.email}</TableCell>
                <TableCell>{partner.partnerType}</TableCell>
                <TableCell>{partner.agencyName}</TableCell>
                <TableCell>{partner.reraNumber}</TableCell>
                <TableCell align="center">
                  <IconButton size="small" onClick={() => handleEditChannelPartner(partner)}>
                    <EditIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDeleteChannelPartner(partner.id || partner._id)}>
                    <DeleteIcon fontSize="small" sx={{ color: 'error.main' }} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  return (
    <Box sx={{ 
      p: { xs: 2, sm: 3 },
      width: '100%',
      maxWidth: '100%'
    }}>
      <Box sx={{ 
        mb: 4, 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between', 
        alignItems: isMobile ? 'stretch' : 'center',
        gap: 2,
        p: 3,
        borderRadius: 2,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <Typography variant="h4" sx={{ 
          fontSize: { xs: '1.5rem', sm: '2rem' },
          color: '#1976d2',
          fontWeight: 600
        }}>
          Real Estate CRM
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row',
          gap: 1 
        }}>
          <Button 
            variant="outlined"
            onClick={() => setIsCompanyFormOpen(true)}
            fullWidth={isMobile}
            startIcon={<AddIcon />}
            sx={{ 
              borderRadius: '8px',
              textTransform: 'none',
              minWidth: '150px'
            }}
          >
            Create Company
          </Button>
          <Button 
            variant="outlined"
            onClick={() => setIsChannelPartnerFormOpen(true)}
            fullWidth={isMobile}
            startIcon={<AddIcon />}
            sx={{ 
              borderRadius: '8px',
              textTransform: 'none',
              minWidth: '150px'
            }}
          >
            Create Partner
          </Button>
          <Button 
            variant="contained" 
            onClick={() => setIsLeadFormOpen(true)}
            fullWidth={isMobile}
            startIcon={<AddIcon />}
            sx={{ 
              borderRadius: '8px',
              textTransform: 'none',
              minWidth: '150px',
              background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
              boxShadow: '0 3px 5px 2px rgba(33, 150, 243, .3)'
            }}
          >
            Add Lead
          </Button>
        </Box>
      </Box>

      <Box sx={{ 
        borderRadius: 2,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        mb: 3,
        overflow: 'hidden'
      }}>
        <Tabs 
          value={activeTab} 
          onChange={(e, newValue) => setActiveTab(newValue)}
          variant={isMobile ? "fullWidth" : "standard"}
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': {
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 500,
              minWidth: '120px'
            },
            '& .Mui-selected': {
              color: '#1976d2'
            },
            '& .MuiTab-root .MuiSvgIcon-root': {
              marginBottom: '-4px',
              marginRight: '8px'
            }
          }}
        >
          <Tab icon={<AssignmentIcon />} iconPosition="start" label="Leads" />
          <Tab icon={<BusinessIcon />} iconPosition="start" label="Companies" />
          <Tab icon={<PeopleIcon />} iconPosition="start" label="Channel Partners" />
        </Tabs>
      </Box>

      <Box sx={{ 
        borderRadius: 2,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        {activeTab === 0 && renderLeadsTab()}
        {activeTab === 1 && renderCompaniesTab()}
        {activeTab === 2 && renderPartnersTab()}
      </Box>

      <LeadForm
        open={isLeadFormOpen}
        onClose={() => {
          setIsLeadFormOpen(false);
          setEditingLead(null);
        }}
        onSave={handleAddLead}
        companies={companies}
        channelPartners={channelPartners}
        initialData={editingLead}
      />

      <ChannelPartnerForm
        open={isChannelPartnerFormOpen}
        onClose={() => {
          setIsChannelPartnerFormOpen(false);
          setEditingChannelPartner(null);
        }}
        onSave={handleAddChannelPartner}
        initialData={editingChannelPartner}
      />

      <CompanyForm
        open={isCompanyFormOpen}
        onClose={() => {
          setIsCompanyFormOpen(false);
          setEditingCompany(null);
        }}
        onSave={handleAddCompany}
        initialData={editingCompany}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        severity={snackbar.severity}
      />
    </Box>
  );
};

export default RealEstateProject;
