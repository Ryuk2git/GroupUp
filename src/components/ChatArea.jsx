import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import '../styles/ChatArea.css';
import { fetchMessages, sendMessage } from '../utils/api';

const SOCKET_SERVER_URL = 'http://localhost:3000';

function ChatArea({ selectedMember, currentUserId }) {
  const [messages, setMessages] = useState([]); // State for messages
  const [messageInput, setMessageInput] = useState(''); // State for input
  const [socket, setSocket] = useState(null); // State for socket
  const [showVoiceCall, setShowVoiceCall] = useState(false); // State for voice call
  const [showVideoCall, setShowVideoCall] = useState(false); // State for video call

  // UseEffect to initialize socket and listen for incoming messages
  useEffect(() => {
    if (!selectedMember) return;

    const newSocket = io(SOCKET_SERVER_URL, {
      query: { userId: currentUserId },
    });
    setSocket(newSocket);

    // Listen for messages from the server
    newSocket.on('message', (message) => {
      if (message.senderId === selectedMember.id || message.receiverId === selectedMember.id) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    });

    // Fetch previous messages
    loadMessages();

    // Cleanup on unmount or when selectedMember changes
    return () => {
      newSocket.disconnect();
      setSocket(null);
    };
  }, [selectedMember, currentUserId]);

  // Function to fetch previous messages
  const loadMessages = async () => {
    const token = localStorage.getItem('x-auth-token');
    try {
      const response = await fetchMessages(currentUserId, selectedMember.id);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      // If messages are found, set them, otherwise show a placeholder message
      if (data.messages && data.messages.length > 0) {
        setMessages(data.messages);
      } else {
        setMessages([{ id: 'start-conversation', messageContent: 'Start a conversation!' }]);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

 const handleSendMessage = async () => {
  if (messageInput.trim()) {
    const newMessage = {
      senderId: currentUserId,           // Current user's ID
      receiverId: selectedMember.id,     // Friend's ID
      content: messageInput,              // The message content
    };

    try {
      // Send the message using sendMessage function
      const response = await sendMessage(
        newMessage.senderId,
        newMessage.receiverId,
        newMessage.content
      );

      if (response) {
        // Emit the message via socket to update the chat
        socket.emit('message', newMessage);

        // Clear the message input after sending
        setMessageInput('');
      } else {
        console.error('Error sending message:', response);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }
};


  // Handle toggling voice call visibility
  const toggleVoiceCall = () => {
    setShowVoiceCall(!showVoiceCall);
  };

  // Handle toggling video call visibility
  const toggleVideoCall = () => {
    setShowVoiceCall(false);
    setShowVideoCall(true);
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
        {messages.length > 0 ? (
          messages.map((message) => (
            <div key={message.id || message.timestamp} className="chat-message">
              <strong>{message.senderId === currentUserId ? 'You' : selectedMember.name}:</strong> {message.messageContent}
            </div>
          ))
        ) : (
          <div className="no-messages">No messages yet. Start a conversation!</div>
        )}
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
    </div>
  );
}

export default ChatArea;
