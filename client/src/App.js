import React, { Component } from 'react';
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
import Channels from './components/channels';
import AddEvents from './components/add-events';
import Events from './components/events';
import Watchlists from './components/watchlists';
import FeedPosts from './components/feed-posts';
import Footer from './components/subComponents/footer';
import HowItWorks from './components/how-it-works';
import Feedback from './components/feedback';
import Privacy from './components/privacy';

class App extends Component {
  constructor(){
    super(); 
      this.state = {
        "channelsList":[]
      };
      this.getChannelsList = this.getChannelsList.bind(this);
      this.setChannelsList = this.setChannelsList.bind(this);
  } 

  setChannelsList(d){
    let { channelsList } = this.state;
    channelsList = d || [];
    this.setState({ channelsList });
  };

  getChannelsList(){
    return this.state.channelsList;
  };

  render(){
    return (
      <Provider store={Store}>
        <Router>
          <AppContainer>
          <Header setChannelsList={this.setChannelsList} />
          <Switch> 
            <Route exact path='/' component={Signin} />
            <Route exact path='/dashboard' render={() =><Dashboard state={this.state} getChannelsList={this.getChannelsList}/>} />
            <Route exact path='/signup' component={Signup} />
            <Route exact path='/add-channel-page' component={AddChannel} />
            <Route exact path='/add-events' component={AddEvents} />
            <Route exact path='/channels' component={Channels} />
            <Route exact path='/events' component={Events} />
            <Route exact path='/watchlists' component={Watchlists}/>
            <Route exact path='/feeds' component={FeedPosts} />
            <Route exact path='/how-it-works' component={HowItWorks} />
            <Route exact path='/feedback' component={Feedback} />
            <Route exact path='/privacy' component={Privacy} />
          </Switch>
          <Footer />
          </AppContainer>
        </Router>
      </Provider>
    );
  }
}

export default App;
