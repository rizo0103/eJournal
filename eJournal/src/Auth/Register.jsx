/* eslint-disable no-unused-vars */
import React, { useRef, useState } from 'react';
import './index.css';
import defaultAvatar from '../../public/images/defaultAvatar.jpg';
import { backend } from '../assets/template';

const Register = () => {
    const [ avatarPreview, setAvatarPreview ] = useState(null);
    const [ avatar, setAvatar ] = useState(null);
    const [ fName, setFName ] = useState('');
    const [ lName, setLName ] = useState('');
    const [ username, setUsername ] = useState('');
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const avatarRef  = useRef(null);

    const handleAvatarChange = (event) => {
        const file = event.target.files[0];
        setAvatar(event.target.files[0]);

        if (file) {
            setAvatarPreview(URL.createObjectURL(file));
        }

        // console.log(file);
    };

    const onSubmit = (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('file', avatar);
        formData.append('fName', fName);
        formData.append('lName', lName);
        formData.append('username', username);
        formData.append('email', email);
        formData.append('password', password);


        fetch(`${backend}add-user`, {
            method: 'POST',
            body: formData,
        })
        .then(res => res.json())
        .then(res => {
            console.log(res);
            window.location.href = '/login';
        })
        .catch(err => console.error(err))

        // console.log(avatar);

        // console.log({
        //     fName: fName,
        //     lName: lName,
        //     username: username,
        //     email: email,
        //     password: password,
        // });
    };

    return (
        <main>
            <form className='main-form' onSubmit={onSubmit}>
                <div className='main-div'>
                    <h1>Sign Up</h1>
                    <div className='div-avatar' onClick={() => { avatarRef.current.click() }} style={{ cursor: 'pointer' }}>
                        <input style={{ display: 'none' }} type='file' ref={avatarRef} onChange={handleAvatarChange} />
                        <img src={avatarPreview || defaultAvatar} className='avatar' />
                    </div>
                    <div className='div-name'> 
                        <input className='first-name' placeholder='First Name' type='text' value={fName} onChange={(e) => { setFName(e.target.value) }} required /> 
                        <input className='last-name' placeholder='Last Name' type='text' value={lName} onChange={(e) => { setLName(e.target.value) }} required /> 
                    </div>
                    <div className='div-username'> <input className='username' placeholder='Username' type="username" value={username} onChange={(e) => { setUsername(e.target.value) }} required /> </div>
                    <div className='div-e-mail'> <input className='e-mail' placeholder='E-mail' type='email' value={email} onChange={(e) => { setEmail(e.target.value) }} /> </div>
                    <div className='div-password'> <input className='password' placeholder='Password' type='password' required value={password} onChange={(e) => { setPassword(e.target.value) }} /> </div>
                    <div className='div-submit'> <button type='submit' className='submit-btn'> Continue </button> </div>
                    <div className='alter-text'> <span className='span'> Already have an account? <a className='a' href='/login'>Sign in</a> </span> </div>
                </div>
            </form>
        </main>
    );
};

export default Register;
