/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import '../css/add-group.css';
import { backend } from '../template';

const AddGroup = ({ message }) => {
    const [ groups, setGroups ] = useState('');

    const onSubmit = (event) => {
        event.preventDefault();

        fetch(`${backend}add-groups`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: message.username,
                groups: message.groups + ' ' + groups.replace(/\s+/g, ''),
            }),
        })
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(err => console.error(err));
    };

    return (
        <div className='main-container'>
            <form className='main-form' onSubmit={onSubmit}>
                <div className='main-div'>
                    <h1> Add Group </h1>
                    <div className='div-username'> <input className='username' placeholder='Type Group Name' type="username" value={groups} onChange={(e) => { setGroups(e.target.value) }} required /> </div>
                    <div className='div-submit' style={{ marginTop: '2vh' }}> <button type='submit' className='submit-btn'> Add </button> </div>
                </div>
            </form>
        </div>
    );
};

export default AddGroup;
