import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { debounce } from "lodash";
import axios from "axios";
import { fetchNotifications, markNotificationAsRead, deleteNotification, deleteAllNotifications } from "../Context/api";
import { useAuth } from "../Context/AuthContext";
import SearchResultTile from "./searchResultTile";

const searchCategories = ["All", "Chats", "Projects", "Files", "Mail", "Tasks", "Events"];

const Topbar: React.FC = () => {
  const { user } = useAuth();
  const userId = user?.userID;

  // Search states
  const [searchCategory, setSearchCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchError, setSearchError] = useState<string>("");

  // Notification states
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState<boolean>(false);

  // Refs
  const searchDropdownRef = useRef<HTMLDivElement>(null);
  const notificationDropdownRef = useRef<HTMLDivElement>(null);
  const cancelTokenSource = useRef(axios.CancelToken.source());

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (query: string, category: string) => {
      if (!query.trim()) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      try {
        setIsSearching(true);
        setSearchError("");

        console.log("Search Category is: ", searchCategory)
        const response = await axios.get(`http://localhost:3000/api/search`, {
          params: { query, category },
          cancelToken: cancelTokenSource.current.token,
        });

        const { users = [], projects = [], files = [], tasks = [], events = [] } = response.data;
        const flattenedResults = [
          ...users.map((user: any) => ({ type: "User", ...user })),
          ...projects.map((project: any) => ({ type: "Project", ...project })),
          ...files.map((file: any) => ({ type: "File", ...file })),
          ...tasks.map((task: any) => ({ type: "Task", ...task })),
          ...events.map((event: any) => ({ type: "Event", ...event })),
        ];

        setSearchResults(flattenedResults);
        setShowSuggestions(flattenedResults.length > 0);
      } catch (error) {
        if (!axios.isCancel(error)) {
          setSearchError("Failed to fetch search results");
          console.error("Search error:", error);
        }
      } finally {
        setIsSearching(false);
      }
    }, 300),
    []
  );

  // Handle search input changes
  useEffect(() => {
    cancelTokenSource.current.cancel("Operation canceled due to new request");
    cancelTokenSource.current = axios.CancelToken.source();

    console.log("Search Category is: ", searchCategory);
    debouncedSearch(searchQuery, searchCategory);

    return () => {
      debouncedSearch.cancel();
    };
  }, [searchQuery, searchCategory]);

  // Fetch notifications
  useEffect(() => {
    const loadNotifications = async () => {
      if (!userId) return;
      try {
        const data = await fetchNotifications(userId);
        setNotifications(data || []);
      } catch (error) {
        console.error("Error loading notifications:", error);
      }
    };
    loadNotifications();
  }, [userId]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchDropdownRef.current && !searchDropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
        setShowSuggestions(false);
      }
      if (notificationDropdownRef.current && !notificationDropdownRef.current.contains(event.target as Node)) {
        setShowNotificationDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShowSuggestions(true);
  };

  const handleSelectSearchResult = (item: any) => {
    console.log("Navigating to:", item);
    setShowSuggestions(false);
    setSearchQuery("");
  };

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  const handleCategorySelect = (category: string) => {
    setSearchCategory(category);
    setDropdownOpen(false);
    setSearchQuery("");
  };

  const toggleNotificationDropdown = () => setShowNotificationDropdown((prev) => !prev);

  const handleMarkAsRead = async (notificationId: string) => {
    if (!userId) return;
    try {
      await markNotificationAsRead(userId, notificationId);
      setNotifications((prev) =>
        prev.map((notif) => (notif._id === notificationId ? { ...notif, read: true } : notif))
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    if (!userId) return;
    try {
      await deleteNotification(userId, notificationId);
      setNotifications((prev) => prev.filter((notif) => notif._id !== notificationId));
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const handleDeleteAllNotifications = async () => {
    if (!userId) return;
    try {
      await deleteAllNotifications(userId);
      setNotifications([]);
    } catch (error) {
      console.error("Error clearing notifications:", error);
    }
  };

  return (
    <header className="main-topbar">
      <div className="main-search-container">
        <div className="search-dropdown" ref={searchDropdownRef}>
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

        <div className="main-topbar-search">
          <input
            type="text"
            placeholder={`Search in ${searchCategory}...`}
            className="main-search-input"
            value={searchQuery}
            onChange={handleSearchChange}
            aria-label="Search input"
          />
          {showSuggestions && (
            <ul className="search-suggestions">
              {isSearching ? (
                <li>Searching...</li>
              ) : searchResults.length > 0 ? (
                searchResults.map((item, index) => (
                  <SearchResultTile key={index} item={item} onSelect={handleSelectSearchResult} />
                ))
              ) : (
                <li>No results found</li>
              )}
            </ul>
          )}
        </div>
      </div>

      <div className="main-topbar-icons">
        <button className="main-icon-button" onClick={toggleNotificationDropdown}>
          🔔 {notifications.length > 0 && <span className="user-notification-badge">{notifications.length}</span>}
        </button>

        {showNotificationDropdown && (
          <div className="user-notification-container">
            <div className="user-notification-dropdown" ref={notificationDropdownRef}>
              <div className="user-notification-header">
                <button className="user-noitification-clear" onClick={handleDeleteAllNotifications}>Clear All</button>
              </div>
              <ul>
                {notifications.length > 0 ? notifications.map((notif) => (
                  <li key={notif._id} className={notif.read ? "" : "unread"}>
                    <span onClick={() => handleMarkAsRead(notif._id)}>{notif.message}</span>
                    <button onClick={() => handleDeleteNotification(notif._id)}>✖</button>
                  </li>
                )) : <li>No notifications</li>}
              </ul>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Topbar;
