Ionic AppAuh React Demo
=======================

This is a Rect SPA application that uses Ionic in conjunction with [AppAuth](https://github.com/wi3land/ionic-appauth) library to integrate with OIDC compliant Auth server.

There are many OIDC compliant Auth services you can connect to delegate authentication of your app to 3rd parties. Okta, Auth0, Amazon Cognito are example of such company/services.

> *NOTE* I noticed that Google and Auth0 does not include `end_session_endpoint` attribute in their OIDC well-known endpoint payload. Hence the login works but logout may fail.

## Configuring Okta

If you have not created a free dev account in Okta yet, go to https://developer.okta.com and create one.

### Creating an Application

In order to connect your app to Okta, you need to register an application in Okta first.

1. Go to "Application" and click the "Add Application" button.
2. Select Single-Page App
  - In the Login Redirect URI enter: `http://localhost:8100/loginredirect` and `com.appauth.demo://callback`
  - In the Login Redirect URI enter: `http://localhost:8100/endredirect` and `com.appauth.demo://endSession`
  
    The first uri is for web, the second is for the mobile native (e.g. capacitor)

### Adding a Social Identity Provider

This optional step allows you to use social media- Google, Facebook, etc - as the Identity Provider.

**NOTE** I am assuming you already have a project in [Google Dev Console](https://console.developers.google.com/) with OAuth2 enabled.

1. In Okta dev console, go to Users -> Social & Identity Providers
2. Click on Add Identity Provide and select "Google"
3. Give the IdP a name and copy paste the Client ID and Client Secret from Google Dev Console.
  - THe scopes should include `email, openid, profile`
4. When the Google IdP was successfully added, you will see an entry in the list. Click the dark circle icon to the left of the name
  - You will need the IdP ID for configuring your Ionic application. 


## Configuring the Application

The application will pickup the configuration from the `.env` file.

.env file:
```shell
REACT_APP_AUTH_CLIENT_ID=your-client-id
REACT_APP_AUTH_SERVER_HOST=https://dev-xyz.okta.com
REACT_APP_AUTH_SCOPES="openid profile"
REACT_APP_AUTH_EXTRA_IDP=your-social-login-idp-in-okta
```

The `REACT_APP_AUTH_EXTRA_IDP` is needed if you want to enable social IdP in Okta.


## Running the application

First, install the dependencies
```shell
$ yarn install
# or
$ npm install
```

Then run the app locally, assuming you have `ionic` installed
```shell
$ ionic serve
```

## Deploying Mobile App using Capacitor

```shell
# Build the code (each time original source changes)
$ ionic build

# Copy the asset to the android project (after each cap build)
$ ionic cap copy 

# Synchronize project by copying changes to android platform (When new plugins were added)
$ ionic cap sync

# Open the android studio
$ ionic cap open android
```

The last command will open the Android Studio(AS), an IDE based on IntelliJ.
From AS, select the preferred device (simulator) - a Pixel should be fine - and press the play button.
Once the device simulator shows up, press the "on" button to turn it on. Wait few about 2 minutes until the app is loaded in the screen.



## References
- https://scotch.io/tutorials/add-social-login-to-ionic-apps#toc-add-social-login-with-google
