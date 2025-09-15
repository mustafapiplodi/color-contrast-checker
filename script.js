class ColorContrastChecker {
    constructor() {
        this.foregroundColorInput = document.getElementById('foreground-color');
        this.backgroundColorInput = document.getElementById('background-color');
        this.foregroundHexInput = document.getElementById('foreground-hex');
        this.backgroundHexInput = document.getElementById('background-hex');
        this.previewContainer = document.getElementById('preview-container');
        this.contrastRatioDisplay = document.getElementById('contrast-ratio-mini');
        this.foregroundLuminanceDisplay = document.getElementById('foreground-luminance');
        this.backgroundLuminanceDisplay = document.getElementById('background-luminance');
        
        this.complianceElements = {
            'aa-normal': document.getElementById('aa-normal'),
            'aa-large': document.getElementById('aa-large'),
            'aaa-normal': document.getElementById('aaa-normal'),
            'aaa-large': document.getElementById('aaa-large'),
            'ui-components': document.getElementById('ui-components')
        };

        // New elements for enhanced features
        this.overallMessage = document.getElementById('overall-message');
        this.suggestionsList = document.getElementById('suggestions-list');
        
        // Quick results elements
        this.contrastRatioMini = document.getElementById('contrast-ratio-mini');
        this.aaStatusMini = document.getElementById('aa-status-mini');
        this.aaaStatusMini = document.getElementById('aaa-status-mini');
        this.overallGrade = document.getElementById('overall-grade');
        
        // Color format displays
        this.formatElements = {
            hex: {
                fg: document.getElementById('format-hex-fg'),
                bg: document.getElementById('format-hex-bg')
            },
            rgb: {
                fg: document.getElementById('format-rgb-fg'),
                bg: document.getElementById('format-rgb-bg')
            },
            hsl: {
                fg: document.getElementById('format-hsl-fg'),
                bg: document.getElementById('format-hsl-bg')
            }
        };

        this.debounceTimer = null;
        this.colorHistory = [];
        this.maxHistorySize = 10;
        
        this.init();
    }

    init() {
        this.addEventListeners();
        this.addKeyboardShortcuts();
        this.setupPresets();
        this.setupCopyButtons();
        this.updateResults();
        this.showWelcomeMessage();
    }

    addEventListeners() {
        // Color picker changes
        this.foregroundColorInput.addEventListener('input', () => {
            this.foregroundHexInput.value = this.foregroundColorInput.value;
            this.debouncedUpdate();
        });

        this.backgroundColorInput.addEventListener('input', () => {
            this.backgroundHexInput.value = this.backgroundColorInput.value;
            this.debouncedUpdate();
        });

        // Hex input changes with validation
        this.foregroundHexInput.addEventListener('input', () => {
            this.handleHexInput(this.foregroundHexInput, this.foregroundColorInput);
        });

        this.backgroundHexInput.addEventListener('input', () => {
            this.handleHexInput(this.backgroundHexInput, this.backgroundColorInput);
        });

        // Real-time validation feedback
        this.foregroundHexInput.addEventListener('blur', () => this.validateHexInput(this.foregroundHexInput));
        this.backgroundHexInput.addEventListener('blur', () => this.validateHexInput(this.backgroundHexInput));
    }

    addKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + R: Random colors
            if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
                e.preventDefault();
                this.generateRandomColors();
            }
            
            // Ctrl/Cmd + I: Invert colors
            if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
                e.preventDefault();
                this.invertColors();
            }
            
            // Ctrl/Cmd + C: Copy current combination
            if ((e.ctrlKey || e.metaKey) && e.key === 'c' && !e.target.matches('input')) {
                e.preventDefault();
                this.copyCurrentCombination();
            }
            
            // Escape: Reset to default
            if (e.key === 'Escape') {
                this.resetToDefault();
            }
        });
    }

    setupPresets() {
        const presetButtons = document.querySelectorAll('.preset-btn');
        presetButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const fg = btn.dataset.fg;
                const bg = btn.dataset.bg;
                this.setColors(fg, bg);
                
                // Visual feedback
                btn.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    btn.style.transform = '';
                }, 150);
            });
        });
    }

    setupCopyButtons() {
        const copyButtons = document.querySelectorAll('.copy-btn');
        copyButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const format = btn.dataset.copy;
                this.copyColorFormat(format, btn);
            });
        });
    }

    handleHexInput(hexInput, colorInput) {
        const value = hexInput.value;
        
        // Auto-format hex input
        if (value.length === 1 && value !== '#') {
            hexInput.value = '#' + value;
            return;
        }
        
        if (this.isValidHex(value)) {
            colorInput.value = value;
            hexInput.style.borderColor = '#48bb78';
            this.debouncedUpdate();
        } else if (value.length > 1) {
            hexInput.style.borderColor = '#f56565';
        } else {
            hexInput.style.borderColor = '#e2e8f0';
        }
    }

    validateHexInput(hexInput) {
        if (!this.isValidHex(hexInput.value) && hexInput.value.length > 1) {
            hexInput.style.borderColor = '#f56565';
            // Show error tooltip or message
            this.showTooltip(hexInput, 'Invalid hex color format');
        } else {
            hexInput.style.borderColor = '#e2e8f0';
        }
    }

    showTooltip(element, message) {
        // Simple tooltip implementation
        const existingTooltip = element.parentNode.querySelector('.tooltip');
        if (existingTooltip) {
            existingTooltip.remove();
        }

        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = message;
        tooltip.style.cssText = `
            position: absolute;
            background: #2d3748;
            color: white;
            padding: 0.5rem;
            border-radius: 4px;
            font-size: 0.8rem;
            z-index: 1000;
            margin-top: 0.25rem;
        `;
        
        element.parentNode.style.position = 'relative';
        element.parentNode.appendChild(tooltip);
        
        setTimeout(() => tooltip.remove(), 3000);
    }

    isValidHex(hex) {
        return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
    }

    debouncedUpdate() {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
            this.updateResults();
            this.addToHistory();
        }, 300);
    }

    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? [
            parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16)
        ] : null;
    }

    rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    rgbToHsl(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;
        
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        return [
            Math.round(h * 360),
            Math.round(s * 100),
            Math.round(l * 100)
        ];
    }

    getRelativeLuminance(r, g, b) {
        const [vR, vG, vB] = [r / 255, g / 255, b / 255];
        
        const linearR = vR <= 0.04045 ? vR / 12.92 : Math.pow((vR + 0.055) / 1.055, 2.4);
        const linearG = vG <= 0.04045 ? vG / 12.92 : Math.pow((vG + 0.055) / 1.055, 2.4);
        const linearB = vB <= 0.04045 ? vB / 12.92 : Math.pow((vB + 0.055) / 1.055, 2.4);
        
        return 0.2126 * linearR + 0.7152 * linearG + 0.0722 * linearB;
    }

    getContrastRatio(hex1, hex2) {
        const rgb1 = this.hexToRgb(hex1);
        const rgb2 = this.hexToRgb(hex2);
        
        if (!rgb1 || !rgb2) return 1;
        
        const lum1 = this.getRelativeLuminance(...rgb1);
        const lum2 = this.getRelativeLuminance(...rgb2);
        
        const lighter = Math.max(lum1, lum2);
        const darker = Math.min(lum1, lum2);
        
        return (lighter + 0.05) / (darker + 0.05);
    }

    updateResults() {
        const foregroundColor = this.foregroundColorInput.value;
        const backgroundColor = this.backgroundColorInput.value;
        
        const contrastRatio = this.getContrastRatio(foregroundColor, backgroundColor);
        
        const foregroundRgb = this.hexToRgb(foregroundColor);
        const backgroundRgb = this.hexToRgb(backgroundColor);
        const foregroundLuminance = this.getRelativeLuminance(...foregroundRgb);
        const backgroundLuminance = this.getRelativeLuminance(...backgroundRgb);
        
        // Update displays
        this.contrastRatioDisplay.textContent = contrastRatio.toFixed(2) + ':1';
        if (this.foregroundLuminanceDisplay) {
            this.foregroundLuminanceDisplay.textContent = foregroundLuminance.toFixed(3);
        }
        if (this.backgroundLuminanceDisplay) {
            this.backgroundLuminanceDisplay.textContent = backgroundLuminance.toFixed(3);
        }
        
        // Update compliance indicators
        const compliance = {
            'aa-normal': contrastRatio >= 4.5,
            'aa-large': contrastRatio >= 3.0,
            'aaa-normal': contrastRatio >= 7.0,
            'aaa-large': contrastRatio >= 4.5,
            'ui-components': contrastRatio >= 3.0
        };
        
        this.updateComplianceIndicators(compliance);
        this.updateQuickResults(contrastRatio, compliance);
        this.updateColorFormats(foregroundColor, backgroundColor);
        this.updatePreview(foregroundColor, backgroundColor);
        this.updateRecommendations(contrastRatio, compliance);
        this.announceResults(contrastRatio);
    }

    updateComplianceIndicators(compliance) {
        Object.keys(compliance).forEach(key => {
            const element = this.complianceElements[key];
            const parentItem = element.closest('.compliance-item');
            const isPass = compliance[key];
            
            element.textContent = isPass ? 'PASS' : 'FAIL';
            element.className = `compliance-status ${isPass ? 'pass' : 'fail'}`;
            parentItem.className = `compliance-item ${isPass ? 'pass' : 'fail'}`;
        });
    }

    updateQuickResults(contrastRatio, compliance) {
        // Update mini contrast ratio
        this.contrastRatioMini.textContent = contrastRatio.toFixed(2) + ':1';
        
        // Update AA status
        if (compliance['aa-normal']) {
            this.aaStatusMini.textContent = 'AA ✓';
            this.aaStatusMini.className = 'status-badge status-pass';
            this.aaStatusMini.title = `WCAG AA compliance: PASSED (${contrastRatio.toFixed(2)}:1 ≥ 4.5:1)`;
        } else {
            this.aaStatusMini.textContent = 'AA ✗';
            this.aaStatusMini.className = 'status-badge status-fail';
            this.aaStatusMini.title = `WCAG AA compliance: FAILED (${contrastRatio.toFixed(2)}:1 < 4.5:1)`;
        }
        
        // Update AAA status
        if (compliance['aaa-normal']) {
            this.aaaStatusMini.textContent = 'AAA ✓';
            this.aaaStatusMini.className = 'status-badge status-pass';
            this.aaaStatusMini.title = `WCAG AAA compliance: PASSED (${contrastRatio.toFixed(2)}:1 ≥ 7:1)`;
        } else {
            this.aaaStatusMini.textContent = 'AAA ✗';
            this.aaaStatusMini.className = 'status-badge status-fail';
            this.aaaStatusMini.title = `WCAG AAA compliance: FAILED (${contrastRatio.toFixed(2)}:1 < 7:1)`;
        }
        
        // Update overall grade
        if (compliance['aaa-normal']) {
            this.overallGrade.textContent = 'A+';
            this.overallGrade.className = 'grade-badge grade-excellent';
            this.overallGrade.title = 'Excellent accessibility - exceeds all standards';
        } else if (compliance['aa-normal']) {
            this.overallGrade.textContent = 'B+';
            this.overallGrade.className = 'grade-badge grade-good';
            this.overallGrade.title = 'Good accessibility - meets WCAG AA standards';
        } else if (compliance['aa-large']) {
            this.overallGrade.textContent = 'C';
            this.overallGrade.className = 'grade-badge grade-good';
            this.overallGrade.title = 'Limited accessibility - only suitable for large text';
        } else {
            this.overallGrade.textContent = 'F';
            this.overallGrade.className = 'grade-badge grade-poor';
            this.overallGrade.title = 'Poor accessibility - fails WCAG standards';
        }
    }

    updateColorFormats(foregroundColor, backgroundColor) {
        const fgRgb = this.hexToRgb(foregroundColor);
        const bgRgb = this.hexToRgb(backgroundColor);
        const fgHsl = this.rgbToHsl(...fgRgb);
        const bgHsl = this.rgbToHsl(...bgRgb);

        // Update HEX
        this.formatElements.hex.fg.textContent = foregroundColor.toUpperCase();
        this.formatElements.hex.bg.textContent = backgroundColor.toUpperCase();

        // Update RGB
        this.formatElements.rgb.fg.textContent = `rgb(${fgRgb.join(',')})`;
        this.formatElements.rgb.bg.textContent = `rgb(${bgRgb.join(',')})`;

        // Update HSL
        this.formatElements.hsl.fg.textContent = `hsl(${fgHsl[0]},${fgHsl[1]}%,${fgHsl[2]}%)`;
        this.formatElements.hsl.bg.textContent = `hsl(${bgHsl[0]},${bgHsl[1]}%,${bgHsl[2]}%)`;
    }

    updatePreview(foregroundColor, backgroundColor) {
        this.previewContainer.style.color = foregroundColor;
        this.previewContainer.style.backgroundColor = backgroundColor;
        this.previewContainer.style.setProperty('--bg-color', backgroundColor);
        
        const samples = this.previewContainer.querySelectorAll('.sample-button, .sample-input, .sample-card');
        samples.forEach(sample => {
            sample.style.color = foregroundColor;
            sample.style.backgroundColor = backgroundColor;
            sample.style.borderColor = foregroundColor;
        });
    }

    updateRecommendations(contrastRatio, compliance) {
        // Update overall assessment
        this.updateOverallAssessment(contrastRatio, compliance);
        
        // Update suggestions
        this.updateSuggestions(contrastRatio, compliance);
    }

    updateOverallAssessment(contrastRatio, compliance) {
        const overallDiv = document.getElementById('overall-status');
        let message, className;

        if (compliance['aaa-normal']) {
            message = `🌟 Excellent! Your contrast ratio of ${contrastRatio.toFixed(2)}:1 exceeds all WCAG standards and provides optimal accessibility for all users.`;
            className = 'status-excellent';
        } else if (compliance['aa-normal']) {
            message = `✅ Good job! Your contrast ratio of ${contrastRatio.toFixed(2)}:1 meets WCAG AA standards, making your content accessible to most users.`;
            className = 'status-good';
        } else if (compliance['aa-large']) {
            message = `⚠️ Limited accessibility. Your contrast ratio of ${contrastRatio.toFixed(2)}:1 only works for large text. Consider increasing contrast for better accessibility.`;
            className = 'status-good';
        } else {
            message = `❌ Poor accessibility. Your contrast ratio of ${contrastRatio.toFixed(2)}:1 fails WCAG standards and may be difficult for many users to read.`;
            className = 'status-poor';
        }

        this.overallMessage.textContent = message;
        this.overallMessage.className = className;
    }

    updateSuggestions(contrastRatio, compliance) {
        const suggestions = [];

        if (!compliance['aa-normal']) {
            if (contrastRatio < 3.0) {
                suggestions.push({
                    type: 'error',
                    text: 'Critical: This color combination fails basic accessibility standards. Consider using much darker/lighter colors.'
                });
            } else {
                suggestions.push({
                    type: 'warning',
                    text: 'To meet WCAG AA standards, try darkening the text color or lightening the background.'
                });
            }
        }

        if (compliance['aa-normal'] && !compliance['aaa-normal']) {
            suggestions.push({
                type: 'success',
                text: 'Good accessibility! For even better contrast, consider darker text or lighter background to reach AAA standards.'
            });
        }

        if (contrastRatio > 15) {
            suggestions.push({
                type: 'success',
                text: 'Excellent contrast! This combination works well in all lighting conditions and for users with vision impairments.'
            });
        }

        // Render suggestions
        this.suggestionsList.innerHTML = '';
        suggestions.forEach(suggestion => {
            const div = document.createElement('div');
            div.className = `suggestion-item ${suggestion.type}`;
            div.textContent = suggestion.text;
            this.suggestionsList.appendChild(div);
        });

        if (suggestions.length === 0) {
            this.suggestionsList.innerHTML = '<div class="suggestion-item success">Perfect! No improvements needed.</div>';
        }
    }

    copyColorFormat(format, button) {
        let textToCopy = '';
        
        switch (format) {
            case 'hex':
                textToCopy = `Foreground: ${this.formatElements.hex.fg.textContent}, Background: ${this.formatElements.hex.bg.textContent}`;
                break;
            case 'rgb':
                textToCopy = `Foreground: ${this.formatElements.rgb.fg.textContent}, Background: ${this.formatElements.rgb.bg.textContent}`;
                break;
            case 'hsl':
                textToCopy = `Foreground: ${this.formatElements.hsl.fg.textContent}, Background: ${this.formatElements.hsl.bg.textContent}`;
                break;
        }

        navigator.clipboard.writeText(textToCopy).then(() => {
            // Visual feedback
            const originalText = button.textContent;
            button.textContent = '✓';
            button.classList.add('copied');
            
            setTimeout(() => {
                button.textContent = originalText;
                button.classList.remove('copied');
            }, 2000);
        }).catch(() => {
            // Fallback for older browsers
            this.showTooltip(button, 'Copy failed - please select and copy manually');
        });
    }

    setColors(foreground, background) {
        this.foregroundColorInput.value = foreground;
        this.backgroundColorInput.value = background;
        this.foregroundHexInput.value = foreground;
        this.backgroundHexInput.value = background;
        this.updateResults();
        this.addToHistory();
    }

    generateRandomColors() {
        const randomHex = () => '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
        this.setColors(randomHex(), randomHex());
    }

    invertColors() {
        const fg = this.foregroundColorInput.value;
        const bg = this.backgroundColorInput.value;
        this.setColors(bg, fg);
    }

    resetToDefault() {
        this.setColors('#000000', '#ffffff');
    }

    copyCurrentCombination() {
        const textToCopy = `Foreground: ${this.foregroundColorInput.value}, Background: ${this.backgroundColorInput.value}, Contrast: ${this.contrastRatioDisplay ? this.contrastRatioDisplay.textContent : 'N/A'}`;
        navigator.clipboard.writeText(textToCopy).then(() => {
            console.log('Color combination copied!');
        });
    }

    addToHistory() {
        const combination = {
            foreground: this.foregroundColorInput.value,
            background: this.backgroundColorInput.value,
            timestamp: Date.now()
        };

        // Remove duplicates
        this.colorHistory = this.colorHistory.filter(item => 
            !(item.foreground === combination.foreground && item.background === combination.background)
        );

        this.colorHistory.unshift(combination);
        
        if (this.colorHistory.length > this.maxHistorySize) {
            this.colorHistory = this.colorHistory.slice(0, this.maxHistorySize);
        }
    }

    showWelcomeMessage() {
        setTimeout(() => {
            if (this.contrastRatioDisplay && this.contrastRatioDisplay.textContent === '21.00:1') {
                console.log('🎨 Color Contrast Checker loaded! Try changing colors to see how contrast affects accessibility!');
            }
        }, 2000);
    }

    announceResults(contrastRatio) {
        const announcement = `Contrast ratio updated to ${contrastRatio.toFixed(2)} to 1`;
        if (this.contrastRatioDisplay) {
            this.contrastRatioDisplay.setAttribute('aria-label', announcement);
        }
    }

    getWCAGLevel(ratio) {
        if (ratio >= 7.0) return 'AAA';
        if (ratio >= 4.5) return 'AA';
        if (ratio >= 3.0) return 'AA Large';
        return 'Fail';
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const checker = new ColorContrastChecker();
    
    // Show keyboard shortcuts help
    const showHelp = () => {
        alert(`Keyboard Shortcuts:
• Ctrl/Cmd + R: Random colors
• Ctrl/Cmd + I: Invert colors  
• Ctrl/Cmd + C: Copy combination
• Escape: Reset to default`);
    };
    
    // Add help trigger
    document.addEventListener('keydown', (e) => {
        if (e.key === 'F1' || (e.key === '?' && e.shiftKey)) {
            e.preventDefault();
            showHelp();
        }
    });
    
    window.contrastChecker = checker;
    console.log('🎨 Color Contrast Checker loaded! Press F1 for keyboard shortcuts.');
});