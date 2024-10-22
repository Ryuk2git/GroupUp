import { useState, useEffect } from 'react';
import ChatArea from './messageComponent';
import '../styles/MainPage.css';

function MemberItem({ member, onClick }) {
  return (
    <div className="member-item" onClick={() => onClick(member)}>
      <img src={member.avatar} alt={member.name} className="member-avatar" />
      <span>{member.name}</span>
    </div>
  );
}

function TitleWithButton({ title, onClick }) {
  return (
    <div className="title-container">
      <div className="title">
        {title}
      </div>
      <div className="add-button" onClick={onClick}>
        <div className="add-icon">+</div>
      </div>
    </div>
  );
}

function MessagePage() {
  const [selectedMember, setSelectedMember] = useState(null);
  const [friends, setFriends] = useState([]); // Changed from members to friends
  const [groups, setGroups] = useState([]); // Added for groups
  const [messages, setMessages] = useState([]); // Store messages for selected member

  useEffect(() => {
    // Fetch friends and groups from the API
    const fetchFriendsAndGroups = async () => {
      try {
        const friendsResponse = await fetch('/api/friends'); // Update with your API endpoint for friends
        const friendsData = await friendsResponse.json();
        setFriends(friendsData.friends);

        const groupsResponse = await fetch('/api/groups'); // Update with your API endpoint for groups
        const groupsData = await groupsResponse.json();
        setGroups(groupsData.groups);
      } catch (error) {
        console.error('Error fetching friends and groups:', error);
      }
    };

    fetchFriendsAndGroups();
  }, []);

  const fetchMessages = async (memberId) => {
    try {
      const response = await fetch(`/api/messages/${memberId}`); // Update with your API endpoint for messages
      const data = await response.json();
      setMessages(data.messages); // Store messages for the selected member
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleMemberClick = (member) => {
    setSelectedMember(member);
    fetchMessages(member.id); // Fetch messages when member is selected
  };

  const addNewMember = async () => {
    const newName = prompt('Enter the name of the new member:');
    if (newName) {
      const newMember = {
        name: newName,
        avatar: 'https://via.placeholder.com/40',
      };

      try {
        const response = await fetch('/api/friends', { // Update with your API endpoint for adding friends
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newMember),
        });

        if (response.ok) {
          const createdMember = await response.json();
          setFriends((prevFriends) => [...prevFriends, createdMember]);
        }
      } catch (error) {
        console.error('Error adding new member:', error);
      }
    }
  };

  const addNewGroup = async () => {
    const newName = prompt('Enter the name of the new group:');
    if (newName) {
      const newGroup = {
        name: newName,
        avatar: 'https://via.placeholder.com/40',
      };

      try {
        const response = await fetch('/api/groups', { // Update with your API endpoint for adding groups
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newGroup),
        });

        if (response.ok) {
          const createdGroup = await response.json();
          setGroups((prevGroups) => [...prevGroups, createdGroup]);
        }
      } catch (error) {
        console.error('Error adding new group:', error);
      }
    }
  };

  return (
    <div className="message-page">
      <div className="members-list">
        <div className="section">
          <TitleWithButton title="Friends" onClick={addNewMember} />
          <div className="member-list-content">
            {friends.map((friend) => (
              <MemberItem
                key={friend.id}
                member={friend}
                onClick={handleMemberClick}
              />
            ))}
          </div>
        </div>
        <div className="section">
          <TitleWithButton title="Groups" onClick={addNewGroup} />
          <div className="member-list-content">
            {groups.map((group) => (
              <MemberItem
                key={group.id}
                member={group}
                onClick={handleMemberClick}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="chat-area">
        {selectedMember ? (
          <ChatArea selectedMember={selectedMember} messages={messages} /> // Pass messages to ChatArea
        ) : (
          <div>Select a member to start chatting</div>
        )}
      </div>
    </div>
  );
}

export default MessagePage;
