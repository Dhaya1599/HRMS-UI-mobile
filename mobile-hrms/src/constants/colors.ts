export const COLORS = {
  // Primary
  primary: '#d4a574', // Amber/Gold - Main accent
  
  // Dark Theme Base
  background: '#0f1419', // Very dark background
  surface: '#1a1f36', // Card/container background
  surfaceVariant: '#2d3748', // Slightly lighter surface
  
  // Text
  textPrimary: '#f1f5f9', // Light gray - main text
  textSecondary: '#94a3b8', // Gray - secondary text
  textTertiary: '#64748b', // Darker gray - hint text
  
  // Status
  success: '#10b981', // Emerald - Success
  warning: '#f97316', // Orange - Warnings
  error: '#ef4444', // Red - Errors
  info: '#3b82f6', // Blue - Info
  
  // Borders & Dividers
  border: '#2d3748',
  borderLight: '#3d4456',
  
  // Disabled
  disabled: '#4b5563',
  
  // Semantic
  inTime: '#10b981',
  outTime: '#94a3b8',
  pending: '#f97316',
  approved: '#10b981',
  rejected: '#ef4444',
  onLeave: '#a78bfa',
  
  // Shadows
  shadowColor: '#000000',
};

export const THEME = {
  colors: COLORS,
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  borderRadius: {
    xs: 4,
    sm: 6,
    md: 8,
    lg: 12,
    xl: 16,
  },
  typography: {
    h1: {
      fontSize: 28,
      fontWeight: '700',
      lineHeight: 34,
    },
    h2: {
      fontSize: 22,
      fontWeight: '600',
      lineHeight: 28,
    },
    h3: {
      fontSize: 18,
      fontWeight: '600',
      lineHeight: 24,
    },
    body: {
      fontSize: 16,
      fontWeight: '400',
      lineHeight: 24,
    },
    bodySmall: {
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 20,
    },
    caption: {
      fontSize: 12,
      fontWeight: '400',
      lineHeight: 18,
    },
  },
  shadows: {
    sm: {
      shadowColor: COLORS.shadowColor,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    md: {
      shadowColor: COLORS.shadowColor,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 5,
    },
    lg: {
      shadowColor: COLORS.shadowColor,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    },
  },
};
