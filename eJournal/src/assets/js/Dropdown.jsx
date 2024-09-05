/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import '../css/dropdown.css';
import { backend } from '../template';

const Dropdown = ({ message, sendData }) => {
    // <div className='dropdown'>
    //     <div className='title'> Dropdown </div>
    //     <div className='ico'> <button className='dropdown-btn'> <img src={down} className='dropdown-ico' /> </button> </div>
    // </div>
    const [ height, setHeight ] = useState(0);
    const [ groups, setGroups ] = useState([]);
    // const [ openGroupMenu, setOpenGroupMenu ] = useState(true);

    const onChange = (e) => {
        if (e.target.checked) {
            setHeight(groups.length * 50);
        } else {
            setHeight(0);
        }
    }

    const getGroupData = (group) => {

        fetch(`${backend}get-group-data`, {
            method: 'GET',
            headers: {
                'table-name': group,
            },
        })
        .then(res => res.json())
        .then(data => {sendData({ name: group, data: data.data })})
        .catch(err => console.error(err));
    }

    useEffect(() => {
        if (message) {
            const str = message;
            setGroups(str.split(' '));
        }
    }, [message]);

    return (
        <nav className='nav'>
            <label htmlFor="touch"><span className='title'>Groups</span></label>               
            <input type="checkbox" id="touch" onChange={onChange} />
            <ul className="slide" style={{ height: `${height}px` }}>
                {/* <li onClick={() => {
                    setOpenGroupMenu(!openGroupMenu);
                    sendData(openGroupMenu);
                    }}> 
                    <a href='#'> Add Group </a>
                </li> */}
                {groups.map(group => {
                    return (
                        <li key={group} onClick={() => { getGroupData(group) }}> <a href='#'> {group} </a> </li>
                    )
                })}
            </ul>
        </nav> 
    );
};

export default Dropdown;
