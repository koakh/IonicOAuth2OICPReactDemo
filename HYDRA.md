# HYDRA



urls:
  self:
  #   issuer: http://127.0.0.1:4444
  # consent: http://127.0.0.1:3000/consent
  # login: http://127.0.0.1:3000/login
  # logout: http://127.0.0.1:3000/logout
    issuer: https://kuartzo.com:4444
  consent: https://kuartzo.com:3000/consent
  login: https://kuartzo.com:3000/login
  logout: https://kuartzo.com:3000/logout



host in contabo and check if server is 127.0.0.1 to ?????



Hello @Vincent (ory) 
sorry for a PM
but I have a lots of problems with a redirect to 127.0.0.1 when I use hydra from a remote machine
for example if I follow 5 min tutorial and launch the tutorial client only change the ip ex
docker-compose \
	-f quickstart.yml \
	exec hydra hydra token user \
	--client-id auth-code-client \
	--client-secret secret \
	--endpoint https://kuartzo.com:4444/ \
	--port 5555 \
	--scope openid,offline
note for https://kuartzo.com:4444 that is the hydra server
when we try the login flow pressing Authorize application
we always get redirected to http://127.0.0.1:4444/oauth2/fallbacks/error........
and obvious we must redirect to https://kuartzo.com:4444/oauth2/fallbacks/error........
but the Authorize application start flow link url is https://kuartzo.com:4444/oauth2/auth?audience=&client_id=auth-code-client&max_age=0&nonce=mfptygsulmdnxgcwuwkpirrs&prompt=&redirect_uri=http%3A%2F%2F127.0.0.1%3A5555%2Fcallback&response_type=code&scope=openid+offline&state=tgioaqvwkdwvuhhhfrcsdwwk
that proves that is hydra that is makes it happen
I found this when start to use mobile phone and ionic on android, In start I think is a problem in project
but after a few hours debugging I found that the problem occurs with 5 min tutorial to

thanks @Vincent (ory) 




we need access to consent server port 3000

LISTEN 0      4096         0.0.0.0:3000       0.0.0.0:*    users:(("docker-proxy",pid=31505,fd=4))   
LISTEN 0      4096            [::]:3000          [::]:*    users:(("docker-proxy",pid=31511,fd=4)) 


87786986c836   oryd/hydra-login-consent-node:v1.10.6   "/bin/sh -c 'npm run…"   2 hours ago    Up 8 minutes   0.0.0.0:3000->3000/tcp, :::3000->3000/tcp                                      
                            oryhydra5mintutorial_consent_1



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

## Pre-Requisites

```shell
$ sudo apt install golang-go jq -y
# https://ionicframework.com/docs/intro/cli
$ npm install -g @ionic/cli
```
## Spin Hydra Server

```shell
$ mkdir /home/mario/Development/@OAuth2/Ory/Hydra -p
$ cd /home/mario/Development/@OAuth2/Ory/Hydra
$ git clone https://github.com/ory/hydra.git
$ mv hydra OryHydra5MinTutorial
# change into the directory with the Hydra source code
$ cd OryHydra5MinTutorial

# backup hydra.yml config file before changes
$ cp contrib/quickstart/5-min/hydra.yml contrib/quickstart/5-min/hydra.yml_org
# enable cors and change endpoints
$ sudo nano contrib/quickstart/5-min/hydra.yml
```

change

```yml
serve:
  cookies:
    same_site_mode: Lax

urls:
  self:
    issuer: http://127.0.0.1:4444
  consent: http://127.0.0.1:3000/consent
  login: http://127.0.0.1:3000/login
  logout: http://127.0.0.1:3000/logout

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
```

to

```yml
serve:
  cookies:
    same_site_mode: Lax

urls:
  self:
    issuer: https://kuartzo.com:4444
  consent: https://kuartzo.com:3000/consent
  login: https://kuartzo.com:3000/login
  logout: https://kuartzo.com:3000/logout

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
```

```shell
# clean up optinal, only if previously spin up hydra stack
$ docker-compose -f quickstart.yml -f quickstart-postgres.yml kill
$ docker-compose -f quickstart.yml -f quickstart-postgres.yml rm -f -v

# run the following command to start the needed containers:
# This command makes Docker Compose start up a database server and a basic base ORY Hydra server that uses this database. If you need more details on this, please examine the scripts/5-min-tutorial.sh and docker-compose*.yml files.
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

# create credentials client
$ docker-compose -f quickstart.yml exec hydra \
	hydra clients create \
	--endpoint https://kuartzo.com:4445/ \
	--id my-client \
	--secret secret \
	--grant-types client_credentials \
	--callbacks https://kuartzo.com:5555
# outcome
You should not provide secrets using command line flags, the secret might leak to bash history and similar systems
OAuth 2.0 Client ID: my-client

# perform the client credentials grant
$ docker-compose -f quickstart.yml exec hydra \
	hydra token client \
	--endpoint https://kuartzo.com:4444/ \
	--client-id my-client \
	--client-secret secret
# outcome
d83xbRDJBYGYZRcJIvUwRTbXpWod35gAv3q-s7NsvUQ.3050uig5ze3CTpvEC7LqpOHXtu7gzrJgaLszb8oxPF0

# check client
$ curl -s -X GET http://localhost:4445/clients/my-client | jq
# outcome
{
  "client_id": "my-client",
  "client_name": "",
  "redirect_uris": [],
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
  "created_at": "2022-01-15T16:52:39Z",
  "updated_at": "2022-01-15T16:52:38.682451Z",
  "metadata": {}
}

# create client spa+mobile oath+pkce12
$ docker-compose -f quickstart.yml exec hydra \
	hydra clients create \
	--endpoint https://kuartzo.com:445 \
	--id oauth-pkce5 \
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

# check client
$ curl -s -X GET http://localhost:4445/clients/oauth-pkce | jq
# outcome
{
  "client_id": "oauth-pkce",
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
  "created_at": "2022-01-15T16:57:35Z",
  "updated_at": "2022-01-15T16:57:35.328467Z",
  "post_logout_redirect_uris": [
    "https://kuartzo.com:810/endredirect",
    "com.appauth.demo://endSession"
  ],
  "metadata": {}
}

# starts a server that serves an example web application
$ docker-compose \
	-f quickstart.yml \
	exec hydra hydra token user \
	--client-id my-client3 \
	--client-secret secret \
	--endpoint https://kuartzo.com:4444/ \
  --redirect https://kuartzo.com:5555/ \
	--port 5555 \
	--scope openid,offline
```

now navigae to <https://kuartzo.com:5555/> and start authorization flow with **Authorize application**

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