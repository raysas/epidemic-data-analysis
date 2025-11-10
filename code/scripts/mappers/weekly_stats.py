#!/usr/bin/env python
import sys
import csv
import datetime

reader = csv.DictReader(sys.stdin)

for row in reader:
    try:
        # Parse date; expect format like "dd/mm/yyyy"
        date_str = row['dateRep']
        day, month, year = map(int, date_str.split('/'))
        dt = datetime.date(year, month, day)
        iso_year, iso_week, _ = dt.isocalendar()

        cases = int(row['cases'])
        deaths = int(row['deaths'])
        inc14 = float(row['Cumulative_number_for_14_days_of_COVID-19_cases_per_100000'] or 0.0)
    except Exception:
        continue

    # key = iso_year, iso_week
    # value = cases,deaths,inc14,(cases*deaths)
    print '%d-%02d\t%d,%d,%.6f,%.6f' % (iso_year, iso_week, cases, deaths, inc14, cases * deaths)
