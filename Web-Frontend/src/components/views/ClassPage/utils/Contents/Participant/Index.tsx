import React from 'react'
import styled, {css} from 'styled-components'

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
font-size :11px;
margin-bottom : 1vh;
height : 3vh;
`

function Index() {

    //render participants
    function renderPtcs(){
    
    }

    return (
        <>
            <Row style = {{color :'black'}}>
                <div>name</div>
                <div>interest</div>
                <div>score</div>
                <div>attendance</div>
            </Row>
            <ListBox id = "part_listbox">
                <Row>
                    <div>최민우</div>
                    <div>83%</div>
                    <div>5</div>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}><input type="checkbox" /></div>
                </Row>
                <Row>
                    <div>최민우</div>
                    <div>83%</div>
                    <div>5</div>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}><input type="checkbox" /></div>
                </Row>
                <Row>
                    <div>최민우</div>
                    <div>83%</div>
                    <div>5</div>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}><input type="checkbox" /></div>
                </Row>
                <Row>
                    <div>최민우</div>
                    <div>83%</div>
                    <div>5</div>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}><input type="checkbox" /></div>
                </Row>
                <Row>
                    <div>최민우</div>
                    <div>83%</div>
                    <div>5</div>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}><input type="checkbox" /></div>
                </Row>
                <Row>
                    <div>최민우</div>
                    <div>83%</div>
                    <div>5</div>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}><input type="checkbox" /></div>
                </Row>
                <Row>
                    <div>최민우</div>
                    <div>83%</div>
                    <div>5</div>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}><input type="checkbox" /></div>
                </Row>
                <Row>
                    <div>최민우</div>
                    <div>83%</div>
                    <div>5</div>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}><input type="checkbox" /></div>
                </Row>
                <Row>
                    <div>최민우</div>
                    <div>83%</div>
                    <div>5</div>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}><input type="checkbox" /></div>
                </Row>
                <Row>
                    <div>최민우</div>
                    <div>83%</div>
                    <div>5</div>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}><input type="checkbox" /></div>
                </Row>
            </ListBox>
        </>
    )
}

export default Index
