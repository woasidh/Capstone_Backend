import React, {useEffect} from 'react'
import axios from 'axios'

function Index() {

    useEffect(() => {
        const payload = {
            email : "woasidh1@gmail.com"
        }
        axios.post('http://13.125.234.161:3000/auth/login', payload).then(response =>{
            console.log(response);
        })
    }, [])

    return (
        <div>
            this is zoom test page
        </div>
    )
}

export default Index
