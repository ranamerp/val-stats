module.exports = {
    apps : [{
      name: "valstats", // Replace with your application's name
      script: "./build/index.js", // Path to your application's entry point
      cwd: "./", // Current working directory (usually the application root)
      instances: 1, // Number of instances to run (adjust as needed)
      autorestart: true, // Automatically restart on crashes
      watch: false, // Disable file watching (handled by deployment)
      max_memory_restart: '500M', // Optional: Restart if memory usage exceeds 500MB
      env: { // Environment variables
        NODE_ENV: "production"
        // ... other environment variables
      },
      log_date_format: "YYYY-MM-DD HH:mm Z", // Optional: Customize log format
      error_file: "err.log", // Optional: Error log file
      out_file: "out.log"  // Optional: Output log file
    }]
  };