
# Store Management System

## Project Overview

A comprehensive store management system built with React, TypeScript, and modern web technologies. This system helps businesses manage their store operations, staff, and transactions efficiently.

**URL**: https://lovable.dev/projects/8c5e4c05-3d5d-4c89-9a8b-08f088b26bc2

## Installation Guide for Ubuntu

### Prerequisites

1. Install Node.js & npm using NVM:
```bash
# Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Reload shell configuration
source ~/.bashrc

# Install Node.js LTS version
nvm install --lts
nvm use --lts
```

2. Install PM2 globally:
```bash
npm install -g pm2
```

### Project Setup

1. Clone the repository:
```bash
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

### Running the Application

#### Development Mode
```bash
npm run dev
```

The development server will start on port 8081. Access the application at:
- Local: http://localhost:8081
- Network: http://your-ip:8081

#### Production Mode with PM2

1. Start the application:
```bash
pm2 start npm --name "store-management" -- start
```

2. Other useful PM2 commands:
```bash
# View logs
pm2 logs store-management

# Monitor processes
pm2 monit

# Restart application
pm2 restart store-management

# Stop application
pm2 stop store-management

# Delete application from PM2
pm2 delete store-management

# List all applications
pm2 list

# Save PM2 process list to startup
pm2 save

# Setup PM2 to start on system boot
pm2 startup
```

## Features

- Staff Management
- Transaction Tracking
- Holiday Management
- Store Settings Configuration
- User Authentication
- Dashboard Analytics
- Password Reset Functionality

## Technologies Used

- **Frontend Framework**: React with TypeScript
- **Build Tool**: Vite
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Process Management**: PM2
- **State Management**: Zustand
- **Data Fetching**: TanStack Query
- **Form Handling**: React Hook Form
- **Backend Services**: Supabase

## Development Tips

- Use `npm run dev` for local development with hot-reload
- The development server will be available at `http://localhost:8081`
- Check the console for any error messages or logs
- Use PM2 for production deployment and monitoring
- Always build the project before deploying

## Deployment

You can deploy this project in two ways:

1. **Using Lovable**:
   - Visit [Lovable](https://lovable.dev/projects/8c5e4c05-3d5d-4c89-9a8b-08f088b26bc2)
   - Click on Share -> Publish

2. **Custom Domain Setup**:
   - For custom domains, we recommend using Netlify
   - Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)

## Production PM2 Configuration

For a more detailed PM2 setup in production, create an ecosystem.config.js:

```javascript
module.exports = {
  apps: [{
    name: "store-management",
    script: "npm",
    args: "start",
    env: {
      NODE_ENV: "production",
    },
    instances: "max",
    exec_mode: "cluster",
    autorestart: true,
    watch: false,
    max_memory_restart: "1G",
    env_production: {
      NODE_ENV: "production"
    }
  }]
}
```

Then start PM2 with:
```bash
pm2 start ecosystem.config.js --env production
```

## Troubleshooting

Common issues and solutions:

1. If PM2 fails to start:
   - Check if the build was successful
   - Verify the correct Node.js version is being used
   - Check system logs: `pm2 logs`
   - Ensure the "start" script exists in package.json

2. If the application crashes:
   - Check PM2 logs: `pm2 logs store-management`
   - Verify all environment variables are set correctly
   - Ensure all dependencies are installed: `npm install`
   - Check the port availability (default: 8081)

3. For permission issues:
   - Run with sudo: `sudo pm2 start/stop/restart store-management`
   - Fix npm permissions: `sudo chown -R $USER:$USER ~/.npm`

4. For build errors:
   - Clear npm cache: `npm cache clean --force`
   - Delete node_modules and reinstall: 
     ```bash
     rm -rf node_modules
     npm install
     ```

## Support

For additional support or questions, please refer to:
- Project documentation
- Issue tracker
- Community forums

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
