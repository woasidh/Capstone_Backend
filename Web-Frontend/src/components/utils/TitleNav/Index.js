import React, {useEffect} from 'react'
import styled, { css } from 'styled-components'
import theme from '../../../styles/Theme'

const Title = styled.div`
font-style : italic;
font-size : 30px;
border-bottom : 1px solid #F7F9FC;
`

const SemiTitle = styled.div`
border-bottom : 1px solid ${props => props.theme.color.line_color};
height : 40px;
`

function Index(props) {

    useEffect(() => {
        console.log(props);
    }, [])

    return (
        <div>
            <Title>{props.title}</Title>
            <SemiTitle>
                <a href="/main" style={{ color: "#407AD6" }}>{props.titles[0]} </a>
                <span color="">/ {props.titles[1]}</span>
            </SemiTitle>
        </div>
    )
}

export default Index
