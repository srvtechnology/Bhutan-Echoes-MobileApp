import { Platform } from "react-native";

// Define the color palette
const palette = {
	// Primary colors
	primary: "#33B564", // Vibrant Green (Bhutan Echoes theme)
	secondary: "#86EFAC", // Light Green
	tertiary: "#16A34A", // Dark Green

	// Neutrals - Cream and off-white theme
	white: "#FAFAF8",
	cream: "#F5F5F3",
	gray50: "#F9F8F6",
	gray100: "#EFE9E6",
	gray200: "#E6DDD8",
	gray300: "#D4C8C0",
	gray400: "#B8A8A0",
	gray500: "#8F8F8F",
	gray600: "#6B6B6B",
	gray700: "#4D4D4D",
	gray800: "#2D2D2D",
	gray900: "#1A1A1A",
	black: "#000000",

	// Feedback colors
	success: "#22C55E", // Green
	warning: "#F59E0B", // Amber
	error: "#EF4444", // Red
	info: "#3B82F6", // Blue
};

// Define typography
const typography = {
	fontFamily: {
		regular: Platform.OS === "ios" ? "System" : "Roboto",
		medium: Platform.OS === "ios" ? "System" : "Roboto_Medium",
		bold: Platform.OS === "ios" ? "System" : "Roboto_Bold",
	},
	fontSize: {
		xs: 12,
		sm: 14,
		md: 16,
		lg: 18,
		xl: 20,
		"2xl": 24,
		"3xl": 30,
		"4xl": 36,
	},
	lineHeight: {
		xs: 16,
		sm: 20,
		md: 24,
		lg: 28,
		xl: 32,
		"2xl": 36,
		"3xl": 40,
		"4xl": 48,
	},
};

// Define spacing
const spacing = {
	xs: 4,
	sm: 8,
	md: 16,
	lg: 24,
	xl: 32,
	"2xl": 48,
	"3xl": 64,
};

// Define border radius
const borderRadius = {
	none: 0,
	sm: 4,
	md: 8,
	lg: 12,
	xl: 16,
	full: 9999,
};

// Define shadows
const shadows = {
	none: {
		shadowColor: "transparent",
		shadowOffset: { width: 0, height: 0 },
		shadowOpacity: 0,
		shadowRadius: 0,
		elevation: 0,
	},
	sm: {
		shadowColor: palette.black,
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.2,
		shadowRadius: 1.41,
		elevation: 2,
	},
	md: {
		shadowColor: palette.black,
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.23,
		shadowRadius: 2.62,
		elevation: 4,
	},
	lg: {
		shadowColor: palette.black,
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 4.65,
		elevation: 8,
	},
};

// Define z-index
const zIndex = {
	base: 0,
	elevated: 1,
	dropdown: 1000,
	sticky: 1100,
	fixed: 1200,
	modalBackdrop: 1300,
	modal: 1400,
	popover: 1500,
	tooltip: 1600,
};

// Export the theme
export const theme = {
	colors: {
		...palette,
		background: palette.cream, // Cream background for Bhutan Echoes
		text: palette.gray800,
		textLight: palette.gray600,
		textDark: palette.black,
		border: palette.gray200,
		placeholder: palette.gray500,
		disabled: palette.gray300,
	},
	typography,
	spacing,
	borderRadius,
	shadows,
	zIndex,
};

// Type definitions for the theme
export type Theme = typeof theme;
