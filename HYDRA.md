# HYDRA

https://ionicframework.com/docs/troubleshooting/debugging
https://marketplace.visualstudio.com/items?itemName=mpotthoff.vscode-android-webview-debug

http://127.0.0.1:4444/.well-known/openid-configuration

find com.appauth.demo

      - "4444:4444" # Public port
      - "4445:4445" # Admin port
      - "5555:5555" # Port for hydra token user

https://www.ory.sh/hydra/docs/reference/api#operation/discoverOpenIDConfiguration

127.0.0.1:4444/.well-known/openid-configuration

# https://github.com/ory/hydra/issues/2165
# curl 'http://localhost:4444/.well-known/openid-configuration' | jq
# curl http://127.0.0.1:4444/userinfo
# curl 'http://localhost:4444/.well-known/openid-configuration' -H 'User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:82.0) Gecko/20100101 Firefox/82.0' -H 'Accept: application/json' -H 'Accept-Language: en-US,en;q=0.5' --compressed -H 'Origin: http://localhost:4200' -H 'Connection: keep-alive' -H 'Referer: http://localhost:4200/' -H 'Cache-Control: max-age=0'

# must run on port 8100

# contrib/quickstart/5-min/hydra.yml
#  HOST=localhost ionic serve --port 5555 --public-host 127.0.0.1

# OAUTH2_EXPOSE_INTERNAL_ERRORS=true



notes on cors hydra.yml



- [Preparing for Production | Ory Hydra](https://www.ory.sh/hydra/docs/production/)

Exposing Administrative and Public API Endpoints​

ORY Hydra serves APIs via two ports:

- Public port (default 4444)
- Administrative port (default 4445)

The public port can and should be exposed to public internet traffic. That port handles requests to:

- /.well-known/jwks.json
- /.well-known/openid-configuration
- /oauth2/auth
- /oauth2/token
- /oauth2/revoke
- /oauth2/fallbacks/consent
- /oauth2/fallbacks/error
- /oauth2/sessions/logout
- /userinfo

```shell
# clean up
$ docker-compose -f quickstart.yml -f quickstart-postgres.yml kill
$ docker-compose -f quickstart.yml -f quickstart-postgres.yml rm -f -v

# spin hydra stack
docker-compose \
	-f quickstart.yml \
	-f quickstart-postgres.yml \
	-f quickstart-tracing.yml \
	up --build

# create client
$ docker-compose -f quickstart.yml exec hydra \
	hydra clients create \
	--endpoint http://192.168.1.111:4445 \
	--id oauth-pkce4 \
  --token-endpoint-auth-method none \
	--grant-types authorization_code,refresh_token \
	--response-types code,id_token \
	--scope openid,profile,email,offline_access \
	--callbacks http://localhost:8100/loginredirect,com.appauth.demo://callback,com.appauth.demo://endSession \
  --post-logout-callbacks http://localhost:8100/endredirect,com.appauth.demo://endSession \
  --allowed-cors-origins http://localhost:8100
# outcome
OAuth 2.0 Client ID: oauth-pkce
OAuth 2.0 Client Secret: MQvH-do_~IjQwxW-bmlPAk90PT

# check client
$ curl -s -X GET http://localhost:4445/clients/oauth-pkce | jq
# outcome
{
  "client_id": "oauth-pkce",
  "client_name": "",
  "redirect_uris": [
    "http://localhost:8100/loginredirect",
    "com.appauth.demo://callback"
  ],
  "grant_types": [
    "authorization_code",
    "refresh_token"
  ],
  "response_types": [
    "code",
    "id_token"
  ],
  "scope": "openid profile email offline_access",
  "audience": [],
  "owner": "",
  "policy_uri": "",
  "allowed_cors_origins": [
    "http://localhost:8100"
  ],
  "tos_uri": "",
  "client_uri": "",
  "logo_uri": "",
  "contacts": [],
  "client_secret_expires_at": 0,
  "subject_type": "public",
  "jwks": {},
  "token_endpoint_auth_method": "none",
  "userinfo_signed_response_alg": "none",
  "created_at": "2022-01-14T22:22:24Z",
  "updated_at": "2022-01-14T22:22:23.866644Z",
  "post_logout_redirect_uris": [
    "http://localhost:8100/endredirect"
  ],
  "metadata": {}
}
```
