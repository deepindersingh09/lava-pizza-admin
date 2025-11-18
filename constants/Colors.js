/**
 * Lava Pizza Admin App - Orange & Yellow Delivery Theme
 * Matching the delivery dashboard with golden accents
 */

export const COLORS = {
  // Backgrounds (Light theme)
  background: {
    primary: '#FFFBF5',       // Warm off-white (slight yellow tint)
    secondary: '#FFFFFF',      // Pure white cards
    tertiary: '#FFF9F0',       // Very light yellow tint
    modal: '#FFFFFF',          // White modals
    accent: '#FFF4E0',         // Light yellow background for highlights
  },

  // Orange/Yellow Brand Colors (matching delivery app)
  brand: {
    primaryOrange: '#FF9933',   // Main orange (Update Status button)
    secondaryOrange: '#FFB84D',  // Light orange (secondary buttons)
    goldenYellow: '#FFD700',     // Golden yellow (progress bars, stats)
    lightYellow: '#FFE57F',      // Light yellow (highlights)
    darkOrange: '#E68A00',       // Darker orange for pressed states
    amber: '#FFC107',            // Amber yellow (badges, accents)
  },

  // Status Colors
  status: {
    success: '#4CAF50',       // Green - completed
    warning: '#FFB84D',       // Orange - pending
    danger: '#F44336',        // Red - urgent
    info: '#2196F3',          // Blue - info
    pending: '#FFD700',       // GOLDEN YELLOW - pending orders
    preparing: '#FF9933',     // Orange - preparing
    completed: '#4CAF50',     // Green - completed
  },

  // Text Colors (Dark text on light background)
  text: {
    primary: '#1A1A1A',       // Almost black
    secondary: '#666666',     // Medium gray
    tertiary: '#999999',      // Light gray
    disabled: '#CCCCCC',      // Very light gray
    orange: '#FF9933',        // Orange text for emphasis
    yellow: '#F9A825',        // Dark yellow for readable text
  },

  // Border Colors
  border: {
    primary: '#FFE0B2',       // Light orange border
    light: '#FFF3E0',         // Very light orange border
    focus: '#FFD700',         // Golden yellow focused state
    yellow: '#FFE57F',        // Yellow border for highlights
  },

  // Inventory specific
  inventory: {
    inStock: '#4CAF50',       // Green
    lowStock: '#FFD700',      // GOLDEN YELLOW
    outOfStock: '#F44336',    // Red
  },

  // Special accents (NEW!)
  accents: {
    sunGlow: '#FFEB3B',       // Bright sun yellow
    honey: '#FFC107',         // Honey amber
    cream: '#FFF9C4',         // Cream yellow
    peach: '#FFE0B2',         // Peachy orange
  },
};

// Shadow presets (warm shadows)
export const SHADOWS = {
  small: {
    shadowColor: '#FF9933',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  medium: {
    shadowColor: '#FF9933',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  glow: {
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
};

// Typography
export const TYPOGRAPHY = {
  sizes: {
    xs: 10,
    sm: 12,
    base: 14,
    lg: 16,
    xl: 18,
    xxl: 20,
    xxxl: 24,
  },
  weights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
};

// Spacing
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
};

// Border radius
export const RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

// Legacy support
const tintColorLight = '#FFD700';  // Golden yellow
const tintColorDark = '#FF9933';   // Orange

export default {
  light: {
    text: COLORS.text.primary,
    background: COLORS.background.primary,
    tint: tintColorLight,
    tabIconDefault: COLORS.text.tertiary,
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: COLORS.text.primary,
    background: COLORS.background.primary,
    tint: tintColorDark,
    tabIconDefault: COLORS.text.tertiary,
    tabIconSelected: tintColorDark,
  },
};