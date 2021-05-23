import React, { useEffect, useState } from 'react'
import Popup from './util/Popup'

interface quizProp {
    socket: any
}

interface QuestionType {
    type: number
    deadline: number
}

function Index(props: quizProp) {

    const [didGet, setdidGet] = useState(false);
    const [questions, setquestions] = useState<QuestionType>({
        type: 0,
        deadline: 0
    });

    function backTo() {
        setdidGet(false);
    }

    const socket = props.socket;
    useEffect(() => {
        socket.on('sendQuiz', (data: any) => {
            if (data.purpose == 'survey') {
                setquestions(data);
                setdidGet(true);
            }
        })
    }, [])
    return (
        <div>
            {didGet &&
                <Popup socket = {socket} data={questions} setOptions={backTo}></Popup>
            }
        </div>
    )
}

export default Index
