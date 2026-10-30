import React, { useState, useRef, useEffect } from 'react';
import EmojiPicker, { Theme } from 'emoji-picker-react';
import { Smile, Image as ImageIcon, Send, Sparkles, X } from 'lucide-react';
import { compressImage } from '../../utils/imageCompressor';
import { STICKERS } from '../../utils/stickers';
import './Input.css';

const Input = ({
  message,
  setMessage,
  sendMessage,
  onSendImage,
  onSendSticker,
  onTyping
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showStickers, setShowStickers] = useState(false);
  const [stagedImage, setStagedImage] = useState(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const fileInputRef = useRef(null);
  const inputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const pickerRef = useRef(null);

  // Close emoji/sticker panels when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setShowEmojiPicker(false);
        setShowStickers(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle typing indicator trigger
  const handleInputChange = (e) => {
    setMessage(e.target.value);

    if (onTyping) {
      onTyping(true);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        onTyping(false);
      }, 1500);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Process image compression
  const processImageFile = async (file) => {
    if (!file) return;
    try {
      setUploadError('');
      setIsCompressing(true);
      const compressedDataUrl = await compressImage(file);
      setStagedImage(compressedDataUrl);
      setIsCompressing(false);
    } catch (err) {
      setIsCompressing(false);
      setUploadError(err.message || 'Failed to process image');
      setTimeout(() => setUploadError(''), 4000);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      processImageFile(file);
    }
    // reset input so same file can be re-selected if cancelled
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Support pasting image from clipboard (Cmd+V / Ctrl+V)
  const handlePaste = (e) => {
    const items = e.clipboardData && e.clipboardData.items;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            e.preventDefault();
            processImageFile(file);
            break;
          }
        }
      }
    }
  };

  const handleSend = () => {
    if (onTyping) {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      onTyping(false);
    }

    if (stagedImage) {
      if (onSendImage) {
        onSendImage(stagedImage, message);
      }
      setStagedImage(null);
      setMessage('');
      return;
    }

    if (message.trim()) {
      sendMessage();
    }
  };

  const handleEmojiClick = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleStickerClick = (sticker) => {
    if (onSendSticker) {
      onSendSticker(sticker);
    }
    setShowStickers(false);
  };

  return (
    <div className="inputContainer" ref={pickerRef} onPaste={handlePaste}>
      {/* Upload Error Banner */}
      {uploadError && (
        <div className="uploadErrorBanner">
          <span>{uploadError}</span>
          <button onClick={() => setUploadError('')}><X size={14} /></button>
        </div>
      )}

      {/* Staged Image Preview */}
      {stagedImage && (
        <div className="stagedImagePreview">
          <div className="stagedImageThumbWrapper">
            <img src={stagedImage} alt="Attachment preview" className="stagedImageThumb" />
            <button
              className="removeStagedBtn"
              onClick={() => setStagedImage(null)}
              title="Remove attachment"
            >
              <X size={14} />
            </button>
          </div>
          <span className="stagedImageCaption">
            Ready to send. Add an optional caption below and press Send.
          </span>
        </div>
      )}

      {/* Emoji Picker Popover */}
      {showEmojiPicker && (
        <div className="popoverPanel emojiPickerPopover">
          <EmojiPicker
            theme={Theme.DARK}
            onEmojiClick={handleEmojiClick}
            lazyLoadEmojis={true}
            searchDisabled={false}
            width={320}
            height={380}
          />
        </div>
      )}

      {/* Sticker Drawer Popover */}
      {showStickers && (
        <div className="popoverPanel stickerPickerPopover">
          <div className="stickerPopoverHeader">
            <span>Stickers</span>
            <button onClick={() => setShowStickers(false)} className="closePopoverBtn">
              <X size={16} />
            </button>
          </div>
          <div className="stickerGrid">
            {STICKERS.map((sticker) => (
              <button
                key={sticker.id}
                className="stickerGridItem"
                onClick={() => handleStickerClick(sticker)}
                title={sticker.name}
              >
                <div
                  className="stickerSvgWrapper"
                  dangerouslySetInnerHTML={{ __html: sticker.svg }}
                />
                <span className="stickerLabel">{sticker.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Bar */}
      <div className="inputBar">
        <div className="inputActionsLeft">
          <button
            type="button"
            className={`actionIconBtn ${showEmojiPicker ? 'active' : ''}`}
            onClick={() => {
              setShowEmojiPicker((prev) => !prev);
              setShowStickers(false);
            }}
            title="Insert Emoji"
          >
            <Smile size={20} />
          </button>

          <button
            type="button"
            className={`actionIconBtn ${showStickers ? 'active' : ''}`}
            onClick={() => {
              setShowStickers((prev) => !prev);
              setShowEmojiPicker(false);
            }}
            title="Send Sticker"
          >
            <Sparkles size={20} />
          </button>

          <button
            type="button"
            className="actionIconBtn"
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            title="Attach Image (or paste with Ctrl+V)"
            disabled={isCompressing}
          >
            <ImageIcon size={20} />
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </div>

        <input
          ref={inputRef}
          className="chatTextInput"
          type="text"
          placeholder={
            isCompressing
              ? 'Processing image...'
              : stagedImage
              ? 'Add an image caption...'
              : 'Type a message... (Press Enter to send)'
          }
          value={message}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          disabled={isCompressing}
        />

        <button
          type="button"
          className={`sendActionBtn ${(message.trim() || stagedImage) ? 'canSend' : ''}`}
          onClick={handleSend}
          disabled={!message.trim() && !stagedImage}
          title="Send message"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default Input;
