import { UPDATE_USER } from "../actions/user";
const initialState = null;

const userReducer = (state = initialState, action ) => {
    switch (action.type) {
        case UPDATE_USER:
            return Object.assign({},state,action.user);
        default:
            return state;
    }
}

export default userReducer;
