import React, { useEffect, useState } from 'react'
import './Index.css'
import axios from "axios"
const crypto = require("crypto");


const header = new Headers();
header.append('Access-Control-Allow-Origin', '*');

function Index() {

    useEffect(() => {
        const payload = {};
        axios.get("http://ec2-3-133-119-255.us-east-2.compute.amazonaws.com:3000/auth/google", payload, header).then(response =>{
            console.log(response);
        })
    }, [])
    return (
        <div className = "sumin">
            this is zoom test page
            <iframe allow="microphone; camera" style={{width : '800px', height : '800px'}} src="https://success.zoom.us/wc/s/6345315876" frameBorder="0"></iframe>
        </div>
    )
}

export default Index
