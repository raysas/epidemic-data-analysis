docker login

docker commit bigdata_mongodb bigdata_mongodb
docker commit bigdata_hadoop bigdata_hadoop

docker tag bigdata_mongodb raysas/bigdata-geniomhe:mongodb
docker tag bigdata_hadoop raysas/bigdata-geniomhe:hadoop

docker push raysas/bigdata-geniomhe:mongodb
docker push raysas/bigdata-geniomhe:hadoop
