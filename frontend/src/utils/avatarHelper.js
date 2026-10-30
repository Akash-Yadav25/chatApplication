/**
 * Generates initials and deterministic gradient colors based on username.
 */

const PALETTES = [
  ['#4f46e5', '#7c3aed'], // Indigo -> Violet
  ['#2563eb', '#38bdf8'], // Blue -> Sky
  ['#059669', '#10b981'], // Emerald -> Teal
  ['#d97706', '#fbbf24'], // Amber -> Yellow
  ['#dc2626', '#f43f5e'], // Red -> Rose
  ['#7c3aed', '#c084fc'], // Purple -> Fuchsia
  ['#0d9488', '#2dd4bf'], // Teal -> Cyan
  ['#db2777', '#f472b6'], // Pink -> Rose
  ['#ea580c', '#fb923c'], // Orange -> Peach
];

export const getAvatarInitials = (name = '') => {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export const getAvatarGradient = (name = '') => {
  if (!name) return `linear-gradient(135deg, ${PALETTES[0][0]}, ${PALETTES[0][1]})`;
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % PALETTES.length;
  const [from, to] = PALETTES[index];
  return `linear-gradient(135deg, ${from}, ${to})`;
};
