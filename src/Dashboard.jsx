import React from 'react';
import './App.css';

function Dashboard(props) {

  return (
    <>
    <div className="header">Dashboard</div>
    <p><b>Name:</b> { props.userData.fname + " " + props.userData.lname }</p>
    <p><b>Role:</b> { props.userData.role.substr(0, 1).toUpperCase() + props.userData.role.substr(1) }</p>
    </>
  );
}

export default Dashboard;
