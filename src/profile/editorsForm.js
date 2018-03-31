import React from 'react'
import {connect} from 'react-redux'
import {Label, Header, Form, Select, Dropdown} from 'semantic-ui-react'
import Creator from '../blogEditor/editor'
import * as VarsActions from '../store/actions/vars'
import {bindActionCreators} from 'redux'
import {topics} from '../env'
import PropTypes from 'prop-types'
import {
  convertFromRaw,
  EditorState,
} from 'draft-js'
import {
  decorator
} from '../blogEditor/editorToolkit'
import DropZone from '../blogEditor/imageUpload'

const categories = [
   {key: 'dev', value: 'dev', text: 'Development', name: 'development'},
   {key: 'tech', value: 'tech', text: 'Technology', name: 'technology'},
   {key: 'tutorials', value: 'tutorials', text: 'Tutorials', name: 'tutorials'},
   {key: 'reviews', value: 'reviews', text: 'Reviews', name: 'reviews'},
   {key: 'business', value: 'business', text: 'Business', name: 'business'}
]

class EditorsForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      category: null,
      topics: [],
      termsAccept: false,
      about: '',
      dialogInComplete: true,
      editorState: null
    }
  };

  componentDidMount() {
    this.handleEditorStateCreate()
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize)
  }

  handleCategoryChange=(e, data)=> {
    console.log(data.value)
    this.setState({
      category: data.value,
      dialogInComplete: (this.state.topics && this.state.category && this.state.termsAccept)
    })
  }

  handleAboutChange =(e, data)=> {
    this.setState({
      about: data.value,
      dialogInComplete: (this.state.topics && this.state.category && this.state.termsAccept)
    })
  }

  handleTopicChange =(e, data)=> {
    this.setState({
      topics: data.value,
      dialogInComplete: (this.state.topics && this.state.category && this.state.termsAccept)
    })
  }

  handleUTAChange =(e, data)=> {
    this.setState({
      termsAccept: data.checked,
      dialogInComplete: (this.state.topics && this.state.category && this.state.termsAccept)
    })
  }

  onFinishClick =()=> {
    let blogDta = {
      type: this.state.category,
      topics: this.state.topics,
      about: this.state.about
    }
    window.localStorage.setItem('blogData', JSON.stringify(blogDta))
    this.setState({ filledForm: false })
    this.updateVars([{ key: 'editingMode', value: true }])
  }

  updateVars =(vars)=> {
    let newVars = this.props.vars
    for (let i = 0; i < vars.length; i++) {
      newVars[vars[i].key] = vars[i].value
    }
    this.props.varsActions.updateVars(newVars)
  };
  handleEditorStateCreate =()=> {
    const title = localStorage.getItem('title')
    const state = window.localStorage.getItem('draftContent')
    const blogDataState = window.localStorage.getItem('blogData')
    if (state && blogDataState) {
      let editorState = JSON.parse(state);
      this.setState({
        title: title ? title : '',
        hasSavedContent: false,
        filledForm: true,
        continueEdit: true,
        firstBlock: editorState.blocks[0],
        editorState: EditorState.createWithContent(convertFromRaw(editorState), decorator)
      })
    } else {
      this.setState({ filledForm: true, editorState: EditorState.createEmpty(decorator) })
    }
  };

  render () {
    return (
      <div>
        {
                !this.props.vars.editingMode
                    ? <div>
                      <Header color='green' as='h3'>
                          Creating your Article is easy. Save and continue where you left..
                       </Header>
                       Lets get a few things ready first. this.
                       Fill the form below to feed details of your article.
                       <Form style={{padding: '2em 2em 2em 2em'}}>
                         <br />
                         <Form.Group widths='equal'>
                           <Form.Field inline>
                             <Label style={{border: 'none'}} as='a' size='large' color='blue'>Select
                                   Category</Label>{'   '}
                             <Select style={{margin: '0em 0em 1em 0em', color: 'green'}}
                               onChange={this.handleCategoryChange} placeholder='Select Category'
                               options={categories} />
                           </Form.Field>
                         </Form.Group>
                         <Form.Group inline>
                           <Form.Field>
                             <Label style={{border: 'none'}} as='a' size='large' color='blue'>Select
                                   Tags</Label>{'   '}
                             <Dropdown style={{margin: '0em 0em 1em 0em', color: 'green'}}
                               onChange={this.handleTopicChange} multiple search selection
                               closeOnChange options={topics} placeholder='Select topics' />
                           </Form.Field>
                         </Form.Group>
                         <Header as='h3'>Header Picture</Header>
                         <Form.Group inline>
                           
                           <DropZone/>
                         </Form.Group>
                         <Form.TextArea maxLength='140' onChange={this.handleAboutChange} label='About your blog'
                           placeholder='Small details about your article...upto 140 Characters' />
                         <Form.Checkbox onChange={this.handleUTAChange}
                           label='I agree to the Community Terms and Conditions' />
                         <Form.Button
                           disabled={this.state.topics.length < 1 || this.state.about.length < 139 || !this.state.category || !this.state.termsAccept}
                           type='button' onClick={this.onFinishClick} color='green'
                           size='large'>Submit</Form.Button>
                         <Form.Button type='button' onClick={() => this.updateVars([{
                           key: 'editingMode',
                           value: false
                         }, {key: 'createNew', value: false}])} color='green' size='large'>Exit</Form.Button>
                       </Form>
                    </div>
            : <div>
              {
                this.state.editorState ?
                  <Creator
                    initEditorState={this.state.editorState}
                    editorState={JSON.stringify(EditorState.createEmpty())}
                    mode='create'
                    currentUser={this.props.currentUser}
                    topics={this.state.topics}
                    category={this.state.category}
                  /> :
                  <div>Loading state</div>
              }
            </div>
             }
      </div>

    )
  }
}

const mapStateToProps = (state) => {
  return {
    vars: state.vars
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    varsActions: bindActionCreators(VarsActions, dispatch)
  }
}

EditorsForm.propTypes = {
  varsActions: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
  vars: PropTypes.object.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(EditorsForm)
