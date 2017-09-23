import React, { Component } from 'react'
import {  Header } from 'semantic-ui-react'
export default class About extends Component {
    constructor(props){
        super(props)
        this.state = {
        }
    }

    render() {
        return (
            <div >
                <Header style={{ textAlign :'left',alignment:'center'}} color='green' as='h1'>
                    Welcome To ZemuldO.COM
                </Header>
                <hr color="green"/>
                <div style={{fontSize:"16px",fontFamily:"georgia", padding: '0em 3em 2em 1em'}}>
                    <p>
                        We share content on trending technologies like Artificial Intelligence and BlockChain.
                        You are definitely in the right place. Here you acn get very good content on business, development
                        and technology.
                    </p>
                    <p>
                        We also offer Business and Tech Consultancy. If you are looking for ways to grow your business,
                        We are the choice you are looking for. Reach us for insights and growth.
                    </p>
                </div>
            </div>
        )
    }
}
