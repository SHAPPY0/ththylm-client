import React, { Component } from 'react'; 
import { withRouter, Link } from 'react-router-dom';
import { Axios_Instance } from '../utils/axiosInterceptor';
import { ROUTES} from '../config/routes';
import { checkAuthorization, getUserDetails } from '../utils';
import {Notification} from '../utils';
import ApartmentDetails from './subComponents/apartment-details';
import { connect } from 'react-redux';
import { ACTION_TYPES } from '../utils/actions';

class ManageTenants extends Component {
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
                <>
                    <div className="main-container" style={{'paddingTop':'0px'}}>
                        <div className="container">
                            <h4 className="page-title">
                                <p style={{'textTransform':'capitalize'}}>Sundat Farm Hours-Floor 1-Apartment 201</p>
                            </h4>
                        </div>
                        <div className="container">
                            <div className="card">
                                <ul class="nav nav-tabs">
                                    <li class="active"><a data-toggle="tab" href="#active_tenants">Active Tenants</a></li>
                                    <li><a data-toggle="tab" href="#add_tenants">Add Tenants</a></li>
                                    <li><a data-toggle="tab" href="#Ex_tenants">Ex Tenants</a></li>
                                </ul>

                                    <div class="tab-content">
                                    <div id="active_tenants" class="tab-pane fade in active">
                                        <h5>Active Tenants</h5>
                                        <p>Some content.</p>
                                    </div>
                                    <div id="add_tenants" class="tab-pane fade">
                                        <h5>Onboard New Tenants</h5>
                                        <p>Some content in menu 1.</p>
                                    </div>
                                    <div id="Ex_tenants" class="tab-pane fade">
                                        <h3>Ex_tenants 2</h3>
                                        <p>Some content in menu 2.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            );
    }
  
}
const mapDispatchToProps = (dispatch)=>{
    return{
      'selectFloor':(data)=>dispatch({'type':ACTION_TYPES.SELECTED_FLOORS,data})
    }
  }

export default connect(null,mapDispatchToProps)(withRouter(ManageTenants));