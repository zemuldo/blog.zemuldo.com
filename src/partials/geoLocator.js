import React from 'react';
import {geolocated} from 'react-geolocated';
import config from '../environments/conf'
const env = config[process.env.NODE_ENV] || 'development'
class Demo extends React.Component {
    componentDidMount() {
        if(!sessionStorage.getItem("location")){
            !this.props.isGeolocationEnabled ?
                sessionStorage.setItem("location",'unsuported'):
                sessionStorage.setItem("location",{lat:this.props.latitude,lon:this.props.longitude})
        }

    }
    componentWillUnmount() {
    }
    render() {
        return(
            <div>

            </div>
        )
    }
}

export default geolocated({
    positionOptions: {
        enableHighAccuracy: false,
    },
    userDecisionTimeout: 5000,
})(Demo);