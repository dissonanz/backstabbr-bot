'use strict';

import combinatorics from 'js-combinatorics';

const powers = ['AUS','ENG','GER','RUS','TUR','ITA','FRA']

module.exports = {
  powers:        powers,
  roomsForTwo:   combinatorics.combination(powers,2),
  roomsForThree: combinatorics.combination(powers,3),
  serviceUrl:    function() {
                   return process.env.SERVICE_URL || `https://backstabbr-bot.herokuapp.com`
                 }

}

