import React from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';
import Message from '../Message/Message';
import './Messages.css';

const Messages = ({
  messages = [],
  currentUser = '',
  typingUsers = [],
  onReact,
  onOpenLightbox,
  searchQuery = ''
}) => {
  // Filter messages if search query is active
  const filteredMessages = searchQuery
    ? messages.filter((m) => {
        const text = m.text || '';
        const user = m.user || '';
        const q = searchQuery.toLowerCase();
        return text.toLowerCase().includes(q) || user.toLowerCase().includes(q);
      })
    : messages;

  const currentTrimmed = (currentUser || '').trim().toLowerCase();
  const othersTyping = typingUsers.filter(
    (name) => (name || '').trim().toLowerCase() !== currentTrimmed
  );

  return (
    <div className="messagesOuterWrapper">
      {searchQuery && (
        <div className="searchStatusBanner">
          <span>Found {filteredMessages.length} results for "{searchQuery}"</span>
        </div>
      )}

      <ScrollToBottom className="messagesContainer" followButtonClassName="scrollFollowBtn">
        {filteredMessages.length === 0 ? (
          <div className="emptyChatState">
            {searchQuery ? (
              <p>No messages match your search.</p>
            ) : (
              <div className="emptyWelcome">
                <span className="emptyWave">👋</span>
                <h4>Welcome to the chat!</h4>
                <p>No messages yet. Say hello or share an image to get the conversation started.</p>
              </div>
            )}
          </div>
        ) : (
          filteredMessages.map((message, i) => (
            <Message
              key={message.id || i}
              message={message}
              currentUser={currentUser}
              onReact={onReact}
              onOpenLightbox={onOpenLightbox}
            />
          ))
        )}

        {/* Animated Typing Indicator */}
        {othersTyping.length > 0 && (
          <div className="typingIndicatorRow">
            <div className="typingBubble">
              <span className="typingText">
                {othersTyping.length === 1
                  ? `${othersTyping[0]} is typing`
                  : othersTyping.length === 2
                  ? `${othersTyping[0]} and ${othersTyping[1]} are typing`
                  : `${othersTyping.length} people are typing`}
              </span>
              <div className="typingDots">
                <span className="typingDot"></span>
                <span className="typingDot"></span>
                <span className="typingDot"></span>
              </div>
            </div>
          </div>
        )}
      </ScrollToBottom>
    </div>
  );
};

export default Messages;
