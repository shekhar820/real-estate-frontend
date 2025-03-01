import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from '@mui/material';
import Leads from './pages/Leads';
import RealEstateProject from './components/RealEstateProject';
import './App.css';

function App() {
  return (
    <Router>
      <Container maxWidth="lg">
        <Routes>
          <Route path="/" element={<RealEstateProject />} />
          <Route path="/leads" element={<Leads />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
