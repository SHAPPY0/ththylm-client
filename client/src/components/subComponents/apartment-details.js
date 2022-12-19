import React, { Component } from 'react'; 
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';

class ApartmentDetails extends Component {
    constructor(){
        super(); 
        this.state = {
            details:[],
            buildingName:'',
            b_id:'',
            selectedApartmentId:0,
            selectedApartment:{}
        }
    }

    componentDidMount(){
        let { selectedFloor } = this.props;
        let { details, buildingName, b_id } = this.state;
        if(selectedFloor){
            buildingName = selectedFloor.name;
            b_id = selectedFloor.building_id;
            details = selectedFloor.details || [];
            this.setState({details,buildingName,b_id});
        }
    }; 
 
    _selectApartment(k){
        let { selectedApartmentId} = this.state;
        selectedApartmentId = k;
        this.setState({selectedApartmentId});
    }

    _apartmentDetailsSection(){
        return(
            <div className="aprtmnt_section">Details</div>
        )
    }

    _closeApartmentWindow(){
        this.props.hideWindow();
    }
    _openFloorDetails(k){

    }

  render() {
            if(!this.state.details.length){return('Loading...')}
            let _selectedFloor = this.props.selFloor;
            this.state.details = _selectedFloor.details;
            let f_id = _selectedFloor._id;
            return (
                <div className="">
                            <div className="col-md-12 col-sm-12 col-xs-12">
                                <h5>Apartment Details {this.state.buildingName}</h5>
                                    <div className="panel-group" id="accordion">
                                        {this.state.details.map((apartment,k)=>
                                            <>
                                            <div className="panel panel-default">
                                                <div className="panel-heading">
                                                    <h4 className="panel-title" onClick={this._selectApartment.bind(this, k)}>
                                                        <a data-toggle="collapse" data-parent="#accordion" href={`#${k}`}>
                                                            Apartment No. {apartment.apartment_no}</a>
                                                    </h4>
                                                </div>
                                                <div id={k} className={`panel-collapse collapse ${this.state.selectedApartmentId === k ? 'in' : ''}`}>
                                                    <div className="panel-body">
                                                        <div className="row">
                                                            <div className="col-md-9 col-sm-9">
                                                                    <div className="row">
                                                                    <div className="col-md-4 col-sm-4">
                                                                        <p className="theme-color">Apartment/Room Type</p>{apartment.type}
                                                                    </div>
                                                                    <div className="col-md-4 col-sm-4">
                                                                        <p className="theme-color"><i className="fa fa-rupee"></i> Monthly Rent</p>{apartment.rent_amount}/-
                                                                    </div>
                                                                    <div className="col-md-4 col-sm-4">
                                                                        <p className="theme-color"><i className="fa fa-lock"></i> Security Amount</p>{apartment.security_amount}/-
                                                                    </div>
                                                                    
                                                                </div>
                                                                <div className="row">
                                                                    <div className="col-md-4 col-sm-4">
                                                                        <p className="theme-color"><i className="fa fa-bath"></i> Maintenance Charges</p>{apartment.maintenance_charges || '--'}/-
                                                                    </div>
                                                                    <div className="col-md-4 col-sm-4">
                                                                        <p className="theme-color"><i className="fa fa-rupee"></i> Gas Charges</p>{apartment.gas_charges}/-
                                                                    </div>
                                                                    <div className="col-md-4 col-sm-4">
                                                                        <p className="theme-color">Electricity Charges</p>{apartment.electricity_charges || 0} per unit
                                                                    </div>
                                                                    
                                                                </div>
                                                                <div className="row">
                                                                    <div className="col-md-4 col-sm-4">
                                                                        <p className="theme-color">Water Charges Monthly</p>{apartment.water_charges}/-
                                                                    </div>
                                                                    <div className="col-md-4 col-sm-4">
                                                                        <p className="theme-color">Is Vacant</p>{apartment.is_vacant ? 'Yes':'No'}
                                                                    </div>
                                                                    <div className="col-md-4 col-sm-4">
                                                                        <p className="theme-color">Tenants Allowed</p>{apartment.tenants_allowed}
                                                                    </div>
                                                                    
                                                                </div>
                                                            </div>
                                                            <div className="col-md-3 col-sm-3">
                                                                <ul className="action_btns-area">
                                                                    <li><Link to={`/building/${this.state.b_id  }/${f_id}/${apartment._id}`} className="btn btn-outline-primary">MANAGE TENANTS</Link></li>
                                                                    <li><button className="btn btn-outline-primary">MANAGE RENTS</button></li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>  
                                                    
                                            </>
                                            )}
                                    </div>
                            </div>
                        </div>
            );
    }
}

const mapStateToProps = (state)=>{
    return{
      'selFloor':state.floor
    }
  }
export default connect(mapStateToProps)(withRouter(ApartmentDetails));