import React, {useEffect} from 'react'
import { Calendar } from 'antd';
import 'antd/dist/antd.css';
import logo from '../../../images/utils/logo_main.png'
import logoT from '../../../images/utils/logoT_main.png'
import back from '../../../images/utils/back_main.png'

import styled from 'styled-components';

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
const Btn = styled.button`
width : 250px;
height : 50px;
border : none;
font-size : 24px;
font-weight : bold;
background-color: #407AD6;
color : white;
text-align :center;
line-height : 40px;
border-radius : 40px;
margin-top : 50px;
`
function Index() {

    async function wait() {
        await new Promise(resolve => setTimeout(resolve, 1000));

        return 10;
    }

    function f() {
        // shows 10 after 1 second
        wait().then(result => alert(result));
      }

    useEffect(() => {
        f();
    }, [])

    return (
        <div>
            <Container style={{ marginLeft: "20px", marginTop: '10px' }}>
                <Title>Main Page</Title>
                <div style={{ width: "100%", display: "block" }}>
                    <SubTitle>메인 페이지</SubTitle>
                </div>
                <hr style={{ width: "100%", margin: "30px 0px", marginTop: "50px", display: "block", borderColor: '#ffffff' }} />

                <div style={{ width: "45%", float: "left", marginTop: "60px", marginLeft: "30px" }}>
                    <div style={{ width: "500px" }}>
                        <img style={{ float: "left", width: "58px" }} src={logo} alt="logo" />
                        <img style={{ float: "left", maxWidth: "100%", height: "52px", marginLeft: "10px", marginTop: "5px" }} src={logoT} alt="logoT" />
                    </div>
                    <div style={{ marginTop: "130px", color: "#444444", fontSize: "36px", fontWeight: "bold", fontFamily: "Verdana" }}>ONLINE</div>
                    <div style={{ marginBottom: "30px", color: "#444444", fontSize: "36px", fontWeight: "bold", fontFamily: "Verdana" }}>COURSES SERVICE</div>
                    <div style={{ fontSize: "25px", color: "#b5b5b5", fontFamily: "Verdana", lineHeight: '45px', fontWeight: "bold", }}>Experience a new class with real-time lecture
                    service disboard! Instructors and students can
                    have even more amazing experiences in class.
                            Also, there are many out-of-class services as well.</div>
                    <Btn onClick={{}}>LEARN MORE</Btn>
                </div>
                <div style={{ float: "left", width: "800px", height: "600px" }}>
                    <img style={{ marginTop: "70px", maxWidth: "100%", height: "100%" }} src={back} alt="back" />
                </div>
            </Container>
        </div>
    )
}

export default Index