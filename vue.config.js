const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
var GitRevisionPlugin = new (require('git-revision-webpack-plugin'))({
  versionCommand: 'describe --always --tags'
});
const webpack = require('webpack');

module.exports = {
  chainWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      config
        .plugin('fork-ts-checker')
        .tap(args => {
          args[0].memoryLimit = 4096;
          args[0].workers = ForkTsCheckerWebpackPlugin.TWO_CPUS_FREE;
          return args;
        })
    } else {
      config
      .plugin('fork-ts-checker')
      .tap(args => {
        args[0].workers = ForkTsCheckerWebpackPlugin.TWO_CPUS_FREE;
        return args;
      })
    }
    config.plugin('define').tap(definitions => {
      definitions[0] = Object.assign(definitions[0], {
        'process.env': {
          VERSION: JSON.stringify(GitRevisionPlugin.version()),
          COMMITHASH: JSON.stringify(GitRevisionPlugin.commithash())
        }
      })
      return definitions;
    })
  }
}
