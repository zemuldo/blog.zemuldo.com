import {UPDATE_TOPICS} from "../actions/topics";

const initialState = [];

const blogsReducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_TOPICS:
            return [
                ...state.concat(action.topics)
            ];
        default:
            return state;
    }
}

export default blogsReducer;
