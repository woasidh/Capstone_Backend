import React from 'react'
import styled, { css } from 'styled-components'

const Container = styled.div`
width : 100%;
height : 100%;
display :flex;
align-items : center;
justify-content : center;
`

const Box = styled.div`
text-align : center;
`

const Title = styled.div`
font-size : 37px;
`
const Desc = styled.div`
font-size : 20px;
color : ${props => props.theme.color.gray1};
margin-bottom : 10px;
`
const LinkBox = styled.div`
width : 650px;
height : 80px;
background-color :white;
border-radius : 10px;
border : 1px solid ${props => props.theme.color.gray7};
box-shadow : 10px 5px 5px ${props => props.theme.color.gray7};
padding : 1.5rem;
display : flex;
align-items : center;
justify-content : center;
`

const Link = styled.div`
border-bottom : 1px solid black;
width : 80%;
display : flex;
justify-content : space-between;
align-items : center;
`

function Index({match}) {
    const {code} = match.params;
    return (
        <Container>
            <Box>
                <Title>강의를 성공적으로 만들었습니다</Title>
                <Desc>아래 링크를 이용해 학생들을 초대해주세요</Desc>
                <LinkBox>
                    <Link>
                        <span className = "linkcontent" style = {{fontSize : "16px"}}>https://ajou-ac-kr/zoom.us/j/j42h4qn342h34n</span>
                        <button onClick = {()=>{
                            const elm = document.querySelector('.linkcontent');
                            navigator.clipboard.writeText(elm.innerText);
                            alert('클립보드에 복사되었습니다.');
                        }}><i className="fas fa-copy"></i></button>
                    </Link>
                </LinkBox>
            </Box>
        </Container>
    )
}

export default Index
