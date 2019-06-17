import 'style/calendarium-plain.scss'

import log from 'loglevel'

import GoogleCalendar from './services/googlecalendar'
import YahooCalendar from './services/yahoocalendar'
import OutlookOnline from './services/outlookonline'
import Generic from './services/generic'
import ICS from './services/ics'

log.setLevel(LOG ? log.levels.DEBUG : log.levels.INFO)

const defaults = {
  theme: 'plain',

  backendUrl: null,

  lang: 'de',

  langFallback: 'en',

  services: ['googlecalendar', 'yahoocalendar', 'outlookonline', 'ics'],

  genericCallbacks: [],

  linktext: {
    'de': 'Im Kalender speichern',
    'en': 'save to calendar'
  },

  event: {
    start: new Date(),
    stop: new Date(),
    title: 'title',
    description: '',
    location: '',
    mode: 'time',
    link: ''
  }
}

class Calendarium {
  constructor (element, options = {}) {
    log.debug(options)
    this.element = element
    this.$element = $(element).empty()
    this.data = this.$element.data()
    this.event = Calendarium.prepEventData(this.data)
    this.options = { ...defaults, ...this.data, event: this.event, ...options }

    // ensure dates
    this.options.event.start = new Date(this.options.event.start)
    this.options.event.stop = new Date(this.options.event.stop)

    try {
      this.init()
    } catch (err) {
      log.error(err.message, this.element, this.options)
    }
  }

  init () {
    // optionally fetch links
    let link = ''
    switch (this.options.event.link) {
      case 'canonical':
        link = $('head > link[href][rel="canonical"]').attr('href') || global.location
        break
      case 'actual':
        link = global.location
        break
      default:
        link = this.options.event.link || ''
        break
    }

    this.options.event = {
      ...this.options.event,
      link,
      description: $.trim(this.options.event.description + '\n\n ' + link)
    }

    const availableServices = [GoogleCalendar, YahooCalendar, OutlookOnline, ICS]
      .concat(this.prepGenericCallbacks(this.options.genericCallbacks))

    const self = this

    // filter available services to those that are enabled and initialize them
    this.services = $.map(this.options.services, function (serviceName) {
      let service
      availableServices.forEach(availableService => {
        availableService = availableService(self)
        if (availableService.name === serviceName) {
          service = availableService
          return null
        }
      })
      return service
    })

    this.setup()
  }

  getLocalized (data, key) {
    if (typeof data[key] === 'object') {
      if (typeof data[key][this.options.lang] === 'undefined') {
        return data[key][this.options.langFallback]
      } else {
        return data[key][this.options.lang]
      }
    } else if (typeof data[key] === 'string') {
      return data[key]
    }
    return undefined
  }

  prepGenericCallbacks () {
    const genericCallbacks = this.options.genericCallbacks
    if (!genericCallbacks) {
      return []
    }

    const genericCallbacksArr = typeof genericCallbacks === 'string'
      ? genericCallbacks.split(',').map($.trim)
      : genericCallbacks

    return genericCallbacksArr.map(callbackName => Generic(global[callbackName]))
  }

  getEventData () {
    return this.options.event
  }

  static prepEventData (data) {
    const event = data.event && data.event[0] === '{'
      ? JSON.parse(data.event)
      : data.event || {}

    return {
      start: data.eventStart,
      stop: data.eventStop,
      title: data.eventTitle || '',
      description: data.eventDescription || '',
      location: data.eventLocation || '',
      mode: data.eventMode || '',
      link: data.eventLink || '',
      ...event
    }
  }

  setup () {
    const self = this
    const themeClass = 'calendarium-theme-' + this.options.theme

    const $element = this.$element.addClass(themeClass)

    const $addElement = $('<a href="javascript:void(0);" rel="nofollow">')
      .addClass('calendarium-link')
      .attr('tabindex', 999)
      .text(self.getLocalized(this.options, 'linktext'))

    const $buttonList = $('<ul>').addClass('calendarium-list')

    // add html for service-links
    this.services.forEach(function (service) {
      const $li = $('<li>').addClass('calendarium-item').addClass(service.name)
      const $shareText = $('<span>')
        .addClass('calendarium-text')
        .text(self.getLocalized(service, 'text'))

      const $shareLink = $('<a>')
        .addClass('calendarium-item-link')
        .attr('rel', 'nofollow')
        .attr('target', '_blank')
        .attr('title', self.getLocalized(service, 'title'))
        .attr('role', 'button')
        .attr('aria-label', self.getLocalized(service, 'title'))
        .append($shareText)

      if (typeof service.link === 'function') {
        $shareLink.on('click', service.link)
      } else {
        $shareLink.attr('href', service.link)
      }

      $li.append($shareLink)

      $buttonList.append($li)
    })

    $element
      .append($addElement)
      .append($buttonList)
  }
};

export default Calendarium

// export calendarium class to global (for non-Node users)
global.Calendarium = Calendarium

jQuery('.calendarium')
  .filter('[data-event],[data-event-start]')
  .each(function () {
    if (!this.hasOwnProperty('calendarium')) {
      this.calendarium = new Calendarium(this)
    }
  })
