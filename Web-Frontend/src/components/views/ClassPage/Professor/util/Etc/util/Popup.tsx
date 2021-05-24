import React, { useState } from 'react';
import { Modal, Button, Radio } from 'antd';
import './Popup.css'
import Set from './Set'
import { InputNumber } from 'antd';

interface PopProps {
    setOptions: Function
    socket: any
    type : number
}

function Popup(props: PopProps) {
    const socket = props.socket;
    const [isModalVisible, setIsModalVisible] = useState(true);
    const [value, setValue] = React.useState(1);
    const [html_, sethtml_] = useState<Array<any>>([]);
    const [cnt, setcnt] = useState<number>(1);
    const [time, settime] = useState(1);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
        const obj = {
            purpose : 'survey',
            type : props.type,
            deadline : time
        }
        socket.emit('quiz', obj);
        props.setOptions(time);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        props.setOptions();
    };

    function addQ() {
        sethtml_(html_.concat(<Set cnt={cnt}></Set>));
        setcnt(cnt + 1);
    }

    return (
        <Modal
            title="퀴즈 출제"
            visible={isModalVisible}
            onCancel = {handleCancel}
            onOk={handleOk}
            okText="확인"
            wrapClassName={"quiz"}
        >
            <div className="deadContainer">
                <div>제한시간을 입력해주세요!</div>
                <div className="timeContainer">
                    <InputNumber style={{ display: 'block' }} min={1} max={60} defaultValue={1} onChange={(value: any) => {
                        settime(value);
                    }} />
                    <span>분</span>
                </div>
            </div>
        </Modal>
    )
}

export default Popup
