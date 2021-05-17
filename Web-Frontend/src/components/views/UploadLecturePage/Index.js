import {useState} from 'react'
import styled, { css } from 'styled-components'
import theme from '../../../styles/Theme'
import { DatePicker, TimePicker } from 'antd';
//import 'antd/dist/antd.css';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import VerifyPage from './section/verify/Index'
import axios from 'axios';

const { RangePicker } = DatePicker;

const boxStyle = css`
width: 475px;
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
//width : 50%;
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
width: 475px;
height : 40px;
border : none;
background-color: #407AD6;
color : white;
text-align :center;
line-height : 40px;
border-radius : 10px;
`

function Index() {
    const [name, setName] = useState('');
    const [startPeriod, setStartPeriod] = useState('');
    const [endPeriod, setEndPeriod] = useState('');
    const [startTime, setStartTime] = useState([]);
    const [endTime, setEndTime] = useState([]);
    const [dayList, setDayList] = useState([]);
    const week = ["월", "화", "수", "목", "금", "토", "일"];
    
    const header = new Headers();
    header.append('Access-Control-Allow-Origin', '*');

    const onChangeName = (e) => {
        setName(e.target.value);
    }

    const onChangeRange = (value, dateString) => {
        setStartPeriod(dateString[0]);
        setEndPeriod(dateString[1]);
    }

    const selectDayHandler = (e, value) => {
        const elm = e.target;
        console.log(elm);
        console.log(value);
        if (elm.classList.value.includes('active')){
            elm.classList.remove('active');
            const i = dayList.indexOf(value);
            setDayList(dayList.filter((e)=>(e !== value)));
            startTime.splice(i,1);
            endTime.splice(i,1);
        }
        else {
            elm.classList.add('active');
            setDayList([
                ...dayList,
                value
            ]);
        }
        
        /* if(e.target.classList.active) */
    }

    const onChangeTime = (i, dateString) => {
        startTime[i]=dateString[0];
        endTime[i]=dateString[1];
    }

    const submitHandler = () => {
        console.log(name);
        console.log(startPeriod);
        console.log(endPeriod);
        console.log(startTime);
        console.log(endTime);
        console.log(dayList);
        axios.post('/api/subject/create', 
        { 
            name: name,
            start_period: startPeriod,
            end_period: endPeriod,
            start_time: startTime,
            end_time: endTime,
            days: dayList
         })
         .then((response)=>{
             console.log(response);
             const code = response.data.code;
             return window.location.href = '/main/uploadLecture/verify/'+code;
         })
         .catch((response)=>{
             console.log('Error!');
             console.log(response);
         });
    }

    return (
        <Router>
            <Switch>
                <Route path="/main/uploadLecture/verify/:code" component={VerifyPage} />
                <Route path="/">
                    <div className = "sex">
                        <Title>강의를 개설하세요!</Title>
                        <NameBox>
                            <SubTitless>강의 이름</SubTitless>
                            <NameInput type="text" name="name" placeholder="강의 이름을 입력해주세요" onChange={onChangeName}/>
                        </NameBox>
                        <PeriodBox>
                            <SubTitless>강의 범위</SubTitless>
                            <RangePicker size="large" name='date' format="YYYY-MM-DD" onChange={onChangeRange}/>
                        </PeriodBox>
                        <TimeBox>
                            <SubTitless>강의 시간</SubTitless>
                            <DayContainer>
                                <button onClick={(e) => selectDayHandler(e, 1)}><Day>월</Day></button>
                                <button onClick={(e) => selectDayHandler(e, 2)}><Day>화</Day></button>
                                <button onClick={(e) => selectDayHandler(e, 3)}><Day>수</Day></button>
                                <button onClick={(e) => selectDayHandler(e, 4)}><Day>목</Day></button>
                                <button onClick={(e) => selectDayHandler(e, 5)}><Day>금</Day></button>
                                <button onClick={(e) => selectDayHandler(e, 6)}><Day>토</Day></button>
                                <button onClick={(e) => selectDayHandler(e, 7)}><Day>일</Day></button>
                            </DayContainer>
                            {dayList.map((value, index) => <li>{week[value-1]} : <TimePicker.RangePicker format="HH:mm" onChange={(value, dateString) => onChangeTime(index, dateString)} /></li>)}
                        </TimeBox>
                        <SubmitBtn onClick={submitHandler}>제출</SubmitBtn>
                    </div>
                </Route>
            </Switch>
        </Router>
    )
}

export default Index