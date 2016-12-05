'use strict';

/*
 * https://www.google.com/calendar/render
 * ?action=TEMPLATE
 * &dates=20161129T230000Z/20161203T100000Z
 * &location=somewhere
 * &text=some+title
 * &details=some+descr
 */
module.exports = function(calendarium) {

  var base = 'https://www.google.com/calendar/render?';

  // with time
  var _makeDateTime = function(datetime) {
    return datetime.toISOString().replace(/\.\d+Z$/, 'Z').replace(/[-:]/g, '');
  };

  // only day to trigger "googles" full-day representation
  var _makeDateDay = function(datetime) {
    return datetime.toISOString().split('T')[0].replace(/[-:]/g, '');
  };

  var _makeLink = function(data) {

    var dates = [data.start, data.stop];
    var dMaker = _makeDateTime;

    if (data.mode && data.mode === 'day') {
      dMaker = _makeDateDay;
      var endplus1 = new Date(data.stop);
      endplus1.setTime(endplus1.getTime() + (24 * 60 * 60 * 1000));
      dates = [data.start, endplus1];
    }

    return base + calendarium._obj2param({
      action: 'TEMPLATE'
      , dates: dates.map(dMaker).join('/')
      , location: data.location
      , text: data.title
      , details: data.description
    });
  };

  return {
    name: 'googlecalendar'
    , title: {
      'de': 'Bei Google Kalender eintragen'
      , 'en': 'Add to Google Calendar'
    }
    , text: {
      'de': 'Google Kalender'
      , 'en': 'Google Calendar'
    }
    , link: _makeLink(calendarium._getEventData())
  };
};