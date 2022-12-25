import React, { Component } from 'react'; 
import { withRouter,Link } from 'react-router-dom';
import { Axios } from '../utils/axiosInterceptor';
import { BASEURL, ROUTES} from '../config/routes';
import {  CONFIGS} from '../config';
import {Notification, getUserDetails} from '../utils';
import GoogleAds from '../components/google-ads';

class Signup extends Component {
    constructor(){
        super(); 
        this.state = {
            form:{email:'',password:''}
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
        if(!form.email || !form.password){
            Notification({
                show: true,
                data:{success:false, msg:'Please enter email and password'}
              });
            return;
        }
        try{
          let _resp = await Axios.post(`${BASEURL}${ROUTES.login}`,form);
          if(!_resp){_resp = {data:{success:false, msg:'Unexpected erro occured'} }; return;}

          if(_resp && _resp.data &&_resp.data.success){
              localStorage.setItem(CONFIGS.uLocal, _resp.data.data.token);
              this.props.history.push('/dashboard');
          }else{
            Notification({
                show: true,
                data:{success:_resp.data.success, msg:_resp.data.data.error || _resp.data.message}
              });
          }
        }catch(ex){
          Notification({
            show:true,
            data:{success:false, msg:ex ? (ex.response ?ex.response.data.error : ex) : "Exception ocurred"}
        });}
    
      };

  render() {
            return (
                <div className="main-container">
                    <div className="container">
                        <div className="row">
                        <div className="col-md-4 col-sm-4"></div>
                        <div className="col-md-4 col-sm-4">
                            <div className="logo_plain text-center"><img src={"./assets/images/logo.png"} alt="thePuerta"/></div>
                            <div className="card" style={{"marginTop":"20px"}}>
                            <div className="contctxt">User SIGNIN</div><br />
                            <div className="formint conForm">
                                <form>
                                <div className="input-wrap has-float-label">
                                    <input type="text" name="email" className="form-control" onChange={this._handleFormChange.bind(this)} />
                                    <span>Email</span>
                                </div>
                                <div className="input-wrap has-float-label">
                                    <input type="password" name="password" className="form-control" onChange={this._handleFormChange.bind(this)}/>
                                    <span>Password</span>
                                </div>
                                <div className="sub-btn text-center">
                                    <button className="btn" onClick={this._onFormSubmit.bind(this)}>SIGNIN</button>
                                </div>
                                <div className="newuser">
                                    {/* <i className="fa fa-user" aria-hidden="true"></i>  */}
                                    Not Registered? <Link to='/signup'>Signup</Link></div>
                                </form>
                            </div>
                            </div>
                            <GoogleAds />
                        </div>
                        <div className="col-md-4 col-sm-4"></div>
                        </div>
                    </div>
                    </div>
            );
    }
  
}

export default withRouter(Signup);