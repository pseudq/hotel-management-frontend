#!/bin/bash

# Replace environment variables in the JavaScript files
echo "Replacing environment variables..."
find /usr/share/nginx/html -name "*.js" -exec sed -i "s|REACT_APP_API_URL_PLACEHOLDER|$REACT_APP_API_URL|g" {} \;

# Start the command passed to docker run
exec "$@"

