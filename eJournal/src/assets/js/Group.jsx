/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import '../css/group-table.css';
import { backend, X, O } from '../template';

const Group = (message) => {
    const [date, setDate] = useState(message.message.data[0].presentDays ? JSON.parse(message.message.data[0].presentDays) : null);
    const [currentMonth, setCurrentMonth] = useState('september');
    const [students, setStudents] = useState(message.message.data.map(student => ({
        ...student,
        presentDays: student.presentDays ? JSON.parse(student.presentDays) : {}
    })));

    const addCurrentDate = async() => {
        let currentDay = new Date().getDate();
        
        try {
            setDate(date['semester1'][currentMonth].push({day: currentDay, present: false}));
    
            const dateResponse = await fetch(`${backend}add-date`, {
                method: 'POST',
                headers: {
                    'table-name': message.message.groupName,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    date: date,
                })
            })

            const groupDataResponse = await fetch(`${backend}get-group-data`, {
                method: 'GET',
                headers: {
                    'table-name': message.message.groupName,
                },
            });
            
            const groupData = await groupDataResponse.json();
    
            setDate(JSON.parse(groupData.data[0].presentDays));
            setStudents(groupData.data.map(student => ({
                ...student,
                presentDays: student.presentDays ? JSON.parse(student.presentDays) : {},
            })));

        } catch (error) {
            console.error(error);
        }
    };

    const deleteLastDate = async () => {
        setDate(date['semester1'][currentMonth].pop());

        try {
            const dateResponse = await fetch(`${backend}remove-date`, {
                method: 'POST',
                headers: {
                    'table-name': message.message.groupName,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    date: date,
                }),
            })
    
            const groupDataResponse = await fetch(`${backend}get-group-data`, {
                method: 'GET',
                headers: {
                    'table-name': message.message.groupName,
                },
            });
            
            const groupData = await groupDataResponse.json();
    
            setDate(JSON.parse(groupData.data[0].presentDays));
            setStudents(groupData.data.map(student => ({
                ...student,
                presentDays: student.presentDays ? JSON.parse(student.presentDays) : {},
            })));

        } catch (error) {
            console.error(error);
        }
    }

    const togglePresent = async (studentId, day) => {
        setStudents(prevStudents => prevStudents.map(student => {
            if (student.id === studentId) {
                const updatedSemester1 = { ...student.presentDays.semester1 };
                updatedSemester1[currentMonth] = updatedSemester1[currentMonth].map(dateItem => 
                    dateItem.day === day ? { ...dateItem, present: !dateItem.present } : dateItem
                );
                return { ...student, presentDays: { ...student.presentDays, semester1: updatedSemester1 } };
            }
            return student;
        }));
    
        setDate(prevDate => {
            const updatedSemester1 = { ...prevDate.semester1 };
            updatedSemester1[currentMonth] = updatedSemester1[currentMonth].map(dateItem => 
                dateItem.day === day ? { ...dateItem, present: !dateItem.present } : dateItem
            );
            return { ...prevDate, semester1: updatedSemester1 };
        });
    
        const updatedStudent = students.find(student => student.id === studentId);
        const updatedPresentDays = { ...updatedStudent.presentDays };
        updatedPresentDays.semester1[currentMonth] = updatedPresentDays.semester1[currentMonth].map(dateItem => 
            dateItem.day === day ? { ...dateItem, present: !dateItem.present } : dateItem
        );
    
        try {
            const response = await fetch(`${backend}change-presentence`, {
                method: 'POST',
                headers: {
                    'table-name': message.message.groupName,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: studentId,
                    date: updatedPresentDays,
                }),
            });
    
            const groupDataResponse = await fetch(`${backend}get-group-data`, {
                method: 'GET',
                headers: {
                    'table-name': message.message.groupName,
                },
            });
            
            const groupData = await groupDataResponse.json();
            
            setStudents(groupData.data.map(student => ({
                ...student,
                presentDays: student.presentDays ? JSON.parse(student.presentDays) : {},
            })));
            
        } catch (error) {
            console.log(error);
        }
    };
    
    return (
        <div className='group-main-div'>
            <div className='group-data'>
                초급 {message.message.groupName} <br />
                9월 2024년 
            </div>
            <div className='button-group'>
                <button className='btn btn-primary btn-round-1 button' onClick={addCurrentDate}> Add current date </button>
                <button className='btn btn-danger btn-round-1 button' onClick={deleteLastDate}> Remove last date </button>
            </div>
            <table border={1} style={{ width: '50%' }}>
                <thead>
                    <tr>
                        <th> id </th>
                        <th> Full Name </th>
                        <th> 성 명 </th>
                        {date && date.semester1 && date.semester1[currentMonth] && date.semester1[currentMonth].map(item => {
                            const { day } = item;

                            return (
                                <th key={day}> 
                                    {day}
                                </th>
                            )
                        })}
                    </tr>
                </thead>
                <tbody>
                    {students.map(student => {
                        const { id, fName, lName, presentDays } = student;

                        return (
                            <tr key={id}> 
                                <td style={{ width: '20px' }}> {id} </td>
                                <td style={{ width: '250px' }}> {fName} {lName} </td>
                                <td style={{ width: '250px' }}> null </td>
                                { presentDays.semester1 && presentDays.semester1[currentMonth] && presentDays.semester1[currentMonth].map(element => {
                                    const { day, present } = element;

                                    return (
                                        <td key={day} onClick={async () => { togglePresent(id, day, presentDays) }} style={{ width: '25px' }}>
                                            {!present ? <img className='ico' src={X} alt="X" /> : <img className='ico' src={O} alt="O" />}
                                        </td>
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
