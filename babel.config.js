// babel.config.js
module.exports = {
    presets: [
      [
        'next/babel',
        {
          'preset-react': {
            runtime: 'automatic', // React の自動インポートを有効にする
          },
        },
      ],
      '@babel/preset-typescript', // TypeScript を使用している場合
    ],
  };
  