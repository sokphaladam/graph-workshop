#!/bin/bash
cd /var/www/graph-workshop
git fetch origin deploy-local
if [ $(git rev-parse HEAD) != $(git rev-parse origin/deploy-local) ]; then
  echo "🔄 Changes detected, updating..."
  git pull origin deploy-local
  . ~/.nvm/nvm.sh && npm install --omit=dev
  . ~/.nvm/nvm.sh && npm run graph
  . ~/.nvm/nvm.sh && npm run build
  . ~/.nvm/nvm.sh && pm2 restart graph-workshop
  echo "✅ Updated successfully!!"
else
  echo "✅ No changes, skipping build."
fi
echo "Deployment finished at $(date)"
