import React, { useEffect, useState } from 'react'
import styled, { css } from 'styled-components'
import theme from '../../../styles/Theme'
import axios from 'axios'
import { DatePicker, TimePicker } from 'antd';
import 'antd/dist/antd.css';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import VerifyPage from './section/verify/Index'
import TitleNav from '../../utils/TitleNav/Index'

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
margin-bottom : 10px;
`

const Title = styled.div`
font-style : italic;
font-size : 30px;
border-bottom : 1px solid #F7F9FC;
`

const SemiTitle = styled.div`
border-bottom : 1px solid ${props => props.theme.color.line_color};
height : 40px;
`

const NameBox = styled.div`
width : 50%;
${boxStyle}
margin : 25px 0;
`

const NameInput = styled.input`
margin-top : -5px;
display : block;
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

const DayButton = styled.button`
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

    const [LectureName, setLectureName] = useState("");
    const [startPeriod, setstartPeriod] = useState("");
    const [endPeriod, setendPeriod] = useState("");
    const [startTime, setstartTime] = useState("");
    const [endTime, setendTime] = useState("");
    const [days, setdays] = useState([]);

    const selectDayHandler = (e) => {
        const elm = e.target;
        const id = parseInt(elm.id);
        if(!days.includes(id)){
            days.push(id);
        }else{
            const idx = days.indexOf(id)
            days.splice(idx, 1);
        }
        if (elm.classList.value.includes('active')) elm.classList.remove('active');
        else elm.classList.add('active');
        console.log(days);
    }

    const submitHandler = () => {
        days.sort();
        let start_time = [];
        let end_time = [];
        for(let i =0;i<days.length;i++){
            start_time.push(startTime);
            end_time.push(endTime);
        } 
        const payload = {
            name : LectureName,
            start_period : startPeriod,
            end_period : endPeriod,
            start_time : start_time,
            end_time : end_time,
            days : days
        }
        console.log(payload);
        axios.post('http://13.125.234.161:3000/subject/create', payload).then(response=>{
            console.log(response);
            if(response.data.success == true){
                window.location.href = '/main/uploadLecture/verify';
            }else{
                alert("error");
            }
        })
    }

    const lectureNameHandler = (e)=>{
        setLectureName(e.target.value);
    }

    const DateonChange = (dates, dateStrings) => {
        setstartPeriod(dateStrings[0]);
        setendPeriod(dateStrings[1]);
      }

      const TimeonChange = (times, timeStrings) => {
          const startTimeArr = timeStrings[0].split(":");
          const startString = startTimeArr[0]+":"+startTimeArr[1];
          const endTimeArr = timeStrings[1].split(":");
          const endString = endTimeArr[0]+":"+endTimeArr[1];
          setstartTime(startString);
          setendTime(endString);
      }

      const renderButtons = ()=>{
          const days = ['Mon', 'Tue', 'Wed', 'Thr', 'Fri', 'Sat', 'Sun'];
          const result = days.map((day, index)=>{
              return <DayButton id = {index+1} onClick={selectDayHandler}>{day}</DayButton>
          })
          return result;
      }

    return (
        <Router>
            <Switch>
                <Route exact path="/main/uploadLecture/verify" component={VerifyPage} />
                <Route path="/">
                    <div className="uploadCnt">
                        <TitleNav 
                        title = "Create your Lecture"
                        titles = {["Home", "Create a Lecture"]}
                        ></TitleNav>
                        <NameBox>
                            <SubTitless>lecture name</SubTitless>
                            <span style={{color : '#bdbdbd'}}>name</span>
                            <NameInput type="text" onChange = {lectureNameHandler} placeholder="Type in your lecture name" />
                        </NameBox>
                        <PeriodBox>
                            <SubTitless>lecture period</SubTitless>
                            <RangePicker onChange = {DateonChange} size="large" />
                        </PeriodBox>
                        <TimeBox>
                            <SubTitless>lecture time</SubTitless>
                            <DayContainer>
                                {renderButtons()}
                            </DayContainer>
                            <TimePicker.RangePicker onChange = {TimeonChange} />
                        </TimeBox>
                        <SubmitBtn onClick={submitHandler}>submit</SubmitBtn>
                    </div>
                </Route>
            </Switch>
        </Router>
    )
}

export default Index
