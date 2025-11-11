
## Performance Analysis

For mongodb, we logged the performance of each query into a separate collection called `query_performance`, which contains the execution time and number of documents examined for each query (you can find it in `output/mongodb/query_performance_stats.json`).

For hadoop, we saved the logs of each job into the `logs/` directory, from which we can extract the execution time and number of input records processed for each job using this script:

```bash
python code/scripts/process_log.py output/hadoop/logs/ --output output/hadoop/MR_performance_stats.csv
```

Will analyze the 5 main queries in terms of time, documents/records processed and compare between the 2 tools (this analysis was performed in `code/notebooks/performance_analysis.ipynb`)

**Time**:

![line plot showing execution time comparison between mongodb and hadoop for the main 4 queries](./figures/time_performance.png)

_note, only 4 queries bcs some queries could not collected performance stats - for example, by the way start_end_date_incidence_stats query was implemented in  mongodb, it was a cursor not an aggregation, thus could not collect same stats as others_

Note the big difference between the 2 tools in terms of execution time, with mongodb being significantly faster than hadoop for all queries. This is expected as mongodb is optimized for such aggregations and can leverage indexes and in-memory processing, while hadoop relies on disk-based processing and shuffling data across nodes

**Records/Documents processed**:

![bar plot showing number of documents/records processed comparison between mongodb and hadoop for the main 4 queries](./figures/processing_performance.png)

Here, we can see that both tools processed a similar number of records/documents for each query, with some minor differences due to the way data is grouped and aggregated in each tool. This indicates that both tools are capable of handling large datasets effectively, but mongodb has an edge in terms of speed for these types of aggregations, particularly one query was performed on significantly less in hadoop (aggregation on query). Not the case with continents for example as it was based on 2 aggregation stages in mongodb, thus more documents processed.

**Some hadoop analysis**:

![Physical vs virtual memory per job](./figures/phy_vs_virt.png)

In hadoop, we can see that the physical memory used per job is significantly lower than the virtual memory => hadoop is effectively managing memory usage and avoiding excessive swapping to disk (important for performance, as excessive swapping can lead to slowdowns and increased execution times)

**Closing notes:**

_pyspark was not done by the time of submission (will still push on github if finished it), had a couple of bugs in mapreduce that really affected time spent on this project (the mapper file should have the word "mapper" in it for instance, took me more than a day to debug this alone), working with mongodb was much more smoother and faster to implement and test._

Thank you for reading!