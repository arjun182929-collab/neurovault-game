#!/bin/bash
# Persistent Next.js server wrapper
cd /home/z/my-project
while true; do
  echo "Starting Next.js server..."
  npx next dev -p 3000 --hostname 0.0.0.0
  echo "Server died, restarting in 3s..."
  sleep 3
done
