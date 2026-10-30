import React, { useState } from 'react';
import { Users, X, Share2, Check } from 'lucide-react';
import { getAvatarInitials, getAvatarGradient } from '../../utils/avatarHelper';
import './ActiveUser.css';

const ActiveUser = ({ users = [], currentUser = '', room = '', isOpen = false, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [filter, setFilter] = useState('');

  if (!isOpen) return null;

  const currentTrimmed = currentUser.trim().toLowerCase();

  const handleShareInvite = () => {
    const inviteUrl = `${window.location.origin}/?room=${encodeURIComponent(room)}`;
    navigator.clipboard.writeText(inviteUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const filteredUsers = users.filter((u) => {
    const name = typeof u === 'string' ? u : u.name;
    return name.toLowerCase().includes(filter.toLowerCase());
  });

  return (
    <div className="membersDrawerOverlay" onClick={onClose}>
      <div className="membersDrawer" onClick={(e) => e.stopPropagation()}>
        <div className="membersHeader">
          <div className="membersHeaderTitle">
            <div className="membersHeaderIcon">
              <Users size={20} />
            </div>
            <div>
              <h3>Room Members</h3>
              <p className="roomSubtitle">#{room} • {users.length} {users.length === 1 ? 'person' : 'people'} online</p>
            </div>
          </div>
          <button className="membersCloseBtn" onClick={onClose} aria-label="Close members drawer">
            <X size={20} />
          </button>
        </div>

        {users.length > 5 && (
          <div className="membersSearchBox">
            <input
              type="text"
              placeholder="Filter members..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="membersSearchInput"
            />
          </div>
        )}

        <div className="membersList">
          {filteredUsers.length === 0 ? (
            <div className="emptyMembers">No members found matching "{filter}"</div>
          ) : (
            filteredUsers.map((u, i) => {
              const userName = typeof u === 'string' ? u : u.name;
              const isMe = userName.trim().toLowerCase() === currentTrimmed;
              return (
                <div key={`${userName}-${i}`} className={`memberItem ${isMe ? 'isMe' : ''}`}>
                  <div
                    className="memberAvatar"
                    style={{ background: getAvatarGradient(userName) }}
                  >
                    <span>{getAvatarInitials(userName)}</span>
                    <span className="onlineDot"></span>
                  </div>
                  <div className="memberDetails">
                    <div className="memberNameRow">
                      <span className="memberName">{userName}</span>
                      {isMe && <span className="youBadge">You</span>}
                    </div>
                    <span className="memberStatus">Active now</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="membersFooter">
          <button className="inviteBtn" onClick={handleShareInvite}>
            {copied ? (
              <>
                <Check size={18} className="checkIcon" />
                <span>Invite Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 size={18} />
                <span>Invite to #{room}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActiveUser;
