'use strict';

import combinatorics from 'js-combinatorics';

module.exports = {
   roomsForTwo:   combinatorics.combination(['AUS','ENG','GER','RUS','TUR','ITA','FRA'],2),
   roomsForThree: combinatorics.combination(['AUS','ENG','GER','RUS','TUR','ITA','FRA'],3),
   serviceUrl:    function() {
                    return process.env.SERVICE_URL || `https://backstabbr-bot.herokuapp.com`
                  }

}

