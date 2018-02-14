<?php
//https://tools.ietf.org/html/rfc5545
//ics.php?start=1481032080000&stop=1481043540000&title=MineCon+2016&location=World+4
//http://severinghaus.org/projects/icv/

header("X-Robots-Tag: noindex");

define('HAS_DT_IMMUTABLE',PHP_MAJOR_VERSION > 5 || PHP_MINOR_VERSION > 5);
define('UID_RIGHT','calendarium.project');

function chunk_split_unicode($str, $l = 76, $prefix = '', $e = "\r\n") {
	// http://php.net/manual/en/function.chunk-split.php#107711
    $tmp = array_chunk(
        preg_split("//u", $str, -1, PREG_SPLIT_NO_EMPTY), $l);
    $str = "";
    foreach ($tmp as $t) {
        $str .= $prefix.join("", $t) . $e;
    }
    return trim(ltrim($str,$prefix));
}

$in = filter_input_array(INPUT_GET,array(
	'start' => array('filter' => FILTER_VALIDATE_INT,
				'flags'  => FILTER_REQUIRE_SCALAR)
	,'stop' => array('filter' => FILTER_VALIDATE_INT,
				'flags'  => FILTER_REQUIRE_SCALAR)
	,'title' => FILTER_SANITIZE_STRING
	,'location' => FILTER_SANITIZE_STRING
	,'description' => FILTER_SANITIZE_STRING
	,'mode' => FILTER_SANITIZE_ENCODED // time or day
),true);

if(empty($in)){
	ob_get_clean();
	header($_SERVER["SERVER_PROTOCOL"]." 400 Bad Request");
	die();
}

$tzUTC = new DateTimeZone('UTC');

$format = 'Ymd\THis\Z';
$formatD = 'Ymd';

$dnow = HAS_DT_IMMUTABLE
			? new DateTimeImmutable(null,$tzUTC)
			: new DateTime(null,$tzUTC);
$dnowF = $dnow->format($format);

$dstart = HAS_DT_IMMUTABLE
			? new DateTimeImmutable("@{$in['start']}",$tzUTC)
			: new DateTime("@{$in['start']}",$tzUTC);
$dstartF = $dstart->format($format);

$dstop = HAS_DT_IMMUTABLE
			? new DateTimeImmutable("@{$in['stop']}",$tzUTC)
			: new DateTime("@{$in['stop']}",$tzUTC);
$dstopF = $dstop->format($format);

if($in['mode'] === 'day'){
	$dstop = $dstop->add(new DateInterval('P1D'));
	$dstartF = $dstart->format($formatD);
	$dstopF = "DTEND:".$dstop->format($formatD);
} else {
		$dstopF = <<<EOD
DTEND:{$dstopF}
EOD;
}

$uid = 'vevent-'.md5(json_encode($in)).'@'.UID_RIGHT;
$filename = trim(substr($in['title'],0,64));
error_log($filename);

foreach(array('location','title','description') as $k)
	$in[$k] = chunk_split_unicode(preg_replace('/\s{2,}/','  ',$in[$k]),75,' ');

ob_get_clean();

header('Content-Type: text/calendar; charset=utf-8');
header("Content-Disposition: attachment; filename=\"{$filename}.ics\"");

echo <<<EOD
BEGIN:VCALENDAR\r
VERSION:2.0\r
PRODID:calendarium\r
BEGIN:VEVENT\r
UID:{$uid}\r
DTSTART:{$dstartF}\r
{$dstopF}\r
SEQUENCE:0\r
TRANSP:OPAQUE\r
LOCATION:{$in['location']}\r
SUMMARY:{$in['title']}\r
CLASS:PUBLIC\r
DESCRIPTION:{$in['description']}\r
DTSTAMP:{$dnowF}\r
END:VEVENT\r
END:VCALENDAR
EOD;
