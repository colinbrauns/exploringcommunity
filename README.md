## ExploringCommunity — Ghost site and theme

This repository contains a Ghost theme (`theme/exploringcommunity`) and deployment workflows. You will host Ghost on Linode and manage the theme via GitHub.

### What you get
- Theme: Clean, fast theme focused on community-building content
- CI: GitHub Action to validate and deploy the theme to your Ghost instance
- Deploy options: Ghost-CLI on a Linode or Docker Compose example

### 1) Create your Ghost instance on Linode
Choose one of the two options below.

- Option A — Linode Marketplace (recommended): Use the Ghost app in Linode Marketplace, point your domain to the Linode, and the installer will handle Nginx, SSL, and MySQL.

- Option B — Manual install with Ghost-CLI:
  1. Point DNS `A` record for `exploringcommunity.com` (and `www`) to your Linode IP
  2. SSH to the server and install prerequisites
     ```bash
     sudo apt-get update && sudo apt-get install -y nginx mysql-server
     curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
     sudo apt-get install -y nodejs
     sudo npm install -g ghost-cli@latest
     ```
  3. Create a directory and install Ghost (will configure Nginx + SSL)
     ```bash
     sudo mkdir -p /var/www/exploringcommunity
     sudo chown $USER:$USER /var/www/exploringcommunity
     cd /var/www/exploringcommunity
     ghost install \
       --url https://exploringcommunity.com \
       --db mysql \
       --process systemd \
       --no-prompt
     # During prompts, provide email for SSL, MySQL creds (or let Ghost-CLI create), and accept Nginx/SSL setup
     ```

If you prefer containers, see `deploy/docker-compose.yml` for a quick-start (you will still want a reverse proxy like Nginx/Caddy for SSL on the server).

### 2) Configure GitHub secrets for theme auto-deploy
Add these repository secrets in GitHub → Settings → Secrets and variables → Actions:
- `GHOST_ADMIN_API_URL` — e.g. `https://exploringcommunity.com`
- `GHOST_ADMIN_API_KEY` — Admin API key from Ghost Admin → Settings → Integrations → New Custom Integration

The workflow at `.github/workflows/deploy-theme.yml` will:
- Validate the theme with `gscan`
- Zip the theme
- Upload it to your Ghost site automatically on every push to `main` affecting `theme/**`

### 3) Local theme development
```bash
cd theme/exploringcommunity
npm install
npm test   # runs gscan validation
npm run zip
```
Upload the generated `exploringcommunity.zip` via Ghost Admin, or push to `main` and let CI deploy it.

### 4) Customizing content and navigation
- Add pages, posts, tags and navigation in Ghost Admin
- The theme shows a hero section and a post feed on the home page; tweak copy in `theme/exploringcommunity/index.hbs`

### 5) Notes
- This repo is for the theme and deploy workflows. Ghost itself runs on the server.
- If you used the Docker example, put a reverse proxy in front and set `url` to your domain.

### 6) First-time setup on this repo
1. Initialize Git and push to GitHub (replace YOUR_REPO_URL):
   ```bash
   git init
   git add .
   git commit -m "Initialize Ghost theme and deploy workflow"
   git branch -M main
   git remote add origin YOUR_REPO_URL
   git push -u origin main
   ```
2. In GitHub, add the two Actions secrets described above.
3. Push any change under `theme/**` to trigger a deploy.


