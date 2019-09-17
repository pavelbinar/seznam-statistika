#!/usr/bin/env node

import request from 'request'
import cheerio from 'cheerio'
import chalk from 'chalk'
import _ from 'lodash'

const displayData = function (searchResults) {
  _.forEach(searchResults[0], function (result) {
    console.log(`"${chalk.bold(result.name)}" - ${chalk.green(result.exactMatchCount)}`)
  })
}
const getData = function (keyword) {
  const url = `https://search.seznam.cz/stats/?term=${keyword.split(' ').join('+')}`

  request(url, function (error, response, html) {
    if (!error && response.statusCode === 200) {
      const $ = cheerio.load(html)

      const scriptTagContent = $('script').last().get()[0].children[0].data
      const regex = /var termQueryData(.*);/g

      const termQueryDataString = scriptTagContent.match(regex)[0]

      const termQueryDataObject = eval(`(function(){${termQueryDataString} return termQueryData;})()`) // eslint-disable-line

      displayData(termQueryDataObject)
    } else {
      console.log(error)
    }
  })
}

getData(process.argv[2])
