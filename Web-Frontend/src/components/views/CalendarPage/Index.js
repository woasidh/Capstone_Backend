import React, { useEffect, useState } from 'react'
import { Calendar, Badge } from 'antd';
import './style.css'
import styled from 'styled-components'

const Cnt = styled.div`
display: flex;
`

const Left = styled.div`
flex-basis: 50%;
`
const Right = styled.div`
flex-basis: 50%;
height : 90vh;
display: flex;
flex-direction: column;
`

const Top = styled.div`
flex-basis: 50%;
`

const Bot = styled.div`
flex-basis: 50%;
display : flex;
`

const NewThing = styled.div`
flex-basis: 50%;
`

const Unchecked = styled.div`
flex-basis: 50%;
`

const Shadow = styled.div`
padding : 0.5rem;
height : 100%;
border-radius: 10px;
background-color: white;
box-shadow: 3px 5px 5px 3px #f5f5f5;
`

const Box = styled.div`
padding : 0.5rem;
width : 100%;
height : 100%;
`

const BoxwithPadding = styled.div`
padding : 0.5rem;
`

const Today = styled.div`
display : flex;
height : 100%;
flex-direction: column;
`

const TodayDate = styled.div`
flex-basis: 15%;
font-size: 1.5rem;
display : flex;
justify-content: flex-start;
align-items: center;
border-bottom : 1px solid black;
`

const TodayContent = styled.div`
flex-basis: 85%;
`

/* 오늘 일정 */


function Index() {

    function getListData(value) {
        let listData;
        switch (value.date()) {
            case 7:
                /*                 listData = [
                                    { type: 'warning', content: 'This is warning event.' }
                                ]; */
                break;
            case 10:
                /*                 listData = [
                                    { type: 'error', content: 'This is error event.' },
                                ]; */
                break;
            case 15:
                /*                 listData = [
                                    { type: 'success', content: 'This is very long usual event。。....' }
                                ]; */
                break;
            default:
        }
        return listData || [];
    }

    function dateCellRender(value) {
        const listData = getListData(value);
        return (
            <ul className="events">
                {listData.map(item => (
                    <li key={item.content}>
                        <Badge status={item.type} text={item.content} />
                    </li>
                ))}
            </ul>
        );
    }

    function getMonthData(value) {
        if (value.month() === 8) {
            return 1394;
        }
    }

    function monthCellRender(value) {
        const num = getMonthData(value);
        return num ? (
            <div className="notes-month">
                <section>{num}</section>
                <span>Backlog number</span>
            </div>
        ) : null;
    }

    useEffect(() => {
        /*         const days = document.querySelectorAll('.ant-picker-cell-inner.ant-picker-calendar-date');
                console.log(days);
                days.forEach((day, idx)=>{
                    const dayClone = day.cloneNode(true);
                    day.parentNode.replaceChild(dayClone, day);
                }) */
        //makeAssign('2021-05-04', '2021-05-07');
    }, [])

    function makeAssign(start, end) {
        let arr = [];
        let term = parseInt(end.split("-")[2]) - parseInt(start.split("-")[2]) + 1;
        const days = document.querySelectorAll('.ant-picker-cell');
        for (let i = 0; i < days.length; i++) {
            if (days[i].title == start) {
                for (let j = 0; j < term; j++) {
                    const elm = document.createElement('div');
                    elm.setAttribute('class', 'longSched');
                    if (j == 0) {
                        elm.classList.add('first');
                    }
                    if (j == term - 1) elm.classList.add('last');
                    console.log(i, j);
                    console.log(days[i + j]);
                    days[i + j].appendChild(elm);
                    arr.push(days[i + j]);
                }
                break;
            }
        }
        console.log(arr);
    }

    return (
        <Cnt>
            <Left>
                <Box><Shadow><Calendar style={{ height: '1px' }} dateCellRender={dateCellRender} monthCellRender={monthCellRender} /></Shadow></Box>
            </Left>
            <Right>
                <Top>
                    <Box><Shadow>
                        <Today>
                            <TodayDate><span>5월 25일</span></TodayDate>
                            <TodayContent></TodayContent>
                        </Today>
                    </Shadow></Box>
                </Top>
                <Bot>
                    <NewThing>
                        <Box><Shadow>

                        </Shadow></Box>
                    </NewThing>
                    <Unchecked>
                        <Box><Shadow>

                        </Shadow></Box>
                    </Unchecked>
                </Bot>
            </Right>
        </Cnt>
    )
}
export default Index
