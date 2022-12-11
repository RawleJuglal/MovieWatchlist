import React from 'react';
import './Movie.css'
import Tape from '../Tape/Tape'

export default function Movie(props){
    let movieList = props.data.map((ele)=>{
        console.log(ele)
        return <Tape key={ele.imdbID} data={ele} />
    })
    
    return(
        <div id='--movie-movie-container'>
            {movieList}
        </div>
    )
}