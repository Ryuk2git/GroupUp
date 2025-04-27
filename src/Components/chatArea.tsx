import { useEffect, useState, useRef } from "react";

import { FaPhone, FaVideo, FaRegSmile, FaRegStar, FaReply, FaTrash, FaShare } from "react-icons/fa";
import "../Styles/chatAreaStyles.css";
import EmojiPicker from 'emoji-picker-react';
// import "emoji-mart/css/emoji-mart.css";

import { useGlobalContext } from "../Context/GlobalProvider";
import { fetchMessages, sendMessage, reactToMessage, starMessage, forwardMessage, deleteMessage } from "../Context/api";
import { useAuth } from "../Context/AuthContext";
import io from "socket.io-client";

// Message Interface
interface Message {
    createdAt: string | Date;
    _id?: string;
    senderName: string;
    senderId: string;     
    receiverId: string;    
    senderPic: string;
    text: string;
    messageType: "text" | "image" | "video" | "file"; // expand as needed
    chatId: string | null;
    groupId: string | null;
    reactions?: { emoji: string; userId: string }[]; // Optional reactions property
}

const socket = io("http://localhost:3000", {
    transports: ["websocket", "polling"], // Ensure compatibility with different transport methods
    path: "/socket.io", // Explicitly specify the path to match the server configuration
});

// Main ChatArea Component
const ChatArea: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState<string>("");
    const { selectedChat, selectedGroup } = useGlobalContext();
    const { user } = useAuth();
    const currentUserId = user?.userID;

    if (!selectedChat && !selectedGroup) return null;

    const chatId = selectedGroup ? selectedGroup.chatId : selectedChat?.chatId;
    const receiverId = selectedGroup?.groupId || selectedChat?.userId;
    const isGroup = !!selectedGroup;

    useEffect(() => {
        console.log("SelcetedGroup from chatArea: ", selectedGroup);
    }, [selectedGroup]);

    useEffect(() => {
        console.log('ChatArea useEffect triggered with', { selectedChat, selectedGroup });
        const loadMessages = async () => {
            if (chatId && currentUserId) {
                try {
                    const data: Message[] = await fetchMessages(chatId, currentUserId);
                    setMessages(data);
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

        socket.on("messageReacted", ({ messageId, userId, emoji }: { messageId: string; userId: string; emoji: string }) => {
            setMessages((prev) =>
                prev.map((msg) =>
                    msg._id === messageId
                        ? {
                              ...msg,
                              reactions: updateReactions(msg.reactions || [], userId, emoji),
                          }
                        : msg
                )
            );
        });

        // Cleanup on component unmount
        return () => {
            socket.off("receiveMessage");
            socket.off("messageDeleted");
            socket.off("messageReacted");
        };
    }, [selectedChat, selectedGroup, socket]);

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
            receiverId,
            text: newMessage,
            messageType: "text",
            chatId,
            createdAt: new Date().toISOString(),
        };

        try {
            socket.emit("sendMessage", messageData);
            if (chatId) {
                sendMessage(chatId, messageData);
            } else {
                console.error("chatId is undefined");
            }
            setNewMessage("");
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    return (
        <div className="chatArea-container">
            {/* Chat Header */}
            {selectedGroup ? <GroupChatHeader /> : selectedChat ? <ChatHeader /> : null}

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
                        <div key={msg._id || index}>
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

const GroupChatHeader: React.FC = () => {
    const { selectedGroup } = useGlobalContext();
    if (!selectedGroup) return null;
    return (
        <div className="chatArea-header">
            <div className="chatArea-userInfo">
                <span className="chatArea-userName"># {selectedGroup.groupName || selectedGroup.name}</span>
            </div>
            <div className="chatArea-chatActions">
                <FaPhone className="chatArea-icon" />
                <FaVideo className="chatArea-icon" />
            </div>
        </div>
    );
};

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
const ChatMessage: React.FC<{ message: Message; isSameSender: boolean; isMine: boolean; setReplyTarget?:(msg: Message) => void}> = ({ message, isSameSender, isMine, setReplyTarget }) => {
    const [showActions, setShowActions] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const emojiPickerRef = useRef<HTMLDivElement>(null);
    const { user } = useAuth();

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };
    // Toggle emoji picker
    const toggleEmojiPicker = () => {
        setShowEmojiPicker((prev) => !prev);
    };

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target as Node)) {
                setShowEmojiPicker(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleReact = async (emoji: string) => {
        try {
            if (message._id && user?.userID) {
                await reactToMessage(message._id, user.userID, emoji);
                setShowEmojiPicker(false);
                socket.emit("reactMessage", {
                    messageId: message._id,
                    userId: user.userID,
                    emoji,
                });
            } else {
                console.error("Message ID or User ID is undefined");
            }
            console.log("Reacted with:", emoji);
        } catch (err) {
            console.error("Error reacting:", err);
        } finally {
            setShowEmojiPicker(false);
        }
    };

    const handleStar = async () => {
        try {
            if (message._id && user?.userID) {
                await starMessage(message._id, user.userID);
            } else {
                console.error("Message ID or User ID is undefined");
            }
        } catch (err) {
            console.error("Error starring message:", err);
        }
    };

    const handleForward = async () => {
        const toUserId = prompt("Enter recipient user/group ID:");
        if (!toUserId) return;
        try {
            if (message._id) {
                await forwardMessage(message._id, user?.userID || "", toUserId, false);
            } else {
                console.error("Message ID is undefined");
            }
        } catch (err) {
            console.error("Error forwarding message:", err);
        }
    };

    const handleReply = () => {
        if (setReplyTarget) setReplyTarget(message);
    };

    const handleDeleteMessage = async () => {
        try{
            await deleteMessage((message._id ?? "").toString(), user?.userID ?? "");
            await deleteMessage((message._id ?? "").toString(), user?.userID ?? "");
        } catch (err) {
            console.error("Error deleting message:", err);
        }
    };

    return (
        <div
            className={`chatArea-message ${isMine ? "mine" : "theirs"} ${isSameSender ? "same-sender" : ""}`}
            onMouseEnter={() => setShowActions(true)}
            onMouseLeave={() => setShowActions(false)}
        >
            {!isSameSender && (
                <div className="chatArea-messageHeader">
                    <span className="chatArea-messageSender">{message.senderName}</span>
                </div>
            )}

            <div className="chatArea-messageContent">
                <div className="chatArea-messageBubble">
                    <div className="chatArea-messageText">{message.text}</div>

                    {/* Reactions under message bubble */}
                    {message.reactions && message.reactions.length > 0 && (
                        <div className="chatArea-reactions">
                            {message.reactions.map((reaction, idx) => (
                                <span key={idx} className="chatArea-reaction">
                                    {reaction.emoji}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Timestamp on hover */}
                    {showActions && (
                        <div className="chatArea-messageMeta">
                            <span className="chatArea-messageTimestamp">{formatTime(message.createdAt as string)}</span>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                {showActions && (
                    <div className="chatArea-messageActions">
                        <button className="chatArea-messageAction" onClick={toggleEmojiPicker}>
                            <FaRegSmile size={16} />
                        </button>
                        <button className="chatArea-messageAction"><FaRegStar size={16} /></button>
                        <button className="chatArea-messageAction"><FaShare size={16} /></button>
                        <button className="chatArea-messageAction"><FaReply size={16} /></button>
                        <button className="chatArea-messageAction" onClick={handleDeleteMessage}>
                            <FaTrash size={16} />
                        </button>
                    </div>
                )}

                {/* Emoji Picker Panel */}
                {showEmojiPicker && (
                    <div
                        ref={emojiPickerRef}
                        style={{
                            position: "absolute",
                            bottom: "45px",
                            right: "10px",
                            zIndex: 9999,
                            backgroundColor: "#fff",
                            borderRadius: "8px",
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                        }}
                    >
                        <EmojiPicker onEmojiClick={(emojiData) => handleReact(emojiData.emoji)} />
                    </div>
                )}
            </div>
        </div>
    ); 
};

// Message Input Component
const MessageInput: React.FC<{ newMessage: string; setNewMessage: (msg: string) => void; onSend: () => void; }> = ({ newMessage, setNewMessage, onSend }) => {
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

function updateReactions(reactions: { emoji: string; userId: string }[], userId: string, emoji: string) {
    const existing = reactions.find(r => r.userId === userId);
    if (existing) {
        if (existing.emoji === emoji) {
            // Toggle off if clicked again
            return reactions.filter(r => !(r.userId === userId && r.emoji === emoji));
        }
        // Replace old emoji with new one
        return reactions.map(r => r.userId === userId ? { ...r, emoji } : r);
    }
    // Add new reaction
    return [...reactions, { userId, emoji }];
}


export default ChatArea;
