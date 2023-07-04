import React from 'react'
import {BrowserRouter as Router ,Routes , Route} from 'react-router-dom'
import Join from './components/Join/Join'
import Chat from './components/Chat/Chat'


function App() {
  
  return (
    <div>
        <Router>
            <Routes>
            <Route path ="/" element={<Join />} />
            <Route path ="/chat" element={<Chat />} />
            </Routes>
        </Router>
      
    </div>
  )
}

export default App
