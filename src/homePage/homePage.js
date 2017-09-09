import _ from 'lodash'
import React,{Component} from 'react'
import { Container, Divider, Dropdown, Grid, Header, Icon, Image, List, Menu, Segment } from 'semantic-ui-react'

const LeftImage = () => (
    <Image
        floated='left'
        size='medium'
        src='/img/login/login.png'
        style={{ margin: '2em 2em 2em -4em' }}
    />
)
const RightImage = () => (
    <Image
        floated='right'
        size='medium'
        src='/img/login/login.png'
        style={{ margin: '2em -4em 2em 2em' }}
    />
)

const Paragraph = () => (
    <p>
        {[
            'Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum ',
            'tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas ',
            'semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo. Quisque sit amet est et sapien ',
            'ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, commodo vitae, ornare sit amet, wisi. Aenean ',
            'fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. ',
            'Donec non enim in turpis pulvinar facilisis. Ut felis. Praesent dapibus, neque id cursus faucibus, tortor ',
            'neque egestas augue, eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam dui mi, tincidunt quis, ',
            'accumsan porttitor, facilisis luctus, metus',
        ].join('')}
    </p>
)

class HomePage extends Component {
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
                <Header color='green' as='h1'>How to grow your team</Header>
                <p>
                    Published on {new Date().toDateString()} by {' Zemuldo'}
                </p>
                <hr color="green"/>
                <p>This example shows how to use lazy loaded images, a sticky menu, and a simple text container</p>
            </Container>

            <Container text>
                { _.times(3, i => <Paragraph key={i} />) }

                <div style={{ float: 'left', margin: '0em 3em 1em 0em' }}>
                    <Menu size="mini" icon='labeled' vertical>
                        <Menu.Item>
                            <Icon name='twitter' />
                            Twitter
                        </Menu.Item>

                        <Menu.Item >
                            <Icon name='facebook' />
                            Facebook
                        </Menu.Item>

                        <Menu.Item>
                            <Icon name='mail' />
                            Email
                        </Menu.Item>
                    </Menu>
                </div>

                { _.times(3, i => <Paragraph key={i} />) }
                <LeftImage />

                <Paragraph />
                <RightImage />

                { _.times(4, i => <Paragraph key={i} />) }
                <LeftImage />

                <Paragraph />
                <RightImage />

                { _.times(2, i => <Paragraph key={i} />) }
            </Container>


        </div>)
    }
}
export default HomePage