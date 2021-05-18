import React from 'react'
import styled, { css } from 'styled-components'

const ListBoxCSS = css`
#part_listbox::-webkit-scrollbar {
    display: none;
}
`

const ListBox = styled.ul`
width : 100%;
overflow-y : scroll;
padding :0;
background-color : #F9F9F9;
::-webkit-scrollbar {
    display: none;
}
max-height : 32vh;
margin-bottom : 0;
`

const Row = styled.li`
display :grid;
grid-template-columns: repeat(4, 1fr);
color : #818181;
text-align : center;
font-size :1rem;
margin-bottom : 1vh;
height : 3vh;
`

function Index() {

    //render participants
    function renderPtcs(): any {
        const names = ['김민건', '최민우', '노민도', '윤다연', '김수민'];
        const interests = ['10', '60', '30', '90', '75'];
        const scores = ['-', '-', '-', '-', '-'];
        let ccc = false;
        const result = names.map((value, index) =>
        (
            <Row style={{ color: 'black' }}>
                <div>{value}</div>
                <div>{interests[index]}</div>
                <div>{scores[index]}</div>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}><input type="checkbox" checked disabled={ccc}/></div>
            </Row>
        ))
        return result;
    }

    return (
        <>
            <Row style={{ color: 'black' }}>
                <div>name</div>
                <div>interest</div>
                <div>score</div>
                <div>attendance</div>
            </Row>
            <ListBox id="part_listbox">
                {renderPtcs()}
            </ListBox>
        </>
    )
}

export default Index
