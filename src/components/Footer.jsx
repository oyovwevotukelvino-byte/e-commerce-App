import React from 'react'
import "../App.css";
import  { InstagramIcon, FacebookIcon, TwitchIcon, LinkedinIcon , Store}from "lucide-react";
function Footer( ) {
  return (
    <div className="footer">   
      <p>"Shopping App Copyright © 2026 Digital Mall All rights reserved"</p>
      <div className="social-icons">
        
        <InstagramIcon  className="icon" instagram />
        <FacebookIcon className="icon"/>
        <TwitchIcon className="icon"/>
        <LinkedinIcon className="icon"/>
        <Store className="icon"/>
      </div>
    </div>
  )
}

export default Footer