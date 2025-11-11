# epidemic-data-analysis
Big Data and Data Integration project - S9 GENIOMHE   

**Report on**: [`https://raysas.github.io/epidemic-data-analysis/`](https://raysas.github.io/epidemic-data-analysis/) pages from github: [`https://github.com/raysas/epidemic-data-analysis`](https://github.com/raysas/epidemic-data-analysis). Provided a web dashboard to visualize the results of the analysis (could be found on the github link)


**Tools used**:

[![MongoDB](https://img.shields.io/badge/MongoDB-%2334A853?logo=mongodb&logoColor=white)](https://www.mongodb.com/) [![Hadoop](https://img.shields.io/badge/Hadoop-%23EA4335?logo=apachehadoop&logoColor=white)](https://hadoop.apache.org/) [![Plotly/Dash](https://img.shields.io/badge/Dash-%23086FA6?logo=plotly&logoColor=white)](https://plotly.com/dash/) [![Python](https://img.shields.io/badge/Python-%233776AB?logo=python&logoColor=white)](https://www.python.org/) [![Docker](https://img.shields.io/badge/Docker-%23007ACC?logo=docker&logoColor=white)](https://www.docker.com/) [![Git](https://img.shields.io/badge/Git-%23F05032?logo=git&logoColor=white)](https://git-scm.com/)

<!-- [![PySpark](https://img.shields.io/badge/PySpark-%23f58220?logo=apache-spark&logoColor=white)](https://spark.apache.org/) [![Javascript](https://img.shields.io/badge/JavaScript-%23F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)  -->

## Table of Contents

- [epidemic-data-analysis](#epidemic-data-analysis)
  - [Table of Contents](#table-of-contents)
  - [Environment Setup](#environment-setup)
  - [Project Overview](#project-overview)
  - [Directory Structure](#directory-structure)

## Environment Setup

For mongodb, used the `mongo:latest` docker image, for hadoop, used the `prasanthj/docker-hadoop` docker image, you can pull the images corresponding to this project's container from my Docker Hub repository: [raysas/bigdata-geniomhe](https://hub.docker.com/u/raysas).
  

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

## Directory Structure

```text
https://github.com/raysas/epidemic-data-analysis/
├── README.md           # -- report file
├── TODO.md             # -- todo list
├── app                 # -- dash web dashboard code
├── assets              # -- images and screenshots
├── code                # -- data processing and viz code
├── data                # -- input data files
├── figures             # -- generated figures and plots
├── output              # -- output files and documents
├── requirements.txt    # -- python dependencies for viz and dashboard
└── run.py              # -- script to run the web dashboard
```


**For the code:**

Kindly find attached the following directories and subdirectories: 

```
code/
code/
├── notebooks                 # -- jupyter notebooks for data viz and performance analysis
│   ├── continent_stats.ipynb
│   ├── countries_stats.ipynb
│   ├── daily_stats.ipynb
│   ├── performance_analysis.ipynb
│   ├── start_end_date_incidence_stats.ipynb
│   ├── total_per_country.ipynb
│   └── weekly_stats.ipynb
└── scripts                   # -- scripts for mongodb and hadoop 
    ├── extract_data.sh       # -- commands used to retrieve online data
    ├── mongodb.js            # -- mongodb queries script
    ├── mappers               # -- hadoop mappers
    │   ├── USA_daily_stats_mapper.py
    │   ├── continent_stats_mapper.py
    │   ├── country_stats_mapper.py
    │   ├── start_end_date_incidence_stats_mapper.py
    │   ├── weekly_stats_mapper.py
    │   └── worldwide_daily_stats_mapper.py
    ├── reducers              # -- hadoop reducers 
    │   ├── USA_daily_stats_reducer.py
    │   ├── continent_stats_reducer.py
    │   ├── country_stats_reducer.py
    │   ├── start_end_date_incidence_stats_reducer.py
    │   ├── weekly_stats_reducer.py
    │   └── worldwide_daily_stats_reducer.py
    ├── process_log.py    # -- helper script to process hadoop job logs into metrics
    ├── move_files.sh     # -- helper script to move files into docker containers
    └── split_json.sh     # -- helper script to split large json files
```

Also attached is the output directory containing main documents:

```
output/
utput/
├── hadoop                        // -- csv for each query
│   ├── MR_performance_stats.csv
│   ├── continent_stats.csv
│   ├── country_stats.csv
│   ├── logs                      // -- hadoop job logs for each query
│   │   ├── continent_stats.log
│   │   ├── country_stats.log
│   │   ├── start_end_date_incidence_stats.log
│   │   ├── weekly_stats.log
│   │   └── worldwide_daily_stats.log
│   ├── start_end_date_incidence_stats.csv
│   ├── weekly_stats.csv
│   └── worldwide_daily_stats.csv
└── mongodb                      // -- json for each query              
    ├── USA_daily_stats.json
    ├── continent_stats.json
    ├── country_stats.json
    ├── query_performance_stats.json
    ├── start_end_date_incidence_stats.json
    ├── weekly_stats.json
    └── worldwide_daily_stats.json
``` 




