module.exports = {
    productionSourceMap: false,
    runtimeCompiler: true,
    devServer: {
        proxy: 'http://localhost:9000'
    },
    pages: {
        index: "src/main.js"
    },
    outputDir: "../../build/static"
};
