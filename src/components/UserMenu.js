import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  IconUser, 
  IconSettings, 
  IconLogout, 
  IconChevronDown,
  IconDashboard,
  IconBell
} from '@tabler/icons-react';

export default function UserMenu() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/');
  };

  const handleMenuClick = (action) => {
    setIsOpen(false);
    action();
  };

  if (!user) return null;

  return (
    <div className="user-menu" ref={menuRef}>
      <button 
        className="user-menu-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        <img 
          src={user.avatar || '/example.png'} 
          alt={user.name || 'User'}
          className="user-avatar"
        />
        <span className="user-name">{user.name}</span>
        <IconChevronDown 
          size={16} 
          style={{ 
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
            transition: 'transform 0.2s ease'
          }} 
        />
      </button>

      {isOpen && (
        <div className="user-menu-dropdown">
          <button 
            className="user-menu-item"
            onClick={() => handleMenuClick(() => navigate('/dashboard'))}
          >
            <IconDashboard size={18} />
            Dashboard
          </button>
          
          <button 
            className="user-menu-item"
            onClick={() => handleMenuClick(() => navigate('/dashboard/profile'))}
          >
            <IconUser size={18} />
            Profile
          </button>
          
          <button 
            className="user-menu-item"
            onClick={() => handleMenuClick(() => navigate('/dashboard/notifications'))}
          >
            <IconBell size={18} />
            Notifications
          </button>
          
          <button 
            className="user-menu-item"
            onClick={() => handleMenuClick(() => navigate('/dashboard/settings'))}
          >
            <IconSettings size={18} />
            Settings
          </button>
          
          <button 
            className="user-menu-item logout"
            onClick={handleLogout}
          >
            <IconLogout size={18} />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}