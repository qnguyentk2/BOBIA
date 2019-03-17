module.exports = {
  apps: [
    {
      name: 'bobia-server',
      script: 'npm',
      args: 'run prod',
      env: {
        COMMON_VARIABLE: 'true'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ],

  deploy: {
    production: {
      user: 'admin',
      host: 'bbtest.company',
      ref: 'origin/master',
      repo: 'git@gitlab.com:BOBIA/bobia-server.git',
      path: '/var/www/bobia-server',
      'post-deploy':
        'npm install && pm2 reload ecosystem.config.js --env production'
    },
    dev: {
      user: 'root',
      host: 'bbtest.company',
      ref: 'origin/dev',
      repo: 'git@gitlab.com:BOBIA/bobia-server.git',
      path: '/var/www/bobia-server',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env dev',
      env: {
        NODE_ENV: 'dev',
        SERVER_PORT: 3001,
        HOST_NAME: 'bbtest.company',
        DNS: 'bbtest.company',
        UPLOAD_PATH: 'https://server.bbtest.company',
        MONGO_URI:
          'mongodb://visata-admin:visata-password@bbtest.company:27017/bobia',
        CORS_WHITELIST: [
          'https://admin.bbtest.company',
          'https://server.bbtest.company',
          'http://bbtest.company',
          'https://bbtest.company',
          'http://localhost:7000',
          'http://localhost:7002'
        ]
      }
    }
  }
};
