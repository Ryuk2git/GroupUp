import React, { useState, useMemo, useEffect } from "react";
// import { useNavigate } from "react-router-dom";

const searchCategories = ["All", "Chats", "Projects", "Files", "Mail", "Tasks", "Events"];

const Topbar: React.FC = () => {
  const [searchCategory, setSearchCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  // const navigate = useNavigate();

  // Mock data for search results
  const searchResults: Record<string, any[]> = {
    All: [
      { id: 1, type: "User", name: "John Doe" },
      { id: 2, type: "Message", name: "Hello, how are you?" },
      { id: 3, type: "Project", name: "Team Collaboration App" },
      { id: 4, type: "File", name: "Project_Docs.pdf" },
      { id: 5, type: "Mail", name: "Meeting invite: Project discussion" },
      { id: 6, type: "Task", name: "Finish API development" },
      { id: 7, type: "Event", name: "Team Standup at 10 AM" },
    ],
    Chats: [{ id: 1, type: "User", name: "John Doe" }, { id: 2, type: "Message", name: "Hello, how are you?" }],
    Projects: [{ id: 3, type: "Project", name: "Team Collaboration App" }],
    Files: [{ id: 4, type: "File", name: "Project_Docs.pdf" }],
    Mail: [{ id: 5, type: "Mail", name: "Meeting invite: Project discussion" }],
    Tasks: [{ id: 6, type: "Task", name: "Finish API development" }],
    Events: [{ id: 7, type: "Event", name: "Team Standup at 10 AM" }],
  };

  // Filter results dynamically
  const filteredResults = useMemo(() => {
    return searchResults[searchCategory].filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, searchCategory]);

  // Show suggestions only if results exist
  useEffect(() => {
    setShowSuggestions(searchQuery.length > 0 && filteredResults.length > 0);
  }, [searchQuery, filteredResults]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSelectSearchResult = (item: any) => {
    console.log("Navigating to:", item);
    setShowSuggestions(false);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleCategorySelect = (category: string) => {
    setSearchCategory(category);
    setDropdownOpen(false);
  };

  return (
    <header className="main-topbar">
      {/* Search Dropdown */}
      <div className="main-search-container">
        <div className="search-dropdown">
          <button className="dropdown-button" onClick={toggleDropdown}>
            {searchCategory} ▼
          </button>
          {dropdownOpen && (
            <ul className="dropdown-menu">
              {searchCategories.map((category) => (
                <li key={category} onClick={() => handleCategorySelect(category)}>
                  {category}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Search Input */}
        <div className="main-topbar-search">
          <input
            type="text"
            placeholder={`Search in ${searchCategory}...`}
            className="main-search-input"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          {showSuggestions && (
            <ul className="search-suggestions">
              {filteredResults.map((item) => (
                <li key={item.id} onClick={() => handleSelectSearchResult(item)}>
                  <strong>{item.type}</strong>: {item.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Icons Section */}
      <div className="main-topbar-icons">
        <button className="main-icon-button">🔔</button>
        <button className="main-icon-button">⚙️</button>
      </div>
    </header>
  );
};

export default Topbar;
