const path = require('path');
// Correção para versão 4.0+: Usa desestruturação { }
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); 

module.exports = {
  mode: 'production',
  entry: {
    // Garante que o nome do arquivo de saída será 'outsera.test.js'
    outsera: path.resolve(__dirname, './src/simulations/loadPerformanceOutsera.test.js'),
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'commonjs',
    filename: '[name].test.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            // Configuração do Babel direto aqui (não precisa de .babelrc)
            presets: [
              [
                '@babel/preset-env',
                {
                  targets: { node: 'current' }, // Otimizado para K6/Node
                  modules: false, // Deixa o Webpack cuidar dos imports
                },
              ],
            ],
          },
        },
      },
    ],
  },
  target: 'web',
  externals: /k6(\/.*)?/, // Ignora imports do k6 (eles já existem no runtime)
  plugins: [
    new CleanWebpackPlugin(), // Limpa a pasta dist antes de gerar novo
  ],
  stats: {
    colors: true,
  },
};