import { useState, useEffect } from 'react';
import ChatArea from './ChatArea';
import { fetchMembers, fetchVoiceChannels, addNewMember, addNewVoiceChannel, fetchFriends } from '../utils/api.js'; // Updated imports
import '../styles/MainPage.css';

// Function to handle searched members with the required attributes
function searchedMembers(members, searchQuery) {
  return members.filter((member) =>
    member?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );
}

function MemberItem({ member, friendId, onClick }) {
  return (
    <div className="member-item" onClick={() => onClick(member, friendId)}>
      <img src={member.avatar} alt={member.name} className="member-avatar" />
      <span>{member.name}</span> {/* This will display the friend's name */}
    </div>
  );
}

function TitleWithButton({ title, onClick, showSearch, setShowSearch, onSearchChange, searchQuery }) {
  return (
    <div className="title-container">
      <div className="title">{title}</div>
      <div className="add-button" onClick={() => { onClick(); setShowSearch(!showSearch); }}>
        <div className="add-icon">+</div>
      </div>
      <input
        type="text"
        className={`search-bar ${showSearch ? 'visible' : ''}`} // Toggle the visibility class
        value={searchQuery}
        onChange={onSearchChange}
        placeholder="Search for members..."
        onFocus={() => setShowSearch(true)} // Keep the search bar visible on focus
        onBlur={() => setShowSearch(false)} // Hide on blur if not searching
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
  const [selectedFriendId, setSelectedFriendId] = useState(null); // State for selected friend
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const localToken = localStorage.getItem('token');
  const currentUserId = localStorage.getItem('userID');

  // Load members and friends data
  useEffect(() => {
    const loadMembers = async () => {
      const token = localStorage.getItem('x-auth-token');
      if (!localToken) {
        console.error("No auth token found");
        return;
      }
      const membersData = await fetchMembers();
      setMembers(membersData);
      console.log(membersData);
    };

    const loadFriends = async () => {
      const token = localStorage.getItem('x-auth-token');
      const userID = localStorage.getItem('userID');
      if (!token) {
        console.error("No auth token found");
        return;
      }
      try {
        const friendsData = await fetchFriends(token);
        console.log("Fetched friends:", friendsData); 
        setFriends(friendsData.friends);
      } catch (error) {
        console.error("Failed to load friends:", error);
      }
    };

    loadMembers();
    loadFriends();
  }, [localToken]);

  const handleFriendClick = (friendId) => {
    setSelectedFriendId(friendId); // Update selected friend id when clicked
  };

  // Filter members based on search query
  useEffect(() => {
    const filtered = searchedMembers(members, searchQuery); // Use the searchedMembers function
    setFilteredMembers(filtered);
  }, [searchQuery, members]);

  const handleMemberClick = (member, friendId) => {
    setSelectedMember(member);
    handleFriendClick(friendId);
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
    console.log("Selected FirendID: ", selectedFriendId);

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
                  member={{
                    id: friend.friendId,
                    name: friend.username, // Ensure that 'username' is the correct property from your backend
                    avatar: friend.avatar || 'https://via.placeholder.com/40' // Add avatar if available
                  }} // Ensure the member object matches the structure
                  friendId={friend.friendId}
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
        {selectedFriendId ? (
          <ChatArea 
            selectedMember={selectedMember} 
            currentUserId={currentUserId} // Send currentUserId prop
            selectedFriendId={selectedFriendId} // Pass selected friend ID to ChatArea
          />
        ) : (
          <div>Select a member to start chatting</div>
        )}
      </div>
    </div>
  );
}

export default MessagePage;
