import { useState, useEffect } from 'react';
import ChatArea from './ChatArea';
import { fetchMembers, fetchVoiceChannels, addNewMember, addNewVoiceChannel, fetchFriends } from '../utils/api.js'; // Updated imports
import '../styles/MainPage.css';

function MemberItem({ member, onClick }) {
  return (
    <div className="member-item" onClick={() => onClick(member)}>
      <img src={member.avatar} alt={member.name} className="member-avatar" />
      <span>{member.name}</span>
    </div>
  );
}

function TitleWithButton({ title, onClick, showSearch, setShowSearch, onSearchChange, searchQuery }) {
  return (
    <div className="title-container">
      <div className="title">{title}</div>
      <div className="add-button" onClick={onClick}>
        <div className="add-icon">+</div>
      </div>
      <input
        type="text"
        className={`search-bar ${showSearch ? 'visible' : ''}`} // Use conditional class
        value={searchQuery}
        onChange={onSearchChange}
        placeholder="Search for members..."
        onFocus={() => setShowSearch(true)} // Show on focus
        onBlur={() => setShowSearch(false)} // Hide on blur
      />
    </div>
  );
}

function MessagePage({ userProfile }) {
  const [selectedMember, setSelectedMember] = useState(null);
  const [members, setMembers] = useState([]);
  const [voiceChannels, setVoiceChannels] = useState([]);
  const [friends, setFriends] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const localToken = localStorage.getItem('token');

  useEffect(() => {
    const loadMembers = async () => {
      const token = localStorage.getItem('token');
      if (!localToken) {
        console.error("No auth token found");
        return;
      }
      const membersData = await fetchMembers();
      setMembers(membersData);
    };

    // const loadVoiceChannels = async () => {
    //   const channelsData = await fetchVoiceChannels();
    //   setVoiceChannels(channelsData);
    // };

    const loadFriends = async () => {
      const token = localStorage.getItem('token'); // Retrieve the token
      const userID = localStorage.getItem('userID');
      if (!token) {
          console.error("No auth token found");
          return;
      }
      try {
          const friendsData = await fetchFriends(token); // Pass token to fetchFriends
          setFriends(friendsData.friends);
      } catch (error) {
          console.error("Failed to load friends:", error);
      }
  };

    loadMembers();
    // loadVoiceChannels();
    loadFriends();
  }, [localToken]);

  useEffect(() => {
    const filtered = members.filter((member) =>
      member?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredMembers(filtered);
  }, [searchQuery, members]);

  const handleMemberClick = (member) => {
    setSelectedMember(member);
    setSearchQuery('');
    setShowSearch(false);
  };

  const handleAddNewMember = async () => {
    if (searchQuery) {
      const newMember = {
        name: searchQuery,
        avatar: 'https://via.placeholder.com/40',
      };

      const createdMember = await addNewMember(newMember);
      if (createdMember) {
        setMembers((prevMembers) => [...prevMembers, createdMember]);
        setSearchQuery(''); // Clear the search query
        setShowSearch(false); // Hide the search bar
      }
    }
  };

  const handleAddNewVoiceChannel = async () => {
    if (searchQuery) {
      const newChannel = {
        name: searchQuery,
        avatar: 'https://via.placeholder.com/40',
      };

      const createdChannel = await addNewVoiceChannel(newChannel);
      if (createdChannel) {
        setVoiceChannels((prevChannels) => [...prevChannels, createdChannel]);
        setSearchQuery(''); // Clear the search query
        setShowSearch(false); // Hide the search bar
      }
    }
  };

  return (
    <div className="message-page">
      <div className="members-list">
        <div className="section">
          <TitleWithButton 
            title="Text Messages" 
            onClick={() => { setShowSearch(!showSearch); handleAddNewMember(); }} 
            showSearch={showSearch} 
            setShowSearch={setShowSearch} // Pass setShowSearch for handling visibility
            onSearchChange={(e) => setSearchQuery(e.target.value)} 
            searchQuery={searchQuery} 
          />
          <div className="member-list-content">
            {friends.length > 0 ? (
              friends.map((friend) => (
                <MemberItem
                  key={friend.friendId} // Assuming friendId is unique
                  member={{ id: friend.friendId, name: friend.name, avatar: friend.avatar }} // Ensure the member object matches the structure
                  onClick={handleMemberClick}
                />
              ))
            ) : (
              <div className="no-friends-message">Sounds quiet. Add Friends!</div> // Message when no friends
            )}
          </div>
        </div>
        <div className="section">
          <TitleWithButton 
            title="Voice Channels" 
            onClick={() => { setShowSearch(!showSearch); handleAddNewVoiceChannel(); }} 
            showSearch={showSearch} 
            setShowSearch={setShowSearch} // Pass setShowSearch for handling visibility
            onSearchChange={(e) => setSearchQuery(e.target.value)} 
            searchQuery={searchQuery} 
          />
          <div className="member-list-content">
            {voiceChannels.map((channel) => (
              <MemberItem
                key={channel.id}
                member={channel}
                onClick={handleMemberClick}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="chat-area">
        {selectedMember ? (
          <ChatArea selectedMember={selectedMember} userProfile={userProfile} />
        ) : (
          <div>Select a member to start chatting</div>
        )}
      </div>
    </div>
  );
}

export default MessagePage;
