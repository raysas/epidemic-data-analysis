#!/usr/bin/env python
import sys
import csv

sys.stderr.write("DEBUG: Mapper started\n")

reader = csv.DictReader((line.replace('\r', '') for line in sys.stdin))

for row in reader:
    country = row['countriesAndTerritories']
    geoId = row['geoId']
    try:
        cases = int(row['cases'])
        deaths = int(row['deaths'])
        pop = int(row['popData2019'])
    except:
        continue
    # Emit: country \t geoId,cases,deaths,pop
    print '%s\t%s,%d,%d,%d' % (country, geoId, cases, deaths, pop)
