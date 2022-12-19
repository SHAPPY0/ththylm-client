import React, { Component } from 'react'; 
import { withRouter } from 'react-router-dom';
import { Axios_Instance, Ax } from '../utils/axiosInterceptor';
import { BASEURL, ROUTES} from '../config/routes';
import { checkAuthorization, getUserDetails } from '../utils';
import { EVENT_REQ_VALIDATOR } from '../utils/validators';
import {Notification, GetCacheSelectedChannel} from '../utils';

class AddEvents extends Component {
    constructor(){
        super(); 
        this.state = {
            user:{},
            form:{
                'type':'',
                'title':'',
                'url':'',
                'description':'',
                'start_time':'',
                'expected_end_time':'',
                'description':'',
                'channel_id':''
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
        if(e.target.name === 'thumbnail'){
            emdObj[e.target.name] = e.target.files[0];    
        }else
            emdObj[e.target.name] = e.target.value;
        this.setState({form});
    };


    async _addEvent(e){
        e.preventDefault();
        let { form } = this.state;
        form.channel_id = GetCacheSelectedChannel();
        let _err = EVENT_REQ_VALIDATOR(form);
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
        try{
            let _resp = await Axios_Instance.post(`${ROUTES.add_events}`,fd);
            if(!_resp ){
                _resp = {data:{success:false, msg:'Unexpected erro occured'} };
                return;
            }
            Notification({
                show: true,
                data:{success:_resp.data.success, msg:_resp.data.message || _resp.data.msg}
              });
            //   this.props.history.push('/channels');
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
                        <p style={{'textTransform':'capitalize'}}>Add Event</p>
                    </h4>

                    <div className="card">
                        <div className="row">
                            <div className="col-md-4 col-sm-4 col-xs-12">
                                <div className="input-wrap has-float-label">
                                    {/* <input type="text" name="name" className="form-control" onChange={this._onFormFieldChange.bind(this,'root',-1,-1)}/> */}
                                    <select name="type" required onChange={this._onFormFieldChange.bind(this)}  className="form-control">
                                        <option value="">--</option>
                                        <option value="live_stream">Live Stream</option>
                                        <option value="premier">Premier</option>
                                        <option value="video">Video</option>
                                        <option value="post">Post</option>
                                    </select>
                                    <span>Type*</span>
                                </div>
                            </div>
                            <div className="col-md-4 col-sm-4 col-xs-12">
                                <div className="input-wrap has-float-label">
                                        <input type="text" name="title" required={true} className="form-control" onChange={this._onFormFieldChange.bind(this)}/>
                                        <span>Title*</span>
                                </div>
                            </div>
                            <div className="col-md-4 col-sm-4 col-xs-12">
                                <div className="input-wrap has-float-label">
                                        <input type="text" name="url" required={true} className="form-control" onChange={this._onFormFieldChange.bind(this)}/>
                                        <span>URL*</span>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-4 col-sm-4 col-xs-12">
                                <div className="input-wrap has-float-label">
                                    <input type="file" name="thumbnail"  className="form-control" onChange={this._onFormFieldChange.bind(this)}/>
                                    <span>Thumbnail</span>
                                </div>
                            </div>
                            <div className="col-md-4 col-sm-4 col-xs-12">
                                <div className="input-wrap has-float-label">
                                    <input type="datetime-local" name="start_time" required={true} className="form-control" onChange={this._onFormFieldChange.bind(this)}/>
                                    <span>Start DateTime*</span>
                                </div>
                            </div>
                            <div className="col-md-4 col-sm-4 col-xs-12">
                                <div className="input-wrap has-float-label">
                                    <input type="datetime-local" name="expected_end_time" required={true} className="form-control" onChange={this._onFormFieldChange.bind(this)}/>
                                    <span>Expected End DateTime*</span>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-4 col-sm-4 col-xs-12">
                                <div className="input-wrap has-float-label">
                                    <textarea rows="2" className="form-control" name="description" onChange={this._onFormFieldChange.bind(this)} style={{"height":"56px"}}></textarea>
                                    <span>Description</span>
                                </div>
                            </div>
                            <div className="col-md-4 col-sm-4 col-xs-12">
                                
                            </div>
                            <div className="col-md-4 col-sm-4 col-xs-12">
                               
                            </div>
                        </div> 
                        <div className="row">
                            <div className="col-md-4 col-sm-4 col-xs-12">
                                
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
                                <button className="btn btn-primary" onClick={this._addEvent.bind(this)}>Add</button>
                        </div>
                </div>
                </div>
            );
    }
  
}

export default withRouter(AddEvents);