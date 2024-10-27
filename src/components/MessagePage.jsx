import { useState, useEffect } from 'react';
import ChatArea from './ChatArea';
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
      <div className="title">{title}</div>
      <div className="add-button" onClick={onClick}>
        <div className="add-icon">+</div>
      </div>
    </div>
  );
}

function MessagePage() {
  const [selectedMember, setSelectedMember] = useState(null);
  const [members, setMembers] = useState([]);
  const [voiceChannels, setVoiceChannels] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch('/api/members');
        if (!response.ok) {
          throw new Error('Failed to fetch members');
        }
        const data = await response.json();
        setMembers(data); // Update this based on the API response structure
      } catch (error) {
        console.error('Error fetching members:', error);
      }
    };

    const fetchVoiceChannels = async () => {
      try {
        const response = await fetch('/api/voiceChannels');
        if (!response.ok) {
          throw new Error('Failed to fetch voice channels');
        }
        const data = await response.json();
        setVoiceChannels(data); // Update this based on the API response structure
      } catch (error) {
        console.error('Error fetching voice channels:', error);
      }
    };

    fetchMembers();
    fetchVoiceChannels();
  }, []);

  useEffect(() => {
    const filtered = members.filter((member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredMembers(filtered);
    setShowDropdown(!!searchQuery && filtered.length > 0);
  }, [searchQuery, members]);

  const handleMemberClick = (member) => {
    setSelectedMember(member);
    setShowDropdown(false); 
    setSearchQuery(''); 
  };

  const addNewMember = async () => {
    const newName = prompt('Enter the name of the new member:');
    if (newName) {
      const newMember = {
        name: newName,
        avatar: 'https://via.placeholder.com/40',
      };

      try {
        const response = await fetch('/api/members', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newMember),
        });

        if (response.ok) {
          const createdMember = await response.json();
          setMembers((prevMembers) => [...prevMembers, createdMember]);
        } else {
          throw new Error('Failed to create new member');
        }
      } catch (error) {
        console.error('Error adding new member:', error);
      }
    }
  };

  const addNewVoiceChannel = async () => {
    const newName = prompt('Enter the name of the new voice channel:');
    if (newName) {
      const newChannel = {
        name: newName,
        avatar: 'https://via.placeholder.com/40',
      };

      try {
        const response = await fetch('/api/voiceChannels', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newChannel),
        });

        if (response.ok) {
          const createdChannel = await response.json();
          setVoiceChannels((prevChannels) => [...prevChannels, createdChannel]);
        } else {
          throw new Error('Failed to create new voice channel');
        }
      } catch (error) {
        console.error('Error adding new voice channel:', error);
      }
    }
  };

  return (
    <div className="message-page">
      <div className="members-list">
        <div className="section">
          <TitleWithButton title="Text Messages" onClick={addNewMember} />
          <div className="member-list-content">
            {members.map((member) => (
              <MemberItem
                key={member.id} // Ensure you're using the correct property for ID
                member={member}
                onClick={handleMemberClick}
              />
            ))}
          </div>
        </div>
        <div className="section">
          <TitleWithButton title="Voice Channels" onClick={addNewVoiceChannel} />
          <div className="member-list-content">
            {voiceChannels.map((channel) => (
              <MemberItem
                key={channel.id} // Ensure you're using the correct property for ID
                member={channel}
                onClick={handleMemberClick}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="chat-area">
        {selectedMember ? (
          <ChatArea selectedMember={selectedMember} />
        ) : (
          <div>Select a member to start chatting</div>
        )}
      </div>
    </div>
  );
}

export default MessagePage;
