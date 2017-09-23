import _ from 'lodash'
import React,{Component} from 'react'
import { Container, Divider, Dropdown, Grid, Header, Icon, Image, List, Menu, Segment } from 'semantic-ui-react'
import config from '../environments/conf'
const env = config[process.env.NODE_ENV] || 'development'
class SingleRead extends Component {
    constructor(props){
        super(props);
        this.state = {
            blog:[
                {
                    title:'What is BlockChain?',
                    author:'Danstan',
                    body:'[\n' +
                    '            \'Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum \',\n' +
                    '            \'tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas \',\n' +
                    '            \'semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo. Quisque sit amet est et sapien \',\n' +
                    '            \'ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, commodo vitae, ornare sit amet, wisi. Aenean \',\n' +
                    '            \'fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. \',\n' +
                    '            \'Donec non enim in turpis pulvinar facilisis. Ut felis. Praesent dapibus, neque id cursus faucibus, tortor \',\n' +
                    '            \'neque egestas augue, eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam dui mi, tincidunt quis, \',\n' +
                    '            \'accumsan porttitor, facilisis luctus, metus\',\n' +
                    '        ].join(\'\''
                }
            ],
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