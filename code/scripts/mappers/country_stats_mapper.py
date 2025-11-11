#!/usr/bin/env python2
import sys
import csv

reader = csv.reader(sys.stdin)
header = True

for row in reader:
    # Skip header
    if header:
        header = False
        continue

    if len(row) < 12:
        continue

    try:
        dateRep, day, month, year, cases, deaths, countriesAndTerritories, geoId, countryterritoryCode, popData2019, continentExp, incidence = row

        country = countriesAndTerritories.strip()
        geoId = geoId.strip()
        cases = float(cases) if cases else 0
        deaths = float(deaths) if deaths else 0
        popData2019 = int(float(popData2019)) if popData2019 else 0
        incidence = float(incidence) if incidence else 0

        # emit as tab-separated values
        print "%s\t%s,%s,%s,%s,%s,%s" % (
            country,
            geoId,
            cases,
            deaths,
            popData2019,
            incidence,
            1
        )

    except Exception:
        continue
