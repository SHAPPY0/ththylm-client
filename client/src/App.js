import React from 'react';
import logo from './logo.svg';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import './App.css';
import {Provider} from 'react-redux';
import Store from './store';
import AppContainer from './components/appContainer';
import Dashboard from './components/dashboard';
import Header from './components/subComponents/header';
import Signup from './components/signup';
import Signin from './components/signin';
import AddChannel from './components/add-channel';
import BuildingDetails from './components/building-details';
import ManageTenants from './components/manage-tenants';
import Channels from './components/channels';
import AddEvents from './components/add-events';
import Events from './components/events';
import Watchlists from './components/watchlists';
import FeedPosts from './components/feed-posts';

function App() {
  return (
    <Provider store={Store}>
      <Router>
        <AppContainer>
        <Header />
        <Switch> 
          <Route exact path='/' component={Signin} />
          <Route exact path='/dashboard' component={Dashboard} />
          <Route exact path='/signup' component={Signup} />
          <Route exact path='/add-channel-page' component={AddChannel} />
          <Route exact path='/add-events' component={AddEvents} />
          <Route exact path='/channels' component={Channels} />
          <Route exact path='/events' component={Events} />
          <Route exact path='/watchlists' component={Watchlists}/>
          <Route exact path='/feeds' component={FeedPosts} />
        </Switch>
        </AppContainer>
      </Router>
    </Provider>
  );
}

export default App;
