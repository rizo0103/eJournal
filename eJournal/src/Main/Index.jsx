/* eslint-disable no-unused-vars */
import AddGroup from '../assets/js/AddGroup';
import Dropdown from '../assets/js/Dropdown';
import Group from '../assets/js/Group';
import { backend } from '../assets/template';
import Login from '../Auth/Login';
import './index.css';
import './main-page.css';
import React, { useEffect, useState } from 'react';

const Index = () => {
    const token = window.localStorage.getItem('access_token');
    const [ userData, setUserData ] = useState({});
    const [ openGroupMenu, setOpenGroupMenu ] = useState(false);

    useEffect(() => {
        if (token) {
            fetch(`${backend}get-user-data`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            })
            .then(res => res.json())
            .then(data => {
                setUserData(data.data[0])
            })
            .catch(err => {
                console.error(err);
                window.localStorage.removeItem('access_token');
            });
        }
    }, [token]);

    if (!window.localStorage.getItem('access_token')) {
        return <Login />
    }

    const handleDataFromChild = (childData) => {
        setOpenGroupMenu(childData);
    };

    return (
        <main>
            <div className = 'side-bar'>
                <div className='div-square-avatar'>
                    <img className='square-avatar' src={`images/${userData.avatar}`} />
                </div>
                <div className='text-username'>{userData.username}</div>
                <Dropdown message={userData.groups} sendData={handleDataFromChild} />
            </div>
            <div className='content-part'>
                {openGroupMenu && (
                    <Group message={{ groupName: openGroupMenu.name, data: openGroupMenu.data }} />
                )}
            </div>
        </main>
    );
};

export default Index;
