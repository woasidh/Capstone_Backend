import React, { useEffect } from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import SignUp from '../components/views/SignUpPage/SignUp';
import studentSignup from '../components/views/SignUpPage/StudentSignUp';
import professorSignup from '../components/views/SignUpPage/ProfessorSignUp';
import { AutoComplete } from 'antd';
import styled, {css} from 'styled-components';

const baseUrl = "/signup/";

const Title = styled.div`
font-size : 30px;
color: white;
`
const SubTitle = styled.div`
font-size : 12px;
margin-bottom : 10px;
color: white;
`

function Index() {

    useEffect(() => {
        console.log("this is sign page");
    }, [])

    return (
        <>
	        <div style={{height : "100%", overflowY : "auto", padding : "1rem", paddingBottom : "4rem", backgroundColor: "#233044"}}>
                <div style={{width: "80%", paddingTop: "30px", margin: "auto"}}>
            <Title>SIGN UP</Title>
			<SubTitle>DISBOARD에 오신것을 환영합니다.</SubTitle>
                <Switch>
                    <Route exact path={baseUrl} component={SignUp} />
                    <Route path={baseUrl+"student"} component={studentSignup} />
                    <Route path={baseUrl+"professor"} component={professorSignup} />
                </Switch>
                </div>
            </div>
        </>
    )
}

export default Index
