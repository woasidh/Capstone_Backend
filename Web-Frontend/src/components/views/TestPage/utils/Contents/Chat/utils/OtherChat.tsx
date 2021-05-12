import React, {useEffect} from 'react'
import styled from 'styled-components'

interface chatProps {
    msg : string
}

const Container = styled.div`
width : 100%;
display : flex;
justify-content : flex-start;
align-items : center;
margin-bottom : 5px;
`


const Msg = styled.div`
font-size : 13px;
padding : 2px 3px;
border-radius : 5px;
background-color : #E4E6EB;
word-break:break-all;
`

function OtherChat(props : chatProps) {

    useEffect(() => {

    }, [])

    return (
        <Container id="msgCnt" style = {{width : '100%'}}>
            <Msg>{props.msg}</Msg>
        </Container>
    )
}

export default OtherChat
