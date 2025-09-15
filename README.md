# Color Contrast Checker ✨

A WCAG 2.0/2.1/2.2 compliant color contrast checker for web accessibility. Test your color combinations to ensure they meet accessibility standards with accurate contrast ratio calculations.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Available-brightgreen)](https://color-contrast-checker-five.vercel.app)
[![WCAG 2.2](https://img.shields.io/badge/WCAG-2.2%20Compliant-blue)](https://www.w3.org/WAI/WCAG22/quickref/)
[![Mobile Responsive](https://img.shields.io/badge/Mobile-Responsive-orange)](https://color-contrast-checker-five.vercel.app)

## 🚀 Live Demo

**🌐 [Try it now](https://color-contrast-checker-five.vercel.app)**

## ✨ Features

### 🎯 Core Functionality
- **Accurate WCAG Calculations**: Precise contrast ratio calculations using correct sRGB linearization (0.04045 threshold)
- **Real-time Validation**: Instant feedback with debounced input validation (300ms delay)
- **Multiple Compliance Levels**: AA and AAA standards for normal and large text
- **UI Component Testing**: 3:1 ratio validation for interactive elements (WCAG 2.1)

### 🎨 Color Input & Validation
- **Multiple Color Formats**: HEX, RGB, HSL support with auto-conversion
- **Smart Hex Input Validation**: Handles 3-digit and 6-digit hex codes with intelligent error recovery
- **Real-time Error Detection**: Visual feedback for invalid color codes
- **Identical Color Detection**: Smart warnings for invisible content scenarios

### 📱 User Interface
- **Mobile-Responsive Design**: Touch-friendly interface with 44px minimum tap targets
- **Quick Preset Combinations**: 8 professionally curated accessible color pairs
- **Live Preview**: Real-time text samples showing actual usage scenarios
- **Copy to Clipboard**: One-click copying of color values in HEX, RGB, and HSL formats

### ⌨️ Keyboard Shortcuts
- `Alt + R` (or `Option + R` on Mac): Generate random color combination
- `Alt + I` (or `Option + I` on Mac): Invert foreground and background colors
- `Alt + C` (or `Option + C` on Mac): Copy current combination to clipboard
- `Escape`: Reset to default (black on white)

### ♿ Accessibility Features
- **ARIA Labels**: Screen reader support with descriptive labels
- **Live Regions**: Dynamic content announcements for status changes
- **Keyboard Navigation**: Full functionality without mouse
- **High Contrast Mode**: Respects user system preferences

## 🚀 Quick Start

### Option 1: Use Online (Recommended)
Simply visit **[color-contrast-checker-five.vercel.app](https://color-contrast-checker-five.vercel.app)** - no installation required!

### Option 2: Local Development
```bash
# Clone the repository
git clone https://github.com/mustafapiplodi/color-contrast-checker.git

# Navigate to directory
cd color-contrast-checker

# Open in your browser
open index.html
```

## 📖 How to Use

### Basic Testing
1. **Select Colors**: Use color pickers or input hex values directly
2. **View Results**: Instant compliance feedback (AA/AAA status with pass/fail indicators)
3. **Check Preview**: See how combinations look with real text samples and UI elements
4. **Copy Values**: Click copy buttons to use colors in your projects

### Color Input Methods
- **Color Pickers**: Visual selection with native browser color picker
- **Hex Input**: Direct entry of hex codes (supports both #RGB and #RRGGBB formats)
- **Quick Presets**: Pre-configured accessible color combinations

## 🧠 WCAG Standards Explained

### AA Level (Minimum Compliance)
- **Normal Text**: 4.5:1 contrast ratio required
- **Large Text** (18pt+ or 14pt+ bold): 3:1 contrast ratio required

### AAA Level (Enhanced Compliance)
- **Normal Text**: 7:1 contrast ratio required
- **Large Text**: 4.5:1 contrast ratio required

### UI Components (WCAG 2.1)
- **Interactive Elements**: 3:1 contrast ratio for focus indicators, borders

## 🔬 Technical Implementation

### Color Science
- **Relative Luminance**: ITU-R BT.709 standard coefficients (0.2126, 0.7152, 0.0722)
- **Gamma Correction**: sRGB transfer function with 2.4 exponent
- **No Rounding Tolerance**: Strict WCAG compliance (4.499:1 fails 4.5:1 requirement)

### Mathematical Formula
```javascript
// Relative luminance calculation
const linearRGB = (val <= 0.04045) ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
const luminance = 0.2126 * linearR + 0.7152 * linearG + 0.0722 * linearB;

// Contrast ratio
const contrastRatio = (lighter + 0.05) / (darker + 0.05);
```

### Architecture
- **Pure HTML/CSS/JavaScript**: No framework dependencies
- **Modern CSS**: Grid, Flexbox, and CSS custom properties for responsive design
- **Debounced Input**: 300ms delay prevents excessive calculations during typing
- **Event-Driven Updates**: Efficient DOM updates with targeted element changes

## 📊 Browser Support

- **Chrome/Edge**: Modern versions (full feature support)
- **Firefox**: Modern versions (full feature support)
- **Safari**: Modern versions (full feature support)
- **Mobile Browsers**: iOS Safari, Chrome Android

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

### Development Setup
```bash
# Fork the repository
git fork https://github.com/mustafapiplodi/color-contrast-checker.git

# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and test locally
# Submit pull request
```

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🔗 Links

- **Live Demo**: https://color-contrast-checker-five.vercel.app
- **GitHub Repository**: https://github.com/mustafapiplodi/color-contrast-checker
- **WCAG Guidelines**: https://www.w3.org/WAI/WCAG22/quickref/
- **WebAIM Contrast Checker**: https://webaim.org/resources/contrastchecker/