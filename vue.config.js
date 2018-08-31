const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
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
  }
}