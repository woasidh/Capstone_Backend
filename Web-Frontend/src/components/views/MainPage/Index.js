import React from 'react'
import { Calendar } from 'antd';
import 'antd/dist/antd.css';

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

function Index() {
    return (
        <div>
            <Container style={{marginLeft: "20px", marginTop: '10px'}}>
                    <Title>Main page</Title>
                    <div style={{width: "100%", display: "block"}}>
                        <SubTitle>Main page</SubTitle>
                    </div>
                    <hr style={{width: "100%", margin: "30px 0px", marginTop: "50px",display:"block", borderColor: '#ffffff'}}/>
                    <div style={{textAlign:'center', marginTop:'300px', fontSize:'30px', fontStyle:'italic'}}>
                        Default Page
                    </div>                    
                    </Container>
        </div>
    )
}

export default Index
