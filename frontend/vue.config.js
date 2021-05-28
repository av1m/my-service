module.exports = {
  transpileDependencies: ["vuetify"],
  chainWebpack: (config) => {
    config.plugin("html").tap((args) => {
      args[0].title = "My Service";
      return args;
    });
  },
  publicPath: "/my-service/",
};
