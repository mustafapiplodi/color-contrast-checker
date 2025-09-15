class ColorContrastChecker {
    constructor() {
        this.foregroundColorInput = document.getElementById('foreground-color');
        this.backgroundColorInput = document.getElementById('background-color');
        this.foregroundHexInput = document.getElementById('foreground-hex');
        this.backgroundHexInput = document.getElementById('background-hex');
        this.previewContainer = document.getElementById('preview-container');
        this.contrastRatioDisplay = document.getElementById('contrast-ratio');
        this.foregroundLuminanceDisplay = document.getElementById('foreground-luminance');
        this.backgroundLuminanceDisplay = document.getElementById('background-luminance');
        
        this.complianceElements = {
            'aa-normal': document.getElementById('aa-normal'),
            'aa-large': document.getElementById('aa-large'),
            'aaa-normal': document.getElementById('aaa-normal'),
            'aaa-large': document.getElementById('aaa-large'),
            'ui-components': document.getElementById('ui-components')
        };

        this.debounceTimer = null;
        this.init();
    }

    init() {
        this.addEventListeners();
        this.updateResults();
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

        // Hex input changes
        this.foregroundHexInput.addEventListener('input', () => {
            if (this.isValidHex(this.foregroundHexInput.value)) {
                this.foregroundColorInput.value = this.foregroundHexInput.value;
                this.debouncedUpdate();
            }
        });

        this.backgroundHexInput.addEventListener('input', () => {
            if (this.isValidHex(this.backgroundHexInput.value)) {
                this.backgroundColorInput.value = this.backgroundHexInput.value;
                this.debouncedUpdate();
            }
        });
    }

    isValidHex(hex) {
        return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
    }

    debouncedUpdate() {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
            this.updateResults();
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

    getRelativeLuminance(r, g, b) {
        // Convert to 0-1 range
        const [vR, vG, vB] = [r / 255, g / 255, b / 255];
        
        // Apply sRGB linearization with corrected threshold (0.04045, not 0.03928)
        const linearR = vR <= 0.04045 ? vR / 12.92 : Math.pow((vR + 0.055) / 1.055, 2.4);
        const linearG = vG <= 0.04045 ? vG / 12.92 : Math.pow((vG + 0.055) / 1.055, 2.4);
        const linearB = vB <= 0.04045 ? vB / 12.92 : Math.pow((vB + 0.055) / 1.055, 2.4);
        
        // Calculate relative luminance using ITU-R BT.709 coefficients
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
        
        // Calculate contrast ratio
        const contrastRatio = this.getContrastRatio(foregroundColor, backgroundColor);
        
        // Calculate luminance values
        const foregroundRgb = this.hexToRgb(foregroundColor);
        const backgroundRgb = this.hexToRgb(backgroundColor);
        const foregroundLuminance = this.getRelativeLuminance(...foregroundRgb);
        const backgroundLuminance = this.getRelativeLuminance(...backgroundRgb);
        
        // Update displays
        this.contrastRatioDisplay.textContent = contrastRatio.toFixed(2) + ':1';
        this.foregroundLuminanceDisplay.textContent = foregroundLuminance.toFixed(3);
        this.backgroundLuminanceDisplay.textContent = backgroundLuminance.toFixed(3);
        
        // Update compliance indicators
        this.updateComplianceIndicators({
            'aa-normal': contrastRatio >= 4.5,
            'aa-large': contrastRatio >= 3.0,
            'aaa-normal': contrastRatio >= 7.0,
            'aaa-large': contrastRatio >= 4.5,
            'ui-components': contrastRatio >= 3.0
        });
        
        // Update preview
        this.updatePreview(foregroundColor, backgroundColor);
        
        // Announce results to screen readers
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

    updatePreview(foregroundColor, backgroundColor) {
        this.previewContainer.style.color = foregroundColor;
        this.previewContainer.style.backgroundColor = backgroundColor;
        this.previewContainer.style.setProperty('--bg-color', backgroundColor);
        
        // Update all sample elements
        const samples = this.previewContainer.querySelectorAll('.sample-button, .sample-input, .sample-card');
        samples.forEach(sample => {
            sample.style.color = foregroundColor;
            sample.style.backgroundColor = backgroundColor;
            sample.style.borderColor = foregroundColor;
        });
    }

    announceResults(contrastRatio) {
        // Create announcement for screen readers
        const announcement = `Contrast ratio updated to ${contrastRatio.toFixed(2)} to 1`;
        
        // Use aria-live region that already exists in the HTML
        const ratioElement = this.contrastRatioDisplay;
        ratioElement.setAttribute('aria-label', announcement);
    }

    // Utility method to get WCAG level for a given ratio
    getWCAGLevel(ratio) {
        if (ratio >= 7.0) return 'AAA';
        if (ratio >= 4.5) return 'AA';
        if (ratio >= 3.0) return 'AA Large';
        return 'Fail';
    }

    // Method to suggest better colors (future enhancement)
    suggestBetterColors(targetRatio = 4.5) {
        // This could be implemented to suggest alternative colors
        // that meet the target contrast ratio
        console.log(`Suggesting colors for ${targetRatio}:1 ratio`);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const checker = new ColorContrastChecker();
    
    // Add keyboard navigation support
    document.addEventListener('keydown', (e) => {
        // Add any global keyboard shortcuts here
        if (e.key === 'Escape') {
            // Clear focus from any input
            document.activeElement.blur();
        }
    });
    
    // Add support for color format switching (future enhancement)
    window.contrastChecker = checker; // Make available globally for console debugging
});