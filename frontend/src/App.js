import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import Navbar from './Components/Navbar';
import ForgotPassword from './Components/Login/ForgotPassword.jsx';
import ResetPassword from './Components/Login/resetPassword';
import MyProfile from './Pages/MyProfile';
import Home from './Pages/Home';
import './App.css'

import 'dotenv'

import Rooms from './Pages/Rooms';
import { useSelector } from 'react-redux';
import { useLoadingWithRefresh } from './hooks/useLoadingWithRefresh';
import Loader from './Components/Loader';
import Login from './Pages/Login';

function App() {
  // auto loading custom hook
  const { loading } = useLoadingWithRefresh();
  return (
    loading ? <Loader msg="Loading... plz wait" /> :
      <BrowserRouter>
        <Navbar />
        <Switch>
          <GuestRoute path="/" exact>
            <Home />
          </GuestRoute>
          <GuestRoute path="/login" exact>
            <Login />
          </GuestRoute>
          <GuestRoute path="/forgotPassword" exact>
            <ForgotPassword />
          </GuestRoute>
          <GuestRoute path="/resetPassword/:token" exact>
            <ResetPassword />
          </GuestRoute>
          <ProtectedRoute path="/rooms" exact>
            <Rooms />
          </ProtectedRoute>
          <ProtectedRoute path="/myProfile" exact>
            <MyProfile />
          </ProtectedRoute>
        </Switch>
      </BrowserRouter>
  );
};

const GuestRoute = ({ children, ...rest }) => {
  const { isAuth } = useSelector(state => state.User);
  return (
    <Route {...rest}
      render={({ location }) => {
        if (isAuth) {
          return <Redirect to={
            {
              pathname: '/rooms',
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

const ProtectedRoute = ({ children, ...rest }) => {
  const { isAuth } = useSelector(state => state.User)
  return (
    <Route {...rest}
      render={({ location }) => {
        if (isAuth) {
          return children;
        } else {
          return <Redirect
            to={
              {
                pathname: "/login",
                state: { from: location }
              }
            } />
        }
      }}>
    </Route>
  )
}

export default App;
