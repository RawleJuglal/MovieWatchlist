import React from 'react'
import './Tape.css'
import Button from 'react-bootstrap/Button';
import { UilStar } from '@iconscout/react-unicons'
import { UilPlusCircle } from '@iconscout/react-unicons'
import { UilMinusCircle } from '@iconscout/react-unicons'

export default function Tape(props){
    // console.log(props.data.Poster)
    return (
        <div className="--tape-tape-container">
                <div id="--tape-image-container">
                    <img id="--tape-img" src={props.data.Poster == 'N/A' ? './images/no-image.jpg' : props.data.Poster } />
                </div>
                <div id="--tape-info-container">
                    <div id="--tape-title-rating-container">
                       <p>
                            {props.data.Title && <span id="--tape-info-title">{props.data.Title}</span>}
                            {props.data.Ratings.length > 0 && <span id="--tape-info-rating"><UilStar size="15" color="#FEC654" /> {props.data.Ratings[0].Value.replace('/10', '')}</span>}
                        </p> 
                    </div>
                    <div id="--tape-runtime-genre-watch-container">
                        {props.data.Runtime && <p id="--tape-info-runtime">{props.data.Runtime}</p>}
                        {props.data.Genre && <p id="--tape-info-genre">{props.data.Genre}</p>}
                        <Button 
                            name={props.data.imdbID} 
                            className="--tape-info-watchlist-link" 
                            variant="link" 
                            onClick={props.watch ? (event)=>{props.removeWatch(event.target.name)} : (event)=>{props.addWatch(event.target.name)}}>{props.watch ? <UilMinusCircle size="15" color="#111827" /> : <UilPlusCircle size="15" color="#111827" />} Watchlist</Button>
                    </div>
                    <div id="--tape-plot-container">
                        {props.data.Plot && <p id="--tape-info-plot">{props.data.Plot}</p>}
                    </div> 
                </div>
                    
                
                
                
            
        </div>
    )
}