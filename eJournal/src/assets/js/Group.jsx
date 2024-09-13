/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import '../css/group-table.css';
import { backend } from '../template';

const Group = (message) => {
    const [ date, setDate ] = useState(message.message.data[0].presentDays ? JSON.parse(message.message.data[0].presentDays) : null);
    const [ shouldSendDate, setShouldSendDate ] = useState(false);
    const [ currenMonth, setCurrentMonth ] = useState('september');
    const [ flag, setFlag ] = useState(false);
    
    useEffect(() => {
        if (message.message.data[0].presentDays) {
            setFlag(true);
        } else {
            setFlag(false);
        }
    }, [message.message.data]);

    useEffect(() => {
        if (shouldSendDate) {
            fetch(`${backend}add-date`, {
                method: 'POST',
                headers: {
                    'table-name': message.message.groupName,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    date: date,
                })
            })
            .then(res => res.json())
            .then(data => console.log(data))
            .catch(err => console.error(err))
            .finally(() => setShouldSendDate(false)); // Reset flag
        }
    }, [date, shouldSendDate, message.message.groupName]);

    const addCurrentDate = () => {

    let currenDay = new Date().getDate();

    if (!date || !date.semester1) {
        setDate({
            semester1: {
                [currenMonth]: [{
                    day: currenDay,
                        present: false,
                        }]
                    },
                });
            } else {
                setDate(prevDate => ({
                    ...prevDate,
                    semester1: {
                     ...prevDate.semester1,
                     [currenMonth]: [...prevDate.semester1[currenMonth], {
                        day: currenDay,
                        present: false,
                    }]
                }
            }));
        }
        setShouldSendDate(true);
    };

    const deleteLastDate = () => {
        if (date.semester1) {
            console.log(date.semester1);
        }
    } 

     return (
        <div className='group-main-div'>
            <h1 className='group-name'> 초급 {message.message.groupName} </h1> <br />
            <h1 className='group-name'>9월 2024년 </h1> <br />
            <div style={{ display: 'flex', gap: '10px', width: '20%' }}>
                <button className='btn btn-primary btn-round-1' onClick={addCurrentDate}> Add current date </button>
                <button className='btn btn-danger btn-round-1' onClick={deleteLastDate}> Remove last date </button>
            </div>
            <table border={1}>
                <thead>
                    <tr style={{ width: '10%' }}>
                        <th style={{ width: '1%' }}> id </th>
                        <th> Full Name </th>
                        <th> 성 명 </th>
                        {flag && date && date.semester1 && date.semester1[currenMonth] && date.semester1[currenMonth].map(item => {
                            
                            if (!item) {
                                return null;
                            }

                            const { day } = item;
                            
                            return (
                                <th key={day}> {day} </th>
                            )
                        })}
                    </tr>
                </thead>
                <tbody>
                    {message.message.data.map(data => {
                        const { id, fName, lName } = data;
                        
                        return (
                            <tr key={id}>
                                <td> {id} </td>
                                <td style={{ fontSize: 'larger' }}> {fName} {lName} </td>
                                <td></td>
                                {flag && date && date.semester1 && date.semester1[currenMonth] && date.semester1[currenMonth].map(item => {
                                    const { day, present } = item;

                                    return (
                                        <td key={day}> {present === false && ('-')} </td>
                                    )
                                })}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
     );
};

export default Group;
