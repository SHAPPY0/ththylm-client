import React, { Component } from 'react'; 

class GoogleAds extends Component {
    constructor(){
        super(); 
        this.state = {
        }
    }

    componentDidMount() {
        (window.adsbygoogle = window.adsbygoogle || []).push({})
    }
  

  render() {
            return (
                <div>
                     <ins className = "adsbygoogle"
                            style = { {display:"inline-block",width:"728px",height:"90px"} }
                            data-ad-client = "ca-pub-2265244547050578"
                            data-ad-slot = "42837282224"></ins>
                </div>
            );
    }
  
}

export default GoogleAds;