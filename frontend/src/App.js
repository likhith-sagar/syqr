import React from 'react';
import Navbar from './components/Navbar';
import {Route, Switch} from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Loading from './components/Loading';
import Homescreen from './components/Homescreen';
import Dashboard from './components/Dashboard';
import E404 from './components/404';
import Notify from './components/Notify';

function App() {
  return (
    <div className="app">
      <Navbar />
      <Loading />
      <Notify/>
      <div className="container">
        <Switch>
          <Route exact path='/' component={Homescreen}/>
          <Route path='/dashboard' component={Dashboard}/>
          <Route exact path='/login' component={Login}/>
          <Route exact path='/signup' component={Signup}/>
          <Route component={E404}/>
        </Switch>
      </div>
    </div>
  );
}

export default App;
