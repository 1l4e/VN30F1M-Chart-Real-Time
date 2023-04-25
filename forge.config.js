module.exports = {
    publishers: [
      {
        name: '@electron-forge/publisher-github',
        config: {
          repository: {
            owner: '1l4e',
            name: 'electron-vite-chart',
          },
          prerelease: false,
          draft: true,
        },
      },
    ],
  }