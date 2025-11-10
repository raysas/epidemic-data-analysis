#!/usr/bin/env python
import sys

# We'll find earliest and latest date strings and store rows for each
all_rows = []

for line in sys.stdin:
    line = line.strip()
    if not line:
        continue
    try:
        date, values = line.split('\t', 1)
        country, geoId, incidence = values.split(',', 2)
        all_rows.append((date, country, geoId, incidence))
    except Exception:
        continue

# Sort by date (lexicographically OK for dd/mm/yyyy? usually not)
# We'll parse to y,m,d to be safe
def parse_date(d):
    try:
        parts = d.split('/')
        if len(parts) == 3:
            day, month, year = map(int, parts)
            return (year, month, day)
    except Exception:
        pass
    return (9999, 12, 31)

all_rows.sort(key=lambda x: parse_date(x[0]))

if not all_rows:
    sys.exit(0)

earliest_date = all_rows[0][0]
latest_date = all_rows[-1][0]

print 'countriesAndTerritories,geoId,dateRep,Cumulative_number_for_14_days_of_COVID-19_cases_per_100000'
for (date, country, geoId, incidence) in all_rows:
    if date == earliest_date or date == latest_date:
        print '%s,%s,%s,%s' % (country, geoId, date, incidence)
