import React from 'react';
import './Splash.css'

export default function Splash(props){
    return(
        <div id='--splash-splash-container'>
            {props.searched ? <p id='--no-data-text'>Unable to find what you're looking for. Please try another search.</p> : <div id='--splash-splash-box'><img id='--splash-icon' src="./images/filmStrip-icon.png" alt="film strip" /><p id='--splash-text'>Start Exploring</p></div>}
            
            
        </div>
    )
}