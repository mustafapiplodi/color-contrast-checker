# Color Contrast Checker ✨

A professional WCAG 2.0/2.1/2.2 compliant color contrast checker for web accessibility. Ensure your designs meet accessibility standards with accurate contrast ratio calculations and comprehensive compliance reporting.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Available-brightgreen)](https://color-contrast-checker-five.vercel.app)
[![WCAG 2.2](https://img.shields.io/badge/WCAG-2.2%20Compliant-blue)](https://www.w3.org/WAI/WCAG22/quickref/)
[![Mobile Responsive](https://img.shields.io/badge/Mobile-Responsive-orange)](https://color-contrast-checker-five.vercel.app)

## 🚀 Live Demo

**🌐 [Try it now](https://color-contrast-checker-five.vercel.app)**

## ✨ Features

### 🎯 Core Functionality
- **Accurate WCAG Calculations**: Precise contrast ratio calculations using correct sRGB linearization (0.04045 threshold)
- **Real-time Validation**: Instant feedback with debounced input validation
- **Multiple Compliance Levels**: AA and AAA standards for normal and large text
- **UI Component Testing**: 3:1 ratio validation for interactive elements (WCAG 2.1)

### 🎨 Professional Workflow
- **Multiple Color Formats**: HEX, RGB, HSL support with auto-conversion
- **Smart Input Validation**: Handles 3-digit and 6-digit hex codes with intelligent error recovery
- **Quick Preset Combinations**: 8 professionally curated accessible color pairs
- **Copy to Clipboard**: One-click copying of color values in any format

### 📱 User Experience
- **Mobile-First Design**: Touch-friendly interface with 44px minimum tap targets
- **Keyboard Shortcuts**: Power-user features (Ctrl+R for random, Ctrl+I to invert)
- **Live Preview**: Real-time text samples showing actual usage scenarios
- **Detailed Recommendations**: Contextual suggestions for improving accessibility

### 🔧 Technical Excellence
- **No Rounding Tolerance**: Strict WCAG compliance (4.499:1 fails 4.5:1 requirement)
- **Identical Color Detection**: Smart warnings for invisible content scenarios
- **Accessibility First**: Screen reader support with ARIA labels and live regions
- **Performance Optimized**: Debounced calculations with efficient event handling

## 🎯 Target Users

### Primary (Professional Use)
- **Web Developers & Frontend Engineers** - Quick WCAG validation during development
- **UX/UI Designers** - Ensuring accessibility in design systems and mockups
- **Digital Agencies** - Client deliverables requiring compliance documentation
- **Accessibility Consultants** - Detailed auditing and compliance reporting

### Secondary (Organizational)
- **Corporate Web Teams** - Brand consistency across multiple properties
- **Government & Healthcare** - Legal compliance requirements
- **Educational Institutions** - Accessibility training and implementation

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
2. **View Results**: Instant compliance feedback (AA/AAA status)
3. **Check Preview**: See how combinations look with real text samples
4. **Copy Values**: Click copy buttons to use in your projects

### Advanced Features
- **Keyboard Shortcuts**:
  - `Ctrl/Cmd + R`: Generate random color combination
  - `Ctrl/Cmd + I`: Invert foreground and background
  - `Ctrl/Cmd + C`: Copy current combination
  - `Escape`: Reset to default (black on white)
- **Quick Presets**: Use professionally curated accessible combinations
- **Format Conversion**: Automatic conversion between HEX, RGB, and HSL

## 🧠 Understanding WCAG Standards

### AA Level (Minimum Compliance)
- **Normal Text**: 4.5:1 contrast ratio required
- **Large Text** (18pt+ or 14pt+ bold): 3:1 contrast ratio required
- **Legal Requirement**: Most jurisdictions require AA compliance

### AAA Level (Enhanced Compliance)
- **Normal Text**: 7:1 contrast ratio required
- **Large Text**: 4.5:1 contrast ratio required
- **Recommended**: For maximum accessibility and user experience

### UI Components (WCAG 2.1)
- **Interactive Elements**: 3:1 contrast ratio for focus indicators, borders
- **Critical**: Applies to buttons, form controls, and navigation elements

## 🔬 Technical Implementation

### Color Science
- **Relative Luminance**: ITU-R BT.709 standard coefficients (0.2126, 0.7152, 0.0722)
- **Gamma Correction**: sRGB transfer function with 2.4 exponent
- **Precision**: High-precision calculations to avoid floating-point errors

### Mathematical Formula
```javascript
// Relative luminance calculation
const linearRGB = (val <= 0.04045) ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
const luminance = 0.2126 * linearR + 0.7152 * linearG + 0.0722 * linearB;

// Contrast ratio
const contrastRatio = (lighter + 0.05) / (darker + 0.05);
```

## 🏗️ Architecture

### Frontend Stack
- **Pure HTML/CSS/JavaScript**: No framework dependencies for maximum compatibility
- **Modern CSS**: Grid, Flexbox, and CSS custom properties
- **Progressive Enhancement**: Works without JavaScript for basic functionality

### Performance Features
- **Debounced Validation**: 300ms delay prevents excessive calculations
- **Efficient DOM Updates**: Targeted updates instead of full re-renders
- **Optimized Event Handling**: Smart event delegation and cleanup

### Accessibility Implementation
- **ARIA Labels**: Comprehensive screen reader support
- **Live Regions**: Dynamic content announcements
- **Keyboard Navigation**: Full functionality without mouse
- **High Contrast Mode**: Respects user preferences

## 🎨 Design Philosophy

### Professional Focus
Designed for professionals who need:
- **Speed**: Quick validation without context switching
- **Accuracy**: Mathematically precise WCAG calculations
- **Reliability**: Consistent results across different environments
- **Integration**: Easy copying for use in design tools and code

### User Experience Principles
- **Mobile-First**: Touch-friendly interface for all devices
- **Immediate Feedback**: Real-time validation and suggestions
- **Error Prevention**: Smart input handling and recovery
- **Progressive Disclosure**: Advanced features don't overwhelm beginners

## 🚧 Roadmap

### Planned Features
- **Color History Navigation**: Browse previously tested combinations
- **Bulk Testing**: Upload spreadsheets for batch validation
- **Color Blindness Simulation**: Test combinations for different vision types
- **Design System Generator**: Create complete accessible palettes
- **Export Functionality**: PDF reports and CSS code generation
- **URL Sharing**: Shareable links for team collaboration

### Integration Targets
- **Design Tools**: Figma, Sketch, Adobe XD plugins
- **Development Workflow**: VS Code extension, CLI tool
- **CI/CD Pipeline**: Automated accessibility testing
- **CMS Integration**: WordPress, Drupal accessibility modules

## 📊 Browser Support

- **Chrome/Edge**: 88+ (full feature support)
- **Firefox**: 85+ (full feature support)
- **Safari**: 14+ (full feature support)
- **Mobile Browsers**: iOS Safari 14+, Chrome Android 88+

## 🤝 Contributing

We welcome contributions! Areas where help is needed:

### High-Impact Features
1. **Color Palette Generator**: Smart accessible palette creation
2. **Image Color Extraction**: Extract colors from design files
3. **Batch Testing Interface**: Handle multiple combinations
4. **Export/Reporting**: PDF generation and CSS output

### Development Setup
```bash
# Fork the repository
git fork https://github.com/mustafapiplodi/color-contrast-checker.git

# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and test
# ... make your improvements

# Submit pull request
git push origin feature/your-feature-name
```

## 📈 Market Position

**Target Market**: Professional-grade tools positioned between free basic checkers (WebAIM) and expensive enterprise platforms (Stark $12-15/month).

**Value Proposition**: Advanced features at $25-75/month for web agencies and design teams who need:
- Bulk testing capabilities
- Client reporting features
- Team collaboration tools
- Integration with existing workflows

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 👥 Credits

**Built by**: [Mustafa Piplodi](https://www.linkedin.com/in/mustafapiplodi/)
**Company**: [Scaling High Technologies](https://www.scalinghigh.com)
**AI Assistant**: Claude Code (Anthropic)

## 🔗 Links

- **Live Demo**: https://color-contrast-checker-five.vercel.app
- **GitHub Repository**: https://github.com/mustafapiplodi/color-contrast-checker
- **WCAG Guidelines**: https://www.w3.org/WAI/WCAG22/quickref/
- **WebAIM Contrast Checker**: https://webaim.org/resources/contrastchecker/
- **Author LinkedIn**: https://www.linkedin.com/in/mustafapiplodi/

---

*Building accessible web experiences, one color at a time.* 🌈✨