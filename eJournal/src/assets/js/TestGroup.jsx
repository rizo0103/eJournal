/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { backend } from '../template';

const TestGroup = () => {
    const [ fName, setFName ] = useState('');
    const [ lName, setLName ] = useState('');

    const onSubmit = (e)  => {
        e.preventDefault();

        fetch(`${backend}add-student`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'table-name': '1a-1',
            },
            body: JSON.stringify({
                fName: fName,
                lName: lName,
                presentDays: {},
            })
        })        
    }

    return (
        <form className='main-form' onSubmit={onSubmit}>
            <div style={{ textAlign: 'center' }}>
                <input placeholder='fName' onChange={(e) => { setFName(e.target.value) }} /> <br />
                <input placeholder='lName' onChange={(e) => { setLName(e.target.value) }} /> <br />
                <button className='submit-btn'> submit </button>
            </div>
        </form>
    )
};

export default TestGroup;