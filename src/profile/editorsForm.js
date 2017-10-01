import React, { Component } from 'react';
import {Label, Header,Form,Select,Dropdown} from 'semantic-ui-react'
import Creator from './createBlog'
import config from '../environments/conf'
const env = config[process.env.NODE_ENV] || 'development'
const categories = [
    { key: 'dev', value: 'Development', text: 'Development',name:'development' },
    { key: 'tech', value: 'Technology', text: 'Technology' ,name:'technology'},
    { key: 'business', value: 'Business', text: 'Business' ,name:'business'},
]
const topics = [
    { key: 'bigdata', value: 'bigdata', text: 'bigdata', name: 'bigdata'},
    { key: 'iot', value: 'iot', text: 'iot' ,name: 'iot'},
    { key: 'ml', value: 'ml', text: 'ml' ,name: 'ml'},
    { key: 'ai', value: 'ai', text: 'ai' ,name: 'ai'},
    { key: 'java', value: 'java', text: 'java' ,name: 'java'},
    { key: 'python', value: 'python', text: 'python' ,name: 'python'},
    { key: 'r', value: 'r', text: 'r' ,name: 'r'},
    { key: 'marketing', value: 'marketing', text: 'marketing' ,name: 'marketing'},
    { key: 'fintech', value: 'fintech', text: 'fintech' ,name: 'fintech'},
    { key: 'startup', value: 'startup', text: 'startup' ,name: 'startup'},
    { key: 'bot', value: 'bot', text: 'bot' ,name: 'bot'},
    { key: 'express', value: 'express', text: 'express' ,name: 'express'},
    { key: 'linux', value: 'linux', text: 'linux' ,name: 'linux'},
    { key: 'go', value: 'go', text: 'go' ,name: 'go'},
    { key: 'growth haking', value: 'growth haking', text: 'growth haking' ,name: 'growth haking'},
    { key: 'cloud', value: 'cloud', text: 'cloud' ,name: 'cloud'},
    { key: 'nodejs', value: 'nodejs', text: 'nodejs' ,name: 'nodejs'}

]
class EditorsForm extends Component {
    constructor(props){
        super(props);
        this.state = {


        };
    };
    componentDidMount() {
        console.log(this.props.editingMode)
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.resize)
    }

    render() {
        return (
            <div>
                {
                    !this.props.editingMode?
                        <div>
                            <Header color='green' as='h3'>
                                Creating your Article is easy. Save and continue where you left..
                            </Header>
                            Lets get a few things ready first. this.
                            Fill the form below to feed details of your article.
                            <Form style={{padding:'2em 2em 2em 2em'}}>
                                <br/>
                                <Form.Group widths='equal'>
                                    <Form.Field inline>
                                        <Label style={{border:'none'}} as='a' size="large" color='blue'>Select Category</Label>{'   '}
                                        <Select style={{margin:'0em 0em 1em 0em',color:'green'}}  onChange={this.props.handleCategoryChange} placeholder='Select Category' options={categories} />
                                    </Form.Field>
                                </Form.Group>
                                <Form.Group inline>
                                    <Form.Field>
                                        <Label  style={{border:'none'}} as='a' size="large" color='blue'>Select Tags</Label>{'   '}
                                        <Dropdown style={{margin:'0em 0em 1em 0em',color:'green'}} onChange={this.props.handleTopicChange} multiple search selection closeOnChange options={topics} placeholder='Select topics' />
                                    </Form.Field>
                                </Form.Group >
                                <Form.TextArea label='About' placeholder='Small details about your article...' />
                                <Form.Checkbox onChange = {this.props.handleUTAChange} label='I agree to the Community Terms and Conditions' />
                                <Form.Button type="button" onClick={this.props._goToEditor}  color='green' size='large'>Submit</Form.Button>
                            </Form>
                        </div>:
                        <Creator/>
                }
            </div>

        )
    }
}
export default EditorsForm;
