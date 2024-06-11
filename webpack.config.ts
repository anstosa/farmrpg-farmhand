/* eslint-disable unicorn/prefer-module */
import { HeadersProps, UserscriptPlugin } from "webpack-userscript";
import { Configuration as WebpackDevelopmentServerConfiguration } from "webpack-dev-server";
import CircularDependencyPlugin from "circular-dependency-plugin";
import ESLintPlugin from "eslint-webpack-plugin";
import ForkTSCheckerPlugin from "fork-ts-checker-webpack-plugin";
import path from "node:path";
import webpack from "webpack";

interface Configuration extends webpack.Configuration {
  devServer?: WebpackDevelopmentServerConfiguration;
}

type NodeEnvironment = "development" | "production" | undefined;

const mode: webpack.Configuration["mode"] =
  (process.env.NODE_ENV as NodeEnvironment) || "production";
const isProduction = mode === "production";
const isDevelopment = process.env.NODE_ENV === "development";

const PORT = 3000;

console.log(`BUILDING IN ${mode} MODE`);

const cssLoaders: webpack.RuleSetRule["use"] = [];
const scssLoaders: webpack.RuleSetRule["use"] = [];

// inject with JS with in dev mode
if (isDevelopment) {
  cssLoaders.push("style-loader");
  scssLoaders.push("style-loader");
}

cssLoaders.push("css-loader");
scssLoaders.push("css-loader");

// use post-css to process tailwind, autoprefixer
const postCSSLoader = {
  loader: "postcss-loader",
  options: {
    sourceMap: true,
    postcssOptions: {
      config: "./postcss.config.js",
    },
  },
};
scssLoaders.push(postCSSLoader);

// rewrite URLs for production
const resolveLoader = {
  loader: "resolve-url-loader",
  options: {
    sourceMap: true,
  },
};
scssLoaders.push(resolveLoader);

// compile SASS with sass-loader
const sassLoader = {
  loader: "sass-loader",
  options: {
    sourceMap: true,
  },
};
scssLoaders.push(sassLoader);

const config: Configuration = {
  mode,

  // don't allow any errors in production
  bail: isProduction,

  // use filesystem cache for speed in development
  cache: isDevelopment ? { type: "filesystem" } : false,

  // build fast source maps in dev
  devtool: isDevelopment ? "eval-cheap-module-source-map" : "source-map",

  devServer: {
    port: PORT,
  },
  watchOptions: {
    ignored: ["**/node_modules", "**/dist"],
  },
  entry: path.resolve(__dirname, "src", "index.ts"),
  output: {
    path: path.resolve(__dirname, "dist/"),
    filename: "farmrpg-farmhand.user.js",
  },
  optimization: isProduction
    ? {
        minimize: true,
        splitChunks: {
          chunks: "all",
          name: false,
        },
        removeAvailableModules: true,
        removeEmptyChunks: false,
      }
    : {
        minimize: false,
        splitChunks: false,
        removeAvailableModules: false,
        removeEmptyChunks: false,
      },
  resolve: {
    extensions: [".js", ".ts", ".css", ".scss"],
    symlinks: false,
    // allow src-relative imports
    alias: {
      "~": path.resolve(__dirname, "src"),
    },
    modules: ["/node_modules", "node_modules"],
  },
  module: {
    rules: [
      {
        // use the first matching rule and don't evaluate the rest
        oneOf: [
          {
            test: /\.svg$/,
            issuer: /\.ts$/,
            exclude: /node_modules/,
            use: ["@svgr/webpack", "url-loader"],
          },

          // load images by URL
          {
            test: /\.(gif|jpg|jpeg|png)$/,
            type: "asset",
          },

          // compile Typescript with ts-loader
          {
            test: /\.ts$/,
            loader: "ts-loader",
            options: {
              // type checking forked in plugins
              transpileOnly: true,
            },
          },

          // run CSS through pipeline
          {
            test: /\.css$/,
            use: cssLoaders,
          },
          {
            test: /\.scss$/,
            use: scssLoaders,
          },

          // use file-loader for everything else
          {
            loader: require.resolve("file-loader"),
            exclude: /\.(js|mjs|ts|html|json)$/,
            options: {
              name: "static/media/[contenthash].[ext]",
            },
          },
        ],
      },
    ],
  },
  plugins: (() => {
    const plugins: webpack.Configuration["plugins"] = [
      // don't allow circular dependencies
      new CircularDependencyPlugin({
        failOnError: true,
        exclude: /node_modules/,
      }),

      // lint source with eslint config
      new ESLintPlugin({
        extensions: ["js", "ts", "json"],
      }),

      // performant type checking
      new ForkTSCheckerPlugin({}),

      new UserscriptPlugin({
        headers(original) {
          const overrides: HeadersProps = {
            name: "Farm RPG Farmhand",
            icon: "https://www.google.com/s2/favicons?sz=64&domain=farmrpg.com",
            match: "https://farmrpg.com/*",
            grant: ["GM.getValue", "GM.setValue"],
            // from package.json
            //   description
            //   version
            //   author
            //   homepage
            //   bugs
          };
          const version = isDevelopment
            ? {
                version: `${original.version}-[buildTime]`,
              }
            : {};
          return {
            ...original,
            ...overrides,
            ...version,
          };
        },
        proxyScript: {
          baseURL: `http://localhost:${PORT}`,
          filename: `[basename].proxy.user.js`,
        },
      }),
    ];

    return plugins;
  })(),
};

export default config;
