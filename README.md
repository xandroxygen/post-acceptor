# post-acceptor

Silly little collection of random endpoints useful for testing Canvas, including

- a webhook endpoint to POST live events to
- an implementation of the OAuth2 flow for DeveloperKeys
- an endpoint that takes 30 seconds to respond
- etc etc

## Running Locally

This is a very dumb and simple app that doesn't
have hot reloading/volumes so:

```bash
dc build && dc up
```

## Running in the Wild

You can expose this to the outside world in order
to test things like webhook events with
production Canvas, using localtunnel. Run this
in a different terminal tab:

```bash
npx localtunnel -l web.post-acceptor.docker -p 3001
```

For making this part work with the OAuth
redirects, you will need to copy the localtunnel
domain, and change it in the `redirectUrl`, and
rebuild/restart the container (without quitting
the localtunnel process).

## OAuth Stuff

To test out the Canvas OAuth flow and get an API
access token,

1. Create an API-type DeveloperKey in Canvas, and
   copy its id and secret.
2. Replace `clientId` and `clientSecret` with those values, and rebuild/restart.
3. Go to `web.post-acceptor.docker/oauth_start`
