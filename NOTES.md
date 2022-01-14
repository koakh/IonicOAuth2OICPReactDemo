# IonicAppauthReactDemo NOTES

## Run

```shell
$ HOST=localhost ionic serve
```

## Links

- [OAuth 2.0 for Client-side Web Applications &nbsp;|&nbsp; Google Identity &nbsp;|&nbsp; Google Developers](https://developers.google.com/identity/protocols/oauth2/javascript-implicit-flow)

- [Add a social login (IdP)](https://help.okta.com/en/prod/Content/Topics/Security/idp-social.htm)

- [Okta identity providers](https://dev-96731463-admin.okta.com/admin/access/identity-providers)

## Create Google IdP (Identity Provider)

Google Cloud Plataform > Apis and Services > Credentials

- [Goto Project](https://console.cloud.google.com/apis/credentials/oauthclient/578922109877-c41et95rknrorcf1sf3dr5it69u1lhud.apps.googleusercontent.com?project=nextjs-nestjs-graphql-starter)

![image](attachments/2021-12-30-19-40-03.png)

![image](attachments/2021-12-30-19-42-37.png)

- Client ID: 578922109877-c41et95rknrorcf1sf3dr5it69u1lhud.apps.googleusercontent.com
- Client secret: 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
- Google IdP ID: 0oa3gq27xnkurdkQm5d7

Okta > Applications

![image](attachments/2021-12-30-19-52-24.png)

![image](2021-12-30-19-53-51.png)

![image](attachments/2022-01-06-21-53-40.png)

![image](attachments/2021-12-30-23-55-20.png)

`.env`

```shell
REACT_APP_AUTH_CLIENT_ID="0oa3ffbb80Eh2R1j15d7"
REACT_APP_AUTH_SERVER_HOST="https://dev-96731463.okta.com"
REACT_APP_AUTH_SCOPES="openid profile email offline_access"
REACT_APP_AUTH_EXTRA_IDP="0oa3gq27xnkurdkQm5d7"
```

the trick to get refreshTokens working on okta is using request `offline_access` scope to