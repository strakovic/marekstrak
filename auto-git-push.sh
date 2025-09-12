#!/bin/bash

# Auto Git Push Script
# This script automatically commits and pushes changes to git
# Designed to run every 15 minutes via launchd

# Change to the project directory
cd "/Users/marekstraka/Sites/billr" || exit 1

# Check if there are any changes to commit
if [[ -n $(git status --porcelain) ]]; then
    # Get current timestamp
    timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    # Add all changes
    git add .
    
    # Commit with timestamp
    git commit -m "Auto-commit: $timestamp"
    
    # Push to remote
    git push origin billr
    
    # Log the action
    echo "[$timestamp] Auto-committed and pushed changes" >> "/Users/marekstraka/Sites/billr/auto-git.log"
else
    # Log that no changes were found
    timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo "[$timestamp] No changes to commit" >> "/Users/marekstraka/Sites/billr/auto-git.log"
fi
