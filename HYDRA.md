# HYDRA

- used a ubuntu 20.04 bare metal or virtual machine, you choose, with fireall or disaabled or open ports `444/tcp`, `445/tcp`, `300/tcp`, `810/tcp`
- used a domain in this case `kuartzo.com` to override https/tls certificates, in this case we use let's encrypt to generate our certificates in caddy revere proxy

## Links

### Ory Hydra

- [Introduction | Ory Hydra](https://www.ory.sh/hydra/docs/)

### Ionic/Capacitor

- [Installing Ionic | Ionic Documentation](https://ionicframework.com/docs/intro/cli)

## Network Addresses

- issuer: https://kuartzo.com:444
- consent: https://kuartzo.com:300/consent
- login: https://kuartzo.com:300/login
- logout: https://kuartzo.com:300/logout
- client: https://kuartzo.com:810

## Pre-Requisites

```shell
# install go, jq and other essencials
$ sudo apt install golang-go jq -y
# install ionic cli
$ npm install -g @ionic/cli
```

## Spin up Ory Hydra Server

### Checkout Project and configure Hydra server

```shell
$ mkdir ${USER}/Development/@OAuth2/Ory/Hydra -p
$ cd ${USER}/Development/@OAuth2/Ory/Hydra
# clone hydra repo
$ git clone https://github.com/ory/hydra.git
$ mv hydra OryHydra5MinTutorial
# change into the directory with the hydra source code
$ cd OryHydra5MinTutorial

# backup hydra.yml config file before changes, this will be the only file that we change in whole repo
$ cp contrib/quickstart/5-min/hydra.yml contrib/quickstart/5-min/hydra.yml_org
# enable cors and change endpoints
$ sudo nano contrib/quickstart/5-min/hydra.yml
```

add bellow config, and WATCH out for tabs, always use spaces, or just paste

```yml
serve:
  cookies:
    same_site_mode: Lax

urls:
  self:
    issuer: https://kuartzo.com:444
  consent: https://kuartzo.com:300/consent
  login: https://kuartzo.com:300/login
  logout: https://kuartzo.com:300/logout

secrets:
  system:
    - youReallyNeedToChangeThis

oidc:
  subject_identifiers:
    supported_types:
      - pairwise
      - public
    pairwise:
      salt: youReallyNeedToChangeThis

serve:
  public:
    cors:
      enabled: true
      allowed_origins:
        # web client
        - https://kuartzo.com:810
        # capacitor mobile client
        - http://localhost:8100
      allowed_methods:
        - POST
        - GET
        - PUT
        - PATCH
        - DELETE
      allowed_headers:
        - Authorization
      exposed_headers:
        - Content-Type
  # admin:
  #   cors:
  #   ..add admin configuration here
```

### Clean up old Hydra Server | Optional

```shell
# clean up optinal, only if previously spin up hydra stack
$ docker-compose -f quickstart.yml -f quickstart-postgres.yml kill
$ docker-compose -f quickstart.yml -f quickstart-postgres.yml rm -f -v
```

### Spin up Ory Hydra Server

```shell
# run the following command to start the needed containers:
# This command makes Docker Compose start up a database server and a basic base ORY Hydra server that uses this database.
# If you need more details on this, please examine the scripts/5-min-tutorial.sh and docker-compose*.yml files.
$ docker-compose \
	-f quickstart.yml \
	-f quickstart-postgres.yml \
	up --build

# You may also extend the command above to enable distributed tracing. The tracing UI is exposed at http://127.0.0.1:16686/search
$ docker-compose \
	-f quickstart.yml \
	-f quickstart-postgres.yml \
	-f quickstart-tracing.yml \
	up --build
```

### Create credentials client | Optional (we don't need it for oauth+pkce flow)

```shell
# create credentials client
$ docker-compose -f quickstart.yml exec hydra \
	hydra clients create \
	--endpoint https://kuartzo.com:445/ \
	--id my-client \
	--secret secret \
	--grant-types client_credentials \
	--callbacks https://kuartzo.com:555
# outcome
You should not provide secrets using command line flags, the secret might leak to bash history and similar systems
OAuth 2.0 Client ID: my-client

# perform the client credentials grant
$ docker-compose -f quickstart.yml exec hydra \
	hydra token client \
	--endpoint https://kuartzo.com:444/ \
	--client-id my-client \
	--client-secret secret
# outcome
WuvOz0AixpQJNLZjhxC861li87dmSduTHSr-Rq63-ww.8MXPsUA4Kl-fwVon13DrwQUNJ-Wh1aKXQ3sDa5gHR34

# check client
$ curl -s -X GET http://localhost:4445/clients/my-client | jq
# outcome
{
  "client_id": "my-client",
  "client_name": "",
  "redirect_uris": [
    "https://kuartzo.com:555"
  ],
  "grant_types": [
    "client_credentials"
  ],
  "response_types": [
    "code"
  ],
  "scope": "offline_access offline openid",
  "audience": [],
  "owner": "",
  "policy_uri": "",
  "allowed_cors_origins": [],
  "tos_uri": "",
  "client_uri": "",
  "logo_uri": "",
  "contacts": [],
  "client_secret_expires_at": 0,
  "subject_type": "public",
  "jwks": {},
  "token_endpoint_auth_method": "client_secret_basic",
  "userinfo_signed_response_alg": "none",
  "created_at": "2022-01-15T22:29:55Z",
  "updated_at": "2022-01-15T22:29:54.998539Z",
  "metadata": {}
}
```
#### Starts a client server that serves an example web application

```shell
# starts a server that serves an example web application
$ docker-compose \
	-f quickstart.yml \
	exec hydra hydra token user \
	--client-id my-client \
	--client-secret secret \
	--endpoint https://kuartzo.com:444 \
  --redirect https://kuartzo.com:555 \
	--port 5555 \
	--scope openid,offline
```

now navigate to <https://kuartzo.com:555/> and start authorization flow with **Authorize application**

### Create client spa+mobile oath+pkce12

```shell
# create client spa+mobile oath+pkce12
$ docker-compose -f quickstart.yml exec hydra \
	hydra clients create \
	--endpoint https://kuartzo.com:445 \
	--id oauth-pkce \
  --token-endpoint-auth-method none \
	--grant-types authorization_code,refresh_token \
	--response-types code,id_token \
	--scope openid,profile,email,offline_access \
	--callbacks https://kuartzo.com:810/loginredirect,com.appauth.demo://callback,com.appauth.demo://endSession \
  --post-logout-callbacks https://kuartzo.com:810/endredirect,com.appauth.demo://endSession \
  --allowed-cors-origins https://kuartzo.com:810
# outcome
OAuth 2.0 Client ID: oauth-pkce
This OAuth 2.0 Client has no secret

> note: required `com.appauth.demo://endSession` in `--callbacks`

# check client
$ curl -s -X GET http://localhost:4445/clients/oauth-pkce | jq
# outcome
{
  "client_id": "oauth-pkce6",
  "client_name": "",
  "redirect_uris": [
    "https://kuartzo.com:810/loginredirect",
    "com.appauth.demo://callback",
    "com.appauth.demo://endSession"
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
    "https://kuartzo.com:810"
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
  "created_at": "2022-01-15T21:54:12Z",
  "updated_at": "2022-01-15T21:54:12.017373Z",
  "post_logout_redirect_uris": [
    "https://kuartzo.com:810/endredirect",
    "com.appauth.demo://endSession"
  ],
  "metadata": {}
}
```

#### Configure OAUth2+PKCE Ionic/Capacitor Client App

```shell
$ mkdir ${USER}/Development/@OAuth2 -p
$ cd ${USER}/Development/@OAuth2
# clone hydra repo
$ git clone https://github.com/koakh/IonicOAuth2OICPReactDemo.git
$ mv hydra OryHydra5MinTutorial
# change into the directory with the hydra source code
$ cd OryHydra5MinTutorial
```


#### Starts a client server that serves an example web application






## Open Firewall

```shell
# create application
$ sudo nano /etc/ufw/applications.d/oauth-demo
```

```conf
[OAuth2Demo]
title=OAuth2 Hydra Demo
description=OAuth2 Hydra Demo
ports=444/tcp|445/tcp|810/tcp|300/tcp
```

```shell
# allow application
$ sudo ufw allow OAuth2Demo
Rules updated
Rules updated (v6)
```











FAILS ON

https://kuartzo.com:4444/oauth2/auth?audience=&client_id=my-client&max_age=0&nonce=naduvestwgytiggbcyafchrs&prompt=&redirect_uri=http%3A%2F%2F127.0.0.1%3A5555%2Fcallback&response_type=code&scope=openid+offline&state=gbyxpqohsossapecwfigvtcq

redirect_uri=127.0.0.1:5555

## Ionic client

```shell
$ ionic serve
[react-scripts] ℹ ｢wds｣: Project is running at http://0.0.0.0:8100
```



prevent problem accept token because of http


Object { action: "Sign In Failed", error: "The+request+is+missing+a+required+parameter,+includes+an+invalid+parameter+value,+includes+a+parameter+more+than+once,+or+is+otherwise+malformed.+Redirect+URL+is+using+an+insecure+protocol,+http+is+only+allowed+for+hosts+with+suffix+`localhost`,+for+example:+http://myapp.localhost/." }


authclient.kuartzo.com {
  reverse_proxy * 127.0.0.1:8100
}

5.189.139.86    app.kuartzo.com






secure all 
https://app.kuartzo.com
https://kuartzo.com:444
https://kuartzo.com:445


start here https://kuartzo.com:810

changes in caddy
and hydra.yml



Redirect all HTTP requests to HTTPS with a 301
https://caddy.community/t/redirect-all-http-requests-to-https-with-a-301/4061

Caddy does this by default with Automatic HTTPS. You can just leave your site scheme-agnostic, e.g.:

example.com {
  ...
}
And Caddy will run a 301 Redirect listening on HTTP and serve the actual site on HTTPS.





```caddy
# client app
kuartzo.com:810 {
        reverse_proxy * 127.0.0.1:8100
}

# hydra
kuartzo.com:444 {
        reverse_proxy * 127.0.0.1:4444  
}

# hydra
kuartzo.com:445 {
        reverse_proxy * 127.0.0.1:4445
}

# hydra consent
kuartzo.com:300 {
        reverse_proxy * 127.0.0.1:3000
}
```

sudo service caddy stop
sudo /usr/bin/caddy run --environ --config /etc/caddy/Caddyfile
sudo service caddy start




- [ionic: where to see the displayed console log](https://stackoverflow.com/questions/49316634/ionic-where-to-see-the-displayed-console-log)
native debug
ionic cordova run android
[ERROR] native-run was not found on your PATH. Please install it globally:
        
        npm i -g native-run
ionic capacitor run android        



output client and all configs
always check android cleint oauth-pkce5 that match with woring version of web



src/main/assets/capacitor.config.json
	"server": {
		"url": "http://localhost:8100"
	}
}

must add to cors










https://ionicframework.com/docs/troubleshooting/debugging
https://marketplace.visualstudio.com/items?itemName=mpotthoff.vscode-android-webview-debug

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

