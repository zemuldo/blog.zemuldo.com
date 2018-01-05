import React from 'react';
import {Header} from 'semantic-ui-react'
import {Timeline} from 'react-twitter-widgets'

class TwitterProf extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    };

    render() {
        return (
            <div style={{textAlign: 'centre', margin: '2em 0em 0em 0em'}}>
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
        )
    }
}

export default TwitterProf;
