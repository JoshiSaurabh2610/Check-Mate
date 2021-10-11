import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import Navigation from './Components/Navigation';
import Home from './Pages/Home';
import './App.css'
import Authenticate from './Pages/Authenticate';
import Activate from './Pages/Activate';
import Rooms from './Pages/Rooms';
import {useSelector} from 'react-redux';
import { useLoadingWithRefresh } from './hooks/useLoadingWithRefresh';

function App() {
  // auto loading custom hook
  const {loading} = useLoadingWithRefresh();

  return (
    loading ? 'loading......':
    <BrowserRouter>
      <Navigation />
      <Switch>
        <GuestRoute path="/" exact>
          <Home />
        </GuestRoute>
        <GuestRoute path="/authenticate" exact>
          <Authenticate />
        </GuestRoute>
        <SemiProtectedRoute path="/activate" exact>
          <Activate />
        </SemiProtectedRoute>
        <ProtectedRoute path="/rooms" exact>
          <Rooms />
        </ProtectedRoute>
      </Switch>
    </BrowserRouter>
  );
};

const GuestRoute = ({ children, ...rest }) => {
  const {isAuth} = useSelector(state =>  state.auth);
  return (
    <Route {...rest}
      render={({ location }) => {
        if (isAuth) {
          return <Redirect to={
            {
              pathname: '/activate',
              state: { from: location }
            }
          } />
        } else {
          return children;
        }
      }}>

    </Route>
  )
}

const SemiProtectedRoute = ({ children, ...rest }) => {
  const {isAuth,user} = useSelector(state => state.auth);
  return (
    <Route {...rest}
      render={({ location }) => {
        return (
          !isAuth ? (
            <Redirect to={
              {
                pathname: '/authenticate',
                state: { from: location }
              }
            } />)
            : isAuth && user.activated ? (
              <Redirect to={
                {
                  pathname: '/rooms',
                  state: { from: location }
                }} />
            ) : children
        )
      }}>
    </Route>
  )
}

const ProtectedRoute = ({ children, ...rest }) => {
  const {isAuth,user} = useSelector(state => state.auth)
  return (
    <Route {...rest}
      render={({ location }) => {
        if (isAuth && user.activated) {
          return children;
        } else {
          return <Redirect
            to={
              {
                pathname: "/",
                state: { from: location }
              }
            } />
        }
      }}>

    </Route>
  )
}

export default App;
