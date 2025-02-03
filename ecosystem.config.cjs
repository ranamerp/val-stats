module.exports = {
  apps : [{
    name: "val-stats",
    script: "./build/index.js",
    cwd: "./",
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '500M',
    env: {
      NODE_ENV: "development" // Default environment
    },
    env_production: { // Production environment-specific settings
      NODE_ENV: "production"
    }
  }],
  deploy: {
    production: {
      user: 'tee', // Your server's username
      host: '5.161.72.105', // Your server's IP or domain
      ref: 'origin/main', // Git branch to deploy
      repo: 'https://github.com/ranamerp/val-stats.git', // URL of your Git repository
      path: '/home/tee/stats/val-stats', // Absolute path to your app on the server
      'post-deploy': 'bun install && bun run build && pm2 reload ecosystem.config.cjs --env production' // Commands to run after deployment
    }
  }
};