# epidemic-data-analysis
Big Data and Data Integration project - S9 GENIOMHE   

**Report on**: [`https://raysas.github.io/epidemic-data-analysis/`](https://raysas.github.io/epidemic-data-analysis/) pages from github: [`https://github.com/raysas/epidemic-data-analysis`](https://github.com/raysas/epidemic-data-analysis)

**Tools used**:

[![MongoDB](https://img.shields.io/badge/MongoDB-%2334A853?logo=mongodb&logoColor=white)](https://www.mongodb.com/) [![Hadoop](https://img.shields.io/badge/Hadoop-%23EA4335?logo=apachehadoop&logoColor=white)](https://hadoop.apache.org/) [![PySpark](https://img.shields.io/badge/PySpark-%23f58220?logo=apache-spark&logoColor=white)](https://spark.apache.org/) [![Plotly/Dash](https://img.shields.io/badge/Dash-%23086FA6?logo=plotly&logoColor=white)](https://plotly.com/dash/) [![Python](https://img.shields.io/badge/Python-%233776AB?logo=python&logoColor=white)](https://www.python.org/) [![Javascript](https://img.shields.io/badge/JavaScript-%23F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript) [![Docker](https://img.shields.io/badge/Docker-%23007ACC?logo=docker&logoColor=white)](https://www.docker.com/) [![Git](https://img.shields.io/badge/Git-%23F05032?logo=git&logoColor=white)](https://git-scm.com/)

## Project Overview

**Web dashboard link:** 

[]()

**Diagram**:

![]()

**Directory Structure:**

```text
.
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

## Environment Setup

For mongodb, used the `mongo:latest` docker image, you can pull the image corresponding to this project's container from my Docker Hub repository:

```
docker pull raysas/bigdata-geniomhe:mongo
```

For hadoop, used the `prasanthj/docker-hadoop` docker image, you can pull the image corresponding to this project's container from my Docker Hub repository:

```
docker pull raysas/bigdata-geniomhe:hadoop
```

For pyspark, used a python image with pyspark installed, you can pull the image corresponding to this project's container from my Docker Hub repository:

```
docker pull raysas/bigdata-geniomhe:pyspark
```

## Workflow

### MongoDB

1. **Starting by setting up a mongodb container using the pulled image and downloading the dataset**
   
    ```bash
    docker run -d --name mongodb -p 27017:27017 raysas/bigdata-geniomhe:mongo
    ```
    _entering the container now_

2. **Importing the datasets into the mongodb container using `mongoimport` command**
   
    ```bash
    mongoimport --db epidemic --collection cases --file /data/cases.json
    ```
    _entering mongo shell now_

3. **Querying!**

    > [!NOTE]
    > All mongodb commands here can be found in a javascript script in code/scripts/mongodb.js