import React, { Component } from 'react'; 
import { withRouter, Link } from 'react-router-dom';
import { Axios_Instance } from '../utils/axiosInterceptor';
import { ROUTES} from '../config/routes';
import { checkAuthorization, getUserDetails } from '../utils';
import {Notification} from '../utils';
import ApartmentDetails from './subComponents/apartment-details';
import { connect } from 'react-redux';
import { ACTION_TYPES } from '../utils/actions';

class BuildingDetails extends Component {
    constructor(){
        super(); 
        this.state = {
            user:{},
            wishTitle : 'Good Morning',
            details:{},
            selectedFloor:null
        };
        this._hideFloorDetails = this._hideFloorDetails.bind(this)
    }

    componentDidMount(){
        checkAuthorization(this.props);
        let details = getUserDetails();
        this.setState({user:details});
        let buildingId = this.props.match.params.b_id;
        if(!buildingId) {
            alert('Invalid building id');
            return;
        }
        this.fetchBuildingDetails(buildingId);
        
    };
     

    async fetchBuildingDetails(b_id){
        try{
            let { details} = this.state;
            let _resp = await Axios_Instance.get(`${ROUTES.building_details}`.replace(':b_id',b_id));
            if(!_resp && !_resp.data){_resp = {data:{success:false, msg:'Unexpected erro occured'} };}
            details = _resp.data.data[0];
            this.setState({details});
        }catch(ex){
            Notification({
                show:true,
                data:ex.response ?ex.response.data : ex});
            }
        
    }

    _showFloorDetails(floor, k){
        if(floor){
            let { selectedFloor } = this.state;
            selectedFloor = floor;
            this.setState({selectedFloor});
            this.props.selectFloor(floor);
        }
    };

    _hideFloorDetails(){
        let {selectedFloor} = this.state;
        selectedFloor = null;
        this.setState({selectedFloor});
    }

  render() {
        if(!Object.keys(this.state.details).length) return ('Loading...')
            return (
                <div className="main-container" style={{'paddingTop':'0px'}}>
                <div className="container">
                    <div className="img_section">
                        <img src="../assets/images/default_banner.jpg" alt="banner_img" />
                        <div className="bannerOverTitle" >
                            <span style={{'textTransform':'capitalize', 'marginBottom':'0px'}}>{this.state.details.name || 'Unnamed Building'}</span> 
                            <span> &nbsp;({this.state.details.b_id || '--'})</span>
                        </div>
                        
                    </div>
                    

                    <div className="card">
                        <div className="row">
                            <div className="col-md-3 col-sm-3">
                                <label>Building Address</label>
                                <p>{this.state.details.address.address1},  
                                 {this.state.details.address.address2},  
                                 {this.state.details.address.pincode},  
                                 {this.state.details.address.country}</p>
                            </div>
                            <div className="col-md-3 col-sm-3">
                                <label>Registered Owner</label>
                                <p>{this.state.details.registered_owner_name || 'No Registered Owner'}</p>
                            </div>
                            <div className="col-md-3 col-sm-3">
                                <label>No. of Floors</label>
                                <p>{this.state.details.total_floors}</p>
                            </div>
                            <div className="col-md-3 col-sm-3">
                                <label>No. of Apartments</label>
                                <p>{this.state.details.total_apartments}</p>
                            </div>
                        </div> 
                    </div>
                    <div className="">
                        <h5>Floor Details</h5>
                        <div className="row">
                            <div className="col-md-12 col-sm-12">
                                <div className="row">
                                    {this.state.details.floors.map((floor, k)=>
                                        
                                            <div className="col-md-3 col-sm-3 col-xs-12" key={k}>
                                                <div className={`card ${this.state.selectedFloor && this.state.selectedFloor._id === floor._id ? 'dark_card':''}`}>
                                                    <h5 className="theme-color">Floor {floor.floor_no}</h5>
                                                    <small>Active Apartments/Rooms: {floor.apartments || 0}</small>
                                                    <p className="pull-right"> 
                                                        <span className="theme-color cursor" onClick={this._showFloorDetails.bind(this, floor, k)}><i className="icon-arrow-right-circle icons"></i></span>
                                                    </p>
                                                </div>
                                            </div>
                                    )}
                                </div>
                            </div>
                            {this.state.selectedFloor &&  <ApartmentDetails {...this.state} hideWindow={this._hideFloorDetails}/>} 
                        </div>
                    </div>
                </div>
                 
                </div>
            );
    }
  
}
const mapDispatchToProps = (dispatch)=>{
    return{
      'selectFloor':(data)=>dispatch({'type':ACTION_TYPES.SELECTED_FLOORS,data})
    }
  }

export default connect(null,mapDispatchToProps)(withRouter(BuildingDetails));