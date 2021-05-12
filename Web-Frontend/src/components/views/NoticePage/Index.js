import { useEffect, useState } from 'react';
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

const Container = styled.div`
width : 100%;
height : 100%;
display : inline-block;
//overflow-y: auto;
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
const SubTitle = styled.div`
float: left;
margin-right: 20px;
color : #233044;
font-size : 16px;
font-weight: 700;
`
const Box = styled.div`
display: block;
width: 100%;
margin : 10px 5px;
background : white;
border-radius: 5px;
padding: 10px;
box-shadow: 5px 5px #e0e0e0;
`
const WriteBtn = styled.a`
font-size: 16px;
padding: 5px;
background-color: ${props => props.theme.color.blue};
color: white;
border-radius: 5px;
`
const SmallBtn = styled.button`
display: inline-block;
font-size: 12px;
padding: 5px;
margin: 1px;
background-color: ${props => props.theme.color.blue};
color: white;
border-radius: 5px;
`
const NoticeBox = styled.div`
display: inline-block;
padding: 5px;
border-right: 1px solid black; 
width: 80%;
`
const NoticeTitle = styled.div`
display: block;
padding: 5px;
margin-right: 20px;
color : #233044;
font-size : 16px;
font-weight: 700;
`
const NoticeContent = styled.div`
padding: 5px;
display: block;
font-size : 14px;
`
const NoticeMenuBox = styled.div`
display: inline-block;
width : 20%;
padding : 5px;
`

function Index({match}) {
    const user = JSON.parse(window.sessionStorage.userInfo);
    const isProfessor = (user.type === "professor");
    const subjectId = match.params.subject;
    const subjectName = match.params.name;

    const [isLoading, setIsLoading] = useState(false);
    const isAll = String(subjectId) == "all" ? true : false;
    const [isEmpty, setisEmpty] = useState(false);
    const [noticeList, setNoticeList] = useState([]);
    
    const getData = () => {
        const url = isAll ? '/api/notice/get/all' : '/api/notice/get/subject/' + String(subjectId);
        axios.get(url)
        .then((response)=>{
            const result = response.data.notices;
            setisEmpty(result.length == 0 ? true : false);
            setNoticeList(result);
            setIsLoading(true);
            console.log(result);
        })
        .catch((error)=>{
            console.log(error);
        });
    }

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

    const displayAll = (list) => {
        return (
            <div>
                {list.map((all, index) => <>{all.notices.length != 0 && display(all.notices, all.subject.name)}</>)}                
             </div>
        );
    }

    const display = (noticeList, subject) => {
        return(
            <div>
                {isEmpty ? "등록된 공지 사항이 없습니다." : noticeList.map((value, index) =>
                    <Box>
                        <div style={{display: "inline-block", width: "100%"}}>
                            <NoticeBox>
                                <NoticeTitle>{value.title}</NoticeTitle>
                                <NoticeContent>
                                    {ReactHtmlParser(value.content)}
                                </NoticeContent> 
                            </NoticeBox>
                            <NoticeMenuBox>
                                {isProfessor && <div style={{display: "inline-block", top: "0px"}}>
                                    <SmallBtn onClick={(e) => updateNotice(e, value._id)}>수정</SmallBtn>
                                    <SmallBtn onClick={(e) => deleteNotice(e, value._id)}>삭제</SmallBtn></div>}
                                {isAll && <div style={{display: "block", margin: "5px 0"}}>{subject}</div>}
                                <div style={{margin: "5px 0"}}>{moment(value.date).format('YYYY/MM/DD HH:mm')}</div>                                    
                            </NoticeMenuBox>
                        </div>
                        <hr style={{width: "100%", margin: "10px 0px", display:"block"}}/>
                        <ShowResponse commentList={value.comments} emotionList={value.emotions} postId={value._id} subjectId={subjectId} subjectName={subjectName} userId={user._id} type={"notice"}/>
                    </Box>
                )}
            </div>
        );
    }

    useEffect(() => {
        getData();
        
    },[])

    return(
        <div>
        <Router>
            <Switch>
                <Route path="/main/:subject/:name/notice/write" component={WritePage}/>
                <Route path="/main/:subject/:name/notice/update/:id" component={UpdatePage}/>
                <Route path="/">
                    <Container>
                    <Title>Notice</Title>
                    <div style={{width: "100%", display: "block"}}>
                        <SubTitle>{isAll ? "종합공지사항" : `내 강의 / ${subjectName} / 공지 사항`}</SubTitle>
                        {isProfessor && !isAll && <WriteBtn href={`/main/${subjectId}/${subjectName}/notice/write`} style={{display: "inline-block", float:"right"}}>작성하기</WriteBtn>}
                    </div>
                    <hr style={{width: "100%", margin: "10px 0px", marginTop: "40px",display:"block"}}/>
                    <div>
                        {isLoading && <> {isAll ? displayAll(noticeList) : display(noticeList)}</>}
                    </div>                    
                    </Container>
                </Route>
            </Switch>
        </Router>
        </div>                
    );
}

export default Index;