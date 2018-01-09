import React from 'react'
import {Grid, Header, Image} from 'semantic-ui-react'
import {Link} from 'react-router-dom'

class About extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
    }

    render() {
        return (
          <div style={{marginTop: '5em'}}>
            <Grid>
              <Grid.Row>
                <Grid.Column width={1} />
                <Grid.Column width={14}>
                  <Header color='green' as='h1'>About Zemuldo</Header>
                  <Image alt='zemuldo blogs about banner' src='/img/banners/techBanner.jpg' />
                  <br />
                  <p>
                                This amazing blog is for sharing content on tech topics. I write on trending issues like
                                Big Data, Machine Learning, Artificial Intelligence,
                                among others.
                                The inspiration on pupular blog communities like medium inspired me and i decided to
                                share my knowledge with other too, just not on
                                on medium or a Wordpress blog.

                  </p>
                  <p>
                                I decided to code this application for managing my content. So far, the content here is
                                just an opinion of the witter
                                on the subject or topic. Everything shared is for learning, reference and fun reading.
                  </p>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column width={1} />
                <Grid.Column width={6}>
                  <Header color='green' as='h2'>Creator</Header>
                  <div>
                    <Image alt={'zemuldo creator pic'} avatar size='small' src='/img/creator/dan.jpg' />
                    <br />
                    <p>
                                    Danstan Otieno Onyango
                      <br />
                                    Zemuldo
                    </p>
                    <p>
                                    Software Engineer,
                      <br />
                                    24136, GPO, Nairobi,
                      <br />
                                    Kenya
                    </p>
                  </div>
                </Grid.Column>
                <Grid.Column width={3} />
                <Grid.Column width={6}>
                  <Header color='green' as='h2'>Contacts</Header>
                  <div>
                    <p><a href='tel:+254732764915'>Cell: (+254) 732 764 915</a></p>
                    <p><a href='tel:+254728554638'>Tele: (+254) 728 554 638</a></p>
                  </div>
                  <div>
                    <p><a href='mailto:otis.eng.555@gmail.com'>otis.eng.555@gmail.com</a></p>
                  </div>
                  <div>
                    <p>Address: {' 24136, GPO, Nairobi, Kenya'}</p>
                  </div>
                  <br />
                  <blockquote>
                                “In your thirst for knowledge, be sure not to drown in all the information.”
                  </blockquote>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column width={1} />
                <Grid.Column width={14}>
                  <p>
                                Feel free to join <Link to={'/signup'}>here</Link> to become part.
                  </p>
                </Grid.Column>
              </Grid.Row>
            </Grid>
            <br />
            <br />
          </div>
        )
    }
}

export default About;