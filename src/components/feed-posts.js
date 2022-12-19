import React, { Component } from 'react'; 
import { withRouter, Link } from 'react-router-dom';
import { Axios_Instance, Ax } from '../utils/axiosInterceptor';
import { BASEURL, ROUTES} from '../config/routes';
import { checkAuthorization, getUserDetails } from '../utils';
import { BUILDING_REQ_VALIDATOR } from '../utils/validators';
import {Notification, FormatDate, DateDiffFormat} from '../utils';

class FeedPosts extends Component {
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
            "newFeedValues":{},
            "editedFields":[]
        }
    }

    componentDidMount(){
        checkAuthorization(this.props);
        let details = getUserDetails();
        this.setState({user:details});
        this.fetchFeeds();
    }; 
 
   
    async fetchFeeds(){
        try{
            let _resp = await Axios_Instance.get(`${ROUTES.fetch_feeds_by_id}`);
            if(!_resp){
                Notification({
                    show:true,
                    data:"Unxpected error ocurred"});
                return;
            }
            if(_resp.data && _resp.data.success){
                let { form } = this.state;
                form.response = _resp.data.data.feeds;
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
        let { newFeedValues, editedFields } = this.state;
        newFeedValues[e.target.name] = e.target.value;
        if(editedFields.indexOf(e.target.name) == -1) editedFields.push(e.target.name);
        this.setState({ newFeedValues, editedFields });
    }

    async updateFeed(){
        try{
            let { newFeedValues, editObj } = this.state;
            console.log("nsnsnss", newFeedValues)
            let _resp = await Axios_Instance.put(`${ROUTES.update_feed}`.replace(":feedId", editObj.id), newFeedValues);
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
            let r = window.confirm("Are you sure to delete this feed?");
            if(r){
                this.onDeleteFeed(event.id);
            }
        }
    }

    async onDeleteFeed(id){
        try{
            let _resp = await Axios_Instance.delete(`${ROUTES.delete_feed}`.replace(":deleteId", id));
            
            if(_resp && _resp.data && _resp.data.success){
                Notification({
                    show:true,
                    data:{success:true, msg:"Feed deleted successfully"}});
                this.fetchFeeds();
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
                            <p style={{'textTransform':'capitalize'}}>Feeds</p> 
                        </h4>

                        <div className="">
                            <div className="row">
                                {this.state.form.response.map((obj, k )=>
                                    <div className="col-md-4 col-sm-4 col-xs-12" key={k}>
                                        <div className="card" key={k} style={{"minHeight":"200px"}}>
                                            <div className="channelName" style={{"position":"relative"}}>
                                                {obj.logo_url && <img src={`${BASEURL}${obj.logo_url}`} alt={"test"} /> }
                                                {!obj.logo_url && <div className="blankLogo">{obj.channel_name[0]}</div>}
                                                <p>{obj.channel_name}
                                                    <span> <i className="icon-options-vertical icons"  style={{"float":"right", "cursor":"pointer"}} onClick={this.openOptions.bind(this, k)}></i></span>
                                                </p>
                                                {k === this.state.showOption && <div className="optionsDropDown" style={{"top":"25px", "width":"auto"}}>
                                                    <ul>
                                                        <li onClick={this.onEditObj.bind(this, obj)}>Edit Feed</li>
                                                        <li onClick={this.onDeleteObj.bind(this, obj)}>Delete Feed</li>
                                                    </ul>
                                                </div>}
                                            </div>
                                            <div style={{"clear":"both"}}>
                                                <p>{obj.feed}</p>
                                                <small style={{fontSize:"10px", color:"#9fa2a4"}}>{DateDiffFormat(obj.created_at) || '--'}</small>
                                            </div>
                                        </div>
                                </div> 
                                )}
                                {this.state.form.response.length === 0 &&
                                    <div style={{"textAlign":"center", "fontSize":"20px", "color":"#ccc"}}>No Feed Post Found</div>
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
                                        <div className="col-md-8 col-sm-8 thumbnail_logo"> <img src={`${BASEURL}${this.state.selectedEvent.thumbnail}`} style={{"height":"100px", "width":"50%"}} /></div>
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
                                <p><b>Edit Feed</b><span style={{"float":"right", "cursor":"pointer"}}><i className="icon-close icons" onClick={this.closePopup.bind(this,"edit")}></i></span></p>
                                <hr />
                                <div>   
                                    <div className="row" style={{"marginBottom":"10px"}}>
                                        <div className="col-md-12 col-sm-12 col-xs-12">
                                            <div className="input-wrap has-float-label">
                                                <textarea rows="5" className="form-control" defaultValue={this.state.editObj.feed} name="feed" onChange={this._onFormFieldChange.bind(this)} style={{"height":"56px"}}></textarea>
                                                <span>Feed</span>
                                            </div>
                                        </div> 
                                    </div> 
                                    <div className="row"  style={{"marginBottom":"10px"}}>
                                        <div className="col-md-6 col-sm-6 col-xs-12">
                                            {/* <div className="input-wrap has-float-label">
                                                <select name="status" required onChange={this._onFormFieldChange.bind(this)} defaultValue={this.state.editObj.status} className="form-control">
                                                    <option>--</option>
                                                    <option value="public">Public</option>
                                                    <option value="private">Private</option>
                                                    <option value="inactive">Inactive</option>
                                                </select>
                                                <span>Status</span>
                                            </div> */}
                                        </div>
                                        <div className="col-md-6 col-sm-6 col-xs-12">
                                        </div>
                                    </div>
                                    <div style={{"marginBottom":"10px", "marginTop":"10px"}}>
                                    <button className="btn btn-primary" style={{"marginRight":"10px"}} onClick={this.updateFeed.bind(this)}>Update</button>
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

export default withRouter(FeedPosts);