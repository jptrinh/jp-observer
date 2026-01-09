<template>
    <div ref="observerRoot" class="ww-observer" :class="{ '-intersecting': isIntersecting }">
        <slot></slot>
    </div>
</template>

<script>
export default {
    props: {
        content: { type: Object, required: true },
        wwElementState: { type: Object, required: true },
        /* wwEditor:start */
        wwEditorState: { type: Object, required: false, default: null },
        /* wwEditor:end */
    },
    emits: ['trigger-event', 'add-state', 'remove-state'],
    data() {
        return {
            observer: null,
            isIntersecting: false,
            hasTriggered: false,
        };
    },
    computed: {
        isEditing() {
            /* wwEditor:start */
            // Safely handle cases where the editor runtime or state isn't present
            if (!this.wwEditorState || typeof wwLib === 'undefined' || !wwLib.wwEditorHelper) {
                return false;
            }
            return this.wwEditorState.editMode === wwLib.wwEditorHelper.EDIT_MODES.EDITION;
            /* wwEditor:end */
            return false;
        },
        rootMargin() {
            return this.content.rootMargin || '0px';
        },
        threshold() {
            return this.content.threshold !== undefined ? this.content.threshold : 0;
        },
        observerMode() {
            return this.content.observerMode || 'once';
        },
    },
    watch: {
        rootMargin() {
            if (!this.isEditing) {
                this.initObserver();
            }
        },
        threshold() {
            if (!this.isEditing) {
                this.initObserver();
            }
        },
        observerMode(newMode) {
            // Reset hasTriggered when switching to repeat mode
            if (newMode === 'repeat') {
                this.hasTriggered = false;
            }
            if (!this.isEditing) {
                this.initObserver();
            }
        },
    },
    mounted() {
    if (this.isEditing) return;

    // Wait for slot content to be fully rendered
    this.$nextTick(() => {
        // Check if slot has content
        const hasSlotContent = this.$refs.observerRoot &&
                               this.$refs.observerRoot.children.length > 0;

        if (!hasSlotContent) {
            console.warn('[jp-observer] No slot content yet, waiting...');
            // Use MutationObserver to watch for slot content
            this.waitForSlotContent();
        } else {
            this.initObserver();
        }
    });
},
    beforeUnmount() {
        this.cleanupObserver();
    },
    methods: {
        waitForSlotContent() {
        const checkContent = () => {
            if (this.$refs.observerRoot && this.$refs.observerRoot.children.length > 0) {
                console.log('[jp-observer] Slot content ready, initializing');
                this.initObserver();
            } else {
                // Keep checking
                requestAnimationFrame(checkContent);
            }
        };

        requestAnimationFrame(checkContent);
    }
        initObserver() {
            // Check if IntersectionObserver is available (SSR compatibility)
            if (typeof window === 'undefined' || !window.IntersectionObserver) {
                console.warn('IntersectionObserver not available');
                return;
            }

            // Clean up any existing observer
            this.cleanupObserver();

            // Create intersection observer
            const options = {
                root: null, // viewport
                rootMargin: this.rootMargin,
                threshold: this.threshold,
            };

            this.observer = new IntersectionObserver(this.handleIntersection, options);

            // Observe the root element
            if (this.$refs.observerRoot) {
                this.observer.observe(this.$refs.observerRoot);
            } else {
                console.warn('[jp-observer] observerRoot ref not found');
            }
        },

        handleIntersection(entries) {
            entries.forEach(entry => {
                const wasIntersecting = this.isIntersecting;
                this.isIntersecting = entry.isIntersecting;

                // Update state
                if (entry.isIntersecting) {
                    this.$emit('add-state', 'intersecting');
                } else {
                    this.$emit('remove-state', 'intersecting');
                }

                // Handle intersect event
                if (entry.isIntersecting) {
                    // Check if we should trigger based on mode
                    if (this.observerMode === 'once' && this.hasTriggered) {
                        return; // Already triggered once, skip
                    }

                    this.hasTriggered = true;

                    this.$emit('trigger-event', {
                        name: 'intersect',
                        event: {
                            isIntersecting: true,
                            intersectionRatio: entry.intersectionRatio,
                            boundingClientRect: entry.boundingClientRect,
                            time: entry.time,
                        },
                    });

                    // If mode is 'once', disconnect after first trigger
                    if (this.observerMode === 'once') {
                        this.cleanupObserver();
                    }
                } else if (wasIntersecting && !entry.isIntersecting) {
                    // Element left viewport - emit leave event
                    this.$emit('trigger-event', {
                        name: 'leave',
                        event: {
                            isIntersecting: false,
                        },
                    });
                }
            });
        },

        cleanupObserver() {
            if (this.observer) {
                this.observer.disconnect();
                this.observer = null;
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.ww-observer {
    // Minimal base styling
    // Users can add custom styles via WeWeb editor

    &.-intersecting {
        // State class for custom styling
        // No default styles - let users define via editor
    }
}
</style>
