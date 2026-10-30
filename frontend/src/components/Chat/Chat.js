import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import { useLocation, useNavigate } from 'react-router-dom';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import Messages from '../Messages/Messages';
import ActiveUser from '../ActiveUser/ActiveUser';
import ImageLightbox from '../Lightbox/ImageLightbox';
import { compressImage } from '../../utils/imageCompressor';
import { playSentSound, playReceivedSound } from '../../utils/soundEffects';
import { Search, X } from 'lucide-react';
import './Chat.css';

let socket;

function Chat() {
  const location = useLocation();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [isMembersOpen, setIsMembersOpen] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [lightboxSrc, setLightboxSrc] = useState(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const soundEnabledRef = useRef(soundEnabled);
  soundEnabledRef.current = soundEnabled;

  const currentUserNameRef = useRef(name);
  currentUserNameRef.current = name;

  // Determine socket endpoint: prefer REACT_APP_SERVER_URL, or local port 5000, or deployed fallback
  const ENDPOINT =
    process.env.REACT_APP_SERVER_URL ||
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      ? 'http://localhost:5000'
      : 'https://chatappbackend-i5tl.onrender.com');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const queryName = params.get('name');
    const queryRoom = params.get('room');

    if (!queryName || !queryRoom) {
      navigate('/');
      return;
    }

    const trimmedName = queryName.trim();
    const trimmedRoom = queryRoom.trim().toLowerCase();

    setName(trimmedName);
    setRoom(trimmedRoom);

    socket = io(ENDPOINT, {
      transports: ['websocket', 'polling']
    });

    socket.emit('join', { name: trimmedName, room: trimmedRoom }, (error) => {
      if (error) {
        alert(error);
        navigate('/');
      }
    });

    // Message handler: registered once, uses functional state updater
    socket.on('message', (incomingMsg) => {
      setMessages((prev) => [...prev, incomingMsg]);

      const sender = (incomingMsg.user || '').trim().toLowerCase();
      const me = currentUserNameRef.current.trim().toLowerCase();
      if (sender !== me && sender !== 'admin') {
        playReceivedSound(soundEnabledRef.current);
      }
    });

    // Room members update
    socket.on('roomData', (data) => {
      if (data && data.users) {
        setUsers(data.users);
      }
    });

    // Typing indicators
    socket.on('userTyping', ({ user: typingUser, isTyping }) => {
      setTypingUsers((prev) => {
        const next = new Set(prev);
        if (isTyping) next.add(typingUser);
        else next.delete(typingUser);
        return Array.from(next);
      });
    });

    // Reaction updates
    socket.on('messageReaction', ({ messageId, emoji, user: reactingUser }) => {
      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.id !== messageId) return msg;
          const currentReactions = { ...(msg.reactions || {}) };
          const usersForEmoji = currentReactions[emoji] ? [...currentReactions[emoji]] : [];
          const lowerUser = reactingUser.toLowerCase();

          // Toggle reaction
          if (usersForEmoji.includes(lowerUser)) {
            currentReactions[emoji] = usersForEmoji.filter((u) => u !== lowerUser);
            if (currentReactions[emoji].length === 0) delete currentReactions[emoji];
          } else {
            currentReactions[emoji] = [...usersForEmoji, lowerUser];
          }

          return { ...msg, reactions: currentReactions };
        })
      );
    });

    return () => {
      if (socket) {
        socket.disconnect();
        socket.off();
      }
    };
  }, [ENDPOINT, location.search, navigate]);

  // Send regular text message
  const sendMessage = () => {
    if (message.trim() && socket) {
      socket.emit('sendMessage', {
        type: 'text',
        text: message.trim(),
        timestamp: new Date().toISOString()
      }, () => {
        setMessage('');
        playSentSound(soundEnabledRef.current);
      });
    }
  };

  // Send image message (ephemeral base64 Data URL)
  const handleSendImage = (dataUrl, caption = '') => {
    if (socket && dataUrl) {
      socket.emit('sendMessage', {
        type: 'image',
        mediaUrl: dataUrl,
        text: caption ? caption.trim() : '',
        timestamp: new Date().toISOString()
      }, () => {
        playSentSound(soundEnabledRef.current);
      });
    }
  };

  // Send sticker message
  const handleSendSticker = (sticker) => {
    if (socket && sticker) {
      socket.emit('sendMessage', {
        type: 'sticker',
        sticker: { id: sticker.id, name: sticker.name, svg: sticker.svg },
        timestamp: new Date().toISOString()
      }, () => {
        playSentSound(soundEnabledRef.current);
      });
    }
  };

  // Send reaction
  const handleReact = (messageId, emoji) => {
    if (socket && messageId && emoji) {
      socket.emit('messageReaction', { messageId, emoji });
    }
  };

  // Emit typing indicator
  const handleTyping = (isTyping) => {
    if (socket) {
      socket.emit('typing', { isTyping });
    }
  };

  // Drag-and-drop image support onto chat window
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDraggingOver(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const files = e.dataTransfer.files;
    if (files && files[0] && files[0].type.startsWith('image/')) {
      try {
        const compressed = await compressImage(files[0]);
        handleSendImage(compressed);
      } catch (err) {
        alert(err.message || 'Could not process dropped image.');
      }
    }
  };

  // Export chat log as .txt
  const handleExportChat = () => {
    if (messages.length === 0) {
      alert('No messages to export yet.');
      return;
    }
    const logLines = messages.map((m) => {
      const time = m.timestamp ? new Date(m.timestamp).toLocaleTimeString() : '';
      const user = m.user || 'Unknown';
      const content = m.type === 'image'
        ? `[Image Attachment] ${m.text || ''}`
        : m.type === 'sticker'
        ? `[Sticker: ${m.sticker?.name || 'Sticker'}]`
        : m.text;
      return `[${time}] ${user}: ${content}`;
    });

    const blob = new Blob([logLines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PulseChat-${room}-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleLeave = () => {
    if (window.confirm('Are you sure you want to leave this room?')) {
      navigate('/');
    }
  };

  return (
    <div
      className={`chatPageWrapper ${isDraggingOver ? 'draggingActive' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="chatPageGlow glowA"></div>
      <div className="chatPageGlow glowB"></div>

      {/* Drag & drop overlay indicator */}
      {isDraggingOver && (
        <div className="dragDropNotice">
          <div className="dragDropCard">
            <span>📷 Drop image to share instantly in #{room}</span>
          </div>
        </div>
      )}

      {/* Main Chat Container */}
      <div className="chatCardContainer">
        <InfoBar
          room={room}
          usersCount={users.length}
          onToggleMembers={() => setIsMembersOpen((prev) => !prev)}
          onToggleSearch={() => {
            setIsSearchOpen((prev) => !prev);
            if (isSearchOpen) setSearchQuery('');
          }}
          isSearchOpen={isSearchOpen}
          soundEnabled={soundEnabled}
          onToggleSound={() => setSoundEnabled((prev) => !prev)}
          onExportChat={handleExportChat}
          onLeave={handleLeave}
        />

        {/* Inline Search Bar */}
        {isSearchOpen && (
          <div className="inChatSearchBar">
            <Search size={16} className="searchBarIcon" />
            <input
              type="text"
              placeholder="Filter messages in this room..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="inChatSearchInput"
              autoFocus
            />
            {searchQuery && (
              <button
                className="clearSearchBtn"
                onClick={() => setSearchQuery('')}
                title="Clear filter"
              >
                <X size={14} />
              </button>
            )}
          </div>
        )}

        <Messages
          messages={messages}
          currentUser={name}
          typingUsers={typingUsers}
          onReact={handleReact}
          onOpenLightbox={(src) => setLightboxSrc(src)}
          searchQuery={searchQuery}
        />

        <Input
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
          onSendImage={handleSendImage}
          onSendSticker={handleSendSticker}
          onTyping={handleTyping}
        />
      </div>

      {/* Members Drawer Modal */}
      <ActiveUser
        users={users}
        currentUser={name}
        room={room}
        isOpen={isMembersOpen}
        onClose={() => setIsMembersOpen(false)}
      />

      {/* Image Lightbox Modal */}
      {lightboxSrc && (
        <ImageLightbox
          src={lightboxSrc}
          onClose={() => setLightboxSrc(null)}
        />
      )}
    </div>
  );
}

export default Chat;
