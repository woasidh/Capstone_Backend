import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import moment from 'moment';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import ReactHtmlParser from 'react-html-parser';
import WritePage from "./WriteNoticePage";
import UpdatePage from "./UpdateNoticePage";
import ShowResponse from "../../utils/Comment/Index"
import { resolve } from 'dns';

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
const Box = styled.div`
width: 100%;
display: block;
margin : 0px 5px 10px 0px;
padding : 10px;
background: white;
border-radius: 5px;
box-shadow: 0px 5px 5px 2px #e0e0e0;
position: relative;
`
const WriteBtn = styled.a`
display: inline-block;
float: right;
font-size: 16px;
padding: 5px;
background-color: ${props => props.theme.color.blue};
color: white;
border-radius: 5px;
`
const SmallBtn = styled.button`
font-size: 12px;
padding: 5px;
margin: 1px;
background-color: #ECECEC;
color: #3E3E3E;
border-radius: 5px;
&:hover{
    background-color : #BFBFBF;
}
`
const NoticeTitle = styled.div`
display: block;
margin: 10px 0px 10px 10px;
color : #233044;
font-size : 16px;
font-weight: 700;
`
const NoticeContent = styled.div`
width : 78%;
display: block;
font-size : 14px;
margin: 10px 0px 10px 10px;
border-bottom : 1px solid #BFBFBF;
`
const NoticeMenuButton = styled.button`
position: absolute;
height: 30px;
width: 30px;
top: 10px;
right: 10px;
border-radius:75px;
&:hover{
    background-color : #f3f3f3;
}
`
const NoticeMenuBox = styled.div`
position: absolute;
top: 40px;
right: 10px;
`
const Line = styled.div`
position: absolute;
height: 100%;
width: 1px;
top: 0px;
right: 20%;
background-color : #BFBFBF;
`
function ShowAll({noticeList, user}) {
    return(
        <div>
            {noticeList.map((all) => <>{all.notices.length != 0 && <DisplayNotices noticeList={all.notices} subjectName={all.subject.name} subjectId={all.subject._id} user={user}/>}</>)}
        </div> 
    )
}

function DisplayNotices({subjectId, subjectName, noticeList, user}) {
    const [isShowing, setisShowing] = useState(false);
    const isProfessor = (user.type === "professor");
    const deleteNotice = (e, noticeID) => {
        const url = '/api/notice/delete/' + noticeID;
        axios.delete(url)
        .then((response)=>{
            const result = response.data;
            if(result.success){ 
                alert("해당 공지사항이 삭제되었습니다.");
                return window.location.href = `/main/${subjectId}/${subjectName}/notice`;}
        })
        .catch((error)=>{
            console.log(error);
        });
    }

    const updateNotice = (e, noticeID) => {
        return (window.location.href = `/main/${subjectId}/${subjectName}/notice/update/${noticeID}`);
    }

    return(
        <div>
            {noticeList.length === 0 ? "등록된 공지 사항이 없습니다." : noticeList.map((value, index) =>
                <Box>
                    <NoticeTitle>{value.title}</NoticeTitle>
                    <NoticeContent>
                        {ReactHtmlParser(value.content)}     
                    </NoticeContent> 
                    <div style={{fontSize:"11px", margin: "0px 10px", position: "absolute", top: "10px", left: "80%"}}>
                        {subjectName}<br/>게시 날짜: {moment(value.date).format('YYYY년 M월 D일 HH:mm')}
                    </div>
                    {isProfessor && <NoticeMenuButton type="button" onClick={()=>setisShowing(!isShowing)}><img style={{maxHeight: "15px", maxWidth: "15px"}} src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnN2Z2pzPSJodHRwOi8vc3ZnanMuY29tL3N2Z2pzIiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgeD0iMCIgeT0iMCIgdmlld0JveD0iMCAwIDI0IDI0IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MTIgNTEyIiB4bWw6c3BhY2U9InByZXNlcnZlIiBjbGFzcz0iIj48Zz48Y2lyY2xlIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgY3g9IjEyIiBjeT0iMTIiIHI9IjMiIGZpbGw9IiM3NTc1NzUiIGRhdGEtb3JpZ2luYWw9IiMwMDAwMDAiIHN0eWxlPSIiIGNsYXNzPSIiPjwvY2lyY2xlPjxjaXJjbGUgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBjeD0iMTIiIGN5PSIzIiByPSIzIiBmaWxsPSIjNzU3NTc1IiBkYXRhLW9yaWdpbmFsPSIjMDAwMDAwIiBzdHlsZT0iIiBjbGFzcz0iIj48L2NpcmNsZT48Y2lyY2xlIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgY3g9IjEyIiBjeT0iMjEiIHI9IjMiIGZpbGw9IiM3NTc1NzUiIGRhdGEtb3JpZ2luYWw9IiMwMDAwMDAiIHN0eWxlPSIiIGNsYXNzPSIiPjwvY2lyY2xlPjwvZz48L3N2Zz4=" /></NoticeMenuButton>}
                    {isShowing && <NoticeMenuBox>
                        <SmallBtn onClick={(e) => updateNotice(e, value._id)}>수정하기</SmallBtn>
                        <SmallBtn onClick={(e) => deleteNotice(e, value._id)}>삭제하기</SmallBtn>
                    </NoticeMenuBox>}
                    <Line/>
                    <div><ShowResponse commentList={value.comments} emotionList={value.emotions} postId={value._id} subjectId={subjectId} subjectName={subjectName} userId={user._id} type={"notice"}/></div>
                </Box>
            )}
        </div>
    );
}

function Index({match}) {
    const user = JSON.parse(window.sessionStorage.userInfo);
    const isProfessor = (user.type === "professor");

    const subjectId = match.params.subject;
    const subjectName = match.params.name;
    const isAll = String(subjectId) == "all" ? true : false;
    const url = isAll ? '/api/notice/get/all' : '/api/notice/get/subject/' + String(subjectId);
    const [noticeList, setNoticeList] = useState([]);
    const [isLoading, setisLoading] = useState(true);
    
    const getData = () => {
        axios.get(url)
        .then((response)=>{
            const result = response.data.notices;
            console.log(result);
            setisLoading(false);
            setNoticeList(result);
        })
        .catch((error)=>{
            console.log(error);
        });
    }

    useEffect(()=>{
        
        console.log(getData())
    },[])

    return(
        <div>
        <Router>
            <Switch>
                <Route path="/main/:subject/:name/notice/write" component={WritePage}/>
                <Route path="/main/:subject/:name/notice/update/:id" component={UpdatePage}/>
                <Route path="/">
                    <Container style={{marginLeft: "20px", marginTop: '10px'}}>
                    <Title>Notice</Title>
                    <div style={{width: "100%", display: "block"}}>
                        <SubTitle>{isAll ? "강의 / 종합공지사항" : `내 강의 / ${subjectName} / 공지 사항`}</SubTitle>
                        {isProfessor && !isAll && <WriteBtn href={`/main/${subjectId}/${subjectName}/notice/write`} style={{display: "inline-block", float:"right"}}>작성하기</WriteBtn>}
                    </div>
                    <hr style={{width: "100%", margin: "30px 0px", marginTop: "50px",display:"block", borderColor: '#ffffff'}}/>
                    {!isLoading &&
                    <>{isAll ? <ShowAll noticeList={noticeList} user={user}/> : 
                    <DisplayNotices noticeList={noticeList} subjectName={subjectName} subjectId={subjectId} user={user}/>}</>}
                    </Container>
                </Route>
            </Switch>
        </Router>
        </div>                
    );
}

export default Index;