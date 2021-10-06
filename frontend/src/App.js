import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Navigation from './Components/Navigation';
import Home from './Pages/Home';
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Navigation/>
      <Switch>
        <Route path="/" exact component={Home} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
