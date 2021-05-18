import React, { useEffect, useState } from 'react'
import Popup from './util/Popup'

interface quizProp {
    socket: any
}

interface QuestionType{
    qs : Array<String>,
    as : Array<String>
}

function Index(props: quizProp) {

    const [didGet, setdidGet] = useState(false);
    const [questions, setquestions] = useState<QuestionType>({
        qs : [],
        as: []
    });

    function backTo(){
        setdidGet(false);
    }

    const socket = props.socket;
    useEffect(() => {
        socket.on('sendQuiz', (data: any) => {
            setquestions(data);
            setdidGet(true);
        })
    }, [])
    return (
        <div>
            {didGet &&
                <Popup data = {questions} setOptions = {backTo}></Popup>
            }
        </div>
    )
}

export default Index
