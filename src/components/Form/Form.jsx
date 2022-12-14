import React from 'react'
import './Form.css'
import Button from 'react-bootstrap/Button';
import BootStrapForm from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

export default function Form(props){
    return (
        <div id="--form-form-container">
            <InputGroup>
                <BootStrapForm.Control
                placeholder='Search for movie'
                aria-label="Recipient's username"
                aria-describedby="basic-addon2"
                onChange={(event)=>props.handleChange(event)}
                />
                <Button disabled={props.watch} className='--form-search-btn' variant="light" id="button-addon2" onClick={props.handleSearch}>
                Search
                </Button>
            </InputGroup>
        </div>
    )
}