
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
pm2 start npm --name "store-management" -- run preview
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

## Setup in Ubuntu Container

### 1. Create and Start Ubuntu Container

Using Docker:

```bash
# Pull Ubuntu image
docker pull ubuntu:latest

# Create and start the container
docker run -it --name store-management -p 8081:8081 ubuntu:latest
```

### 2. Container Setup

Once inside the container, install required tools:

```bash
# Update package lists
apt-get update

# Install essentials
apt-get install -y curl git build-essential

# Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Install Node.js
nvm install --lts
nvm use --lts

# Install PM2 globally
npm install -g pm2
```

### 3. Application Setup

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Build the application
npm run build
```

### 4. Running with PM2 in Container

```bash
# Start the application
pm2 start npm --name "store-management" -- run preview

# Save PM2 process list
pm2 save

# Keep container running with application
pm2 startup
```

### 5. Accessing the Application

The application will be available at:
- http://localhost:8081 (if you've mapped port 8081 in your container)

### 6. Docker Compose (Alternative)

For an easier setup, you can use Docker Compose:

```yaml
# docker-compose.yml
version: '3'
services:
  store-management:
    image: ubuntu:latest
    container_name: store-management
    ports:
      - "8081:8081"
    working_dir: /app
    volumes:
      - ./:/app
    command: >
      bash -c "apt-get update && 
      apt-get install -y curl git build-essential &&
      curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash &&
      export NVM_DIR=\"$$HOME/.nvm\" &&
      [ -s \"$$NVM_DIR/nvm.sh\" ] && \. \"$$NVM_DIR/nvm.sh\" &&
      nvm install --lts &&
      npm install -g pm2 &&
      npm install &&
      npm run build &&
      pm2 start npm --name \"store-management\" -- run preview &&
      pm2 logs"
```

Run with:
```bash
docker-compose up
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
    args: "run preview",
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
   - Make sure to use `npm run preview` instead of `npm start`

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

5. Container-specific issues:
   - If container stops unexpectedly, run with: `docker start -i store-management`
   - For port conflicts: Change the mapped port, e.g., `-p 8082:8081`
   - For persistence: Add a volume mount to preserve data

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
