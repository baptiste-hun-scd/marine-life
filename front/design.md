---
name: Oceanic Scholastic
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#43474e'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#74777f'
  outline-variant: '#c4c6cf'
  surface-tint: '#476083'
  primary: '#000613'
  on-primary: '#ffffff'
  primary-container: '#001f3f'
  on-primary-container: '#6f88ad'
  inverse-primary: '#afc8f0'
  secondary: '#005eb2'
  on-secondary: '#ffffff'
  secondary-container: '#4597fe'
  on-secondary-container: '#002e5d'
  tertiary: '#0e0300'
  on-tertiary: '#ffffff'
  tertiary-container: '#351600'
  on-tertiary-container: '#d36900'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d4e3ff'
  primary-fixed-dim: '#afc8f0'
  on-primary-fixed: '#001c3a'
  on-primary-fixed-variant: '#2f486a'
  secondary-fixed: '#d5e3ff'
  secondary-fixed-dim: '#a7c8ff'
  on-secondary-fixed: '#001b3b'
  on-secondary-fixed-variant: '#004788'
  tertiary-fixed: '#ffdcc7'
  tertiary-fixed-dim: '#ffb787'
  on-tertiary-fixed: '#311300'
  on-tertiary-fixed-variant: '#723600'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
  title-md:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  data-mono:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
  gutter: 20px
  margin-mobile: 16px
  margin-desktop: 64px
---

## Brand & Style

The design system for this marine biology encyclopedia focuses on "Immersive Scholasticism." The objective is to balance the depth and mystery of the ocean with the precision of scientific research. The UI should evoke a sense of calm exploration, utilizing heavy whitespace (sea-salt white) to frame high-definition aquatic photography.

The aesthetic blends **Modern Corporate** reliability with **Glassmorphism** highlights to mimic the properties of water. This approach ensures that complex taxonomic data remains legible while maintaining a premium, editorial feel that respects the beauty of marine life.

## Colors

The palette is rooted in the "Abyssal Blue" (#001F3F) for primary branding and deep-sea depth, transitioning to "Surface Blue" (#0074D9) for interactive elements and primary actions. "Coral" (#FF851B) is reserved strictly for highlights, call-outs, and endangered status indicators to ensure high visibility against cool backgrounds.

Backgrounds utilize "Sea-Salt White" (#F8FAFC) to maintain a clean, professional environment for reading long-form scientific text. Text colors should range from a deep charcoal-blue for body copy to a softer slate for metadata to ensure optimal contrast without eye strain.

## Typography

This design system employs a dual-typeface strategy. **Playfair Display** provides an elegant, authoritative serif for species names and high-level headings, emphasizing the "encyclopedia" feel. Scientific names (Latin) should always be rendered in `title-md` with italics.

**Inter** handles all functional data, taxonomy tables, and long-form descriptions. Its high x-height ensures legibility during deep research sessions. Use `label-sm` for category tags and habitat metadata to maintain a structured, organized hierarchy.

## Layout & Spacing

The layout follows a 12-column fluid grid for desktop and a 4-column grid for mobile. It prioritizes "negative space as breathing room," mimicking the vastness of the ocean.

Species profiles utilize a "Staggered Content" model: large-scale photography on one side (or top) with structured data cards overlapping slightly to create a layered, modern depth. Margins are generous (64px on desktop) to keep the focus central and scholarly. Spacing between data points in taxonomy tables should be tight (`md`) to indicate grouping, while major sections should be separated by `xl` spacing.

## Elevation & Depth

Depth is conveyed through **Tonal Layering** and **Ambient Shadows**. Surfaces do not use harsh borders; instead, they use very soft, diffused shadows with a slight blue tint (`rgba(0, 31, 63, 0.08)`) to suggest elements floating in water.

- **Level 0 (Base):** Sea-Salt White background.
- **Level 1 (Cards):** Pure white surface with a 16px blur shadow.
- **Level 2 (Modals/Overlays):** Semi-transparent white with a 20px backdrop blur (Glassmorphism), creating the effect of looking through a diving mask or clear water.

## Shapes

The design system uses "Rounded" geometry (8px / 0.5rem base) to soften the professional tone and make the interface feel more organic and approachable, reflecting biological forms.

Interactive elements like buttons and search bars use the base `roundedness`. Image containers for species galleries should use `rounded-lg` (16px) to appear more like framed specimens. Status chips and habitat icons use `rounded-xl` (24px) for a "pebble" aesthetic.

## Components

- **Species Cards:** Feature a full-bleed image at the top with a subtle gradient overlay at the bottom for text legibility. Use the primary serif for the name.
- **Taxonomy Tables:** Use alternating row highlights in a very faint blue (`#F1F5F9`). Headers should use `label-sm`.
- **Habitat Chips:** Small, pill-shaped indicators with a monochromatic icon (e.g., coral, deep sea, reef) and a background color that is 10% opacity of the category color.
- **Action Buttons:** Primary buttons are solid `primary_color_hex` with white text. Secondary buttons use an outline of `secondary_color_hex` with no fill.
- **Information Callouts:** For "Conservation Status," use a tinted background (Coral for endangered, Green for least concern) with a thick left-side border to draw immediate attention.
- **Observation Inputs:** Search and filter bars should include a "glass" texture when placed over images to maintain the immersive aesthetic.
