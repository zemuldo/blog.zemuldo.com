import React from 'react'
import {Header, Grid } from 'semantic-ui-react'
import EditorsForm from './editorsForm'
import Welcome from '../partials/welCome'
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
            posts:null,
            post:null
        };
        this.componentDidMount=this.componentDidMount.bind(this)
        this.componentWillUnmount=this.componentWillUnmount.bind(this)

    }
    resize = () => this.forceUpdate();
    componentDidMount() {
        window.addEventListener('resize', this.resize)
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
                                    <div>
                                        Good Stuff will be here
                                    </div>
                                </Grid.Column>:
                                <div></div>
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