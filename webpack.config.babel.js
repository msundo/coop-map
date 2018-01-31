import path from "path"
import Webpack from "webpack"
import Notifier from "webpack-notifier"
import ExtractTextPlugin from "extract-text-webpack-plugin"
import HtmlPlugin from "html-webpack-plugin"
import Dashboard from "webpack-dashboard/plugin"

const production = process.env.NODE_ENV === "production"
const output = path.resolve(__dirname, "dist")

/** 📃 .hbs pages filenames without extensions */
const pages = ["index"]

export default {
    entry: "./src/scripts/index.js",
    output: {
        path: output,
        filename: "bundle.js"
    },
    devtool: production ? false : "eval-source-map",
    plugins: [
        ...pages.map(page => new HtmlPlugin({ filename: `${page}.html`, template: `src/${page}.hbs` })),
        new Webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
            "process.env.VERSION": JSON.stringify(process.env.npm_package_version),
        }),
        new ExtractTextPlugin({ filename: "main.css" })
    ].concat(production
        ? [ // 🚢  production plugins

        ]
        : [ // 🏗️  development plugins
            new Webpack.HotModuleReplacementPlugin(),
            new Dashboard(),
            new Notifier()
        ]),
    module: {
        rules: [
            {
                test: /\.scss$/,
                enforce: "pre",
                loader: "import-glob-loader"
            },
            {
                test: /\.css$/,
                loader: "postcss-loader"
            },
            {
                test: /\.(scss|css)$/,
                use: ExtractTextPlugin.extract({
                    use: [{
                        loader: "css-loader",
                        options: { sourceMap: true }
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        loader: "sass-loader",
                        options: { sourceMap: true }
                    }]
                })
            },
            {
                test: /\.js$/,
                loader: "babel-loader",
                exclude: path.resolve(__dirname, "node_modules")
            },
            {
                test: /\.(jpg|jpeg|png|svg)$/i,
                use: [{
                    loader: "file-loader",
                    options: {
                        name: "[name].[ext]",
                        outputPath: "/images/"
                    }
                }]
            },
            {
                test: /\.hbs$/,
                loader: "handlebars-loader",
                query: {
                    inlineRequires: "/"
                }
            }
        ]
    }
}
