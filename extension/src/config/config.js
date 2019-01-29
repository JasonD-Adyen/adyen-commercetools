const _ = require('lodash')

const configPath = process.env.CONFIG_PATH

function getEnvConfig () {
  return {
    port: process.env.PORT,
    logLevel: process.env.LOG_LEVEL,
    apiExtensionBaseUrl: process.env.API_EXTENSION_BASE_URL
  }
}

function getCTPEnvCredentials () {
  return {
    projectKey: process.env.CTP_PROJECT_KEY,
    clientId: process.env.CTP_CLIENT_ID,
    clientSecret: process.env.CTP_CLIENT_SECRET,
    apiUrl: process.env.CTP_API_URL,
    authUrl: process.env.CTP_AUTH_URL
  }
}

function getFileConfig () {
  let fileConfig = {}
  try {
    fileConfig = require(configPath) // eslint-disable-line
  } catch (e) {
    // config file was not provided
  }

  return fileConfig
}

module.exports.load = () => {
  /**
   * Load configuration from several sources in this order (last has highest priority):
   * - default config
   * - file config
   * - ctp credentials from env variables
   * - ctp config
   * - env config
   */

  const config = _.merge(
    getEnvConfig(),
    { ctp: getCTPEnvCredentials() },
    getFileConfig()
  )

  // raise an exception when there are no CTP credentials
  if (!config.ctp.projectKey || !config.ctp.clientId || !config.ctp.clientSecret)
    throw new Error('CTP project credentials are missing')

  return config
}
