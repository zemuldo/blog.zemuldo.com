import _ from 'lodash'
import React,{Component} from 'react'
import { Container, Divider, Dropdown, Grid, Header, Icon, Image, List, Menu, Segment } from 'semantic-ui-react'


class SingleRead extends Component {
    constructor(props){
        super(props);
        this.state = {
            blog:{},
            logged:false
        };
    };
    render(){
        return(<div>
            <div style={{ float: 'right', margin: '0em 3em 1em 0em' }}>
                <Menu icon='labeled' vertical color='green'>
                    <Menu.Header>
                        <Menu.Item>
                            <Icon name="share" color='orange'/>
                            Share
                        </Menu.Item>
                    </Menu.Header>
                    <Menu.Item>
                        <Icon color='blue' name='twitter' />
                    </Menu.Item>

                    <Menu.Item >
                        <Icon color='violet' name='facebook' />
                    </Menu.Item>

                    <Menu.Item>
                        <Icon color='blue' name='linkedin' />
                    </Menu.Item>
                    <Menu.Item>
                        <Icon color='orange' name='google plus official' />
                    </Menu.Item>
                    <Menu.Item>
                        <Icon color='red' name='mail' />
                    </Menu.Item>
                </Menu>
            </div>
            <Container text style={{ marginTop: '2em' }}>
                <Header color='green' as='h1'>{
                    this.state.blog[0].title
                }</Header>
                <p>
                    Published on {new Date().toDateString()} by {' Zemuldo'}
                </p>
                <hr color="green"/>
                <p>This example shows how to use lazy loaded images, a sticky menu, and a simple text container</p>
            </Container>

            <Container text>
                { _.times(3, i => <p key={i}>
                    {
                        this.state.blog[0].body
                    }
                </p>) }
            </Container>


        </div>)
    }
}
export default SingleRead