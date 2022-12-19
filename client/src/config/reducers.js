import { act } from 'react-dom/test-utils';
import { ACTION_TYPES} from '../utils/actions';

const isState={
    notification:{'show':false,'data':{}},
    floor:{}
};

const reducer = (state=isState,action)=>{
    switch(action.type){
        case ACTION_TYPES.TOGGLE_NOTIFICATION:
            return{
                ...state,
                notification : {show:action.show,data:action.data}
            }
        case ACTION_TYPES.SELECTED_FLOORS:
            return{
                ...state,
                floor : action.data
            }
        default:
            return state;
    }
};

export default reducer;