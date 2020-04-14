import React, { Component } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Container } from '@material-ui/core'

import RootRouter from './Router'
import Navbar from './components/navigation/Navbar'

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
