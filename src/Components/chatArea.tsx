import { useState } from "react";
import { FaPhone, FaVideo } from "react-icons/fa";
import { useChatVoice } from "../Context/ChatVoiceContext";
import "../Styles/chatAreaStyles.css";

// Message Interface
interface Message {
    id: number;
    senderName: string;
    senderPic: string;
    text: string;
    timestamp: string;
}

// User Interface
interface User {
    name: string | null;
    profilePic: string | null;
    status?: string | null;
    role?: string | null;
}

// ChatArea Props Interface
interface ChatAreaProps {
    selectUser: User | string | any;
}

// Sample Messages
const sampleMessages: Message[] = [
    { id: 1, senderName: "Alice", senderPic: "/images/alice.jpg", text: "Hey! How's it going?", timestamp: "10:30 AM" },
    { id: 2, senderName: "Alice", senderPic: "/images/alice.jpg", text: "Did you check the new update?", timestamp: "10:31 AM" },
    { id: 3, senderName: "Bob", senderPic: "/images/bob.jpg", text: "Yeah! Looks awesome!", timestamp: "10:32 AM" },
];

// Chat Header Component
const ChatHeader: React.FC = () => {
    const { selectChat } = useChatVoice();
    if(!selectChat) return null;

    return (
        <div className="chatArea-header">
            <div className="chatArea-userInfo">
                <img src={selectChat.profilePic} alt="User" className="chatArea-profilePic" />
                <span className="chatArea-userName">{selectChat.name}</span>
            </div>
            <div className="chatArea-chatActions">
                <FaPhone className="chatArea-icon" />
                <FaVideo className="chatArea-icon" />
            </div>
        </div>
    );
}

// Chat Message Component
const ChatMessage: React.FC<{ message: Message; isSameSender: boolean }> = ({ message, isSameSender }) => {
    return (
        <div className={`chatArea-message ${isSameSender ? "same-sender" : ""}`}>
            {!isSameSender && (
                <div className="chatArea-messageHeader">
                    <img src={message.senderPic} alt="User" className="chatArea-messagePic" />
                    <span className="chatArea-messageSender">{message.senderName}</span>
                </div>
            )}
            <div className="chatArea-messageContent">
                <div className="chatArea-messageText">{message.text}</div>
                <span className="chatArea-messageTimestamp">{message.timestamp}</span>
            </div>
        </div>
    );
}

// Message Input Component
const MessageInput: React.FC = () => {
    return (
        <div className="chatArea-messageInput">
            <input type="text" placeholder="Type a message..." className="chatArea-inputField" />
            <button className="chatArea-sendButton">Send</button>
        </div>
    );
}

// User Profile Component
const UserProfile: React.FC = () => {
    const { selectChat } = useChatVoice();

    if(!selectChat) return null;

    return (
        <div className="chatArea-userProfile">
            <img src={selectChat.profilePic} alt="User" className="chatArea-profilePicLarge" />
            <h2 className="chatArea-userName">{selectChat?.name}</h2>
            <p className="chatArea-status">{selectChat?.status || "No status available"}</p>

            {/* Role Display */}
            {selectChat.role && <p className="chatArea-role">Role: {selectChat?.role}</p>}

            {/* Action Buttons */}
            <div className="chatArea-actions">
                <button className="chatArea-btn">Message</button>
                <button className="chatArea-btn chatArea-danger">Remove</button>
            </div>
        </div>
    );
}

// Main ChatArea Component
const ChatArea: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>(sampleMessages);
    const { selectChat } = useChatVoice();

    if (!selectChat) return null;

    return (
        <div className="chatArea-container">
            {/* Chat Header */}
            {selectChat && <ChatHeader />}

            {/* Chat Messages Display */}
            <div className="chatArea-messages">
                {messages.map((msg, index) => (
                    <ChatMessage
                        key={msg.id}
                        message={msg}
                        isSameSender={index > 0 && messages[index - 1].senderName === msg.senderName}
                    />
                ))}
            </div>

            <MessageInput />

        </div>
    );
}

export default ChatArea;
