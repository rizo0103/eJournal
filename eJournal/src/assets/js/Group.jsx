/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import '../css/group-table.css';
import { backend } from '../template';

const Group = (message) => {
    const [date, setDate] = useState(message.message.data.presentDays);
    const [shouldSendDate, setShouldSendDate] = useState(false);

    useEffect(() => {
        message.message.data.sort();
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
        
        // Проверка наличия текущего дня в массиве
        if (date && date.semester1 && date.semester1.september.includes(currenDay)) {
            console.log("Date already exists");
            return;
        }

        if (!date || !date.semester1) {
            setDate({
                semester1: {
                    september: [{
                        day: currenDay, 
                        present: false,
                    }],
                    october: [],
                    november: [],
                    december: [],
                },
            });
        } else {
            setDate(prevDate => ({
                ...prevDate,
                semester1: {
                    ...prevDate.semester1,
                    september: [...prevDate.semester1.september, {
                        day: currenDay,
                        present: false,
                    }]
                }
            }));
        }

        setShouldSendDate(true);
    };

    return (
        <div className='group-main-div'>
            <h1 className='group-name'> 초급 {message.message.groupName} </h1> <br />
            <h1 className='group-name'>9월 2024년 </h1> <br />
            <div style={{ display: 'flex', gap: '10px', width: '20%' }}>
                <button className='btn btn-primary btn-round-1' onClick={addCurrentDate}> Add current date </button>
                <button className='btn btn-danger btn-round-1'> Remove current date </button>
            </div>
            <table border={1}>
                <thead>
                    <tr style={{ width: '10%' }}> 
                        <th style={{ width: '1%' }}> id </th> 
                        <th> Full Name </th>
                        <th> 성 명 </th>
                        {message.message.data.forEach(data => {
                            const { presentDays } = data;
                            const newData = JSON.parse(presentDays);
                            
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
                                </tr>
                            )
                        })}
                </tbody>
            </table>
        </div>
    );
};

export default Group;