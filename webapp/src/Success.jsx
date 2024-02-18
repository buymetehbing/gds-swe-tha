import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Success = () => {
  const navigate = useNavigate()

  const handleReturn = (event) => {
    event.preventDefault();
    navigate('/');
  };

  return (
    <div>
      <h2>Successfully Redeemed!</h2>
      <button className="submit-btn" onClick={handleReturn}>Back</button>
    </div>
  );
};

export default Success;
