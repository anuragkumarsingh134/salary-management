
# NEW GK COLLECTIONS

A React-based store management system built with Vite, TypeScript, and Tailwind CSS.

## System Requirements

- Ubuntu 20.04 or higher
- Node.js 18+ (LTS recommended)
- npm 9+
- PM2 (for production deployment)

## Local Development Setup

### 1. Install Node.js and npm using nvm

```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Reload shell configuration
source ~/.bashrc

# Install Node.js LTS version
nvm install --lts

# Use the installed version
nvm use --lts

# Verify installation
node --version
npm --version
```

### 2. Clone and Setup Project

```bash
# Clone the repository
git clone <YOUR_REPOSITORY_URL>

# Navigate to project directory
cd new-gk-collections

# Install dependencies
npm install

# Start development server
npm run dev
```

The development server will start at `http://localhost:5173`

## Production Deployment with PM2

### 1. Install PM2 Globally

```bash
# Install PM2 globally
npm install -g pm2

# Verify PM2 installation
pm2 --version
```

### 2. Build and Deploy

```bash
# Build the project
npm run build

# Install serve globally (if not already installed)
npm install -g serve

# Start the application with PM2
pm2 serve dist 3000 --name "gk-collections"

# Other useful PM2 commands:
pm2 status                  # Check application status
pm2 logs gk-collections    # View application logs
pm2 restart gk-collections # Restart application
pm2 stop gk-collections   # Stop application
pm2 delete gk-collections # Remove application from PM2

# Setup PM2 to start on system boot
pm2 startup ubuntu
```

### 3. Monitoring

```bash
# Monitor all applications
pm2 monit

# View dashboard
pm2 plus    # Requires PM2 Plus account
```

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Project Structure

```
├── src/
│   ├── components/     # React components
│   ├── pages/         # Route pages
│   ├── store/         # State management
│   ├── utils/         # Utility functions
│   └── main.tsx       # Entry point
├── public/            # Static assets
└── dist/             # Production build
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Troubleshooting

If you encounter EACCES permissions errors during global installations:
```bash
# Fix npm permissions
sudo chown -R $USER:$GROUP ~/.npm
sudo chown -R $USER:$GROUP ~/.config
```

For PM2 permission issues:
```bash
# Fix PM2 permissions
sudo env PATH=$PATH:/usr/bin pm2 startup ubuntu -u $USER
```

## Support

For issues and feature requests, please create an issue in the repository.

## License

[MIT License](LICENSE)
