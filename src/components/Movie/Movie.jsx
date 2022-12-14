import React from 'react';
import './Movie.css'
import Tape from '../Tape/Tape'
import { nanoid } from 'nanoid'

export default function Movie(props){
    let movieList = props.data.filter((ele)=>{
        if(ele.Response === 'True'){
            return ele
        }
    }).map((ele)=>{
        // console.log(ele)
        // console.log(props.handleAdd)
        return <Tape key={nanoid()} watch={props.watch} data={ele} addWatch={props.handleAdd} removeWatch={props.handleRemove} />
    })
    
    return(
        <div id='--movie-movie-container'>
            {movieList}
        </div>
    )
}