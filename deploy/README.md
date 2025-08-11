### Linode deployment options

1) Marketplace Ghost app (recommended):
- Create a Linode with the Ghost Marketplace image
- Set your domain DNS A record to the Linode IP
- Complete the on-server prompts to configure Nginx and SSL

2) Docker Compose (quick-start, dev):
```bash
cd deploy
docker compose up -d
# then reverse-proxy 443→2368 with Caddy or Nginx and set proper `url`
```

