import './App.css'
import SignIn from './Components/Sign_in'
import Login from './Components/Login'
import Dashboard from './Pages/Dashboard'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {  
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/login" element={<Login />} />
          <Route path="/Dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
