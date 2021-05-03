import { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";

function Index({match}){
    const [subjectId, setSubjectId] = useState(match.params.subject);

    useEffect(() => {
        axios.get('/api/subject/lecture/get/inProgress',{
            subjectId: {subjectId}
        })
        .then((response)=>{
            console.log(response.data);
        })
        .catch((error)=>{
            console.log(error);
        })
    },[]);

}

export default Index;