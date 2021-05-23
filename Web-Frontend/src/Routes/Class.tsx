import { useEffect } from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import PfClass from '../components/views/ClassPage/Professor/Index'
import StClass from '../components/views/ClassPage/Student/Index'

function Class() {

    useEffect(() => {
        console.log('route to class');
    }, [])

    return (
        <Router>
            <Switch>
                <Route path="/class/pf/:subject_id/" component={PfClass} />
                <Route path="/class/st/:subject_id/" component={StClass} />
            </Switch>
        </Router>
    )
}

export default Class
