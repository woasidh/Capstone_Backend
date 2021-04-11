import './App.css';
import React, { useEffect } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Login from './views/LoginPage/Login';
import { ThemeProvider } from "styled-components";
import Theme from "../styles/Theme"
import MainPage from './views/MainPage/Index'
import Routes from '../Routes/Index'
import TestPage from './views/TestPage/IndexT.tsx'
import SignUp from '../Routes/signup';

function App() {

/*   useEffect(() => {
    console.log("hi from app");
    document.getElementById("zmmtg-root").style.display = "none";
  }, []) */

  return (
    <ThemeProvider theme={Theme}>
      <Router>
        <Switch>
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
