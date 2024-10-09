/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import '../css/group-table.css';
import { backend, X, O, getGroupData, months } from '../template';

const Group = (message) => {
    const [date, setDate] = useState(message.message.data[0].presentDays ? JSON.parse(message.message.data[0].presentDays) : null);
    const [neededMonth, setNeededMonth] = useState(0);
    const [neededSemester, setNeededSemester] = useState('semester1');
    const [students, setStudents] = useState(message.message.data.map(student => ({
        ...student,
        presentDays: student.presentDays ? JSON.parse(student.presentDays) : {}
    })));

    useEffect(() => {
        const month = new Date().getMonth();
        
        if ([8, 9, 10, 11, 1, 2, 3, 4].includes(month)) {
            setNeededMonth(months[month]);
        } else {
            if ('semester1' in date) {
                setNeededMonth('september');
            } else {
                setNeededMonth('february');
            }
        }

        if (month >= 8 && month <= 11) {
            setNeededSemester('semester1');
        } else if (month >= 1 && month <= 5) {
            setNeededSemester('semester2');
        }
    }, [date]);

    const addCurrentDate = async () => {
        const currentDate = new Date();
        const currentDay = currentDate.getDate();
        const currentMonth = currentDate.getMonth();

        if (months[currentMonth] !== neededMonth) {
            return (
                <h1>Hello</h1>
            );
        }

        try {
            if (!(neededMonth in date[neededSemester])) {
                setDate(Object.assign(date[neededSemester], {[neededMonth]: []}));
            }

            setDate(date[neededSemester][neededMonth].push({day: currentDay, present: false}));
    
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

            const groupData = await getGroupData(message.message.groupName);

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
        setDate(date[neededSemester][neededMonth].pop());

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
    
            const groupData = await getGroupData(message.message.groupName);

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
                const updatedSemester1 = { ...student.presentDays[neededSemester] };
                updatedSemester1[neededMonth] = updatedSemester1[neededMonth].map(dateItem => 
                    dateItem.day === day ? { ...dateItem, present: !dateItem.present } : dateItem
                );
                return { ...student, presentDays: { ...student.presentDays, [neededSemester]: updatedSemester1 } };
            }
            return student;
        }));
    
        setDate(prevDate => {
            const updatedSemester1 = { ...prevDate[neededSemester] };
        
            updatedSemester1[neededMonth] = updatedSemester1[neededMonth].map(dateItem => 
                dateItem.day === day ? { ...dateItem, present: !dateItem.present } : dateItem
            );
        
            return { ...prevDate, [neededSemester]: updatedSemester1 };
        });
    
        const updatedStudent = students.find(student => student.id === studentId);
        const updatedPresentDays = { ...updatedStudent.presentDays };
        
        updatedPresentDays[neededSemester][neededMonth] = updatedPresentDays[neededSemester][neededMonth].map(dateItem => 
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
    
            const groupData = await getGroupData(message.message.groupName);

            setDate(JSON.parse(groupData.data[0].presentDays));
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
                <div> 초급 {message.message.groupName} </div>
                <div style={{ display: 'flex' }}> 
                    <div style={{ display: 'grid', alignContent: 'center' }}> 
                        <button style={{ background: 'transparent', border: 'transparent', cursor: 'pointer' }}> <img style={{ width: '15px', transform: 'rotate(360deg)' }} src='./images/top.png' /> </button> 
                        <button style={{ background: 'transparent', border: 'transparent', cursor: 'pointer' }}> <img style={{ width: '15px', transform: 'rotate(180deg)' }} src='./images/top.png' /> </button> 
                    </div>
                    <div> {months.findIndex(item => item === neededMonth) + 1}월 2024년 </div>
                </div>
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
                        {date && date[neededSemester] && date[neededSemester][neededMonth] && date[neededSemester][neededMonth].map(item => {
                            const { day } = item;

                            return <th key={day}> {day} </th>
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
                                { presentDays[neededSemester] && presentDays[neededSemester][neededMonth] && presentDays[neededSemester][neededMonth].map(element => {
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
