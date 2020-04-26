
// 更多babel配置 => https://babel.docschina.org/docs/en/7.0.0/configuration
module.exports = api => {
  const plugins = [
    ["@babel/plugin-proposal-decorators", { legacy: true }]
  ]; // autobind-decorator对应babel插件（针对babel7）

  // 非开发环境配置
  if (api.env() !== 'development') {
    plugins.push(['transform-remove-console', {exclude: ['error']}]);
  }

  return {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: plugins
  };
};
