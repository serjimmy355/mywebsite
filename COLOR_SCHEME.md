# Portfolio Color Scheme

A dark, professional color palette perfect for data dashboards, technical applications, and modern web portfolios.

## Color Palette

### Backgrounds
- **Primary Background**: `#1F2739` (`--bg-primary`) - Main page background
- **Secondary Background**: `#2C3446` (`--bg-secondary`) - Container/card backgrounds  
- **Tertiary Background**: `#2e3548` (`--bg-tertiary`) - Table rows, form elements
- **Quaternary Background**: `#3e4659` (`--bg-quaternary`) - Table headers, active states
- **Hover Background**: `#383f52` (`--bg-hover`) - Interactive element hover states

### Text Colors
- **Primary Text**: `#ffffff` (`--text-primary`) - Headings, important text
- **Secondary Text**: `#cccccc` (`--text-secondary`) - Body text, general content
- **Muted Text**: `#b2b2b2` (`--text-muted`) - Subtitles, secondary headings
- **Label Text**: `#aaa` (`--text-label`) - Form labels, table labels

### Accent Colors
- **Primary Accent**: `#4DC3FA` (`--accent-blue`) - Links, primary actions
- **Button Blue**: `#0057e7` (`--accent-blue-dark`) - Primary buttons
- **Button Blue Hover**: `#0040b3` (`--accent-blue-darker`) - Button hover states

### Brand Colors
- **Brand Orange**: `#ff8000` (`--brand-orange`) - Secondary brand color, highlights

### Status Colors
- **Success**: `#28a745` (`--success-green`) - On-time indicators, success states
- **Error/Late**: `#dc3545` (`--error-red`) - Error indicators, late trains
- **Warning**: `#ffc107` (`--warning-yellow`) - Warning states
- **Info**: `#4DC3FA` (`--info-blue`) - Information states

### Borders & Effects
- **Border**: `#444` (`--border-color`) - Subtle borders and dividers
- **Light Border**: `#555` (`--border-light`) - Slightly lighter borders
- **Accent Border**: `#4DC3FA` (`--border-accent`) - Highlighted borders
- **Drop Shadow**: `0 1px 2px rgba(0, 0, 0, 0.4)` (`--drop-shadow`) - Logo and icons
- **Text Shadow**: `1px 1px 2px rgba(0, 0, 0, 0.6)` (`--text-shadow`) - Main headings
- **Light Shadow**: `0 2px 8px rgba(0,0,0,0.1)` (`--shadow-light`) - Cards and tables
- **Medium Shadow**: `0 4px 20px rgba(0, 0, 0, 0.1)` (`--shadow-medium`) - Main containers
- **Heavy Shadow**: `0 -2px 10px rgba(0, 0, 0, 0.2)` (`--shadow-heavy`) - Fixed footers

### Transitions
- **Fast**: `0.15s ease` (`--transition-fast`) - Quick hover effects
- **Normal**: `0.3s ease` (`--transition-normal`) - Standard transitions
- **Slow**: `0.5s ease` (`--transition-slow`) - Dramatic effects

## Implementation

### 1. HTML Integration
All HTML files now include the colors.css file:
```html
<link rel="stylesheet" href="static/colors.css">
<link rel="stylesheet" href="style.css">
```

### 2. CSS Usage
The main stylesheet (`style.css`) maps the consistent color variables to project-specific names for backward compatibility:
```css
:root {
  --clr-background: var(--bg-primary);
  --clr-primary: var(--accent-blue);
  --clr-secondary: var(--brand-orange);
  /* etc... */
}
```

### 3. Direct Variable Usage
For new components, use the consistent variables directly:
```css
.new-component {
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-medium);
}
```

## Usage in Different Frameworks

### CSS Variables (Current Implementation)
```css
@import './static/colors.css';
body { 
  background-color: var(--bg-primary); 
  color: var(--text-primary);
}
```

### SCSS/Sass Variables
```scss
$bg-primary: #1F2739;
$bg-secondary: #2C3446;
$accent-blue: #4DC3FA;
$brand-orange: #ff8000;
```

### JavaScript/React
```js
const colors = {
  bgPrimary: '#1F2739',
  bgSecondary: '#2C3446',
  accentBlue: '#4DC3FA'
};
```

### Tailwind CSS Config
Add to your `tailwind.config.js`:
```js
module.exports = {
  theme: {
    extend: {
      colors: {
        'train-dark': '#1F2739',
        'train-card': '#2C3446',
        'train-accent': '#4DC3FA'
      }
    }
  }
}
```
