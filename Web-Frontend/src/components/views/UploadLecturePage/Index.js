import React, {useEffect} from 'react'
import styled, { css } from 'styled-components'
import theme from '../../../styles/Theme'
import { DatePicker, TimePicker } from 'antd';
import 'antd/dist/antd.css';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import VerifyPage from './section/verify/Index'

const { RangePicker } = DatePicker;

const boxStyle = css`
background-color : white;
border-radius : 10px;
border : 1px solid ${props => props.theme.color.gray7};
box-shadow : 10px 5px 5px ${props => props.theme.color.gray7};
padding : 1.5rem;
`
const SubTitless = styled.div`
color : ${props => props.theme.color.gray1};
font-size : 16px;
margin-bottom : 15px;
`

const Title = styled.div`
font-size : 30px;
border-bottom : 1px solid #F7F9FC;
height : 80px;
line-height : 80px;
/* font-style : italic; */
`

const NameBox = styled.div`
width : 50%;
${boxStyle}
margin-bottom : 25px;
`

const NameInput = styled.input`
border : none;
height : 50px;
width : 300px;
font-size : 20px;
border-bottom : 1px solid ${props => props.theme.color.gray4};
color : ${props => props.theme.color.blue};
`

const PeriodBox = styled.div`
width : 50%;
${boxStyle}
margin-bottom : 25px;
`

const TimeBox = styled.div`
width : 50%;
${boxStyle}
margin-bottom : 25px;
`

const DayContainer = styled.div`
display : flex;
justify-items :center;
align-items :center;
margin-bottom : 20px;
`

const Day = styled.div`
width : 50px;
height : 50px;
border-radius : 10px;
text-align : center;
line-height : 50px;
border : 1px solid ${props => props.theme.color.gray1};
margin : 0 5px;
&.active{
    background-color : ${props => props.theme.color.blue};
    color : white;
    border : none;
}
`

const SubmitBtn = styled.button`
width : 50%;
height : 40px;
border : none;
background-color: #407AD6;
color : white;
text-align :center;
line-height : 40px;
border-radius : 10px;
`



function Index() {

    const selectDayHandler = (e) => {
        const elm = e.target;
        if (elm.classList.value.includes('active')) elm.classList.remove('active');
        else elm.classList.add('active');
        /* if(e.target.classList.active) */
    }

    const submitHandler = () => {
        window.location.href = '/main/uploadLecture/verify';
    }

    return (
        <Router>
            <Switch>
                <Route exact path="/main/uploadLecture/verify" component={VerifyPage} />
                <Route path="/">
                    <div className = "sex">
                        <Title>강의를 개설하세요!</Title>
                        <NameBox>
                            <SubTitless>강의 이름</SubTitless>
                            <NameInput type="text" placeholder="강의 이름을 입력해주세요" />
                        </NameBox>
                        <PeriodBox>
                            <SubTitless>강의 범위</SubTitless>
                            <RangePicker size="large" />
                        </PeriodBox>
                        <TimeBox>
                            <SubTitless>강의 시간</SubTitless>
                            <DayContainer>
                                <button onClick={selectDayHandler}><Day>월</Day></button>
                                <button onClick={selectDayHandler}><Day>화</Day></button>
                                <button onClick={selectDayHandler}><Day>수</Day></button>
                                <button onClick={selectDayHandler}><Day>목</Day></button>
                                <button onClick={selectDayHandler}><Day>금</Day></button>
                                <button onClick={selectDayHandler}><Day>토</Day></button>
                                <button onClick={selectDayHandler}><Day>일</Day></button>
                            </DayContainer>
                            <TimePicker.RangePicker />
                        </TimeBox>
                        <SubmitBtn onClick={submitHandler}>제출</SubmitBtn>
                    </div>
                </Route>
            </Switch>
        </Router>
    )
}

export default Index
