import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Navigation from './Components/Navigation';
import Home from './Pages/Home';
import './App.css'
import Register from './Pages/Register';
import Login from './Pages/Login';

function App() {
  return (
    <BrowserRouter>
      <Navigation/>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/register" exact component={Register} />
        <Route path="/login" exact component={Login} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
