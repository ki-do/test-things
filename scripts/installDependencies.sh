#!/bin/bash

# Remove nested local node_modules to avoid shadowing workspace dependencies in CI.
find things -type d -name node_modules -prune -exec rm -rf {} +

# Install dependencies for npm workspaces packages
npm ci

npm --workspace ./util run clean
npm --workspace ./util run build

# Install dependencies for non-npm packages
for protocol_directory in things/*/*/* ; do
    current_path="$(pwd)"
    cd "$protocol_directory"

    # Install dependencies for poetry 
    if [ -f "poetry.lock" ]; then
        poetry install
    fi

    cd $current_path
done

exit 0
