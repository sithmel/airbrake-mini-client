# airbrake-mini-client
This is a lightweight client for airbrake (airbrake.io). The goal of this implementation is to provide a simpler and less invasive logging feature.

### Create an instance
```js
var AirbrakeMini = require('airbrake-mini-client')

var airbrakeMini = AirbrakeMini({ projectId: 12345, projectKey: 'ABCDEFGHILMNO' }) // projectId and projectKey are provided by airbrake
```

### Notify an error
```js
try {
  // critical code
} catch (e) {
  airbrakeMini.notify(e)
}
```
or
```js
Promise.resolve()
  .then(() => {
    // something might go wrong here
  })
  .catch(e => {
    airbrakeMini.notify(e)
  })
```

### Configuration
AirbrakeMini constructor takes the following mandatory parameter:
* projectId
* projectKey

I strongly suggest to provide this optional parameter:
* environment: 'local', 'staging', 'development', 'live'

These other paramenters are mostly for testing:
* timeout: timeout for XMLHttpRequest
* host: it defaults to airbrake host
* reporter: an object providing a "notify" method

### Airbrake payload example:
```json
{
  "id": "",
  "errors": [
    {
      "type": "ReferenceError",
      "message": "testing airbrake, please ignore! Special edition",
      "backtrace": [...]
    }
  ],
  "context": {
    "severity": "error",
    "windowError": true,
    "history": [],
    "userAgent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36",
    "url": "https://www.tes.com/jobs/apply/test/airbrake",
    "rootDirectory": "https://www.tes.com",
    "environment": "production",
    "language": "JavaScript",
    "notifier": {
      "name": "airbrake-js",
      "version": "1.4.3",
      "url": "https://github.com/airbrake/airbrake-js"
    }
  },
  "params": {},
  "environment": {},
  "session": {}
}
```