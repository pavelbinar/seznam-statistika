#!/usr/bin/env node

var request = require('request')
var cheerio = require('cheerio')
var chalk = require('chalk')
var _ = require('lodash')

var getData = function (searchText) {
  var url = 'https://search.seznam.cz/stats/?term=' + searchText.split(' ').join('+')

  request(url, function (error, response, html) {
    if (!error && response.statusCode === 200) {
      var $ = cheerio.load(html)

      var scriptContent = $('script').last().get()[0].children[0].data

      var re = /var termQueryData(.*);/g
      var termQueryDataString = scriptContent.match(re)[0]

      var termQueryDataStringJS = eval('(function(){' + termQueryDataString + ' return termQueryData;})()')

      displayData(termQueryDataStringJS)

    } else {
      console.log(error)
    }
  })
}

var displayData = function (searchData) {
  _.forEach(searchData[0], function (item) {
    console.log('"' + chalk.bold(item.name) + '" - ' + chalk.green(item.exactMatchCount))
  })

}

getData(process.argv[2])

