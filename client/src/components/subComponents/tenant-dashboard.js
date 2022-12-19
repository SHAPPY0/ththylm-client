import React, { Component } from 'react'; 
import { withRouter,Link } from 'react-router-dom';
import { Axios_Instance } from '../../utils/axiosInterceptor';
import { BASEURL, ROUTES} from '../../config/routes';
import { checkAuthorization, getUserDetails } from '../../utils';
import { BUILDING_REQ_VALIDATOR } from '../../utils/validators';
import {Notification} from '../../utils';
import Axios from 'axios';

class TenantDashboard extends Component {
    constructor(){
        super(); 
        this.state = {
            buildings:[]
        }
    }

    componentDidMount(){
        checkAuthorization(this.props); 
        this.fetchBuildings();
        
    }; 

    _redirectTo(){
        this.props.history.push('/add-building');
    };

    async fetchBuildings(){
        try{
            let { buildings} = this.state;
            let _resp = await Axios_Instance.get(`${ROUTES.add_building}`);
            if(!_resp && !_resp.data){_resp = {data:{success:false, msg:'Unexpected erro occured'} };}
            buildings = _resp.data.data;
            this.setState({buildings});
        }catch(ex){
            Notification({
                show:true,
                data:ex.response ?ex.response.data : ex});
            }
        
    }

  render() {
            return (
                 <><p>Tenant</p>
                    <div className="row">
                        {this.state.buildings.map((b,k)=>
                            <div className="col-md-3 col-sm-4 col-xs-6" key={k}>
                            <div className="card">
                                <div className="card-body">
                                    <i className="icon-home icons card_icon"></i>
                                     <h5><Link to={`/building/${b.b_id}`}>{b.name || '--'}</Link></h5>
                                     <small><span className="theme-color">Building ID:</span> {b.b_id || '--'} <span className="copy_bId cursor normal_txt"><i className="fa fa-clone"></i></span></small>
                                     <div className="row normal_txt">
                                        <div className="col-md-6 col-sm-6">
                                            <p>Floors: <span>{b.total_floors || 0}</span></p>
                                        </div>
                                        <div className="col-md-6 col-sm-6">
                                            <p>Apartments: <span>{b.total_apartments || 0}</span></p>
                                        </div>
                                     </div>
                                </div>
                            </div>
                            </div>
                        )}
                        {!this.state.buildings.length && (
                            <p className="none-txt">Building not joined yet!</p>
                        )}
                    </div>
                
                <div className="add_btn cursor" title="Add building" onClick={this._redirectTo.bind(this)}><span className="add_btn_inner">+</span></div>
                </>
            );
    }
  
}

export default withRouter(TenantDashboard);