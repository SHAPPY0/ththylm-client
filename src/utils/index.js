import Store from '../store';
import { ACTION_TYPES } from './actions';
import { CONFIGS } from "../config";
import decode from 'jwt-decode';
import moment from 'moment';

export const Notification = (data)=>{
    Store.dispatch({ type:ACTION_TYPES.TOGGLE_NOTIFICATION, ...data});
};

export const  checkAuthorization = async (props)=>{
    let isAuth = false;
    let token = localStorage.getItem(CONFIGS.uLocal);
    if(token && token.length > 100) isAuth = true;
    if(!isAuth){
        props.history.push('/');
        return;
    } 
};

export const getUserDetails = ()=>{
    let token = localStorage.getItem(CONFIGS.uLocal);
    let userDetails = {};
    if(token && token.length > 100){
        userDetails = decode(token);
    };
    return userDetails;
}

export const FormatDate = (date)=>{
    if(!date) return date;
    let d = new Date(date);
    let year = d.getFullYear();
    let month = (d.getMonth()+1) < 10 ? '0'+(d.getMonth()+1) : d.getMonth()+1;
    let _date = d.getDate() < 10 ? '0'+d.getDate() : d.getDate();
    let hour = d.getHours() < 10 ? '0'+d.getHours() :d.getHours();
    let minute = d.getMinutes() < 10 ? '0'+d.getMinutes() :d.getMinutes();

    return `${year}/${month}/${_date}, ${hour}:${minute}`;
}

export const DateDiffFormat = (datetime)=>{
    // let t = moment.utc(datetime).toDate();
    // let tt = moment(t).format('YYYY-MM-DD HH:mm:ss');
    // console.log("tt", datetime)
    // console.log(t, ",", tt,",",moment(datetime).fromNow())
    if(!datetime) return;

    let d = Math.abs(new Date(datetime).getTime() - new Date().getTime())/1000;
    let res = {};
    let VALUES = {
        'year':31536000,
        'month':2592000,
        'week':604800,
        'day':86400,
        'hour':3600,
        'minute':60,
        'second':1
    };

    Object.keys(VALUES).forEach((key)=>{
        res[key] = Math.floor(d/VALUES[key]);
        d -= res[key] * VALUES[key];
    }); console.log("res", res)
    if(res.year) return `${res.year} Years ago` 
    else if(res.month) return `${res.month} Months ago`
    else if(res.week) return `${res.week} Weeks ago`
    else if(res.day) return `${res.day} Days ago`
    else if(res.hour) return `${res.hour} Hours ago`
    else if(res.minute) return `${res.minute} Minutes ago`
    else if(res.second) return `${res.second} Seconds ago`
}

export const GetStatusByDateTime = (startTime, endTime) => {
    if(!startTime) return startTime;
    if(!endTime) return endTime;
    if(new Date(startTime).setHours(0,0,0,0) <= new Date().setHours(0,0,0,0)){
        if(new Date(endTime).setHours(0,0,0,0) >= new Date().setHours(0,0,0,0)){
            if(new Date(startTime) <= new Date() ){
                if(new Date(endTime) >= new Date()){
                    return "Running";
                }else{
                    return "Ended";
                }
            }else{
                return "Upcoming";
            }
        }else{
            return "Ended";
        }
    }else{
        return "Upcoming";
    }
}