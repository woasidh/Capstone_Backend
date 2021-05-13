import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom"
import Login from './views/LoginPage/Login.js'
import { ThemeProvider } from "styled-components"
import Theme from "../styles/Theme"
import Routes from '../Routes/Index'
import SignUp from '../Routes/signup'
import Class from '../Routes/Class'

function App() {
  return (
    <ThemeProvider theme={Theme}>
      <Router>
        <Switch>
          <Route path="/main/" component={Routes} />
          <Route path="/signup/" component={SignUp} />
          <Route path="/class/" component={Class} />
          <Route path="/" component={Login} />
        </Switch>
      </Router>
    </ThemeProvider>
  );
}

export default App;
