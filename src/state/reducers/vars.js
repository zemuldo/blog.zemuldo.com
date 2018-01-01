import { UPDATE_VARS } from "../actions/vars";
const vars = {
    user: null,
    iKnowYou: false,
    visitorInfo: null,
    geoAllowed: false,
    createNew: false,
    editingMode: false,
    colors: ['green', 'blue', 'orange', 'violet', 'blue', 'orange'],
    color:'green',
    currentLocation: 'home',
    profilePic: null,
    blogsLoaded: false,
    blogsAreLoading: true,
    homePageIsLoading: true,
    blogDetails: null,
    richViewerState: null,
    blogLoaded: false,
    homePageLoaded: false,
    loadFooter: false,
    topic: 'all',
    time: new Date().toDateString(),
    signUp:false,
    test:1
};

const varsReducer = (state = vars, action ) => {
    switch (action.type) {
        case UPDATE_VARS:
            return Object.assign({},state,action.vars);
        default:
            return state;
    }
}

export default varsReducer;