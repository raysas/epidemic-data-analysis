# epidemic-data-analysis
Big Data and Data Integration project - S9 GENIOMHE   

**Report on**: [`https://raysas.github.io/epidemic-data-analysis/`](https://raysas.github.io/epidemic-data-analysis/) pages from github: [`https://github.com/raysas/epidemic-data-analysis`](https://github.com/raysas/epidemic-data-analysis). Provided a web dashboard to visualize the results of the analysis (could be found on the github link)


**Tools used**:

[![MongoDB](https://img.shields.io/badge/MongoDB-%2334A853?logo=mongodb&logoColor=white)](https://www.mongodb.com/) [![Hadoop](https://img.shields.io/badge/Hadoop-%23EA4335?logo=apachehadoop&logoColor=white)](https://hadoop.apache.org/) [![PySpark](https://img.shields.io/badge/PySpark-%23f58220?logo=apache-spark&logoColor=white)](https://spark.apache.org/) [![Plotly/Dash](https://img.shields.io/badge/Dash-%23086FA6?logo=plotly&logoColor=white)](https://plotly.com/dash/) [![Python](https://img.shields.io/badge/Python-%233776AB?logo=python&logoColor=white)](https://www.python.org/) [![Javascript](https://img.shields.io/badge/JavaScript-%23F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript) [![Docker](https://img.shields.io/badge/Docker-%23007ACC?logo=docker&logoColor=white)](https://www.docker.com/) [![Git](https://img.shields.io/badge/Git-%23F05032?logo=git&logoColor=white)](https://git-scm.com/)

## Table of Contents

- [epidemic-data-analysis](#epidemic-data-analysis)
  - [Table of Contents](#table-of-contents)
  - [Project Overview](#project-overview)
  - [Environment Setup](#environment-setup)
  - [MongoDB](#mongodb)
    - [1. setup](#1-setup)
    - [2. data preperation](#2-data-preperation)
    - [3. Querying!](#3-querying)
      - [3.1 Query 1: Continent stats](#31-query-1-continent-stats)
      - [3.2 Query 2: Countries stats](#32-query-2-countries-stats)
      - [3.3 Query 3: USA daily stats](#33-query-3-usa-daily-stats)
      - [3.4 Query 4: worldwide daily stats](#34-query-4-worldwide-daily-stats)
      - [3.5 Query 5: cases/death weekly analysis](#35-query-5-casesdeath-weekly-analysis)
      - [3.6 Query 6: collect the 14-day incidence rate worldwide per day for these 2 dates, group by country](#36-query-6-collect-the-14-day-incidence-rate-worldwide-per-day-for-these-2-dates-group-by-country)
  - [Hadoop](#hadoop)
    - [1. setup](#1-setup-1)
    - [2. data preperation](#2-data-preperation-1)
    - [3. Queries](#3-queries)
      - [3.1 Query 1: continent stat](#31-query-1-continent-stat)
      - [3.2 Query 2: country stats](#32-query-2-country-stats)
      - [3.3 Query 3: USA daily stats](#33-query-3-usa-daily-stats-1)
      - [3.4 Query 4: worldwide daily stats](#34-query-4-worldwide-daily-stats-1)
      - [3.5 Query 5:](#35-query-5)
      - [3.6 Query 6:](#36-query-6)
  

## Project Overview

<!-- **Web dashboard link:** 

[]() -->

<!-- **Diagram**:

![]() -->

The project aims to use big data tools to retrieve relevant information and perform analysis on a large dataset, the data in question is coming from the [European Centre for Disease Prevention and Control](https://www.ecdc.europa.eu/en/publications-data/download-todays-data-geographic-distribution-covid-19-cases-worldwide) and contains daily records of covid-19 cases and deaths worldwide.

The main steps of the project are:

* Query and processing the data using **MongoDB** and **Hadoop MapReduce** to retrieve relevant statistics
* Analyze results and visualize them using python
* Compare performance of the two tools

*Choice of queries*: my aim here was to retrieve the most diverse set of statistics possible from the, in a qay that no 2 documents can be extracted in the same manner, covering as many aggregations as possible. Secondly, focused on getting a useful type of information that is relevant to pandamic analysis, such as total cases/deaths per country, daily cases worldwide, incidence rates, etc. And finally, tried to diversify the set of visualization used to represent the data, to highlight the possibilities of dealing with big data, even if the dataset is not that large (in terms of features`)

This project structure was designed to make it fully accessible and reprodicible, for that providing a webdashboard, the github repository and the container used here pushed to docker hub.

**Directory Structure:**

```text
https://github.com/raysas/epidemic-data-analysis/
├── README.md           # -- report file
├── TODO.md             # -- todo list
├── app                 # -- dash web dashboard code
├── assets              # -- images and screenshots
├── code                # -- data processing and viz code
├── data                # -- input data files
├── output              # -- output files and documents
├── requirements.txt    # -- python dependencies for viz and dashboard
└── run.py              # -- script to run the web dashboard
```


**For the code:**

Kindly find attached the following directories and subdirectories: 

```
code/
code/
├── notebooks                   # -- jupyter notebooks for data visualization 
│   ├── continent_stats.ipynb
│   ├── countries_stats.ipynb
│   ├── daily_stats.ipynb
│   ├── time_series.ipynb
│   └── total_per_country.ipynb
└── scripts                   # -- scripts for mongodb and hadoop 
    ├── extract_data.sh       # -- commands used to retrieve online data
    ├── mongodb.js            # -- mongodb queries script
    ├── mappers               # -- hadoop mappers
    │   ├── USA_daily_stats.py
    │   ├── continent_stats.py
    │   ├── country_stats.py
    │   ├── start_end_date_incidence_stats.py
    │   ├── weekly_stats.py
    │   └── worldwide_daily_stats.py
    ├── reducers              # -- hadoop reducers 
    │   ├── USA_daily_stats.py
    │   ├── continent_stats.py
    │   ├── country_stats.py
    │   ├── start_end_date_incidence_stats.py
    │   ├── weekly_stats.py
    │   └── worldwide_daily_stats.py
    ├── move_files.sh     # -- helper script to move files into docker containers
    └── split_json.sh     # -- helper script to split large json files
```

Also attached is the output directory containing main documents:

```
output/
├── hadoop
│   ├── USA_daily_stats.csv
│   ├── continent_stats.csv
│   ├── country_stats.csv
│   ├── start_end_date_incidence_stats.csv
│   ├── weekly_stats.csv
│   └── worldwide_daily_stats.csv
└── mongodb
    ├── USA_daily_stats.json
    ├── continent_stats.json
    ├── country_stats.json
    ├── query_performance_stats.json
    ├── start_end_date_incidence_stats.json
    ├── weekly_stats.json
    └── worldwide_daily_stats.json
``` 

## Environment Setup

For mongodb, used the `mongo:latest` docker image, for hadoop, used the `prasanthj/docker-hadoop` docker image, you can pull the images corresponding to this project's container from my Docker Hub repository: [raysas/bigdata-geniomhe](https://hub.docker.com/u/raysas).


## MongoDB


> [!NOTE]  
> All mongodb commands here can be found in a javascript script in code/scripts/mongodb.js

### 1. setup
**Starting by setting up a mongodb container using the pulled image and downloading the dataset**
   
```bash
#docker pull mongo #-- pull the image if not there
docker run -d --name bigdata_mongodb -p 27017-27019:27017-27019 mongo:latest
```


### 2. data preperation 

**Importing the datasets into the mongodb container, then using `mongoimport` command**

On my local machine:
1. will download the publically available covid-19 dataset:
    ```bash
    # -- installing curl if not there
    apt-get update && apt-get install -y curl

    # -- downloading the dataset first 
    curl https://opendata.ecdc.europa.eu/covid19/casedistribution/json/data.json -o data/covid.json
    ```

2. will split the data into 2 files
    _p.s.  wrote a script to split the json into 2 files as the file is 26Mb surpassing the 16Mb limit of mongodb import (you can find it in `code/scripts/split_json.sh`)_

    ```bash
    ./code/scripts/split_json.sh data/covid.json 2 
    ls data/
    ```
    Now will have `data/covid_part_1.json` and `data/covid_part_2.json` files each less than 16Mb
3. copy the files to docker container
    ```bash
    docker cp data/covid_part_1.json bigdata_mongodb:/data/covid_part_1.json
    docker cp data/covid_part_2.json bigdata_mongodb:/data/covid_part_2.json
    ```


_entering the container now_
```bash
docker exec -it bigdata_mongodb bash

# -- importing the data into mongodb
mongoimport --db covid_db --collection worldwide_cases --file data/covid_part_1.json --jsonArray
mongoimport --db covid_db --collection worldwide_cases --file data/covid_part_2.json --jsonArray
```

<!-- ![mongoimport success](./assets/ -->


### 3. Querying!



_entering mongo shell now_
```bash
mongosh
use covid_db
show collections
```

<!-- ![mongosh](image.png) -->

<!-- general data queries to explor the data we have -->

**General Data Queries**

```js
// -- count the number of documents in the collection
db.worldwide_cases.countDocuments()
// 61900

// -- find one document to see the structure
db.worldwide_cases.findOne({})
```
```json
{
  _id: ObjectId('690f33b777a56eeaf189a2dd'),
  dateRep: '03/12/2020',
  day: '03',
  month: '12',
  year: '2020',
  cases: 202,
  deaths: 19,
  countriesAndTerritories: 'Afghanistan',
  geoId: 'AF',
  countryterritoryCode: 'AFG',
  popData2019: 38041757,
  continentExp: 'Asia',
  'Cumulative_number_for_14_days_of_COVID-19_cases_per_100000': '7.53645527'
}
```
```js
// -- number of countries enlisted
db.worldwide_cases.distinct("countriesAndTerritories").length
// 214
```

We notice that we can perform soem preprocessing on the data:  

* the `Cumulative_number_for_14_days_of_COVID-19_cases_per_100000` field is a string, better to convert it into a double
* date is in `dd/mm/yyyy` format, might be better to convert it into a date object for easier querying and processing later on (step2)

```js
db.worldwide_cases.updateMany({}, 
  [{ $set: 
    { 
      "Cumulative_number_for_14_days_of_COVID-19_cases_per_100000": 
          { $convert: {
            input: "$Cumulative_number_for_14_days_of_COVID-19_cases_per_100000",
            to: "double",
            onError: null,
            onNull: null
          }
    } 
} } ]);

db.worldwide_cases.updateMany(
  {},[
    { 
      $set: { 
        date: {
          $dateFromString: { dateString: "$dateRep", format: "%d/%m/%Y" }
        }
      }}
]);
```

This helper function is used at each step to save the results of the queries into json files:

```js
// -- helper function to save a json file from a cursor
function save_json_file(cursor, filename) {
    var array_data = []
    while (cursor.hasNext()) {
        array_data.push(cursor.next())
    }
    var file_data = JSON.stringify(array_data, null, 2)
    const fs = require('fs');
    fs.writeFileSync(filename, file_data);
    print(`-- json file saved in: ${filename}`)
}
```

#### 3.1 Query 1: Continent stats

**about**: collecting metrics across continents such as total cases, total deaths, number of countries and average 14-day incidence rate  
**how?**: using mongodb aggregation framework, will first group by country to get total cases/deaths and average incidence rate per country, then group by continent to get the final stats. Aggregation for cases, deaths and number of countries is done using `$sum` operator, while average incidence rate is done using `$avg` operator  
**aim**: get a high level overview of the pandemic situation across continents, first larger scale look at the data distribution

> whats new: performing 2 consecutive group stages to get the desired result

```js
// 0) data distribution over continents
continent_stats=db.worldwide_cases.aggregate([
  {
    $group: {
      _id: "$countriesAndTerritories",
      continent: { $first: "$continentExp" },
      avg14DayIncidence: { $avg: "$Cumulative_number_for_14_days_of_COVID-19_cases_per_100000" },
      totalCases: { $sum: "$cases" },
      totalDeaths: { $sum: "$deaths" }
    }
  },
  { $group: {
      _id: "$continent",
      totalCases: { $sum: "$totalCases" },
      totalDeaths: { $sum: "$totalDeaths" },
      numberOfCountries: { $sum: 1 },
      avg14DayIncidence: { $avg: "$avg14DayIncidence" }
    }
  },
  { $project: {
      continent: "$_id",
      totalCases: 1,
      totalDeaths: 1,
      numberOfCountries: 1,
      avg14DayIncidence: 1
    }
  },
  { $sort: { totalCases: -1 } }
])
```

The result will be a set of documents having these fields:  

- `_id`: continent name
- `totalCases`: total number of cases in the continent
- `totalDeaths`: total number of deaths in the continent
- `numberOfCountries`: number of countries in the continent
- `avg14DayIncidence`: average 14-day incidence rate across countries in the continent


![MongoDB: Stacked bar plot showing distribution accross continents](./figures/mongodb/mongodb_continent_dist.png)

#### 3.2 Query 2: Countries stats

**about**: collecting metrics per country such as total cases, total deaths, population and percentages of cases and deaths relative to population  
**how?**: using mongodb aggregation, will group by country to get total cases/deaths and population, then calculate percentages using `$addFields` stage  
**aim**: get a detailed overview of the pandemic situation per country

> whats new: performing normalization of cases and deaths by population size getting use of 2 fields to create a 3rd one, good to make them comparable accross countries (especially for heatmap viz)

```js
// 1) map per country
country_stats = db.worldwide_cases.aggregate([
  {
    $group: {
      _id: "$countriesAndTerritories",
      geoId: { $first: "$geoId" },
      totalCases: { $sum: "$cases" },
      totalDeaths: { $sum: "$deaths" },
      popData2019: { $first: { $toInt: "$popData2019" }},
      avg14DayIncidence: { $avg: "$Cumulative_number_for_14_days_of_COVID-19_cases_per_100000"
    }
    }
  },
  {
    $addFields: {
      percTotalCases: { $multiply: [ { $divide: ["$totalCases", "$popData2019"] }, 100 ] },
      percTotalDeaths: { $multiply: [ { $divide: ["$totalDeaths", "$popData2019"] }, 100 ] },
    }
  }
])
```

Result:

- `_id`: country name
- `geoId`: country geo id
- `totalCases`: total number of cases in the country
- `totalDeaths`: total number of deaths in the country
- `popData2019`: country population in 2019
- `percTotalCases`: percentage of total cases relative to population
- `percTotalDeaths`: percentage of total deaths relative to population
- `avg14DayIncidence`: average 14-day incidence rate in the country

![MongoDB: map showing percentage of cases relative to population per country](./figures/mongodb/mongodb_countries_casesc.png)

![MongoDB: map showing percentage of deaths relative to population per country](./figures/mongodb/mongodb_countries_deathc.png)

![MongoDB: map showing average 14-day incidence rate per country](./figures/mongodb/mongodb_countries_incidence.png)

_Here used the pycountry library in python to convert country names to map geoId to their corresponding 3-letter country codes (for plotly map visualization)_
  

#### 3.3 Query 3: USA daily stats


**about**: collecting daily total cases and deaths for the USA, along with cumulative cases and deaths over time
**how?**: using mongodb aggregation, will first filter for USA records, then group by date to get total cases/deaths per day, finally use `$setWindowFields` stage to calculate cumulative cases/deaths over time
**aim**: get a time series of the pandemic situation in the USA, one of the most affected countries

> whats new: using `$setWindowFields` stage to calculate cumulative sums over time, useful for time series analysis. Also needing to match first before grouping (only usa)

```js
db.worldwide_cases.find({ geoId: "US" }).limit(1)
country_daily_stats=db.worldwide_cases.aggregate([
  {
    $match: { geoId: "US" }
  },
  {
    $group: {
      _id: "$dateRep",
      year: { $first: { $toInt: "$year" } },
      month: { $first: { $toInt: "$month" } },
      day: { $first: { $toInt: "$day" } },
      totalCases: { $sum: "$cases" },
      totalDeaths: { $sum: "$deaths" }
    }
  },
  {
    $sort: { year: 1, month: 1, day: 1 }
  },
  {
    $setWindowFields: {
      sortBy: { year: 1, month: 1, day: 1 },
      output: {
        cumulativeCases: {
          $sum: "$totalCases",
          window: { documents: ["unbounded", "current"] }
        },
        cumulativeDeaths: {
          $sum: "$totalDeaths",
          window: { documents: ["unbounded", "current"] }
        }
      }
    }
  },  
])
```

<!-- 
 docker start -i a5c4e6e4ce25
hdfs dfs -cat covid.csv | ../mappers/country_stats.py | sort | ../reducers/country_stats.py 

:/exercises# head -n 1 ../covid.csv 
dateRep,day,month,year,cases,deaths,countriesAndTerritories,geoId,countryterritoryCode,popData2019,continentExp,Cumulative_number_for_14_days_of_COVID-19_cases_per_100000
root@a5c4e6e4ce25:/exercises# hadoop jar $HADOOP_COMMON_HOME/share/hadoop/tools/lib/hadoop-streaming-2.7.2.jar -files  ../mappers/country_stats.py,../reducers/country_stats.py -mapper country_stats.py -reducer country_stats.py   -input covid.csv   -output t14

s# hadoop jar $HADOOP_COMMON_HOME/share/hadoop/tools/lib/hadoop-streaming-2.7.2.jar   -files ex4/mapper.py,ex4/reducer.py   -mapper mapper.py   -reducer reducer.py   -input covid.csv   -output t11
 -->

result: 

- `_id`: date (day)
- `year`: year
- `month`: month
- `day`: day
- `totalCases`: total number of cases in the USA on that day
- `totalDeaths`: total number of deaths in the USA on that day
- `cumulativeCases`: cumulative number of cases in the USA up to that day
- `cumulativeDeaths`: cumulative number of deaths in the USA up to that day


![MongoDB: time series and barplot+line combinesd plots showing in the first row the daily cases and deaths in the USA, and in the second row the cumulative cases and deaths in the USA](./figures/mongodb/mongodb_usa_daily_stats.png)

_p.s., could not put both cases and deaths in the same plot as they have very different scales, so had to split them into 2 plots each_

#### 3.4 Query 4: worldwide daily stats

**about**: collecting daily total cases and deaths worldwide, along with cumulative cases and deaths over time  
**how?**: using mongodb aggregation, will group by date to get total cases/deaths per day, then use `$setWindowFields` stage to calculate cumulative cases/deaths over time   
**aim**: get a time series of the pandemic situation worldwide, to see the overall trend of the pandemic over time, good for first glance analysis


```js

// 3) total cases/deaths per day worldwide (can group by date)
worldwide_daily_stats=db.worldwide_cases.aggregate([
  {
    $group: {
      _id: "$dateRep",
      year: { $first: { $toInt: "$year" } },
      month: { $first: { $toInt: "$month" } },
      day: { $first: { $toInt: "$day" } },
      totalCases: { $sum: "$cases" },
      totalDeaths: { $sum: "$deaths" }
    }
  },
  {
    $sort: { year: 1, month: 1, day: 1 }
  },
  {
    $setWindowFields: {
      sortBy: { year: 1, month: 1, day: 1 },
      output: {
        cumulativeCases: {
          $sum: "$totalCases",
          window: { documents: ["unbounded", "current"] }
        },
        cumulativeDeaths: {
          $sum: "$totalDeaths",
          window: { documents: ["unbounded", "current"] }
        }}
  }
  }
])
```

result:

- `_id`: date (day)
- `year`: year
- `month`: month
- `day`: day
- `totalCases`: total number of cases worldwide on that day
- `totalDeaths`: total number of deaths worldwide on that day
- `cumulativeCases`: cumulative number of cases worldwide up to that day
- `cumulativeDeaths`: cumulative number of deaths worldwide up to that day


![MongoDB: time series and barplot+line combinesd plots showing in the first row the daily cases and deaths worldwide, and in the second row the cumulative cases and deaths worldwide](./figures/mongodb/mongodb_worldwide_daily_stats.png)

#### 3.5 Query 5: cases/death weekly analysis

**about**: tracking weekly total cases and deaths worldwide, along with average 14-day incidence rate and correlation estimate between cases and deaths  
**how?**: using mongodb aggregation, will group by ISO week and year to get weekly total cases/deaths, average incidence rate, and correlation estimate using the formula: corr(cases, deaths) = E[cases*deaths] / (E[cases] * E[deaths])  
**aim**: get a weekly overview of the pandemic situation worldwide, also, what is interesting is something called *case fatality analysis* which aims to find correlation between the number of cases and the number of deaths, this can help in predicting the number of deaths based on the number of cases, useful for health authorities to plan resources accordingly

> whats new: grouping by ISO week and year using `$isoWeek` and `$isoWeekYear` operators, also calculating correlation estimate using aggregation operators and some integration of complex formulae (was a bit hard to manage!)

```js
// 4) cases/death correlation analysis
weekly_stats=db.worldwide_cases.aggregate([
  {
    $group: {
      _id: {
        year: { $isoWeekYear: "$date" },
        week: { $isoWeek: "$date" }
      },
      weeklyCases: { $sum: "$cases" },
      weeklyDeaths: { $sum: "$deaths" },
      weekly14DayIncidence: { $avg: "$Cumulative_number_for_14_days_of_COVID-19_cases_per_100000" },
      corr: { $avg: { $multiply: ["$cases", "$deaths"] }  }
    }
  },
  {
    $project: {
      year: "$_id.year",
      week: "$_id.week",
      weeklyCases: 1,
      weeklyDeaths: 1,
      weekly14DayIncidence: 1,
      correlationEstimate: {
        $cond: [
          { $eq: [{ $multiply: ["$weeklyCases", "$weeklyDeaths"] }, 0] },
          null,
          { $divide: ["$corr", { $multiply: ["$weeklyCases", "$weeklyDeaths"] }] }
        ]
      },
      _id: 0
    }
  },
  { $sort: { year: 1, week: 1 } }
])
```

result:

- `year`: ISO week year
- `week`: ISO week number
- `weeklyCases`: total number of cases worldwide in that week
- `weeklyDeaths`: total number of deaths worldwide in that week
- `weekly14DayIncidence`: average 14-day incidence rate worldwide in that week
- `correlationEstimate`: estimate of correlation between cases and deaths in that week

#### 3.6 Query 6: collect the 14-day incidence rate worldwide per day for these 2 dates, group by country

**about**: collecting the 14-day incidence rate worldwide per day for the earliest and latest dates in the dataset, grouped by country  
**how?**: using mongodb queries to find the earliest and latest dates, then colelcting the incidence rates for those dates across all entries (one entry per country in a day actually)  
**aim**: get a snapshot of the incidence rates at the start and end of the dataset, useful for comparing how the situation has evolved over time across countries. It's actually interesting if one wants to test significance of change between 2 dates, while this might not be ideal in this dataset (doesnt span over a long period of time), the idea od performing statistical analysis still holds (boxplots and comparisons)

```js
// 5) collect the 14-day incidence rate worldwide per day for these 2 dates, group by country
earliest_date=db.worldwide_cases.find().sort({ date: 1 }).limit(1).next()
latest_date=db.worldwide_cases.find().sort({ date: -1 }).limit(1).next()

start_end_date_incidence_stats=db.worldwide_cases.find(
  { dateRep: { $in: [ earliest_date.dateRep, latest_date.dateRep ] } },
  { countriesAndTerritories: 1, geoId: 1, dateRep: 1,
    "Cumulative_number_for_14_days_of_COVID-19_cases_per_100000": 1,
     _id: 0 
  }
)
```

result:

- `countriesAndTerritories`: country name
- `geoId`: country geo id
- `dateRep`: date (day)
- `Cumulative_number_for_14_days_of_COVID-19_cases_per_100000`: 14-day incidence rate for that country on that date




## Hadoop

### 1. setup

En

```bash
docker run -it --name bigdata_hadoop prasanthj/docker-hadoop /etc/bootstrap.sh -bash
# docker start -i bigdata_hadoop
```
<!-- docker cp code/scripts/reducers/ bigdata_hadoop:/
 docker cp code/scripts/mappers bigdata_hadoop:/
 -->

_now inside the container_
```bash
jps
export PATH=$PATH:$HADOOP_PREFIX/bin >> ~/.bashrc
source ~/.bashrc
hadoop version
```

### 2. data preperation

```bash
curl https://opendata.ecdc.europa.eu/covid19/casedistribution/csv/data.csv -o data/covid.csv
wc -l data/covid.csv 
# 61901 covid.csv
```
_the 1 is for the extra header file: same as the json data taken in mongodb_

```bash
hdfs dfs -put data/covid.csv covid.csv
mkdir output/
mkdir logs/ # -- to save logs of hadoop jobs
```


### 3. Queries


#### 3.1 Query 1: continent stat

<!-- ```bash
# testing the mappers reducers locally first
python3 mappers/continent_stat.py < data/covid.csv | sort | python3 reducers/continent_stat.py 
``` -->

```bash
hadoop jar $HADOOP_COMMON_HOME/share/hadoop/tools/lib/hadoop-streaming-2.7.2.jar \
-D mapreduce.job.name="continent_stats" \
-files mappers/continent_stats_mapper.py,reducers/continent_stats_reducer.py \
-input covid.csv \
-output continent_stats/ > logs/continent_stats.log 2>&1
```

```bash
hdfs dfs -cat continent_stats/*  > output/continent_stats.csv
```

#### 3.2 Query 2: country stats

```bash
hadoop jar $HADOOP_COMMON_HOME/share/hadoop/tools/lib/hadoop-streaming-2.7.2.jar \
-D mapreduce.job.name="country_stats" \
-files mappers/country_stats_mapper.py,reducers/country_stats_reducer.py \
-input covid.csv \
-output country_stats/ > logs/country_stats.log 2>&1
```

```bash
hdfs dfs -cat country_stats/*  > output/country_stats.csv
```

#### 3.3 Query 3: USA daily stats

```bash
# hdfs dfs -rm -r USA_daily_stats/
hadoop jar $HADOOP_COMMON_HOME/share/hadoop/tools/lib/hadoop-streaming-2.7.2.jar \
-D mapreduce.job.name="usa_daily_stats" \
-files mappers/USA_daily_stats_mapper.py,reducers/USA_daily_stats_reducer.py  \
-mapper USA_daily_stats_mapper.py \
-reducer USA_daily_stats_reducer.py \
-input covid.csv \
-output USA_daily_stats/ > logs/USA_daily_stats.log 2>&1
```

```bash
hdfs dfs -cat USA_daily_stats3/* | awk -F '\t' '{print $2}' > output/USA_daily_stats.csv
```

#### 3.4 Query 4: worldwide daily stats

```bash
hadoop jar $HADOOP_COMMON_HOME/share/hadoop/tools/lib/hadoop-streaming-2.7.2.jar \
-D mapreduce.job.name="worldwide_daily_stats" \
-files mappers/worldwide_daily_stats_mapper.py,reducers/worldwide_daily_stats_reducer.py \
-mapper worldwide_daily_stats_mapper.py \
-reducer worldwide_daily_stats_reducer.py \
-input covid.csv \
-output worldwide_daily_stats > logs/worldwide_daily_stats.log 2>&1
``` 

```bash
hdfs dfs -cat worldwide_daily_stats/*  > output/worldwide_daily_stats.csv
```

#### 3.5 Query 5: 

```bash
hadoop jar $HADOOP_COMMON_HOME/share/hadoop/tools/lib/hadoop-streaming-2.7.2.jar \
-D mapreduce.job.name="weekly_stats" \
-files mappers/weekly_stats_mapper.py,reducers/weekly_stats_reducer.py \
-mapper weekly_stats_mapper.py \
-reducer weekly_stats_reducer.py \
-input covid.csv \
-output weekly_stats/ > logs/weekly_stats.log 2>&1
```

```bash
hdfs dfs -cat weekly_stats/*  > output/weekly_stats.csv
```

#### 3.6 Query 6:

```bash
hadoop jar $HADOOP_COMMON_HOME/share/hadoop/tools/lib/hadoop-streaming-2.7.2.jar \
-D mapreduce.job.name="start_end_date_incidence_stats" \
-files mappers/start_end_date_incidence_stats_mapper.py,reducers/start_end_date_incidence_stats_reducer.py \
-mapper start_end_date_incidence_stats_mapper.py \
-reducer start_end_date_incidence_stats_reducer.py \
-input covid.csv \
-output start_end_date_incidence_stats/ > logs/start_end_date_incidence_stats.log 2>&1
```

```bash
hdfs dfs -cat start_end_date_incidence_stats/*  > output/start_end_date_incidence_stats.csv
```