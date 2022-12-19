import React, { Component } from 'react'; 
import { withRouter,Link } from 'react-router-dom';
import {CONFIGS} from '../../config';
import { Axios_Instance, Ax } from '../../utils/axiosInterceptor';
import { BASEURL, ROUTES} from '../../config/routes';
import {Notification, getUserDetails} from '../../utils';

class Header extends Component {
    constructor(){
        super(); 
        this.state = {
            "channels":[],
            "selectedChannel":"",
            "userDetails":{},
            "showSearch":false,
            "query":"",
            "search_results":[],
        }
    }

    componentDidMount(){

        let urlName = window.location.pathname;
        
        let { selectedChannel, userDetails } = this.state;
        userDetails = getUserDetails();
        if((urlName != '/' && urlName != '/signin' && urlName != '/signup') || Object.keys(userDetails).length > 0) this.fetchChannels();
        let selected = localStorage.getItem("selItem");
        selectedChannel = selected;
        this.setState({ selectedChannel, userDetails });
    }

    _logout(){
        localStorage.removeItem(CONFIGS.uLocal);
        this.props.history.push('/');
    }

    onChangeChannel(e){
        let { selectedChannel } = this.state;
        selectedChannel = e.target.value;
        localStorage.setItem("selItem", selectedChannel);
        this.setState({ selectedChannel }); 
    }
    SearchChange(e){
        let { query } = this.state;
        query = e.target.value;
        this.setState({ query });
        this.searchChannel();
    }
    toggleSearch(){
        let { showSearch } = this.state;
        showSearch = !showSearch;
        this.setState({ showSearch });
    }

    async fetchChannels(){
        try{
            let _resp = await Axios_Instance.get(`${ROUTES.fetch_channels}`);
            if(!_resp){
                return;
            }
            if(_resp &&_resp.data && _resp.data.success){
                
                let { channels, selectedChannel } = this.state;
                let data = _resp.data.data.channels;
                channels = data; 
                localStorage.setItem("selItem", channels.length ? channels[0].id : []);
                sessionStorage.setItem("channels", JSON.stringify(channels));
                this.setState({ channels });
            }
        }catch(ex){console.log("sdp")
            Notification({
                show:true,
                data:ex.response ?ex.response.data : ex});
        } 
    }

    async searchChannel(){
        try{
            let { query } = this.state;
            let _resp = await Axios_Instance.get(`${ROUTES.search_channel}?q=${query}`);
            if(!_resp){
                _resp = {data:{success:false, msg:'Unexpected error occured'} };
                return;
            }
            if(_resp.data && _resp.data.success){
                let { search_results } = this.state;
                search_results = _resp.data.data.results;
                this.setState({ search_results });
            }
        }catch(ex){
            Notification({
                show:true,
                data:{success:false, msg:ex ? (ex.response ?ex.response.data : ex) : "Exception ocurred"}});
        } 
    }

    async addToWatchlist(obj){
        try{
            let reqData = {"channel_id":obj.id};
            let _resp = await Axios_Instance.post(`${ROUTES.add_watchlist}`, reqData );
            if(!_resp){
                _resp = {data:{success:false, msg:'Unexpected error occured'} };
                return;
            }
            if(_resp.data && _resp.data.success){
                alert(_resp.data.message);
            }
        }catch(ex){
            Notification({
                show:true,
                data:{success:false, msg:ex ? (ex.response ?ex.response.data : ex) : "Exception ocurred"}});
        } 
    }

    redirectURL(url){
        window.open(url, "_blank");
    }

render() {
    let urlName = window.location.pathname;
    if(urlName === '/' || urlName === '/signin' || urlName === '/signup') return null;
    return (
        <div className="header-wrap">
        <div className="container"> 
            <div className="row"> 
            <div className="col-md-3 col-sm-3 col-xs-6">
               <h4 style={{"margin":"0px"}}><Link to={"/dashboard"}><img src={"./assets/images/logo.png"} alt="thePuerta"/></Link></h4>
            </div> 
            <div className="col-md-6 col-sm-6 col-xs-6">
                     {this.state.showSearch &&
                        <div style={{position:"relative"}}> 
                             <input type="search" name="query" autoComplete="off" className="form-control" onChange={this.SearchChange.bind(this)} placeholder="Search Channel" style={{"width":"60%", "float":"right"}}  />

                            {this.state.search_results.length > 0 && 
                                <div className="search_results">
                                   {this.state.search_results.map((obj, k)=>
                                    <div className="EachSearchResult" key={k}>
                                        {obj.logo_url && <img src={`${BASEURL}${obj.logo_url}`} style={{"width":"50px", "height":"50px","float":"left","objectFit":"contain"}} />}
                                        {!obj.logo_url && <div className="blankImage" style={{"width":"50px", "height":"50px", "float":"left", "fontSize":"25px"}}>{obj.channel_name[0]}</div>}
                                        <div className="SearchRow">
                                            <p style={{"fontSize":"12px", "color":"#145391"}}><span onClick={this.redirectURL.bind(this, obj.channel_url)} className="theme-color" style={{"cursor":"pointer"}}>{obj.channel_name || '--'}</span></p>
                                            <p style={{"fontSize":"10px"}}>{obj.type || '--'} | {obj.platform || '--'}</p>
                                            <p style={{"fontSize":"10px"}}>
                                                {obj.added_watchlist === 1 && 
                                                    <span className="search_link" >Added To Watchlist</span>
                                                }
                                                {obj.added_watchlist === 0 && 
                                                    <span className="search_link" onClick={this.addToWatchlist.bind(this, obj)}>Add To Watchlist</span>
                                                } </p>
                                        </div>
                                    </div>
                                   )}
                                </div>
                            }
                             
                        </div>
                    }
            </div>
            <div className="col-md-3 col-sm-3 col-xs-6">
                <div className="pull-right">
                    {this.state.userDetails.user_type === 1 &&
                         <select style={{"border":"none",  "background":'none'}} value={this.state.selectedChannel} name="channels" onChange={this.onChangeChannel.bind(this)}>
                         {this.state.channels.map((obj, k)=>
                             <option key={k} value={obj.id}>{obj.channel_name}</option>
                         )}
                         
                     </select>
                    }
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <i className="icon-magnifier icons" style={{"cursor":"pointer", "marginRight":"20px"}} onClick={this.toggleSearch.bind(this)}></i> 
                    &nbsp;&nbsp;&nbsp;&nbsp;

                    <div className="dropdown">
                        <span className="dropbtn"> <i className="icon-user icons"></i></span>
                            <div className="dropdown-content">
                            {this.state.userDetails.user_type === 1 && <a href="/feeds" >&nbsp;Your Feeds</a>}
                            {this.state.userDetails.user_type === 1 && <a href="/events" >&nbsp;Your Events</a>}
                            {this.state.userDetails.user_type === 1 &&   <a href="/channels" >&nbsp;Your Channels</a>}
                                <a href="/watchlists" >&nbsp;Your Watchlists</a>
                                <a href="javascript:void" onClick={this._logout.bind(this)}>&nbsp;Logout</a>
                            </div>
                        </div>
                </div>
            </div>
            </div>
        </div>
        </div>
    );
    }
  
}

export default withRouter(Header);