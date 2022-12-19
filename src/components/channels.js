import React, { Component } from 'react'; 
import { withRouter, Link } from 'react-router-dom';
import { Axios_Instance, Ax } from '../utils/axiosInterceptor';
import { BASEURL, ROUTES} from '../config/routes';
import { checkAuthorization, DateDiffFormat, FormatDate, getUserDetails } from '../utils';
import { BUILDING_REQ_VALIDATOR } from '../utils/validators';
import {Notification} from '../utils';

class Channles extends Component {
    constructor(){
        super(); 
        this.state = {
            user:{},
            form:{
                "response":[],
                "selectedChannel":{}
            }
        }
    }

    componentDidMount(){
        checkAuthorization(this.props);
        let details = getUserDetails();
        this.setState({user:details});
        this.fetchChannels();
    }; 
 
   
    async fetchChannels(){
        try{
            let _resp = await Axios_Instance.get(`${ROUTES.fetch_channels}`);
            if(!_resp ){
                _resp = {data:{success:false, msg:'Unexpected error occured'} };
                return;
            }
            if(_resp.data && _resp.data.success){
                let { form } = this.state;
                form.response = _resp.data.data.channels;
                this.setState({ form });
            }
        }catch(ex){
            Notification({
                show:true,
                data:ex ? (ex.response ?ex.response.data : ex) : "Exception ocurred"});
        } 
    }

    OnSelectChannel(channel){
        console.log("asadsd", channel)
        let { selectedChannel } = this.state;
        selectedChannel = channel;
        this.setState({ selectedChannel });
    }

    closePopup(){
        let { selectedChannel } = this.state;
        selectedChannel = {};
        this.setState({selectedChannel});

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
                                    <div className="col-md-4 col-sm-4 col-xs-12">
                                    <div className="card" style={{"height":"auto", "min-height":"auto"}}>
                                        <div className="row">
                                        <div className="col-md-4 col-sm-4" >
                                            <div className="channel_logo">
                                                {obj.logo_url &&  <img src={`${BASEURL}${obj.logo_url}`} />}
                                                {!obj.logo_url && <div className="blankImage">{obj.channel_name[0]}</div>}
                                                
                                            </div>
                                        </div>
                                        <div className="col-md-8 col-sm-8">
                                            <span style={{"cursor":"pointer", "color":"blue"}} onClick={this.OnSelectChannel.bind(this, obj)}>{obj.channel_name}</span>
                                            <small style={{display:"block", "color":"rgb(178 174 174)"}}>{obj.type} | {obj.platform}</small>
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