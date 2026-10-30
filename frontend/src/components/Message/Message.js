import React, { useState } from 'react';
import ReactEmoji from 'react-emoji';
import { SmilePlus, Check, Copy } from 'lucide-react';
import { getAvatarInitials, getAvatarGradient } from '../../utils/avatarHelper';
import './Message.css';

const QUICK_REACTIONS = ['👍', '❤️', '😂', '🔥', '🚀', '👏'];

// Helper to format timestamps
const formatTime = (isoString) => {
  if (!isoString) return '';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    return '';
  }
};

// Helper to auto-linkify urls in text
const renderTextWithLinks = (text) => {
  if (!text) return null;
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);

  return parts.map((part, index) => {
    if (part.match(urlRegex)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="messageLink"
          onClick={(e) => e.stopPropagation()}
        >
          {part}
        </a>
      );
    }
    return ReactEmoji.emojify(part);
  });
};

const Message = ({
  message,
  currentUser,
  onReact,
  onOpenLightbox
}) => {
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [copied, setCopied] = useState(false);

  const {
    id,
    user = '',
    text = '',
    type = 'text',
    mediaUrl,
    sticker,
    timestamp,
    reactions = {}
  } = message;

  const currentTrimmed = (currentUser || '').trim().toLowerCase();
  const senderTrimmed = (user || '').trim().toLowerCase();
  const isSentByCurrentUser = senderTrimmed === currentTrimmed;
  const isAdmin = senderTrimmed === 'admin' || type === 'admin';

  // System announcement chip
  if (isAdmin) {
    return (
      <div className="systemMessageRow">
        <div className="systemMessagePill">
          <span>{text}</span>
        </div>
      </div>
    );
  }

  const handleCopyText = () => {
    if (text) {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      });
    }
  };

  const handleReactionClick = (emoji) => {
    if (onReact) {
      onReact(id, emoji);
    }
    setShowReactionPicker(false);
  };

  return (
    <div
      className={`messageRow ${isSentByCurrentUser ? 'justifyEnd' : 'justifyStart'}`}
      onMouseLeave={() => setShowReactionPicker(false)}
    >
      {/* Sender Avatar for incoming messages */}
      {!isSentByCurrentUser && (
        <div
          className="messageAvatar"
          style={{ background: getAvatarGradient(user) }}
          title={user}
        >
          {getAvatarInitials(user)}
        </div>
      )}

      <div className="messageGroup">
        {/* Sender Name (only for incoming messages) */}
        {!isSentByCurrentUser && (
          <span className="messageSenderName">{user}</span>
        )}

        <div className="bubbleWrapper">
          {/* Main Bubble Content */}
          <div
            className={`messageBubble ${
              isSentByCurrentUser ? 'bubbleSent' : 'bubbleReceived'
            } ${type === 'sticker' ? 'bubbleSticker' : ''}`}
          >
            {/* Sticker Type */}
            {type === 'sticker' && sticker && (
              <div
                className="stickerMessageSvg"
                dangerouslySetInnerHTML={{ __html: sticker.svg }}
              />
            )}

            {/* Image Type */}
            {type === 'image' && mediaUrl && (
              <div
                className="messageImageContainer"
                onClick={() => onOpenLightbox && onOpenLightbox(mediaUrl)}
                title="Click to view full image"
              >
                <img src={mediaUrl} alt="Attached media" className="messageImage" />
              </div>
            )}

            {/* Message Text (or Caption) */}
            {text && type !== 'sticker' && (
              <p className="messageBodyText">{renderTextWithLinks(text)}</p>
            )}

            {/* Time Indicator inside bubble */}
            <span className="messageTime">
              {formatTime(timestamp)}
            </span>
          </div>

          {/* Quick Action Floating Bar on Hover */}
          <div className="messageHoverActions">
            <button
              className="quickReactionTrigger"
              onClick={() => setShowReactionPicker((prev) => !prev)}
              title="Add reaction"
            >
              <SmilePlus size={14} />
            </button>
            {text && (
              <button
                className="quickReactionTrigger"
                onClick={handleCopyText}
                title="Copy text"
              >
                {copied ? <Check size={14} className="copiedIcon" /> : <Copy size={14} />}
              </button>
            )}
          </div>

          {/* Floating Emoji Reaction Bar */}
          {showReactionPicker && (
            <div className="reactionPickerPopover">
              {QUICK_REACTIONS.map((emoji) => (
                <button
                  key={emoji}
                  className="quickEmojiBtn"
                  onClick={() => handleReactionClick(emoji)}
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Reaction Badges under Bubble */}
        {reactions && Object.keys(reactions).length > 0 && (
          <div className={`reactionsList ${isSentByCurrentUser ? 'alignEnd' : 'alignStart'}`}>
            {Object.entries(reactions).map(([emoji, userList]) => {
              if (!userList || userList.length === 0) return null;
              const hasReacted = userList.includes(currentTrimmed);
              return (
                <button
                  key={emoji}
                  className={`reactionChip ${hasReacted ? 'hasReacted' : ''}`}
                  onClick={() => handleReactionClick(emoji)}
                  title={userList.join(', ')}
                >
                  <span className="reactionEmoji">{emoji}</span>
                  <span className="reactionCount">{userList.length}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* User Avatar for own messages */}
      {isSentByCurrentUser && (
        <div
          className="messageAvatar"
          style={{ background: getAvatarGradient(currentUser) }}
          title={currentUser}
        >
          {getAvatarInitials(currentUser)}
        </div>
      )}
    </div>
  );
};

export default Message;
