import React, { Component } from 'react'; 
import { withRouter } from 'react-router-dom';
import { Axios_Instance} from '../utils/axiosInterceptor';
import { BASEURL, ROUTES} from '../config/routes';
import { checkAuthorization, getUserDetails, 
        FormatDate, GetStatusByDateTime, 
        Notification,DateDiffFormat, 
        GetCacheSelectedChannel, GetCacheChannels } from '../utils';

class Dashboard extends Component {
    constructor(){
        super(); 
        this.state = {
            user:{},
            wishTitle : 'Good Morning',
            feeds:{"today":[], "upcoming":[],"completed":[]},
            feed:"",
            feed_posts:[],
            selectedChannel:{}
        }
    }

    async componentDidMount(){
        await checkAuthorization(this.props);
        this.setWishTitle();
        let details = getUserDetails();
        this.setState({user:details});
        this.findSelectedChannel();
        this.fetchFeedPosts();
        this.fetchFeeds();
    };

    setWishTitle(){
        let {wishTitle} = this.state;
        let currentDate = new Date();
        let currentTime = currentDate.toString().split(' ')[4]; 
        let timeSegments = currentTime.split(':');
        if(timeSegments >= '12'){
            wishTitle = 'Good After Noon';
        }
        if(timeSegments >= '17'){
            wishTitle = 'Good Evening';
        }
        this.setState({wishTitle});
    }; 

    findSelectedChannel(){
        let { selectedChannel } = this.state;
        // selectedChannel = {};
        let selectedId = GetCacheSelectedChannel();
        let channels = GetCacheChannels();
        if(channels && channels.length){
            selectedChannel = channels.find(obj => obj.id == selectedId);
            this.setState({ selectedChannel });
        } 
        
    };

    async fetchFeeds(){
        try{
            let _resp = await Axios_Instance.get(`${ROUTES.event_feeds}`);
            if(!_resp){
                _resp = {data:{success:false, msg:'Unexpected error occured'} };
                return;
            }
            if(_resp.data && _resp.data.success){
                let { feeds } = this.state;
                let data = _resp.data.data.events;
                let obj = {"today":[], "upcoming":[]};
                for(let i = 0; i < data.length; i++){
                    let s_dt = data[i].start_time;
                    let e_e_dt = data[i].expected_end_time;
                    let cur_date = new Date().setHours(0,0,0,0);
                    if(new Date(s_dt).setHours(0,0,0,0) <= cur_date && new Date(e_e_dt).setHours(0,0,0,0) >= cur_date){
                        let _status = GetStatusByDateTime(data[i].start_time, data[i].expected_end_time);
                        data[i].status = _status;
                        obj.today.push(data[i])
                    }else{
                        obj.upcoming.push(data[i]);
                    } 
                }
                feeds = obj;
                this.setState({ feeds });
            }
        }catch(ex){
            Notification({
                show:true,
                data:{success:false, msg:ex ? (ex.response ?ex.response.data : ex) : "Exception ocurred"}});
        } 
    }
 
    OnFeedFieldChange(e){
        let { feed } = this.state;
        feed = e.target.value;
        this.setState({ feed });
    }

    async fetchFeedPosts(){
        try{
            let _resp = await Axios_Instance.get(`${ROUTES.fetch_feeds}` );
            
            if(_resp && _resp.data && _resp.data.success){
                let { feed_posts } = this.state;
                feed_posts = _resp.data.data.feeds;
                this.setState({feed_posts});
            }
        }catch(ex){
            Notification({
                show:true,
                data:{success:false, msg:ex ? (ex.response ?ex.response.data : ex) : "Exception ocurred"}});
        } 
    };
    
    async PostFeed(){
        let { feed, selectedChannel } = this.state;
        if(!feed){
            Notification({
                show:true,
                data:{success:false, msg:"Nothing to post"}});
            return;
        };
        if(!selectedChannel.id){
            Notification({
                show:true,
                data:{success:false, msg:"Something went wrong! Please try again"}});
            return;
        }
        let reqBody  = {
                "feed":feed, 
                "channel_id":selectedChannel.id, 
                "type":"text"
            };
        try{
            let _resp = await Axios_Instance.post(`${ROUTES.post_feed}`,reqBody );
            
            if(_resp && _resp.data && _resp.data.success){
                Notification({
                    show:true,
                    data:{success:true, msg:"Post added successfully"}});
                this.fetchFeedPosts();
                
            }
        }catch(ex){
            Notification({
                show:true,
                data:{success:false, msg:ex ? (ex.response ?ex.response.data : ex) : "Exception ocurred"}});
        }         
    }

    redirectUrl(url){
        window.open(url.String, "_blank")
    }
    createMarkup(text){
        return {_html: text}
    }
  render() {
            return (
                <div className="main-container">
                    <div className="container">
                        <h4 className="page-title">
                            <p style={{'textTransform':'capitalize'}}>{this.state.wishTitle}! {this.state.user.first_name || 'Guest'}</p>
                        </h4> 
                        <div className="row">
                            <div className="col-md-6 col-sm-6">
                                <h6 className="theme-color"><b>Feeds</b></h6>
                                {(this.state.user.user_type === 1 || this.state.user.user_type === 3)&& <>
                                    <textarea rows="2" className="form-control" name="feed" placeholder="Write to share..." onChange={this.OnFeedFieldChange.bind(this)}></textarea>
                                    <div style={{"float":"right", "marginTop":"5px"}}>
                                        <span style={{"marginRight":"10px"}}>
                                            {!Object.keys(this.state.selectedChannel).length && <small style={{"color":"#f48989"}}>*Please add channel first! </small>}
                                            {Object.keys(this.state.selectedChannel).length > 0 && <small style={{"color":"rgb(131 140 150)"}}>Posting as <b>{this.state.selectedChannel.channel_name || '--'}</b></small>}
                                        </span>
                                        <button className="btn btn-primary" onClick={this.PostFeed.bind(this)} disabled={Object.keys(this.state.selectedChannel).length === 0}>POST</button>
                                    </div>
                                </>}

                                <div className="feedPosts">
                                    {this.state.feed_posts.map((obj, k)=>
                                        <div className="card eachFeedPost" key={k}>
                                            <div className="channelName">
                                                {obj.logo_url && <img src={`${BASEURL}${obj.logo_url}`} alt={obj.channel_name} />}
                                                {!obj.logo_url && <div className="blankLogo">{obj.channel_name[0]}</div>}
                                                
                                                <p>{obj.channel_name}</p>
                                            </div>
                                            <div style={{"clear":"both","marginTop":"20px"}}>
                                                <p dangerouslySetInnerHTML={{"__html": obj.feed}}></p>
                                                <small style={{fontSize:"10px", color:"#9fa2a4"}}>{DateDiffFormat(obj.created_at) || '--'}</small>
                                            </div>
                                        </div>
                                    )}
                                    {this.state.feed_posts.length === 0 &&
                                        <div style={{"textAlign":"center", "padding":"20px", "color":"#b0acac"}}>No New Feeds</div>
                                    }
                                </div>
                            </div>
                            <div className="col-md-6 col-sm-6 borderLeft" >
                                <h6 className="theme-color"><b>Events</b></h6>
                                <div>
                                    <div className="">
                                        <p style={{"color":"#838c90"}}><b>Today</b></p>
                                        <div>
                                            <div className="row">
                                                {this.state.feeds.today.map((obj, k)=>
                                                    <div className="col-sm-6 col-md-6" key={k}>
                                                        <div className="card">
                                                            <div className="LiveCard">
                                                                {obj.thumbnail && <img src={`${BASEURL}${obj.thumbnail}`} className="live_img" alt={obj.title}/>}
                                                                {!obj.thumbnail && <div style={{"height":"150px","width":"100%", "background":"#ccc","paddingTop":"25%", "color":"#96999c", "textAlign":"center"}}>No Thumbnail</div>}
                                                                
                                                                <p className="live_title" title={obj.title}>{obj.title.substring(0,27) || '--'}{obj.title.length > 27 &&<span>...</span>}</p>
                                                                <p style={{"fontSize":"11px", "color":"#828b92"}}>{obj.channel_name || '--'}</p>
                                                                <p style={{"fontSize":"10px"}}><span>{FormatDate(obj.start_time) || '--'}</span> - <span>{FormatDate(obj.expected_end_time) || '--'}</span> </p>
                                                                <div> 
                                                                    {obj.status === 'Running' &&  <button className="btn" style={{"fontSize":"10px"}} onClick={this.redirectUrl.bind(this, obj.url)}>Join Now</button>}
                                                                    {obj.status === 'Upcoming' &&  <span className="StatusWidget">Not Started Yet</span>}
                                                                    {obj.status === 'Ended' &&  <span className="StatusWidget">End</span>}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                                {this.state.feeds.today.length === 0 &&
                                                    <p style={{"textAlign":"center", "padding":"20px", "color":"#b0acac"}}>No Events For Today</p>
                                                }
                                                
                                            </div>
                                        </div>
                                        <p style={{"color":"#838c90"}}><b>Upcoming</b></p>
                                        <div>
                                            <div className="row">
                                                {this.state.feeds.upcoming.map((obj, k)=>
                                                    <div className="col-sm-6 col-md-6" key={k}>
                                                        <div className="card">
                                                            <div className="LiveCard">
                                                                {obj.thumbnail && <img src={`${BASEURL}${obj.thumbnail}`} className="live_img" alt={obj.channel_name}/>}
                                                                {!obj.thumbnail && <div style={{"height":"150px","width":"100%", "background":"#ccc","paddingTop":"25%", "color":"#96999c", "textAlign":"center"}}>No Thumbnail</div>}
                                                                <p className="live_title">{obj.title || '--'}</p>
                                                                <p style={{"fontSize":"11px"}}>{obj.channel_name || '--'}</p>
                                                                <p style={{"fontSize":"10px"}}><span>{FormatDate(obj.start_time) || '--'}</span> - <span>{FormatDate(obj.expected_end_time) || '--'}</span> </p>
                                                                 
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                                {this.state.feeds.upcoming.length === 0 &&
                                                    <p style={{"textAlign":"center", "padding":"20px", "color":"#b0acac"}}>No Upcomig Events</p>
                                                }
                                            </div>
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

export default withRouter(Dashboard);