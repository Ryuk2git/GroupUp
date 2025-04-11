import { useState, useEffect } from "react";
import { getFriends, getVoiceChannels } from "../Context/api";
import { useGlobalContext } from "../Context/GlobalProvider";

const ChatVoiceList: React.FC = () => {
  const { selectedChat, setSelectedChat } = useGlobalContext();
  const [friends, setFriends] = useState<{ chatId: string, friendId: string; username: string; email: string; pfp: string }[]>([]);
  const [voiceChannels, setVoiceChannels] = useState<{ id: string; name: string }[]>([]);

  // Fetch Friends & Voice Channels
  useEffect(() => {
    const fetchData = async () => {
      try {
        const friendsData = await getFriends();
        console.log("Friends API Response:", friendsData);

        if (Array.isArray(friendsData)) {
          setFriends(friendsData);
        } else {
          setFriends([]); // Fallback to an empty array
          console.error("Expected an array but got:", friendsData);
        }

        const voiceChannelsData = await getVoiceChannels();
        setVoiceChannels(Array.isArray(voiceChannelsData) ? voiceChannelsData : []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // Handle ESC key to clear selected chat
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedChat(null);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [setSelectedChat]);

  // Handle Friend Selection
  // const handleChatSelect = (friend: { friendId: string; username: string; email: string; pfp: string }) => {
  //   selectedChat({ type: "direct-message", data: friend });
  // };

  return (
    <>
      {/* Friends List */}
      <div className="context-panel-chat">
        <h4>
          Friends
          <button className="add-friend-btn">➕</button>
        </h4>
        {friends.length > 0 ? (
          friends.map((friend) => (
            <div
              key={friend.friendId}
              className={`main-recent-item ${selectedChat?.friendId === friend.friendId ? "selected" : ""}`}
              onClick={() => setSelectedChat(friend)}
            >
              <img src={friend.pfp || "/images/default-profile.jpg"} className="profile-pic" />
              {friend.username}
            </div>
          ))
        ) : (
          <p className="empty-state">No friends available</p>
        )}
      </div>

      {/* Voice Channels List */}
      <div className="context-panel-voice">
        <h4>Voice Channels</h4>
        {voiceChannels.length > 0 ? (
          voiceChannels.map((channel) => (
            <div key={channel.id} className="main-recent-item">
              🔊 {channel.name}
            </div>
          ))
        ) : (
          <p className="empty-state">No voice channels available</p>
        )}
      </div>

      {/* CSS for UI Enhancements */}
      <style>
        {`
          .add-friend-btn {
            background: none;
            border: none;
            cursor: pointer;
            font-size: 1.2em;
            margin-left: 10px;
            color: white;
          }
          .profile-pic {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            margin-right: 8px;
          }
          .empty-state {
            color: #aaa;
            text-align: center;
            font-size: 0.9em;
          }
        `}
      </style>
    </>
  );
};

export default ChatVoiceList;
