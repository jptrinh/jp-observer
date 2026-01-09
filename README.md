# jp-observer

An Intersection Observer component for [WeWeb.io](https://www.weweb.io/).

## Description

The jp-observer component uses the native IntersectionObserver API to detect when an element enters or leaves the viewport. It's perfect for lazy loading content, triggering scroll animations, tracking element visibility, and implementing infinite scroll functionality.

## Features

-   **Configurable Root Margin**: Set margins to trigger before/after viewport entry
-   **Threshold Control**: Specify what percentage of the element must be visible
-   **Two Observation Modes**:
    -   `once`: Trigger only on first intersection (ideal for lazy loading)
    -   `repeat`: Trigger every time element enters viewport (ideal for animations)
-   **State Management**: Provides `intersecting` state for conditional styling
-   **Events**: Emits `intersect` and `leave` events for custom workflows
-   **Performance Optimized**: Automatically disconnects observer in "once" mode
-   **Editor Safe**: Observer doesn't run in WeWeb editor mode

## Properties

| Property       | Type   | Default | Description                                             |
| -------------- | ------ | ------- | ------------------------------------------------------- |
| rootMargin     | String | "0px"   | CSS margin string (e.g., "100px", "10px 20px")          |
| threshold      | Number | 0       | Visibility percentage required (0-1)                    |
| observerMode   | String | "once"  | "once" (single trigger) or "repeat" (multiple triggers) |

## Events

-   **intersect**: Fired when element enters viewport
-   **leave**: Fired when element leaves viewport

## States

-   **intersecting**: Active when element is in viewport

## Use Cases

-   Lazy loading images and components
-   Triggering animations on scroll
-   Analytics tracking (element visibility)
-   Infinite scroll implementation
-   Progressive content loading
-   Video autoplay on viewport entry

## Development

### Installation

To run locally, first install all dependencies:

```bash
npm install
# or
yarn
```

### Start Development Server

To serve locally:

```bash
npm run serve --port=[PORT]
# or
yarn serve --port=[PORT]
```

Then go to the WeWeb editor, open the developer popup, and add your custom element.

### Build

Before release, check for build errors:

```bash
npm run build
# or
yarn build
```

## License

See LICENSE file for details.
