import { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import Moment from 'moment';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import UpdatePage from './UpdateLectureInfo';

const Container = styled.div`
width : 97%;
height : 100%;
display : inline-block;
//overflow-y: auto;
//align-items : center;
//justify-content : center;
`
const Title = styled.div`
font-size : 30px;
border-bottom : 1px solid #F7F9FC;
height : 40px;
line-height : 40px;
font-style : italic;
`
const SubTitle = styled.div`
float: left;
margin-top: 3px;
margin-right: 20px;
color : #8b8b8b;
font-size : 13px;
font-weight: 400;
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
    const [isLoading, setIsLoading] = useState(false);
    const [isProfessor, setisProfessor] = useState(false);
    const user = JSON.parse(window.sessionStorage.userInfo);
    const week = ["월", "화", "수", "목", "금", "토", "일"]
    const subjectId = String(match.params.subject);
    const [subjectInfo, setSubjectInfo] = useState();
    
    const getData = () => {
        const url = '/api/subject/info/'+ subjectId;
        axios.get(url)
        .then((response)=>{
            const result = response.data.subject;
            setSubjectInfo(result);
            setIsLoading(true);
        })
        .catch((error)=>{
            console.log(error);
        });
    }

    const display = () => {
        return(
            <Container  style={{marginLeft: "20px", marginTop: '10px'}}>
            <Title>Lecture Info</Title>
            <div style={{width: "100%", display: "block"}}>
                <SubTitle>내 강의 / {subjectInfo.name} / 강의 정보</SubTitle>                
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
        );
    }
    
    useEffect(() => {
        if(user.type === "professor") {setisProfessor(true);}
        getData();
    },[]);

    

    return(
        <Router>
            <Switch>
                <Route path= "/main/:subject/info/update" component={UpdatePage}/>
                <Route path="/">
                    <div>{isLoading && display()}</div>
                </Route>
            </Switch>
        </Router>

    )
}

export default Index;