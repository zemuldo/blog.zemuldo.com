import React from 'react'
import {Button,Modal,Dropdown, Header,Icon, Image} from 'semantic-ui-react'
import BlogEditor from '../blogEditor/renderBlog'
import axios from 'axios'
import config from '../environments/conf'
const env = config[process.env.NODE_ENV] || 'development'
export default class WelcomePage extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            youLike:false,
            showDelete:false,
            userLoggedIn:false,
            likes:this.props.blogDetails?this.props.blogDetails.likes:0,
            authorAvatar:null,
            fbC:null,
            twtC:null,
            gplsC:null,
        }
        this.componentDidMount = this.componentDidMount.bind(this);
        this.updateLikes=this.updateLikes.bind(this)
        this.getAauthorAvatar = this.getAauthorAvatar.bind(this)
        this.closeDelete = this.closeDelete.bind(this)
        this.openDelete = this.openDelete.bind(this)
    }
    closeDelete(){
        this.setState({showDelete:false})
    }
    openDelete(){
        this.setState({showDelete:true})
    }
    setBlogCounts(){
        let gplusPost = {
            "method": "pos.plusones.get",
            "id": "p",
            "params": {
                "nolog": true,
                "id": "https://zemuldo/"+this.props.blogDetails.title.split(' ').join('-')+'_'+this.props.blogDetails.date.split(' ').join('-')+'_'+this.props.blogDetails.id.toString(),
                "source": "widget",
                "userId": "@viewer",
                "groupId": "@self"
            },
            "jsonrpc": "2.0",
            "key": "p",
            "apiVersion": "v1"
        }
        window.scrollTo(0,0);
        return Promise.all([
            axios.get('https://graph.facebook.com/?id=http://zemuldo.com/'+this.props.blogDetails.title.split(' ').join('%2520')+'_'+this.props.blogDetails.date.split(' ').join('%2520')+'_'+this.props.blogDetails.id.toString(),{}),
            axios.get('http://public.newsharecounts.com/count.json?url=http://zemuldo.com/'+this.props.blogDetails.title.split(' ').join('-')+'_'+this.props.blogDetails.date.split(' ').join('-')+'_'+this.props.blogDetails.id.toString(),{}),
            axios.post(' https://clients6.google.com/rpc',gplusPost),
        ])
            .then(function (res) {
                this.setState({
                    fbC:(res[0].data.share.share_count)? res[0].data.share.share_count:0,
                    twtC:(res[1].data.count)?res[1].data.count:0,
                    gplsC:(res[2].data.result.metadata.globalCounts.count)?res[2].data.result.metadata.globalCounts.count:0
                })
            }.bind(this))
            .catch(function (err) {
                this.setState({counts:{
                    fbC:0,
                    twtC:0,
                    gplsC:0
                }})
            }.bind(this))
    }

    getAauthorAvatar(){
        axios.post(env.httpURL,{
            "queryMethod":"getAvatar",
            "queryData":{
                "id":this.props.blogDetails.authorID
            }
        })
            .then(function (res) {
                if(!res){
                    return false
                }
                if(!res.data){
                    return false
                }
                if(res.data.imageURL){
                    this.setState({authorAvatar:JSON.parse(res.data.imageURL)})
                }
            }.bind(this))
            .catch(function (err) {

            })
    }
    componentDidMount() {
        if(this.props.blogDetails){
            this.getAauthorAvatar()
            this.setBlogCounts()
        }
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
                    if(!response.data){
                        this.setState({youLike:false})
                        return false
                    }
                    if(!response.data.state){
                        this.setState({youLike:false})
                        return false
                    }
                    if(response.data.state===false){
                        this.setState({youLike:false})
                        return false
                    }
                    if(response.data.state===true){
                        if(response.data.n){
                            this.setState({youLike:true})
                            return true
                        }
                        else {
                            return false
                        }
                    }
                }.bind(this))
                .catch(function (err) {
                    this.setState({youLike:false})
                    return false
                }.bind(this));
        }
    }
    fbShare () {
        let fbShareURL = 'https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fzemuldo.com%2F';
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
            let related = '&related=https%3A%2F%2Fpic.twitter.com/Ew9ZJJDPAR%2F'
            let url= '&url=https%3A%2F%2Fzemuldo.com/'+this.props.blogDetails.title.split(' ').join('-')+'_'+this.props.blogDetails.date.split(' ').join('-')+'_'+this.props.blogDetails.id.toString()
            let fullURL = url+related+hashTgs+via
            let shareURL = 'https://twitter.com/intent/tweet?text='+'pic.twitter.com/Ew9ZJJDPAR '+this.props.blogDetails.title+fullURL
            window.open(shareURL, 'sharer', 'toolbar=0,status=0,width=548,height=325');

        }
    }
    gplusShare () {
        window.open("https://plus.google.com/share?url="+'https://zemuldo.com/'+this.props.blogDetails.title.split(' ').join('-'),"","height=550,width=525,left=100,top=100,menubar=0");
        return false;
    }

    linkdnShare(){
        window.open('https://www.linkedin.com/cws/share?url=https%3A%2F%2Fzemuldo.com/'+this.props.blogDetails.title.split(' ').join('-')+'_'+this.props.blogDetails.id.toString(),"","height=550,width=525,left=100,top=100,menubar=0");
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
                        return
                    }
                    if(response.data.n){
                        if(response.data.n){
                            this.setState({likes:this.state.likes+1,youLike:true})
                        }
                    }
                }.bind(this))
                .catch(function (err) {
                }.bind(this));
        }

    }
    deletBlog=(id)=>{
        if(localStorage.getItem('user')){
            return axios.post(env.httpURL, {
                "queryMethod":"deleteBlog",
                "queryData":{
                    id:id
                }
            })
                .then(function (response) {
                    this.closeDelete()
                    this.props.deletedBlog()
                }.bind(this))
                .catch(function (err) {
                    this.closeDelete()
                }.bind(this));
        }

    }
    render() {
        return (
            <div>
                <Modal dimmer={true} open={this.state.showDelete}>
                    <Modal.Header>This Post will be deleted</Modal.Header>
                    <Modal.Content image>
                        <Modal.Description>
                            <Header style={{ textAlign :'left',alignment:'center'}} color={this.props.color} as='h1'>
                                {
                                    this.props.blogDetails.title
                                }
                            </Header>
                            <span className="info">
                                   Published on:
                                   <br/>
                                {this.props.blogDetails.date}
                               </span>
                            <br/>
                            <br/>
                            <span className="info">
                                    {this.props.blogDetails.author} {' '}
                                </span>
                            <div style={{margin: '2em 0em 3em 0em',fontSize:"16px",fontFamily:"georgia"}}>
                                <br/>
                                <BlogEditor body={this.props.blog.body}/>
                            </div>
                        </Modal.Description>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color='black' onClick={()=>this.closeDelete()}>
                            Cancel
                        </Button>
                        <Button color='red' positive icon='checkmark' labelPosition='right' content="Delete" onClick={()=>this.deletBlog(this.props.blogDetails.id)} />
                    </Modal.Actions>
                </Modal>
                {
                    this.props.blogDetails && this.props.blogLoaded?
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
                                    <span style={{color:this.props.color}}>
                                        {' '}{this.state.likes}
                                    </span>
                                </span>
                                <br/>
                                <Icon size="large" color='green' name='external share' />
                                Share this on: {  }
                                {'  '}
                                <Button
                                    onClick={() => {this.tweetShare();}}
                                    circular color='twitter' icon='twitter' />
                                <sup>{this.state.twtC}</sup>
                                {'   '}
                                <Button
                                    onClick={() => {this.fbShare();}}
                                    circular color='facebook' icon='facebook' />
                                <sup>{this.state.fbC}</sup>
                                {'   '}
                                <Button
                                    onClick={() => {this.linkdnShare();}}
                                    circular color='linkedin' icon='linkedin' />
                                <sup>{this.state.gplsC}</sup>
                                {'   '}
                                <Button
                                    onClick={() => {this.gplusShare();}}
                                    circular color='google plus' icon='google plus' />
                                <sup>{this.state.gplsC}</sup>
                                <br/>
                                <br/>
                                <span>
                                    {
                                        this.state.authorAvatar ?

                                            <Image
                                                floated="left"
                                                avatar={true}
                                                id="photo"
                                                size='tiny'
                                                src={this.state.authorAvatar.img}
                                                style={{
                                                    borderRadius: `${(Math.min(
                                                        this.state.authorAvatar.height,
                                                        this.state.authorAvatar.width
                                                        ) +
                                                        10) *
                                                    this.state.authorAvatar.borderRadius / 2 / 100}px`
                                                }}
                                            /> :
                                            <span>
                                            </span>
                                    }
                                </span>
                               <span className="info">
                                   Published on:
                                   <br/>
                                   {this.props.blogDetails.date}
                               </span>
                                <br/>
                                <br/>
                                <span className="info">
                                    {this.props.blogDetails.author} {' '}
                                </span>
                                {
                                    // this.props.user.userName === this.props.blogDetails.userName?
                                    //     <div>
                                    //         <Dropdown text='Manage' pointing className='link item info'>
                                    //             <Dropdown.Menu>
                                    //                 <Dropdown.Item color='red' onClick={()=>this.openDelete()}>Delete</Dropdown.Item>
                                    //                 <Dropdown.Item>Edit</Dropdown.Item>
                                    //                 <Dropdown.Item>Hide</Dropdown.Item>
                                    //             </Dropdown.Menu>
                                    //         </Dropdown>
                                    //     </div>:
                                    //     <span>
                                    //     </span>
                                }
                            </div>
                            <hr color="green"/>
                            <div style={{margin: '2em 0em 3em 0em',fontSize:"16px",fontFamily:"georgia"}}>
                                <br/>
                                <BlogEditor body={this.props.blog.body}/>
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
