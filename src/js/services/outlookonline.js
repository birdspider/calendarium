'use strict';

/*
 * https://bay02.calendar.live.com/calendar/calendar.aspx
 * ?rru=addevent
 * &summary=some+title
 * &location=somewhere
 * &description=some+descr
 * &dtstart=20161129T230000Z
 * &dtend=20161203T100000Z
 */

module.exports = function(calendarium) {

  var base = 'https://bay02.calendar.live.com/calendar/calendar.aspx?';

  var _makeDate = function(datetime) {
    return datetime.toISOString().replace(/\.\d+Z$/, '').replace(/[-:]/g, '') + 'Z';
  };

  var _makeLink = function(data) {
    return base + calendarium._obj2param({
      rru: 'addevent'
      , dtstart: _makeDate(data.start)
      , dtend: _makeDate(data.stop)
      , location: data.location
      , summary: data.title
      , description: data.description
      , allday: (data.mode && data.mode === 'day')
    , });
  };

  return {
    name: 'outlookonline'
    , title: {
      'de': 'Bei Outlook Online Kalender eintragen'
      , 'en': 'Add to Outlook Online Calendar'
    }
    , text: {
      'de': 'Outlook Online Kalender'
      , 'en': 'Outlook Online Calendar'
    }
    , link: _makeLink(calendarium._getEventData())
  };
};