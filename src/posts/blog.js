import React from 'react'
import {Button, Header,Icon,Grid, Image} from 'semantic-ui-react'
import BlogEditor from '../blogEditor/renderBlog'
import axios from 'axios'
import config from '../environments/conf'
const env = config[process.env.NODE_ENV] || 'development'
export default class WelcomePage extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            youLike:false,
            userLoggedIn:false,
            likes:this.props.blogDetails?this.props.blogDetails.likes:0
        }
        this.componentDidMount = this.componentDidMount.bind(this);
        this.updateLikes=this.updateLikes.bind(this)
    }
    componentDidMount() {
        this.setState({youLike:true})
        if(localStorage.getItem('user')){
            this.setState({userLoggedIn:true})
            axios.post(env.httpURL, {
                "queryMethod":"getLike",
                "queryData":{
                    postID:this.props.blogDetails.id,
                    title:this.props.blogDetails.title,
                    userID:JSON.parse(localStorage.getItem('user')).id
                }
            })
                .then(function (response) {
                    console.log(response)
                    if(!response.data){
                        this.setState({youLike:false})
                        return
                    }
                    if(!response.data.state){
                        this.setState({youLike:false})
                        return
                    }
                    if(response.data.state===false){
                        this.setState({youLike:false})
                        console.log(response.data)
                        return
                    }
                    if(response.data.state===true){
                        if(response.data.n){
                            this.setState({youLike:true})
                        }
                    }
                }.bind(this))
                .catch(function (err) {
                    console.log(err)
                }.bind(this));
        }
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
    updateLikes=(id)=>{
        if(localStorage.getItem('user')){
            return axios.post(env.httpURL, {
                "queryMethod":"updateBlogLikes",
                "queryData":{
                    id:id,
                    title:this.props.blogDetails.title,
                    userID:JSON.parse(localStorage.getItem('user')).id
                }
            })
                .then(function (response) {
                    if(response.data.state===false){
                        console.log(response.data)
                        return
                    }
                    if(response.data.n){
                        if(response.data.n){
                            this.setState({likes:this.state.likes+1,youLike:true})
                        }
                    }
                }.bind(this))
                .catch(function (err) {
                    console.log(err)
                }.bind(this));
        }

    }
    render() {
        return (
            <div>
                {
                    this.props.blogDetails?
                        <div>
                            <Header style={{ textAlign :'left',alignment:'center'}} color={this.props.color} as='h1'>
                                {
                                    this.props.blogDetails.title
                                }
                            </Header>
                            <div className="shareIcon clearElem" style={{display:'block',fontSize:"16px",fontFamily:"georgia"}}>
                                {
                                    this.state.userLoggedIn?
                                        <span>
                                            {
                                                this.state.youLike?
                                                    <Icon color={this.props.color} name ="like"/>:
                                                    <button onClick={()=>this.updateLikes(this.props.blogDetails.id)}>
                                                        <Icon color='green' name="thumbs up"/>
                                                    </button>
                                            }
                                        </span>:
                                        <span>
                                            Likes: 
                                        </span>
                                }

                                <span>
                                    <i style={{color:this.props.color}}>
                                        ~{' '}{this.state.likes}
                                    </i>
                                </span>
                                <br/>
                                <Icon size="large" color='green' name='external share' />
                                Share this on: {  }
                                {'  '}
                                <Button
                                    onClick={() => {this.tweetShare();}}
                                    circular color='twitter' icon='twitter' />
                                <sup>{this.props.counts.twtC}</sup>
                                {'   '}
                                <Button
                                    onClick={() => {this.fbShare();}}
                                    circular color='facebook' icon='facebook' />
                                <sup>{this.props.counts.fbC}</sup>
                                {'   '}
                                <Button
                                    onClick={() => {this.linkdnShare();}}
                                    circular color='linkedin' icon='linkedin' />
                                <sup>{this.props.counts.gplsC}</sup>
                                {'   '}
                                <Button
                                    onClick={() => {this.gplusShare();}}
                                    circular color='google plus' icon='google plus' />
                                <sup>{this.props.counts.gplsC}</sup>
                                <br/>
                                <br/>
                                Published on:  {this.props.blogDetails.date}  By {this.props.blogDetails.author}
                            </div>
                            <hr color="green"/>
                            <div style={{margin: '2em 0em 3em 0em',fontSize:"16px",fontFamily:"georgia"}}>
                                <br/>
                                <BlogEditor body={this.props.richViewerState}/>
                            </div>
                        </div>:
                        <div>
                            Content not found!
                        </div>
                }
            </div>
        )
    }
}
