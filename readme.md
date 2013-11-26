#Keepass.io GUI

##A Web GUI for Keepass

A simple and elegant readonly web view of your Keepass database.

###Why would I want this?

Ever been on a strange computer and needed to access your [Keepass](http://keepass.info/) database? Maybe you are using a public computer and need to login to some site quickly or maybe you just got one of those fancy new Chromebooks and you can't install the Keepass app? Stop, don't go running to LastPass, there is a better way! The Keepass.io web GUI gives you the best of both worlds. Keep the security of your local database with the convenience of being able to access your database in a readonly fashion from any computer.

###How to run

From the project directory, install dependencies using npm and bower:

```bash
npm install
bower install
```

Note: you will need [bower](http://bower.io/) and [grunt-cli](http://gruntjs.com/getting-started) installed to install web dependencies. Install them if you don't already have them.

Build the web assets and run the server:
```bash
npm start
```

You can then navigate to `localhost:1337` to use the app. Modify the config.js in the root to suit your needs.