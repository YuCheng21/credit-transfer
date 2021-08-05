const purgecss = require('@fullhuman/postcss-purgecss')
const glob = require('glob-all')
const path = require('path');
module.exports = {
    plugins: [
        require('autoprefixer'),
        // purgecss({
        //     content: glob.sync(
        //         [
        //             path.resolve(__dirname, 'src') + '/**/*.{html,js}',
        //             path.resolve(__dirname, 'node_modules') + '/bootstrap/dist/js/bootstrap.bundle.js',
        //             path.resolve(__dirname, 'node_modules') + '/@fortawesome/fontawesome-free/js/all.js',
        //             path.resolve(__dirname, 'node_modules') + '/jquery/dist/jquery.js',
        //         ],
        //         {
        //             nodir: true,
        //         }
        //     )
        // }),
        // (process.env.NODE_ENV === 'production') ? require('cssnano') : null,
    ],
    sourceMap: true,
};