/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import '../css/group-table.css';
import { backend, X, O } from '../template';

const Group = (message) => {
    const [date, setDate] = useState(message.message.data[0].presentDays ? JSON.parse(message.message.data[0].presentDays) : null);
    const [shouldSendDate, setShouldSendDate] = useState(false);
    const [currenMonth, setCurrentMonth] = useState('september');
    const [flag, setFlag] = useState(false);
    const [students, setStudents] = useState(message.message.data.map(student => ({
        ...student,
        presentDays: student.presentDays ? JSON.parse(student.presentDays) : {}
    })));

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
                    [currenMonth]: [...(prevDate.semester1[currenMonth] || []), {
                        day: currenDay,
                        present: false,
                    }]
                }
            }));
        }
        setShouldSendDate(true);
    };

    const deleteLastDate = async () => {
        if (date && date.semester1 && date.semester1[currenMonth]) {
            setDate(prevDate => {
                const updatedMonthDates = [...prevDate.semester1[currenMonth]];
                updatedMonthDates.pop();

                return {
                    ...prevDate,
                    semester1: {
                        ...prevDate.semester1,
                        [currenMonth]: updatedMonthDates,
                    },
                };
            });
        }

        fetch(`${backend}remove-date`, {
            method: 'POST',
            headers: {
                'table-name': message.message.groupName,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                date: date,
            }),
        })
        .then(async res => await res.json())
        .then(data => console.log(data))
        .catch(err => console.error(err));
    }

    const togglePresent = (studentId, day, presentDays) => {
        setStudents(prevStudents => prevStudents.map(student => {
            if (student.id === studentId) {
                const updatedSemester1 = { ...student.presentDays.semester1 };

                updatedSemester1[currenMonth] = updatedSemester1[currenMonth].map(dateItem => {

                    if (dateItem.day === day) {
                        
                        if (dateItem.present === false) {
                            return { ...dateItem, present: true };
                        } else {
                            return { ...dateItem, present: false };
                        }
                    }

                    return dateItem;
                });

                return { ...student, presentDays: { ...student.presentDays, semester1: updatedSemester1 } };
            }

            return student;
        }));

        setDate(prevDate => {
            const updatedSemester1 = { ...prevDate.semester1 };
            
            updatedSemester1[currenMonth] = updatedSemester1[currenMonth].map(dateItem => {
                if (dateItem.day === day) {
                    return { ...dateItem, present: !dateItem.present };
                }
                
                return dateItem;
            });

            return { ...prevDate, semester1: updatedSemester1 };
        });


        console.log("PRESENTDAYS", presentDays)
        fetch(`${backend}change-presentence`, {
            method: 'POST',
            headers: {
                'table-name': message.message.groupName,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: studentId,
                date: presentDays,
            })
        })
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(error => console.log(error));
    };

    function testBeck() {
        
        fetch(`${backend}get-group-data`, {
            method: 'GET',
            headers: {
                'table-name': '1a-1',
            },
        })
        .then(res => res.json())
        .then(data => console.log(data.data))
        .catch(err => console.error(err));
    }
    return (
        <div className='group-main-div'>
            <div className='group-data'>
                초급 {message.message.groupName} <br />
                9월 2024년 
            </div>
            <div className='button-group'>
                <button className='btn btn-primary btn-round-1 button' onClick={addCurrentDate}> Add current date </button>
                <button className='btn btn-danger btn-round-1 button' onClick={deleteLastDate}> Remove last date </button>
                <button onClick={testBeck}> Click </button>
            </div>
            <table border={1} style={{ width: '50%' }}>
                <thead>
                    <tr>
                        <th> id </th>
                        <th> Full Name </th>
                        <th> 성 명 </th>
                        {date && date.semester1 && date.semester1[currenMonth] && date.semester1[currenMonth].map(item => {
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
                                { presentDays.semester1 && presentDays.semester1[currenMonth] && presentDays.semester1[currenMonth].map(element => {
                                    const { day, present } = element;

                                    return (
                                        <td key={day} onClick={() => togglePresent(id, day, presentDays)} style={{ width: '25px' }}>
                                            {!element.present ? <img className='ico' src={X} alt="X" /> : <img className='ico' src={O} alt="O" />}
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
