import React from 'react'
import {Loader,Input,Header, Icon, Grid } from 'semantic-ui-react'
import EditorsForm from './editorsForm'
import Topics from '../partials/topics'
import Blogs from '../posts/blog'
import Welcome from '../homePage/welCome'
/*
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
            user:this.props.user,
            createNew:false,
        };
        this.componentDidMount=this.componentDidMount.bind(this)
        this.componentWillUnmount=this.componentWillUnmount.bind(this)

    }
    componentDidMount() {
    }
    componentWillUnmount() {
    }
    render() {
        return (
            <Grid celled>
                <Grid.Row>
                    <Grid.Column  width={16}>
                        <Header color='green' as='h1'>
                            Draft an article on the fly.
                        </Header>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column  width={4}>
                        {
                            (window.innerWidth>600) ?
                                <Grid.Column  width={4}>
                                    <Topics blogsAreLoading={this.blogsAreLoading} setTopicPosts={this.setTopicPosts} onReadMore = {this.onReadMore} blog ={this.state.blog} color={this.props.color} blogs={this.state.blogs}/>
                                    <div style={{ float: 'left', margin: '2em 3em 3em 2em'}}>
                                        <Header style={{marginLeft:'10px'}} color='blue' as='h3'>Search for it</Header>
                                        <Input
                                            icon={<Icon name='search' inverted circular link />}
                                            placeholder='Search...'
                                            onChange={this.handleFilterChange}
                                        />
                                        <Header  color={this.props.colors[2]} as='h2'>Posted by You</Header>
                                        {
                                            this.state.blogsLoaded?
                                                <div>
                                                    {
                                                        (this.state.blogs[0]) ?
                                                            <Blogs color={this.props.color} onReadMore = {this.onReadMore} blogs ={this.state.blogs} blog ={this.state.blog}/>:
                                                            <div>
                                                                No matching content on this Topic
                                                            </div>
                                                    }
                                                </div>:
                                                <div style={{ position:'center', margin: '4em 0em 0em 0em'}} >
                                                    <Loader active inline='centered' />
                                                </div>
                                        }
                                    </div>
                                </Grid.Column>:
                                <p>Hello</p>
                        }
                    </Grid.Column>
                    <Grid.Column  width={9}>
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
                    <Grid.Column  width={3}>
                        <div>
                            I will give you some more stuff here
                        </div>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }
}


export default RichEditorExample