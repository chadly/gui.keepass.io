#Keepass.io GUI [![wercker status](https://app.wercker.com/status/5c7b6c1724af8c1405dbedfe2b0d15ff "wercker status")](https://app.wercker.com/project/bykey/5c7b6c1724af8c1405dbedfe2b0d15ff)

> A simple and elegant readonly web view of your Keepass database.

Note: this project is a work-in-progress.

###Why would I want this?

Ever been on a strange computer and needed to access your [Keepass](http://keepass.info/) database? Maybe you are using a public computer and need to login to some site quickly or maybe you just got one of those fancy new Chromebooks and you can't install the Keepass app? Stop, don't go running to LastPass, there is a better way! The Keepass.io web GUI gives you the best of both worlds. Keep the security of your local database with the convenience of being able to access your database in a readonly fashion from any computer.

##How to run

From the project directory, install dependencies using npm:

```bash
npm install
```

Note: you will need [bower](http://bower.io/) and [grunt-cli](http://gruntjs.com/getting-started) installed to install web dependencies. Install them if you don't already have them.

Build the web assets and run the server:
```bash
npm start
```

You can then navigate to `localhost:1337` to use the app.

###Configuring the Application

You can create a `config.json` file in the `src` directory to configure the application. The default configuration is below:

```json
{
	"port": 1337,
	"databasePath": "databases",
	"debug": false
}
```

###Running the tests

There is a suite of [mocha](http://visionmedia.github.io/mocha/) tests that run as part of the build. Run them locally via:

```bash
npm test
```

This will run the tests in a headless browser via [grunt-mocha](https://github.com/kmiyashiro/grunt-mocha). If you want to run them in a real browser, just open `src/public/test.html` in your favorite browser and you can run/debug the tests.

-------------------------------------------------------

Found this project useful? Help support development: `17wS7cQARUrb67Gm7BweApNGKToNbxkMrg`