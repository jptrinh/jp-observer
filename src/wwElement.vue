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
        wwEditorState: { type: Object, required: true },
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
            return this.wwEditorState.editMode === wwLib.wwEditorHelper.EDIT_MODES.EDITION;
            /* wwEditor:end */
            // eslint-disable-next-line no-unreachable
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
        // Don't observe in editor mode
        if (this.isEditing) return;

        // Use nextTick to ensure DOM is fully rendered
        this.$nextTick(() => {
            this.initObserver();
        });
    },
    beforeUnmount() {
        this.cleanupObserver();
    },
    methods: {
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

            console.log('[jp-observer] Initializing observer with options:', options);

            this.observer = new IntersectionObserver(this.handleIntersection, options);

            // Observe the root element
            if (this.$refs.observerRoot) {
                this.observer.observe(this.$refs.observerRoot);
                console.log('[jp-observer] Observing element:', this.$refs.observerRoot);
            } else {
                console.warn('[jp-observer] observerRoot ref not found');
            }
        },

        handleIntersection(entries) {
            console.log('[jp-observer] handleIntersection called with', entries.length, 'entries');

            entries.forEach((entry) => {
                console.log('[jp-observer] Entry:', {
                    isIntersecting: entry.isIntersecting,
                    intersectionRatio: entry.intersectionRatio,
                    target: entry.target,
                });

                const wasIntersecting = this.isIntersecting;
                this.isIntersecting = entry.isIntersecting;

                // Update state
                if (entry.isIntersecting) {
                    console.log('[jp-observer] Emitting add-state: intersecting');
                    this.$emit('add-state', 'intersecting');
                } else {
                    console.log('[jp-observer] Emitting remove-state: intersecting');
                    this.$emit('remove-state', 'intersecting');
                }

                // Handle intersect event
                if (entry.isIntersecting) {
                    // Check if we should trigger based on mode
                    if (this.observerMode === 'once' && this.hasTriggered) {
                        console.log('[jp-observer] Already triggered in once mode, skipping');
                        return; // Already triggered once, skip
                    }

                    this.hasTriggered = true;

                    console.log('[jp-observer] Emitting trigger-event: intersect');
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
                        console.log('[jp-observer] Once mode: disconnecting observer');
                        this.cleanupObserver();
                    }
                } else if (wasIntersecting && !entry.isIntersecting) {
                    // Element left viewport - emit leave event
                    console.log('[jp-observer] Emitting trigger-event: leave');
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
