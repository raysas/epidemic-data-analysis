#!/usr/bin/env python
import sys

current_country = None
geoId = None
total_cases = 0
total_deaths = 0
pop = 0
header_printed = False

for line in sys.stdin:
    line = line.strip()
    parts = line.split('\t')
    if len(parts) != 2:
        continue
    country, values = parts
    parts_values = values.split(',')
    if len(parts_values) != 4:
        continue
    cont_id, cases, deaths, pop_data = parts_values
    cases = int(cases)
    deaths = int(deaths)
    pop_data = int(pop_data)

    if current_country != country:
        if current_country:
            perc_cases = (float(total_cases) / pop) * 100
            perc_deaths = (float(total_deaths) / pop) * 100
            if not header_printed:
                print 'country,geoId,totalCases,totalDeaths,popData2019,percTotalCases,percTotalDeaths'
                header_printed = True
            print '%s,%s,%d,%d,%d,%f,%f' % (current_country, geoId, total_cases, total_deaths, pop, perc_cases, perc_deaths)
        current_country = country
        geoId = cont_id
        total_cases = 0
        total_deaths = 0
        pop = pop_data

    total_cases += cases
    total_deaths += deaths
    pop = pop_data  # population should be the same per country

# Print last country
if current_country:
    perc_cases = (float(total_cases) / pop) * 100
    perc_deaths = (float(total_deaths) / pop) * 100
    if not header_printed:
        print 'country,geoId,totalCases,totalDeaths,popData2019,percTotalCases,percTotalDeaths'
    print '%s,%s,%d,%d,%d,%f,%f' % (current_country, geoId, total_cases, total_deaths, pop, perc_cases, perc_deaths)
