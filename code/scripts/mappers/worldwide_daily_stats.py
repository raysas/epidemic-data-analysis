#!/usr/bin/env python
import sys
import csv

# In-mapper combiner: accumulate totals per date seen by this mapper
date_totals = {}  # date -> [year, month, day, totalCases, totalDeaths]

reader = csv.DictReader(sys.stdin)
for row in reader:
    # optionally filter here, e.g. if row['geoId'] != 'US': continue
    try:
        date = row['dateRep'].strip()
        year = int(row['year'])
        month = int(row['month'])
        day = int(row['day'])
        cases = int(row['cases'])
        deaths = int(row['deaths'])
    except Exception:
        # skip malformed rows
        continue

    if date in date_totals:
        date_totals[date][3] += cases
        date_totals[date][4] += deaths
    else:
        date_totals[date] = [year, month, day, cases, deaths]

# Emit one line per unique date from THIS mapper
for date, vals in date_totals.iteritems():
    year, month, day, totalCases, totalDeaths = vals
    # key = date, value = year,month,day,totalCases,totalDeaths
    print '%s\t%d,%d,%d,%d,%d' % (date, year, month, day, totalCases, totalDeaths)
