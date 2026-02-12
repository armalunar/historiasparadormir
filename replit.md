# Contos para Dormir (Bedtime Stories)

## Overview

Contos para Dormir is a bedtime stories platform featuring an immersive, magical nighttime reading experience. The application provides a curated collection of stories with ambient music, particle effects, and a soothing visual design inspired by starry nights. Users can read stories with customizable settings (font, text size, theme), while administrators can manage the story collection and background music through a protected admin panel.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server
- Wouter for lightweight client-side routing
- TanStack Query (React Query) for server state management and caching

**UI Component Library**
- Shadcn UI (Radix UI primitives) for accessible, customizable components
- Tailwind CSS for utility-first styling with custom theme configuration
- Framer Motion for smooth animations and transitions
- TSParticles for ambient particle effects background

**Design System**
- Custom color palette with light/dark theme support
- Typography stack: Lora (headings), Merriweather (body text), Poppins (UI elements)
- Gradient-based "magical night" aesthetic with multi-layered backgrounds
- Responsive design with mobile-first approach

**State Management**
- React Query for server-side data (stories, music)
- Local React state for UI interactions
- LocalStorage for user preferences (font, text size, theme, particles, music settings)
- Session-based admin authentication state

**Key Features**
- Story reader with customizable typography and text sizing
- Integrated music player with volume controls
- Settings modal for user preferences
- Particle animation background (toggleable)
- Theme switching (light/dark mode)
- Admin panel for content management (password-protected)

### Backend Architecture

**Server Framework**
- Express.js server with TypeScript
- Session-based authentication using express-session
- Separate development (Vite middleware) and production (static serving) entry points

**API Design**
- RESTful API endpoints under `/api` prefix
- Admin-protected routes requiring session authentication
- CRUD operations for stories and music
- JSON request/response format

**Authentication & Authorization**
- Simple password-based admin authentication (hardcoded password in schema)
- Session middleware with HTTP-only cookies
- Admin-only routes protected by middleware
- No user registration - single admin access only

**Data Validation**
- Zod schemas for runtime validation of stories, music, and settings
- Type-safe data models shared between client and server via `/shared` directory

### Data Storage

**Primary Database**
- Firebase Firestore for all persistent data storage
- Collections: `stories`, `music`
- Firebase Admin SDK for server-side operations
- Real-time updates capability (though currently using polling via React Query)

**File Storage**
- Firebase Storage for media assets (cover images, music files)
- Direct URL references stored in Firestore documents

**Schema Design**
- Stories: id, title, content (preserved formatting), coverImageUrl, createdAt, updatedAt
- Music: id, name, url, uploadedAt
- Timestamps stored as Unix epoch numbers

**Client-Side Storage**
- LocalStorage for user settings (font, theme, text size, particles, music enabled)
- Session storage for admin authentication state

### External Dependencies

**Firebase Services**
- Firebase Firestore: NoSQL document database for stories and music metadata
- Firebase Storage: Cloud storage for cover images and music files
- Firebase Admin SDK: Server-side Firebase operations

**Required Environment Variables**
```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
VITE_FIREBASE_MEASUREMENT_ID (optional)
FIREBASE_ADMIN_CLIENT_EMAIL
FIREBASE_ADMIN_PRIVATE_KEY
SESSION_SECRET (optional, defaults to hardcoded value)
```

**UI Libraries**
- Radix UI: Headless accessible component primitives
- Tailwind CSS: Utility-first CSS framework
- Framer Motion: Animation library
- TSParticles: Particle animation engine

**Development Tools**
- Replit-specific plugins for development environment
- TypeScript for static type checking
- Drizzle Kit (configured but not actively used - Firestore is primary database)

**Additional Dependencies**
- date-fns: Date formatting utilities
- react-hook-form with @hookform/resolvers: Form management
- Zod: Schema validation
- Nanoid: ID generation (for development hot reload)