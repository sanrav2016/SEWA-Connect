import React from 'react';
import './App.css';
import { Menu, Search, Person, ArrowDropDown } from '@mui/icons-material';

function importAll(r) {
    let images = {};
    r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
    return images;
}
  
const images = importAll(require.context('./images', false, /\.(png|jpe?g|svg)$/));

function Headerbar(props) {
  return (
    <div className="headerbar">
      <Menu className="menu-icon" onClick={ props.toggleSidebar } />
    </div>
  );
}

export default Headerbar;