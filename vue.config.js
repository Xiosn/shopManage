module.exports = {
    // 关闭eslint规范
    lintOnSave: false,
      configureWebpack: {
        resolve:{
          extensions:[],
          alias:{
            'assets':'@/assets',
            'common':'@/common',
            'components':'@/components',
            'network':'@/network',
            'views':'@/views',
          }
        }
      }
    }