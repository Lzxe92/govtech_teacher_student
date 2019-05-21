# kaki-buddy-node

a [Sails](https://sailsjs.com) application


### Links

+ [Sails framework documentation](https://sailsjs.com/documentation)
+ [Version notes / upgrading](https://sailsjs.com/documentation/upgrading)
+ [Deployment tips](https://sailsjs.com/documentation/concepts/deployment)
+ [Community support options](https://sailsjs.com/support)
+ [Professional / enterprise options](https://sailsjs.com/studio)

### Coding guideline

* Use strictly waterline query
* split common used codes into helpers (Services in MVCS)
* thin controller, fat model (helpers and models are models)
* use Standalone actions2 for controller

### Database

* [Database Setup Guide](/database/README.md)

### Node_modules
* node_modules are specified under package.json.
* Run the code below to install those modules
  ```
  npm install
  npm install sails-mysql --save
  ```
* However, if required, the nodejs team node_modules can be downloaded from [here](https://1drv.ms/u/s!Ai4y_rBFATUq93aS3i8lExcmwwPO)

### Server Environment
* Node 8.6 and above
* Install [pm2](http://pm2.keymetrics.io/)
* Install Sails JS 1.0 on the system
  ```
  npm install sails@beta -g
  ```
* Start NODE with the following code for development
  ```
  sails lift
  ```

* Start NODE with the following code for production with root privilege
  ```
  pm2 start app.js -x -- --prod
  ```
* Monitor Status Of production server app
  ```
  pm2 list
  ```


### API documentation

* Located at /apidocs/
* Write documentation comments at the indivual controllers
* Describe important data in details. Always assume that the user of the REST API will only read the documetnation, they will not dive into your codes
* To get started,  [apidocjs.com](http://apidocjs.com/#getting-started)
* Use the following command to generate api docs

```
apidoc -i api/controllers -o apidoc/
```
### Bug Report

* [Bug reports](CONTRIBUTING.md#bugs)

