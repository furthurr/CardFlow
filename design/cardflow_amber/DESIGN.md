# Design System Specification: The Tactile Curator

## 1. Overview & Creative North Star
The "Tactile Curator" is the creative North Star of this design system. It moves away from the sterile, flat "SaaS-standard" aesthetic toward an editorial, high-end experience that feels like a premium physical portfolio. 

We achieve this through **Intentional Asymmetry** and **Tonal Depth**. Instead of rigid, boxed-in grids, we use white space as a structural element. Elements should feel like they are resting on a surface rather than being trapped in a container. By prioritizing breathing room and high-contrast typography, we create an environment that feels authoritative yet warm and approachable.

---

## 2. Colors & Surface Philosophy

### Palette Definition
The palette is anchored by a warm, sophisticated off-white (`surface`) and a vibrant, energetic "Sun-Drenched" primary gradient.

*   **Primary Core:** `primary` (#9f4200) / `primary_container` (#f27121)
*   **Neutral Foundation:** `background` (#faf9fe) / `on_background` (#1a1c1f)
*   **The Signature Gradient:** From `hsl(24, 100%, 72%)` to `hsl(18, 98%, 53%)`. Use this exclusively for Hero CTAs and high-impact moments.

### The "No-Line" Rule
Standard 1px borders are strictly prohibited for sectioning. To define boundaries, use **Background Shifts**. 
*   Place a `surface_container_low` card on a `surface` background. 
*   Use `surface_container_highest` only for the most critical nested utility elements (like search bars or active states).

### Glass & Gradient Rule
Floating elements (Navbars, Modals) should employ **Glassmorphism**. Use `secondary` (#ffffff) at 80% opacity with a `backdrop-blur` of 12px. This ensures the warm background tones bleed through, preventing the UI from feeling "pasted on."

---

## 3. Typography: Editorial Authority
We utilize **Inter** not as a functional workhorse, but as a bold editorial voice. 

| Level | Token | Size | Weight | Tracking | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Display** | `display-lg` | 3.5rem | 700 | -0.02em | Hero headers, maximalist impact. |
| **Headline** | `headline-md` | 1.75rem | 600 | -0.01em | Section titles. |
| **Title** | `title-lg` | 1.375rem | 500 | 0 | Card titles, sub-headers. |
| **Body** | `body-lg` | 1rem | 400 | 0 | Standard reading text. |
| **Label** | `label-md` | 0.75rem | 600 | +0.05em | Uppercase tags, micro-copy. |

**Hierarchy Note:** Always pair a `display-lg` headline with a `body-lg` description. Avoid "middle-ground" sizing; go big or go small to create visual tension.

---

## 4. Elevation & Depth: Tonal Layering
In this design system, height is expressed through tone, not just shadows.

*   **The Layering Principle:** Stack surfaces to create focus. A `surface_container_lowest` (Pure White) card sitting on a `surface_container_low` background creates a natural "lift."
*   **Ambient Shadows:** For floating components (e.g., the Navbar), use a `shadow-sm` equivalent: `0 4px 20px -2px rgba(26, 28, 31, 0.06)`. The shadow must be large, soft, and tinted by the `on_surface` color—never pure black.
*   **The "Ghost Border" Fallback:** If accessibility requires a border, use `outline_variant` at 20% opacity. It should be felt, not seen.

---

## 5. Components

### Navigation: The Floating Command
The Navbar must be a `rounded-xl` floating island.
*   **Background:** `surface_container_lowest` at 90% opacity + backdrop-blur.
*   **Padding:** `spacing-4` (vertical) / `spacing-8` (horizontal).
*   **Shadow:** Ambient shadow (see Elevation).

### Buttons: High-Contrast Action
*   **Hero Variant:** Uses the signature orange gradient. Text color: `on_primary` (#ffffff). Shadow: 4px glow using `primary` at 20% opacity.
*   **Hero-Outline:** Background is `secondary` (#ffffff). Border is `outline_variant` at 40% opacity. This variant is for secondary actions that still require a "premium" feel.
*   **Shape:** Always `rounded-xl` (12px) to maintain the warm professional aesthetic.

### Cards & Lists: The No-Divider Rule
*   **Cards:** Use `surface_container_low` for the card body. No borders. Use `spacing-6` internal padding.
*   **Lists:** Forbid the use of divider lines. Separate items using `spacing-2` vertical gaps or subtle background shifts on hover (`surface_container_high`).

### Input Fields: Soft Utility
*   **Style:** `surface_container_low` background with a `rounded-md` (8px) corner. 
*   **Active State:** Transition background to `surface_container_lowest` and add a 1px `primary` ghost-border (20% opacity).

---

## 6. Do’s and Don’ts

### Do
*   **Do** use asymmetrical layouts where content is weighted to one side, leaving generous `spacing-24` gutters.
*   **Do** use the `primary_container` (#f27121) for subtle accents like custom bullet points or text underlines.
*   **Do** stack `surface` tiers to create hierarchy (e.g., a white card on a light-grey section).

### Don't
*   **Don't** use 1px solid high-contrast borders to separate content.
*   **Don't** use pure black (#000000) for shadows; always use a tinted neutral.
*   **Don't** crowd the layout. If a section feels "busy," increase the vertical spacing to `spacing-16` or `spacing-20`.
*   **Don't** use the primary gradient for small icons; it is reserved for large-scale "Hero" interactive elements only.