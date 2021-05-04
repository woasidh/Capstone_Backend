import { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import Moment from 'moment';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
//import UpdatePage from './UpdateLectureInfo';

const Container = styled.div`
width : 100%;
height : 100%;
display : block;
//align-items : center;
//justify-content : center;
`
const Title = styled.div`
font-size : 30px;
border-bottom : 1px solid #F7F9FC;
height : 80px;
line-height : 80px;
font-style : italic;
`

const WriteBtn = styled.a`
font-size: 16px;
padding: 5px;
background-color: ${props => props.theme.color.blue};
color: white;
border-radius: 5px;
`
const TopBox = styled.div`
width: 100%;
margin: 0 auto;
height: 25px;
border-radius: 5px 5px 0px 0px;
background: ${props => props.theme.color.light_gray};
`
const BottomBox = styled.div`
width: 100%;
margin: 0 auto;
height: 25px;
border-radius: 0px 0px 5px 5px;
background: ${props => props.theme.color.light_gray};
`
const GrayBox = styled.td`
padding: 5px;
border: 1px soild ${props => props.theme.color.blue};
background: ${props => props.theme.color.light_gray};
`
const WhiteBox = styled.td`
padding: 5px;
border: 1px soild ${props => props.theme.color.blue};
background: white;
`

function Index({match}){

    const [isProfessor, setisProfessor] = useState(false);
    const [user, setUser] = useState(JSON.parse(window.sessionStorage.user));
    const [week, setWeek] = useState(["월", "화", "수", "목", "금", "토", "일"]);
    const [subjectId, setSubjectId] = useState(String(match.params.subject));
    const [subjectInfo, setSubjectInfo] = useState({
        name: '',
        code: '',
        days: [],
        start_period: '',
        end_period: '',
        start_time: [],
        end_time: []
    });
    
    useEffect(() => {
        const request = '/api/subject/info/'+ subjectId;
        if(user.type === "professor"){
            setisProfessor(true);
        }
        axios.get(request)
        .then((response)=>{
            setSubjectInfo(response.data);
        })
        .catch((error)=>{
            console.log(error);
        })
    },[]);

    

    return(
        <Router>
        <Switch>
        <Route path={`/main/:subject/info/update`} component={}/>
        <Route path="/">
        <Container>
            <Title>강의 정보</Title>
            <div style={{width: "100%", display: "block"}}>
                <div style={{fontSize: "16px", float: "left"}}>내 강의 / {subjectInfo.name} / 강의 정보</div>                
                {isProfessor && <WriteBtn href={`/main/${subjectId}/info/update`} style={{display: "inline-block", float:"right"}}> 수정하기</WriteBtn>}
            </div>
            <hr style={{width: "100%", margin: "10px 0px", marginTop: "40px",display:"block"}}/>
            
                <table style={{width: "100%", margin: "1px auto", borderSpacing: "1px", borderCollapse: "separate"}}>
                    <tbody>
                    <tr>
                        <GrayBox>강의명</GrayBox>
                        <WhiteBox>{subjectInfo.name}</WhiteBox>
                    </tr>
                    <tr>
                        <GrayBox>강의 코드</GrayBox>
                        <WhiteBox>{subjectInfo.code}</WhiteBox>
                    </tr>
                    <tr>
                        <GrayBox>강의 기간</GrayBox>
                        <WhiteBox>{Moment(subjectInfo.start_period).format('YYYY년MM월DD일')} ~ {Moment(subjectInfo.end_period).format('YYYY년MM월DD일')}</WhiteBox>
                    </tr>
                    <tr>
                        <GrayBox>강의 시간</GrayBox>
                        <WhiteBox>
                            {subjectInfo.days.map((value, index) => <li style={{listStyleType: "none"}}>{week[value-1]} {subjectInfo.start_time[index]} ~ {subjectInfo.end_time[index]}</li>)} 
                        </WhiteBox>
                    </tr>
                    </tbody>
                </table>
                
        </Container>
        </Route>
        </Switch>
        </Router>
    )
}

export default Index;