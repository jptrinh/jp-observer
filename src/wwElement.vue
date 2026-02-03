<template>
    <div ref="observerRoot" class="ww-observer" :class="{ '-intersecting': intersectingValue }">
        <wwLayout path="children" direction="column" class="observer-content" />
    </div>
</template>

<script>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';

export default {
    props: {
        uid: { type: String, required: true },
        content: { type: Object, required: true },
        wwElementState: { type: Object, required: true },
    },
    emits: ['trigger-event', 'add-state', 'remove-state'],
    setup(props, { emit }) {
        const observerRoot = ref(null);
        let observer = null;
        const hasTriggered = ref(false);

        const { value: intersectingValue, setValue: setIntersecting } = wwLib.wwVariable.useComponentVariable({
            uid: props.uid,
            name: 'intersecting',
            type: 'boolean',
            defaultValue: false,
        });

        const rootMargin = computed(() => `${props.content?.rootMargin ?? 0}px`);
        const threshold = computed(() => props.content?.threshold ?? 0);
        const observerMode = computed(() => props.content?.observerMode || 'repeat');

        const cleanupObserver = () => {
            if (observer) {
                observer.disconnect();
                observer = null;
            }
        };

        const handleIntersection = entries => {
            entries.forEach(entry => {
                const wasIntersecting = intersectingValue.value;
                const nowIntersecting = entry.isIntersecting;

                setIntersecting(nowIntersecting);

                if (nowIntersecting) {
                    emit('add-state', 'intersecting');
                } else {
                    emit('remove-state', 'intersecting');
                }

                if (nowIntersecting) {
                    if (observerMode.value === 'once' && hasTriggered.value) {
                        return;
                    }

                    hasTriggered.value = true;

                    emit('trigger-event', {
                        name: 'intersect',
                        event: {
                            isIntersecting: true,
                            intersectionRatio: entry.intersectionRatio,
                            boundingClientRect: {
                                top: entry.boundingClientRect.top,
                                right: entry.boundingClientRect.right,
                                bottom: entry.boundingClientRect.bottom,
                                left: entry.boundingClientRect.left,
                                width: entry.boundingClientRect.width,
                                height: entry.boundingClientRect.height,
                            },
                            time: entry.time,
                        },
                    });

                    if (observerMode.value === 'once') {
                        cleanupObserver();
                    }
                } else if (wasIntersecting && !nowIntersecting) {
                    emit('trigger-event', {
                        name: 'leave',
                        event: {
                            isIntersecting: false,
                        },
                    });
                }
            });
        };

        const initObserver = () => {
            const frontWindow = wwLib.getFrontWindow();

            if (!frontWindow?.IntersectionObserver) {
                return;
            }

            cleanupObserver();

            const options = {
                root: null,
                rootMargin: rootMargin.value,
                threshold: threshold.value,
            };

            observer = new frontWindow.IntersectionObserver(handleIntersection, options);

            if (observerRoot.value) {
                observer.observe(observerRoot.value);
            }
        };

        const initWithDelay = () => {
            setTimeout(() => {
                if (observerRoot.value) {
                    initObserver();
                }
            }, 100);
        };

        watch(
            () => [props.content?.rootMargin, props.content?.threshold],
            () => {
                initObserver();
            },
            { deep: true }
        );

        watch(
            () => props.content?.observerMode,
            newMode => {
                if (newMode === 'repeat') {
                    hasTriggered.value = false;
                }
                initObserver();
            }
        );

        onMounted(() => {
            nextTick(() => {
                initWithDelay();
            });
        });

        onBeforeUnmount(() => {
            cleanupObserver();
        });

        return {
            observerRoot,
            intersectingValue,
        };
    },
};
</script>

<style lang="scss" scoped>
.ww-observer {
    width: 100%;
    height: auto;
    min-height: 1px;
}

.observer-content {
    width: 100%;
    height: 100%;
}
</style>
