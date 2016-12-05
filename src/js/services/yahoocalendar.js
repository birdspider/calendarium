'use strict';

/*
 * http://calendar.yahoo.com/
 * ?st=20161129T230000Z
 * &et=20161203T100000Z
 * &view=d
 * &v=60
 * &type=20
 * &title=some+title
 * &in_loc=somewhere
 * &desc=some+descrm
 */
module.exports = function(calendarium) {

  var base = 'https://calendar.yahoo.com/?';

  var _makeDate = function(datetime) {
    return datetime.toISOString().replace(/\.\d+Z$/, '').replace(/[-:]/g, '');
  };

  var _makeLink = function(data) {
    return base + calendarium._obj2param({
      st: _makeDate(data.start)
      , et: _makeDate(data.stop)
      , in_loc: data.location
      , title: data.title
      , desc: data.description
      , view: 'd'
      , v: 60
      , type: 20
      , allday: (data.mode && data.mode === 'day')
    });
  };

  return {
    name: 'yahoocalendar'
    , title: {
      'de': 'Bei Yahoo Kalender eintragen'
      , 'en': 'Add to Yahoo Calendar'
    }
    , text: {
      'de': 'Yahoo Kalender'
      , 'en': 'Yahoo Calendar'
    }
    , link: _makeLink(calendarium._getEventData())
  };
};