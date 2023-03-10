import React, { Component } from 'react'; 
import { withRouter, Link } from 'react-router-dom';
import { Axios_Instance} from '../utils/axiosInterceptor';
import { BASEURL, ROUTES} from '../config/routes';
import { checkAuthorization, DateDiffFormat, FormatDate, getUserDetails, SetCacheSelectedChannel, GetCacheSelectedChannel } from '../utils';
import {Notification} from '../utils';

class Channles extends Component {
    constructor(){
        super(); 
        this.state = {
            user:{},
            form:{
                "response":[],
                "selectedChannel":{}
            },
            "selItem":"",
            "showOption":-1
        }
    }

    componentDidMount(){
        let { user, selItem } = this.state;
        checkAuthorization(this.props);
        selItem = GetCacheSelectedChannel();
        user = getUserDetails();
        this.setState({user, selItem});
        this.fetchChannels();
    }; 
 
   
    async fetchChannels(){
        try{
            let _resp = await Axios_Instance.get(`${ROUTES.fetch_channels}`).catch(ex=>{
                Notification({
                    show: true,
                    data:{success: false, msg:ex.response.data.error || "something went wrong"}
                  });
            });
            if(!_resp ){
                _resp = {data:{success:false, msg:'Unexpected error occured'} };
                return;
            }
            if(_resp.data && _resp.data.success){
                let { form, showOption } = this.state;
                form.response = _resp.data.data.channels;
                showOption = -1
                this.setState({ form, showOption });
            }
        }catch(ex){
            Notification({
                show:true,
                data:ex ? (ex.response ?ex.response.data : ex) : "Exception ocurred"});
        } 
    }

    OnSelectChannel(channel){
        let { selectedChannel } = this.state;
        selectedChannel = channel;
        this.setState({ selectedChannel });
    }

    closePopup(){
        let { selectedChannel } = this.state;
        selectedChannel = {};
        this.setState({selectedChannel});

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

    onDeleteObj(channel){
        if(channel){
            let r = window.confirm("Are you sure to delete this channel?");
            if(r){
                this.onDeleteFeed(channel.id);
            }
        }
    }
    async onDeleteFeed(id){
        try{
            let _resp = await Axios_Instance.delete(`${ROUTES.delete_channel}`.replace(":channelId", id)).catch(ex=>{
                Notification({
                    show: true,
                    data:{success: false, msg:ex.response.data.error || "something went wrong"}
                  });
            });
            
            if(_resp && _resp.data && _resp.data.success){
                Notification({
                    show:true,
                    data:{success:true, msg:"Channel deleted successfully"}});
                this.fetchChannels();
            }
        }catch(ex){
            Notification({
                show:true,
                data:ex ? (ex.response ?ex.response.data : ex) : "Exception ocurred"});
        }
    }

    setAsDefault(obj){
        if(obj.id){
            let { showOption } = this.state;
           SetCacheSelectedChannel(obj.id);
           Notification({
                show:true,
                data:{success:true, msg:"Channel set as default"}
            });
            showOption = -1;
            this.setState({ showOption });
        }
    }

  render() {
           
            return (
                <div className="main-container">
                    <div className="container">
                        <h4 className="page-title">
                            <p style={{'textTransform':'capitalize'}}>Channels/Pages
                            <span style={{"float":"right", "fontSize":"10px"}}><Link to={'/add-channel-page'}>Add New Channel/Page</Link></span></p>
                        </h4>

                        <div className="">
                            <div className="row">
                                {this.state.form.response.map((obj, k )=>
                                    <div className="col-md-4 col-sm-4 col-xs-12" key={k}>
                                    <div className="card" style={{"height":"auto", "minHeight":"auto"}}>
                                        <div className="row">
                                        <div className="col-md-4 col-sm-4" >
                                            <div className="channel_logo">
                                                {obj.logo_url &&  <img src={`${BASEURL}${obj.logo_url}`} alt={obj.channel_name[0]} />}
                                                {!obj.logo_url && <div className="blankImage">{obj.channel_name[0]}</div>}
                                                
                                            </div>
                                        </div>
                                        <div className="col-md-8 col-sm-8">
                                            <div>
                                                <span style={{"cursor":"pointer", "color":"blue"}} onClick={this.OnSelectChannel.bind(this, obj)}>{obj.channel_name}</span>
                                                <span> <i className="icon-options-vertical icons"  style={{"float":"right", "cursor":"pointer"}} onClick={this.openOptions.bind(this, k)}></i></span>
                                                {k === this.state.showOption && <div className="optionsDropDown" style={{"top":"15px", "width":"100px"}}>
                                                    <ul>
                                                        {/* <li onClick={this.onEditObj.bind(this, obj)}>Edit Feed</li> */}
                                                       {this.state.selItem === obj.id && <li style={{"color":"green"}}><i className="icon-check"></i> Default</li>}
                                                       {this.state.selItem !== obj.id && <li onClick={this.setAsDefault.bind(this, obj)}>Set Default</li>} 
                                                        <li onClick={this.onDeleteObj.bind(this, obj)}>Delete Channel</li>
                                                    </ul>
                                                </div>}
                                            </div>
                                            <small style={{display:"block", "color":"rgb(178 174 174)"}}>{obj.type} | {obj.platform}</small>
                                            <small style={{display:"block", "color":"rgb(178 174 174)"}}>Watchers: {obj.watchers || 0}</small>
                                            {/* <Link to={"/add-events"} style={{"fontSize":"10px"}}>Add Event</Link> */}
                                            <small style={{display:"block", "color":"rgb(178 174 174)"}}> {DateDiffFormat(obj.created_at)}</small>
                                        </div>
                                        </div>
                                    </div>
                                </div> 
                                )}
                                {this.state.form.response.length === 0 &&
                                    <div style={{"textAlign":"center", "fontSize":"20px", "color":"#ccc"}}>No Channel Found</div>
                                }
                            </div> 
                        </div>
    
                    </div>
                    {this.state.selectedChannel && Object.keys(this.state.selectedChannel).length > 0 && 
                        <div className="popupOverlay">
                            <div className="popup">
                                <p><b>{this.state.selectedChannel.channel_name || '--'}</b></p>
                                <hr />
                                <div>
                                    <div className="row" style={{"marginBottom":"10px"}}>
                                        <div className="col-md-4 col-sm-4"><b>Type :</b></div>
                                        <div className="col-md-8 col-sm-8">{this.state.selectedChannel.type || '--'}</div>
                                    </div>
                                    <div className="row" style={{"marginBottom":"10px"}}>
                                        <div className="col-md-4 col-sm-4"><b>Platform :</b></div>
                                        <div className="col-md-8 col-sm-8">{this.state.selectedChannel.platform || '--'}</div>
                                    </div>
                                    <div className="row" style={{"marginBottom":"10px"}}>
                                        <div className="col-md-4 col-sm-4"><b>Channel Name : </b></div>
                                        <div className="col-md-8 col-sm-8">{this.state.selectedChannel.channel_name || '--'}</div>
                                    </div>
                                    <div className="row" style={{"marginBottom":"10px"}}>
                                        <div className="col-md-4 col-sm-4"><b>Watchers : </b></div>
                                        <div className="col-md-8 col-sm-8">{this.state.selectedChannel.watchers || 0}</div>
                                    </div>
                                    <div className="row" style={{"marginBottom":"10px"}}>
                                        <div className="col-md-4 col-sm-4"><b>Channel Url : </b></div>
                                        <div className="col-md-8 col-sm-8"><Link to={this.state.selectedChannel.channel_url}>{this.state.selectedChannel.channel_url || '--'}</Link></div>
                                    </div>
                                    <div className="row" style={{"marginBottom":"10px"}}>
                                        <div className="col-md-4 col-sm-4"><b>Created At : </b></div>
                                        <div className="col-md-8 col-sm-8">{FormatDate(this.state.selectedChannel.created_at) || '--'}</div>
                                    </div>
                                    <div style={{"marginBottom":"10px", "marginTop":"50px"}}>
                                        <button className="btn btn-primary" style={{"marginRight":"10px"}}>Edit Details</button>
                                        <button className="btn" onClick={this.closePopup.bind(this)}>Close</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    
                    }
                    
                </div>
            );
    }
  
}

export default withRouter(Channles);