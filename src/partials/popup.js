import React from 'react'
import { Popup } from 'semantic-ui-react'

class ZPopup extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  
  render() {
   
    return (
        <Popup
        inverted
        trigger={this.props.trigger}
        content={this.props.content}
    />
    )
  }
}


export default ZPopup
