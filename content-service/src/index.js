'use strict'

const ON_DEATH = require('death')
const ipfsHttpClient = require('ipfs-http-client')
const AudiusLibs = require('@audius/libs')

const initializeApp = require('./app')
const ContentReplicator = require('./contentReplicator')
const config = require('./config')
const { sequelize } = require('./models')
const { runMigrations } = require('./migrationManager')
const { logger } = require('./logging')

// connect to IPFS
let ipfsAddr = config.get('ipfsHost')
if (!ipfsAddr) {
  logger.error('Must set ipfsAddr')
  process.exit(1)
}

let ipfs = ipfsHttpClient(ipfsAddr, config.get('ipfsPort'))
ipfs.id(function (err, identity) {
  if (err) {
    throw err
  }
  logger.info(`Current IPFS Peer ID: ${JSON.stringify(identity)}`)
})

// run all migrations
logger.info('Executing database migrations...')
runMigrations().then(async () => {
  logger.info('Migrations completed successfully')
}).error((err) => {
  logger.error('Error in migrations: ', err)
  process.exit(1)
})

const audiusLibs = new AudiusLibs(
  {
    web3Config: AudiusLibs.configInternalWeb3(
      config.get('registryAddress'), config.get('web3ProviderUrl')
    ),
    discoveryProviderConfig: AudiusLibs.configDiscoveryProvider(true),
    identityServiceConfig: AudiusLibs.configIdentityService('dummy')
  }
)
setImmediate(async () => {
  await audiusLibs.init()
})

const appInfo = initializeApp(config.get('port'), ipfs)

const contentReplicator = new ContentReplicator(ipfs, audiusLibs)
contentReplicator.initBootstrapPeers()
contentReplicator.refreshPeers()
contentReplicator.start()

// when app terminates, close down any open DB connections gracefully
ON_DEATH((signal, error) => {
  // NOTE: log messages emitted here may be swallowed up if using the bunyan CLI (used by
  // default in `npm start` command). To see messages emitted after a kill signal, do not
  // use the bunyan CLI.
  logger.info('Shutting down db and express app...')
  sequelize.close()
  appInfo.server.close()
  contentReplicator.stop()
})