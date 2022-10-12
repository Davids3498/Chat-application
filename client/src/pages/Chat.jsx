import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { contactsRoute, host } from '../utils/APIRoutes.js'
import Contacts from '../components/Contacts.jsx';
import Welcome from '../components/Welcome.jsx';
import ChatBox from '../components/ChatBox.jsx';
import { io } from 'socket.io-client';

function Chat() {
  const socket = useRef();
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentChat, setCurrentChat] = useState(undefined);

  useEffect(() => {
    if(currentUser){
      socket.current = io(host);
      socket.current.emit('add-user',currentUser._id);
    }
  }, [currentUser])

  useEffect(() => {
    const exec = async () => {
      if (!localStorage.getItem('chat-app')) {
        navigate('/login');
      } else {
        setCurrentUser(await JSON.parse(localStorage.getItem('chat-app')))
      }
    }
    exec();
  }, [])

  useEffect(() => {
    const exec = async () => {
      if (currentUser) {
        // console.log(currentUser);
        if (currentUser.isAvatarImageSet) {
          const data = await axios.get(`${contactsRoute}/${currentUser._id}`);
          // console.log(data);
          setContacts(data.data);
        } else {
          navigate("/setAvatar");
        }
      }
    }
    exec();
  }, [currentUser])

  const handleChangeChat = (chat) => {
    setCurrentChat(chat);
  }

  return (
    <>
      <Container>
        <div className='container'>
          <Contacts
            contacts={contacts}
            currentUser={currentUser}
            changeChat={handleChangeChat} />
          {
            currentChat !== undefined ?
              <ChatBox currentChat={currentChat} currentUser={currentUser} socket={socket} />
              : <Welcome currentUser={currentUser} />
          }
        </div>
      </Container>
    </>
  )
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;

export default Chat;