import React, { Component } from 'react'; 
import { withRouter, Link } from 'react-router-dom';
import { Axios_Instance} from '../utils/axiosInterceptor';
import { BASEURL, ROUTES} from '../config/routes';
import { checkAuthorization, getUserDetails } from '../utils';
import {Notification, FormatDate, GetStatusByDateTime} from '../utils';

class Events extends Component {
    constructor(){
        super(); 
        this.state = {
            user:{},
            form:{
                "response":[],
                "selectedEvent":{},
                
            },
            "showOption":-1,
            "editObj":{},
            "newEventValues":{},
            "editedFields":[]
        }
    }

    componentDidMount(){
        checkAuthorization(this.props);
        let details = getUserDetails();
        this.setState({user:details});
        this.fetchEvents();
    }; 
 
   
    async fetchEvents(){
        try{
            let _resp = await Axios_Instance.get(`${ROUTES.fetch_events}`);
            if(!_resp){
                Notification({
                    show:true,
                    data:"Unxpected error ocurred"});
                return;
            }
            if(_resp.data && _resp.data.success){
                let { form } = this.state;
                let d = _resp.data.data.channels;
                for(let i = 0; i < d.length ;i++){
                    d[i].status = GetStatusByDateTime(d[i].start_time, d[i].expected_end_time);
                };
                form.response = d;
                this.setState({ form });
            }
        }catch(ex){
            Notification({
                show:true,
                data:ex ? (ex.response ?ex.response.data : ex) : "Exception ocurred"});
        } 
    }

    OnSelectEvent(event){
        let { selectedEvent } = this.state;
        selectedEvent = event;
        this.setState({ selectedEvent });
    }

    closePopup(t){
        let { selectedEvent, editObj } = this.state;
        selectedEvent = {};
        editObj = {};
        this.setState({selectedEvent, editObj});

    }
    openOptions(k){
        let { showOption } = this.state;
        if(showOption === k){
            showOption = -1;
        }else{
            showOption = k;
        }
        this.setState({showOption});
    }
    onEditObj(event){
        let { editObj } = this.state;
        editObj = event;
        this.setState({ editObj });
    }
    _onFormFieldChange(e){
        let { newEventValues, editedFields } = this.state;
        newEventValues[e.target.name] = e.target.value;
        if(editedFields.indexOf(e.target.name) === -1) editedFields.push(e.target.name);
        this.setState({ newEventValues, editedFields });
    }

    async updateEvent(){
        try{
            let { newEventValues, editedFields } = this.state;
            let fd = new FormData();
            for(let k in newEventValues){
                fd.append(k, newEventValues[k]);
            };
           
            fd.append("edited_fields", editedFields);
            let _resp = await Axios_Instance.put(`${ROUTES.update_event}`, fd);
            if(_resp.data && _resp.data.success){
                let { editedFields} = this.state;
                editedFields = [];
                this.setState({editedFields});
                Notification({
                    show:true,
                    data:{success:true, msg:_resp.data.message}});
            }
        }catch(ex){
            Notification({
                show:true,
                data:ex ? (ex.response ?ex.response.data : ex) : "Exception ocurred"});
        }
    }

    onDeleteObj(event){
        if(event){
            let r = window.confirm("Are you sure to delete this event?");
            if(r){
                this.onDeleteEvent(event.id);
            }
        }
    }

    async onDeleteEvent(id){
        try{
            let _resp = await Axios_Instance.delete(`${ROUTES.delete_event}`.replace(":eventId", id));
            
            if(_resp && _resp.data && _resp.data.success){
                Notification({
                    show:true,
                    data:{success:true, msg:"Event deleted successfully"}});
                this.fetchEvents();
            }
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
                            <p style={{'textTransform':'capitalize'}}>Events
                            <span style={{"float":"right", "fontSize":"10px"}}><Link to={'/add-events'}>Add New Event</Link></span></p>
                        </h4>

                        <div className="">
                            <div className="row">
                                {this.state.form.response.map((obj, k )=>
                                    <div className="col-md-3 col-sm-3 col-xs-12" key={k}>
                                    <div className="card">
                                        <div className="thumbnail_logo">
                                            {obj.thumbnail && <img src={`${BASEURL}${obj.thumbnail}`} alt={obj.title} />}
                                            {!obj.thumbnail && <div style={{"height":"150px","width":"100%", "background":"#ccc","paddingTop":"25%", "color":"#96999c", "textAlign":"center"}}>No Thumbnail</div>}
                                            
                                           
                                        </div>
                                        <p style={{"cursor":"pointer", "color":"blue"}} onClick={this.OnSelectEvent.bind(this, obj)}>{obj.title}</p>
                                        <p style={{"position":"relative"}}>
                                            <span className="StatusWidget">{obj.status}</span> 
                                            <span> <i className="icon-options-vertical icons"  style={{"float":"right", "cursor":"pointer"}} onClick={this.openOptions.bind(this, k)}></i></span> 
                                            {k === this.state.showOption && <div className="optionsDropDown">
                                                <ul>
                                                    {/* <li onClick={this.onEditObj.bind(this, obj)}>Edit</li> */}
                                                    <li onClick={this.onDeleteObj.bind(this, obj)}>Delete</li>
                                                </ul>
                                            </div>}
                                        </p>
                                        <p><small style={{"fontSize":"10px"}}>{FormatDate(obj.start_time)} - {FormatDate(obj.expected_end_time)}</small></p>
                                        <small style={{display:"block", "color":"rgb(168 162 162)"}}>{obj.type} | {obj.channel_name} | {obj.platform}</small>
                                    </div>
                                </div> 
                                )}
                                {this.state.form.response.length === 0 &&
                                    <div style={{"textAlign":"center", "fontSize":"20px", "color":"#ccc"}}>No Events Found</div>
                                }
                            </div> 
                        </div>
                    </div>


                    {this.state.selectedEvent && Object.keys(this.state.selectedEvent).length > 0 && 
                        <div className="popupOverlay">
                            <div className="popup">
                                <p><b>{this.state.selectedEvent.title || '--'}</b></p>
                                <hr />
                                <div>
                                    <div className="row" style={{"marginBottom":"10px"}}>
                                        <div className="col-md-4 col-sm-4"><b>Status :</b></div>
                                        <div className="col-md-8 col-sm-8">{this.state.selectedEvent.status || '--'}</div>
                                    </div>
                                    <div className="row" style={{"marginBottom":"10px"}}>
                                        <div className="col-md-4 col-sm-4"><b>Type :</b></div>
                                        <div className="col-md-8 col-sm-8">{this.state.selectedEvent.type || '--'}</div>
                                    </div>
                                    <div className="row" style={{"marginBottom":"10px"}}>
                                        <div className="col-md-4 col-sm-4"><b>Platform :</b></div>
                                        <div className="col-md-8 col-sm-8">{this.state.selectedEvent.platform || '--'}</div>
                                    </div>
                                    <div className="row" style={{"marginBottom":"10px"}}>
                                        <div className="col-md-4 col-sm-4"><b>Channel Name : </b></div>
                                        <div className="col-md-8 col-sm-8">{this.state.selectedEvent.channel_name || '--'}</div>
                                    </div>
                                    <div className="row" style={{"marginBottom":"10px"}}>
                                        <div className="col-md-4 col-sm-4"><b>Start DateTime : </b></div>
                                        <div className="col-md-8 col-sm-8">{FormatDate(this.state.selectedEvent.start_time) || '--'}</div>
                                    </div>
                                    <div className="row" style={{"marginBottom":"10px"}}>
                                        <div className="col-md-4 col-sm-4"><b>Expected End DateTime : </b></div>
                                        <div className="col-md-8 col-sm-8">{FormatDate(this.state.selectedEvent.expected_end_time) || '--'}</div>
                                    </div>
                                   
                                    <div className="row" style={{"marginBottom":"10px"}}>
                                        <div className="col-md-4 col-sm-4"><b>Link : </b></div>
                                        <div className="col-md-8 col-sm-8"><Link to={this.state.selectedEvent.url.String}>{this.state.selectedEvent.url.String || '--'}</Link></div>
                                    </div>
                                    <div className="row" style={{"marginBottom":"10px"}}>
                                        <div className="col-md-4 col-sm-4"><b>Description : </b></div>
                                        <div className="col-md-8 col-sm-8">{this.state.selectedEvent.description.String || '--'}</div>
                                    </div>
                                    <div className="row" style={{"marginBottom":"10px"}}>
                                        <div className="col-md-4 col-sm-4"><b>Thumbnail : </b></div>
                                        <div className="col-md-8 col-sm-8 thumbnail_logo"> <img src={`${BASEURL}${this.state.selectedEvent.thumbnail}`} alt={'x'} style={{"height":"100px", "width":"50%"}} /></div>
                                    </div>
                                    <div style={{"marginBottom":"10px", "marginTop":"50px"}}>
                                    <button className="btn btn-primary" style={{"marginRight":"10px"}}>Edit Details</button>
                                    <button className="btn" onClick={this.closePopup.bind(this)}>Close</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }


                    {this.state.editObj && Object.keys(this.state.editObj).length > 0 && 
                        <div className="popupOverlay">
                            <div className="popup">
                                <p><b>Edit Events</b><span style={{"float":"right", "cursor":"pointer"}}><i className="icon-close icons" onClick={this.closePopup.bind(this,"edit")}></i></span></p>
                                <hr />
                                <div>
                                    <div className="row"  style={{"marginBottom":"10px"}}>
                                        <div className="col-md-6 col-sm-6 col-xs-12">
                                            <div className="input-wrap has-float-label">
                                                <select name="type" required onChange={this._onFormFieldChange.bind(this)} defaultValue={this.state.editObj.type} className="form-control">
                                                    <option>--</option>
                                                    <option value="live_stream">Live Stream</option>
                                                    <option value="premier">Premier</option>
                                                    <option value="video">Video</option>
                                                    <option value="post">Post</option>
                                                </select>
                                                <span>Type</span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-sm-6 col-xs-12">
                                            <div className="input-wrap has-float-label">
                                                <input type="text" name="title" defaultValue={this.state.editObj.title} required={true} className="form-control" onChange={this._onFormFieldChange.bind(this)}/>
                                                <span>Title</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row"  style={{"marginBottom":"10px"}}>
                                        <div className="col-md-6 col-sm-6 col-xs-12">
                                            <div className="input-wrap has-float-label">
                                                <input type="text" name="url" required={true} defaultValue={this.state.editObj.url.String} className="form-control" onChange={this._onFormFieldChange.bind(this)}/>
                                                <span>Link</span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-sm-6 col-xs-12">
                                            <div className="input-wrap has-float-label">
                                                <input type="file" name="thumbnail"  className="form-control" onChange={this._onFormFieldChange.bind(this)}/>
                                                <span>Thumbnail</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row" style={{"marginBottom":"10px"}}>
                                        <div className="col-md-6 col-sm-6 col-xs-12">
                                           <div className="input-wrap has-float-label">
                                                <input type="datetime-local" name="start_time" defaultValue={this.state.editObj.start_time.substring(0,this.state.editObj.start_time.length-1)} required={true} className="form-control" onChange={this._onFormFieldChange.bind(this)}/>
                                                <span>Start DateTime</span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-sm-6 col-xs-12">
                                            <div className="input-wrap has-float-label">
                                                <input type="datetime-local" name="expected_end_time" defaultValue={this.state.editObj.expected_end_time.substring(0,this.state.editObj.expected_end_time.length-1)} required={true} className="form-control" onChange={this._onFormFieldChange.bind(this)}/>
                                                <span>Expected End DateTime</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row" style={{"marginBottom":"10px"}}>
                                        <div className="col-md-6 col-sm-6 col-xs-12">
                                            <div className="input-wrap has-float-label">
                                                <textarea rows="2" className="form-control" defaultValue={this.state.editObj.description.String} name="description" onChange={this._onFormFieldChange.bind(this)} style={{"height":"56px"}}></textarea>
                                                <span>Description</span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-sm-6 col-xs-12"> 
                                        </div>
                                    </div> 
                                    <div style={{"marginBottom":"10px", "marginTop":"10px"}}>
                                    <button className="btn btn-primary" style={{"marginRight":"10px"}} onClick={this.updateEvent.bind(this)}>Update</button>
                                    {/* <button className="btn" onClick={this.closePopup.bind(this)}>Close</button> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                    
                </div>
            );
    }
  
}

export default withRouter(Events);