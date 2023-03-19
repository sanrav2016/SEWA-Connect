import React from 'react';
import './App.css';
import { Dashboard, AccessTime, Group, Event, Newspaper, Logout } from '@mui/icons-material';
import Tooltip from '@mui/material/Tooltip';

function importAll(r) {
    let images = {};
    r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
    return images;
}
  
const images = importAll(require.context('./images', false, /\.(png|jpe?g|svg)$/));

function Sidebar(props) {
    
const sendSignOutRequest = () => {
    props.cookies.remove("jwt");
    props.setAuth(false);
}

  return (
    <div className={`sidebar ${!props.sidebar ? "sidebar-collapsed" : ""}`}>
        <img src={ images["logo.png"] } />
        <div className="link-container">
            <div className={`link-wrapper ${(props.page == "dashboard" ? "link-wrapper-selected" : "")}`}
                 onClick={ () => props.setPage("dashboard") }>
                <Dashboard className="icon" />
                <span>Dashboard</span>
            </div>
            <div className={`link-wrapper ${(props.page == "hours" ? "link-wrapper-selected" : "")}`} 
                 onClick={ () => props.setPage("hours") }>
                <AccessTime className="icon" />
                <span>Hours</span>
            </div>
            <div className={`link-wrapper ${(props.page == "chapters" ? "link-wrapper-selected" : "")}`} 
                 onClick={ () => props.setPage("chapters") }>
                <Group className="icon" />
                <span>Chapters</span>
            </div>
            <div className={`link-wrapper ${(props.page == "events" ? "link-wrapper-selected" : "")}`} 
                 onClick={ () => props.setPage("events") }>
                <Event className="icon" />
                <span>Events</span>
            </div>
            <div className={`link-wrapper ${(props.page == "news" ? "link-wrapper-selected" : "")}`} 
                 onClick={ () => window.open("https://sewausa.org/Newsletters") }>
                <Newspaper className="icon" />
                <span>News</span>
            </div>
        </div>
        <div className="user-info-container">
            <Tooltip title="Settings" placement="top-start">
                <div className="user-info-text"
                    onClick={ () => props.setPage("settings") }>
                        <span>{ props.userData.fname + " " + props.userData.lname.substr(0, 1) + "."}</span>
                        <span>{ props.userData.role.substr(0, 1).toUpperCase() + props.userData.role.substr(1) }</span>
                </div>
            </Tooltip>
            <Tooltip title="Logout" placement="right">
                <Logout className="logout-icon" onClick={ sendSignOutRequest } />
            </Tooltip>
        </div>
    </div>
  );
}

export default Sidebar;