module.exports = {
    plugins: [
        require('autoprefixer'),
        require('postcss-px-to-viewport')({
            unitToConvert: 'px',
            viewportWidth: 320,
            unitPrecision: 5,
            propList: ['*'],
            viewportUnit: 'vw',
            fontViewportUnit: 'vw',
        }),
    ]
}