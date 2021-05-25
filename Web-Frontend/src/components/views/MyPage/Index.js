import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled, {css} from 'styled-components';

const Container = styled.div`
width : 97%;
// height : 100%;
// display : inline-block;
margin : 0px 20px;
margin-top : 10px;
// align-items : center;
// justify-content : center;
`
const Title = styled.div`
font-size : 30px;
border-bottom : 1px solid #F7F9FC;
height : 40px;
line-height : 40px;
font-style : italic;
`
const SubTitle = styled.div`
display: block;
margin-top: 3px;
margin-right: 20px;
color : #8b8b8b;
font-size : 13px;
font-weight: 400;
`
const Avater = styled.div`
margin: 20px auto;
width: 100px;
height: 100px;
border-radius: 50%;
background-position: center center;
background-size: cover;
display : inline-block;
`
const InfoTable = styled.table`
width: 100%;
margin: 0px auto;
border-collapse: collapse;
// border-spacing: 5px;
// border: solid #ccc 1px;
// -moz-border-radius: 6px;
// -webkit-border-radius: 6px;
// border-radius: 6px;
// -webkit-box-shadow: 0 1px 1px #ccc;
// -moz-box-shadow: 0 1px 1px #ccc;
// box-shadow: 0 1px 1px #ccc;
`
const Box = css`
padding: 10px;
border: 1px soild ${props => props.theme.color.blue};
`
const GrayBox = styled.td`
${Box}
background: ${props => props.theme.color.light_gray};
`
const WhiteBox = styled.td`
${Box}
background: white;
`

function Index(){
    const user = JSON.parse(window.sessionStorage.userInfo);
    const [isLoading, setisLoading] = useState(false);
    const [userInfo, setUserInfo] = useState();

    const getData = () => {
        axios.get('/api/user/get/' + String(user._id))
        .then((response)=>{
            const result = response.data;
            console.log(result);
            setUserInfo(result);
            setisLoading(true);
        })
        .catch((error)=>{
            console.log(error);
        });
    }

    const displayMyInfo = () =>{
        return(
            <div style={{textAlign: "center"}}>
                <Avater style={{backgroundImage: `url(${userInfo.photourl})`}}/>
                <InfoTable>
                    <tr>
                        <GrayBox>이름</GrayBox>
                        <WhiteBox>{userInfo.name}</WhiteBox>
                    </tr>
                    <tr>
                        <GrayBox>이메일</GrayBox>
                        <WhiteBox>{userInfo.email}</WhiteBox>
                    </tr>
                    <tr>
                        <GrayBox>학교</GrayBox>
                        <WhiteBox>{userInfo.school}</WhiteBox>
                    </tr>
                    <tr>
                        <GrayBox>전공</GrayBox>
                        <WhiteBox>{userInfo.major}</WhiteBox>
                    </tr>
                    <tr>
                        <GrayBox>{userInfo.type === "professor" ? "교번" : "학번"}</GrayBox>
                        <WhiteBox>{userInfo.identityID}</WhiteBox>
                    </tr>
                </InfoTable>
            </div>
        );
    }

    useEffect(()=>{getData();},[])

    return(
        <Container>
            <Title>Mypage</Title>
            <SubTitle>계정 / 내 정보</SubTitle>
            <hr style={{width: "100%", margin: "10px auto", display: "block", borderColor: '#ffffff'}}/>
            {isLoading && displayMyInfo()}
        </Container>
    )
}

export default Index;