---
name: Cognitive Research Framework
colors:
  surface: '#fcf8ff'
  surface-dim: '#dcd8e5'
  surface-bright: '#fcf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f2ff'
  surface-container: '#f0ecf9'
  surface-container-high: '#eae6f4'
  surface-container-highest: '#e4e1ee'
  on-surface: '#1b1b24'
  on-surface-variant: '#464555'
  inverse-surface: '#302f39'
  inverse-on-surface: '#f3effc'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#505f76'
  on-secondary: '#ffffff'
  secondary-container: '#d0e1fb'
  on-secondary-container: '#54647a'
  tertiary: '#7e3000'
  on-tertiary: '#ffffff'
  tertiary-container: '#a44100'
  on-tertiary-container: '#ffd2be'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#d3e4fe'
  secondary-fixed-dim: '#b7c8e1'
  on-secondary-fixed: '#0b1c30'
  on-secondary-fixed-variant: '#38485d'
  tertiary-fixed: '#ffdbcc'
  tertiary-fixed-dim: '#ffb695'
  on-tertiary-fixed: '#351000'
  on-tertiary-fixed-variant: '#7b2f00'
  background: '#fcf8ff'
  on-background: '#1b1b24'
  surface-variant: '#e4e1ee'
typography:
  display-lg:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Geist
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
    letterSpacing: '0'
  body-md:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: '0'
  body-sm:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: '0'
  label-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.04em
  mono-sm:
    fontFamily: Geist Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: '0'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  container-max: 1440px
  gutter: 24px
  sidebar-width: 260px
---

## Brand & Style

The design system is engineered for deep work, cognitive clarity, and academic precision. It targets researchers, analysts, and knowledge workers who require a high-density information environment that remains visually calm.

The style is **Neo-Minimalist**, blending the utility of developer tools like Linear with the editorial elegance of modern publishing. It prioritizes content over container, utilizing a "Chrome-Light" philosophy where the interface recedes to allow research data to stand out. The emotional response is one of organized intelligence: professional, quiet, and highly efficient.

## Colors

The palette is anchored in a cool-toned neutral foundation to reduce eye strain during long research sessions. 

- **Primary Indigo** is used sparingly for meaningful actions, progress indicators, and active states.
- **Background and Surface** levels create a subtle distinction between the canvas and functional containers.
- **Semantic Colors** (Success, Warning, Error) utilize standard utility hues but are applied with reduced saturation in non-critical states to maintain the minimal aesthetic.
- **Borders** act as the primary structural element, replacing shadows to define the geometry of the workspace.

## Typography

This design system utilizes **Geist** for its technical precision and readability. The typographic scale is designed for hierarchical clarity, essential for navigating complex research papers or datasets.

- **Headlines:** Use tight letter-spacing and semi-bold weights to command attention without being aggressive.
- **Body Text:** Set with generous line heights (1.5x) to ensure maximum legibility for long-form reading.
- **Monospace:** Integrated for metadata, IDs, and citations to provide a "technical" secondary layer of information.
- **Labels:** Use medium weights and slightly increased letter-spacing for UI controls and navigation items.

## Layout & Spacing

The layout employs a **Fluid Grid** logic within a maximum container width of 1440px. The spacing rhythm is based on a **4px baseline grid**, ensuring all elements align to a consistent mathematical scale.

- **Desktop:** A fixed-width left sidebar (260px) manages primary navigation. The main content area uses a flexible 12-column grid with 24px gutters.
- **Padding:** Generous internal padding within cards (24px) prevents information density from feeling overwhelming.
- **Margins:** Large section margins (48px) provide visual "breathing room" between major logical blocks of the dashboard.
- **Mobile:** The sidebar collapses into a bottom navigation bar or a hamburger menu, and horizontal padding reduces to 16px to maximize screen real estate.

## Elevation & Depth

This design system avoids traditional heavy shadows in favor of **Tonal Layering and Soft Outlines**.

- **Level 0 (Background):** Used for the main canvas in `#F8FAFC`.
- **Level 1 (Surface):** Primary containers like cards, sidebars, and top navigation use white `#FFFFFF` with a 1px border of `#E2E8F0`. 
- **Active Elevation:** Only upon interaction (hover/drag) is a subtle, diffused shadow applied: `0 4px 12px rgba(15, 23, 42, 0.05)`.
- **Modals:** Use a higher contrast border and a 20% backdrop blur (glassmorphism) to separate from the background without losing context.

## Shapes

The shape language is sophisticated and modern, utilizing **Rounded (Level 2)** configurations to soften the professional tone.

- **Standard Elements:** Buttons, input fields, and small cards use `0.5rem` (8px).
- **Major Containers:** Main dashboard cards and content areas use `1rem` (16px) or `1.5rem` (24px) for a contemporary, premium feel.
- **Interactive States:** Use smooth corner smoothing (iOS-style) where possible to avoid a "mechanical" appearance.

## Components

### Buttons
- **Primary:** Solid Indigo background, white text, 8px radius. Transitions to Primary Hover smoothly (200ms).
- **Secondary/Ghost:** Transparent background with 1px border. Background fills to a very faint Indigo (5% opacity) on hover.

### Cards
- **Research Cards:** White background, 1px border, 16px corner radius. Title in `headline-sm`, metadata in `label-sm`.
- **Interactive:** Slight lift on hover (border color darkens to `#CBD5E1`).

### Input Fields
- **Search & Entry:** Subtle `#F8FAFC` fill with a `1px` border. On focus, the border changes to Primary Indigo with a 2px outer glow (ring) of the same color at 10% opacity.

### Navigation (Sidebar)
- **Active State:** A vertical Indigo bar on the left edge (4px width) and a light Indigo background tint behind the text.
- **Icons:** Use linear, 2px stroke icons to match the Geist typography weight.

### Chips & Tags
- Used for research categories and status. Small radius (4px), light gray background `#F1F5F9`, and `label-sm` typography. 

### Data Tables
- Row-based layout with no vertical borders. Horizontal borders only. Header row in `label-sm` with a light gray background tint.