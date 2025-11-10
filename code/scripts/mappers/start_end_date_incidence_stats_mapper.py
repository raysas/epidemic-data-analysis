#!/usr/bin/env python
import sys
import csv

reader = csv.DictReader(sys.stdin)
for row in reader:
    try:
        date = row['dateRep'].strip()
        country = row['countriesAndTerritories']
        geoId = row['geoId']
        incidence = row['Cumulative_number_for_14_days_of_COVID-19_cases_per_100000']
        if incidence == '':
            incidence = '0'
    except Exception:
        continue

    # Emit: key = date, value = country,geoId,incidence
    print '%s\t%s,%s,%s' % (date, country.replace(',', ''), geoId, incidence)
