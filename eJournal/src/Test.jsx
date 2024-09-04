/* eslint-disable no-unused-vars */
import React from "react";

export const Test = () => {
    const onClick = () => {
        fetch('http://localhost:5174/add-user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                fName: 'Sam',
                lName: 'Smith',
                groups: '1 2 3',
                avatar: 'awe',
                username: 'username',
                password: 'password',
            }),
        });
    };
    
    return (
        <>
            <h1>Hello, World</h1>
            <button onClick={onClick}>Send</button>
        </>
    )
};
