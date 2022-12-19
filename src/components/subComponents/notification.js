import React, { Component } from 'react'; 

class Notification extends Component {
    constructor(){ 
        super();
    }

  render() {
      console.log("noti", this.props.data)
    return (
        <div className="rh_alert alert alert-success">
            <strong>{this.props.data.success ? 'Success!' :'Error!'}</strong> {this.props.data.msg || this.props.data.message}
        </div>
    );
    }
  
}

export default Notification;