import React from 'react'
import {Header, Loader} from 'semantic-ui-react'
import GridBlogs from '../posts/gridBlogs'
import Blog from '../posts/blog'
import {connect} from "react-redux";
import UserBlogs from "./userBlogs";

/*import config from '../environments/conf'
const env = config[process.env.NODE_ENV] || 'development'*/
class WelcomePage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
        this.componentDidMount = this.componentDidMount.bind(this);
    }

    componentDidMount() {

    }

    fbShare() {
        let fbShareURL = 'https://www.facebook.com/sharer/sharer.php?u=http%3A%2F%2Fzemuldo.com%2F';
        if (this.props.blogDetails) {
            let postURL = this.props.blogDetails.title.split(' ').join('%2520') + '_' + this.props.blogDetails.date.split(' ').join('%2520') + '_' + this.props.blogDetails.id.toString()
            let shareURL = fbShareURL + postURL + "&amp;src=sdkpreparse'"
            window.open(shareURL, 'sharer', 'toolbar=0,status=0,width=548,height=325');

        }
    }

    tweetShare() {
        if (this.props.blogDetails) {
            let hashTgs = '%2F&hashtags=' + this.props.blogDetails.topics.join(',')
            let via = '&via=zemuldo'
            let related = '&related=http%3A%2F%2Fpic.twitter.com/Ew9ZJJDPAR%2F'
            let url = '&url=http%3A%2F%2Fzemuldo.com/' + this.props.blogDetails.title.split(' ').join('-') + '_' + this.props.blogDetails.date.split(' ').join('-') + '_' + this.props.blogDetails.id.toString()
            let fullURL = url + related + hashTgs + via
            let shareURL = 'https://twitter.com/intent/tweet?text=' + 'pic.twitter.com/Ew9ZJJDPAR ' + this.props.blogDetails.title + fullURL
            window.open(shareURL, 'sharer', 'toolbar=0,status=0,width=548,height=325');

        }
    }

    gplusShare() {
        window.open("https://plus.google.com/share?url=" + 'http://zemuldo.com/' + this.props.blogDetails.title.split(' ').join('-'), "", "height=550,width=525,left=100,top=100,menubar=0");
        return false;
    }

    linkdnShare() {
        window.open('https://www.linkedin.com/cws/share?url=http%3A%2F%2Fzemuldo.com/' + this.props.blogDetails.title.split(' ').join('-') + '_' + this.props.blogDetails.id.toString(), "", "height=550,width=525,left=100,top=100,menubar=0");
    }

    render() {
        return (
            <div>
                {
                    this.props.blog.id ?
                        <div>Blog</div> :
                        <UserBlogs
                            x={this.props.x}
                            next={this.props.next}
                            setPreviousBlogs={this.props.setPreviousBlogs}
                            setNextBlogs={this.props.setNextBlogs}
                            onReadMore={this.props.onReadMore}
                            color={this.props.vars.color}
                        />
                }
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        blogs: state.blogs,
        blog: state.blog,
        vars: state.vars
    }
}

export default connect(mapStateToProps)(WelcomePage);