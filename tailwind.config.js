module.exports = {
    important: true,
    theme: {
        inset: {
            '-4': '-3rem',
        },
        extend: {
            minHeight: {
                '8': '8em',
                '9': '9em',
                '10': '10em',
            },
            colors: {
                brand: {
                    50: '#eef5f3',
                    100: '#d4e6e1',
                    200: '#b7d5ce',
                    300: '#9ac4ba',
                    400: '#85b7ab',
                    500: '#6faa9c',
                    600: '#67a394',
                    700: '#5c998a',
                    800: '#529080',
                    900: '#407f6e',
                },
            },
        },
    },
    variants: {
        margin: ['responsive', 'first', 'hover', 'focus'],
    },
    plugins: [],
}
