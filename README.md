###Dependencies
node.js
###Getting Started
clone this repo
```sh
workspace $ git clone <path to repo>
```
install dependencies
```sh
workspace/roambi.test $ npm install
```
###Usage
```sh
node run -p <platform> <tests>
```
where
*platform* is one of
 - ios
 - android <default>
 - win
 - web

and tests is the path to a file (or files). If given a directory, all of the tests in the directory (and subdirectories) will be run.

#####Options
  --help, -h      Show help                                                     
  --config        config.json file to use saved settings
                                                      [default: "./config.json"]
  --platform, -p  platform name. One of <android|ios|win|web>         [required]

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
```sh
$  node run -p win suites/example/example*

   example 2.win
     ✓ should example again 
     ✓ should example again again 


   2 passing (16ms)
```
To add another platform filter. Update the platforms variable in run.js
```sh
var platforms=["android", "ios", "win", "web", "bb"],
```
```sh
describe.bb("blackberry tests", function runBBTests() {
	...
});
```