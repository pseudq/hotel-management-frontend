#!/bin/sh
# Generate runtime configuration with environment variables
echo "window.RUNTIME_CONFIG = { 
  API_URL: \"$REACT_APP_API_URL\" 
};" > /usr/share/nginx/html/runtime-config.js

# Execute the CMD
exec "$@"