//const withCSS = require("@zeit/next-css");

module.exports = {
    webpack: function (config) {
        config.module.rules.push({
            test: /\.md$/,
            use: "raw-loader",
        });
        return config;
    },
    env: {
        urlApi: "http://localhost:3001",
    },
};
