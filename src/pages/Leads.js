import React, { useState, useEffect } from 'react';
import {
  Button,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import LeadForm from '../components/LeadForm';
import API_BASE_URL from '../config/api';

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [channelPartners, setChannelPartners] = useState([]);

  useEffect(() => {
    fetchLeads();
    fetchCompanies();
    fetchChannelPartners();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/leads`);
      const data = await response.json();
      setLeads(data);
    } catch (error) {
      console.error('Error fetching leads:', error);
    }
  };

  const fetchCompanies = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/companies`);
      const data = await response.json();
      setCompanies(data);
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  const fetchChannelPartners = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/channel-partners`);
      const data = await response.json();
      setChannelPartners(data);
    } catch (error) {
      console.error('Error fetching channel partners:', error);
    }
  };

  const handleAddLead = async (leadData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/leads/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leadData),
      });

      if (!response.ok) {
        throw new Error('Failed to add lead');
      }

      await fetchLeads();
      setOpenForm(false);
    } catch (error) {
      console.error('Error adding lead:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <Typography variant="h4">Leads</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => {
            setSelectedLead(null);
            setOpenForm(true);
          }}
        >
          Add Lead
        </Button>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Lead Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Company</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leads.map((lead) => (
              <TableRow key={lead._id}>
                <TableCell>{new Date(lead.date).toLocaleDateString()}</TableCell>
                <TableCell>{lead.fullName}</TableCell>
                <TableCell>{lead.phone}</TableCell>
                <TableCell>{lead.leadType}</TableCell>
                <TableCell>{lead.leadStatus}</TableCell>
                <TableCell>{lead.company}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <LeadForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSave={handleAddLead}
        initialData={selectedLead}
        companies={companies}
        channelPartners={channelPartners}
      />
    </Container>
  );
};

export default Leads;
