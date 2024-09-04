/* eslint-disable no-unused-vars */
import React, { useState } from 'react';

const TestGroup = () => {
    const [ groups, setGroups ] = useState('');
    const [ group, setGroup ] = useState('');

    const submit = () => {
        fetch (`http://localhost:5174/add-groups`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: 'mdrizo',
                groups: groups,
            }),
        })
        .then(res => res.json())
        .then(data => console.log(data.data))
        .catch(err => console.error(err));
    };

    return (
        <div style={{display: 'grid', color: 'white', justifyContent: 'center', alignContent: 'center',}}>
            <br /> <input onChange={(e) => { setGroup(e.target.value) }} />
            <br /> <button onClick={() => { setGroups(groups + ' ' + group) }}>Add</button>
            <br /> <textarea value={groups || ''} onChange={() => {}} />
            <br /> <button onClick={() => setGroups('')}> Clear </button>
            <br /> <button onClick={submit}> Submit </button> 
        </div>
    );
};

export default TestGroup;