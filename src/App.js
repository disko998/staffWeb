import React, { Component } from 'react'
import { BrowserRouter } from 'react-router-dom'

import RootRouter from './Router'
import Navbar from './components/layout/Navbar'
import { Container } from '@material-ui/core'

class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <div className='App'>
                    <Navbar />
                    <Container maxWidth='md'>
                        <RootRouter />
                    </Container>
                </div>
            </BrowserRouter>
        )
    }
}

export default App
