#!/usr/bin/env node

var request = require('request'),
    cheerio = require('cheerio'),
    fs = require('fs'),
    chalk = require('chalk'),
    _ = require('underscore');

var getData = function (searchText) {
    var url = 'http://search.seznam.cz/stats?q=' + searchText.split(' ').join('+');

    request(url, function (error, response, html) {
        if (!error && response.statusCode == 200) {
            var $ = cheerio.load(html);

            console.log(chalk.green('\nNejhledanější dotazy obsahující "' + searchText + '"\n'));

            $('.statsTop > table').find('tr').each(function (i) {
                if (i > 0) {
                    var keyword = $(this).find('.left');
                    var rozsirenaShoda = keyword.next();

                    console.log(i + '. "' + chalk.bold(keyword.text()) + '" - ' + chalk.green(rozsirenaShoda.text()));
                }
            });


        } else {
            console.log(error);
        }
    });
};


getData(process.argv[2]);