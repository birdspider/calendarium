# calendarium
javascript library providing html markup enabling users to add calendar events to various off/online calendars


## Information

**very alpha**

**not yet published on npm**

**not tested on node**

**not tested on outlookonline or yahoo**

**watch out for dragons**

### inspired by

1. [addtocalendar](https://github.com/AddToCalendar/addtocalendar) but reimplemented due to [issue17](https://github.com/AddToCalendar/addtocalendar/issues/17)
2. [Shariff](https://github.com/heiseonline/shariff) architecture and build process

## Installation

1. clone

2. cd cloned dir

```
npm install
grunt demo
```

3. open browser on http://localhost:8080

## Minimal fuzz setup

### add markup to page i.e

dates have to be `Date.parse` or `new Date()` parseable, I recommend
[ISO-8601](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse#ECMAScript_5_ISO-8601_format_support)

```
<span class="evently col-xs-offset-1 col-xs-3"
  data-event-start="2016-12-06T14:48:00"
  data-event-stop="2016-12-06T17:59:00"
  data-event-title="MineCon 2016"
  data-event-description="server snowball fight"
  data-event-location="World 1">...loading...</span>
```

see demo/index.html for various advanced setups

### optionaly specify calendars

*yes it looks strange but that's correct quoting*

```
data-services="[&quot;googlecalendar&quot;,&quot;generic&quot;,&quot;yahoocalendar&quot;,&quot;outlookonline&quot;]"
```

### optionaly specify full day events

```
data-event-mode="day"
```
