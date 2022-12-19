export const SIGNUP_REQ_VALIDATOR = (req)=>{
    let _error = {is_error:false, msg:''};
    if(!req) _error = {is_error:true, msg:'Please fill required details'}
    if(!req.hasOwnProperty('first_name') || !req['first_name']) _error = {is_error:true, msg:'First name is required'};
    if(!req.hasOwnProperty('email') || !req['email']) _error = {is_error:true, msg:'Email is required'};
    if(!req.hasOwnProperty('password') || !req['password']) _error = {is_error:true, msg:'Password is required'};
    if(!req.hasOwnProperty('cnfpassword') || !req['cnfpassword']) _error = {is_error:true, msg:'Repeat Password is required'};
    if(req['password'] != req['cnfpassword']) _error = {is_error:true, msg:'Password & Repeat password not matched'};
    if(!req.hasOwnProperty('user_type') || !req['user_type']) _error = {is_error:true, msg:'User Type is required'};
    
    return _error;
};

export const CHANNEL_REQ_VALIDATOR = (req)=>{
    let _error = {is_error:false, msg:''};
    if(!req) _error = {is_error:true, msg:'Please fill required details'}
    if(!req.hasOwnProperty('type') || !req['type']) _error = {is_error:true, msg:'Type is required'};
    if(!req.hasOwnProperty('platform') || !req['platform']) _error = {is_error:true, msg:'Platform is required'};
    if(!req.hasOwnProperty('channel_name') || !req['channel_name']) _error = {is_error:true, msg:'Channel Name is required'};
    if(!req.hasOwnProperty('channel_url') || !req['channel_url']) _error = {is_error:true, msg:'Channel url is required'};
    return _error;
}

export const EVENT_REQ_VALIDATOR = (req)=>{
    let _error = {is_error:false, msg:''};
    if(!req) _error = {is_error:true, msg:'Please fill required details'}
    if(!req.hasOwnProperty('type') || !req['type']) _error = {is_error:true, msg:'Type is required'};
    if(!req.hasOwnProperty('title') || !req['title']) _error = {is_error:true, msg:'Title is required'};
    if(!req.hasOwnProperty('start_time') || !req['start_time']) _error = {is_error:true, msg:'Start Time is required'};
    if(!req.hasOwnProperty('expected_end_time') || !req['expected_end_time']) _error = {is_error:true, msg:'Expected End Time is required'};
    return _error;
}