const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");

const app = express();
app.use(bodyParser.text({ type: "*/*" }));

app.post("/webhook", (req, res) => {
  console.log({
    type: "webhook",
    body: req.body,
    contentType: req.get("Content-Type"),
    auth: req.get("Authorization"),
  });
  res.status(200).send();
});

app.put("/webhook", (req, res) => {
  console.log({
    type: "webhook",
    body: req.body,
    contentType: req.get("Content-Type"),
    auth: req.get("Authorization"),
  });
  res.status(200).send();
});

app.post("/export", (req, res) => {
  console.log({
    type: "export",
    body: req.body,
    contentType: req.get("Content-Type"),
  });
  console.log("returning 200");
  res.send({
    status_url: "http://web.post-acceptor.docker:3000/status",
    fetch_url: "http://web.post-acceptor.docker:3000/fetch",
  });
});

app.post("/import", (req, res) => {
  console.log({
    type: "import",
    body: req.body,
    contentType: req.get("Content-Type"),
  });
  console.log("returning 200");
  res.send({
    status_url: "http://web.post-acceptor.docker:3000/status",
  });
});

app.get("/status", (_, res) => {
  res.send({
    status: "completed",
  });
});

app.get("/fetch", (_, res) => {
  res.send({ hello: "world" });
});

app.get("/api/v2/lti/tools", (_, res) => {
  res.send({ action: "products" });
});

app.get("/api/v2/lti/tools_by_display_group", (_, res) => {
  res.send({ action: "categories" });
});

app.get("/api/v2/lti/filters", (_, res) => {
  res.send({ action: "filters" });
});

app.get("/api/v2/lti/tools/:id", (_, res) => {
  res.send({ action: "product show" });
});

app.get("/", (_, res) => {
  console.log("get");
  res.send("hello world");
});

app.post("/", (req, res) => {
  console.log(req.body);
  res.status(200).send();
});

app.get("/test_file", (_, res) => {
  sleep(31000).then(() => {
    res.send("hello world");
  });
});

const clientId = "10000000000009";
const clientSecret =
  "SpUF8tSqbGynTqJMGECp9T9MMtq306Q2grDAUewO2batgOqrPFLlvRPtGvghseGa";
const redirectUrl = "http://web.post-acceptor.docker/oauth_redirect";
const oobUri = "urn:ietf:wg:oauth:2.0:oob";
const canvasHost = "canvas.docker";

app.get("/oauth_start", (_, res) => {
  // Step 0: provide way to initiate OAuth flow
  res.send(`
    <h3>Start OAuth Flow in New Tab</h3>
    <a target="blank" href="http://web.post-acceptor.docker/oauth_request">Launch</a>
  `);
});

app.get("/oauth_request", (_, res) => {
  // Step 1: initiate by redirecting to /auth
  res.redirect(
    `http://${canvasHost}/login/oauth2/auth?client_id=${clientId}&response_type=code&state=testing&redirect_uri=${encodeURIComponent(
      redirectUrl
    )}`
  );
});

app.get("/oauth_redirect", async (req, res) => {
  // Canvas will sometimes redirect with an error instead of rendering
  if (req.query.error) {
    console.log("Canvas redirected");
    const error = {
      type: req.query.error,
      description: req.query.error_description,
    };
    console.log(error);
    res.status(418).json(error);
    return;
  }

  // Step 2: Canvas redirects to redirect_uri with a code
  // Step 3: Use code and post to /token to acquire token
  try {
    const url = `http://${canvasHost}/login/oauth2/token`;
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify({
        grant_type: "authorization_code",
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUrl,
        code: req.query.code,
      }),
      headers: { "Content-Type": "application/json" },
    });
    const token = await response.json();
    console.log("Canvas rendered");
    console.log({ token, status: response.status });
    res.json({ token, status: response.status });
  } catch (e) {
    console.log(e);
    res.json(e);
  }
});

const sleep = async (ms) => new Promise((resolve) => setTimeout(resolve, ms));

app.get("/bigbluebutton/api/create", async (req, res) => {
  console.log(req.query);
  res.status(200).send();
});

app.get("/bigbluebutton/api/join", async (req, res) => {
  console.log(req.query);
  res.status(200).send();
});

app.get("/bigbluebutton/api/end", async (req, res) => {
  console.log(req.query);
  res.status(200).send();
});

app.listen(3001, () => console.log("app listening on 3001"));
