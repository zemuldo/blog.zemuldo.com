import React, { Component } from 'react';
import {  Menu, Button,Icon,Header,Modal} from 'semantic-ui-react'
import { Timeline } from 'react-twitter-widgets'
import ReviewPortal from './portal'
/*import config from '../environments/conf'
const env = config[process.env.NODE_ENV] || 'development'*/
class TwitterProf extends Component {
    constructor(props){
        super(props);
        this.state = {
            modalOpen:false

        };

    };

    render() {
        return (
            <div>

                <br/>
                <hr/>
                <div style={{textAlign:'centre',margin:'2em 0em 0em 0em'}}>
                    <Header color='blue' as='h3'>On Twitter</Header>
                    <Timeline
                        dataSource={{
                            sourceType: 'profile',
                            screenName: 'zemuldo'
                        }}
                        options={{
                            username: 'zemuldo',
                            height: '300',
                            width: '30'
                        }}
                    />
                </div>
            </div>
        )
    }
}
export default TwitterProf;
