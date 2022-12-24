import React, { Component } from 'react'; 

class Feedback extends Component {
    constructor(){ 
        super();
        this.state = {
            form:{}
        };
    }

    _onFormFieldChange(e){
        let { form } = this.state;
        form[e.target.name] = e.target.value;
        this.setState( { form });
    }

    submitFeedback(){
        
    }

  render() {
    return (
        <div className="main-container">
            <div className="container">
                <h5><b>Feedback</b></h5>
                
                <div className="card">
                    <div className="row">
                        <div className="col-md-4 col-sm-4">
                            <div className="form-group">
                                <div className="input-wrap has-float-label">
                                    <input type="text" name="email" className="form-control" min="1" onChange={this._onFormFieldChange.bind(this)}/>
                                    <span>Email*</span>
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="input-wrap has-float-label">
                                <textarea rows="2" className="form-control" name="feedback" onChange={this._onFormFieldChange.bind(this)}></textarea>
                                <span>Feedback*</span>
                                </div>
                            </div>
                            <div className="form-group">
                                <button className="btn btn-primary" onClick={this.submitFeedback.bind(this)} >Submit</button>
                            </div>
                        </div>
                        <div className="col-md-8 col-sm-8"></div>
                    </div>
                </div>
            </div>
        </div>
    );
    }
  
}

export default Feedback;