# Luxury Real Estate — Cinematic Landing Page

A premium luxury real-estate landing page built with **Next.js 14, TypeScript, Tailwind CSS, GSAP, ScrollTrigger, and Lenis**.

The website is designed as a cinematic, scroll-driven experience with immersive building visuals, smooth transitions, parallax effects, interactive floor plans, horizontal amenity galleries, location storytelling, and an enquiry experience.

The goal is to create the feeling of exploring a luxury property through a continuous cinematic journey rather than navigating a conventional real-estate website.

---

## ✨ Features

### 🎬 Cinematic Hero

The hero section uses a **canvas-based image sequence** to create a building reveal as the user scrolls.

* Numbered WebP image sequence
* Full-screen canvas rendering
* Scroll-controlled frame scrubbing
* GSAP ScrollTrigger integration
* Pinned hero section
* Project name and tagline overlays
* Smooth fade transitions
* Frame preload progress indicator
* Loading screen with percentage

Expected sequence format:

```text
/public/seq/
├── tower_0001.webp
├── tower_0002.webp
├── tower_0003.webp
├── ...
└── tower_0120.webp
```

The current frame is calculated from scroll progress:

```text
frameIndex = Math.round(progress * (totalFrames - 1))
```

---

## 🌊 Smooth Scrolling

The project uses **Lenis** together with GSAP and ScrollTrigger to create a smooth, premium scrolling experience.

The scrolling system synchronizes:

```text
Lenis
   ↓
GSAP ticker
   ↓
ScrollTrigger
   ↓
Scroll-driven animations
```

GSAP ticker lag smoothing is disabled to maintain accurate ScrollTrigger synchronization.

---

## 📖 Story Section

The Story section introduces the property's identity through a minimal editorial layout.

Features:

* Pinned content
* Word-by-word staggered reveal
* Scroll-driven typography
* Large serif headings
* Muted luxury copy
* Generous whitespace
* Subtle motion

The section is intentionally minimal so the typography and storytelling remain the focus.

---

## 🏛️ Amenities

The Amenities section uses a **horizontal-scroll gallery controlled by vertical scrolling**.

Features:

* Pinned section
* Horizontal card movement
* Image parallax
* Scroll-triggered transitions
* Luxury property imagery
* Smooth card reveals

The horizontal movement follows the available scroll distance:

```text
x = -(scrollWidth - viewportWidth) * progress
```

This allows the entire amenity collection to be explored naturally through vertical scrolling.

---

## 🏠 Residences & Floor Plans

The Residences section provides interactive unit information.

Available configurations:

* 1 Bedroom
* 2 Bedroom
* 3 Bedroom
* Penthouse

Each tab displays relevant property information such as:

* Area
* Bedrooms
* Bathrooms
* Price from
* Floor-plan visualization

The floor plan uses an animated SVG so the transition between residence types feels integrated with the overall motion design.

---

## 📍 Location

The Location section presents the property's surrounding neighbourhood.

Features include:

* Interactive-style map presentation
* Animated location pins
* Neighbourhood highlights
* Scroll-triggered reveals
* Location storytelling
* Nearby landmarks and amenities

Pins and information are introduced progressively as the user scrolls through the section.

---

## 🖼️ Gallery

The Gallery section uses a premium masonry-style image layout.

Images reveal as they enter the viewport using effects such as:

* Clip-path reveals
* Vertical movement
* Staggered animation
* Opacity transitions
* Image scaling
* Parallax movement

The result is designed to feel more like a luxury editorial gallery than a traditional image grid.

---

## ✉️ Enquiry

The Enquiry section contains a sticky lead-generation form.

Fields include:

* Name
* Email
* Phone
* Unit Type
* Message

Form submissions are sent to:

```text
/api/enquiry
```

The section also provides an availability status to communicate current enquiry/property availability.

---

## 🧊 Optional 3D Hero Mode

The project architecture can support an optional **React Three Fiber** hero experience.

Instead of the image sequence, the hero can use a 3D building model:

```text
Building GLB
     ↓
React Three Fiber
     ↓
Scroll progress
     ↓
Camera orbit
```

The 3D approach can use:

* `@react-three/fiber`
* `@react-three/drei`
* GLB/GLTF building model
* Suspense loading
* Drei Environment lighting
* Scroll-controlled camera movement

The 3D hero is designed as a toggleable alternative to the canvas image-sequence approach.

---

# 🎨 Design System

The visual direction follows a **minimal luxury real-estate aesthetic**.

### Color Palette

Primary tones:

* Bone
* Warm white
* Taupe
* Charcoal
* Muted beige
* Soft gold accents

### Typography

The design combines:

**Elegant serif**

for:

* Hero headings
* Section titles
* Property statements
* Editorial moments

with a:

**Refined sans-serif**

for:

* Navigation
* Body copy
* Property specifications
* Buttons
* Forms

Next.js `next/font` is used for optimized font loading.

---

# 🛠️ Tech Stack

### Framework

* Next.js 14
* React
* TypeScript

### Styling

* Tailwind CSS
* Responsive utility classes

### Animation

* GSAP
* ScrollTrigger
* Lenis

### Optional 3D

* React Three Fiber
* Three.js
* Drei

### Graphics

* HTML Canvas
* SVG
* WebP image sequences

### API

* Next.js API Routes / Route Handlers

---

# 📁 Suggested Project Structure

```text
project/
│
├── app/
│   ├── api/
│   │   └── enquiry/
│   │       └── route.ts
│   │
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── Hero/
│   │   ├── Hero.tsx
│   │   └── HeroCanvas.tsx
│   │
│   ├── Story/
│   │   └── Story.tsx
│   │
│   ├── Amenities/
│   │   └── Amenities.tsx
│   │
│   ├── Residences/
│   │   ├── Residences.tsx
│   │   └── FloorPlan.tsx
│   │
│   ├── Location/
│   │   └── Location.tsx
│   │
│   ├── Gallery/
│   │   └── Gallery.tsx
│   │
│   ├── Enquire/
│   │   └── Enquire.tsx
│   │
│   └── Navigation/
│       └── Navigation.tsx
│
├── hooks/
│   └── useImageSequence.ts
│
├── providers/
│   └── LenisProvider.tsx
│
├── public/
│   ├── seq/
│   │   ├── tower_0001.webp
│   │   ├── tower_0002.webp
│   │   └── ...
│   │
│   ├── images/
│   ├── floorplans/
│   └── models/
│       └── building.glb
│
├── lib/
│   └── ...
│
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── next.config.js
└── README.md
```

---

# 🚀 Getting Started

## 1. Clone the project

```bash
git clone <your-repository-url>
```

Move into the project directory:

```bash
cd <project-folder>
```

---

## 2. Install dependencies

Using npm:

```bash
npm install
```

Or using yarn:

```bash
yarn install
```

Or using pnpm:

```bash
pnpm install
```

---

## 3. Add the Hero Image Sequence

Place the building image sequence inside:

```text
public/seq/
```

The files should follow a consistent naming convention:

```text
tower_0001.webp
tower_0002.webp
tower_0003.webp
...
tower_0120.webp
```

Make sure all frames have consistent:

* Dimensions
* Aspect ratio
* Image composition
* Naming convention

For best performance, WebP is recommended.

---

# ▶️ Run Development Server

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

The website will automatically update when files are changed.

---

# 🏗️ Production Build

Create an optimized production build:

```bash
npm run build
```

Then start the production server:

```bash
npm start
```

---

# ⚡ Image Sequence Performance

The hero sequence can contain a large number of high-resolution images, so performance should be considered carefully.

Recommended practices:

* Use WebP instead of large PNG files
* Keep frame dimensions consistent
* Compress images before deployment
* Avoid unnecessarily large frame resolutions
* Preload frames progressively when appropriate
* Use lower-resolution assets for mobile
* Respect `prefers-reduced-motion`

For example:

```text
Desktop:
120 high-quality frames

Mobile:
Short video / poster image
```

This prevents mobile devices from downloading a large image sequence unnecessarily.

---

# ♿ Reduced Motion

The experience respects users who prefer reduced motion.

When:

```text
prefers-reduced-motion: reduce
```

is enabled:

* Heavy scroll scrubbing is disabled
* Large parallax effects are reduced
* Canvas animation can be replaced with a static poster
* 3D camera motion is reduced
* Content remains fully accessible

---

# 📱 Responsive Experience

The website is designed for:

* Desktop
* Laptop
* Tablet
* Mobile

On smaller screens:

* Navigation becomes mobile-friendly
* Horizontal galleries adapt to touch interaction
* Typography scales responsively
* Heavy animation is reduced
* Hero sequence can switch to video/poster mode
* Floor plans remain readable
* Enquiry form becomes vertically stacked

No horizontal overflow should occur.

---

# 🔌 Enquiry API

The enquiry form submits data to:

```text
POST /api/enquiry
```

Example request:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+91 9876543210",
  "unitType": "3BR",
  "message": "I would like to know more about the available units."
}
```

The API should validate incoming fields before processing the enquiry.

For production, connect the endpoint to your preferred:

* Email service
* CRM
* Database
* Lead management system

---

# 🔐 Environment Variables

If the enquiry API or other services require environment variables, create:

```text
.env.local
```

Example:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Add any production-only secrets required by your email, CRM, database, or third-party services.

Never commit `.env.local` or secret API keys to Git.

---

# 🎥 Hero Architecture

The hero image sequence follows this flow:

```text
User Scroll
     ↓
Lenis
     ↓
ScrollTrigger
     ↓
Scroll Progress
     ↓
Frame Index
     ↓
Canvas
     ↓
Building Frame
```

Conceptually:

```text
progress = 0
     ↓
tower_0001.webp

progress = 0.5
     ↓
tower_0060.webp

progress = 1
     ↓
tower_0120.webp
```

This creates the feeling of a cinematic camera moving around or toward the building as the visitor scrolls.

---

# 🧭 Animation Architecture

The project uses GSAP ScrollTrigger for:

* Hero pinning
* Canvas scrubbing
* Story text reveals
* Horizontal gallery movement
* Image parallax
* Gallery reveals
* Location animations
* Floor-plan transitions
* Section entrances

Lenis provides the smooth scrolling layer while GSAP controls the animation timeline.

---

# 🧩 Reusable Components

The project is structured around reusable components rather than one large page component.

Important reusable pieces include:

### `useImageSequence`

Responsible for:

* Frame loading
* Loading progress
* Current frame
* Canvas rendering
* Image sequence management

### `LenisProvider`

Responsible for:

* Initializing Lenis
* Connecting Lenis with GSAP
* Updating ScrollTrigger
* Managing animation frame updates

### Hero

Responsible for:

* Canvas
* Loading state
* Project title
* Hero animation
* ScrollTrigger

### Residences

Responsible for:

* Unit tabs
* Floor-plan display
* Specifications
* Pricing information

### Enquiry

Responsible for:

* Form state
* Validation
* API submission
* Availability state
* Success/error feedback

---

# 🌐 Deployment

The project can be deployed to platforms that support Next.js applications, such as:

* Vercel
* Self-hosted Node.js
* Other Next.js-compatible hosting platforms

Before deploying:

```bash
npm run build
```

Verify that:

* All image sequence files are included
* API routes work
* Environment variables are configured
* Floor-plan assets load correctly
* GLB assets are available if 3D mode is enabled
* Mobile layout works correctly
* Reduced-motion behavior works correctly

---

# 📌 Important Asset Requirements

The project expects the following types of assets:

```text
Hero
├── tower_0001.webp
├── tower_0002.webp
└── ...

Amenities
├── amenity-01.webp
├── amenity-02.webp
└── ...

Floor Plans
├── 1br.svg
├── 2br.svg
├── 3br.svg
└── penthouse.svg

Gallery
├── gallery-01.webp
├── gallery-02.webp
└── ...

Optional 3D
└── building.glb
```

Use optimized assets wherever possible to maintain smooth scrolling and fast initial loading.

---

# 🎯 Project Goal

This project is designed to transform a conventional real-estate website into an **immersive digital property experience**.

Instead of simply presenting:

```text
Property
Amenities
Floor Plans
Location
Gallery
Contact
```

the website tells a continuous visual story:

```text
ARRIVE
   ↓
DISCOVER
   ↓
EXPERIENCE
   ↓
EXPLORE
   ↓
IMAGINE
   ↓
ENQUIRE
```

The combination of cinematic motion, luxury typography, architectural imagery, smooth scrolling, interactive floor plans, and immersive transitions creates a premium digital experience suitable for high-end real-estate projects.

---

## 📄 License

This project is intended for the specified real-estate project.

Replace this section with the appropriate license or ownership information before publishing the repository publicly.
