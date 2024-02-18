import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import StaffForm from './StaffForm';
import RedeemForm from './RedeemForm';
import Success from './Success';
import './App.css';

const App = () => {
  return (
    <Router>
      <div>
        <h1>Redemption Portal</h1>
        <Routes>
          <Route path="/" element={<StaffForm />} />
          <Route path="/redeem" element={<RedeemForm />} />
          <Route path="/success" element={<Success />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
