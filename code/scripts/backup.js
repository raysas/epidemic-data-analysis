// -- helper function to save a json file from a cursor
function save_json_file(cursor, filename) {
    var array_data = []
    while (cursor.hasNext()) {
        array_data.push(cursor.next())
    }
    var file_data = JSON.stringify(array_data, null, 2)
    // save to a file
    const fs = require('fs');
    fs.writeFileSync(filename, file_data);
    print(`-- json file saved in: ${filename}`)
}

db.query_performance.deleteMany({})
//--------------------------------------------
// -- given year, month and day fields, check the range of dates we have
date_range=db.worldwide_cases.aggregate([
    { $group: { _id: null, 
        minDate: { $min: { $dateFromParts: { year:{ $toInt: "$year" }, month: { $toInt: "$month" }, day: { $toInt: "$day" } } } }, 
        maxDate: { $max: { $dateFromParts: { year: { $toInt: "$year" }, month: { $toInt: "$month" }, day: { $toInt: "$day" } } } }
        } 
    }
])

// -- check max year
max_year=db.worldwide_cases.aggregate([
    { $group: { _id: null, maxYear: { $max: { $toInt: "$year" } } } }
])

// ESSENTIAL STEP: make it double

db.worldwide_cases.updateMany({}, 
  [{ $set: 
    { 
      "Cumulative_number_for_14_days_of_COVID-19_cases_per_100000": 
          { $convert: {
            input: "$Cumulative_number_for_14_days_of_COVID-19_cases_per_100000",
            to: "double",
            onError: null,
            onNull: null
          }
    } 
} } ]);

db.worldwide_cases.updateMany(
  {},
  [
    { 
      $set: { 
        date: {
          $dateFromString: { dateString: "$dateRep", format: "%d/%m/%Y" }
        }
      }
    }
  ]
);

//---------------------------------------------------//

// 0) data distribution over continents

// -- data distribution over continents
// continent_data_distribution=db.worldwide_cases.aggregate([
//     { $group: { 
//       _id: "$continentExp", 
//       totalCases: { $sum: "$cases" }, 
//       totalDeaths: { $sum: "$deaths" }, 
//       countries: { $addToSet: "$countriesAndTerritories" } ,
//       avg14DayIncidence: { $avg: "$Cumulative_number_for_14_days_of_COVID-19_cases_per_100000" }
//     } },
//     { $project: { 
//       continent: "$_id", 
//       totalCases: 1, totalDeaths: 1, 
//       numberOfCountries: 
//       { $size: "$countries" } },
//       avg14DayIncidence: 1
//     },
//     { $sort: { totalCases: -1 } }
// ])
//save json file
// save_json_file(continent_data_distribution, "continent_data_distribution.json")


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
// check result
print("-- continent stats:")
printjson(continent_stats.toArray())

// -- performance analysis
var continent_stats_performance=db.worldwide_cases.aggregate([
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
]).explain("executionStats")
var cursorStage = continent_stats_performance.stages[0]['$cursor'].executionStats;

var queryStatsDoc = {
    query_name: "continent_stats",  
    executionTimeMillis: cursorStage.executionTimeMillis,
    totalDocsExamined: cursorStage.totalDocsExamined,
    nReturned: cursorStage.nReturned,
    timestamp: new Date() 
};

db.query_performance.insertOne(queryStatsDoc);
db.query_performance.find();

save_json_file(continent_stats, "continent_stats.json")

// ---------------------------------------------------//


// # -- 1) map per country
// // -- removing smtg
// db.query_performance.updateOne(
//   { _id: ObjectId("69103fcf0fe883ec8cce5f48") },
//   { $unset: { duration: "" } }
// )


// -- total cases and total deaths in each country
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

// # -- performance analysis
// delete previous performance data
// db.query_performance.deleteOne({ _id: ObjectId("-?") })
var country_stats_performance=db.worldwide_cases.aggregate([
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
]).explain("executionStats")

var cursorStage = country_stats_performance.stages[0]['$cursor'].executionStats;
var queryStatsDoc = {
    query_name: "country_stats",  // name of your query
    executionTimeMillis: cursorStage.executionTimeMillis,
    totalDocsExamined: cursorStage.totalDocsExamined,
    nReturned: cursorStage.nReturned,
    timestamp: new Date()  // optional: when the query was executed
};

db.query_performance.insertOne(queryStatsDoc);
db.query_performance.find();

// make a json file of it
save_json_file(country_stats, "country_stats.json")


// -- check all statistics of the lebanese population
// lebanon_stats=db.worldwide_cases.find({ countriesAndTerritories: "Lebanon" })
// save_json_file(lebanon_stats, "lebanon_stats.json")






// ---------------------------------------------------//
// # -- 2) top 5 countries with highest total cases and deaths (time series)

// // -- top 5 countries with highest total cases
// top5_countries_cases=db.worldwide_cases.aggregate([
//     { $group: {
//         _id: "$countriesAndTerritories", 
//         geoId: { $first: "$geoId" },
//         totalCases: { $sum: "$cases" } 
//     }},
//     { $sort: { totalCases: -1 } },
//     { $limit: 5 }
// ])


// // -- top 5 countries with highest total deaths
// top5_countries_deaths=db.worldwide_cases.aggregate([
//     { $group: {
//         _id: "$countriesAndTerritories", 
//         geoId: { $first: "$geoId" },
//         totalDeaths: { $sum: "$deaths" } 
//     }},
//     { $sort: { totalDeaths: -1 } },
//     { $limit: 5 }
// ])

// //-- performance analysis
// var top5_countries_cases_performance=db.worldwide_cases.aggregate([
//     { $group: {
//         _id: "$countriesAndTerritories", 
//         geoId: { $first: "$geoId" },
//         totalCases: { $sum: "$cases" } 
//     }},
//     { $sort: { totalCases: -1 } },
//     { $limit: 5 }
// ]).explain("executionStats")
// var cursorStage = top5_countries_cases_performance.stages[0]['$cursor'].executionStats;

// var queryStatsDoc = {
//     query_name: "top5_countries_cases",  // name of your query
//     executionTimeMillis: cursorStage.executionTimeMillis,
//     totalDocsExamined: cursorStage.totalDocsExamined,
//     nReturned: cursorStage.nReturned,
//     timestamp: new Date()  // optional: when the query was executed
// };

// db.query_performance.insertOne(queryStatsDoc);
// db.query_performance.find();

// var top5_countries_deaths_performance=db.worldwide_cases.aggregate([
//     { $group: {
//         _id: "$countriesAndTerritories", 
//         geoId: { $first: "$geoId" },
//         totalDeaths: { $sum: "$deaths" } 
//     }},
//     { $sort: { totalDeaths: -1 } },
//     { $limit: 5 }
// ]).explain("executionStats")
// var cursorStage = top5_countries_deaths_performance.stages[0]['$cursor'].executionStats;

// var queryStatsDoc = {
//     query_name: "top5_countries_deaths",  // name of your query
//     executionTimeMillis: cursorStage.executionTimeMillis,
//     totalDocsExamined: cursorStage.totalDocsExamined,
//     nReturned: cursorStage.nReturned,
//     timestamp: new Date()  // optional: when the query was executed
// };

// db.query_performance.insertOne(queryStatsDoc);
// db.query_performance.find();


// while (top5_countries_cases.hasNext()) {
//     var current_country=top5_countries_cases.next()
//     temp_country_cursor=db.worldwide_cases.find({ geoId: current_country.geoId })
//     save_json_file(temp_country_cursor, `top5_countries_cases_${current_country.geoId}_data.json`)
// }
// while (top5_countries_deaths.hasNext()) {
//     var current_country=top5_countries_deaths.next()
//     temp_country_cursor=db.worldwide_cases.find({ geoId: current_country.geoId })
//     save_json_file(temp_country_cursor, `top5_countries_deaths_${current_country.geoId}_data.json`)
// }

// check if top5_countries_deaths and top5_countries_cases have same countries
// -- intersection






// USA daily_stats

// -- checking if this works:
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

// print("-- USA daily stats (days):")
// printjson(country_daily_stats.toArray().length)

// -- USA daily stats (days):
// 330

// make a json file of it
save_json_file(country_daily_stats, "USA_daily_stats.json")

// -- performance analysis
var country_daily_stats_performance=db.worldwide_cases.aggregate([
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
        }}
  }
  }]).explain("executionStats")
var cursorStage = country_daily_stats_performance.stages[0]['$cursor'].executionStats;

var queryStatsDoc = {
    query_name: "country_daily_stats_USA",
    executionTimeMillis: cursorStage.executionTimeMillis,
    totalDocsExamined: cursorStage.totalDocsExamined,
    nReturned: cursorStage.nReturned,
    timestamp: new Date()  
};

db.query_performance.insertOne(queryStatsDoc);
db.query_performance.find();

// -----------------------------------------------//

// -- 3) total cases/deaths per day worldwide (can group by date)
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

// print("-- worldwide daily stats (days):")
// printjson(worldwide_daily_stats.toArray().length)

// make a json file of it
save_json_file(worldwide_daily_stats, "worldwide_daily_stats.json")


// -- performance analysis
var worldwide_daily_stats_performance=db.worldwide_cases.aggregate([
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
  }]).explain("executionStats")
var cursorStage = worldwide_daily_stats_performance.stages[0]['$cursor'].executionStats;

var queryStatsDoc = {
    query_name: "worldwide_daily_stats",
    executionTimeMillis: cursorStage.executionTimeMillis,
    totalDocsExamined: cursorStage.totalDocsExamined,
    nReturned: cursorStage.nReturned,
    timestamp: new Date()  
};

db.query_performance.insertOne(queryStatsDoc);
db.query_performance.find();



// ---------------------------------------------------//

// 4) cases/death correlation analysis

// aggregate by weeek

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
// print("-- weekly stats (records):")
// printjson(weekly_stats.toArray().length)

// make a json file of it
save_json_file(weekly_stats, "weekly_stats.json")

// -- performance analysis
var weekly_stats_performance=db.worldwide_cases.aggregate([
  {
    $group: {
      _id: {
        year: { $isoWeekYear: "$date" },
        week: { $isoWeek: "$date" }
      },
      weeklyCases: { $sum: "$cases" },
      weeklyDeaths: { $sum: "$deaths" },
      corr: { $avg: { $multiply: ["$cases", "$deaths"] }  }
    }
  },
  {
  $project: {
    year: "$_id.year",
    week: "$_id.week",
    weeklyCases: 1,
    weeklyDeaths: 1,
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
]).explain("executionStats")
var cursorStage = weekly_stats_performance.stages[0]['$cursor'].executionStats;

var queryStatsDoc = {
    query_name: "weekly_stats",
    executionTimeMillis: cursorStage.executionTimeMillis,
    totalDocsExamined: cursorStage.totalDocsExamined,
    nReturned: cursorStage.nReturned,
    timestamp: new Date()  
};

db.query_performance.insertOne(queryStatsDoc);
db.query_performance.find();  


// ---------------------------------------------------//

// get the earliest date
earliest_date=db.worldwide_cases.find().sort({ date: 1 }).limit(1).next()

// get the latest date
latest_date=db.worldwide_cases.find().sort({ date: -1 }).limit(1).next()

// 5) collect the 14-day incidence rate worldwide per day for these 2 dates, group by country
start_end_date_incidence_stats=db.worldwide_cases.find(
  { dateRep: { $in: [ earliest_date.dateRep, latest_date.dateRep ] } },
  { countriesAndTerritories: 1, geoId: 1, dateRep: 1,
    "Cumulative_number_for_14_days_of_COVID-19_cases_per_100000": 1,
     _id: 0 
    }
)

// make a json file of it
save_json_file(start_end_date_incidence_stats, "start_end_date_incidence_stats.json")

// this is already a cursor :)
var cursorStage = db.worldwide_cases.find(
    { dateRep: { $in: [earliest_date.dateRep, latest_date.dateRep] } },
    { countriesAndTerritories: 1, geoId: 1, dateRep: 1,
      "Cumulative_number_for_14_days_of_COVID-19_cases_per_100000": 1,
      _id: 0
    }
).explain("executionStats");
var queryStatsDoc = {
    query_name: "start_end_date_incidence_stats",
    executionTimeMillis: cursorStage.executionTimeMillis,
    totalDocsExamined: cursorStage.totalDocsExamined,
    nReturned: cursorStage.nReturned,
    timestamp: new Date()  
};

db.query_performance.insertOne(queryStatsDoc);
db.query_performance.find();

save_json_file(db.query_performance.find(), "query_performance_stats.json")