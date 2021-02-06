module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  publicPath: "/",
  chainWebpack: config => {
    // config.plugins.delete('pwa');
    config.plugins.delete('workbox');
  }
}