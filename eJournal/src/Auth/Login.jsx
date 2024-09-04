/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { backend } from '../assets/template';

const Login = () => {
    const [ username, setUsername ] = useState('');
    const [ password, setPassword ] = useState('');

    const onSubmit = (event) => {
        event.preventDefault();

        fetch(`${backend}login-user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password,
            }),
        })
        .then(response => response.json())
        .then(data => {
            console.log(data.access_token)
            window.localStorage.setItem('access_token', data.access_token);
            window.location.href = '/';
        })
        .catch(error => console.error('Error:', error));

        // console.log({
        //     username: username,
        //     password: password,
        // });        
    };

    return (
        <main>
            <form className='main-form' onSubmit={onSubmit}>
                <div className='main-div'>
                    <h1> Sign In </h1>
                    <div className='div-username'> <input className='username' placeholder='Username' type="username" value={username} onChange={(e) => { setUsername(e.target.value) }} required /> </div>
                    <div className='div-password'> <input className='password' placeholder='Password' type='password' required value={password} onChange={(e) => { setPassword(e.target.value) }} /> </div>
                    <div className='div-submit'> <button type='submit' className='submit-btn'> Submit </button> </div>
                    <div className='alter-text'> <span className='span'> {`Don't have an account yet`}? <a className='a' href='/register'>Sign up</a> </span> </div>
                </div>
            </form>
        </main>
    );
};

export default Login;
