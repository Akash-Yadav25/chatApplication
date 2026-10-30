/**
 * Curated crisp SVG sticker presets for expressive messaging.
 * Purely client-side rendered with zero network lag or backend storage.
 */

export const STICKERS = [
  {
    id: 'party-celebrate',
    name: 'Party',
    emoji: '🎉',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="partyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FF512F"/>
          <stop offset="100%" stop-color="#DD2476"/>
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="45" fill="url(#partyGrad)"/>
      <path d="M30 65 Q50 82 70 65" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round" fill="none"/>
      <circle cx="34" cy="40" r="7" fill="#FFFFFF"/>
      <circle cx="66" cy="40" r="7" fill="#FFFFFF"/>
      <polygon points="50,10 56,26 73,26 59,36 64,52 50,42 36,52 41,36 27,26 44,26" fill="#FEE140"/>
    </svg>`
  },
  {
    id: 'fire-lit',
    name: 'Fire',
    emoji: '🔥',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="fireGrad" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stop-color="#FF0844"/>
          <stop offset="100%" stop-color="#FFB199"/>
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="45" fill="#1e1b4b"/>
      <path d="M50 15 C35 35 25 50 25 65 C25 80 37 88 50 88 C63 88 75 80 75 65 C75 50 62 38 50 15 Z" fill="url(#fireGrad)"/>
      <path d="M50 45 C42 55 38 64 38 72 C38 80 43 83 50 83 C57 83 62 80 62 72 C62 64 55 57 50 45 Z" fill="#FEE140"/>
    </svg>`
  },
  {
    id: 'mind-blown',
    name: 'Mind Blown',
    emoji: '🤯',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="cosmicGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#6a11cb"/>
          <stop offset="100%" stop-color="#2575fc"/>
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="45" fill="url(#cosmicGrad)"/>
      <ellipse cx="50" cy="62" rx="30" ry="25" fill="#FFCC4D"/>
      <path d="M22 48 Q50 15 78 48 Z" fill="#FF5E62"/>
      <circle cx="38" cy="62" r="5" fill="#292F33"/>
      <circle cx="62" cy="62" r="5" fill="#292F33"/>
      <ellipse cx="50" cy="76" rx="8" ry="6" fill="#662113"/>
      <polygon points="50,15 54,24 64,24 56,30 59,39 50,33 41,39 44,30 36,24 46,24" fill="#FFF"/>
    </svg>`
  },
  {
    id: 'cool-shades',
    name: 'Cool',
    emoji: '😎',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="coolGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#00c6ff"/>
          <stop offset="100%" stop-color="#0072ff"/>
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="45" fill="url(#coolGrad)"/>
      <circle cx="50" cy="50" r="38" fill="#FFD93D"/>
      <!-- Shades -->
      <path d="M24 42 L46 42 L42 56 L26 56 Z" fill="#1A1A1A"/>
      <path d="M54 42 L76 42 L74 56 L58 56 Z" fill="#1A1A1A"/>
      <line x1="46" y1="45" x2="54" y2="45" stroke="#1A1A1A" stroke-width="4"/>
      <!-- Smirk -->
      <path d="M35 68 Q50 80 65 68" stroke="#1A1A1A" stroke-width="4" stroke-linecap="round" fill="none"/>
    </svg>`
  },
  {
    id: 'super-love',
    name: 'Love',
    emoji: '💖',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="loveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#f857a6"/>
          <stop offset="100%" stop-color="#ff5858"/>
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="45" fill="#FFE5EC"/>
      <path d="M50 78 C25 60 15 45 15 32 C15 20 25 15 35 15 C42 15 47 20 50 25 C53 20 58 15 65 15 C75 15 85 20 85 32 C85 45 75 60 50 78 Z" fill="url(#loveGrad)"/>
      <circle cx="35" cy="28" r="4" fill="#FFFFFF" opacity="0.6"/>
    </svg>`
  },
  {
    id: 'rocket-ship',
    name: 'Rocket',
    emoji: '🚀',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="spaceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0f2027"/>
          <stop offset="50%" stop-color="#203a43"/>
          <stop offset="100%" stop-color="#2c5364"/>
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="45" fill="url(#spaceGrad)"/>
      <path d="M50 18 Q62 38 60 58 L40 58 Q38 38 50 18 Z" fill="#F8F9FA"/>
      <path d="M50 18 Q55 30 50 38 Q45 30 50 18 Z" fill="#EF4444"/>
      <circle cx="50" cy="46" r="5" fill="#3B82F6"/>
      <polygon points="40,58 32,68 40,66" fill="#DC2626"/>
      <polygon points="60,58 68,68 60,66" fill="#DC2626"/>
      <polygon points="44,58 50,78 56,58" fill="#F59E0B"/>
    </svg>`
  },
  {
    id: 'thumbs-up',
    name: 'Great Job',
    emoji: '👍',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="thumbGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#10B981"/>
          <stop offset="100%" stop-color="#059669"/>
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="45" fill="url(#thumbGrad)"/>
      <path d="M38 72 L38 52 M38 52 C38 46 45 42 45 34 C45 28 47 24 50 24 C53 24 55 27 55 32 L53 45 L68 45 C73 45 76 49 75 54 L72 68 C71 72 67 74 63 74 L38 74 Z" 
        stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="#FFFFFF"/>
    </svg>`
  },
  {
    id: 'ghost-boo',
    name: 'Boo!',
    emoji: '👻',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="ghostGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#312E81"/>
          <stop offset="100%" stop-color="#1E1B4B"/>
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="45" fill="url(#ghostGrad)"/>
      <path d="M30 65 L30 45 C30 32 38 25 50 25 C62 25 70 32 70 45 L70 65 Q65 72 60 65 Q55 72 50 65 Q45 72 40 65 Q35 72 30 65 Z" fill="#FFFFFF"/>
      <circle cx="43" cy="42" r="4" fill="#1E1B4B"/>
      <circle cx="57" cy="42" r="4" fill="#1E1B4B"/>
      <ellipse cx="50" cy="52" rx="3" ry="5" fill="#1E1B4B"/>
    </svg>`
  }
];
