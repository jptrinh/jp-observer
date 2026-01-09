---
name: jp-observer
description: Intersection Observer component that triggers events when element enters/leaves viewport
keywords:
    - intersection observer
    - lazy loading
    - scroll detection
    - viewport
    - animation trigger
---

#### jp-observer

**_Description_**: Component that observes when it enters or leaves the viewport and triggers events accordingly

**_Specifications_**:

-   Uses native IntersectionObserver API
-   Triggers events when element intersects with viewport
-   Configurable root margin and threshold
-   Two modes: 'once' (single trigger) or 'repeat' (multiple triggers)
-   Provides 'intersecting' state for conditional styling

**_Properties_**:

-   **rootMargin**: CSS margin string (e.g., "0px", "10px 20px", "100px") - default: "0px"
    -   Positive values trigger the observer before the element enters the viewport
    -   Negative values trigger the observer after the element enters the viewport
-   **threshold**: Number 0-1 representing visibility percentage - default: 0
    -   0 = trigger when any pixel is visible
    -   0.5 = trigger when 50% is visible
    -   1 = trigger when 100% is visible
-   **observerMode**: "once" | "repeat" - default: "once"
    -   "once" = trigger only on first intersection and disconnect observer
    -   "repeat" = trigger every time element enters viewport

**_Slots_**:

-   **default**: Content to be observed

**_Events_**:

-   **intersect**: Fired when element enters viewport
    -   Payload includes: `isIntersecting`, `intersectionRatio`, `boundingClientRect`, `time`
-   **leave**: Fired when element leaves viewport
    -   Payload includes: `isIntersecting`

**_States_**:

-   **intersecting**: Active when element is in viewport
    -   Can be used for conditional styling or other reactive behaviors

**_Variables_**: none

**_Use Cases_**:

-   Lazy loading images/components
-   Triggering animations on scroll
-   Analytics tracking (element visibility)
-   Infinite scroll implementation
-   Progressive content loading
-   Fade-in effects when scrolling into view
-   Video autoplay on viewport entry

**_Example Usage_**:

```html
<!-- Lazy load content once when it enters viewport -->
<jp-observer :rootMargin="'100px'" :observerMode="'once'">
    <img src="placeholder.jpg" data-src="actual-image.jpg" />
</jp-observer>

<!-- Trigger animation every time element enters viewport -->
<jp-observer :observerMode="'repeat'" :threshold="0.5">
    <div class="animated-content">Content here</div>
</jp-observer>
```

**_Notes_**:

-   The observer does not run in WeWeb editor mode to prevent interference with editing
-   SSR compatible - checks for IntersectionObserver availability before initialization
-   Observer is automatically cleaned up when component is unmounted to prevent memory leaks
-   Property changes (rootMargin, threshold, observerMode) will reinitialize the observer
