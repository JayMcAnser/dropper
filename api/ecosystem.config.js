module.exports = {
  apps: [
    {
      name: 'DropServer',
      exec_mode: 'cluster',
      instances: 'max', // Or a number of instances
      script: './index.js'
    }
  ]
}
