import React from 'react';
import { Users, Search, Volume2, VolumeX, Download, LogOut, Hash } from 'lucide-react';
import './InfoBar.css';

const InfoBar = ({
  room,
  usersCount = 0,
  onToggleMembers,
  onToggleSearch,
  isSearchOpen,
  soundEnabled,
  onToggleSound,
  onExportChat,
  onLeave
}) => {
  return (
    <div className="infoBar">
      <div className="infoBarLeft">
        <div className="roomHashBadge">
          <Hash size={18} />
        </div>
        <div className="roomInfo">
          <div className="roomTitleRow">
            <h2 className="roomTitle">{room}</h2>
            <span className="livePill">
              <span className="livePillDot"></span>
              Live
            </span>
          </div>
          <button
            className="memberCountBtn"
            onClick={onToggleMembers}
            title="Click to view online members"
          >
            <Users size={13} />
            <span>{usersCount} {usersCount === 1 ? 'member' : 'members'} online</span>
          </button>
        </div>
      </div>

      <div className="infoBarRight">
        <button
          className={`infoActionBtn ${isSearchOpen ? 'active' : ''}`}
          onClick={onToggleSearch}
          title={isSearchOpen ? 'Close search' : 'Search messages in this room'}
          aria-label="Search messages"
        >
          <Search size={18} />
        </button>

        <button
          className={`infoActionBtn ${soundEnabled ? '' : 'muted'}`}
          onClick={onToggleSound}
          title={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
          aria-label="Toggle sound effects"
        >
          {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>

        <button
          className="infoActionBtn"
          onClick={onExportChat}
          title="Save & export chat log (.txt)"
          aria-label="Export chat log"
        >
          <Download size={18} />
        </button>

        <button
          className="infoActionBtn membersToggleBtn"
          onClick={onToggleMembers}
          title="View room members"
          aria-label="View members"
        >
          <Users size={18} />
          <span className="membersBtnBadge">{usersCount}</span>
        </button>

        <button
          className="infoActionBtn leaveBtn"
          onClick={onLeave}
          title="Leave room"
          aria-label="Leave room"
        >
          <LogOut size={18} />
        </button>
      </div>
    </div>
  );
};

export default InfoBar;
