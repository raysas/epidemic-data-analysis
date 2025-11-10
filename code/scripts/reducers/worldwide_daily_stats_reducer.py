#!/usr/bin/env python
import sys

from operator import itemgetter

daily_data = []

# Read mapper output into a list
for line in sys.stdin:
    line = line.strip()
    parts = line.split('\t')
    if len(parts) != 2:
        continue
    date, values = parts
    year, month, day, cases, deaths = values.split(',')
    year = int(year)
    month = int(month)
    day = int(day)
    cases = int(cases)
    deaths = int(deaths)
    daily_data.append([year, month, day, date, cases, deaths])

# Sort by date
# daily_data.sort(key=itemgetter(0,1,2))  # year, month, day

# Compute cumulative sums
cumulative_cases = 0
cumulative_deaths = 0

# Print header
print 'dateRep,year,month,day,totalCases,totalDeaths,cumulativeCases,cumulativeDeaths'

for record in daily_data:
    year, month, day, date, cases, deaths = record
    cumulative_cases += cases
    cumulative_deaths += deaths
    print '%s,%d,%d,%d,%d,%d,%d,%d' % (date, year, month, day, cases, deaths, cumulative_cases, cumulative_deaths)
