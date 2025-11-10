#!/usr/bin/env python2
import sys

oldKey = None
TotalCases = 0
TotalDeaths = 0
TotalCountries = 0
TotalIncidence = 0.0

for line in sys.stdin:
    data = line.strip().split('\t')
    if len(data) != 2:
        continue
    continent, values = data
    try:
        cases, deaths, country_count, incidence = values.split(',')
    except ValueError:
        continue
    
    if oldKey and oldKey != continent:
        avgIncidence = TotalIncidence / TotalCountries if TotalCountries > 0 else 0.0
        print "{0},{1},{2},{3},{4:.6f}".format(oldKey, TotalCases, TotalDeaths, TotalCountries, avgIncidence)
        TotalCases = 0
        TotalDeaths = 0
        TotalCountries = 0
        TotalIncidence = 0.0

    oldKey = continent
    TotalCases += int(cases)
    TotalDeaths += int(deaths)
    TotalCountries += int(country_count)
    TotalIncidence += float(incidence)

# print the last key
if oldKey is not None:
    avgIncidence = TotalIncidence / TotalCountries if TotalCountries > 0 else 0.0
    print "{0},{1},{2},{3},{4:.6f}".format(oldKey, TotalCases, TotalDeaths, TotalCountries, avgIncidence)
