import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [response, setResponse] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
        const response = await axios.post(
        'https://orp6bwmml7.execute-api.us-east-1.amazonaws.com/dev/login',
        {"email": email, "password": password},
        {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
         
        }
      );
      console.log(response.data);
      if(response.data.statusCode==200){
        navigate('/upload')

      }
      else{

        window.location.reload(); 
        alert("Invalid details entered!");
      }

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Email:
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <br />
      <label>
        Password:
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      <br />
      <button type="submit">Login</button>
      <ToastContainer position="bottom-center" style={{ background: "", color: "#F8E9D6" }}></ToastContainer>
      
     
    </form>
    
  );
}

export default Login;
