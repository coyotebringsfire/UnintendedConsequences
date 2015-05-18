#UnintendedConsequences
Test superstructure for running functional tests using MochaJS. The idea is to collect useful utilities into a single package. 
Gibraltor uses the _mocha-multi_ reporter to show test progress to the user via the _spec_ reporter and also uses the _mongoreporter_ reporter to save the results to a mongo db. 

There is support for defining platforms by which test suites can be filtered; Out of the box, there are android and ios platforms defined.
###Dependencies
node.js
###Getting Started
clone this repo
```sh
workspace $ git clone <path to repo>
```
install dependencies
```sh
workspace/UnintendedConsequences $ npm install
```
###Usage
```sh
node run -p <platform> <tests>
```
where
*platform* is one of
- ios
- android <default>

and tests is the path to a file (or files). If given a directory, all of the tests in the directory (and subdirectories) will be run.

#####Options
  --help, -h      Show help                                                     
  --config        config.json file to use saved settings
                                                      [default: "./config.json"]
  --platform, -p  platform name. One of <android|ios>         [required]
  --db.port       db port                                                       
  --db.host       db host 
  --db.login      db username                                                   
  --db.password   db password  

```sh
$  node run -p ios suites

   example 2.ios
     ✓ should example again 
     ✓ should example again again 

   2 passing (17ms)
```
```sh
$  node run -p android suites/example/example.js

   example
     ✓ should example 

   example.android
     ✓ should example 
     ✓ should example 2 


   3 passing (17ms)
```
To add another platform filter. Update the platforms variable in run.js
```sh
var platforms=["android", "ios", "bb"]
```
```sh
describe.bb("blackberry tests", function runBBTests() {
	...
});
```

#####Persisting test results
There is out of the box support for saving test results to MongoDB. You can specify and --db.host, --db.port, --db.login, --db.password on the command line, or edit config.json and add a db key. The arguments are saved in config.json if given on the command line
```sh
{
  "platform": "android",
  "db": {
    "host":"localhost",
    "port":27017,
    "login":"dbuser",
    "password":"dbpassword"
  }
}
```