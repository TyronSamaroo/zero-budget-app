export const EMOJI_CATEGORIES = {
  Money: ['💰', '💵', '💸', '🏦', '💳', '💴', '💶', '💷'],
  Home: ['🏠', '🏡', '🏢', '🏣', '🏤', '🏥', '🏨', '🏪', '🏫'],
  Transport: ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎', '🚓', '🚑', '🚒', '✈️', '🚂'],
  Food: ['🍽️', '🛒', '🍳', '🥘', '🍕', '🍔', '🥪', '🥗'],
  Health: ['🏥', '💊', '🏃', '🧘', '🚴', '⚕️', '🩺'],
  Entertainment: ['🎮', '🎬', '🎭', '🎨', '🎪', '🎟️', '🎫'],
  Education: ['📚', '🎓', '✏️', '📝', '💻', '🔬', '📱'],
  Other: ['📦', '🎁', '🛍️', '👕', '📱', '💻', '🖥️', '⌚️', '📸']
} as const;

export type EmojiCategory = keyof typeof EMOJI_CATEGORIES;
export type Emoji = typeof EMOJI_CATEGORIES[EmojiCategory][number]; 