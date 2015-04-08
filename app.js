#!/usr/bin/env node

var request = require('request'),
    cheerio = require('cheerio'),
    chalk = require('chalk');

var getData = function (searchText) {
    var url = 'http://search.seznam.cz/stats?q=' + searchText.split(' ').join('+');

    request(url, function (error, response, html) {
        if (!error && response.statusCode == 200) {
            var $ = cheerio.load(html);

            console.log(chalk.green('\nNejhledanější dotazy obsahující "' + searchText + '"\n'));

            $('.statsTop > table').find('tr').each(function (i) {
                if (i > 0) {
                    var keyword = $(this).find('.left');
                    var broadKeywordMatch = keyword.next();

                    console.log(i + '. "' + chalk.bold(keyword.text()) + '" - ' + chalk.green(broadKeywordMatch.text()));
                }
            });


        } else {
            console.log(error);
        }
    });
};

getData(process.argv[2]);
