const glob = require('glob');

module.exports = {
    plugins: [
        require('autoprefixer'),
        // Purge unused CSS from .js and .jsx files
        require('@fullhuman/postcss-purgecss')({
            content: glob.sync('src/**/*.{js,jsx}', { nodir: true }),
            extractors: [
              {
                extractor: class {
                  static extract(content) {
                    return content.match(/\w+/g) || [];
                  }
                },
                extensions: ['js', 'jsx' ]
              }
            ]
        }),
        require('cssnano')
    ]
}