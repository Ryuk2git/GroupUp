import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { fetchMembers, fetchMessages, sendMessage, fetchUserData } from '../utils/api.js';
import { collection, query, orderBy, onSnapshot, addDoc } from "firebase/firestore";
import { db } from "../../backend/config/firebase.js"; // Update with the correct path
import '../styles/ChatArea.css';

const SOCKET_SERVER_URL = 'http://localhost:5000';

function ChatArea({ selectedMember, currentUserId }) {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [contextMenu, setContextMenu] = useState(null);
  const [socket, setSocket] = useState(null);
  const [showVoiceCall, setShowVoiceCall] = useState(false);
  const [showVideoCall, setShowVideoCall] = useState(false);

  useEffect(() => {
    const newSocket = io(SOCKET_SERVER_URL);
    setSocket(newSocket);

    fetchMessages();

    newSocket.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => newSocket.disconnect();
  }, [selectedMember]);

  const fetchMessages = async () => {
    const token = localStorage.getItem('authToken');
    try {
      const response = await fetch(`/api/messages/${selectedMember.id}`, {
        headers: {
          'x-auth-token': token,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setMessages(data.messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async () => {
    if (messageInput.trim()) {
      const newMessage = {
        senderId: currentUserId, // Use the current user's ID
        receiverId: selectedMember.id,
        messageContent: messageInput,
      };

      try {
        // Send the message to the server
        const response = await fetch('/api/messages/send', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'x-auth-token': localStorage.getItem('authToken'), // Include token in header
          },
          body: JSON.stringify(newMessage),
        });

        if (response.ok) {
          socket.emit('message', newMessage);
          setMessageInput('');
        } else {
          const errorData = await response.json();
          console.error('Error sending message:', errorData);
        }
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const toggleVoiceCall = () => {
    setShowVoiceCall(!showVoiceCall);
  };

  const toggleVideoCall = () => {
    setShowVoiceCall(false); // Hide voice call
    setShowVideoCall(true); // Show video call
  };

  return (
    <div className="chat-area">
      <div className="chat-header">
        {selectedMember.avatar ? (
          <img src={selectedMember.avatar} alt={selectedMember.name} className="chat-avatar" />
        ) : (
          <div className="chat-avatar-placeholder">No Avatar</div>
        )}
        <span className="chat-member-name">{selectedMember.name}</span>
        <div className="chat-actions">
          <div className="call-button" onClick={toggleVoiceCall}>Call</div>
          <div className="video-call-button" onClick={toggleVideoCall}>Video</div>
        </div>
      </div>
      <div className="chat-content">
        {messages.map((message) => (
          <div key={message.id} className="chat-message">
            <strong>{message.senderId === currentUserId ? 'You' : selectedMember.name}:</strong> {message.messageContent}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <textarea
          placeholder="Type your message here..."
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
        />
        <div className="add-media">+</div>
        <div className="send-message" onClick={handleSendMessage}>Send</div>
      </div>
      {contextMenu && (
        <div className="context-menu" style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}>
          <div className="context-menu-item" onClick={() => handleDeleteMessage(contextMenu.messageId)}>
            Delete Message
          </div>
        </div>
      )}

      {/* Voice Call Dropdown */}
      {showVoiceCall && (
        <div className="voice-call-dropdown">
          <div className="voice-call-top">
            {selectedMember.avatar ? (
              <img src={selectedMember.avatar} alt="Caller Avatar" className="call-avatar" />
            ) : (
              <div className="call-avatar-placeholder">Caller</div>
            )}
            <img src="yourAvatar.png" alt="Your Avatar" className="call-avatar" />
          </div>
          <div className="voice-call-bottom">
            <div className="mute-button" onClick={() => alert('Muted')}>
              <i className="fas fa-microphone-slash"></i>
            </div>
            <div className="end-call-button" onClick={toggleVoiceCall}>
              <i className="fas fa-phone-slash"></i>
            </div>
            <div className="video-call-button" onClick={toggleVideoCall}>
              <i className="fas fa-video"></i>
            </div>
          </div>
        </div>
      )}

      {/* Video Call Dropdown */}
      {showVideoCall && (
        <div className="video-call-dropdown">
          <div className="video-call-top">
            <div className="video-feed"></div>
            <div className="video-feed"></div>
          </div>
          <div className="video-call-bottom">
            <div className="mute-button" onClick={() => alert('Muted')}>
              <i className="fas fa-microphone-slash"></i>
            </div>
            <div className="end-call-button" onClick={() => setShowVideoCall(false)}>
              <i className="fas fa-phone-slash"></i>
            </div>
            <div className="switch-to-voice-button" onClick={() => { setShowVideoCall(false); setShowVoiceCall(true); }}>
              <i className="fas fa-phone"></i>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatArea;
