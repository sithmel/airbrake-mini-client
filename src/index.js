var Reporter = require('./reporter')

function AirbrakeMini (config) {
  if (!(this instanceof AirbrakeMini)) {
    return new AirbrakeMini(config)
  }
  this.reporter = config.reporter || new Reporter(config)
}

AirbrakeMini.prototype.notify = function notify (err) {
  if (err instanceof Error) {

  }
  this.reporter.notify()
}

module.export = AirbrakeMini
// {
//   "id": "",
//   "errors": [
//     {
//       "type": "ReferenceError",
//       "message": "testing airbrake, please ignore! Special edition",
//       "backtrace": []
//     }
//   ],
//   "context": {
//     "severity": "error",
//     "windowError": true,
//     "history": [],
//     "userAgent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36",
//     "url": "https://www.tes.com/jobs/apply/test/airbrake",
//     "rootDirectory": "https://www.tes.com",
//     "environment": "production",
//     "language": "JavaScript",
//     "notifier": {
//       "name": "airbrake-js",
//       "version": "1.4.3",
//       "url": "https://github.com/airbrake/airbrake-js"
//     }
//   },
//   "params": {},
//   "environment": {},
//   "session": {}
// }
