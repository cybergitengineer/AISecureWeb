# AI Security Platform - Design Guidelines

## Design Approach

**Selected Approach:** Hybrid (Security Platform Reference + Material Design System)

**Primary References:** GitHub Security, Snyk, Linear, Vercel Dashboard
- Professional security aesthetic with modern web app polish
- Data-dense interfaces with clear hierarchy
- Trust-building through transparency and clarity

**Design Principles:**
1. **Authority & Trust:** Professional presentation that instills confidence
2. **Clarity in Complexity:** Making complex security data accessible
3. **Action-Oriented:** Clear paths from insight to remediation
4. **Real-time Feedback:** Instant visual feedback for security testing

---

## Core Design Elements

### Typography

**Font Stack:** Inter (primary), JetBrains Mono (code/technical)

**Hierarchy:**
- Hero Headings: text-5xl/text-6xl, font-bold, tracking-tight
- Section Headings: text-3xl/text-4xl, font-semibold
- Subsection Headings: text-xl/text-2xl, font-semibold
- Body Text: text-base/text-lg, font-normal, leading-relaxed
- Technical/Code: text-sm/text-base, font-mono
- Captions/Metadata: text-sm, font-medium, opacity-70

### Layout System

**Spacing Primitives:** Tailwind units of 2, 4, 6, 8, 12, 16, 24
- Micro spacing (component internals): p-2, gap-2
- Standard spacing (cards, sections): p-4, p-6, gap-4
- Section padding: py-12, py-16, py-24
- Component margins: mb-8, mb-12, mt-16

**Container Strategy:**
- Max-width: max-w-7xl for main content
- Full-width for dashboards with sidebar: w-full
- Content sections: max-w-4xl for focused reading

**Grid Patterns:**
- Dashboard cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Feature showcase: grid-cols-1 lg:grid-cols-2 gap-8
- Metrics/Stats: grid-cols-2 md:grid-cols-4

---

## Component Library

### Navigation
**Top Navigation Bar:**
- Fixed header with backdrop blur effect
- Logo left, main navigation center, user menu/CTA right
- Height: h-16
- Items: flex gap-8, text-sm font-medium

**Sidebar (Dashboard):**
- Fixed left sidebar, w-64
- Navigation groups with icons (Heroicons)
- Active state with subtle accent background
- Collapsible on mobile (hamburger menu)

### Hero Section
**Layout:** Split layout (60/40) with left-aligned content
- Headline: Bold, large typography emphasizing "AI Security"
- Subheadline: Clear value proposition (2-3 lines)
- CTA Buttons: Primary + Secondary with blurred background
- Right side: Dashboard preview mockup or security visualization graphic

**No hero background image** - use gradient overlay or subtle geometric patterns

### Dashboard Components

**Security Score Card:**
- Large circular progress indicator (100px diameter)
- Score number: text-4xl font-bold
- Status badge: pill-shaped, color-coded
- Trend indicator with arrow icon
- Card padding: p-6

**Vulnerability Scanner Results:**
- Table layout with sortable columns
- Severity badges (Critical/High/Medium/Low)
- Row hover state with subtle background change
- Action buttons per row (text-sm)
- Empty state with illustration + CTA

**Real-time Testing Sandbox:**
- Two-column split: Input (left) / Output (right)
- Code editor styling for input area (dark background, monospace)
- Results panel with syntax highlighting
- Status indicators (Success/Warning/Danger)
- Loading states with pulse animations

**Metrics Overview:**
- Stat cards in grid (grid-cols-4)
- Large number: text-3xl font-bold
- Label: text-sm opacity-70
- Trend with percentage change
- Icon in top-right corner

### Forms & Inputs

**Input Fields:**
- Border-based design (not filled)
- Height: h-12
- Padding: px-4
- Focus state with ring-2
- Labels: text-sm font-medium, mb-2

**Buttons:**
- Primary: Solid background, h-11, px-6, rounded-lg, font-medium
- Secondary: Border with transparent background
- Destructive: Red accent for dangerous actions
- Icon buttons: Square h-10 w-10, rounded-lg

**Textareas:**
- Min height: h-32
- For prompt/code input: font-mono, text-sm
- Resize: resize-y

### Data Display

**Cards:**
- Border-based with subtle shadow on hover
- Padding: p-6
- Rounded corners: rounded-xl
- Header, content, footer sections clearly separated

**Badges:**
- Pill-shaped: rounded-full, px-3, py-1, text-xs font-medium
- Severity levels with distinct visual hierarchy
- Status indicators with dots

**Code Blocks:**
- Dark background panel
- Font: JetBrains Mono
- Padding: p-4
- Line numbers optional
- Copy button in top-right

**Tables:**
- Striped rows for readability (odd:bg-opacity-5)
- Sticky header on scroll
- Cell padding: px-4 py-3
- Hover state on rows
- Sortable column headers with icons

### Feedback Elements

**Alert Banners:**
- Full-width with icon left, message center, close right
- Types: Success, Warning, Error, Info
- Padding: p-4
- Dismissable with X icon

**Toast Notifications:**
- Fixed bottom-right position
- Auto-dismiss after 5s
- Slide-in animation
- Max-width: max-w-md

**Loading States:**
- Skeleton screens for cards
- Spinner for inline actions (h-5 w-5)
- Progress bars for multi-step processes
- Pulse animations for placeholders

---

## Page Layouts

### Landing Page (5-7 Sections)

1. **Hero:** Split layout with dashboard preview
2. **Security Capabilities:** 3-column grid showcasing core features (Vulnerability Detection, Prompt Injection Analysis, Model Security Testing)
3. **Interactive Demo:** Embedded sandbox preview with live prompt testing
4. **Trust Signals:** Logos of security standards/frameworks, stats grid
5. **Feature Deep-Dive:** Alternating left/right layouts for detailed features
6. **Security Score Preview:** Visual representation of the scoring system
7. **CTA Section:** Centered, focus on getting started

### Dashboard Layout

**Structure:**
- Fixed sidebar navigation (left)
- Top bar with breadcrumbs, search, user menu
- Main content area with max-w-7xl
- Right panel for contextual info (conditional)

**Dashboard Home:**
- Overview metrics (4-column grid)
- Recent scan results (table)
- Security score trending chart
- Quick actions panel

---

## Images

**Hero Section Image:**
- Placement: Right side of split layout (40% width)
- Type: Modern dashboard/interface mockup showing security analytics
- Style: Clean, professional screenshot with subtle shadow
- Alternative: Abstract visualization of AI security concepts (neural networks with shield iconography)

**Feature Section Images:**
- Type: Interface screenshots demonstrating features
- Placement: Alternating left/right in feature deep-dive
- Style: Contained within rounded frames with subtle shadows

**Trust Section:**
- Company/framework logos in grid format
- Grayscale treatment for cohesion

---

## Accessibility & Interactions

- Focus indicators: ring-2 with appropriate offset
- Keyboard navigation fully supported
- ARIA labels for icon-only buttons
- High contrast ratios throughout
- Form validation with clear error states
- No autoplay animations
- Skip-to-content link for keyboard users

---

## Distinctive Elements

- **Monospace typography** for all technical/security-related content
- **Status color system** consistently applied (success/warning/critical)
- **Blur effects** on navigation and floating elements for depth
- **Micro-interactions** on hover for data points (tooltips with details)
- **Progressive disclosure** for complex security reports
- **Contextual help icons** throughout with hover tooltips