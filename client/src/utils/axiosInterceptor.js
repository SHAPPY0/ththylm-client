import axios from 'axios';
import { BASEURL } from '../config/routes';
import {CONFIGS} from  '../config';
import {Notification} from './index';

let instance = axios.create({
    baseURL: BASEURL
  });

  instance.interceptors.request.use((req) => {
    req.headers = {  'Authorization': 'Bearer ' + localStorage.getItem("_uToken")};
    return req
  }, error => {
    return console.log('Error in req interceptor:',error);
  });

  instance.interceptors.response.use((res) => {
    return res;
  }, (err)=>{
    if(err && err.response){
      if(err.response.status === 401){
        Notification({
          show:true,
          data:{success:false, msg:err ? (err.response ? (err.response.statusText === 'Unauthorized' ? "Session expired, Please login again" : err.response.data.error) : "Please login again"): "Session expired, Please login again!"}
        });
        localStorage.removeItem(CONFIGS.uLocal);
        window.location = '/';
      }else{
        return Promise.reject(err);
      }
    }
  });

  export const Axios_Instance = instance;
  export const Axios = axios;