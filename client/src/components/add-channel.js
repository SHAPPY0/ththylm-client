import React, { Component } from 'react'; 
import { withRouter } from 'react-router-dom';
import { Axios_Instance} from '../utils/axiosInterceptor';
import { ROUTES} from '../config/routes';
import { checkAuthorization, getUserDetails } from '../utils';
import { CHANNEL_REQ_VALIDATOR } from '../utils/validators';
import {Notification} from '../utils';

class AddChannels extends Component {
    constructor(){
        super(); 
        this.state = {
            user:{},
            form:{
                'type':'',
                'platform':'',
                'channel_name':'',
                'channel_url':'',
                'about':'',
                'tags':'',
                'logo':''
            }
        }
    }

    componentDidMount(){
        checkAuthorization(this.props);
        let details = getUserDetails();
        this.setState({user:details});
    };

    _onFormFieldChange(e){
        let { form } =  this.state;
        let emdObj = form;
        if(e.target.name === 'logo'){
            emdObj[e.target.name] = e.target.files[0];    
        }else
            emdObj[e.target.name] = e.target.value;
        this.setState({form});
    };


    async _addChannel(e){
        e.preventDefault();
        let { form } = this.state;
        if(form.tags) form.tags = form.tags.split(",");
        let _err = CHANNEL_REQ_VALIDATOR(form);
        if(_err && _err.is_error){
            Notification({
                show: true,
                data:{success:false, msg:_err.msg || 'Please fill required values'}
              });
              return;
        }
        let fd = new FormData();
        for( let k  in form){
            fd.append(k,form[k]);
        };
 
        // let _error = BUILDING_REQ_VALIDATOR(form);
        // if(_error && _error.is_error){
        //     alert(_error.msg);
        //     return;
        // } 
        try{
            let _resp = await Axios_Instance.post(`${ROUTES.add_channel}`,fd).catch(ex=>{
                        Notification({
                            show: true,
                            data:{success: false, msg:ex.response.data.error || "something went wrong"}
                        });
                    });
            if(!_resp){
                _resp = {data:{success:false, msg:'Unexpected erro occured'} };
                return;
            }
            Notification({
                show: true,
                data:{success:_resp.data.success, msg:_resp.data.message || _resp.data.msg}
              });
              sessionStorage.removeItem("channels");
              this.props.history.push('/channels');
        }catch(ex){
            Notification({
                show:true,
                data:ex ? (ex.response ?ex.response.data : ex) : "Exception ocurred"});
            
        }
        
    }

  render() {
            return (
                <div className="main-container">
                <div className="container">
                    <h4 className="page-title">
                        <p style={{'textTransform':'capitalize'}}>Add Channels/Pages</p>
                    </h4>

                    <div className="card">
                        <div className="row">
                            <div className="col-md-4 col-sm-4 col-xs-12">
                                <div className="input-wrap has-float-label">
                                    {/* <input type="text" name="name" className="form-control" onChange={this._onFormFieldChange.bind(this,'root',-1,-1)}/> */}
                                    <select name="type" required onChange={this._onFormFieldChange.bind(this)}  className="form-control">
                                        <option>--</option>
                                        <option value="channel">Channel</option>
                                        <option value="page">Page</option>
                                    </select>
                                    <span>Type*</span>
                                </div>
                            </div>
                            <div className="col-md-4 col-sm-4 col-xs-12">
                                <div className="input-wrap has-float-label">
                                <select name="platform" required onChange={this._onFormFieldChange.bind(this)}  className="form-control">
                                    <option>--</option>
                                    <option value="youtube">Youtube </option>
                                    <option value="facebook">Facebook</option>
                                    <option value="instagram">Twitter</option>
                                    <option value="instagram">Instagram</option>
                                    <option value="dailymotion">DailyMotion</option>
                                </select>
                                <span>Platform*</span>
                                </div>
                            </div>
                            <div className="col-md-4 col-sm-4 col-xs-12">
                                <div className="input-wrap has-float-label">
                                    <input type="text" name="channel_name" className="form-control" min="1" onChange={this._onFormFieldChange.bind(this)}/>
                                    <span>Channel/Page Name*</span>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-4 col-sm-4 col-xs-12">
                                <div className="input-wrap has-float-label">
                                    <input type="text" name="channel_url" required={true} className="form-control" min="1" onChange={this._onFormFieldChange.bind(this)}/>
                                    <span>Channel/Page URL*</span>
                                </div>
                            </div>
                            <div className="col-md-4 col-sm-4 col-xs-12">
                                <div className="input-wrap has-float-label">
                                    <input type="text" name="tags" required={true} className="form-control" onChange={this._onFormFieldChange.bind(this)}/>
                                    <span>Tags(comma separated)</span>
                                </div>
                            </div>
                            <div className="col-md-4 col-sm-4 col-xs-12">
                                <div className="input-wrap has-float-label">
                                    <input type="text" name="about" required={true} className="form-control" onChange={this._onFormFieldChange.bind(this)}/>
                                    <span>Brief About</span>
                                </div>
                            </div>
                        </div> 
                        <div className="row">
                            <div className="col-md-4 col-sm-4 col-xs-12">
                                <div className="input-wrap has-float-label">
                                    <input type="file" name="logo"  className="form-control" min="1" onChange={this._onFormFieldChange.bind(this)}/>
                                    <span>Logo</span>
                                </div>
                            </div>
                            <div className="col-md-4 col-sm-4 col-xs-12">
                                {/* <div className="input-wrap has-float-label">
                                    <input type="text" name="tags" required={true} className="form-control" onChange={this._onFormFieldChange.bind(this,'root',-1,-1)}/>
                                    <span>Tags</span>
                                </div> */}
                            </div>
                            <div className="col-md-4 col-sm-4 col-xs-12">
                                {/* <div className="input-wrap has-float-label">
                                    <input type="text" name="about" required={true} className="form-control" onChange={this._onFormFieldChange.bind(this,'root',-1,-1)}/>
                                    <span>Brief About</span>
                                </div> */}
                            </div>
                        </div> 
                    </div>
 
                        <div className="pull-right">
                                <button className="btn btn-primary" onClick={this._addChannel.bind(this)}>Add</button>
                        </div>
                </div>
                </div>
            );
    }
  
}

export default withRouter(AddChannels);