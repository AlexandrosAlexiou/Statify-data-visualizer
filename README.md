# Statify
Developed for the Advanced Topics of Database Technology and Applications course [@cs.uoi.gr](http://www.cs.uoi.gr/en/index.php?menu=m1)

We live in an age where we have more and more data around us, and it is becoming more and more difficult to use them. Simple queries are not enough anymore. Users must also be presented with interesting properties within the data.
To be able to answer interesting questions and recognize patterns, we need to organize the data into a ( MySQL ) database and build an application around them!

## Application UI

The application UI is built using [Angular Material](https://material.angular.io/guide/getting-started).<br/>
The charts were rendered using the [ngx-charts](https://github.com/swimlane/ngx-charts) framework.

## Application Diagram
![Application Diagram](https://github.com/AlexandrosAlexiou/Statify/blob/master/src/assets/Statify-app-diagram.jpg)

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`.<br/> The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component.<br/> You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project.<br/> The build artifacts will be stored in the `dist/` directory.<br/> Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

<br/>


# [Node.js](https://nodejs.org/en/download/) REST API

The API connects to the database and serves the data to our Angular app. <br/>

Run `node server.js` to start the service.

## [npm](https://www.npmjs.com/) packages used
- [mysql](https://www.npmjs.com/package/mysql)

- [cors](https://www.npmjs.com/package/cors)

- [express](https://www.npmjs.com/package/express) ( official website [here](https://expressjs.com/) )

- [moment](https://momentjs.com) (used in the logger middleware function)

<br/>

# Python scripts

## The data from the [World Bank](https://data.worldbank.org/country) were transformed accordingly to comply with the Database schema.
Python makes things easier. Data loading, data configuration and database backup becomes a matter of seconds.<br/>
Furthermore, adding more data to the Database later on is a few lines of code away. <br/>
The app is scalable, the data selection process is automatically updated to comply with data additions to the Database. ( countries, indicators etc.)

## ETL process diagrams
![Transform](https://github.com/AlexandrosAlexiou/Statify/blob/master/src/assets/Transform.jpg) 

<br/>

![Load](https://github.com/AlexandrosAlexiou/Statify/blob/master/src/assets/load.jpg) 

<br/>

![Backup](https://github.com/AlexandrosAlexiou/Statify/blob/master/src/assets/backup.jpg)

<br/>

## Python packages used

- [PyMySQL](https://pypi.org/project/PyMySQL/)
- [openpyxl](https://pypi.org/project/openpyxl/)
- [csv](https://docs.python.org/3/library/csv.html)
