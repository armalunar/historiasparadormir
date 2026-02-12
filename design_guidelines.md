# Design Guidelines: Contos para Dormir (Bedtime Stories)

## Design Approach
**Reference-Based**: Drawing inspiration from immersive, content-rich platforms like Medium (reading experience) + Calm app (soothing aesthetics) + Notion (admin capabilities), creating a magical bedtime atmosphere.

## Core Aesthetic: Magical Night Theme
- **Visual Identity**: Aconchegante (cozy), professional, immersive, and deeply detailed
- **Atmosphere**: Starry night magic with soothing, dreamy qualities
- **Quality Mandate**: Ultra-detailed, visually rich, impeccably functional - NEVER minimalist, shallow, or unfinished

## Typography
**Font Stack**:
- Headings: Lora (serif, elegant)
- Body Text: Merriweather (reading-optimized serif)
- UI Elements: Poppins (clean sans-serif)

**Hierarchy**:
- Story Titles: 2xl-4xl, Lora, font-bold
- Story Content: lg-xl, Merriweather, line-height relaxed
- UI Labels: sm-base, Poppins, font-medium
- Preserve exact formatting: paragraphs, line breaks, spacing, indentation

## Color System
**Night Gradients** (smooth, layered):
- Deep blue → Lilac → Soft pink → Golden accents
- Background gradients should be multi-layered and atmospheric
- Card overlays with semi-transparent dark backgrounds
- Golden highlights for interactive elements and CTAs

## Layout & Spacing
**Spacing Units**: Tailwind units of 4, 6, 8, 12, 16, 24
- Generous padding throughout (never cramped)
- Rich, detailed sections with breathing room
- Cards: p-6 to p-8
- Sections: py-12 to py-24

## Component Library

### Story Cards
- Gradient card backgrounds with cover image overlay
- Hover animations (lift, glow, scale: 1.02)
- Image with gradient overlay for text readability
- Title, preview text, read time, date
- Smooth shadow transitions

### Story Reader
- Wide max-width container (max-w-4xl)
- Cover image header with gradient fade
- Floating settings button (bottom-right, blurred background)
- Integrated music player (subtle, non-intrusive)
- Content preserves exact formatting with proper typography hierarchy

### Music Player
- Sleek, minimal bar design
- Play/pause, track info, volume control
- Smooth playback transitions
- Admin: add/remove tracks interface

### Settings Panel
- Modal overlay with blurred backdrop
- Organized sections: Font, Theme, Text Size, Particles Toggle, Music Toggle
- "Informar credenciais" button for admin access
- All settings persist in localStorage

### Admin Panel
- Full dashboard layout
- Story management: Create, edit, delete with rich text editor
- Cover image upload with preview
- Music library management
- Visual customization tools
- Debug utilities

## Visual Enhancements

### Particles
- tsparticles integration
- Light, subtle floating particles (stars, sparkles)
- Interactive but never distracting
- Toggle-able via settings

### Animations (Framer Motion)
- Page transitions: fade + slight vertical movement
- Card hover: lift + glow effect
- Button microinteractions: scale, glow on hover
- Modal entrances: scale + fade
- Smooth, never jarring (duration: 0.3-0.5s)

### Microinteractions
- Buttons: hover scale (1.05), subtle glow
- Cards: shadow expansion, slight lift
- Form inputs: focus border glow
- Icons: rotate, pulse on interaction

## Navigation
- Sticky header with blurred background
- Logo + main navigation links
- User settings icon (top-right)
- Mobile: hamburger menu with smooth slide-in

## Responsive Design
- Mobile: Single column, full-width cards
- Tablet: 2-column grid for stories
- Desktop: 3-column grid, wider reader
- All spacing scales appropriately

## Page-Specific Layouts

### Homepage/Story Listing
- Hero section with gradient background and floating particles
- Grid of story cards (responsive: 1-3 columns)
- Filter/sort options (if applicable)
- Rich footer with navigation links

### Story Reader
- Full-width cover image with title overlay
- Content in centered column (max-w-4xl)
- Floating settings button
- Bottom music player bar
- Smooth scroll experience

### Admin Dashboard
- Sidebar navigation
- Main content area with cards/tables
- Rich text editor for story creation
- Image upload zones with drag-and-drop
- Action confirmation modals

## Images
**Cover Images**: Essential for every story
- Aspect ratio: 16:9 or 3:2
- High quality, evocative of story themes
- Display in cards, reader header, admin previews

**Placement**:
- Story cards: Background with gradient overlay
- Reader: Full-width header with title overlay
- Admin: Upload interface with current cover preview

**Buttons on Images**: Blurred background (backdrop-blur-md), no hover color changes

## Critical Requirements
- Zero console errors, zero build errors
- All text formatting preserved exactly as saved
- Firebase Storage for all media (covers, music)
- Admin password: jem1505 (hardcoded)
- Complete, production-ready, deployment-ready quality