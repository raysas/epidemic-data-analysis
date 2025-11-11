#!/usr/bin/env python2
import sys

current_country = None
geoId = None
totalCases = 0
totalDeaths = 0
popData2019 = 0
incidenceSum = 0
incidenceCount = 0

# Print CSV header
print "countriesAndTerritories,geoId,totalCases,totalDeaths,popData2019,avg14DayIncidence,percTotalCases,percTotalDeaths"

for line in sys.stdin:
    line = line.strip()
    if not line:
        continue

    try:
        country, values = line.split("\t", 1)
        geo, cases, deaths, pop, incidence, count = values.split(",")
        cases = float(cases)
        deaths = float(deaths)
        pop = int(float(pop))
        incidence = float(incidence)
        count = int(count)
    except Exception:
        continue

    if current_country != country:
        if current_country:
            avg14DayIncidence = (incidenceSum / incidenceCount) if incidenceCount > 0 else 0
            percCases = (totalCases / popData2019 * 100) if popData2019 > 0 else 0
            percDeaths = (totalDeaths / popData2019 * 100) if popData2019 > 0 else 0

            print "%s,%s,%d,%d,%d,%.6f,%.6f,%.6f" % (
                current_country,
                geoId,
                totalCases,
                totalDeaths,
                popData2019,
                avg14DayIncidence,
                percCases,
                percDeaths
            )

        # reset accumulators
        current_country = country
        geoId = geo
        totalCases = 0
        totalDeaths = 0
        popData2019 = pop
        incidenceSum = 0
        incidenceCount = 0

    totalCases += cases
    totalDeaths += deaths
    incidenceSum += incidence
    incidenceCount += count

# Emit last record
if current_country:
    avg14DayIncidence = (incidenceSum / incidenceCount) if incidenceCount > 0 else 0
    percCases = (totalCases / popData2019 * 100) if popData2019 > 0 else 0
    percDeaths = (totalDeaths / popData2019 * 100) if popData2019 > 0 else 0

    print "%s,%s,%d,%d,%d,%.6f,%.6f,%.6f" % (
        current_country,
        geoId,
        totalCases,
        totalDeaths,
        popData2019,
        avg14DayIncidence,
        percCases,
        percDeaths
    )
