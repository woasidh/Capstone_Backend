import { Button } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import React, { useEffect, useState } from 'react'
import styled from 'styled-components';

const Container = styled.div`
width : 100%;
height : 100%;
display : inline-block;
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
display: inline-block;
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
box-shadow: 5px 5px #f5f5f5;
`
const WriteBtn = styled.a`
font-size: 16px;
padding: 5px;
background-color: ${props => props.theme.color.blue};
color: white;
border-radius: 5px;
`
const NoticeBox = styled.div`
display: inline-block;
border-right: 1px solid black; 
width: 80%;
`
const NoticeTitle = styled.div`
display: block;
margin-right: 20px;
color : #233044;
font-size : 16px;
font-weight: 700;
`
const NoticeContent = styled.div`
font-size : 14px;
`
 

function Index({match}) {
    const [isAll, setIsAll] = useState(false);
    const [isProfessor, setisProfessor] = useState(false);
    const [user, setUser] = useState(JSON.parse(window.sessionStorage.user));
    const [subject, setSubject] = useState({
        id: match.params.subject,
        name: match.params.name
    });

    useEffect(() => {
        if(user.type === "professor"){
            setisProfessor(true);
        }
        if(subject.id == "all"){
            setIsAll(true);
            setSubject({name: ""})
        }

    },[])

    return(
        <Container>
            <Title>Notice</Title>
            <div style={{width: "100%", display: "block"}}>
                {isAll && <div style={{fontSize: "16px", float: "left"}}>종합공지사항</div>}
                {!isAll && <div style={{fontSize: "16px", float: "left"}}>내 강의 / {subject.name} / 공지 사항</div>}                
                {isProfessor && <WriteBtn href={`/main/${subject.id}/notice/write`} style={{display: "inline-block", float:"right"}}>작성하기</WriteBtn>}
            </div>
            <hr style={{width: "100%", margin: "10px 0px", marginTop: "40px",display:"block"}}/>
            <Box>
                <NoticeBox>
                    <NoticeTitle>공지제목</NoticeTitle>
                    <NoticeContent>공지내용</NoticeContent>
                </NoticeBox>
                
            </Box>
        </Container>
    );
}

export default Index;