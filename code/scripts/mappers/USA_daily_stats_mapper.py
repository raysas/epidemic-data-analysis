#!/usr/bin/env python
import sys
import csv

reader = csv.DictReader(sys.stdin)
for row in reader:
    if row['geoId'] != 'US':
        continue
    date = row['dateRep']
    try:
        year = int(row['year'])
        month = int(row['month'])
        day = int(row['day'])
        cases = int(row['cases'])
        deaths = int(row['deaths'])
    except:
        continue
    # Emit: key = date, value = year,month,day,cases,deaths
    print '%s\t%d,%d,%d,%d,%d' % (date, year, month, day, cases, deaths)
