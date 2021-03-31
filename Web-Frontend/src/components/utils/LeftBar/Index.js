import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import logo_mark from '../../../images/logo/logo_mark.png'
import logo_word from '../../../images/logo/logo_word.png'
import Avater from '../../../images/avatar/avater.jpeg'

const Container = styled.div`
width : ${props => props.theme.margin.leftBar};
height : 100%;
background-color: ${props => props.theme.color.main};
position : absolute;
left : 0;
`

const Content = styled.div`
margin-left : 25px;
`
const Menu = styled.button`
display : block;
color : white;
font-size :15px;
text-align : left;
margin : 5px 0;
`

const SubMenu = styled.a`
color : white;
margin-bottom : 5px;
margin-left : 25px;
display : block;
font-size : 12px;
/* &.active{

} */

`
const Footer = styled.div`
position : absolute;
bottom : 10px;
height : 40px;
margin : 10px 7px;
display : flex;
align-items : center;
`

const FooterAvater = styled.div`
width: 40px;
height: 40px;
background-image: url(${Avater});
border-radius: 50%;
background-position: center center;
background-size: cover;
display : inline-block;
`

const FooterRight = styled.div`
color : white;
display : inline-block;
margin-left : 10px;
`


function Index() {

    const [isStudent, setisStudent] = useState(false)
    const [isProfessor, setisProfessor] = useState(false);

    useEffect(() => {
        if(window.sessionStorage.type == 'student'){
            setisStudent(true);
        }else{
            setisProfessor(true);
        }
    }, [])

    const [ShowMenu1, setShowMenu1] = useState(true);
    const [ShowMenu2, setShowMenu2] = useState(true);

    const toggle1 = (e) => {
        if (ShowMenu1 === false) setShowMenu1(true);
        else setShowMenu1(false);
    }

    const toggle2 = (e) => {
        if (ShowMenu2 === false) setShowMenu2(true);
        else setShowMenu2(false);
    }

    return (
        <Container>
            <a style={{ display: 'inline-block', margin: "25px 10px" }} href="/main">
                <img style={{ maxHeight: '25px' }} src={logo_mark} alt="logo_mark" />
                <img style={{ maxHeight: '25px' }} src={logo_word} alt="logo_word" />
            </a>
            <Content>
                <Menu onClick={toggle1}>
                    메뉴
                </Menu>
                {ShowMenu1 && <div>
                    {isProfessor && <SubMenu href="/main/uploadLecture">{'>'}<span>강의 개설</span></SubMenu>}
                    {isStudent && <SubMenu href="/main/enterLecture">{'>'}강의 참여</SubMenu>}
                    <SubMenu href="/main/zoom">{'>'}zoom test</SubMenu>
                    <SubMenu href="/">{'>'}공지사항</SubMenu>
                    <SubMenu href="/">{'>'}출결관리</SubMenu>
                    <SubMenu href="/">{'>'}진도 관리</SubMenu>
                </div>}
                <Menu onClick={toggle2}>
                    내 강의
                </Menu>
                {ShowMenu2 && <div>
                    <SubMenu href="/">{'>'}캡스톤 디자인</SubMenu>
                    <SubMenu href="/">{'>'}인공지능</SubMenu>
                    <SubMenu href="/">{'>'}자료구조 및 실습</SubMenu>
                    <SubMenu href="/">{'>'}컴퓨터 구조</SubMenu>
                </div>
                }
            </Content>
            <Footer>
                <FooterAvater />
                <FooterRight>
                    <div>
                        <div style={{ fontSize: '15px' }}>김수민(201620905)</div>
                        <div style={{ fontSize: '10px' }}>소프트웨어학과</div>
                    </div>
                </FooterRight>
            </Footer>
        </Container>
    )
}

export default Index
