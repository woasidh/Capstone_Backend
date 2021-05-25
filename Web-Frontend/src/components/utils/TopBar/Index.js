import React, { useCallback } from 'react'
import styled from 'styled-components'
import searchIcon from '../../../images/utils/search.png'
import logout from '../../../images/utils/logout.png'
import PropTypes from 'prop-types';
import {Link, Redirect, useHistory} from "react-router-dom";
import axios from 'axios';
import { Alert } from 'antd';


const Container = styled.div`
background-color : white;
margin-left : ${props => props.theme.margin.leftBar};
height : 6vh;
display : flex;
justify-content : space-between;
align-items : center;
padding : 0 1rem;
`

const Left = styled.div `
display : flex;
position : relative;
align-items :center;
`

const Right = styled.div `
display : flex;
color : ${props => props.theme.color.gray4};
font-size : 23px;
> i{
    margin : 0 8px;
    position : relative;
}
`

const Input = styled.input `
width : 450px;
height : 38px;
border-radius : 15px;
border : 0px solid ${props => props.theme.color.gray4};
padding-left : 10px;
background-color : #f7f7f7;
color : black;
::placeholder{
    color : ${props => props.theme.color.gray4};
    font-size : 14px;
}
`

const Alarm = styled.div `
width : 15px;
height : 15px;
border-radius : 50%;
background-color : red;
border : none;
position : absolute;
top : -7px;
right : -7px;
color : white;
font-size : 10px;
text-align : center;
line-height : 15px;
`

function Index() {
    const history = useHistory();
    const onLogout = useCallback((e)=>{
        e.preventDefault();
        axios.get('/api/auth/logout')
        .then((response)=>{
            const result = response.data.success;
            console.log(result);
            sessionStorage.removeItem("userInfo");
            alert("로그아웃 되었습니다.");
            return window.location.href = '/';
        })
        .catch((error)=>{
            console.log(error);
        })
    });
    
    return (
        <Container>
            <Left>
                <Input type = "text" placeholder = "검색어를 입력해주세요" ></Input>
                <button style = {{display : 'flex', alignItems : 'center', position : 'absolute', right : '5px'}} ><img style = {{marginRight:'8px'}}src= {searchIcon} alt="search"/></button>
            </Left>
            <Right> 
                {/*<i className="far fa-comment-alt"><Alarm>1</Alarm></i>
                <i className="far fa-bell"><Alarm>3</Alarm></i>*/}
                <button onClick={onLogout}><img style = {{height: '50px'}} src= {logout} alt="logout"/></button>
            </Right>
        </Container>
    )
}

export default Index