import React from 'react'
import {Header,Loader} from 'semantic-ui-react'
import Blog from '../posts/blog'
/*import config from '../environments/conf'
const env = config[process.env.NODE_ENV] || 'development'*/
export default class WelcomePage extends React.Component {
    constructor(props){
        super(props)
        this.state = {
        }
        this.componentDidMount = this.componentDidMount.bind(this);
    }
    componentDidMount() {

    }
    fbShare () {
        let fbShareURL = 'https://www.facebook.com/sharer/sharer.php?u=http%3A%2F%2Fzemuldo.com%2F';
        if(this.props.blogDetails){
            let postURL = this.props.blogDetails.title.split(' ').join('%2520')+'_'+this.props.blogDetails.date.split(' ').join('%2520')+'_'+this.props.blogDetails.id.toString()
            let shareURL = fbShareURL+postURL+"&amp;src=sdkpreparse'"
            window.open(shareURL, 'sharer', 'toolbar=0,status=0,width=548,height=325');

        }
    }
    tweetShare () {
        if(this.props.blogDetails){
            let hashTgs = '%2F&hashtags='+this.props.blogDetails.topics.join(',')
            let via = '&via=zemuldo'
            let related = '&related=http%3A%2F%2Fpic.twitter.com/Ew9ZJJDPAR%2F'
            let url= '&url=http%3A%2F%2Fzemuldo.com/'+this.props.blogDetails.title.split(' ').join('-')+'_'+this.props.blogDetails.date.split(' ').join('-')+'_'+this.props.blogDetails.id.toString()
            let fullURL = url+related+hashTgs+via
            let shareURL = 'https://twitter.com/intent/tweet?text='+'pic.twitter.com/Ew9ZJJDPAR '+this.props.blogDetails.title+fullURL
            window.open(shareURL, 'sharer', 'toolbar=0,status=0,width=548,height=325');

        }
    }
    gplusShare () {
        window.open("https://plus.google.com/share?url="+'http://zemuldo.com/'+this.props.blogDetails.title.split(' ').join('-'),"","height=550,width=525,left=100,top=100,menubar=0");
        return false;
    }

    linkdnShare(){
        window.open('https://www.linkedin.com/cws/share?url=http%3A%2F%2Fzemuldo.com/'+this.props.blogDetails.title.split(' ').join('-')+'_'+this.props.blogDetails.id.toString(),"","height=550,width=525,left=100,top=100,menubar=0");
    }

    render() {
        return (
            <div>
                {
                    !this.props.blogLoaded?
                        <div style={{ left: '50%', position: 'fixed', bottom: '50%', zIndex: -1 }}>
                            <Loader active inline='centered' />
                        </div>:
                        <div style={{margin: '2em 1em 3em 1em'}}>
                            {
                                (!this.props.blog || !this.props.blogDetails || !this.props.blogDetails.title) ?
                                    <div>
                                        <div >
                                            <Header color={this.props.color} as='h1'>
                                                Great Articles and Blogs
                                            </Header>
                                            <hr color="green"/>
                                            <div style={{fontSize:"16px",fontFamily:"georgia", padding: '0em 0em 2em 1em'}}>
                                                <p>
                                                    Here you find great articles on tech related topics.
                                                    Your reading defines your growth and personal development. Read on Business, Technology, reviews plus more.
                                                    You can signup and share your content with us. Become part of us.
                                                </p>
                                            </div>
                                        </div>
                                    </div>:
                                    <div>
                                        <Blog
                                            blogLoaded={this.props.blogLoaded}
                                            blog={this.props.blog}
                                            color={this.props.color}
                                            blogDetails={this.props.blogDetails}
                                            counts ={this.props.counts}
                                            deletedBlog={this.props.deletedBlog}
                                            user={this.props.user}
                                        />
                                    </div>
                            }
                        </div>
                }

            </div>
        )
    }
}
