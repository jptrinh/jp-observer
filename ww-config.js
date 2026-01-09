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
        rootMargin: {
            label: {
                en: 'Root margin',
                fr: 'Marge racine',
            },
            type: 'Text',
            options: {
                placeholder: '0px',
            },
            section: 'settings',
            bindable: true,
            defaultValue: '0px',
            /* wwEditor:start */
            bindingValidation: {
                type: 'string',
                tooltip: 'CSS margin string: "10px", "10px 20px", "10% 5%"',
            },
            propertyHelp: {
                tooltip: 'Margin around the root. Can be similar to CSS margin: "10px", "5px 10px 15px 20px"',
            },
            /* wwEditor:end */
        },
        observerMode: {
            label: {
                en: 'Observer mode',
                fr: 'Mode observateur',
            },
            type: 'TextSelect',
            options: {
                options: [
                    { value: 'once', label: { en: 'Once (trigger only first time)' } },
                    { value: 'repeat', label: { en: 'Repeat (trigger every time)' } },
                ],
            },
            section: 'settings',
            defaultValue: 'once',
            bindable: true,
            /* wwEditor:start */
            bindingValidation: {
                type: 'string',
                tooltip: 'Either "once" or "repeat"',
            },
            /* wwEditor:end */
        },
        threshold: {
            label: {
                en: 'Threshold',
                fr: 'Seuil',
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
                tooltip:
                    'Number between 0 and 1 representing percentage of visibility required: 0 = any pixel, 0.5 = 50%, 1 = 100%',
            },
            propertyHelp: {
                tooltip:
                    'Percentage of element that must be visible (0-1). 0 = trigger when any part is visible, 1 = trigger when fully visible.',
            },
            /* wwEditor:end */
        },
    },
};
