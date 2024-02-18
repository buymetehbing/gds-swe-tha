import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const RedeemForm = () => {
  const location = useLocation();
  const [staffData, setStaffData] = useState(location.state.data.record || {})
  const [redemptionStatus, setRedemptionStatus] = useState(null);
  const [redemptionData, setRedemptionData] = useState(null);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate()

  useEffect(() => {
    if (!redemptionStatus) {

      fetch(`http://localhost:3000/redemption/${staffData.team_name}`)
        .then(response => {
          return response.json();
        })
        .then(data => {
          setRedemptionStatus(data.status);
          setRedemptionData(data.record?.representative_pass_id?? null) 
        })
        .catch(err => setError(err.message));
    }
  }, [redemptionStatus]);

  const handleReturn = (event) => {
    event.preventDefault();
    navigate('/');
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const requestBody = {
      teamName: staffData.team_name,
      representativePassId: staffData.staff_pass_id
    };
  
    fetch('http://localhost:3000/redemption/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Unable to redeem.`);
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
        navigate('/success');
      })
      .catch(err => setError(err.message));
  };

  return (
    <div>
      <h2>Team Name: {staffData.team_name}</h2>
      <h3 style={{ color: redemptionStatus === 'ELIGIBLE' ? '#14c55b' : '#de2c2c' }}>
        Redemption Status: {redemptionStatus} 
      </h3>
      {redemptionData ? (
      <div>
        <p> Successfully redeemed by {redemptionData}. </p>
        <button className="submit-btn" onClick={handleReturn}>Back</button>
      </div>
      ) : (
        <div>
          <button className="submit-btn" onClick={handleReturn}>Back</button>
          <button className="submit-btn redeem" onClick={handleSubmit}>Redeem</button>
        </div>
      )}
      {error && <p className="form-error">{error}</p>}
    </div>
  );
};

export default RedeemForm;
