# Teacher-student App

a [Sails](https://sailsjs.com) application

  
## Database Setup Guide
* Database User and Password for development can be set at /config/datastores.js

## Data Dictionary
* [Database Data Dictionary](/database/data_dictionary.docx)
* Read it for in-depth understanding of the database.


### Startup guide
* node_modules are specified under package.json.
1. Run the code below to install those modules
    ```
    npm install
    ```
2. Run the code below to Start the App at Development Mode
    ```
    sails lift
    ```
3. By Default the localhost are hosted at port 1337, eg. http://localhost:1337/api/register 


### Test Guide
* Unit test are located at tests/controllers.
1. Run the code below to run the unit test on the controllers
    ```
    npm test
    ```




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




