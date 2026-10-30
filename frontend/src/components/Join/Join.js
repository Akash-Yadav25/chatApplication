import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MessageSquare, ArrowRight, Sparkles, Hash } from 'lucide-react';
import { getAvatarInitials, getAvatarGradient } from '../../utils/avatarHelper';
import './Join.css';

const ROOM_SUGGESTIONS = ['general', 'gaming', 'tech', 'music', 'chill'];

function Join() {
  const navigate = useNavigate();
  const location = useLocation();

  const [name, setName] = useState('');
  const [room, setRoom] = useState('');

  // Auto-populate room if user clicked an invite link (e.g., /?room=gaming)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const queryRoom = params.get('room');
    if (queryRoom) {
      setRoom(queryRoom);
    }
  }, [location.search]);

  const handleJoin = (e) => {
    if (e) e.preventDefault();
    if (!name.trim() || !room.trim()) return;
    navigate(`/chat?name=${encodeURIComponent(name.trim())}&room=${encodeURIComponent(room.trim())}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleJoin(e);
    }
  };

  const isValid = name.trim().length > 0 && room.trim().length > 0;

  return (
    <div className="joinWrapper">
      <div className="joinGlow glow1"></div>
      <div className="joinGlow glow2"></div>

      <div className="joinCard">
        {/* Header Branding */}
        <div className="joinBrand">
          <div className="joinBrandIcon">
            <MessageSquare size={26} />
          </div>
          <h1 className="joinBrandTitle">PulseChat</h1>
          <p className="joinBrandSubtitle">Fast, ephemeral & private real-time rooms</p>
        </div>

        {/* Live Avatar Preview */}
        <div className="avatarPreviewContainer">
          <div
            className="avatarPreviewBubble"
            style={{ background: getAvatarGradient(name || 'User') }}
          >
            <span>{getAvatarInitials(name || 'User')}</span>
          </div>
          <span className="avatarPreviewText">
            {name.trim() ? `Joining as @${name.trim()}` : 'Type your name to preview avatar'}
          </span>
        </div>

        {/* Form Inputs */}
        <div className="joinForm">
          <div className="inputGroup">
            <label className="inputLabel">Your Display Name</label>
            <input
              className="styledJoinInput"
              type="text"
              placeholder="e.g. Alex"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyDown}
              maxLength={24}
              autoFocus
            />
          </div>

          <div className="inputGroup">
            <label className="inputLabel">Room Name</label>
            <div className="roomInputWrapper">
              <span className="roomInputPrefix">#</span>
              <input
                className="styledJoinInput withPrefix"
                type="text"
                placeholder="e.g. lounge"
                value={room}
                onChange={(e) => setRoom(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                onKeyDown={handleKeyDown}
                maxLength={28}
              />
            </div>
          </div>

          {/* Quick Room Suggestions */}
          <div className="suggestionsSection">
            <span className="suggestionsLabel">
              <Sparkles size={12} /> Popular Rooms:
            </span>
            <div className="suggestionsRow">
              {ROOM_SUGGESTIONS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className={`suggestionChip ${room === tag ? 'activeChip' : ''}`}
                  onClick={() => setRoom(tag)}
                >
                  <Hash size={11} />
                  <span>{tag}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="button"
            className={`joinSubmitBtn ${isValid ? 'ready' : ''}`}
            onClick={handleJoin}
            disabled={!isValid}
          >
            <span>Enter Room</span>
            <ArrowRight size={18} />
          </button>
        </div>

        <div className="joinFooterNote">
          <span>🔒 Ephemeral session: zero messages or files stored on backend servers.</span>
        </div>
      </div>
    </div>
  );
}

export default Join;
