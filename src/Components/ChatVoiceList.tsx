import { useState, useEffect, useRef } from "react";
import { createGroup, getFriends, getVoiceChannels, getGroups } from "../Context/api";
import { useGlobalContext } from "../Context/GlobalProvider";
import { DynamicFormModal } from "./FormModal";

const ChatVoiceList: React.FC = () => {
  const { selectedChat, setSelectedChat } = useGlobalContext();
  const { selectedGroup, setSelectedGroup } = useGlobalContext();
  const [friends, setFriends] = useState<{ chatId: string, friendId: string; username: string; email: string; pfp: string }[]>([]);
  const [showGroupModal, setShowGroupModal] = useState(false); 
  const [voiceChannels, setVoiceChannels] = useState<{ id: string; name: string }[]>([]);
  const [channels, setChannels] = useState<{ id: string; name: string; chatId: string; groupId: string; groupName:string }[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch Friends & Voice Channels
  useEffect(() => {
    const fetchData = async () => {
      try {
        const friendsData = await getFriends();
        const voiceChannelsData = await getVoiceChannels();
        const channelsData = await getGroups();
        setFriends(Array.isArray(friendsData) ? friendsData : []);
        setVoiceChannels(Array.isArray(voiceChannelsData) ? voiceChannelsData : []);
        setChannels(
          Array.isArray(channelsData)
            ? channelsData.map((g) => ({
                id: g.groupId || g.id,
                name: g.groupName || g.name,
                chatId: g.chatId, // <-- preserve the real chatId from backend!
                groupId: g.groupId,
                groupName: g.groupName,
                ...g,
              }))
            : []
        );
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
        setSelectedGroup(null);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [setSelectedChat, setSelectedGroup]);

  // Handle outside click for dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCreateGroup = async (groupData: { name: string; description: string; members: string[] }) => {
    try {
        await createGroup(groupData);
        setShowGroupModal(false);
        // Optionally, refresh group/channel list here if needed
    } catch (err) {
        console.error("Failed to create group", err);
    }
  };

  // Handle Friend Selection
  // const handleChatSelect = (friend: { friendId: string; username: string; email: string; pfp: string }) => {
  //   selectedChat({ type: "direct-message", data: friend });
  // };

  return (
    <>
        {/* Top Action Bar */}
        <div className="chatlist-header">
          <span>Connections</span>
          <div className="chatlist-new-btn" onClick={() => setShowDropdown(!showDropdown)}>
            ＋ New
            {showDropdown && (
              <div className="chatlist-dropdown" ref={dropdownRef}>
                <div className="chatlist-dropdown-item" onClick={() => {
                  setShowGroupModal(true);
                  // setShowGroupModal(false);
                }
                } >New Group</div>
                <div className="chatlist-dropdown-item">New Voice Channel</div>
              </div>
            )}
          </div>
        </div>

        {/* Friends List */}
        <div className="chatlist-section chatlist-scrollable">
          <h4 className="chatlist-title">Direct Messages</h4>
          {friends.length > 0 ? (
            friends.map((friend) => (
              <div
                key={friend.friendId}
                className={`chatlist-item ${selectedChat?.friendId === friend.friendId ? "chatlist-selected" : ""}`}
                onClick={() => {
                  setSelectedChat({ ...friend, userId: friend.friendId });
                  setSelectedGroup(null);
                }}
              >
                <img src={friend.pfp || "/images/default-profile.jpg"} className="chatlist-avatar" />
                <span>{friend.username}</span>
              </div>
            ))
          ) : (
            <p className="chatlist-empty">No friends available</p>
          )}
        </div>

        {/* Channels List */}
        <div className="chatlist-section chatlist-scrollable">
          <h4 className="chatlist-title">Channels</h4>
          {channels.length > 0 ? (
            channels.map((channel) => (
              <div
                key={channel.id}
                className={`chatlist-item ${selectedGroup?.id === channel.id ? "chatlist-selected" : ""}`}
                onClick={() =>{ 
                  setSelectedGroup(channel);
                  console.log(channel);   
                  setSelectedChat(null);
                 }}>
                # {channel.name}
              </div>
            ))
          ) : (
            <p className="chatlist-empty">No channels available</p>
          )}
        </div>

        {/* Voice Channels List */}
        <div className="chatlist-section chatlist-scrollable">
          <h4 className="chatlist-title">Voice Channels</h4>
          {voiceChannels.length > 0 ? (
            voiceChannels.map((channel) => (
              <div key={channel.id} className="chatlist-item">
                🔊 {channel.name}
              </div>
            ))
          ) : (
            <p className="chatlist-empty">No voice channels available</p>
          )}
        </div>

        <DynamicFormModal
          isOpen={showGroupModal}
          onClose={() => setShowGroupModal(false)}
          type="group"
          onSubmit={handleCreateGroup}
      />
    </>
  );
};

export default ChatVoiceList;
