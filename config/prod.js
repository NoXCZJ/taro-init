module.exports = {
  env: {
    NODE_ENV: '"production"'
  },
  defineConstants: {
  },
  weapp: {},
  h5: {
    publicPath: './',
    webpackChain(chain, webpack) {
      if (process.env.NODE_ENV === 'production') {
        chain.plugin('miniCssExtractPlugin').tap(args => {
          args[0].filename = args[0].filename.replace('[name].css', '[name].[hash].css')
          args[0].chunkFilename = args[0].chunkFilename.replace('[id].css', '[id].[chunkhash].css')
          return args
        })
        chain.merge({
          output: {
            filename: '[name].[hash].js',
            chunkFilename: chain.output.get('chunkFilename').replace('[name].js', '[name].[chunkhash].js')
          }
        })
      }
    }
  },

}
