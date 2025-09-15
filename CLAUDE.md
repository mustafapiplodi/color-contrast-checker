# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This repository contains research documentation for building professional Color Contrast Checker applications that comply with WCAG 2.0/2.1/2.2 accessibility standards. The primary artifact is a comprehensive technical guide covering mathematical implementations, accessibility requirements, and market analysis.

## Key Technical Information

### WCAG Compliance Standards
- **WCAG AA**: 4.5:1 contrast ratio for normal text, 3:1 for large text
- **WCAG AAA**: 7:1 contrast ratio for normal text, 4.5:1 for large text
- **UI Components**: 3:1 contrast ratio requirement from WCAG 2.1
- **Critical**: No rounding tolerance - 4.499:1 fails the 4.5:1 requirement

### Core Algorithm Implementation
The relative luminance calculation uses the corrected sRGB linearization threshold of **0.04045** (not 0.03928). The implementation includes:
- Gamma correction with 2.4 exponent (sRGB specification)
- Dual-segment transfer function handling
- Precise contrast ratio calculation: `(lighter + 0.05) / (darker + 0.05)`

### Recommended Libraries
- **Chroma.js**: Primary choice for reliable color calculations and WCAG compliance checking
- **Pickr**: Modern color picker library for enhanced user experience

## Architecture Patterns

### Color Contrast Checker Implementation
- Real-time calculation with debounced updates (300ms delay)
- Multiple color format support (HEX, RGB, HSL, named colors)
- Live preview sections with actual text samples
- Accessibility-first design with ARIA labeling and screen reader support

### Performance Considerations
- Pre-computed lookup tables for 8-bit values
- SIMD processing for multiple calculations
- Efficient event handling to prevent excessive computation

## Target Market Positioning

The research identifies a market gap between free basic tools (WebAIM) and expensive enterprise platforms (Stark at $12-15/month). Target positioning: professional-grade tools at $25-75/month for web agencies and design teams.

## Integration Priorities
- Content management systems (WordPress, Shopify, Webflow)
- Design tools beyond Figma/Sketch
- CI/CD pipeline compatibility for automated accessibility testing