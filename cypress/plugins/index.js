/// <reference types="cypress" />

const { startDevServer } = require('@cypress/webpack-dev-server');

const seedDatabase = require('./helpers/seedDatabase');

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
  on('task', {
    'db:seed'() {
      return seedDatabase();
    }
  });

  on('dev-server:start', (options) =>
    startDevServer({
      options: options,
      webpackConfig: require('../../webpack.config'),
    })
  );
  require('@cypress/code-coverage/task')(on, config);
  return config;
};
