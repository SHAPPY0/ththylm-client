import React, { Component } from 'react'; 
import { Link } from 'react-router-dom';

class Footer extends Component {
    constructor(){ 
        super();
    }

  render() {
    return (
        <div className="footer">
            <div className="container">
            <div className="row">
                <div className="col-md-6 col-sm-6 col-xs-12">
                    <ul className="footer_links">
                        <li><Link to="/how-it-works">How it works</Link></li>
                        <li><Link to="/privacy">Privacy</Link></li>
                        <li><Link to="/feedback">Feedback</Link></li>
                    </ul>
                </div>
                <div className="col-md-6 col-sm-6 col-xs-12" style={{"textAlign":"right", "fontSize":"10px"}}>
                    copyrights &copy; 2023
                </div>
            </div>
            </div>
        </div>
    );
    }
  
}

export default Footer;