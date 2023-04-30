import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const SignUpPage = () => {
    const [response, setResponse] = useState(null);


   
    const navigate = useNavigate();

    const handleLoginClick = () => {
      navigate('/login');
    };

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
 const handleSubmit = async (event) => {
    event.preventDefault();
    const data = { name, email, password };

    try {
      const response = await axios.post(
        'https://orp6bwmml7.execute-api.us-east-1.amazonaws.com/dev/signup',
        data
      );
      
      console.log(response.data);
      if(response.data.statusCode==200){
        toast.success('Registered successfully!')

      }
      else{
        toast.warning('User Already Exist!')


      }
      
    } catch (error) {
      console.log(error);
    }
  };




  return (
    <div>
      
      <Paper style={{ padding: '10px' }}elevation={3}>
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </div>
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>
      
      <button type="submit">Sign Up</button>

      <ToastContainer position="bottom-center" style={{ background: "", color: "#F8E9D6" }}></ToastContainer>
      
     
      
    </form>
    {response && (
        <div>
          {response.success ? (
            <p>User {username} added successfully!</p>
          ) : (
            <p>{response.message}</p>
          )}
        </div>
      )}
     <button  onClick={handleLoginClick} >Already a User?</button>
     </Paper>
  
     </div>
  )
};

export default SignUpPage;
