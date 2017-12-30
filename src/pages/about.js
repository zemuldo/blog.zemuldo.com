import React from 'react'
import {Grid,Header} from 'semantic-ui-react'

class About extends React.Component {
    constructor(props){
        super(props);
        this.state = {}
    }
    componentDidMount() {
    }
    render() {
        return (
            <div style={{ marginTop: '5em' }}>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={2}>

                        </Grid.Column>
                        <Grid.Column width={14}>
                            <Header color='green' as='h1'>About Zemuldo</Header>
                            <p>
                                A blog application for sharing content on tech topics. I write on trending issues like Big Data, Machine Learning, Artificial Intelligence,
                                among others.

                            </p>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
        )
    }
}

export default About;