import React from 'react'
import { Grid, Header, Image, Container } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { toTitleCase } from "../util";
import { connect } from 'react-redux'
import moment from 'moment-timezone'

class UserProfile extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    componentDidMount() {
        if (!this.props.vars.view_user) {
            this.props.history.push('/')
        }
    }
    render() {
        let user = this.props.vars.view_user
        if (!user) {
            return null
        }
        return (
            <Container>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={3} />
                        <Grid.Column width={10}>
                            <div>
                            <Image avatar alt='zemuldo creator pic' avatar size='small' src={`${this.props.vars.env.httpURL}${user.url}`} />
                            <Header>{user.name}</Header>
                            <p>
                            {`Joined ${moment().to(user.created)}`}
                            </p>
                            </div>
                        </Grid.Column>
                        <Grid.Column width={3} />
                    </Grid.Row>
                </Grid>
            </Container>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        vars: state.vars,
    }
}

export default connect(mapStateToProps)(UserProfile)
