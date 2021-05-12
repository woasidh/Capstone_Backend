import './App.css';
import React, { useEffect } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom"
import Login from './views/LoginPage/Login.js'
import { ThemeProvider } from "styled-components"
import Theme from "../styles/Theme"
import MainPage from './views/MainPage/Index.js'
import Routes from '../Routes/Index'
import TestPage from './views/TestPage/Index'
import PfClass from './views/ClassPage/Professor/Index'
import StClass from './views/ClassPage/Student/Index'
import SignUp from '../Routes/signup'

function App() {
  return (
    <ThemeProvider theme={Theme}>
      <Router>
        <Switch>
          <Route exact path="/main/class/pf/:class_code" component={PfClass} />
          <Route exact path="/main/class/st/:class_code" component={StClass} />
          <Route path="/main" component={Routes} />
          <Route path="/test/:id" component={TestPage} />
          <Route path="/signup" component={SignUp} />
          <Route path="/" component={Login} />
        </Switch>
      </Router>
    </ThemeProvider>
  );
}

export default App;
