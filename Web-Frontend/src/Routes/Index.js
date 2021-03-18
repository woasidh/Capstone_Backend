import React, { useEffect } from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import LeftBar from '../components/utils/LeftBar/Index'
import TopBar from '../components/utils/TopBar/Index'
import Main from '../components/views/MainPage/Index'
import UploadLecturePage from '../components/views/UploadLecturePage/Index'
import enterLecturePage from '../components/views/EnterLecturePage/Index'
import ZoomTestPage from '../components/views/ZoomTestPage/Index'

const baseUrl = "/main/";

function Index() {

    useEffect(() => {
        console.log("this is main page");
    }, [])

    return (
        <>
            <LeftBar />
            <TopBar />
            <div className = "maincontainer" style={{height : "100%", marginLeft: '200px', overflowY : "auto", padding : "1rem", paddingBottom : "4rem", backgroundColor : "#F7F9FC", marginBottom : "10px"}}>
                <Router>
                    <Switch>
                        <Route exact path={baseUrl} component={Main} />
                        <Route path= {baseUrl+"uploadLecture"} component={UploadLecturePage} />
                        <Route path= {baseUrl+"enterLecture"} component={enterLecturePage} />
                        <Route path= {baseUrl+"zoom"} component={ZoomTestPage} />
                    </Switch>
                </Router>
            </div>
        </>
    )
}

export default Index
