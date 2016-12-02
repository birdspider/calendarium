'use strict';

var $ = require('jquery');

var calendarium = function(element, options) {
  var self = this;

  this.element = element;

  $(element).empty();

  var data = $(element).data();
  var event = this._prepEventData(data);

  this.options = $.extend({}, this.defaults, data, {
    event: event
  }, options);

  // ensure dates
  this.options.event.start = new Date(this.options.event.start);
  this.options.event.stop = new Date(this.options.event.stop);

  var availableServices = [
    require('./services/googlecalendar')
    , require('./services/yahoocalendar')
    , require('./services/outlookonline')
  ].concat(this._prepGenericCallbacks(this.options.genericCallbacks));

  // filter available services to those that are enabled and initialize them
  this.services = $.map(this.options.services, function(serviceName) {
    var service;
    availableServices.forEach(function(availableService) {
      availableService = availableService(self);
      if (availableService.name === serviceName) {
        service = availableService;
        return null;
      }
    });
    return service;
  });
  this._setup();
};

calendarium.prototype = {

  defaults: {
    theme: 'plain',

    backendUrl: null,

    lang: 'de',

    langFallback: 'en',

    services: ['googlecalendar', 'yahoocalendar', 'outlookonline'],

    genericCallbacks: [],

    linktext: {
      'de': 'Im Kalender speichern'
      , 'en': 'save to calendar'
    },

    event: {
      start: new Date()
      , stop: new Date()
      , title: 'title'
      , description: ''
      , location: ''
      , mode: 'time'
    }
  },

  $element: function() {
    return $(this.element);
  },

  getLocalized: function(data, key) {
    if (typeof data[key] === 'object') {
      if (typeof data[key][this.options.lang] === 'undefined') {
        return data[key][this.options.langFallback];
      } else {
        return data[key][this.options.lang];
      }
    } else if (typeof data[key] === 'string') {
      return data[key];
    }
    return undefined;
  },

  _getEventData: function() {
    return this.options.event;
  },

  _setup: function() {
    var self = this;

    var themeClass = 'calendarium-theme-' + this.options.theme;

    var $element = this.$element().addClass(themeClass);

    var $addElement = $('<a href="javascript:void(0);" rel="nofollow">')
      .addClass('calendarium-link')
      .text(self.getLocalized(this.options, 'linktext'));

    var $buttonList = $('<ul>').addClass('calendarium-list');

    // add html for service-links
    this.services.forEach(function(service) {
      var $li = $('<li>').addClass('calendarium-item').addClass(service.name);
      var $shareText = $('<span>')
        .addClass('calendarium-text')
        .text(self.getLocalized(service, 'text'));

      var $shareLink = $('<a>')
        .addClass('calendarium-item-link')
        .attr('rel', 'nofollow')
        .attr('href', service.link)
        .attr('target', '_blank')
        .attr('title', self.getLocalized(service, 'title'))
        .attr('role', 'button')
        .attr('aria-label', self.getLocalized(service, 'title'))
        .append($shareText);

      $li.append($shareLink);

      $buttonList.append($li);
    });

    $element
      .append($addElement)
      .append($buttonList);
  },

  _obj2param: $.param,

  _prepEventData: function(data) {
    return $.extend({}
      , {
        start: data.eventStart
        , stop: data.eventStop
        , title: data.eventTitle
        , description: data.eventDescription
        , location: data.eventLocation
        , mode: data.eventMode
      }
      , (data.event && (data.event[0] === '{' && JSON.parse(data.event) || data.event) || {}));
  },

  _prepGenericCallbacks: function(genericCallbacks) {
    var self = this;

    if (!genericCallbacks || !genericCallbacks.length) {
      return [];
    }

    return (typeof genericCallbacks === 'string' ? genericCallbacks.split(',').map($.trim) : genericCallbacks)
      .map(function(callbackName) {
        console.info('Initalizing generic', callbackName);
        return require('./services/generic')(window[callbackName]);
      });
  }
};

module.exports = calendarium;

// export calendarium class to global (for non-Node users)
global.calendarium = calendarium;

// initialize .shariff elements
$('.calendarium').filter('[data-event],[data-event-start]').each(function() {
  if (!this.hasOwnProperty('calendarium')) {
    this.calendarium = new calendarium(this);
  }
});