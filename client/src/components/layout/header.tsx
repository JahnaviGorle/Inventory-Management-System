import { useState } from "react";
import { Search, Bell, User, Settings } from "lucide-react";
import { useNotifications } from "@/context/notifications";

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAllNotifications } = useNotifications();

  return (
    <header className="header">
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search products, SKUs, categories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Search className="search-icon" />
      </div>
      
      <div className="header-actions">
        <button 
          className="notification-btn"
          onClick={() => setShowNotifications(!showNotifications)}
        >
          <Bell size={20} />
          {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
        </button>
        
        {/* Notifications Dropdown */}
        {showNotifications && (
          <div className="notification-dropdown">
            <div className="notification-header">
              <h3>Notifications</h3>
              <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                {unreadCount > 0 && (
                  <button 
                    className="btn btn-sm btn-secondary"
                    onClick={markAllAsRead}
                  >
                    Mark all read
                  </button>
                )}
                {notifications.length > 0 && (
                  <button 
                    className="btn btn-sm btn-danger"
                    onClick={clearAllNotifications}
                  >
                    Clear all
                  </button>
                )}
              </div>
            </div>
            <div className="notification-list">
              {notifications.length === 0 ? (
                <div className="notification-item">
                  <p>No notifications</p>
                </div>
              ) : (
                notifications.slice(0, 10).map(notification => (
                  <div 
                    key={notification.id} 
                    className={`notification-item ${!notification.read ? 'unread' : ''}`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="notification-content">
                      <h4>{notification.title}</h4>
                      <p>{notification.message}</p>
                      <small>{notification.timestamp.toLocaleTimeString()}</small>
                    </div>
                    <div className={`notification-type ${notification.type}`} />
                  </div>
                ))
              )}
            </div>
          </div>
        )}
        
        <div 
          className="user-profile"
          onClick={() => setShowUserMenu(!showUserMenu)}
        >
          <User size={20} />
          <span className="font-medium">Admin User</span>
        </div>

        {/* User Menu Dropdown */}
        {showUserMenu && (
          <div className="user-menu-dropdown">
            <div className="user-menu-item">
              <User size={16} />
              <span>Profile</span>
            </div>
            <div className="user-menu-item">
              <Settings size={16} />
              <span>Settings</span>
            </div>
            <div className="user-menu-item">
              <span>🚪</span>
              <span>Logout</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
