import _ from 'lodash'
import React,{Component} from 'react'
import { Container, Divider, Dropdown, Grid, Header, Icon, Image, List, Menu, Segment,Loader } from 'semantic-ui-react'
import axios from 'axios'


class HomeBlog extends Component {
    constructor(props){
        super(props);
        this.state = {
            blog:(this.props.blogs[0]) ? this.props.blogs[0]: null
        };
        this.onReadMore = this.onReadMore.bind(this);
    };
    onReadMore(thisBlog){
        this.setState({blogIsLoading:true})
        return axios.get('http://api.zemuldo.com/posts/'+ thisBlog.type +'/'+thisBlog.title, {
        })
            .then(response => {
                this.setState({blog:response.data})
                this.isLoading(true)
                this.setState({blogIsLoading:false})
                window.scrollTo(0,0)
                return response
            })
            .catch(exception => {
                this.isLoading(true)
                return exception
            });
    }
    render(){
        return(<div>

            {
                this.props
            }
        </div>)
    }
}
export default HomeBlog