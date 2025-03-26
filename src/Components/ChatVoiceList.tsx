import { useState, useEffect } from "react";
import { useSelectionContext } from "../Context/SelectionContext";
import { getFriends, getVoiceChannels } from "../Context/api";

const ChatVoiceList: React.FC = () => {
  const { selectedItem, setSelectedItem } = useSelectionContext();
  const [friends, setFriends] = useState<{ friendId: string; username: string; email: string; pfp: string }[]>([]);
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

  // Handle Friend Selection
  const handleChatSelect = (friend: { friendId: string; username: string; email: string; pfp: string }) => {
    setSelectedItem({ type: "direct-message", data: friend });
  };

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
              className={`main-recent-item ${selectedItem?.data?.friendId === friend.friendId ? "selected" : ""}`}
              onClick={() => handleChatSelect(friend)}
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
