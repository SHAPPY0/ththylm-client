import React, { Component } from 'react'; 
import { withRouter, Link } from 'react-router-dom';
import { Axios } from '../utils/axiosInterceptor';
import { BASEURL, ROUTES} from '../config/routes';
import { SIGNUP_REQ_VALIDATOR} from '../utils/validators';
import {Notification, getUserDetails} from '../utils';


class Signup extends Component {
    constructor(){
        super(); 
        this.state = {
          form:{
            first_name:'',
            last_name:'',
            email:'',
            password:'',
            cnfpassword:'',
            user_type:0
          }
        }
    }

    componentDidMount(){
      let user = getUserDetails();
      if(Object.keys(user).length > 0){
          this.props.history.push("/dashboard");
      }
  }

  _handleFormChange(e){
    let {form} = this.state;
    form[e.target.name] = e.target.value;
    this.setState({form});
  };

  async _onFormSubmit(e){
    e.preventDefault();
    let {form} = this.state;
    let _error = SIGNUP_REQ_VALIDATOR(form);
    if(_error.is_error) {
      Notification({
        show:true,
        data:{success:false, msg:_error.msg}});
        return;
    }
    try{
      form.user_type = parseInt(form.user_type);
      let _resp = await Axios.post(`${BASEURL}${ROUTES.register}`,form);
      if(!_resp ){_resp = {data:{success:false, msg:'Unexpected erro occured'} }; return;}
      Notification({
        show: true,
        data:{success:_resp.data.success, msg:_resp.data.message || _resp.data.msg}
      });
      
    }catch(ex){
      Notification({
        show:true,
        data:{success:false, msg:ex ? (ex.response ?ex.response.data : ex) : "Exception ocurred"}});
    }

  };

  render() {
            return (
                <div className="inner-container">
                <div className="container">
                  <div className="row">
                    <div className="col-md-4 col-sm-4"></div>
                    <div className="col-md-4 col-sm-4">
                      <div className="logo_plain text-center"><img src={"./assets/images/logo.png"} alt="thePuerta"/></div>
                      <div className="card" style={{"marginTop":"20px"}}>
                          
                        <div className="contctxt">User SIGNUP</div><br />
                        <div className="formint conForm">
                          <form>
                            <div className="input-wrap has-float-label">
                              <input type="text" name="first_name" required onChange={this._handleFormChange.bind(this)} className="form-control" />
                              <span>First Name*</span>
                            </div>
                            <div className="input-wrap has-float-label">
                              <input type="text" name="last_name" onChange={this._handleFormChange.bind(this)}  className="form-control" />
                              <span>Last Name</span>
                            </div>
                            <div className="input-wrap has-float-label">
                              <input type="text" name="email" required onChange={this._handleFormChange.bind(this)}  className="form-control" />
                              <span>Email*</span>
                            </div>
                            {/* <div className="input-wrap has-float-label">
                              <input type="text" name="mobile" required onChange={this._handleFormChange.bind(this)}  className="form-control" />
                              <span>Mobile</span>
                            </div> */}
                            <div className="input-wrap has-float-label">
                              <input type="password" name="password" required onChange={this._handleFormChange.bind(this)}  className="form-control" />
                              <span>Password*</span>
                            </div>
                            <div className="input-wrap has-float-label">
                              <input type="password" name="cnfpassword" required onChange={this._handleFormChange.bind(this)}  className="form-control" />
                              <span>Repeat Password*</span>
                            </div>
                            <div className="input-wrap has-float-label">
                              <select name="user_type" required onChange={this._handleFormChange.bind(this)}  className="form-control">
                                <option>--</option>
                                <option value="1">Creator </option>
                                <option value="2">Viewer</option>
                              </select>
                              <span>You are a*</span>
                            </div>
                            
                            
                            <div className="sub-btn text-center">
                                <button className="btn" onClick={this._onFormSubmit.bind(this)}>SIGNUP</button>
                            </div>
                            <div className="newuser">
                              {/* <i className="fa fa-user" aria-hidden="true"></i> */}
                               Already have an account? <Link to='/'>Signin Here</Link></div>
                          </form>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4 col-sm-4"></div>
                  </div>
                </div>
              </div>
            );
    }
  
}

// const mapDispatchToProps = (dispatch)=>{
//   return{
//     'notification':(data)=>dispatch({'type':ACTION_TYPES.TOGGLE_NOTIFICATION, ...data})
//   }
// }

export default withRouter(Signup);