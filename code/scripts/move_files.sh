#!/bin/bash

jsonfiles=(
USA_daily_stats.json  country_stats.json        query_performance_stats.json         weekly_stats.json
continent_stats.json  country_total_stats.json  start_end_date_incidence_stats.json  worldwide_daily_stats.json  top5_countries_deaths_US_data.json
)

csvfiles=(
USA_daily_stats.csv  country_stats.csv       weekly_stats.csv
continent_stats.csv  start_end_date_incidence_stats.csv  worldwide_daily_stats.csv
)

for f in "${files[@]}"; do
  docker cp bigdata_mongodb:/"$f" output/mongodb/
done

for f in "${csvfiles[@]}"; do
  docker cp bigdata_hadoop:/output/"$f" output/hadoop/
done

docker cp bigdata_hadoop:/logs/ output/hadoop/logs/


docker cp code/scripts/reducers/ bigdata_hadoop:/
docker cp code/scripts/mappers bigdata_hadoop:/

# docker cp bigdata_hadoop:/reducers code/scripts/
# docker cp bigdata_hadoop:/mappers code/scripts/


# docker cp code/scripts/reducers/ a5c4e6e4ce25:/
# docker cp code/scripts/mappers a5c4e6e4ce25:/
# docker cp data/covid.csv a5c4e6e4ce25:/

# hadoop jar $HADOOP_COMMON_HOME/share/hadoop/tools/lib/hadoop-streaming-2.7.2.jar -D mapreduce.job.name="country_stats" -files mappers/country_stats.py,reducers/country_stats.py -mapper country_stats.py -reducer country_stats.py -input test2.csv -output country_stats_12