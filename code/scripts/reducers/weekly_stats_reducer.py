#!/usr/bin/env python
import sys
from operator import itemgetter

agg = {}  # (year,week) -> [totalCases, totalDeaths, sumInc14, countInc14, sumCaseDeath]

for line in sys.stdin:
    line = line.strip()
    if not line:
        continue
    key, values = line.split('\t', 1)
    try:
        cases, deaths, inc14, case_death = values.split(',')
        cases = int(cases)
        deaths = int(deaths)
        inc14 = float(inc14)
        case_death = float(case_death)
    except Exception:
        continue

    if key not in agg:
        agg[key] = [0, 0, 0.0, 0, 0.0]
    agg[key][0] += cases
    agg[key][1] += deaths
    agg[key][2] += inc14
    agg[key][3] += 1
    agg[key][4] += case_death

# Sort by year, week
records = []
for key, vals in agg.iteritems():
    y, w = map(int, key.split('-'))
    totalCases, totalDeaths, sumInc14, countInc14, sumCaseDeath = vals
    avg14 = sumInc14 / countInc14 if countInc14 > 0 else 0.0

    if totalCases == 0 or totalDeaths == 0:
        corrEst = ''
    else:
        corrEst = sumCaseDeath / float(totalCases * totalDeaths)

    records.append([y, w, totalCases, totalDeaths, avg14, corrEst])

records.sort(key=itemgetter(0, 1))

# Print header + all records
print 'year,week,weeklyCases,weeklyDeaths,weekly14DayIncidence,correlationEstimate'
for y, w, tc, td, inc, corr in records:
    if corr == '':
        print '%d,%d,%d,%d,%.6f,' % (y, w, tc, td, inc)
    else:
        print '%d,%d,%d,%d,%.6f,%.6f' % (y, w, tc, td, inc, corr)
