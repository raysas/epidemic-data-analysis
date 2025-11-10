#!/usr/bin/env python2

import sys
import csv

seen_countries = set()
reader = csv.reader(sys.stdin)

for data in reader:
    if len(data) != 12:
        continue
    dateRep, day, month, year, cases, deaths, country, geoId, countryCode, popData2019, continentExp, incidence14Day = data

    if countryCode in seen_countries:
        continue  # skip if we've already seen this country
    seen_countries.add(countryCode)

    if incidence14Day == '':
        incidence14Day = '0.0'
    try:
        cases = int(cases)
        deaths = int(deaths)
        incidence14Day = float(incidence14Day)
    except ValueError:
        continue

    print "{0}\t{1},{2},{3},{4}".format(continentExp, cases, deaths, 1, incidence14Day)
