module.exports = {
  apps: [
    {
      name: 'myland_sse',
      script: 'dist/main.js',
      instances: '1',
      exec_mode: 'fork',
      log_file: 'logs/combined.log',
      out_file: 'logs/out.log',
      error_file: 'logs/error.log',
      log_date_format: 'YYYY-MM-DD',
      merge_logs: false,
      min_uptime: '10s',
      max_restarts: 10,
      max_memory_restart: '256M',
      watch: false,
      autorestart: true,
    },
  ],
}
