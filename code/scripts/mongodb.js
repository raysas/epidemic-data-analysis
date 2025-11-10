// -- helper function to save a json file from a cursor
function save_json_file(cursor, filename) {
    var array_data = []
    while (cursor.hasNext()) {
        array_data.push(cursor.next())
    }
    var file_data = JSON.stringify(array_data, null, 2)
    const fs = require('fs');
    fs.writeFileSync(filename, file_data);
    print(`-- json file saved in: ${filename}`)
}

db.query_performance.deleteMany({})

// 0) data distribution over continents
continent_stats=db.worldwide_cases.aggregate([
  {
    $group: {
      _id: "$countriesAndTerritories",
      continent: { $first: "$continentExp" },
      avg14DayIncidence: { $avg: "$Cumulative_number_for_14_days_of_COVID-19_cases_per_100000" },
      totalCases: { $sum: "$cases" },
      totalDeaths: { $sum: "$deaths" }
    }
  },
  { $group: {
      _id: "$continent",
      totalCases: { $sum: "$totalCases" },
      totalDeaths: { $sum: "$totalDeaths" },
      numberOfCountries: { $sum: 1 },
      avg14DayIncidence: { $avg: "$avg14DayIncidence" }
    }
  },
  { $project: {
      continent: "$_id",
      totalCases: 1,
      totalDeaths: 1,
      numberOfCountries: 1,
      avg14DayIncidence: 1
    }
  },
  { $sort: { totalCases: -1 } }
])
// print("-- continent stats:")
// printjson(continent_stats.toArray())

save_json_file(continent_stats, "continent_stats.json")

// 1) map per country
country_stats = db.worldwide_cases.aggregate([
  {
    $group: {
      _id: "$countriesAndTerritories",
      geoId: { $first: "$geoId" },
      totalCases: { $sum: "$cases" },
      totalDeaths: { $sum: "$deaths" },
      popData2019: { $first: { $toInt: "$popData2019" }},
      avg14DayIncidence: { $avg: "$Cumulative_number_for_14_days_of_COVID-19_cases_per_100000"
    }
    }
  },
  {
    $addFields: {
      percTotalCases: { $multiply: [ { $divide: ["$totalCases", "$popData2019"] }, 100 ] },
      percTotalDeaths: { $multiply: [ { $divide: ["$totalDeaths", "$popData2019"] }, 100 ] },
    }
  }
])
save_json_file(country_stats, "country_stats.json")

// 2) top country (usa) with highest total cases and deaths (time series)
db.worldwide_cases.find({ geoId: "US" }).limit(1)
country_daily_stats=db.worldwide_cases.aggregate([
  {
    $match: { geoId: "US" }
  },
  {
    $group: {
      _id: "$dateRep",
      year: { $first: { $toInt: "$year" } },
      month: { $first: { $toInt: "$month" } },
      day: { $first: { $toInt: "$day" } },
      totalCases: { $sum: "$cases" },
      totalDeaths: { $sum: "$deaths" }
    }
  },
  {
    $sort: { year: 1, month: 1, day: 1 }
  },
  {
    $setWindowFields: {
      sortBy: { year: 1, month: 1, day: 1 },
      output: {
        cumulativeCases: {
          $sum: "$totalCases",
          window: { documents: ["unbounded", "current"] }
        },
        cumulativeDeaths: {
          $sum: "$totalDeaths",
          window: { documents: ["unbounded", "current"] }
        }
      }
    }
  },  
])
save_json_file(country_daily_stats, "USA_daily_stats.json")

// 3) total cases/deaths per day worldwide (can group by date)
worldwide_daily_stats=db.worldwide_cases.aggregate([
  {
    $group: {
      _id: "$dateRep",
      year: { $first: { $toInt: "$year" } },
      month: { $first: { $toInt: "$month" } },
      day: { $first: { $toInt: "$day" } },
      totalCases: { $sum: "$cases" },
      totalDeaths: { $sum: "$deaths" }
    }
  },
  {
    $sort: { year: 1, month: 1, day: 1 }
  },
  {
    $setWindowFields: {
      sortBy: { year: 1, month: 1, day: 1 },
      output: {
        cumulativeCases: {
          $sum: "$totalCases",
          window: { documents: ["unbounded", "current"] }
        },
        cumulativeDeaths: {
          $sum: "$totalDeaths",
          window: { documents: ["unbounded", "current"] }
        }}
  }
  }
])
save_json_file(worldwide_daily_stats, "worldwide_daily_stats.json")

// 4) cases/death correlation analysis
weekly_stats=db.worldwide_cases.aggregate([
  {
    $group: {
      _id: {
        year: { $isoWeekYear: "$date" },
        week: { $isoWeek: "$date" }
      },
      weeklyCases: { $sum: "$cases" },
      weeklyDeaths: { $sum: "$deaths" },
      weekly14DayIncidence: { $avg: "$Cumulative_number_for_14_days_of_COVID-19_cases_per_100000" },
      corr: { $avg: { $multiply: ["$cases", "$deaths"] }  }
    }
  },
  {
    $project: {
      year: "$_id.year",
      week: "$_id.week",
      weeklyCases: 1,
      weeklyDeaths: 1,
      weekly14DayIncidence: 1,
      correlationEstimate: {
        $cond: [
          { $eq: [{ $multiply: ["$weeklyCases", "$weeklyDeaths"] }, 0] },
          null,
          { $divide: ["$corr", { $multiply: ["$weeklyCases", "$weeklyDeaths"] }] }
        ]
      },
      _id: 0
    }
  },
  { $sort: { year: 1, week: 1 } }
])
save_json_file(weekly_stats, "weekly_stats.json")

// 5) collect the 14-day incidence rate worldwide per day for these 2 dates, group by country
earliest_date=db.worldwide_cases.find().sort({ date: 1 }).limit(1).next()
latest_date=db.worldwide_cases.find().sort({ date: -1 }).limit(1).next()

start_end_date_incidence_stats=db.worldwide_cases.find(
  { dateRep: { $in: [ earliest_date.dateRep, latest_date.dateRep ] } },
  { countriesAndTerritories: 1, geoId: 1, dateRep: 1,
    "Cumulative_number_for_14_days_of_COVID-19_cases_per_100000": 1,
     _id: 0 
  }
)
save_json_file(start_end_date_incidence_stats, "start_end_date_incidence_stats.json")
print("-- script finished.")

// var cursorStage = db.worldwide_cases.find(
//     { dateRep: { $in: [earliest_date.dateRep, latest_date.dateRep] } },
//     { countriesAndTerritories: 1, geoId: 1, dateRep: 1,
//       "Cumulative_number_for_14_days_of_COVID-19_cases_per_100000": 1,
//       _id: 0
//     }
// ).explain("executionStats");
// var queryStatsDoc = {
//     query_name: "start_end_date_incidence_stats",
//     executionTimeMillis: cursorStage.executionTimeMillis,
//     totalDocsExamined: cursorStage.totalDocsExamined,
//     nReturned: cursorStage.nReturned,
//     timestamp: new Date()  
// };

// db.query_performance.insertOne(queryStatsDoc);
// db.query_performance.find();

save_json_file(db.query_performance.find(), "query_performance_stats.json")