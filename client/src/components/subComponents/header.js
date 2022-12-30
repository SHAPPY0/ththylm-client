import React, { Component } from 'react'; 
import { withRouter,Link } from 'react-router-dom';
import {CONFIGS} from '../../config';
import { Axios_Instance } from '../../utils/axiosInterceptor';
import { BASEURL, ROUTES} from '../../config/routes';
import {Notification, getUserDetails, GetCacheSelectedChannel, GetCacheChannels, SetCacheSelectedChannel} from '../../utils';

class Header extends Component {
    constructor(){
        super(); 
        this.state = {
            "channels":[],
            "selectedChannel":"",
            "userDetails":{},
            "showSearch":true,
            "query":"",
            "search_results":[],
            "search_found":false,
            "show_search_panel":false
        }
    }

    componentDidMount(){
        let urlName = window.location.pathname;
        let { selectedChannel, userDetails, channels } = this.state;
        userDetails = getUserDetails();
        let selected = GetCacheSelectedChannel();
        let channelsList = GetCacheChannels();
        if(!channelsList || (channelsList && !channelsList.length)){
            if(((urlName !== '/' && urlName !== '/signin' && urlName !== '/signup') || Object.keys(userDetails).length > 0 )) this.fetchChannels();
        }else{
            channels = channelsList;
            this.setState({ channels });
        }
        selectedChannel = selected;
        this.setState({ selectedChannel, userDetails });
    }

    _logout(){
        let { channels } = this.state;
        channels = [];
        this.setState({channels});
        localStorage.removeItem(CONFIGS.uLocal);
        localStorage.removeItem("selItem");
        sessionStorage.removeItem("channels");
        this.props.history.push('/');
    }

    onChangeChannel(e){
        let { selectedChannel } = this.state;
        selectedChannel = e.target.value;
        SetCacheSelectedChannel(selectedChannel);
        this.setState({ selectedChannel }); 
    }
    SearchChange(e){
        let { query, show_search_panel } = this.state;
        query = e.target.value;
        show_search_panel = true;
        this.setState({ query, show_search_panel });
        this.searchChannel(query);
    }
    toggleSearch(){
        let { showSearch } = this.state;
        showSearch = !showSearch;
        this.setState({ showSearch });
    }

    async fetchChannels(){
        try{
            let _resp = await Axios_Instance.get(`${ROUTES.fetch_channels}`).catch(ex=>{
                Notification({
                    show: true,
                    data:{success: false, msg:ex.response.data.error || "something went wrong"}
                  });
            });
            if(!_resp){
                return;
            }
            if(_resp &&_resp.data && _resp.data.success){
                let { channels } = this.state;
                let data = _resp.data.data.channels;
                channels = data; 
                SetCacheSelectedChannel(channels.length ? channels[0].id : "");
                sessionStorage.setItem("channels", JSON.stringify(channels));
                this.props.setChannelsList(channels);
                this.setState({ channels });
            }
        }catch(ex){
            Notification({
                show:true,
                data:ex.response ?ex.response.data : ex});
        } 
    }

    async searchChannel(q){
        try{
            if(!q){
                let { search_results } = this.state;
                search_results = [];
                this.setState({ search_results });
                return;
            } 
            let _resp = await Axios_Instance.get(`${ROUTES.search_channel}?q=${q}`).catch(ex=>{
                Notification({
                    show: true,
                    data:{success: false, msg:ex.response.data.error || "something went wrong"}
                  });
            });
            if(!_resp){
                _resp = {data:{success:false, msg:'Unexpected error occured'} };
                return;
            }
            if(_resp.data && _resp.data.success){
                let { search_results, search_found } = this.state;
                search_results = _resp.data.data.results;
                search_found = search_results.length ? true : false;
                this.setState({ search_results, search_found });
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
            let _resp = await Axios_Instance.post(`${ROUTES.add_watchlist}`, reqData ).catch(ex=>{
                Notification({
                    show: true,
                    data:{success: false, msg:ex.response.data.error || "something went wrong"}
                  });
            });
            if(!_resp){
                _resp = {data:{success:false, msg:'Unexpected error occured'} };
                return;
            }
            if(_resp.data && _resp.data.success){
                Notification({
                    show: true,
                    data:{success: true, msg:_resp.data.message || "Channel added successfully"}
                  });
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
            <div className="col-md-3 col-sm-3 col-xs-12">
               <h4 style={{"margin":"0px"}}><Link to={"/dashboard"}><img src={"./assets/images/logo.png"} alt="theHylm"/></Link></h4>
            </div> 
            <div className="col-md-6 col-sm-6 col-xs-12">
                     {this.state.showSearch &&
                        <div className="search_bar"> 
                             <input type="search" name="query" autoComplete="off" className="form-control" onChange={this.SearchChange.bind(this)} placeholder="Search Channel" style={{"width":"100%", "paddingLeft":"32px"}}  />
                             <i className="icon-magnifier icons searchIcon"></i>

                            {this.state.search_results.length > 0 && 
                                <div className="search_results">
                                   {this.state.search_results.map((obj, k)=>
                                    <div className="EachSearchResult" key={k}>
                                        {obj.logo_url && <img src={`${BASEURL}${obj.logo_url}`} alt={obj.channel_name[0]} style={{"width":"50px", "height":"50px","float":"left","objectFit":"contain","borderRadius":"50%"}} />}
                                        {!obj.logo_url && <div className="blankImage" style={{"width":"50px", "height":"50px", "float":"left", "fontSize":"25px"}}>{obj.channel_name[0]}</div>}
                                        <div className="SearchRow">
                                            <p style={{"fontSize":"12px", "color":"#145391"}}><span onClick={this.redirectURL.bind(this, obj.channel_url)} className="theme-color" style={{"cursor":"pointer"}}>{obj.channel_name || '--'}</span>  <span className="badge cbadge">{obj.watchers || 0}</span></p>
                                            <p style={{"fontSize":"10px"}}>{obj.type || '--'} | {obj.platform || '--'}</p>
                                            <p style={{"fontSize":"10px"}}>
                                                {obj.added_watchlist === 1 && 
                                                    <span className="search_link" style={{"color":"rgb(52 166 71)"}}><i className="icon-check icons"></i> Added To Watchlist</span>
                                                }
                                                {obj.added_watchlist === 0 && 
                                                    <span className="search_link"  onClick={this.addToWatchlist.bind(this, obj)}>Add To Watchlist</span>
                                                } </p>
                                        </div>
                                    </div>
                                   )}
                                   
                                </div>
                            }
                            {this.state.search_results.length === 0 && !this.state.search_found && this.state.show_search_panel &&
                                <div className="search_results" style={{"minHeight":"90px", "height":"90px"}}>
                                    <p style={{"textAlign":"center", "padding":"20px 0px", "color":"#ccc"}}>No Result Found</p>
                                </div>
                            
                            }
                        
                             
                        </div>
                    }
            </div>
            <div className="col-md-3 col-sm-3 col-xs-6">
                <div className="pull-right" style={{"padding":"7px"}}>
                    {(this.state.userDetails.user_type === 1 || this.state.userDetails.user_type === 3) &&
                         <select style={{"border":"none",  "background":'none'}} value={this.state.selectedChannel || ""} name="channels" onChange={this.onChangeChannel.bind(this)}>
                         {this.state.channels.map((obj, k)=>
                             <option key={k} value={obj.id || ""}>{obj.channel_name || "--"}</option>
                         )}
                         
                     </select>
                    }
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    
                    &nbsp;&nbsp;&nbsp;&nbsp;

                    <div className="dropdown">
                        <span className="dropbtn"> <i className="icon-user icons"></i></span>
                            <div className="dropdown-content">
                            {(this.state.userDetails.user_type === 1 || this.state.userDetails.user_type === 3) && <a href="/feeds" >&nbsp;Your Feeds</a>}
                            {(this.state.userDetails.user_type === 1 || this.state.userDetails.user_type === 3) && <a href="/events" >&nbsp;Your Events</a>}
                            {(this.state.userDetails.user_type === 1 || this.state.userDetails.user_type === 3) &&   <a href="/channels" >&nbsp;Your Channels</a>}
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