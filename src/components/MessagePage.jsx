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
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMembers, setFilteredMembers] = useState([]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch('/api/members'); // Update with your API endpoint
        const data = await response.json();
        setMembers(data.members);
        setFilteredMembers(data.members); // Initialize filtered members
      } catch (error) {
        console.error('Error fetching members:', error);
      }
    };

    const fetchVoiceChannels = async () => {
      try {
        const response = await fetch('/api/voiceChannels'); // Update with your API endpoint
        const data = await response.json();
        setVoiceChannels(data.channels);
      } catch (error) {
        console.error('Error fetching voice channels:', error);
      }
    };

    fetchMembers();
    fetchVoiceChannels();
  }, []);

  useEffect(() => {
    // Check if members and searchTerm are set
    if (members.length > 0 && searchTerm) {
      const results = members.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMembers(results);
    } else {
      setFilteredMembers(members); // Reset filtered members if searchTerm is empty
    }
  }, [searchTerm, members]);

  const handleMemberClick = (member) => {
    setSelectedMember(member);
    setSearchTerm(''); // Clear the search input after selection
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
          setFilteredMembers((prevMembers) => [...prevMembers, createdMember]);
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
        }
      } catch (error) {
        console.error('Error adding new voice channel:', error);
      }
    }
  };

  return (
    <div className="message-page">
      <div className="members-list">
        <input
          type="text"
          placeholder="Search members..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />
        {/* Dropdown for filtered members */}
        {filteredMembers.length > 0 && searchTerm && (
          <div className="dropdown">
            {filteredMembers.map((member) => (
              <MemberItem
                key={member.id}
                member={member}
                onClick={handleMemberClick}
              />
            ))}
          </div>
        )}
        <div className="section">
          <TitleWithButton title="Text Messages" onClick={addNewMember} />
          <div className="member-list-content">
            {filteredMembers.map((member) => (
              <MemberItem
                key={member.id}
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
          <ChatArea selectedMember={selectedMember} />
        ) : (
          <div>Select a member to start chatting</div>
        )}
      </div>
    </div>
  );
}

export default MessagePage;
