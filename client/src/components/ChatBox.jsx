import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components';
import { messageRoute, chatRoute } from '../utils/APIRoutes';
import ChatInput from './ChatInput';
import Logout from './Logout';
import { v4 } from 'uuid';

function ChatBox({ currentChat, currentUser, socket }) {
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const scrollRef = useRef();
  useEffect(() => {
    const exec = async () => {
      if (currentChat) {
        const res = await axios.post(chatRoute, {
          from: currentUser._id,
          to: currentChat._id,
        })
        setMessages(res.data);
      }
    }
    exec();
  }, [currentChat])

  const handleSendMessage = async (msg) => {
    await axios.post(messageRoute, {
      from: currentUser._id,
      to: currentChat._id,
      message: msg
    });
    socket.current.emit('send-msg', {
      to: currentChat._id,
      from: currentUser._id,
      message: msg
    });
    const msgs = [...messages];
    msgs.push({
      fromSelf: true, message: msg
    })
    setMessages(msgs);
  }

  useEffect(() => {
    if (socket.current) {
      socket.current.on('msg-recived', (msg) => {
        setArrivalMessage({ fromSelf: false, message: msg });
      });
    }
  }, [])

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage])

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages])

  return (
    <ChatBoxContainer>
      <div className="chat-header">
        <div className="user-details">
          <div className="avatar">
            <img src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
              alt="avatar" />
          </div>
          <div className="username">
            <h3>{currentChat.username}</h3>
          </div>
        </div>
        <Logout />
      </div>
      <div className="chat-messages">
        {
          messages.map((msg) => {
            return (
              <div ref={scrollRef} key={v4()}>
                <div className={`message ${msg.fromSelf ? 'sended' : 'recived'}`}>
                  <div className="message-contant">
                    <p>
                      {msg.message}
                    </p>
                  </div>
                </div>
              </div>
            )
          })
        }
      </div>
      <ChatInput handleSendMessage={handleSendMessage} />
    </ChatBoxContainer >
  )
}
const ChatBoxContainer = styled.div`
    display: grid;
  grid-template-rows: 10% 80% 10%;
  gap: 0.1rem;
  overflow: hidden;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username {
        h3 {
          color: white;
        }
      }
    }
  }
  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .message {
      display: flex;
      align-items: center;
      .message-contant {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #d1d1d1;
        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }
      }
    }
    .sended {
      justify-content: flex-end;
      .message-contant {
        background-color: #4f04ff21;
      }
    }
    .recived {
      justify-content: flex-start;
      .message-contant {
        background-color: #9900ff20;
      }
    }
  }
`;

export default ChatBox;

