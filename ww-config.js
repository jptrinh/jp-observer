export default {
    options: {
        lazyHydrate: true,
    },
    states: ['intersecting'],
    triggerEvents: [
        {
            name: 'intersect',
            label: { en: 'On intersect' },
            event: {
                isIntersecting: true,
                intersectionRatio: 0,
                boundingClientRect: {},
                time: 0,
            },
            default: true,
        },
        {
            name: 'leave',
            label: { en: 'On leave viewport' },
            event: {
                isIntersecting: false,
            },
        },
    ],
    editor: {
        label: {
            en: 'Intersection Observer',
        },
        icon: 'eye',
        bubble: {
            icon: 'eye',
        },
    },
    properties: {
        children: {
            hidden: true,
            defaultValue: [],
        },
        rootMargin: {
            label: {
                en: 'Root margin',
            },
            type: 'Number',
            options: {
                min: -1000,
                max: 0,
                step: 10,
            },
            section: 'settings',
            bindable: true,
            defaultValue: 0,
            /* wwEditor:start */
            bindingValidation: {
                type: 'number',
                tooltip: 'Margin in pixels. Use negative values to delay trigger.',
            },
            propertyHelp: {
                tooltip: 'Offset in pixels. 0 = trigger at viewport edge. Negative values (e.g., -100) = trigger after element is 100px inside viewport.',
            },
            /* wwEditor:end */
        },
        threshold: {
            label: {
                en: 'Threshold',
            },
            type: 'Number',
            options: {
                min: 0,
                max: 1,
                step: 0.1,
            },
            section: 'settings',
            defaultValue: 0,
            bindable: true,
            /* wwEditor:start */
            bindingValidation: {
                type: 'number',
                tooltip: 'Number between 0 and 1 representing visibility percentage: 0 = any pixel, 0.5 = 50%, 1 = 100%',
            },
            propertyHelp: {
                tooltip: 'Percentage of element that must be visible (0-1). 0 = trigger when any part is visible, 1 = trigger when fully visible.',
            },
            /* wwEditor:end */
        },
        observerMode: {
            label: {
                en: 'Observer mode',
            },
            type: 'TextSelect',
            options: {
                options: [
                    { value: 'once', label: { en: 'Once (trigger only first time)' } },
                    { value: 'repeat', label: { en: 'Repeat (trigger every time)' } },
                ],
            },
            section: 'settings',
            defaultValue: 'repeat',
            bindable: true,
            /* wwEditor:start */
            bindingValidation: {
                type: 'string',
                tooltip: 'Either "once" or "repeat"',
            },
            propertyHelp: {
                tooltip: 'Once: triggers only on first intersection. Repeat: triggers every time element enters/leaves viewport.',
            },
            /* wwEditor:end */
        },
    },
};
