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

### Notify additional parameters
```js
  airbrakeMini.notify({
    error: new Error('BOOM'),
    context: { severity: 'warning' }
    params: {}, // put here any field you want
    environment: {}, // put here any field you want
    session: {} // put here any field you want
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

### Filters
You can use this feature to avoid sending an error to the server if it matches some criteria. You can also use this function to enrich the notice with specific informations. You can add as many filters you want. The method is chainable.
```js
  airbrakeMini.addFilter((notice) => {
    // if I return null, the notice gets discarded
    // I can also mutate the notice to add some data
  })
```
Here's some example:
```js
  airbrakeMini
  .addFilter((notice) => {
    const { context } = notice
    if (context.url && context.url.indexOf('file') === 0) {
      return null
    }
  })
```

### Airbrake notice example:
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
      "name": "airbrake-mini-client",
      "version": "0.0.3",
      "url": "https://github.com/tes/airbrake-mini-client"
    }
  },
  "params": {},
  "environment": {},
  "session": {}
}
```