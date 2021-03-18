import React, { useEffect, useState } from 'react'
import './Index.css'
import axios from "axios"
const crypto = require("crypto");

function Index() {
    return (
        <div className = "sumin">
            this is zoom test page
            <iframe allow="microphone; camera" style={{width : '800px', height : '800px'}} src="https://success.zoom.us/wc/s/6345315876" frameBorder="0"></iframe>
        </div>
    )
}

export default Index
