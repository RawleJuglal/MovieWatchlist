import React from 'react';
import './Movie.css'
import Tape from '../Tape/Tape'
import { nanoid } from 'nanoid'

export default function Movie(props){
    let movieList = props.data.map((ele)=>{
        // console.log(ele)
        // console.log(props.handleAdd)
        return <Tape key={nanoid()} data={ele} addWatch={props.handleAdd} />
    })
    
    return(
        <div id='--movie-movie-container'>
            {movieList}
        </div>
    )
}