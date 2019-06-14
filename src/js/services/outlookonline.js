/*
 * https://outlook.live.com/owa/
 * ?path=/calendar/action/compose
 * &subject=some+title
 * &location=somewhere
 * &body=some+descr
 * &startdt=20161129T230000Z
 * &enddt=20161203T100000Z
 */
export default function (calendarium) {
  const base = 'https://outlook.live.com/owa/?'

  const _makeDate = function (datetime) {
    return datetime.toISOString().replace(/\.\d+Z$/, 'Z').replace(/[-:]/g, '')
  }

  const _makeLink = function (data) {
    return base + $.param({
      path: '/calendar/action/compose',
      startdt: _makeDate(data.start),
      enddt: _makeDate(data.stop),
      location: data.location,
      subject: data.title,
      body: data.description,
      allday: (data.mode && data.mode === 'day')
    })
  }

  return {
    name: 'outlookonline',
    title: {
      'de': 'Bei Outlook Online Kalender eintragen',
      'en': 'Add to Outlook Online Calendar'
    },
    text: {
      'de': 'Outlook Online Kalender',
      'en': 'Outlook Online Calendar'
    },
    link: _makeLink(calendarium.getEventData())
  }
}
