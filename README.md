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

## What does it look like

![alt tag](https://raw.githubusercontent.com/birdspider/calendarium/master/demo/what-does-it-look-like.png)

This was screenshotted from the demo page. Look at the bottom to see that the link goes directly to the service, instead
of going via some 3rd party server.

<div style="background-color:#EEEEEE;padding:1em;">
<style>
.calendarium {
  position: relative;
  display: inline-block;
  background: transparent !important; }
  .calendarium a {
    text-decoration: none; }
  .calendarium-link {
    display: block;
    cursor: pointer;
    outline: none !important; }
  .calendarium-link:focus ~ ul,
  .calendarium-link:active ~ ul, .calendarium-list:hover {
    visibility: visible; }
  .calendarium-list {
    position: absolute;
    z-index: 900;
    top: 100%;
    left: 0;
    visibility: hidden;
    width: 190px; }
  .calendarium-list, .calendarium-item {
    margin: 0;
    padding: 0;
    list-style: none;
    background: #fff; }
  .calendarium-item {
    float: none;
    text-align: left; }
  .calendarium-item-link {
    display: block;
    text-decoration: none;
    outline: none; }
  .calendarium-item.hover, .calendarium-item:hover {
    background-color: #EFEFEF;
    position: relative;
    z-index: 900;
    cursor: pointer;
    outline: none; }
</style>
<span class="calendarium" data-event-start="2016-12-06T14:48:00" data-event-stop="2016-12-06T17:59:00" data-event-title="MineCon 2016" data-event-location="World 1"><a href="javascript:void(0);" rel="nofollow" class="calendarium-link">Im Kalender speichern</a><ul class="calendarium-list"><li class="calendarium-item googlecalendar"><a class="calendarium-item-link" rel="nofollow" href="https://www.google.com/calendar/render?action=TEMPLATE&amp;dates=20161206T134800Z%2F20161206T165900Z&amp;location=World+1&amp;text=MineCon+2016&amp;details=" target="_blank" title="Bei Google Kalender eintragen" role="button" aria-label="Bei Google Kalender eintragen"><span class="calendarium-text">Google Kalender</span></a></li><li class="calendarium-item yahoocalendar"><a class="calendarium-item-link" rel="nofollow" href="https://calendar.yahoo.com/?st=20161206T134800Z&amp;et=20161206T165900Z&amp;in_loc=World+1&amp;title=MineCon+2016&amp;desc=&amp;view=d&amp;v=60&amp;type=20&amp;allday=" target="_blank" title="Bei Yahoo Kalender eintragen" role="button" aria-label="Bei Yahoo Kalender eintragen"><span class="calendarium-text">Yahoo Kalender</span></a></li><li class="calendarium-item outlookonline"><a class="calendarium-item-link" rel="nofollow" href="https://outlook.live.com/owa/?rru=addevent&amp;startdt=20161206T134800Z&amp;enddt=20161206T165900Z&amp;location=World+1&amp;subject=MineCon+2016&amp;body=&amp;allday=" target="_blank" title="Bei Outlook Online Kalender eintragen" role="button" aria-label="Bei Outlook Online Kalender eintragen"><span class="calendarium-text">Outlook Online Kalender</span></a></li></ul></span>
</div>

## Installation

1. `npm -g install grunt-cli`
2. clone + cd cloned dir
3. exec `npm install` and `grunt demo`
4. open browser on http://localhost:8080

## Minimal fuzz setup

### add markup to page i.e

dates have to be `Date.parse` or `new Date()` parseable:
[ISO-8601](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse#ECMAScript_5_ISO-8601_format_support) or [RFC2822](https://tools.ietf.org/html/rfc2822) , I recommend RFC2822

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

Mind you I format the js with `js-beautify -C -s 2 -r` and the sass files with `csscomb -c "personal_fixcss.json"`.
