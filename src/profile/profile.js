import React from 'react'
import axios from 'axios'
import {Header,Loader, Grid,Image } from 'semantic-ui-react'
import EditorsForm from './editorsForm'
import Welcome from '../partials/welCome'
import Blogs from '../posts/blogs'
import config from '../environments/conf'
const env = config[process.env.NODE_ENV] || 'development'
/*import config from '../environments/conf'
const env = config[process.env.NODE_ENV] || 'development'

const cats = {
    Development:'dev',
    Business:'business',
    Technology:'tech'
}
*/

class RichEditorExample extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user:this.props.currentUser,
            createNew:false,
            blogs:null,
            blog:null,
            blogsLoaded:false,
            blogLoaded:false,
            blogIsLoading:false,
        };
        this.componentDidMount=this.componentDidMount.bind(this)
        this.componentWillUnmount=this.componentWillUnmount.bind(this)
        this.blogsAreLoading = this.blogsAreLoading.bind(this);
        this.blogIsLoading = this.blogIsLoading.bind(this);

    }
    blogsAreLoading(state){
        this.setState({blogsLoaded:!state})
    }
    blogIsLoading(state){
        this.setState({blogLoaded:!state})
    }
    resize = () => this.forceUpdate();
    componentDidMount() {
        this.blogsAreLoading(true);
        window.addEventListener('resize', this.resize)
        return axios.post(env.httpURL, {
            "queryMethod":"getPosts",
            "queryData":{
                userName:this.state.user.userName
            }
        })
            .then(function (response) {
                if(response.data[0]){
                    this.setState({blogs:response.data})
                    this.blogsAreLoading(false);
                }
                else {
                    this.setState({blogs:[]});
                    this.blogsAreLoading(false);
                }
                console.log(this.state.blogs)
            }.bind(this))
            .catch(function (err) {
                console.log(err)
                this.setState({blogs:[]});
                this.blogsAreLoading(false)
            }.bind(this))
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.resize)
    }
    render() {
        return (
            <div style={{padding: '1em'}}>
                <Grid>
                    <Grid.Row>
                        <Grid.Column  width={16}>
                            <div>
                                <Header color='green' as='h1' >
                                    Welcome to your dashboard.
                                </Header>
                            </div>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        {
                            (window.innerWidth>600)?
                                <Grid.Column  width={3}>
                                    <Header color='green' as='h3' >
                                        Published by you
                                    </Header>
                                    <div>
                                        {
                                            this.state.blogsLoaded?
                                              <div>
                                                  {
                                                      this.state.blogs[0]?
                                                          <Blogs
                                                              color={this.props.color}
                                                              onReadMore = {this.onReadMore}
                                                              blogs ={this.state.blogs}
                                                              blog ={this.state.blog}/>:
                                                          <div>
                                                              You haven't published anything yet
                                                          </div>
                                                  }
                                              </div>:
                                                <div style={{ position:'center', margin: '2em 0em 0em 0em'}} >
                                                    <Loader active inline='centered' />
                                                </div>
                                        }

                                    </div>
                                </Grid.Column>:
                                <div>

                                </div>
                        }
                        {
                            window.innerWidth>600?
                                <Grid.Column  width={10}>
                                    {
                                        this.props.createNew?
                                            <EditorsForm
                                                currentUser={this.props.currentUser}
                                                _goToEditor = {this.props._goToEditor}
                                                _exitEditMode={this.props._exitEditMode}
                                                editingMode = {this.props.editingMode}
                                                onFinishClick={this.onFinishClick}
                                                handleUTAChange={this.handleUTAChange}
                                                handleCategoryChange={this.handleCategoryChange}
                                                handleTopicChange={this.handleTopicChange} />:
                                            <Welcome color={this.props.color} blog = {null}/>
                                    }
                                </Grid.Column>:
                                <Grid.Column  width={16}>
                                    {
                                        this.props.createNew?
                                            <EditorsForm
                                                currentUser={this.props.currentUser}
                                                _goToEditor = {this.props._goToEditor}
                                                _exitEditMode={this.props._exitEditMode}
                                                editingMode = {this.props.editingMode}
                                                onFinishClick={this.onFinishClick}
                                                handleUTAChange={this.handleUTAChange}
                                                handleCategoryChange={this.handleCategoryChange}
                                                handleTopicChange={this.handleTopicChange} />:
                                            <Welcome color={this.props.color} blog = {null}/>
                                    }
                                </Grid.Column>
                        }
                        {
                            (window.innerWidth>600)?
                                <Grid.Column  width={3}>
                                    <div>
                                        I will give you some more stuff here
                                    </div>
                                </Grid.Column>:
                                <div>

                                </div>
                        }

                    </Grid.Row>
                </Grid>
            </div>
        );
    }
}


export default RichEditorExample