import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../assets/Logo.png';
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { loginRoute } from '../utils/APIRoutes.js'

function Login() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: "",
    password: "",
  })

  const toastParams = {
    position: 'bottom-right',
    autoClose: 5000,
    draggable: true,
    theme: 'light',
    pauseOnHover: true,
  }

  useEffect(() => {
    if (localStorage.getItem('chat-app')) {
      navigate('/');
    }
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (handleVerification()) {
      // console.log('ive been called');
      const { username, password } = user;
      const { data } = await axios.post(loginRoute, {
        username, password,
      });
      console.log(data);

      if (data.status === true) {
        localStorage.setItem(
          'chat-app',
          JSON.stringify(data.loginUser));
        navigate("/");
      } else {
        toast.error(data.message, toastParams);
      }
    }
  }
  const handleChange = (event) => {
    // console.log(event ,event.target.name, event.target.value);
    setUser({ ...user, [event.target.name]: event.target.value });
    // console.log(user);
  }



  const handleVerification = () => {
    const { username, password, } = user;
    // console.log(user);
    if (username.length === '') {
      toast.error("Please insert a user name.", toastParams);
      return false;
    }
    else if (password.length === '') {
      toast.error("please insert a password.", toastParams);
      return false;
    }
    return true;
  };

  return (
    <>
      <FormContainer>
        <form onSubmit={(event) => handleSubmit(event)}>
          <div className="brand">
            <img src={Logo} alt="" />
            <h1>Chat App</h1>
          </div>
          <input type="text" placeholder='Username' name='username' onChange={event => handleChange(event)} />
          <input type="password" placeholder='Password' name='password' onChange={event => handleChange(event)} />

          <button type='submit'>Login</button>
          <span>
            Don't have an account? <Link to="../Register">Register</Link>
          </span>
        </form>
      </FormContainer>
      <ToastContainer />
    </>
  )
}

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #262649;
  .brand{
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img{
      height: 5rem;
    }
    h1{
      color: whitesmoke;
      text-transform: uppercase;
    }
  }
  form{
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #371442;
    border-radius: 3rem;
    padding: 3rem 5rem;
    input{
      background-color: transparent;
      padding: 1rem;
      border: 0.1rem solid;
      border-radius: 0.4rem;
      color: wheat;
      width: 100%;
      font-size: 1rem;
        &:focus {
        border: 0.1rem solid #997af0;
        outline: none;
    }
    }
    button{
      background-color: rebeccapurple;
      color: white;
      padding: 1rem;
      border: none;
      font-weight: bold;
      cursor: pointer;
      border-radius: 0.4rem;
      font-size: 1rem;
      transition: 200ms;
      &:hover{
        background-color: purple;
      }
    }
    span{
      display: flex;
      color: whitesmoke;
      justify-content: center;
      white-space: pre-wrap;
      a{
        color: paleturquoise;
        font-weight: bold;
        text-decoration: none;
      }
    }
    .CB{
      width: auto;
      margin-left: 1rem;
    }
  }
`;
export default Login;