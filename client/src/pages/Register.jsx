import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../assets/Logo.png';
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { registerRoute } from '../utils/APIRoutes.js'


function Register() {

  const navigate = useNavigate();

  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  
  useEffect(() => {
    if (localStorage.getItem('chat-app')) {
      navigate('/');
    }
  }, [])
  const [checked, setCheck] = useState(false);

  const toastParams = {
    position: 'bottom-right',
    autoClose: 5000,
    draggable: true,
    theme: 'light',
    pauseOnHover: true,
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (handleVerification()) {
      console.log('ive been called');
      const { username, email, password } = user;
      const { data } = await axios.post(registerRoute, {
        username, email, password,
      });
      console.log(data);
      if (data.status === true) {
        localStorage.setItem(
          'chat-app',
          JSON.stringify(data.user));
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
    const { username, email, password, confirmPassword } = user;
    // console.log(user);
    if (password !== confirmPassword) {
      toast.error("Password and confirm password should be the same.", toastParams);
      return false;
    }
    else if (password.length < 6) {
      toast.error("Password should be length of 6 atleast.", toastParams);
      return false;
    }
    else if (username.length < 5) {
      toast.error("Username should be length of 5 atleast.", toastParams);
      return false;
    }
    else if (email === "") {
      toast.error("Email required.", toastParams);
      return false;
    }
    else if (!checked) {
      toast.error("Need to agree to the term of service.", toastParams);
      return false;
    }
    return true;
  };
  const handleCheck = () => {
    setCheck(!checked);
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
          <input type="email" placeholder='Email' name='email' onChange={event => handleChange(event)} />
          <input type="password" placeholder='Password' name='password' onChange={event => handleChange(event)} />
          <input type="password" placeholder='Confirm Password' name='confirmPassword' onChange={event => handleChange(event)} />
          <span>
            I agree to the term of service <input type="checkbox" className='CB' onChange={handleCheck} />
          </span>
          <button type='submit'>Create User</button>
          <span>
            Already have an account? <Link to="../Login">Login</Link>
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
export default Register