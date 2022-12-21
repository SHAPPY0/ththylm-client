import React, { Component } from 'react'; 
import { withRouter } from 'react-router-dom';
import Notification from './subComponents/notification';
import { connect } from 'react-redux';
import { ACTION_TYPES } from '../utils/actions';


class AppContainer extends Component {

  constructor(props){
    super(props);
    this.state = {
    }
  
  }
  

  render() {
    if(this.props.notification.show){
      setTimeout(()=>{
        this.props.toggleNotification({show:false,data:{}});
      },5000);
    }
    return (
      <div>
          {this.props.children}
          {this.props.notification.show && <Notification {...this.props.notification} />}
      </div>
    );
  }
}

const mapStateToProps = (state)=>{
    return{
      'notification':state.notification
    }
  };
const mapDispatchToProps = (dispatch)=>{
  return{
    'toggleNotification':(data)=>dispatch({'type':ACTION_TYPES.TOGGLE_NOTIFICATION,...data})
  }
}
export default connect(mapStateToProps,mapDispatchToProps)(withRouter(AppContainer));