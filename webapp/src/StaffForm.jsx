import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const StaffForm = () => {
  const [staffID, setStaffID] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate()

  const handleInputChange = (event) => {
    setStaffID( event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (staffID === "") {
      setError("Please enter Staff ID.");
      return;
    }

    fetch(`http://localhost:3000/staff/${staffID}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Staff ID ${staffID} does not exist.`);
        }
        return response.json();
      })
      .then(data => {
        navigate('/redeem', { state: { data } });
      })
      .catch(err => setError(err.message));
  };

  return (
    <div>
      <h2>Enter Staff ID to verify identity:</h2>
      <form className="form" onSubmit={handleSubmit}>
        <input className="form-input" type="text" value={staffID} onChange={handleInputChange} />
        <button className="submit-btn" type="submit">Next</button>
      </form>
      {error && <p className="form-error">{error}</p>}
    </div>
  );
};

export default StaffForm;
