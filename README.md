# calendarium
javascript library providing html markup enabling users to add calendar events to various off/online calendars


## Information

**very beta, not yet published on npm, not tested on node, watch out for dragons**

### inspired by

[addtocalendar](https://github.com/AddToCalendar/addtocalendar) but reimplemented due to [issue17](https://github.com/AddToCalendar/addtocalendar/issues/17)


## What does it look like

see also the [demo page](https://rawgit.com/birdspider/calendarium/master/demo/github.html)

![alt tag](https://raw.githubusercontent.com/birdspider/calendarium/master/demo/what-does-it-look-like.png)

This was screenshotted from the demo page. Look at the bottom to see that the link goes directly to the service, instead
of going via some 3rd party server.

## Installation


1. clone + cd cloned dir
2. exec `npm install` and `npm run-script dev`


## Minimal fuzz setup

### add markup to page i.e

dates have to be `Date.parse` or `new Date()` parseable:
[ISO-8601](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse#ECMAScript_5_ISO-8601_format_support) or [RFC2822](https://tools.ietf.org/html/rfc2822) , recommended RFC2822

```
<span class="calendarium"
  data-event-start="Mon, 05 Dec 2016 11:29:22 GMT"
  data-event-stop="Mon, 05 Dec 2016 17:59:52 GMT"
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

## Contribtion

is very welcome!
