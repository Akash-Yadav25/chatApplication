import React, { useEffect } from 'react';
import { X, Download } from 'lucide-react';
import './ImageLightbox.css';

const ImageLightbox = ({ src, onClose, alt = 'Shared Image' }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!src) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = src;
    link.download = `chat-image-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="lightboxOverlay" onClick={onClose}>
      <div className="lightboxContent" onClick={(e) => e.stopPropagation()}>
        <div className="lightboxToolbar">
          <button className="lightboxBtn" onClick={handleDownload} title="Download image">
            <Download size={20} />
            <span>Download</span>
          </button>
          <button className="lightboxBtn closeBtn" onClick={onClose} title="Close (Esc)">
            <X size={22} />
          </button>
        </div>
        <img className="lightboxImage" src={src} alt={alt} />
      </div>
    </div>
  );
};

export default ImageLightbox;
