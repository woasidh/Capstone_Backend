import React, { useState } from 'react';
import { Modal, Button, Radio } from 'antd';
import './Popup.css'
import Set from './Set'
import { Socket } from 'net';

interface PopProps {
    setOptions: Function
    socket : any
}

function Popup(props: PopProps) {
    const socket = props.socket;
    const [isModalVisible, setIsModalVisible] = useState(true);
    const [value, setValue] = React.useState(1);
    const [html_, sethtml_] = useState<Array<any>>([]);
    const [cnt, setcnt] = useState<number>(1);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
        const qs = document.querySelectorAll('#qQ')as NodeListOf<HTMLInputElement>;
        const as = document.querySelectorAll('#aQ')as NodeListOf<HTMLInputElement>;
        let questions:any = [];
        qs.forEach((value, idx)=>{
            questions.push(value.value);
        })
        let answers:any = [];
        as.forEach((value, idx)=>{
            answers.push(value.value);
        })
        const obj = {
            qs : questions,
            as : answers
        }
        socket.emit('quiz', obj);
        props.setOptions(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const onChange = (event: any) => {
        setValue(event.target.value);
    };

    function addQ() {
        sethtml_(html_.concat(<Set cnt = {cnt}></Set>));
        setcnt(cnt+1);
    }

    return (
        <Modal
            title="주관식 퀴즈"
            visible={isModalVisible}
            closable={false}
            onOk={handleOk}
            okText="확인"
            wrapClassName={"quiz"}
        >
            <div className="addContainer">
                <button onClick={addQ} className="addQ">추가</button>
            </div>
            <div className="qContainer">
                {html_}
            </div>
        </Modal>
    )
}

export default Popup
