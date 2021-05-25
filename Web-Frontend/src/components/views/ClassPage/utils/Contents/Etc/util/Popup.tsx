import React, { useState, useEffect } from 'react';
import { Modal, Button, Radio } from 'antd';
import styled from 'styled-components'
import './Style.css'

interface QuestionType {
    qs: Array<String>,
    as: Array<String>
}

interface PopProps {
    data: QuestionType,
    setOptions: Function
}

const Questions = styled.div`
margin-bottom : 5px;
`

const AnswerInput = styled.textarea`
width : 100%;
margin-bottom : 15px;
outline : none;
border : 1px solid black;
border-radius : 5px;
`

function Index(props: PopProps) {

    const [isModalVisible, setIsModalVisible] = useState(true);
    const [value, setValue] = React.useState(1);
    const [html_, sethtml_] = useState<Array<any>>([])

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
        props.setOptions();
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const onChange = (event: any) => {
        setValue(event.target.value);
    };

    useEffect(() => {
        sethtml_(props.data.qs.map((q, idx) => (
            <>
                <Questions>질문 {idx+1} : {props.data.qs[idx]}</Questions>
                <AnswerInput rows = {3} placeholder = "정답을 적어주세요"/>
            </>
        )))
    }, [])

    return (
        <Modal
            title="Pop 퀴즈"
            visible={isModalVisible}
            closable={false}
            onOk={handleOk}
            okText="제출"
            wrapClassName={"quizRec"}
        >
            {html_}
        </Modal>
    )
}

export default Index
