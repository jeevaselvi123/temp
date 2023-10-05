#!/usr/bin/env bash

# set flags that ensure exit on failed command
set -e
set -o pipefail

npm install --global vercel

vercel pull --yes --environment=$ENVIRONMENT --token=$VERCEL_TOKEN --scope $VERCEL_SCOPE
export ENV_FILE=${!ENV_FILE}
cat "$ENV_FILE" > ".env" 

sed -i -r "s#^(NEXT_PUBLIC_BASE_URL=\").*\"#\1https://${APP_URL}\"#"  .env
sed -i -r "s#http://localhost:3000#https://${APP_URL}#" public/temp-issuer.html

if [ "$ENVIRONMENT" == "production" ]; then
vercel build --prod --token=$VERCEL_TOKEN --scope $VERCEL_SCOPE
vercel deploy --prod --prebuilt  --token=$VERCEL_TOKEN --scope $VERCEL_SCOPE
else
vercel build --token=$VERCEL_TOKEN --scope $VERCEL_SCOPE
export DEPLOYMENT_URL=$(vercel deploy --prebuilt  --token=$VERCEL_TOKEN --scope $VERCEL_SCOPE)
export URL=$DEPLOYMENT_URL | sed 's/https\?:\/\///'
vercel alias set $URL $APP_URL -t $VERCEL_TOKEN --scope $VERCEL_SCOPE
fi