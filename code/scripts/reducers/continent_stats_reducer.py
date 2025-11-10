#!/usr/bin/env python2
import sys
oldKey = None
TotalCases = 0
TotalDeaths = 0
TotalCountries = 0
TotalIncidence = 0.0

# -- will match the key that is continent
# -- input format: continent \t totalCases,totalDeaths,1,avg14DayIncidence
# -- output format: continent,totalCases,totalDeaths,totalCountries,avg14DayIncidence

n=0
# -- header
print "continent,totalCases,totalDeaths,numberOfCountries,avg14DayIncidence"
for line in sys.stdin:
    n+=1
    data=line.strip().split('\t')
    if len(data) != 2:
        continue
    continent, values = data
    cases, deaths, country_count, incidence = values.split(',') 
    if oldKey and oldKey != continent:
        # output the last key value pair result
        avgIncidence = TotalIncidence / TotalCountries if TotalCountries > 0 else 0.0
        print "{0},{1},{2},{3},{4:.6f}".format(oldKey, TotalCases, TotalDeaths, TotalCountries, avgIncidence)
        TotalCases = 0
        TotalDeaths = 0
        TotalCountries = 0
        TotalIncidence = 0.0
        n=0
    oldKey = continent
    TotalCases += int(cases)
    TotalDeaths += int(deaths)
    TotalCountries += int(country_count)
    TotalIncidence += float(incidence)

# output the last key value pair result
if oldKey is not None:
    avgIncidence = TotalIncidence /n if n > 0 else 0.0
    # print "{0},{1},{2},{3},{4:.6f}".format(oldKey, TotalCases, TotalDeaths, TotalCountries, avgIncidence)