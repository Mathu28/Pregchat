import React from "react";

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';



// Import pages

import Landing from './pages/Landing';

import ChatBot from './pages/ChatBot';

import LoginPage from './pages/Login';

import MedicalData from './pages/MedicalData';

import MedicineReminder from './pages/MedicineReminder';

import PregnancyResources from './pages/PregnancyResources';

import TalkToBaby from './pages/TalkToBaby';

import EmergencyLaborChecklist from './pages/EmergencyLaborChecklist'; // ✅ Import the new component



function App() {

  return (

    <Router>

      <Routes>

        <Route path="/" element={<LoginPage />} />

        <Route path="/landing" element={<Landing />} />

        <Route path="/chat-ui" element={<ChatBot />} />

        <Route path="/medical-data" element={<MedicalData />} />

        <Route path="/medicines" element={<MedicineReminder />} />

        <Route path="/resources" element={<PregnancyResources />} />

        <Route path="/talk-to-baby" element={<TalkToBaby />} />

        <Route path="/emergency" element={<EmergencyLaborChecklist />} /> {/* ✅ NEW ROUTE */}

      </Routes>

    </Router>

  );

}



export default App;