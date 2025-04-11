import { useEffect, useState } from "react";
import { FaPhone, FaVideo, FaRegSmile, FaRegStar, FaReply, FaTrash, FaShare } from "react-icons/fa";
import "../Styles/chatAreaStyles.css";
import { useGlobalContext } from "../Context/GlobalProvider";
import { fetchMessages, sendMessage } from "../Context/api";
import { useAuth } from "../Context/AuthContext";
import io from "socket.io-client";

// Message Interface
interface Message {
    createdAt: string | Date;
    id: number;
    senderName: string;
    senderId: string;     
    receiverId: string;    
    senderPic: string;
    text: string;
    messageType: "text" | "image" | "video" | "file"; // expand as needed
    chatId: string;

  }

const socket = io("http://localhost:3000", {
    transports: ["websocket", "polling"], // Ensure compatibility with different transport methods
    path: "/socket.io", // Explicitly specify the path to match the server configuration
});

// Main ChatArea Component
const ChatArea: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState<string>("");
    const { selectedChat } = useGlobalContext();
    const { user } = useAuth();

    if (!selectedChat) return null;

    useEffect(() => {
        const loadMessages = async () => {
            if (selectedChat?.chatId) {
                try {
                    const data = await fetchMessages(selectedChat.chatId);
                    setMessages(data);
                    console.log("Messages: ", data);
                } catch (error) {
                    console.error("Error fetching messages:", error);
                }
            }
        };

        loadMessages();

        // Join the chat room
        if (selectedChat?.chatId) {
            socket.emit("joinChat", selectedChat.chatId);
        }

        // Listen for new messages
        socket.on("receiveMessage", (message: Message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        // Cleanup on component unmount
        return () => {
            socket.off("receiveMessage");
        };
    }, [selectedChat]);

    useEffect(() => {
        const chatMessagesContainer = document.querySelector('.chatArea-messages');
        if (chatMessagesContainer) {
            chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async () => {
        const currentUserId = user?.userID;

        if (newMessage.trim() === "") return;

        const messageData = {
            senderId: currentUserId,
            receiverId: selectedChat.userId, // error but works correctly TS_ERROR
            text: newMessage,
            messageType: "text",
            chatId: selectedChat.chatId,
            timestamp: new Date().toISOString(),
        };
        console.log(selectedChat);
        console.log("Message Data: ", messageData);

        try {
            // Emit the message to the server
            socket.emit("sendMessage", messageData);
            sendMessage(selectedChat.chatId, messageData);
            setNewMessage("");

        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    return (
        <div className="chatArea-container">
            {/* Chat Header */}
            {selectedChat && <ChatHeader />}

            {/* Chat Messages Display */}
            <div className="chatArea-messages">
                {messages.map((msg, index) => {
                    const prevMsg = messages[index - 1];

                    const currentDate = new Date(msg.createdAt).toDateString();
                    const prevDate = prevMsg ? new Date(prevMsg.createdAt).toDateString() : null;
                    const showDateDivider = currentDate !== prevDate;

                    const isSameSender =
                        prevMsg && prevMsg.senderId === msg.senderId;

                    const isMine = msg.senderId === user?.userID;

                    return (
                        <div key={msg.id || index}>
                            {showDateDivider && <DateDivider date={currentDate} />}
                            <ChatMessage
                                message={msg}
                                isSameSender={isSameSender}
                                isMine={isMine}
                            />
                        </div>
                    );
                })}
            </div>

            <MessageInput newMessage={newMessage} setNewMessage={setNewMessage} onSend={handleSendMessage} />

        </div>
    );
}

// Chat Header Component
const ChatHeader: React.FC = () => {
    const { selectedChat } = useGlobalContext();
    if(!selectedChat) return null;

    return (
        <div className="chatArea-header">
            <div className="chatArea-userInfo">
                <img src={selectedChat.pfp} alt="User" className="chatArea-profilePic" />
                <span className="chatArea-userName">{selectedChat.username}</span>
            </div>
            <div className="chatArea-chatActions">
                <FaPhone className="chatArea-icon" />
                <FaVideo className="chatArea-icon" />
            </div>
        </div>
    );
}

// Chat Message Component
const ChatMessage: React.FC<{ message: Message; isSameSender: boolean; isMine: boolean }> = ({ message, isSameSender, isMine }) => {
    const [showActions, setShowActions] = useState(false);

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    return (
        <div 
            className={`chatArea-message ${isMine ? "mine" : "theirs"} ${isSameSender ? "same-sender" : ""}`}
            onMouseEnter={() => setShowActions(true)}
            onMouseLeave={() => setShowActions(false)}
        >
            {/* Only show header if not same sender */}
            {!isSameSender && (
                <div className="chatArea-messageHeader">
                    <img src={message.senderPic} alt="User" className="chatArea-messagePic" />
                    <span className="chatArea-messageSender">{message.senderName}</span>
                </div>
            )}

            <div className="chatArea-messageContent">
                <div className="chatArea-messageBubble">
                    <div className="chatArea-messageText">{message.text}</div>
                    
                    {/* Timestamp on hover */}
                    {showActions && (
                        <div className="chatArea-messageMeta">
                            <span className="chatArea-messageTimestamp">{formatTime(message.createdAt as string)}</span>
                        </div>
                    )}
                </div>

                {/* Message Actions */}
                {showActions && (
                    <div className="chatArea-messageActions">
                        <button className="chatArea-messageAction"><FaRegSmile size={16} /></button>
                        <button className="chatArea-messageAction"><FaRegStar size={16} /></button>
                        <button className="chatArea-messageAction"><FaShare size={16} /></button>
                        <button className="chatArea-messageAction"><FaReply size={16} /></button>
                        <button className="chatArea-messageAction"><FaTrash size={16} /></button>
                    </div>
                )}
            </div>
        </div>
    );
};

// Message Input Component
const MessageInput: React.FC<{
    newMessage: string;
    setNewMessage: (msg: string) => void;
    onSend: () => void;
  }> = ({ newMessage, setNewMessage, onSend }) => {
    function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>): void {
      if (event.key === "Enter") {
        event.preventDefault();
        onSend();
      }
    }
  
    return (
      <div className="chatArea-messageInput">
        <input
          type="text"
          placeholder="Type a message..."
          className="chatArea-inputField"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="chatArea-sendButton" onClick={onSend}>
          Send
        </button>
      </div>
    );
  };
  

// User Profile Component
const UserProfile: React.FC = () => {
    const { selectedChat } = useGlobalContext();

    if(!selectedChat) return null;

    return (
        <div className="chatArea-userProfile">
            <img src={selectedChat.pfp} alt="User" className="chatArea-profilePicLarge" />
            <h2 className="chatArea-userName">{selectedChat?.username}</h2>
            {/* <p className="chatArea-status">{selectedChat?.status || "No status available"}</p> */}

            {/* Role Display */}
            {/* {selectedChat.role && <p className="chatArea-role">Role: {selectedChat?.role}</p>} */}

            {/* Action Buttons */}
            <div className="chatArea-actions">
                <button className="chatArea-btn">Message</button>
                <button className="chatArea-btn chatArea-danger">Remove</button>
            </div>
        </div>
    );
}

const DateDivider: React.FC<{ date: string }> = ({ date }) => {
    return (
        <div className="chatArea-dateDivider">
            <span>{date}</span>
        </div>
    );
};


export default ChatArea;
