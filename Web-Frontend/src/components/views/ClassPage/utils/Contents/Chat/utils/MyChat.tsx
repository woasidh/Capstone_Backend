import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

interface chatProps {
    msg: string
}

const Container = styled.div`
width : 100%;
display : flex;
justify-content : flex-end;
align-items : center;
margin-bottom : 5px;
`


const Msg = styled.div`
font-size : 1rem;
padding : 2px 3px;
border-radius : 5px;
margin-right : 5px;
background-color : #C0EFFB;
word-break:break-all;
`

function MyChat(props: chatProps) {

    const [cntRef, setcntRef] = useState<any>(React.createRef());

    return (
            <Container ref={cntRef} id="msgCnt" style={{ width: '100%'}}>
                <Msg>{props.msg}</Msg>
            </Container>
    )
}

export default MyChat
