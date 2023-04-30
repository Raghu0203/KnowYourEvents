
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UploadImage from './Upload';
import SignUpPage from './Signup';
import Login from './Login';


function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
        <Route path="/" element={<SignUpPage />} /> 
        <Route path="/upload" element={<UploadImage />} />
        <Route path="/login" element={<Login />} />
        
        </Routes>
      </Router>
  
        
    </div>
  );
}

export default App;
