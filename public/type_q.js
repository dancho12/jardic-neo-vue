/*2
    json.js
    2011-08-30
    Public Domain

    No warranty expressed or implied. Use at your own risk.

    This file has been superceded by http://www.JSON.org/json2.js

    See http://www.JSON.org/js.html

    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html

    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.

    This file adds these methods to JavaScript:

        object.toJSONString(whitelist)
            This method produce a JSON text from a JavaScript value.
            It must not contain any cyclical references. Illegal values
            will be excluded.

            The default conversion for dates is to an ISO string. You can
            add a toJSONString method to any date object to get a different
            representation.

            The object and array methods can take an optional whitelist
            argument. A whitelist is an array of strings. If it is provided,
            keys in objects not found in the whitelist are excluded.

        string.parseJSON(filter)
            This method parses a JSON text to produce an object or
            array. It can throw a SyntaxError exception.

            The optional filter parameter is a function which can filter and
            transform the results. It receives each of the keys and values, and
            its return value is used instead of the original value. If it
            returns what it received, then structure is not modified. If it
            returns undefined then the member is deleted.

            Example:

            // Parse the text. If a key contains the string 'date' then
            // convert the value to a date.

            myData = text.parseJSON(function (key, value) {
                return key.indexOf('date') >= 0 ? new Date(value) : value;
            });

    This file will break programs with improper for..in loops. See
    http://yuiblog.com/blog/2006/09/26/for-in-intrigue/

    This file creates a global JSON object containing two methods: stringify
    and parse.

        JSON.stringify(value, replacer, space)
            value       any JavaScript value, usually an object or array.

            replacer    an optional parameter that determines how object
                        values are stringified for objects. It can be a
                        function or an array of strings.

            space       an optional parameter that specifies the indentation
                        of nested structures. If it is omitted, the text will
                        be packed without extra whitespace. If it is a number,
                        it will specify the number of spaces to indent at each
                        level. If it is a string (such as '\t' or '&nbsp;'),
                        it contains the characters used to indent at each level.

            This method produces a JSON text from a JavaScript value.

            When an object value is found, if the object contains a toJSON
            method, its toJSON method will be called and the result will be
            stringified. A toJSON method does not serialize: it returns the
            value represented by the name/value pair that should be serialized,
            or undefined if nothing should be serialized. The toJSON method
            will be passed the key associated with the value, and this will be
            bound to the object holding the key.

            For example, this would serialize Dates as ISO strings.

                Date.prototype.toJSON = function (key) {
                    function f(n) {
                        // Format integers to have at least two digits.
                        return n < 10 ? '0' + n : n;
                    }

                    return this.getUTCFullYear()   + '-' +
                         f(this.getUTCMonth() + 1) + '-' +
                         f(this.getUTCDate())      + 'T' +
                         f(this.getUTCHours())     + ':' +
                         f(this.getUTCMinutes())   + ':' +
                         f(this.getUTCSeconds())   + 'Z';
                };

            You can provide an optional replacer method. It will be passed the
            key and value of each member, with this bound to the containing
            object. The value that is returned from your method will be
            serialized. If your method returns undefined, then the member will
            be excluded from the serialization.

            If the replacer parameter is an array of strings, then it will be
            used to select the members to be serialized. It filters the results
            such that only members with keys listed in the replacer array are
            stringified.

            Values that do not have JSON representations, such as undefined or
            functions, will not be serialized. Such values in objects will be
            dropped; in arrays they will be replaced with null. You can use
            a replacer function to replace those with JSON values.
            JSON.stringify(undefined) returns undefined.

            The optional space parameter produces a stringification of the
            value that is filled with line breaks and indentation to make it
            easier to read.

            If the space parameter is a non-empty string, then that string will
            be used for indentation. If the space parameter is a number, then
            the indentation will be that many spaces.

            Example:

            text = JSON.stringify(['e', {pluribus: 'unum'}]);
            // text is '["e",{"pluribus":"unum"}]'


            text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
            // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

            text = JSON.stringify([new Date()], function (key, value) {
                return this[key] instanceof Date ?
                    'Date(' + this[key] + ')' : value;
            });
            // text is '["Date(---current time---)"]'


        JSON.parse(text, reviver)
            This method parses a JSON text to produce an object or array.
            It can throw a SyntaxError exception.

            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.

            Example:

            // Parse the text. Values that look like ISO date strings will
            // be converted to Date objects.

            myData = JSON.parse(text, function (key, value) {
                var a;
                if (typeof value === 'string') {
                    a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
                    }
                }
                return value;
            });

            myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
                var d;
                if (typeof value === 'string' &&
                        value.slice(0, 5) === 'Date(' &&
                        value.slice(-1) === ')') {
                    d = new Date(value.slice(5, -1));
                    if (d) {
                        return d;
                    }
                }
                return value;
            });


    This is a reference implementation. You are free to copy, modify, or
    redistribute.
*/

/*jslint evil: true, regexp: true, unparam: true */

/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
    call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, parseJSON, prototype, push, replace, slice,
    stringify, test, toJSON, toJSONString, toString, valueOf
*/


// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.


console.log('Здорово заебал! v 8');



const Log = (function (logLevel) {
    let none = function () {};
    return {
        debug: (logLevel <= 0) ? console.log.bind(console) : none,
        info: (logLevel <= 1) ? console.log.bind(console) : none,
        error: (logLevel <= 2) ? console.log.bind(console) : none
    };
})(3); // ここにログレベルを記述




var JSON;
if (!JSON) {
    JSON = {};
}

(function () {
    'use strict';

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return isFinite(this.valueOf()) ?
                this.getUTCFullYear() + '-' +
                f(this.getUTCMonth() + 1) + '-' +
                f(this.getUTCDate()) + 'T' +
                f(this.getUTCHours()) + ':' +
                f(this.getUTCMinutes()) + ':' +
                f(this.getUTCSeconds()) + 'Z' : null;
        };

        String.prototype.toJSON =
            Number.prototype.toJSON =
            Boolean.prototype.toJSON = function (key) {
                return this.valueOf();
            };
    }
    //Log.info(CloudBucketPath)
    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = { // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"': '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

        // If the string contains no control characters, no quote characters, and no
        // backslash characters, then we can safely slap some quotes around it.
        // Otherwise we must also replace the offending characters with safe escape
        // sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string' ? c :
                '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }


    function str(key, holder) {

        // Produce a string from holder[key].

        var i, // The loop counter.
            k, // The member key.
            v, // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

        // If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
            typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

        // If we were called with a replacer function, then call the replacer to
        // obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

        // What happens next depends on the value's type.

        switch (typeof value) {
            case 'string':
                return quote(value);

            case 'number':

                // JSON numbers must be finite. Encode non-finite numbers as null.

                return isFinite(value) ? String(value) : 'null';

            case 'boolean':
            case 'null':

                // If the value is a boolean or null, convert it to a string. Note:
                // typeof null does not produce 'null'. The case is included here in
                // the remote chance that this gets fixed someday.

                return String(value);

                // If the type is 'object', we might be dealing with an object or an array or
                // null.

            case 'object':

                // Due to a specification blunder in ECMAScript, typeof null is 'object',
                // so watch out for that case.

                if (!value) {
                    return 'null';
                }

                // Make an array to hold the partial results of stringifying this object value.

                gap += indent;
                partial = [];

                // Is the value an array?

                if (Object.prototype.toString.apply(value) === '[object Array]') {

                    // The value is an array. Stringify every element. Use null as a placeholder
                    // for non-JSON values.

                    length = value.length;
                    for (i = 0; i < length; i += 1) {
                        partial[i] = str(i, value) || 'null';
                    }

                    // Join all of the elements together, separated with commas, and wrap them in
                    // brackets.

                    v = partial.length === 0 ? '[]' : gap ?
                        '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' :
                        '[' + partial.join(',') + ']';
                    gap = mind;
                    return v;
                }

                // If the replacer is an array, use it to select the members to be stringified.

                if (rep && typeof rep === 'object') {
                    length = rep.length;
                    for (i = 0; i < length; i += 1) {
                        k = rep[i];
                        if (typeof k === 'string') {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                } else {

                    // Otherwise, iterate through all of the keys in the object.

                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                }

                // Join all of the member texts together, separated with commas,
                // and wrap them in braces.

                v = partial.length === 0 ? '{}' : gap ?
                    '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' :
                    '{' + partial.join(',') + '}';
                gap = mind;
                return v;
        }
    }

    // If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {

            // The stringify method takes a value and an optional replacer, and an optional
            // space parameter, and returns a JSON text. The replacer can be a function
            // that can replace values, or an array of strings that will select the keys.
            // A default replacer method can be provided. Use of the space parameter can
            // produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

            // If the space parameter is a number, make an indent string containing that
            // many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

                // If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

            // If there is a replacer, it must be a function or an array.
            // Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                (typeof replacer !== 'object' ||
                    typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

            // Make a fake root object containing our value under the key of ''.
            // Return the result of stringifying the value.

            return str('', {
                '': value
            });
        };
    }


    // If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

            // The parse method takes a text and an optional reviver function, and returns
            // a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

                // The walk method is used to recursively walk the resulting structure so
                // that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


            // Parsing happens in four stages. In the first stage, we replace certain
            // Unicode characters with escape sequences. JavaScript handles many characters
            // incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

            // In the second stage, we run the text against regular expressions that look
            // for non-JSON patterns. We are especially concerned with '()' and 'new'
            // because they can cause invocation, and '=' because it can cause mutation.
            // But just to be safe, we want to reject all unexpected forms.

            // We split the second stage into 4 regexp operations in order to work around
            // crippling inefficiencies in IE's and Safari's regexp engines. First we
            // replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
            // replace all simple value tokens with ']' characters. Third, we delete all
            // open brackets that follow a colon or comma or that begin the text. Finally,
            // we look to see that the remaining characters are only whitespace or ']' or
            // ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/
                .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                    .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                    .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

                // In the third stage we use the eval function to compile the text into a
                // JavaScript structure. The '{' operator is subject to a syntactic ambiguity
                // in JavaScript: it can begin a block or an object literal. We wrap the text
                // in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

                // In the optional fourth stage, we recursively walk the new structure, passing
                // each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function' ?
                    walk({
                        '': j
                    }, '') : j;
            }

            // If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }

    // Augment the basic prototypes if they have not already been augmented.
    // These forms are obsolete. It is recommended that JSON.stringify and
    // JSON.parse be used instead.

    // if (!Object.prototype.toJSONString) {
    // 	Object.prototype.toJSONString = function (filter) {
    // 		return JSON.stringify(this, filter);
    // 	};
    // 	Object.prototype.parseJSON = function (filter) {
    // 		return JSON.parse(this, filter);
    // 	};
    // }
}());


function catchlog(err) {
    var vDebug = "";
    for (var prop in err) {
        vDebug += "property: " + prop + " value: [" + err[prop] + "]\n";
    }
    vDebug += "toString(): " + " value: [" + err.toString() + "]";
    Log.info(vDebug);
}


// lesson level variables

var ENABLE_TYPE = true;
var donelesson = false;
var planets_type = false;
var steponesc = false;
var esctimerid;
var esc_script;
var esc_line;
var kewala_ext_ani = null;
var challenger_ext_ani = null;
var challenge_started = false;
var challenge_flag1;
var challenge_flag2;
var challenge_dir;
var dir = null;
var challenge_strokes;
var kewala_won;
var TrailMap = null;
var ScrollText = "";
var HadSpeedTest = 'False';
var nspeed = 0.0;
var speed = "0";
var naccuracy = 0.0;
var accuracy = "0";
var goal = "25";
var LastLineTotalKeyTime = 0;
var LastLineTotalCharCount = 0;
var TotalLessonTime = 0;
var tqkbdef;
var tqmapdef;
var mapkeylist = new Array();
var maparray = new Array();
var usespan = new Array();
var mapindex = new Array();
var currmapchars = "";
var mapspacedtext;
var mapunspacedtext;
var mapspaced_index;
var jsounds = new Array();
var ghostonly = false;
var godsv11; // sound over pairtest
var ghostlist;
var lastkey;
var recordkey = new Array();
var LineStrokes = 0;
var LineErrors = 0;
var totalkeycount = 0;
var totalerrcount = 0;
var totalerrtime = 0;
var totalkeytime = 0;
var LineTotKeyTime = 0;
var StimulusCount = 0;
var CollectWeakWords = false;
var WeakWordList = new Array();
var WeakDisplayCount = 0;
var TotalWeakCount = 0;
var worstkey = "";
var prevworstkey = "";
var LessonProgress;
var LessonTimeToComplete;
var LessonType;
var LastCapslockState = false;
var IsKeypadLesson = false;
var lastkeytime;
var lastbasekeytomatch;
var lastkeytomatch;
var lastnormkey;
var IsTQP = true;
var IsTFSExtLesson = false;
var ghostkeys = new Array(10);
var ghostsequence = new Array(10);
var ghostreplace = new Array(10);
var ghostplaycount;
var ghostcount;
var ghostcurrent;
var playinghands = false;
var playhands_max = 3;
var playtimerid;
var prevkey;
var prevkeytomatch;
var pairtestkeycount = 0;
var minihands = false;
var pair_test = false;
var speed_test = false;
var accuracy_test = false;
var maptext_test = false;
var minitimerid;
var IsHenkan = false;
var IsAltMapTextLesson = false;
var kanjiindex;
var otherindex;
var altstimtext;
var altmaptext;
var buttonshidden = false;

//タイピングテスト用変数
var IsTest = false;
var IsStarted = false;

var ScoreValid = true; //TFSスコア加算あり


var MINIXPOS_OFFSET = 72; //ミニキーボードX表示位置オフセット
var MINIYPOS_OFFSET = 35; //ミニキーボードY表示位置オフセット
var SCORETEXT_MAXWIDTH = 110; //TFSスコア表示最大幅


var StartTime;
var EndTime;
var ErrStreak = false; //連続のエラー
var inProgress = false; //練習中かどうか
var canSkip = false; //スキップ可能かどうか
var isSatisfy = false; //スキップの条件を満たしたかどうか
var suspend = false;
var tmpresult; //checkpoint、weaktest前までの成績
var statusLineLife = 0;
var tmpSeed = 0;
var skipLesson = false; //条件を満たした場合にスキップ
//タイピングテスト終了時
//var skipDance = false;
var curr_item;
var maxErrorRate = 0; //キー毎の最悪の正解率


var mapaniFlag = false; //TFS開始時のマップ
var danceaniFlag = false; //TFS終了時のダンス
var TimeOutID = ""; //タイマーID
var minikbd_shown = false;
var largekbd_shown = false;


// Arrays of keys and hands preset
var LeftPairHands = new Array(9);
var LPHNames = ["lhand1", "lhand2", "lhand3", "lhand4", "lhand5", "lhand6", "lhand32", "lhand42", "lhand52"];
var RightPairHands = new Array(9);
var RPHNames = ["rhand1", "rhand2", "rhand3", "rhand4", "rhand5", "rhand6", "rhand32", "rhand42", "rhand52"];
var NormalKeys = new Array(5);
var NKNames = ["keysbl", "keysrd", "keysor", "keysgr", "keysgy"];
var TabKeys = new Array(2);
var TKNames = ["keytbl", "keytgy"];
var CapsLockKeys = new Array(1);
var CLKNames = ["keyclgy"];
var LShiftKeys = new Array(2);
var LSKNames = ["keyshbl", "keyshgy"];
var LSKUKNames = ["keysbl", "keysgy"];
var RShiftKeys = new Array(2);
var RSKNames = ["keyshbl", "keyshgy"];
var LAltKeys = new Array(2);
var LAKNames = ["keyalbl", "keyalgy"];
var RAltKeys = new Array(2);
var RAKNames = ["keyalbl", "keyalgy"];
var LCtlKeys = new Array(2);
var LCKNames = ["keyctbl", "keyctgy"];
var RCtlKeys = new Array(2);
var RCKNames = ["keyctbl", "keyctgy"];
var SpaceBarKeys = new Array(2);
var SBKNames = ["keyspdr", "keyspgy"];
var EnterKeys = new Array(2);
var EKNames = ["keyenbl", "keyengy"];
var KpadLngKeys = new Array(2);
var KpadLngNames = ["kpdlngbl", "kpdlnggr"];
var KpadWdKeys = new Array(2);
var KpadWdNames = ["kpdwdgr", "kpdwdrd"];

var key_div = null;
var deaddiv = null;
var lshiftdiv = null;
var rshiftdiv = null;
var gagdiv = null;
var gatdiv = null;
var graltdiv = null;

// Preferences
var DoWPM = true;
var TargetSpeed = 25;
var TestPeriod = 120;
var Audience = "formal";
var DoErrorBeep = true;
var DoControlSounds = true;
var DoOtherSounds = true;
var UseEnterKey = false;
var SingleSpace = false;
var Score = 0;
var PrefKeyboard = "uskbd";


var PlayKey = new Array();
var KbdSoundBase = "/keyboards/keysounds/";
var LocalKeyboard = "/keyboards/layouts/keyboards/";
var KbdGhostBase = "/keyboards/hands/";
var minikeyscale = 0.5;
var minikeytopscale = 0.49;
var keytopscale = 0.98;
var keysoundsequence = new Array(4);
var keysoundfiles = new Array();
var keysoundcount = 0;
var keysoundmax = 0;

var minikeys = "";

var keytimeouttimerid;
var keytimeoutactive = false;
var keytimeoutcount = 0;
var kewalatimeoutactive = null;
var kewalaperiods = [100, 600, 1200, 6000];
var kewalacurrtimecount = 0;
var kewalaperiodsindex = 0;

// internal data
var dummy;
var needscolour;

var draw_scale;
var draw_xoff;
var draw_region;
var draw_region_stylesheet;
var draw_region_canvas;
var draw_region_context;
var sound_suffix;
var keyframe_prefix;
var browser = 0;
var edgebrowser = false;
var ua = navigator.userAgent.toLowerCase();
Log.info("useragent=" + ua);
var bname = navigator.appName.toLowerCase();
Log.info("apname=" + bname);
var bver = navigator.appVersion.toLowerCase();
Log.info("appversion=" + bver);
var platver = navigator.platform.toString().toLowerCase();
Log.info("platform=" + navigator.platform.toString());

/*
var NONE = 0;
var 1 = 1; //firefox
var 2 = 2; //safariwin
var 3 = 3; //chrome
var 4 = 4; //msie10
var 5 = 5; //safariipad
var 6 = 6; //safarimac
var 7 = 7; //opera
*/
var isipad = false;
var tempevent;
var fireonthis;
var hidden_div;
var hidden_text;

// audio information extracted from object list
//fields extracted from audio definitions indexed by audio definition name
var audio_def_item_offset = new Array(); // offset in audio_objects of first audio file for this definition
var audio_def_item_count = new Array(); // count of audio files in this definition
var audio_def_count = 0; // count of audio definitions
// storage for audio objects
var audio_object = new Array(); // complete list of all html5 audio objects across all audio definitions
var audio_url = new Array(); // set true when this object has been loaded
var audio_loaded = new Array(); // set true when this object has been loaded
var audio_count = 0; // count of all audio files


// image information extracted from object list
//fields extracted from image definitions indexed by image definition name
var image_def_item_offset = new Array(); // offset in image_objects of first image file for this definition
var image_def_item_count = new Array(); // count of images in this definition
var image_def_div = new Array(); // used for internally generated images like the keyboard. Visiblity controlle by the "hidden" attribute on the div
var image_def_stylesheet = new Array(); // used for internally generated images like the keyboard
var image_def_istimed = new Array(); // true if timed-images, false if static-images
var image_def_count = 0; // count of image object definitions
// storage for image objects and attributes indexed by offset from 0
var image_object = new Array(); //array of Image() objects initialised when a "load" is done
var image_url = new Array();
var image_x = new Array();
var image_y = new Array();
var image_size = new Array(); // for static objects needing sizing
var image_z = new Array(); // used only for internally generated images
var image_a = new Array(); // used only for internally generated images
var image_s = new Array(); // used only for internally generated images
var image_period = new Array();
var image_count = 0;
var image_timestep = new Array();
var image_is_waiting = new Array();
var image_is_loaded = new Array();
var image_canvas = new Array();
var image_context = new Array();
var image_signtext = new Array();
var image_sign_x = new Array();
var image_sign_y = new Array();
var image_sign_fontsize = new Array();
var image_sign_width = new Array();
var image_sign_height = new Array();
var image_sign_align = new Array();
var image_sign_colour = new Array();
var image_sign_nowrap = new Array();

// audio animation extracted from list
//fields extracted from audio animations indexed by animation name
var audio_ani_id = new Array(); // id of audio_objectcontrolled by this definition
var audio_ani_selection = new Array(); // how sounds are selected during animation (default) sequential or random
var audio_ani_playcount = new Array(); // repitition factor (default) 1 or n (0 = infinite)
var audio_ani_foreground = new Array(); // should run (default=false) background or foreground
var audio_ani_object_playing = new Array(); // offset into audio_object for currently playing sound
var audio_ani_script = new Array();
var audio_ani_curr_scr_item = new Array();
var audio_ani_count = 0; // count of audio definitions

// static image animation extracted from list
//fields extracted from static image animations indexed by animation name
var static_image_ani_id = new Array(); // id of image_objectcontrolled by this definition
var static_image_ani_selection = new Array(); // how images are selected during animation (default) sequential or random
var static_image_ani_playcount = new Array(); // repitition factor (default) 1 or n (0 = infinite)
var static_image_ani_foreground = new Array(); // should run (default=false) background or foreground
var static_image_ani_object_playing = new Array(); // offset into image_object for currently playing image
var static_image_ani_stylesheet = new Array();
var static_image_ani_x = new Array();
var static_image_ani_y = new Array();
var static_image_ani_z = new Array();
var static_image_ani_div = new Array();
var static_image_ani_canvas = new Array();
var static_image_ani_context = new Array();
var static_image_ani_script = new Array();
var static_image_ani_curr_scr_item = new Array();
var static_image_ani_action = new Array();
var static_image_ani_visible = new Array();
var static_image_ani_postcard = new Array();
var static_image_ani_count = 0; // count of image definitions
var static_image_ani_atend = new Array();

// moving image animation extracted from list
//fields extracted from moving image animations indexed by animation name
var moving_image_ani_object = new Array(); // object which contains the path objects as children
var moving_image_ani_id = new Array(); // id of image_objectcontrolled by this definition
var moving_image_ani_selection = new Array(); // how images are selected during animation (default) sequential or random
var moving_image_ani_playcount = new Array(); // repitition factor (default) 1 or n (0 = infinite)
var moving_image_ani_played = new Array(); // number of times played during current animation
var moving_image_ani_foreground = new Array(); // should run (default=false) background or foreground
var moving_image_ani_object_playing = new Array(); // offset into image_object for currently playing image
var moving_image_ani_path_playing = new Array(); // offset into animation defintion for currently playing path
var moving_image_ani_iteration = new Array(); // increments per path restart of animation
var moving_image_ani_stylesheet = new Array();
var moving_image_ani_stylesheet_text = new Array();
var moving_image_ani_z = new Array();
var moving_image_ani_div = new Array();
var moving_image_ani_div_text = new Array();
var moving_image_ani_canvas = new Array();
var moving_image_ani_context = new Array();
var moving_image_ani_script = new Array();
var moving_image_ani_curr_scr_item = new Array();
var moving_image_ani_action = new Array();
var moving_image_ani_visible = new Array();
var moving_image_ani_timestep = new Array();
var moving_image_ani_postcard = new Array();
var moving_image_ani_count = 0; // count of image definitions
var moving_image_ani_atend = new Array();

// key driven static image animation extracted from list
//fields extracted from static image animations indexed by animation name
var key_static_image_ani_id = new Array(); // id of image_objectcontrolled by this definition
var key_static_image_ani_selection = new Array(); // how images are selected during animation (default) sequential or random
var key_static_image_ani_playcount = new Array(); // repitition factor (default) 1 or n (0 = infinite)
var key_static_image_ani_foreground = new Array(); // should run (default=false) background or foreground
var key_static_image_ani_object_playing = new Array(); // offset into image_object for currently playing image
var key_static_image_ani_stylesheet = new Array();
var key_static_image_ani_x = new Array();
var key_static_image_ani_y = new Array();
var key_static_image_ani_z = new Array();
var key_static_image_ani_div = new Array();
var key_static_image_ani_canvas = new Array();
var key_static_image_ani_context = new Array();
var key_static_image_ani_script = new Array();
var key_static_image_ani_curr_scr_item = new Array();
var key_static_image_ani_action = new Array();
var key_static_image_ani_visible = new Array();
var key_static_image_ani_postcard = new Array();
var key_static_image_ani_count = 0; // count of key image animation definitions
var key_static_image_ani_active_list = new Array();
var key_static_image_ani_active_count = 0;

// key driven moving image animation extracted from list
//fields extracted from moving image animations indexed by animation name
var key_moving_image_ani_object = new Array(); // object which contains the path objects as children
var key_moving_image_ani_id = new Array(); // id of image_objectcontrolled by this definition
var key_moving_image_ani_selection = new Array(); // how images are selected during animation (default) sequential or random
var key_moving_image_ani_playcount = new Array(); // repetition factor (default) 1 or n (0 = infinite)
var key_moving_image_ani_played = new Array(); // number of times played during current animation
var key_moving_image_ani_foreground = new Array(); // should run (default=false) background or foreground
var key_moving_image_ani_object_playing = new Array(); // offset into image_object for currently playing image
var key_moving_image_ani_path_playing = new Array(); // offset into animation defintion for currently playing path
var key_moving_image_ani_curr_path_duration = new Array(); // # keystrokes max in currently playing path
var key_moving_image_ani_curr_path_count = new Array(); // # keystrokes done in currently playing path
var key_moving_image_ani_stylesheet = new Array();
var key_moving_image_ani_x0 = new Array(); // for current path
var key_moving_image_ani_x1 = new Array(); // for current path
var key_moving_image_ani_y0 = new Array(); // for current path
var key_moving_image_ani_y1 = new Array(); // for current path
var key_moving_image_ani_s0 = new Array(); // for current path
var key_moving_image_ani_s1 = new Array(); // for current path
var key_moving_image_ani_path_offset = new Array();
var key_moving_image_ani_z = new Array();
var key_moving_image_ani_div = new Array();
var key_moving_image_ani_canvas = new Array();
var key_moving_image_ani_context = new Array();
var key_moving_image_ani_script = new Array();
var key_moving_image_ani_curr_scr_item = new Array();
var key_moving_image_ani_action = new Array();
var key_moving_image_ani_visible = new Array();
var key_moving_image_ani_atend = new Array();
var key_moving_image_ani_currscale = new Array();
var key_moving_image_ani_timestep = new Array();
var key_moving_image_ani_count = 0; // count of image definitions
var key_moving_image_ani_signtext = new Array();
var key_moving_image_ani_sign_x = new Array();
var key_moving_image_ani_sign_y = new Array();
var key_moving_image_ani_sign_fontsize = new Array();
var key_moving_image_ani_sign_width = new Array();
var key_moving_image_ani_sign_height = new Array();
var key_moving_image_ani_prey2 = new Array();
var key_moving_image_ani_prey_duration = new Array();
var key_moving_image_ani_prey_key_count = new Array();
var key_moving_image_ani_prey2fx = new Array();
var key_moving_image_ani_postcard = new Array();

var key_moving_image_ani_active_list = new Array(); // list of currently active moving key animations (compact)
var key_moving_image_ani_active_count = 0; // count of active moving key animations

var d0;

var predator_line = false;
var predator_running = false;
var predator_stop_count = 0;



// Utility functions
var TEXT_LINE_LENGTH = 40;

/** Localised list of words we are not allowed to automatically create */
var sNaughtyWords;

/** Whether a period should be followed by one or two spaces */
var bOneSpace = true;

/** Keyboard control array for determining character mix for 2, 3 or 4
 *  characters in a pairtest */
var sKeyBoardPairTests = new Array(
    "1212 2121 1221 1212 2121", // 2 Key Practice
    "1212 2132 1232 2321", // 3 Key Practice
    "1231 2132 2341 2421" // 4 Key Practice
);

/** Keypad control array for determining character mix for 2, 3 or 4
 *  characters in a pairtest */
var sKeyPadPairTests = new Array(
    "1212 1121 2211 2121 2121 1212 2112 1211", // 2 Key Practice
    "1232 3132 1312 1232 3132 1312" // 3 Key Practice
);

/** Note: The following are all used by the English specific word generator.
 * In the event that we want to create more language specific generators then
 * we would need to create localised versions of the following. */
/** All the characters on the left hand: English */
var sIsLeftHand = "abcdefgqrstvwxzABCDEFGQRSTVWXZ12345`~!@#$%áéäëàèâêÁÉÄËÀÈÂÊ°|°";
/** All the characters on the right hand: English */
var sIsRightHand = "hijklmnopuyHIJKLMNOPUY67890 ;',.?()/^&*()_+=-\"íóúýïöüÿìòùîôûÍÓÚÝÏÖÜÌÒÙÎÔÛñÑ¿¡{[]}";
/** All the uppercase characters: English */
var sIsUpperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZÁÉÄËÀÈÂÊÍÓÚÝÏÖÜÌÒÙÎÔÛÑ";
/** All the lowercase characters: English */
var sIsLowerCase = "abcdefghijklmnopqrstuvwxyzáéäëàèâêíóúýïöüÿìòùîôûñ";
/** All of the punctuation characters: English */
var sIsPunctuation = ".',;:!?()&{[]}¿¡°+-_/@";
/** All of the digits */
var sIsDigit = "0123456789";
/** All of the vowels: English */
var sIsVowel = "aeiouAEIOU";
/** All of the characters that can appear in pairs: English */
var sIsOKDouble = "CEGLOPRST";

/**
 * Method used to determine if a character is on the left hand.
 * <br/><br/>
 * @param aChar Character to check
 * @return TRUE if the character is on the left hand
 */
function isLeftHand(aChar) {
    return (-1 != sIsLeftHand.indexOf(aChar));
}

/**
 * Method used to determine if a character is on the right hand.
 * <br/><br/>
 * @param aChar Character to check
 * @return TRUE if the character is on the right hand
 */
function isRightHand(aChar) {
    return (-1 != sIsRightHand.indexOf(aChar));
}

/**
 * Method used to randomise a string.
 * <br/><br/>
 * @param sSrc String to randomise
 * @return Scrambled string
 */
function scramble(sSrc) {
    //Log.info("scramble is called");
    var iIndex;
    var sTmp = "";
    var iLength = sSrc.length;
    var chSrc = new Array();

    // Copy the source string so that we can randomize it
    for (iIndex = 0; iIndex < iLength; iIndex++) {
        chSrc[iIndex] = sSrc.charAt(iIndex);
    }

    // Randomize the string
    for (iIndex = iLength - 1; 0 < iIndex; iIndex--) {
        var iRand = (Math.random() * 1009).toFixed(0) % iLength;
        var aChar = chSrc[iIndex];
        var bChar = chSrc[iRand];

        chSrc[iIndex] = bChar;
        chSrc[iRand] = aChar;
    }

    // Copy the random array back to the temporary string
    for (iIndex = 0; iIndex < iLength; iIndex++) {
        sTmp = sTmp + chSrc[iIndex];
    }

    // And return it
    return sTmp;
}

/**
 * Method called at start up, after loading the RES class, to retrieve the
 * list of naughty words that we don't want the text mixer to ever produce.
 * <br/><br/>
 * @param sBadWordList Comma separated list of words not to generate
 */
function loadNaughtyWords(sBadWordList) {
    //Log.info("loadNaughtyWords is called");
    var iIndex;
    var iLetter;

    // Split the word list up
    sNaughtyWords = sBadWordList.split(",");

    // And then go through and reduce every letter in every word by one
    for (iIndex = 0; iIndex < sNaughtyWords.length; iIndex++) {
        var sWord = sNaughtyWords[iIndex];
        var sNewWord = "";
        for (iLetter = 0; iLetter < sWord.length; iLetter++) {
            var chLetter = sWord.charAt(iLetter);
            if ('A' == chLetter) {
                chLetter = 'Z';
            } else if ('a' == chLetter) {
                chLetter = 'z';
            } else {
                if (sIsUpperCase.indexOf(chLetter) > 0) {
                    chLetter = sIsUpperCase.charAt(sIsUpperCase.indexOf(chLetter) - 1);
                } else {
                    chLetter = sIsLowerCase.charAt(sIsLowerCase.indexOf(chLetter) - 1);
                }
            }
            sNewWord += chLetter;
        }
        if (0 != sNewWord.length) {
            sNaughtyWords[iIndex] = sNewWord;
        }
    }
}

/**
 * Method used to veto some anglo-saxon words always, and some for specific
 * languages. Vocabulary should always be encrypted.
 * <br/><br/>
 * @param sWord Word to check for naughtiness
 * @return true if the word is a naughty one
 */
function NaughtyWord(sWord) {
    //Log.info("NaughtyWord is called");
    var iIndex;
    for (iIndex = 0; iIndex < sNaughtyWords.length; iIndex++) {
        if (-1 != sWord.toLowerCase().indexOf(sNaughtyWords[iIndex])) {
            return true;
        }
    }
    return false;
}

/**
 * Method used to check for one vowel, no tripples and only permitted doubles
 * and max of two adjacent consonants.
 * <br/><br/>
 * @param sWordIn Word to check for goodness
 * @param nConsonants Number of consonants available in the mix
 * @param nVowels Number of vowels available in the mix
 * @return true if the word is a malformed one
 */
function BadWord(sWordIn, nConsonants, nVowels) {
    //Log.info("BadWord is called");
    var sWord = sWordIn.toLowerCase();
    // Do we have a vowel in this word
    var bNoVowel = true;
    // Number of consonants and vowels in a run
    var iConsonants = 0;
    var iVowels = 0;
    // The previous two characters in the string
    var aChar1 = " ";
    var aChar2 = " ";
    var iIndex;

    for (iIndex = 0; iIndex < sWord.length; iIndex++) {
        var aChar = sWord.charAt(iIndex);

        if (-1 != sIsVowel.indexOf(aChar)) {
            iConsonants = 0;
            bNoVowel = false;
            if ((0 != nConsonants) && (iVowels++ >= 2)) {
                return true;
            }
        } else {
            iVowels = 0;
            if (-1 != sIsPunctuation.indexOf(aChar)) {
                if (iConsonants++ >= 2) {
                    return true;
                }
            }
        }

        // Check to see if we have multiples of a letter
        if (aChar == aChar1) {
            // If we have three in a row then this is definitely bad
            if (aChar == aChar2) {
                return true;
            }

            // Otherwise see if it is a permissible double
            if (-1 == sIsOKDouble.indexOf(aChar)) {
                return true;
            }
        }

        // Still OK, so save the char
        aChar2 = aChar1;
        aChar1 = aChar;
    }

    return (0 == nVowels) ? false : bNoVowel;
}


/**
 * Method used to generate random text for English language lessons.
 * <br/><br/>
 * This is meant to be a cleverer algorithm for generating words are more
 * like real English words.
 * <br/><br/>
 * @param sLessonChars Characters to generate the words from
 * @return Random words
 */
function generate2(sLessonChars) {
    //Log.info("generate2 is called");
    var bPunctuation = true;
    var sPunctuation = "";
    var sDigits = "";
    var sUpperCase = "";
    var sLowerCase = "";
    var sPreviousWord = "";
    var sOutput = "";
    var iMaxLength = TEXT_LINE_LENGTH;
    var iMaxLoop = 100;
    var iLoopCount = 0;
    var iRightHand = 0;
    var iLeftHand = 0;
    var iVowels = 0;
    var aChar;
    var iIndex;

    // Make sure we don't have any arithmetic symbols or the enter or tab key
    if ((-1 != sLessonChars.indexOf("\n")) ||
        (-1 != sLessonChars.indexOf("\t"))) {
        return " ";
    }

    // First analyze the input string
    for (iIndex = 0; iIndex < sLessonChars.length; iIndex++) {
        aChar = sLessonChars.charAt(iIndex);
        if (-1 != sIsDigit.indexOf(aChar)) {
            sDigits = sDigits + aChar;
        } else if (-1 != sIsPunctuation.indexOf(aChar)) {
            sPunctuation = sPunctuation + aChar;
        } else {
            if (-1 != sIsVowel.indexOf(aChar)) {
                ++iVowels;
            }
            if (isLeftHand(aChar)) {
                ++iLeftHand;
            } else if (isRightHand(aChar)) {
                ++iRightHand;
            } else {
                return " ";
            }
            if (-1 != sIsUpperCase.indexOf(aChar)) {
                sUpperCase = sUpperCase + aChar;
            } else if (-1 != sIsLowerCase.indexOf(aChar)) {
                sLowerCase = sLowerCase + aChar;
            }
        }
    }
    // Compute the number of consonants
    var iLetterCount = sLowerCase.length + sUpperCase.length;
    var iConsonants = sLowerCase.length + sUpperCase.length - iVowels;
    var iCharacters = sLowerCase.length + sUpperCase.length + sDigits.length;
    // It is possible the mix is made entirely of non-alpha characters, in that
    // case make the number of consonants and characters equal to the string
    // length
    if (0 == iCharacters) {
        iConsonants = sLessonChars.length;
        iCharacters = sLessonChars.length;
        sLowerCase = sLessonChars;
    }

    while (sOutput.length < iMaxLength) {
        var iChar = ((Math.round(Math.random() * 32767)) % iCharacters) - sDigits.length;
        var sWord = "";
        // Make sure we haven't gotten into some sort of infinite loop
        if (iLoopCount++ > iMaxLoop) {
            break;
        }
        if (iChar < 0) {
            var iLetters = 1 + ((Math.round(Math.random() * 32767)) % 3);
            if (iLetters > sDigits.length) {
                iLetters = 1 + (iLetters % sDigits.length);
            }
            while (0 != iLetters--) {
                sWord = sWord + sDigits.charAt((Math.round(Math.random() * 32767)) % sDigits.length);
            }
        } else {
            var nLetters = 1 + ((Math.round(Math.random() * 32767)) % 3);
            do {
                var iLetters2;
                sWord = "";
                if ((0 == nLetters) || (0 == (iLoopCount & 15))) {
                    nLetters = 3 + ((Math.round(Math.random() * 32767)) % 3);
                }
                iLetters2 = nLetters;
                if (iChar < (sUpperCase.length * 3)) {
                    // Make the first letter uppercase
                    sWord = sWord + sUpperCase.charAt((Math.round(Math.random() * 32767)) % sUpperCase.length);
                    // Determine whether to fill the rest with lowercase
                    // or uppercase characters
                    var bUppercase = (0 == (Math.round(Math.random() * 32767) % iLetterCount));
                    // And fill the remainder of the word
                    while (0 != --iLetters2) {
                        if (bUppercase) {
                            sWord = sWord + sUpperCase.charAt((Math.round(Math.random() * 32767) % sUpperCase.length));
                        } else {
                            sWord = sWord + sLowerCase.charAt((Math.round(Math.random() * 32767) % sLowerCase.length));
                        }
                    }
                } else {
                    // Fill the remainder of the word with lowercase
                    // characters
                    while (0 <= --iLetters2) {
                        sWord = sWord + sLowerCase.charAt((Math.round(Math.random() * 32767) % sLowerCase.length));
                    }
                }
            } while ((iLoopCount++ < iMaxLoop) && BadWord(sWord, iConsonants, iVowels));
        }
        // Make sure we don't have the same word twice in a row
        if (sPreviousWord.indexOf(sWord) >= 0) {
            // We do, so try again
            continue;
        }
        sPreviousWord = sWord;
        // Next make sure that the word isn't a naughty one or one that is
        // malformed
        if (NaughtyWord(sWord) || BadWord(sWord, iConsonants, iVowels)) {
            continue;
        }
        // See if we should add a punctuation, we never have two '.' in a
        // row so if we just added one to the end of the last word then we
        // can't add another one after this word
        if (bPunctuation) {
            bPunctuation = false;
        } else if (0 != sPunctuation.length) {
            var iPunctuationIndex = ((Math.round(Math.random() * 32767)) % (sPunctuation.length + 1));
            if (0 != iPunctuationIndex) {
                var aPunctuationChar = sPunctuation.charAt(iPunctuationIndex);
                sWord = sWord + aPunctuationChar + ' ';
                if ('.' == aPunctuationChar) {
                    bPunctuation = true;
                    // If we are in two spaces mode then add a space now so that we end
                    // up with two of them
                    if (!bOneSpace) {
                        sOutput += ' ';
                    }
                }
            } else {
                sWord += ' ';
            }
        } else {
            sWord += ' ';
        }
        // Otherwise add the word and a space
        sOutput = sOutput + sWord;
    }
    // Finally return the output string
    if (sOutput.charAt(sOutput.length - 1) == " ") {
        sOutput = sOutput.substr(0, sOutput.length - 1);
    }
    return sOutput;
}

function generatenum(sDigits, iMaxLength, iNumberLength) {
    //Log.info("generatenum is called");
    var sOutput = "";
    var lastword = "";
    var newword;

    // See if we have a '-' or a '.'
    var bHaveMinus = (-1 != sDigits.indexOf("-"));
    var bHaveDecimal = (-1 != sDigits.indexOf("."));

    // Make sure we don't have any arithmetic symbols or the enter or tab key
    if ((-1 != sDigits.indexOf("+")) ||
        (-1 != sDigits.indexOf("*")) ||
        (-1 != sDigits.indexOf("/")) ||
        (-1 != sDigits.indexOf("\n")) ||
        (-1 != sDigits.indexOf("\t"))) {
        return "";
    }
    // Now make numbers until we have reached the minimum string length
    while (true) {
        // We need to get groups of iNumberLength characters at a time
        var iRemainingChars = iNumberLength;
        // And we can only have one decimal in a number
        var bHadDecimal = false;
        var iNewChars = 0;
        newword = "";
        while (0 != iRemainingChars) {
            var iWord = (Math.round(Math.random() * 32767) % sDigits.length);
            var chTemp = sDigits.charAt(iWord);
            if (iNumberLength == iRemainingChars) {
                // Always need a number before a decimal
                if ('.' == chTemp) {
                    continue;
                }
            } else {
                // Only one decimal in a number and never as the last digit either
                if ('.' == chTemp) {
                    if (bHadDecimal || (1 == iRemainingChars)) {
                        continue;
                    }
                    bHadDecimal = true;
                } else if ('-' == chTemp) {
                    continue;
                }
            }

            // The digit is OK so add it
            newword += chTemp;
            iNewChars++;
            --iRemainingChars;
        }
        if (newword == lastword)
            continue;
        sOutput += newword;
        lastword = newword;
        // Always add a space between number groups. The code will expect the user to press the Enter key.
        if (sOutput.length >= iMaxLength) {
            break;
        }
        sOutput += ' ';
    }
    return sOutput;
}



function GenerateKeyboardPairTest(sChars) {
    //Log.info("GenerateKeyboardPairTest is called");
    var sPairTest = "";
    var sSourceList;
    var sKeyBoardPairTests = [
        "1212 2121 1221 1212 2121", // 2 Key Practice
        "1212 2132 1232 2321", // 3 Key Practice
        "1231 2132 2341 2421" // 4 Key Practice
    ];

    switch (sChars.length) {
        case 2:
        case 3:
        case 4:
            sSourceList = sKeyBoardPairTests[sChars.length - 2];
            break;
        default:
    }

    var iIndex;

    for (iIndex = 0; iIndex < sSourceList.length; iIndex++) {
        var chCurrent = sSourceList.charAt(iIndex);
        if (' ' == chCurrent) {
            if (IsKeypadLesson) {
                sPairTest = sPairTest + "\r";
            } else {
                sPairTest = sPairTest + ' ';
            }
        } else {
            sPairTest = sPairTest + sChars.charAt(chCurrent.charCodeAt(0) - 49);
        }
    }
    //Log.info(sPairTest);
    return sPairTest;
}



var CharsDone = 0;
var trail_div;
var trail_canvas;
var trail_context;
var trail_stylesheet;

//TFS マップ波線のパラメータ
var hz1 = 2; //周期1
var rh1 = 4; //ギザギザ度合い1
var hz2 = parseInt(5 + 7 * Math.random()); //周期2
var rh2 = 6 * Math.random(); //ギザギザ度合い2
var plot = 10; //折れ間隔


function SetTrailMap(chars) {
    //TFS マップの描画
    //Log.info("SetTrailMap("+chars+") is called");

    var TrailStartX = 50;
    var TrailStartY = 435;
    var TrailEndX = 170;
    var TrailEndY = 400;

    var x;
    var y;
    var dx;
    var dy;
    var endx;
    var endy;
    var lineWidth = 1;

    if (image_def_item_offset["TrailMap1"] == null) {
        return;
    }

    if (SingleSpace) {
        var priod_count = 0;
        var pos = chars.indexOf('. ');

        while (pos !== -1) {
            chars += "x";
            pos = chars.indexOf('. ', pos + 1)
        }
    }

    if (chars != '0') {
        CharsDone += chars.length;
    }
    Log.info("SetTrailMap CharsDone: " + CharsDone);

    if (CharsDone > LessonCharCount) {
        CharsDone = LessonCharCount;
    }
    widthX = TrailEndX - TrailStartX;
    dx = widthX / LessonCharCount;
    endX = TrailStartX + dx * CharsDone;
    widthY = TrailEndY - TrailStartY;
    dy = widthY / LessonCharCount;
    endY = TrailStartY + dy * CharsDone;

    if (trail_div != null) {
        try {
            trail_div.removeChild(trail_canvas);
        } catch (e) {

        }
    } else {
        trail_div = document.createElement("div");
        trail_div.id = "div-trail";
        trail_stylesheet = document.createStyleSheet();
        trail_stylesheet.addRule("#canvas-trail", "z-index: 10020; position: absolute; left: 0px; top: 0px;");
        draw_region.appendChild(trail_div);
    }
    trail_canvas = document.createElement("canvas");
    trail_canvas.id = "canvas-trail";
    trail_canvas.width = 640;
    trail_canvas.height = 480;
    trail_context = trail_canvas.getContext("2d");
    trail_div.appendChild(trail_canvas);

    trail_context.lineWidth = lineWidth;
    trail_context.strokeStyle = "black";

    trail_context.beginPath();
    trail_context.moveTo(TrailStartX, TrailStartY);



    for (x = TrailStartX, y = TrailStartY; x < endX + 1; x++) {
        if (parseInt(TrailEndX - x) % plot != 0) {
            continue;
        }
        if (x > TrailEndX) {
            x = TrailEndX;
        }
        y = (x - TrailStartX) * widthY / widthX - rh1 * Math.sin((x - TrailStartX) * hz1 * 2 * Math.PI / widthX) + rh2 * Math.sin((x - TrailStartX) * hz2 * 2 * Math.PI / widthX) + TrailStartY;
        //Log.info("x:y   "+x+":"+y);
        trail_context.lineTo(x, y);
    }
    trail_context.stroke();

    trail_context.lineWidth = 2;
    trail_context.strokeStyle = "blue";
    trail_context.beginPath();
    trail_context.moveTo(TrailStartX - 3, TrailStartY - 3);
    trail_context.lineTo(TrailStartX + 4, TrailStartY + 4);
    trail_context.stroke();
    trail_context.beginPath();
    trail_context.moveTo(TrailStartX - 4, TrailStartY + 2);
    trail_context.lineTo(TrailStartX + 4, TrailStartY - 3);
    trail_context.stroke();


    trail_context.strokeStyle = "blue";
    trail_context.beginPath();
    trail_context.moveTo(TrailEndX - 2, TrailEndY - 3);
    trail_context.lineTo(TrailEndX + 4, TrailEndY + 2);
    trail_context.stroke();
    trail_context.beginPath();
    trail_context.moveTo(TrailEndX - 4, TrailEndY + 4);
    trail_context.lineTo(TrailEndX + 4, TrailEndY - 3);
    trail_context.stroke();

}



function SetChallengeParams() {
    //TFS強化レッスン 設定
    //Log.info("SetChallengeParams is called");
    var i = 0;
    var x = 300.0;
    if (LastLineTotalCharCount > 0) {
        x = LastLineTotalKeyTime / LastLineTotalCharCount; //前行での平均速度
    }
    var y;
    // count the number of keystrokes kewala will take
    challenge_strokes = 0;
    var ani_obj = key_moving_image_ani_object[kewala_ext_ani];
    var kewala_char_count = 0;
    //Log.info(ani_obj.childNodes.length);
    for (i = 1; i < ani_obj.childNodes.length; i += 2) {
        var obj = ani_obj.childNodes.item(i);
        //Log.info(ani_obj.childNodes.item(i));
        kewala_char_count += parseInt(obj.getAttribute("data-tqani-period"));
        //Log.info(i + ":" + kewala_char_count);
    }

    var ChallengerTransitTime = kewala_char_count * x * 1.1; //相手のスピード キワラの前行平均の1.1倍
    // find the time totals in the challenger paths
    x = 0;
    ani_obj = moving_image_ani_object[challenger_ext_ani];
    dir = ani_obj.getAttribute("data-tqscr-dir");
    if (dir != null) {
        challenge_dir = dir;
    } else {
        challenge_dir = "up";
    }
    var flag1 = ani_obj.getAttribute("data-tqscr-flag1");
    if (flag1 != null) {
        challenge_flag1 = parseInt(flag1);
    } else {
        challenge_flag1 = 0;
    }
    var flag2 = ani_obj.getAttribute("data-tqscr-flag2");
    if (flag2 != null) {
        challenge_flag2 = parseInt(flag2);
    } else {
        challenge_flag2 = 0;
    }
    for (i = 1; i < ani_obj.childNodes.length; i += 2) {
        var obj = ani_obj.childNodes.item(i);
        x += parseInt(obj.getAttribute("data-tqani-period"));
    }
    var scale_factor = ChallengerTransitTime / x / 1000.0;
    for (i = 1; i < ani_obj.childNodes.length; i += 2) {
        var obj = ani_obj.childNodes.item(i);
        var oldtime = parseInt(obj.getAttribute("data-tqani-period"));
        var newtime = Math.round(oldtime * scale_factor);
        obj.setAttribute("data-tqani-period", newtime.toString());
        //Log.info(newtime);
    }
}

// Prototypes
var StaticImageTimestep = function (id) {
    this.id = id;
};

StaticImageTimestep.prototype.start = function (d0) {
    setTimeout(function (me) {
        try {
            var id = me.id;
            var script = static_image_ani_script[id];
            var curr_scr_item = static_image_ani_curr_scr_item[id];
            var action = static_image_ani_action[id];
            var foreground = static_image_ani_foreground[id];
            var obj = image_object[static_image_ani_object_playing[id]];
            var rep = static_image_ani_playcount[id];
            var offset = static_image_ani_object_playing[id];
            offset -= image_def_item_offset[static_image_ani_id[id]];
            var prevoffset = offset;
            if (rep < 0) {
                // being asked to stop
                obj = null;
                rep = null;
                offset = null;
                prevoffset = null;
                selection = null;
                return;
            }
            var selection = static_image_ani_selection[id];
            if (selection == "random") {
                offset = Math.round(Math.random() * image_def_item_count[static_image_ani_id[id]]);
                if (offset >= image_def_item_count[static_image_ani_id[id]]) {
                    offset--;
                }
            } else if (selection == "sequential") {
                offset++;
                if (offset >= (image_def_item_count[static_image_ani_id[id]])) {
                    // check for end of display sequence
                    if (rep == 1) {
                        // completed sequence
                        if (!static_image_ani_visible[id] && (static_image_ani_atend[id] == null)) {
                            try {
                                static_image_ani_div[id].removeChild(static_image_ani_div[id].firstChild);
                                draw_region.removeChild(static_image_ani_div[id]);
                            } catch (e) {}
                        }
                        var foreground1 = static_image_ani_foreground[id];
                        static_image_ani_object_playing[id] = -1;
                        if (foreground1) {
                            process_script(static_image_ani_script[id], eval(static_image_ani_curr_scr_item[id] + 1).toString());
                        }
                        foreground1 = null;
                        obj = null;
                        rep = null;
                        offset = null;
                        prevoffset = null;
                        selection = null;
                        return;
                    }
                    if (rep > 0) {
                        rep--;
                        static_image_ani_playcount[id] = rep;
                    }
                    offset = 0;
                }
            }
            offset += image_def_item_offset[static_image_ani_id[id]];
            static_image_ani_object_playing[id] = offset;
            image_object[offset].setAttribute("ani_id", id);
            image_object[offset].setAttribute("obj_offset", offset);
            static_image_ani_stylesheet[id].removeRule(0);
            static_image_ani_canvas[id] = document.createElement("canvas");
            static_image_ani_canvas[id].id = "canvas-" + id;
            static_image_ani_canvas[id].width = image_object[offset].width * 2;
            static_image_ani_canvas[id].height = image_object[offset].height * 2;
            static_image_ani_context[id] = static_image_ani_canvas[id].getContext("2d");
            static_image_ani_context[id].drawImage(image_object[offset], 0, 0);
            var st = image_signtext[offset];
            if (st != null) {
                if (image_sign_colour[offset] != null) {
                    static_image_ani_context[id].fillStyle = image_sign_colour[offset];
                }
                static_image_ani_context[id].font = (image_sign_fontsize[offset]).toString() + "pt " + font_name;
                if (image_sign_align[offset] != null) {
                    static_image_ani_context[id].align = image_sign_align[offset];
                }
                var x = parseInt(image_sign_x[offset]);
                var y = parseInt(image_sign_y[offset]);
                if (x < 0) {
                    wrapText(static_image_ani_context[id], image_signtext[offset], 0, parseInt(image_sign_fontsize[offset]) + 5,
                        image_sign_width[offset], image_sign_fontsize[offset] + 5, image_sign_nowrap[offset]);
                } else {
                    wrapText(static_image_ani_context[id], image_signtext[offset], x, y,
                        image_sign_width[offset], image_sign_fontsize[offset] + 5, image_sign_nowrap[offset]);
                }
            }
            try {
                static_image_ani_div[id].removeChild(static_image_ani_div[id].firstChild);
            } catch (e) {}
            static_image_ani_div[id].appendChild(static_image_ani_canvas[id]);
            if (image_def_item_count[static_image_ani_id[id]] > 1) {
                static_image_ani_stylesheet[id].addRule("#canvas-" + id, "z-index: " + static_image_ani_z[id] + "; position: absolute; left: " + image_x[offset] + "px; top: " + image_y[offset] + "px;");
                if (image_period[offset] && image_period[offset] != "0") {
                    d0 = parseInt(image_period[offset]);
                    var t = new StaticImageTimestep(id);
                    t.start(d0);
                    //setTimeout(function(){static_image_period_completed_handler(id); id=null; d0=null;}, d0);
                }
            } else {
                static_image_ani_stylesheet[id].addRule("#canvas-" + id, "z-index: " + static_image_ani_z[id] + "; position: absolute; left: " + static_image_ani_x[id] + "px; top: " + static_image_ani_y[id] + "px;");
            }
            obj = null;
            rep = null;
            offset = null;
            prevoffset = null;
            selection = null;
            id = null;
            t = null;
        } catch (e) {
            catchlog(e);
        }
    }, d0, this);
};

var MovingImageTimestep = function (id) {
    this.id = id;
};

MovingImageTimestep.prototype.start = function (d0) {
    setTimeout(function (me) {
        var id = me.id;
        var offset = moving_image_ani_object_playing[id];
        if (offset < 0) {
            if (!moving_image_ani_visible[id] && (moving_image_ani_atend[id] == null)) {
                try {
                    if (moving_image_ani_div[id].firstChild != null) {
                        moving_image_ani_div[id].removeChild(moving_image_ani_div[id].firstChild);
                    }
                    if (moving_image_ani_playcount[id] == 0) {
                        draw_region.removeChild(moving_image_ani_div[id]);
                    }
                } catch (eee) {}
            }
            return; // the object is no longer being animated
        }
        offset -= image_def_item_offset[moving_image_ani_id[id]];
        var prevoffset = offset;
        if ((++offset) >= image_def_item_count[moving_image_ani_id[id]]) {
            offset = 0;
        }
        offset += image_def_item_offset[moving_image_ani_id[id]];
        moving_image_ani_object_playing[id] = offset;
        // swap images now
        var old = moving_image_ani_div[id].firstChild;
        try {
            moving_image_ani_div[id].insertBefore(image_object[offset], old);
            moving_image_ani_div[id].removeChild(old);
        } catch (e) {}

        if (image_period[offset] && image_period[offset] != "0") {
            d0 = parseInt(image_period[offset]);
            var t = new MovingImageTimestep(id);
            t.start(d0);
        }
    }, d0, this);
};

var KeyMovingImageTimestep = function (id) {
    this.id = id;
};

KeyMovingImageTimestep.prototype.start = function (d0) {
    try {
        setTimeout(function (me) {
            var id = me.id;
            if (!image_def_istimed[key_moving_image_ani_id[id]]) {
                return;
            }
            var offset = key_moving_image_ani_object_playing[id];
            if (offset < 0) {
                if (!key_moving_image_ani_visible[id] && (key_moving_image_ani_atend[id] == null)) {
                    try {
                        if (key_moving_image_ani_div[id].firstChild != null) {
                            key_moving_image_ani_div[id].removeChild(key_moving_image_ani_div[id].firstChild);
                        }
                        if (key_moving_image_ani_playcount[id] == 0) {
                            draw_region.removeChild(key_moving_image_ani_div[id]);
                        }
                    } catch (e) {}
                }
                return; // the object is no longer being animated
            }
            offset -= image_def_item_offset[key_moving_image_ani_id[id]];
            var prevoffset = offset;
            if ((++offset) >= image_def_item_count[key_moving_image_ani_id[id]]) {
                offset = 0;
            }
            offset += image_def_item_offset[key_moving_image_ani_id[id]];
            key_moving_image_ani_object_playing[id] = offset;
            // swap images
            var s = key_moving_image_ani_currscale[id];
            var ix = image_x[offset] * s;
            var iy = image_y[offset] * s;
            key_moving_image_ani_canvas[id] = document.createElement("canvas");
            key_moving_image_ani_canvas[id].id = "canvas-" + id;
            key_moving_image_ani_context[id] = key_moving_image_ani_canvas[id].getContext("2d");
            var st = key_moving_image_ani_signtext[id];
            if (st != null) {
                var sf = Math.round(parseInt(key_moving_image_ani_sign_fontsize[id]) * s);
                var sx = key_moving_image_ani_sign_x[id] * 2 * s + ix;
                var sy = key_moving_image_ani_sign_y[id] * 2 * s + iy;
                if (sx < 0) {
                    key_moving_image_ani_canvas[id].width = image_object[offset].width * 2 * s;
                    key_moving_image_ani_canvas[id].height = image_object[offset].height * 2 * s;
                    key_moving_image_ani_context[id].drawImage(image_object[offset], -sx, -sy, image_object[offset].width * s, image_object[offset].height * s);
                    key_moving_image_ani_context[id].font = (sf).toString() + "pt " + font_name;
                    key_moving_image_ani_context[id].fillText(st, 0, sf + 5);
                } else {
                    key_moving_image_ani_canvas[id].width = image_object[offset].width * 2 * s + 1;
                    key_moving_image_ani_canvas[id].height = image_object[offset].height * 2 * s + 1;
                    key_moving_image_ani_context[id].drawImage(image_object[offset], ix, iy, image_object[offset].width * s, image_object[offset].height * s);
                    key_moving_image_ani_context[id].font = (sf).toString() + "pt " + font_name;
                    key_moving_image_ani_context[id].fillText(st, sx, sy);
                }
            } else {
                key_moving_image_ani_canvas[id].width = image_object[offset].width * 2 * s + 1;
                key_moving_image_ani_canvas[id].height = image_object[offset].height * 2 * s + 1;
                key_moving_image_ani_context[id].drawImage(image_object[offset], ix, iy, image_object[offset].width * s, image_object[offset].height * s);
            }
            try {
                key_moving_image_ani_div[id].removeChild(key_moving_image_ani_div[id].firstChild);
            } catch (ee) {}
            key_moving_image_ani_div[id].appendChild(key_moving_image_ani_canvas[id]);

            if (image_period[offset] && image_period[offset] != "0") {
                d0 = parseInt(image_period[offset]);
                var t = new KeyMovingImageTimestep(id);
                t.start(d0);
            }
        }, d0, this);
    } catch (e) {
        catchlog(e);
    }
};

// timer handlers

function silent_delay_handler(script, curr_scr_item, id, action, selection, playcount, foreground) {
    // behaves like an audio completed event for foreground audios when DoOtherSounds is false

    process_script(script, eval(curr_scr_item + 1).toString());
    return;
}

function cursortimer_handler() {
    cursordiv.focus();
}

function script_delay_handler(script, curr_scr_item) {

    process_script(script, eval(curr_scr_item + 1).toString());
}

function audio_delay_handler(script, curr_scr_item, id, action, selection, playcount, foreground) {
    audio_ani_script[id] = script;
    audio_ani_curr_scr_item[id] = curr_scr_item;
    start_audio(script, curr_scr_item, id, action, selection, playcount, foreground);
}

function static_image_delay_handler(script, curr_scr_item, id, action, selection, playcount, foreground, visible) {
    static_image_ani_script[id] = script;
    static_image_ani_curr_scr_item[id] = curr_scr_item;
    start_static_image(script, curr_scr_item, id, action, selection, playcount, foreground, visible);
}

function moving_image_delay_handler(script, curr_scr_item, id, action, selection, playcount, foreground, visible) {
    moving_image_ani_script[id] = script;
    moving_image_ani_curr_scr_item[id] = curr_scr_item;
    start_moving_image(script, curr_scr_item, id, action, selection, playcount, foreground, visible);
}

var lastflipkey = null;

function flipminikeys_handler() {
    //Log.info("flipminikeys_handler is called");
    var key;
    try {
        key = stimulus_text.charAt(stimulus_index);

        if (key == " ") {
            if (IsKeypadLesson) {
                key = "Enter";
            } else {
                key = "Spacebar";
            }
        }
        if (IsHenkan) {
            if (key == "*") {
                key = "Spacebar";
            } else {
                return false;
            }
        }

        if (lastflipkey != null && key != lastflipkey && key_div != null) {
            if (browser == 4) {
                key_div.style.visibility = "visible";
                if (!IsKeypadLesson) {
                    if (lshiftdiv != null) {
                        lshiftdiv.style.visibility = "visible";
                        rshiftdiv.style.visibility = "visible";
                    }
                }
                if (deaddiv != null) {
                    deaddiv.style.visibility = "visible";
                    gagdiv.style.visibility = "visible";
                    gatdiv.style.visibility = "visible";
                    graltdiv.style.visibility = "visible";
                }
            } else {
                key_div.hidden = false;
                if (!IsKeypadLesson) {
                    if (lshiftdiv != null) {
                        lshiftdiv.hidden = false;
                        rshiftdiv.hidden = false;
                    }
                }
                if (deaddiv != null) {
                    deaddiv.hidden = false;
                    gagdiv.hidden = false;
                    gatdiv.hidden = false;
                    graltdiv.hidden = false;
                }
            }
            lastflipkey = null;
        }
        var fkey = lastkey;
        var dodeaddiv = false;
        var dolshiftdiv = false;
        var dorshiftdiv = false;
        var dogagdiv = false;
        var dogatdiv = false;
        var dograltdiv = false;
        if (findkey(key, "name")) {
            fkey = lastkey;
            key_div = image_def_div["mk" + mk_check(key)];
        } else if (findkey(key, "sname")) {
            //Shiftキー点滅
            fkey = lastkey;
            key_div = image_def_div["mk" + mk_check(fkey.getAttribute("name"))];
            if (fkey.getAttribute("hand_side") == "left") {
                dorshiftdiv = true;
            } else {
                dolshiftdiv = true;
            }
        } else if (findkey(key, "usdname")) {
            fkey = lastkey;
            key_div = image_def_div["mk" + mk_check(fkey.getAttribute("name"))];
            dodeaddiv = true;
        } else if (findkey(key, "usdsname")) {
            fkey = lastkey;
            key_div = image_def_div["mk" + mk_check(fkey.getAttribute("name"))];
            dodeaddiv = true;
            if (fkey.getAttribute("hand_side") == "left") {
                dorshiftdiv = true;
            } else {
                dolshiftdiv = true;
            }
        } else if (findkey(key, "sdname")) {
            fkey = lastkey;
            key_div = image_def_div["mk" + mk_check(fkey.getAttribute("name"))];
            dodeaddiv = true;
            dolshiftdiv = true;
        } else if (findkey(key, "sdsname")) {
            fkey = lastkey;
            key_div = image_def_div["mk" + mk_check(fkey.getAttribute("name"))];
            dodeaddiv = true;
            dolshiftdiv = true;
            if (fkey.getAttribute("hand_side") == "left") {
                dorshiftdiv = true;
            } else {
                dolshiftdiv = true;
            }
        } else if (findkey(key, "gatname")) {
            fkey = lastkey;
            key_div = image_def_div["mk" + mk_check(fkey.getAttribute("name"))];
            dogatdiv = true;
            dograltdiv = true;
        } else if (findkey(key, "gagname")) {
            fkey = lastkey;
            dogagdiv = true;
            dograltdiv = true;
        } else if (findkey(key, "gatsname")) {
            fkey = lastkey;
            key_div = image_def_div["mk" + mk_check(fkey.getAttribute("name"))];
            dogatdiv = true;
            dograltdiv = true;
            if (fkey.getAttribute("hand_side") == "left") {
                dorshiftdiv = true;
            } else {
                dolshiftdiv = true;
            }
        } else if (findkey(key, "gagsname")) {
            fkey = lastkey;
            key_div = image_def_div["mk" + mk_check(fkey.getAttribute("name"))];
            dogagdiv = true;
            dograltdiv = true;
            if (fkey.getAttribute("hand_side") == "left") {
                dorshiftdiv = true;
            } else {
                dolshiftdiv = true;
            }
        }
        if (browser == 4) {
            if (key_div != null) {
                if (key_div.style.visibility == "hidden") {
                    if (!pair_test) {
                        key_div.style.visibility = "visible";
                        if (dolshiftdiv) {
                            lshiftdiv.style.visibility = "visible";
                        }
                        if (dorshiftdiv) {
                            rshiftdiv.style.visibility = "visible";
                        }
                        if (dodeaddiv) {
                            deaddiv.style.visibility = "visible";
                        }
                        if (dogagdiv) {
                            gagdiv.style.visibility = "visible";
                        }
                        if (dogatdiv) {
                            gatdiv.style.visibility = "visible";
                        }
                        if (dograltdiv) {
                            graltdiv.style.visibility = "visible";
                        }
                    }
                } else {
                    if (!pair_test) {
                        key_div.style.visibility = "hidden";
                        if (dolshiftdiv) {
                            lshiftdiv.style.visibility = "hidden";
                        }
                        if (dorshiftdiv) {
                            rshiftdiv.style.visibility = "hidden";
                        }
                        if (dodeaddiv) {
                            deaddiv.style.visibility = "hidden";
                        }
                        if (dogagdiv) {
                            gagdiv.style.visibility = "hidden";
                        }
                        if (dogatdiv) {
                            gatdiv.style.visibility = "hidden";
                        }
                        if (dograltdiv) {
                            graltdiv.style.visibility = "hidden";
                        }
                    }
                    lastflipkey = key;
                }
            }
        } else {
            if (key_div != null) {
                if (key_div.hidden) {
                    if (!pair_test) {
                        key_div.hidden = false;
                        if (dolshiftdiv) {
                            lshiftdiv.hidden = false;
                        }
                        if (dorshiftdiv) {
                            rshiftdiv.hidden = false;
                        }
                        if (dodeaddiv) {
                            deaddiv.hidden = false;
                        }
                        if (dogagdiv) {
                            gagdiv.hidden = false;
                        }
                        if (dogatdiv) {
                            gatdiv.hidden = false;
                        }
                        if (dograltdiv) {
                            graltdiv.hidden = false;
                        }
                    }
                } else {
                    key_div.hidden = true;
                    if (dolshiftdiv) {
                        lshiftdiv.hidden = true;
                    }
                    if (dorshiftdiv) {
                        rshiftdiv.hidden = true;
                    }
                    if (dodeaddiv) {
                        deaddiv.hidden = true;
                    }
                    if (dogagdiv) {
                        gagdiv.hidden = true;
                    }
                    if (dogatdiv) {
                        gatdiv.hidden = true;
                    }
                    if (dograltdiv) {
                        graltdiv.hidden = true;
                    }
                    lastflipkey = key;
                }
            }
        }
    } catch (e) {
        catchlog(e);
    }
}

function skipPlayingHands() {
    try {
        if (!ghostonly) {
            stop_audio_object(godsv11);
        }
        clearInterval(playtimerid);
        playinghands = false;
        if (browser == 4) {
            image_def_div["ghost0"].style.visibility = "hidden";
            image_def_div["ghost1"].style.visibility = "hidden";
        } else {
            image_def_div["ghost0"].hidden = true;
            image_def_div["ghost1"].hidden = true;
        }
        for (var i = ghostcount - 1; i > 0; i--) {
            if (browser == 4) {
                image_def_div[ghostkeys[i].getAttribute("obj_id")].style.visibility = "hidden";
            } else {
                image_def_div[ghostkeys[i].getAttribute("obj_id")].hidden = true;
            }
            prevkey = ghostsequence[i];
            if (prevkey != null) {
                unhighlight(prevkey.getAttribute("name"), prevkey, false);
            }
        }
        if (ghostonly) {

            process_script(lesson_script, eval(lesson_item + 1).toString());
            return;
        }
        playcount = 0;
        lastkey = null;
        prevkey = null;
        stimulus_index = 0;
        highlight(stimulus_text.charAt(0), prevkey, lastkey, true);
        startpairtestfield();
    } catch (e) {
        catchlog(e);
    }
}

function skipMapAnimation() {
    try {
        stop_audio("BeatFX");
        status_line.textContent = "";
        process_script('main_script', lesson_item + 1);

    } catch (e) {
        catchlog(e);
    }
}

function skipDanceAnimation() {
    try {
        stop_audio("danceFX");
        stop_moving_image_animation("kewaladancingani", false)
        //			skipDance = true;
        process_script('main_script', lesson_item + 1);

    } catch (e) {
        catchlog(e);
    }
}


function playhands_handler() {
    //Log.info(ghostkeys);
    try {
        var offset;

        ghostcurrent++;

        if (ghostcurrent < ghostcount) {
            offset = parseInt(ghostkeys[ghostcurrent].getAttribute("obj_offset"));
            if (!image_is_loaded[offset]) {
                ghostcurrent--;
                return; // let more time pass while loading
            }
            var id = ghostkeys[ghostcurrent].getAttribute("obj_id");
            if (ghostcurrent > 2) {
                prevkey = ghostsequence[ghostcurrent - 1];
                prevkeytomatch = prevkey.getAttribute("name");
            } else {
                prevkey = null;
            }
            lastkeytomatch = ghostsequence[ghostcurrent].getAttribute("name");
            // undo previous position
            if (ghostreplace[ghostcurrent - 1] == -2 || ghostreplace[ghostcurrent - 1] == -1) {
                if (ghostcurrent > 3) {
                    show_largekbd();
                    unhighlight(ghostsequence[ghostcurrent - 2].getAttribute("name"), ghostsequence[ghostcurrent - 2], false);
                    unhighlight(ghostsequence[ghostcurrent - 1].getAttribute("name"), ghostsequence[ghostcurrent - 1], false);
                }
                if (browser == 4) {
                    image_def_div[ghostkeys[ghostcurrent - 2].getAttribute("obj_id")].style.visibility = "hidden";
                    image_def_div[ghostkeys[ghostcurrent - 1].getAttribute("obj_id")].style.visibility = "hidden";
                    if (!IsKeypadLesson) {
                        image_def_div["ghost0"].style.visibility = "visible";
                    }
                    image_def_div["ghost1"].style.visibility = "visible";
                } else {
                    image_def_div[ghostkeys[ghostcurrent - 2].getAttribute("obj_id")].hidden = true;
                    image_def_div[ghostkeys[ghostcurrent - 1].getAttribute("obj_id")].hidden = true;
                    if (!IsKeypadLesson) {
                        image_def_div["ghost0"].hidden = false;
                    }
                    image_def_div["ghost1"].hidden = false;
                }
            } else if (ghostreplace[ghostcurrent - 1] >= 0) {
                if (ghostcurrent > 2) {
                    unhighlight(ghostsequence[ghostcurrent - 1].getAttribute("name"), ghostsequence[ghostcurrent - 1], false);
                }
                if (browser == 4) {
                    image_def_div[ghostkeys[ghostcurrent - 1].getAttribute("obj_id")].style.visibility = "hidden";
                    if (!IsKeypadLesson) {
                        image_def_div["ghost0"].style.visibility = "visible";
                    }
                    image_def_div["ghost1"].style.visibility = "visible";
                } else {
                    image_def_div[ghostkeys[ghostcurrent - 1].getAttribute("obj_id")].hidden = true;
                    if (!IsKeypadLesson) {
                        image_def_div["ghost0"].hidden = false;
                    }
                    image_def_div["ghost1"].hidden = false;
                }
            }
            // do new position
            if (ghostreplace[ghostcurrent] >= 0) {
                if (ghostsequence[ghostcurrent].getAttribute("hand_side") == "left") {
                    if (browser == 4) {
                        image_def_div["ghost0"].style.visibility = "hidden";
                    } else {
                        image_def_div["ghost0"].hidden = true;
                    }
                } else {
                    if (browser == 4) {
                        image_def_div["ghost1"].style.visibility = "hidden";
                    } else {
                        image_def_div["ghost1"].hidden = true;
                    }
                }
                if (browser == 4) {
                    image_def_div[ghostkeys[ghostcurrent].getAttribute("obj_id")].style.visibility = "visible";
                } else {
                    image_def_div[ghostkeys[ghostcurrent].getAttribute("obj_id")].hidden = false;
                }
                if (ghostcurrent > 1) {
                    highlight(ghostsequence[ghostcurrent].getAttribute("name"), null, ghostsequence[ghostcurrent], false);
                }
            } else if (ghostreplace[ghostcurrent] == -11) {
                ;
            } else if (ghostreplace[ghostcurrent] == -1) {
                if (browser == 4) {
                    image_def_div["ghost0"].style.visibility = "hidden";
                    image_def_div[ghostkeys[ghostcurrent].getAttribute("obj_id")].style.visibility = "visible";
                } else {
                    image_def_div["ghost0"].hidden = true;
                    image_def_div[ghostkeys[ghostcurrent].getAttribute("obj_id")].hidden = false;
                }
                if (ghostcurrent > 1) {
                    highlight(ghostsequence[ghostcurrent].getAttribute("sname"), null, ghostsequence[ghostcurrent], false);
                }
            } else if (ghostreplace[ghostcurrent] == -2) {
                if (browser == 4) {
                    image_def_div["ghost1"].style.visibility = "hidden";
                    image_def_div[ghostkeys[ghostcurrent].getAttribute("obj_id")].style.visibility = "visible";
                } else {
                    image_def_div["ghost1"].hidden = true;
                    image_def_div[ghostkeys[ghostcurrent].getAttribute("obj_id")].hidden = false;
                }
                if (ghostcurrent > 1) {
                    highlight(ghostsequence[ghostcurrent].getAttribute("sname"), null, ghostsequence[ghostcurrent], false);
                }
            } else if (ghostreplace[ghostcurrent] == -3) {
                if (browser == 4) {
                    image_def_div["ghost0"].style.visibility = "hidden";
                    image_def_div["ghost1"].style.visibility = "visible";
                    image_def_div[ghostkeys[ghostcurrent].getAttribute("obj_id")].style.visibility = "visible";
                } else {
                    image_def_div["ghost0"].hidden = true;
                    image_def_div["ghost1"].hidden = false;
                    image_def_div[ghostkeys[ghostcurrent].getAttribute("obj_id")].hidden = false;
                }
                if (ghostcurrent > 1) {
                    highlight(ghostsequence[ghostcurrent].getAttribute("name"), null, ghostsequence[ghostcurrent], false);
                    show_largekbd_s();
                }
            } else if (ghostreplace[ghostcurrent] == -5) {
                if (browser == 4) {
                    image_def_div["ghost1"].style.visibility = "hidden";
                    if (!IsKeypadLesson) {
                        image_def_div["ghost0"].style.visibility = "visible";
                    }
                    image_def_div[ghostkeys[ghostcurrent].getAttribute("obj_id")].style.visibility = "visible";
                } else {
                    image_def_div["ghost1"].hidden = true;
                    if (!IsKeypadLesson) {
                        image_def_div["ghost0"].hidden = false;
                    }
                    image_def_div[ghostkeys[ghostcurrent].getAttribute("obj_id")].hidden = false;
                }
                if (ghostcurrent > 1) {
                    show_largekbd_s();
                    highlight(ghostsequence[ghostcurrent].getAttribute("name"), null, ghostsequence[ghostcurrent], false);
                }
            } else if (ghostreplace[ghostcurrent] == -4) {
                if (browser == 4) {
                    image_def_div["ghost0"].style.visibility = "hidden";
                    image_def_div["ghost1"].style.visibility = "hidden";
                    image_def_div[ghostkeys[ghostcurrent].getAttribute("obj_id")].style.visibility = "visible";
                } else {
                    image_def_div["ghost0"].hidden = true;
                    image_def_div["ghost1"].hidden = true;
                    image_def_div[ghostkeys[ghostcurrent].getAttribute("obj_id")].hidden = false;
                }
                if (ghostcurrent > 1) {
                    highlight(ghostsequence[ghostcurrent].getAttribute("name"), null, ghostsequence[ghostcurrent], false);
                }
            }
            return;
        }

        for (var i = ghostcount - 1; i > 0; i--) {
            if (browser == 4) {
                image_def_div[ghostkeys[i].getAttribute("obj_id")].style.visibility = "hidden";
            } else {
                image_def_div[ghostkeys[i].getAttribute("obj_id")].hidden = true;
            }
            prevkey = ghostsequence[i];
            if (prevkey != null) {
                unhighlight(prevkey.getAttribute("name"), prevkey, false);
            }
        }

        if (playcount < playhands_max) {
            playcount++;
            ghostcurrent = 1;
            if (browser == 4) {
                if (!IsKeypadLesson) {
                    image_def_div["ghost0"].style.visibility = "visible";
                }
                image_def_div["ghost1"].style.visibility = "visible";
            } else {
                if (!IsKeypadLesson) {
                    image_def_div["ghost0"].hidden = false;
                }
                image_def_div["ghost1"].hidden = false;
            }
            return;
        }
        clearInterval(playtimerid);
        playinghands = false;
        if (browser == 4) {
            image_def_div["ghost0"].style.visibility = "hidden";
            image_def_div["ghost1"].style.visibility = "hidden";
        } else {
            image_def_div["ghost0"].hidden = true;
            image_def_div["ghost1"].hidden = true;
        }
        if (ghostonly) {


            process_script(lesson_script, eval(lesson_item + 1).toString());
            return;
        }
        playcount = 0;
        lastkey = null;
        prevkey = null;
        stimulus_index = 0;
        highlight(stimulus_text.charAt(0), prevkey, lastkey, true);
        startpairtestfield();

        //Log.info("startpairtestfield is called");
    } catch (e) {
        catchlog(e);
    }
}

function keytimer_handler() {
    //Log.info("keytimer_handler is called");
    if (keytimeoutactive) {
        if ((++keytimeoutcount) > 5) { //タイムアウトの時間
            keytimeoutactive = false;
            if (!speed_test) {
                status_line.textContent = "";
            }
        }
    }
    if (kewalatimeoutactive != null) {
        if ((++kewalacurrtimecount) > kewalaperiods[kewalaperiodsindex]) {
            kewalacurrtimecount = 0;
            kewalaperiodsindex = (++kewalaperiodsindex) % kewalaperiods.length;
            start_audio("", 0, "timeoutsFX", "start", audio_ani_selection["timeoutsFX"], "1", null);
        }
    }
}


// listeners


function audio_error_handler(e) {
    //Log.info("audio_error_handler is called");
    var i = 0;
    return false;
}

function audio_loadeddata_handler(e) {
    //Log.info("audio_loadeddata_handler is called");
    var obj = e.target;
    var s = obj.getAttribute("obj_offset");
    var offset = parseInt(s);
    obj.removeEventListener("loadeddata", audio_completed_handler);
    audio_loaded[offset] = true;
}

function audio_file_completed_handler(e) {
    //Log.info("audio_file_completed_handler is called");
    var obj = e.target;
    if (keysoundmax > 0) {
        if (keysoundcount >= keysoundmax) {
            keysoundmax = 0;
        } else {
            play_audio_file(keysoundsequence[keysoundcount++], null, null, true, DoControlSounds);
        }
    }
}

function audio_completed_handler(e) {
    var obj = e.target;
    var id = obj.getAttribute("ani_id");
    var rep = audio_ani_playcount[id];
    obj.autoplay = false;
    if (rep == 1) {
        // completed sound
        var foreground = audio_ani_foreground[id];
        audio_ani_object_playing[id] = -1;
        if (foreground) {


            process_script(audio_ani_script[id], eval(audio_ani_curr_scr_item[id] + 1).toString());
        }
        return;
    }
    if (rep > 0) {
        rep--;
        audio_ani_playcount[id] = rep;
    }
    if (audio_ani_object_playing[id] < 0) {
        if (foreground) {


            process_script(audio_ani_script[id], eval(audio_ani_curr_scr_item[id] + 1).toString());
        }
        return;
    }
    try_audio(id);
}

function try_audio(id) {
    var offset = 0;
    var selection = audio_ani_selection[id];
    if (selection == "random") {
        offset = Math.round(Math.random() * audio_def_item_count[audio_ani_id[id]]);
        if (offset >= audio_def_item_count[audio_ani_id[id]]) {
            offset--;
        }
    } else if (selection == "sequential") {
        offset++;
        if (offset >= audio_def_item_count[audio_ani_id[id]]) {
            offset = 0;
        }
    }
    offset += audio_def_item_offset[audio_ani_id[id]];
    audio_ani_object_playing[id] = offset;
    audio_object[offset].setAttribute("ani_id", id);
    audio_object[offset].setAttribute("muted", true);
    var res = true;
    if (audio_object[offset].currentTime > 0) {
        audio_object[offset].currentTime = 0;
        if (browser == 3 || browser == 2) {
            audio_object[offset].play().then(
                function (result) {},
                function (error) {
                    try_audio(id);
                }
            );
            return res;
        }
    }
    //	if (browser == 4 && edgebrowser) {	//thenでエラーが吐かれる。
    if (false) {
        audio_object[offset].play().then(
            function (result) {},
            function (error) {
                try_audio(id);
            }
        );
    } else {
        if (audio_object[offset].play == null) {
            try_audio(id);
        } else {
            //			Log.info(audio_object[offset]);
            audio_object[offset].play();
        }
    }
    return res;
}

function moving_image_ani_end_handler(e) {
    try {
        var obj = e.target;
        var id = obj.id;
        id = id.substr(4); // remove "div-" to get animation id
        var last_id = id;
        var j = id.lastIndexOf("-");
        if (j > 0) {
            id = id.substring(0, j);
        }
        moving_image_ani_iteration[id]++;
        var last_path = moving_image_ani_path_playing[id];
        var ani_obj = moving_image_ani_object[id];
        if ((last_path + 1) >= ani_obj.childElementCount) {
            moving_image_ani_played[id]++;
            if (moving_image_ani_played[id] >= moving_image_ani_playcount[id] && moving_image_ani_playcount[id] != 0) {
                // animation is done
                switch (browser) {
                    case 1:
                    case 4:
                        obj.removeEventListener("animationend", moving_image_ani_end_handler);
                        break;
                    case 6:
                    case 5:
                    case 2:
                    case 3:
                        obj.removeEventListener("webkitAnimationEnd", moving_image_ani_end_handler);
                        break;
                    case 7:
                        obj.removeEventListener("oAnimationEnd", moving_image_ani_end_handler);
                        break;
                }
                if (moving_image_ani_object[id].childElementCount > 0) {
                    moving_image_ani_object_playing[id] = -1; // stops the timer update for the image
                }
                var x = "div-" + id;
                if (last_path > 0) {
                    x += "-" + eval(last_path - 1).toString();
                }
                if (moving_image_ani_atend[id] == null) {
                    var div = document.getElementById(x);
                    try {
                        if (div != null) {
                            if (div.firstChild != null) {
                                div.removeChild(div.firstChild);
                            }
                            draw_region.removeChild(div);
                        }
                    } catch (e) {
                        var i = 0;
                    }
                }
                if (moving_image_ani_foreground[id]) {

                    process_script(moving_image_ani_script[id], eval(moving_image_ani_curr_scr_item[id] + 1).toString());
                }
                if (predator_running && id == "predatornormalani") {
                    //どつかれた時 1000点マイナス
                    Log.info("Kewala has Eaten!");
                    ENABLE_TYPE = false;
                    predator_running = false;
                    predator_line = false;

                    process_script("predatorbites_script", 0);

                    if (ScoreValid) {
                        Score -= 1000;
                        if (Score < 0) Score = 0;
                        replace_scoretext((Score).toString());
                    }
                    setTimeout(function () {
                        ENABLE_TYPE = true;
                        lastkeytime = null;
                    }, 5000);
                }
                return;
            } else {
                last_path = 0;
            }
        } else {
            last_path++;
        }
        // now set up keyframe using this path
        // (x0,y0)s0倍率から(x1,y1)s1倍率にアニメーション
        var path = moving_image_ani_object[id].childNodes.item(last_path * 2 + 1);
        var keyframe = "0% {left: " + path.getAttribute("data-tqani-x0") +
            "px; top: " + path.getAttribute("data-tqani-y0") + "px;" +
            " " + keyframe_prefix + "transform: scale(" + path.getAttribute("data-tqani-s0") + "," + path.getAttribute("data-tqani-s0") + ");" +
            "} 100% {left: " + path.getAttribute("data-tqani-x1") +
            "px; top: " + path.getAttribute("data-tqani-y1") + "px;" +
            " " + keyframe_prefix + "transform: scale(" + path.getAttribute("data-tqani-s1") + ", " + path.getAttribute("data-tqani-s1") + ");" +
            "}";
        //Log.info("keyframe: "+keyframe)
        var rule = "z-index: " + moving_image_ani_z[id] + "; position: absolute;" +
            " " + keyframe_prefix + "animation-name: " + id + "-" + (moving_image_ani_iteration[id]).toString() + ";" +
            " " + keyframe_prefix + "animation-duration: " + path.getAttribute("data-tqani-period") + "s;" +
            " " + keyframe_prefix + "animation-fill-mode: forwards; " +
            " " + keyframe_prefix + "animation-timing-function: linear;" +
            " " + keyframe_prefix + "animation-iteration-count: ";
        //if (moving_image_ani_playcount[id] == 0) {
        //rule += "infinite;";
        //} else {
        rule += "1;";
        //}
        moving_image_ani_stylesheet[id] = document.createStyleSheet();
        var x = document.getElementById("div-" + last_id);
        x.id = "div-" + id + "-" + (moving_image_ani_iteration[id]).toString();
        x.style = moving_image_ani_stylesheet[id];
        moving_image_ani_div[id] = x;
        if (browser == 4) {
            moving_image_ani_stylesheet[id].addRule("#div-" + id + "-" + (moving_image_ani_iteration[id]).toString(), rule);
            moving_image_ani_stylesheet[id].insertRule("@" + keyframe_prefix + "keyframes " + id + "-" + (moving_image_ani_iteration[id]).toString() + "{" + keyframe + "}", 0);
            // trigger the animation
            var currver = (moving_image_ani_iteration[id]).toString();
            window.setImmediate(function () {
                moving_image_ani_div[id].style.animationName = id + "-" + currver;
            });
            if (edgebrowser) {
                moving_image_ani_stylesheet[id].addRule("#div-" + id + "-" + (moving_image_ani_iteration[id]).toString(), rule);
                moving_image_ani_stylesheet[id].insertRule("@keyframes " + id + "-" + (moving_image_ani_iteration[id]).toString() + " {" + keyframe + "}", 0);
                window.setImmediate(function () {
                    moving_image_ani_div[id].style.animationName = id + "-" + currver;
                });
            } else {
                moving_image_ani_stylesheet[id].addRule("#div-" + id + "-" + (moving_image_ani_iteration[id]).toString(), rule);
                moving_image_ani_stylesheet[id].insertRule("@keyframes " + id + "-" + (moving_image_ani_iteration[id]).toString() + " {" + keyframe + "}", 0);
                moving_image_ani_div[id].style.animationName = id + "-" + currver;
            }
        } else {
            moving_image_ani_stylesheet[id].addRule("@" + keyframe_prefix + "keyframes " + id + "-" + (moving_image_ani_iteration[id]).toString(), keyframe);
            moving_image_ani_stylesheet[id].addRule("#div-" + id + "-" + (moving_image_ani_iteration[id]).toString(), rule);
        }
        moving_image_ani_path_playing[id] = last_path;
    } catch (e) {
        catchlog(e);
    }
}


// init functions used when html definitions are parsed
function init_image_objects() {
    //Log.info("init_image_objects is called");
    var html_objects = document.getElementById("image_objects");
    for (var i = 1; i < html_objects.childNodes.length; i += 2) {
        var obj = html_objects.childNodes.item(i);
        var name = obj.id;
        image_def_item_offset[name] = image_count;
        if (obj.getAttribute("data-tqobj-type") == "timed-images") {
            image_def_istimed[name] = true;
        } else {
            image_def_istimed[name] = false;
        }
        var count = 0;
        for (var j = 1; j < obj.childNodes.length; j += 2) {
            var next_file = obj.childNodes.item(j);
            var url = next_file.getAttribute("data-tqobj-url");
            var x = 0;
            if (next_file.getAttribute("data-tqobj-x") != null) {
                x = parseInt(next_file.getAttribute("data-tqobj-x"));
            }
            var y = 0;
            if (next_file.getAttribute("data-tqobj-y") != null) {
                y = parseInt(next_file.getAttribute("data-tqobj-y"));
            }
            var period = 0;
            if (next_file.getAttribute("data-tqobj-period") != null) {
                period = parseInt(next_file.getAttribute("data-tqobj-period"));
            }
            var sz = next_file.getAttribute("data-tqobj-size");
            if (sz == null) {
                image_size[image_count] = 1.0;
            } else {
                image_size[image_count] = parseFloat(sz);
            }
            var st = next_file.getAttribute("data-tqobj-signtext");
            if (st != null) {
                image_signtext[image_count] = st;
                image_sign_x[image_count] = parseInt(next_file.getAttribute("data-tqobj-sign-x"));
                image_sign_y[image_count] = parseInt(next_file.getAttribute("data-tqobj-sign-y"));
                image_sign_fontsize[image_count] = parseInt(next_file.getAttribute("data-tqobj-sign-fontsize"));
                image_sign_width[image_count] = parseInt(next_file.getAttribute("data-tqobj-sign-width"));
                image_sign_height[image_count] = parseInt(next_file.getAttribute("data-tqobj-sign-height"));
                image_sign_align[image_count] = next_file.getAttribute("data-tqobj-sign-align");
                image_sign_colour[image_count] = next_file.getAttribute("data-tqobj-sign-colour");
                image_sign_nowrap[image_count] = next_file.getAttribute("data-tqobj-sign-nowrap");
            }
            //image_url[image_count] = Host+"/Resources"+url; mp3
            image_url[image_count] = COURSE_PATH + "/Resources" + url;
            image_x[image_count] = x;
            image_y[image_count] = y;
            image_period[image_count] = period;
            image_count++;
            count++;
        }
        image_def_item_count[name] = count;
        image_def_count++;
    }
}

function play_audio_file(obj, url, base, playnow, playflag) {
    if (!playflag) {
        return;
    }
    if (obj != null) {
        if (playnow) {
            if (obj.currentTime > 0) {
                obj.currentTime = 0;
            }
            obj.preload = "auto";
            if (browser == 3 || browser == 2) {
                obj.autoplay = true;
            }
            obj.play();
        }
        return obj;
    } else if (base == null) {
        var a1 = new Audio();
        if (playnow) {
            a1.preload = "auto";
            if (browser == 3 || browser == 2) {
                a1.autoplay = true;
            }
        } else {
            a1.preload = "none";
            if (browser == 3 || browser == 2) {
                a1.autoplay = false;
            }
        }
        //ナレーションを日本語にするキーボード
        if (PrefKeyboard == "japengkbd" || PrefKeyboard == "jappad" || PrefKeyboard == "laptoppad") {
            if (url.indexOf("k-j") >= 0) {
                if (KbdSoundBase.indexOf("k-j") > 0) {} else {
                    a1.src = STORAGE_PATH + KbdSoundBase + url + sound_suffix;
                }
            } else {
                if (KbdSoundBase.indexOf("k-j") > 0) {
                    a1.src = STORAGE_PATH + KbdSoundBase + url + sound_suffix;
                } else {
                    a1.src = STORAGE_PATH + KbdSoundBase + "k-j/" + url + sound_suffix;
                    //a1.src = STORAGE_PATH+KbdSoundBase+url+sound_suffix;
                }
            }
        } else {
            a1.src = STORAGE_PATH + KbdSoundBase + url + sound_suffix;
        }
        a1.addEventListener("ended", audio_file_completed_handler);
        //			Log.info(a1);
        if (playnow) {
            a1.play();
        }
        return a1;
    } else {
        var a1 = new Audio();
        if (playnow) {
            a1.preload = "auto";
            if (browser == 3 || browser == 2) {
                a1.autoplay = true;
            }
        } else {
            a1.preload = "none";
            if (browser == 3 || browser == 2) {
                a1.autoplay = false;
            }
        }
        a1.src = COURSE_PATH + base + url + sound_suffix;
        if (playnow) {
            a1.play();
        }
        return a1;
    }
}

function load_audio_file(obj, url) {
    if (obj != null) {
        return obj;
    }
    obj = new Audio();
    obj.preload = "auto";
    obj.src = STORAGE_PATH + KbdSoundBase + url + sound_suffix;
    obj.addEventListener("ended", audio_file_completed_handler);
    return obj;
}

function init_audio_objects() {
    //	Log.info(COURSE_PATH);

    var html_objects = document.getElementById("audio_objects");
    for (var i = 1; i < html_objects.childNodes.length; i += 2) {
        var obj = html_objects.childNodes.item(i);
        var name = obj.id;
        audio_def_item_offset[name] = audio_count;
        var count = 0;
        for (var j = 1; j < obj.childNodes.length; j += 2) {
            var next_file = obj.childNodes.item(j);
            var url = next_file.getAttribute("data-tqobj-url") + sound_suffix;
            var a1 = new Audio();
            a1.preload = "none";
            if (browser == 3 || browser == 2) {
                a1.autoplay = false;
            }
            //a1.src = Host+"/Resources"+url;
            //a1.src = COURSE_PATH + "/Resources"+url;//mp3
            a1.src = COURSE_PATH + "/Resources" + url; //mp3
            a1.addEventListener("error", audio_error_handler);
            a1.addEventListener("ended", audio_completed_handler);
            a1.addEventListener("loadeddata", audio_loadeddata_handler);
            a1.setAttribute("obj_offset", audio_count);
            audio_url[audio_count] = COURSE_PATH + "/Resources" + url;
            audio_object[audio_count] = a1;
            audio_loaded[audio_count] = false;
            audio_count++;
            count++;
        }
        audio_def_item_count[name] = count;
        audio_def_count++;
    }
}

function init_static_image_animations() {
    var html_objects = document.getElementById("static_image_animations");
    for (var i = 1; i < html_objects.childNodes.length; i += 2) {
        var obj = html_objects.childNodes.item(i);
        var id = obj.id;
        static_image_ani_id[id] = obj.getAttribute("data-tqani-id");
        var x = 0;
        if (obj.getAttribute("data-tqani-x") != null) {
            x = parseInt(obj.getAttribute("data-tqani-x"));
        }
        static_image_ani_x[id] = x;
        var y = 0;
        if (obj.getAttribute("data-tqani-y") != null) {
            y = parseInt(obj.getAttribute("data-tqani-y"));
        }
        static_image_ani_y[id] = y;
        var z = 0;
        if (obj.getAttribute("data-tqani-z") != null) {
            z = parseInt(obj.getAttribute("data-tqani-z"));
        }
        var selection = obj.getAttribute("data-tqani-selection");
        if (selection == null) {
            static_image_ani_selection[id] = "sequential";
        } else {
            static_image_ani_selection[id] = selection;
        }
        static_image_ani_postcard[id] = obj.getAttribute("data-tqani-postcard");
        static_image_ani_z[id] = z;
        static_image_ani_stylesheet[id] = document.createStyleSheet();
        static_image_ani_div[id] = document.createElement("div");
        static_image_ani_div[id].id = "div-" + id;
        static_image_ani_canvas[id] = document.createElement("canvas");
        static_image_ani_canvas[id].id = "canvas-" + id;
        static_image_ani_count++;
    }
}

function init_part_moving_image_animation(id) {
    moving_image_ani_stylesheet[id] = document.createElement('style');
    moving_image_ani_stylesheet[id].type = 'text/css';
    moving_image_ani_stylesheet[id].id = "css-" + id;
    moving_image_ani_div[id] = document.createElement("div");
    moving_image_ani_div[id].id = "div-" + id;
}

function init_moving_image_animations() {
    var html_objects = document.getElementById("moving_image_animations");
    for (var i = 1; i < html_objects.childNodes.length; i += 2) {
        var obj = html_objects.childNodes.item(i);
        var id = obj.id;
        moving_image_ani_object[id] = obj;
        moving_image_ani_id[id] = obj.getAttribute("data-tqani-id");
        var z = 0;
        if (obj.getAttribute("data-tqani-z") != null) {
            z = parseInt(obj.getAttribute("data-tqani-z"));
        }
        moving_image_ani_z[id] = z;
        var selection = obj.getAttribute("data-tqani-selection");
        if (selection == null) {
            moving_image_ani_selection[id] = "sequential";
        } else {
            moving_image_ani_selection[id] = selection;
        }
        moving_image_ani_postcard[id] = obj.getAttribute("data-tqani-postcard");
        init_part_moving_image_animation(id);
        moving_image_ani_count++;
    }
}

function init_key_static_image_animations() {
    //Log.info("key_static_image_animations() is called");

    var html_objects = document.getElementById("key_static_image_animations");
    for (var i = 1; i < html_objects.childNodes.length; i += 2) {
        var obj = html_objects.childNodes.item(i);
        var id = obj.id;
        key_static_image_ani_id[id] = obj.getAttribute("data-tqani-id");
        var x = 0;
        if (obj.getAttribute("data-tqani-x") != null) {
            x = parseInt(obj.getAttribute("data-tqani-x"));
        }
        key_static_image_ani_x[id] = x;
        var y = 0;
        if (obj.getAttribute("data-tqani-y") != null) {
            y = parseInt(obj.getAttribute("data-tqani-y"));
        }
        key_static_image_ani_y[id] = y;
        var z = 0;
        if (obj.getAttribute("data-tqani-z") != null) {
            z = parseInt(obj.getAttribute("data-tqani-z"));
        }
        var selection = obj.getAttribute("data-tqani-selection");
        if (selection == null) {
            key_static_image_ani_selection[id] = "sequential";
        } else {
            key_static_image_ani_selection[id] = selection;
        }
        key_static_image_ani_postcard[id] = obj.getAttribute("data-tqani-postcard");
        key_static_image_ani_z[id] = z;
        key_static_image_ani_stylesheet[id] = document.createStyleSheet();
        key_static_image_ani_div[id] = document.createElement("div");
        key_static_image_ani_div[id].id = "div-" + id;
        key_static_image_ani_canvas[id] = document.createElement("canvas");
        key_static_image_ani_canvas[id].id = "canvas-" + id;
        key_static_image_ani_count++;
    }
}

function init_key_part_moving_image_animation(id) {
    //Log.info("init_key_part_moving_image_animation("+id+")");

    key_moving_image_ani_stylesheet[id] = document.createStyleSheet();
    key_moving_image_ani_div[id] = document.createElement("div");
    key_moving_image_ani_div[id].id = "div-" + id;
    key_moving_image_ani_canvas[id] = document.createElement("canvas");
    key_moving_image_ani_canvas[id].id = "canvas-" + id;
}

function init_key_moving_image_animations() {
    //Log.info("init_key_moving_image_animations()");

    var html_objects = document.getElementById("key_moving_image_animations");
    for (var i = 1; i < html_objects.childNodes.length; i += 2) {
        var obj = html_objects.childNodes.item(i);
        var id = obj.id;
        key_moving_image_ani_object[id] = obj;
        key_moving_image_ani_id[id] = obj.getAttribute("data-tqani-id");
        var z = 0;
        if (obj.getAttribute("data-tqani-z") != null) {
            z = parseInt(obj.getAttribute("data-tqani-z"));
        }
        key_moving_image_ani_z[id] = z;
        var selection = obj.getAttribute("data-tqani-selection");
        if (selection == null) {
            key_moving_image_ani_selection[id] = "sequential";
        } else {
            key_moving_image_ani_selection[id] = selection;
        }
        key_moving_image_ani_postcard[id] = obj.getAttribute("data-tqani-postcard");
        init_key_part_moving_image_animation(id);
        key_moving_image_ani_count++;
    }
}

function init_audio_animations() {
    //Log.info("init_audio_animations()");
    var html_objects = document.getElementById("audio_animations");
    for (var i = 1; i < html_objects.childNodes.length; i += 2) {
        var obj = html_objects.childNodes.item(i);
        var name = obj.id;
        audio_ani_id[name] = obj.getAttribute("data-tqani-id");
        if (obj.getAttribute("data-tqani-selection") != null) {
            audio_ani_selection[name] = obj.getAttribute("data-tqani-selection");
        } else {
            audio_ani_selection[name] = "sequential";
        }
        audio_ani_count++;
    }
}


// functions used during script processing

function load_image(id) {
    Log.info("load_image(" + id + ")");

    var offset = image_def_item_offset[id];
    //	Log.info(offset)
    for (var i = 0; i < image_def_item_count[id]; i++) {
        var a1 = new Image();
        //		Log.info(a1)
        a1.onload = function (e) {
            var obj = e.target;
            var offset = parseInt(obj.getAttribute("obj_offset"));
            if (offset != null) {
                image_is_loaded[offset] = true;
                if (image_is_waiting[offset]) {
                    image_is_waiting[offset] = false;
                    var id = obj.getAttribute("ani_id");
                    start_static_image(static_image_ani_script[id],
                        static_image_ani_curr_scr_item[id],
                        id,
                        static_image_ani_action[id],
                        static_image_ani_selection[id],
                        static_image_ani_playcount[id],
                        static_image_ani_foreground[id],
                        static_image_ani_visible[id]);

                    process_script(static_image_ani_script[id], eval(static_image_ani_curr_scr_item[id] + 1).toString());
                }
            }
        };
        a1.setAttribute("obj_offset", offset);
        //		Log.info(a1)
        image_is_waiting[offset] = false;
        image_is_loaded[offset] = false;
        a1.src = image_url[offset];
        image_object[offset] = a1;
        //		Log.info(image_object[offset])
        offset++;
    }
}


function load_audio(id) {
    //Log.info("load_audio("+id+")");
    var offset = audio_def_item_offset[id];
    for (var i = 0; i < audio_def_item_count[id]; i++) {
        audio_object[offset].preload = "auto";
        audio_object[offset].load();
        offset++;
    }
}

//-----------------------
function start_audio(script, curr_scr_item, id, action, selection, playcount, foreground) {
    //Log.info('start_audio')
    if (!DoOtherSounds) {
        if (!foreground) {
            return;
        }
        setTimeout(function () {
            silent_delay_handler(script, curr_scr_item, id, action, selection, playcount, foreground);
            script = null;
            curr_scr_item;
            id = null;
            action = null;
            selection = null;
            playcount = null;
            foreground = null;
        }, 4000);
        return;
    }
    var offset = 0;

    if (selection == "extpraise") {
        if (kewala_won) {
            offset = 0;
        } else {
            offset = 1;
        }
    } else if (selection == "praise") {
        if (naccuracy < 84.0) {
            offset = 2;
        } else {
            var perspeed = (nspeed / TargetSpeed) * 100.0;
            if (perspeed < 75.0) {
                if (audio_def_item_count[audio_ani_id[id]] < 3) {
                    offset = 1;
                } else {
                    offset = 2;
                }
            } else if (perspeed < 99.9) {
                offset = 1;
            } else {
                offset = 0;
            }
        }
    } else if (selection == null) {
        audio_ani_selection[id] = "sequential";
    } else {
        audio_ani_selection[id] = selection;
        if (selection == "random") {
            offset = Math.round(Math.random() * audio_def_item_count[audio_ani_id[id]]);
            if (offset >= audio_def_item_count[audio_ani_id[id]]) {
                offset--;
            }
        }
    }
    offset += audio_def_item_offset[audio_ani_id[id]];
    audio_ani_object_playing[id] = offset;
    if (foreground == null) {
        audio_ani_foreground[id] = false;
    } else {
        audio_ani_foreground[id] = foreground == "true";
    }
    if (playcount == null) {
        audio_ani_playcount[id] = 1;
    } else {
        audio_ani_playcount[id] = parseInt(playcount);
    }
    if (audio_object[offset] == null) {
        //Log.info("Audio for animation "+id+" not loaded");
    }
    //Log.info(audio_object[offset]);
    //Log.info(id);
    audio_object[offset].setAttribute("ani_id", id);
    audio_object[offset].setAttribute("obj_offset", offset);
    audio_object[offset].setAttribute("muted", true);
    if (audio_loaded[offset]) {
        //Log.info(audio_object[offset]);
        if (audio_object[offset].currentTime > 0) {
            audio_object[offset].currentTime = 0;
            audio_object[offset].play();
        } else {
            audio_object[offset].play();
        }
    } else {
        audio_object[offset].play();
    }
    //Log.info("5");

}

function stop_audio_object(obj) {
    try {
        obj.pause();
        obj.removeEventListener("error", audio_error_handler);
        obj.removeEventListener("ended", audio_completed_handler);
    } catch (e) {
        catchlog(e);
    }
}

function stop_audio(id) {
    try {
        audio_object[audio_ani_object_playing[id]].pause();
        audio_object[audio_ani_object_playing[id]].removeEventListener("error", audio_error_handler);
        audio_object[audio_ani_object_playing[id]].removeEventListener("ended", audio_completed_handler);
    } catch (e) {
        catchlog(e);
    }
    audio_ani_object_playing[id] = -1;
}

function animate_audio(script, curr_scr_item, id, action, delay, playcount, foreground, ani_type) { // return true if script should wait
    switch (action) {
        case "start":
            if (delay != null) {
                var selection = audio_ani_selection[id];
                setTimeout(function () {
                    audio_delay_handler(script, curr_scr_item, id, action, selection, playcount, foreground);
                    script = null;
                    curr_scr_item = null;
                    id = null;
                    action = null;
                    selection = null;
                    playcount = null;
                    foreground = null;
                }, parseInt(delay));
                if (foreground != null && foreground == "true") {
                    return true;
                }

                return false;
            }
            if (audio_ani_object_playing[id] >= 0) {

                stop_audio(id);
            }
            audio_ani_script[id] = script;
            audio_ani_curr_scr_item[id] = curr_scr_item;
            if (ani_type != null && ani_type == "extpraise") {
                start_audio(script, curr_scr_item, id, action, "extpraise", playcount, foreground);
            } else if (ani_type != null && ani_type == "praise") {

                start_audio(script, curr_scr_item, id, action, "praise", playcount, foreground);
            } else {
                start_audio(script, curr_scr_item, id, action, audio_ani_selection[id], playcount, foreground);
            }
            if (foreground != null && foreground == "true") {

                return true;
            }
            return false;
        case "stop":

            stop_audio(id);
            return false;
        case "wait":
            if (audio_ani_object_playing[id] >= 0) {
                audio_ani_foreground[id] = true;
                audio_ani_script[id] = script;
                audio_ani_curr_scr_item[id] = curr_scr_item;
                return true;
            } else {
                return false;
            }
    }
}


//-----------------------
function start_static_image(script, curr_scr_item, id, action, selection, playcount, foreground, visible) {
    try {
        var imageid = static_image_ani_id[id];
        var offset = 0;
        if (selection == "random") {
            offset = Math.round(Math.random() * image_def_item_count[static_image_ani_id[id]]);
            if (offset >= image_def_item_count[imageid]) {
                offset--;
            }
        }
        offset += image_def_item_offset[imageid];
        try {
            static_image_ani_object_playing[id] = offset;
        } catch (e) {
            catchlog(e);
        }
        if (foreground == null) {
            static_image_ani_foreground[id] = false;
        } else {
            static_image_ani_foreground[id] = foreground == "true";
        }
        if (playcount == null) {
            static_image_ani_playcount[id] = 1;
        } else {
            static_image_ani_playcount[id] = parseInt(playcount);
        }
        if (image_object[offset] == null) {
            //Log.info("Image for animation "+id+" not loaded");
        }
        image_object[offset].setAttribute("ani_id", id);
        if (!image_is_loaded[offset]) {
            image_is_waiting[offset] = true;
            return true;
        }
        if (static_image_ani_stylesheet[id].length > 0) {
            static_image_ani_stylesheet[id].removeRule(0);
        }
        if (image_def_item_count[static_image_ani_id[id]] > 1) {
            var r = "z-index: " + static_image_ani_z[id] + "; position: absolute; left: " +
                eval(static_image_ani_x[id] + image_x[offset]).toString() +
                "px; top: " + eval(static_image_ani_y[id] + image_y[offset]).toString() + "px;";
            static_image_ani_stylesheet[id].addRule("#canvas-" + id, r);
            if (image_period[offset] && image_period[offset] != "0") {
                d0 = parseInt(image_period[offset]);
                image_timestep[offset] = new StaticImageTimestep(id);
                image_timestep[offset].start(d0);
                //setTimeout(function(){static_image_period_completed_handler(id); id=null; d0=null}, d0);
            }
        } else {
            var r = "z-index: " + static_image_ani_z[id] + "; position: absolute; left: " +
                eval(static_image_ani_x[id] + image_x[offset]).toString() +
                "px; top: " + eval(static_image_ani_y[id] + image_y[offset]).toString() + "px;";
            static_image_ani_stylesheet[id].addRule("#canvas-" + id, r);
        }
        if (id.search("outer") >= 0) {
            static_image_ani_canvas[id].width = image_object[offset].width;
            static_image_ani_canvas[id].height = image_object[offset].height;
        } else {
            static_image_ani_canvas[id].width = image_object[offset].width * 2; // allow for other images
            static_image_ani_canvas[id].height = image_object[offset].height * 2;
        }
        static_image_ani_context[id] = static_image_ani_canvas[id].getContext("2d");
        if (image_size[offset] != null && image_size[offset] != 1.0 && image_size[offset] != 0.0) {
            static_image_ani_context[id].drawImage(image_object[offset], 0, 0, image_object[offset].width * image_size[offset], image_object[offset].height * image_size[offset]);
        } else {
            static_image_ani_context[id].drawImage(image_object[offset], 0, 0);
        }
        if (image_signtext[offset] != null) {
            var score_fontsize = 0;
            if (id == "Scoreani") {
                image_signtext[offset] = (Score).toString();
                static_image_ani_context[id].fillStyle = "#ffffff";
                // スコア文字列の幅を取得
                var score_canvas = document.createElement('canvas');
                var score_context = score_canvas.getContext('2d');

                do { //スコア文字列が SCORETEXT_MAXWIDTH を超える場合はフォントサイズを小さくする
                    score_context.font = (image_sign_fontsize[offset] - score_fontsize).toString() + "pt " + font_name;
                    var metrics = score_context.measureText(Score);
                    score_fontsize += 1;
                } while (metrics.width > SCORETEXT_MAXWIDTH);

                //Log.info(image_signtext[offset].length);

            }
            if (image_sign_colour[offset] != null) {
                static_image_ani_context[id].fillStyle = image_sign_colour[offset];
            }
            static_image_ani_context[id].font = (image_sign_fontsize[offset] - score_fontsize).toString() + "pt " + font_name;
            if (image_sign_align[offset] != null) {
                static_image_ani_context[id].align = image_sign_align[offset];
            }
            if (id == "Scoreani") {
                var x = parseInt(image_sign_x[offset]) - metrics.width;
            } else {
                var x = parseInt(image_sign_x[offset]);
            }
            var y = parseInt(image_sign_y[offset]);
            if (x < 0) {
                //static_image_ani_context[id].fillText(image_signtext[offset], 0, parseInt(image_sign_fontsize[offset])+5);
                wrapText(static_image_ani_context[id], image_signtext[offset], 0, parseInt(image_sign_fontsize[offset]) + 5,
                    image_sign_width[offset], image_sign_fontsize[offset] + 5, image_sign_nowrap[offset]);
            } else {
                //static_image_ani_context[id].fillText(image_signtext[offset], x, y);
                wrapText(static_image_ani_context[id], image_signtext[offset], x, y,
                    image_sign_width[offset], image_sign_fontsize[offset] + 5, image_sign_nowrap[offset]);
            }
        }
        static_image_ani_div[id].appendChild(static_image_ani_canvas[id]);
        draw_region.appendChild(static_image_ani_div[id]);
        if (id == "TrailMap1ani") {
            if (trail_div != null) {
                if (browser == 4) {
                    trail_div.style.visibility = "visible";
                } else {
                    trail_div.hidden = false;
                }
            }
        }
        return false;
    } catch (e) {
        catchlog(e);
    }
}

function stop_static_image(id, action, selection, playcount, foreground, visible) {
    if (visible == null) {
        static_image_ani_visible[id] = false;
    } else {
        static_image_ani_visible[id] = visible == "true";
    }
    if (id == "TrailMap1ani") {
        if (trail_div != null) {
            if (browser == 4) {
                trail_div.style.visibility = "hidden";
            } else {
                trail_div.hidden = true;
            }
        }
    }
    if (static_image_ani_object_playing[id] < 0 || image_def_item_count[static_image_ani_id[id]] == 1) {
        // image is already stopped, but probably visible
        if (!static_image_ani_visible[id]) {
            try {
                var div = document.getElementById("div-" + id); // ensures we remove only if there
                if (div != null) {
                    div.removeChild(div.firstChild);
                    draw_region.removeChild(div);
                }
            } catch (e) {}
        }
    } else {
        // still playing, force it to stop
        static_image_ani_playcount[id] = -1;
        if (!static_image_ani_visible[id]) {
            try {
                var div = document.getElementById("div-" + id); // ensures we remove only if there
                if (div != null) {
                    div.removeChild(div.firstChild);
                    draw_region.removeChild(div);
                }
            } catch (e) {}
        }
    }
}

function animate_static_image(script, curr_scr_item, id, action, delay, selection, playcount, foreground, visible) { // return true if script should wait
    try {
        if (selection == null) {
            static_image_ani_selection[id] = "sequential";
            selection = "sequential";
        } else {
            static_image_ani_selection[id] = selection;
        }
        if (visible == null) {
            static_image_ani_visible[id] = false;
        } else {
            static_image_ani_visible[id] = visible == "true";
        }
        switch (action) {
            case "start":
                if (!skipLesson) {
                    if (delay != null) {
                        d0 = parseInt(delay);
                        setTimeout(function () {
                            static_image_delay_handler(script, curr_scr_item, id, action, selection, playcount, foreground, visible);
                            script = null;
                            curr_scr_item;
                            id = null;
                            action = null;
                            selection = null;
                            playcount = null;
                            foreground = null;
                        }, d0);
                        if (foreground != null && foreground == "true") {
                            return true;
                        }
                        return false;
                    }
                    if (static_image_ani_object_playing[id] >= 0) {
                        stop_static_image(id, action, selection, playcount, foreground, visible);
                    }
                    static_image_ani_action[id] = action;
                    static_image_ani_script[id] = script;
                    static_image_ani_curr_scr_item[id] = curr_scr_item;
                    if (start_static_image(script, curr_scr_item, id, action, selection, playcount, foreground, visible)) {
                        return true;
                    }
                    if (foreground != null && foreground == "true") {
                        return true;
                    }
                }
                return false;
            case "stop":
                stop_static_image(id, action, selection, playcount, foreground, visible);
                return false;
            case "wait":
                if (static_image_ani_object_playing[id] >= 0) {
                    static_image_ani_foreground[id] = true;
                    static_image_ani_script[id] = script;
                    static_image_ani_curr_scr_item[id] = curr_scr_item;
                    return true;
                } else {
                    return false;
                }
        }
    } catch (e) {
        catchlog(e);
    }
}


//-----------------------
function start_moving_image(script, curr_scr_item, id, action, selection, playcount, foreground, visible) {
    //Log.info("start_moving_image called")
    var offset = 0;
    if (selection == "random") {
        offset = Math.round(Math.random() * image_def_item_count[moving_image_ani_id[id]]);
        if (offset >= image_def_item_count[moving_image_ani_id[id]]) {
            offset--;
        }
    }
    offset += image_def_item_offset[moving_image_ani_id[id]];
    if (image_object[offset] == null) {
        //Log.info("Image for animation "+id+" not loaded");
    }
    moving_image_ani_object_playing[id] = offset;
    if (foreground == null) {
        moving_image_ani_foreground[id] = false;
    } else {
        moving_image_ani_foreground[id] = foreground == "true";
    }
    if (playcount == null) {
        moving_image_ani_playcount[id] = 1;
    } else {
        moving_image_ani_playcount[id] = parseInt(playcount);
    }
    // put the (first) image in the div
    try {
        var st = image_signtext[offset];
        if (st != null) {
            image_canvas[offset] = document.createElement("canvas");
            image_context[offset] = image_canvas[offset].getContext("2d");
            var x = parseInt(image_sign_x[offset]);
            var y = parseInt(image_sign_y[offset]);
            var textwidth = image_context[offset].measureText(st);
            var w = image_object[offset].width * 2;
            if (w <= textwidth) {
                w = textwidth + 2;
            }
            if (x < 0) {
                image_canvas[offset].width = w;
                image_canvas[offset].height = image_object[offset].height * 2;
                image_context[offset].font = image_sign_fontsize[offset] + "pt " + font_name;
                if (image_sign_align[offset] != null) {
                    static_image_ani_context[id].align = image_sign_align[offset];
                }
                image_context[offset].drawImage(image_object[offset], -x, -y);
                image_context[offset].fillText(st, 0, parseInt(image_sign_fontsize[offset]) + 5);
            } else {
                image_canvas[offset].width = w;
                image_canvas[offset].height = image_object[offset].height;
                image_context[offset].font = image_sign_fontsize[offset] + "pt " + font_name;
                if (image_sign_align[offset] != null) {
                    static_image_ani_context[id].align = image_sign_align[offset];
                }
                image_context[offset].drawImage(image_object[offset], 0, 0);
                image_context[offset].fillText(st, x, y);
            }
            moving_image_ani_div[id].appendChild(image_canvas[offset]);
        } else {
            moving_image_ani_div[id].appendChild(image_object[offset]);
        }
    } catch (e) {
        catchlog(e);
    }
    // put the div on screen
    //Log.info(id);
    moving_image_ani_div[id].id = "div-" + id;
    try {
        draw_region.appendChild(moving_image_ani_div[id]);
    } catch (e) {
        catchlog(e);
    }
    // now set up keyframe using the first path
    // (x0,y0)s0倍率から(x1,y1)s1倍率にアニメーション
    var path = moving_image_ani_object[id].childNodes.item(1);
    var keyframe = "0% {left: " + path.getAttribute("data-tqani-x0") +
        "px; top: " + path.getAttribute("data-tqani-y0") +
        "px; " + keyframe_prefix + "transform: scale(" + path.getAttribute("data-tqani-s0") + ", " + path.getAttribute("data-tqani-s0") +
        ");} 100% {left: " + path.getAttribute("data-tqani-x1") +
        "px; top: " + path.getAttribute("data-tqani-y1") +
        "px; " + keyframe_prefix + "transform: scale(" + path.getAttribute("data-tqani-s1") + ", " + path.getAttribute("data-tqani-s1") +
        ");}";
    //Log.info("keyframe: "+keyframe)
    var rule = "z-index: " + moving_image_ani_z[id] + "; position: absolute;" +
        " " + keyframe_prefix + "animation-name: " + id + "; " + keyframe_prefix + "animation-duration: " +
        path.getAttribute("data-tqani-period") +
        "s; " +
        keyframe_prefix + "animation-fill-mode: forwards; " +
        keyframe_prefix + "animation-timing-function: linear; " + keyframe_prefix + "animation-iteration-count: ";
    //if (moving_image_ani_playcount[id] == 0) {
    //rule += "infinite;";
    //} else {
    rule += "1;";
    moving_image_ani_played[id] = 0;
    //}
    // try amd leave the image at the end of the path
    moving_image_ani_stylesheet[id] = document.createStyleSheet();
    if (browser == 4) {
        if (edgebrowser) {
            moving_image_ani_stylesheet[id].addRule("#div-" + id, rule);
            moving_image_ani_stylesheet[id].insertRule("@keyframes " + id + " {" + keyframe + "}", 0);
            // trigger the animation
            window.setImmediate(function () {
                moving_image_ani_div[id].style.animationName = id;
            });
        } else {
            moving_image_ani_stylesheet[id].addRule("#div-" + id, rule);
            moving_image_ani_stylesheet[id].insertRule("@keyframes " + id + " {" + keyframe + "}", 0);
            moving_image_ani_div[id].style.animationName = id;
        }
    } else {
        moving_image_ani_stylesheet[id].addRule("@" + keyframe_prefix + "keyframes " + id, keyframe);
        moving_image_ani_stylesheet[id].addRule("#div-" + id, rule);
    }
    //document.getElementById("div-"+id).style = moving_image_ani_stylesheet[id];
    switch (browser) {
        case 1:
            moving_image_ani_div[id].style.MozAnimationName = "";
            moving_image_ani_div[id].style = moving_image_ani_stylesheet[id];
    }
    // if there are multiple images, set a timer to work through them
    if (image_def_item_count[moving_image_ani_id[id]] > 1) {
        d0 = parseInt(image_period[offset]);
        moving_image_ani_timestep[id] = new MovingImageTimestep(id);
        moving_image_ani_timestep[id].start(d0);
    }

    // if there are multiple paths, set a listener to work through them
    if (moving_image_ani_object[id].childElementCount > 0) {
        switch (browser) {
            case 1:
            case 4:
                moving_image_ani_div[id].addEventListener("animationend", moving_image_ani_end_handler, false);
                break;
            case 6:
            case 5:
            case 2:
            case 3:
                moving_image_ani_div[id].addEventListener("webkitAnimationEnd", moving_image_ani_end_handler, false);
                break;
            case 7:
                moving_image_ani_div[id].addEventListener("oAnimationEnd", moving_image_ani_end_handler, false);
                break;
        }
        moving_image_ani_path_playing[id] = 0;
        moving_image_ani_iteration[id] = 0;
    }
}

function stop_moving_image_animation(id, visible) {
    try {
        if (moving_image_ani_playcount[id] > 0) {
            moving_image_ani_playcount[id] = 1;
        } else {
            moving_image_ani_object_playing[id] = -1;
            moving_image_ani_stylesheet[id].cssRules[1].style.MozAnimationIterationCount = "0";
        }
        if (moving_image_ani_object[id].childElementCount > 0) {
            moving_image_ani_path_playing[id] = moving_image_ani_object[id].childElementCount;
            fireonthis = moving_image_ani_div[id];
            tempevent = document.createEvent("HTMLEvents");
            tempevent.initEvent("load", false, true);
            fireonthis.dispatchEvent(tempevent);
        }
        if (!visible || visible == "false") {
            try {
                draw_region.removeChild(moving_image_ani_div[id]);
            } catch (e) {}
            /*
            switch (browser) {
            	case 1:
            		//moving_image_ani_div[id].style.MozAnimationPlayState = 'paused';
            		moving_image_ani_div[id].hidden = true;
            		break;
            	case 6:
            	case 5:
            	case 2:
            	case 3:
            		//moving_image_ani_div[id].style.webkitAnimationPlayState = 'paused';
            		moving_image_ani_div[id].hidden = true;
            		break;
            	case 4:
            		//moving_image_ani_div[id].style.msAnimationPlayState = 'paused';
            		moving_image_ani_div[id].style.visibility = "hidden";
            		break;
            }
            */
        }
    } catch (e) {
        catchlog(e);
    }
}

function animate_moving_image(script, curr_scr_item, id, action, delay, selection, playcount, foreground, visible) { // return true if script should wait
    if (selection == null) {
        moving_image_ani_selection[id] = "sequential";
        selection = "sequential";
    } else {
        moving_image_ani_selection[id] = selection;
    }
    if (visible == null) {
        moving_image_ani_visible[id] = false;
    } else {
        moving_image_ani_visible[id] = visible == "true";
    }
    switch (action) {
        case "restart":
            init_part_moving_image_animation(id);
        case "start":
            if (delay != null) {
                d0 = parseInt(delay);
                setTimeout(function () {
                    moving_image_delay_handler(script, curr_scr_item, id, action, selection, playcount, foreground, visible);
                    script = null;
                    curr_scr_item;
                    id = null;
                    action = null;
                    selection = null;
                    playcount = null;
                    foreground = null;
                }, d0);
                if (foreground != null && foreground == "true") {
                    return true;
                }
                return false;
            }
            if (moving_image_ani_object_playing[id] >= 0) {
                stop_moving_image_animation(id, false);
                moving_image_ani_object_playing[id] = -1;
                if (moving_image_ani_iteration[id] != null) {
                    moving_image_ani_iteration[id] = 0;
                }
            }
            moving_image_ani_action[id] = action;
            moving_image_ani_script[id] = script;
            moving_image_ani_curr_scr_item[id] = curr_scr_item;
            start_moving_image(script, curr_scr_item, id, action, selection, playcount, foreground, visible);
            if (foreground != null && foreground == "true") {
                return true;
            }
            return false;
        case "stop":
            stop_moving_image_animation(id, visible);
            if ((id == kewala_ext_ani || id == challenger_ext_ani) && challenge_started) {
                kewala_ext_ani = null;
                challenger_ext_ani = null;
                challenge_started = false;
            }
            return false;
        case "wait":
            if (moving_image_ani_object_playing[id] >= 0) {
                moving_image_ani_foreground[id] = true;
                moving_image_ani_script[id] = script;
                moving_image_ani_curr_scr_item[id] = curr_scr_item;
                return true;
            } else {
                return false;
            }
    }
}
//-----------------------
function start_key_static_image(script, curr_scr_item, id, action, selection, playcount, foreground, visible) {
    var offset = 0;
    if (selection == "random") {
        offset = Math.round(Math.random() * image_def_item_count[key_static_image_ani_id[id]]);
        if (offset >= image_def_item_count[key_static_image_ani_id[id]]) {
            offset--;
        }
    }
    offset += image_def_item_offset[key_static_image_ani_id[id]];
    if (image_object[offset] == null) {
        //Log.info("Image for animation "+id+" not loaded");
    }
    key_static_image_ani_object_playing[id] = offset;
    if (foreground == null) {
        key_static_image_ani_foreground[id] = false;
    } else {
        key_static_image_ani_foreground[id] = foreground == "true";
    }
    if (playcount == null) {
        key_static_image_ani_playcount[id] = 1;
    } else {
        key_static_image_ani_playcount[id] = parseInt(playcount);
    }
    image_object[offset].setAttribute("ani_id", id);
    image_object[offset].setAttribute("obj_offset", offset);
    if (key_static_image_ani_stylesheet[id].length > 0) {
        key_static_image_ani_stylesheet[id].removeRule(0);
    }
    var r = "z-index: " + key_static_image_ani_z[id] + "; position: absolute; left: " +
        eval(key_static_image_ani_x[id] + image_x[offset]).toString() + "px; top: " +
        eval(key_static_image_ani_y[id] + image_y[offset]).toString() + "px;";
    key_static_image_ani_stylesheet[id].addRule("#canvas-" + id, r);
    key_static_image_ani_canvas[id].width = image_object[offset].width * 2;
    key_static_image_ani_canvas[id].height = image_object[offset].height * 2;
    key_static_image_ani_context[id] = key_static_image_ani_canvas[id].getContext("2d");
    key_static_image_ani_context[id].drawImage(image_object[offset], 0, 0);
    key_static_image_ani_div[id].appendChild(key_static_image_ani_canvas[id]);
    draw_region.appendChild(key_static_image_ani_div[id]);
    key_static_image_ani_active_list[key_static_image_ani_active_count++] = id;
}

function stop_key_static_image(id) {
    var i;
    for (i = 0; i < key_static_image_ani_active_count; i++) {
        if (key_static_image_ani_active_list[i] == id) {
            var j;
            for (j = i + 1; j < key_static_image_ani_active_count; j++) {
                key_static_image_ani_active_list[j - 1] = key_static_image_ani_active_list[j];
            }
            key_static_image_ani_active_count--;
            break;
        }
    }
}

function do_step_key_static_image() {
    var i;
    for (i = 0; i < key_static_image_ani_active_count; i++) {
        var id = key_static_image_ani_active_list[i];
        var obj = image_object[key_static_image_ani_object_playing[id]];
        var rep = key_static_image_ani_playcount[id];
        var offset = key_static_image_ani_object_playing[id];
        offset -= image_def_item_offset[key_static_image_ani_id[id]];
        var prevoffset = offset;
        var selection = key_static_image_ani_selection[id];
        if (selection == "random") {
            offset = Math.round(Math.random() * image_def_item_count[key_static_image_ani_id[id]]);
            if (offset >= image_def_item_count[key_static_image_ani_id[id]]) {
                offset--;
            }
        } else if (selection == "sequential") {
            offset++;
            if (offset >= (image_def_item_count[key_static_image_ani_id[id]])) {
                offset = 0;
            }
        }
        offset += image_def_item_offset[key_static_image_ani_id[id]];
        key_static_image_ani_object_playing[id] = offset;
        image_object[offset].setAttribute("ani_id", id);
        image_object[offset].setAttribute("obj_offset", offset);
        key_static_image_ani_canvas[id] = document.createElement("canvas");
        key_static_image_ani_canvas[id].id = "canvas-" + id;
        key_static_image_ani_canvas[id].width = image_object[offset].width * 2;
        key_static_image_ani_canvas[id].height = image_object[offset].height * 2;
        key_static_image_ani_context[id] = key_static_image_ani_canvas[id].getContext("2d");
        key_static_image_ani_context[id].drawImage(image_object[offset], 0, 0);
        try {
            key_static_image_ani_div[id].removeChild(key_static_image_ani_div[id].firstChild);
        } catch (e) {}
        key_static_image_ani_stylesheet[id].removeRule(0);
        var r = "z-index: " + key_static_image_ani_z[id] + "; position: absolute; left: " +
            eval(key_static_image_ani_x[id] + image_x[offset]).toString() + "px; top: " +
            eval(key_static_image_ani_y[id] + image_y[offset]).toString() + "px;";
        key_static_image_ani_stylesheet[id].addRule("#canvas-" + id, r);
        key_static_image_ani_div[id].appendChild(key_static_image_ani_canvas[id]);
    }
}

function animate_key_static_image(script, curr_scr_item, id, action, delay, selection, playcount, foreground, visible) { // return true if script should wait
    if (selection == null) {
        key_static_image_ani_selection[id] = "sequential";
        selection = "sequential";
    } else {
        key_static_image_ani_selection[id] = selection;
    }
    if (visible == null) {
        key_static_image_ani_visible[id] = false;
    } else {
        key_static_image_ani_visible[id] = visible == "true";
    }
    switch (action) {
        case "start":
            if (!skipLesson) {
                key_static_image_ani_action[id] = action;
                start_key_static_image(script, curr_scr_item, id, action, selection, playcount, foreground, visible);
            }
            return false;
        case "stop":
            stop_key_static_image(id);
            stop_static_image(id, selection, playcount, foreground, visible);
            return false;
    }
}


//テキスト表示
function wrapText(context, text, xpos, ypos, maxWidth, lineHeight, nowrap) {
    //Log.info(context);
    //Log.info(text);
    //Log.info(xpos);
    //Log.info(ypos);
    //Log.info(maxWidth);
    //Log.info(lineHeight);
    //Log.info(nowrap);

    try {
        if (nowrap != null) {
            if (text.length > 0) {
                context.fillText(text, xpos, ypos);
            }
            return;
        }
        if (IsTQP) { //ひとまずの調整
            maxWidth = 465;

            //		}else{
            //			maxWidth = 240;
        }
        var padding = 3; //行間
        var words = text.split(" ");
        var line = "";
        var linebreak = false;
        var ignore_space = false;
        //スペースで区切ったものを「^」が出てくるか、
        //順番に足していきmaxWidthを超えるときに改行している
        //誉め言葉の部分はスペースを取る　キワラは赤で表示
        for (var n = 0; n < words.length; n++) {
            if (words[n] == 'ignore_space') {
                if (LanguageID == "JAP-TQ") {
                    ignore_space = true;
                    if (!IsTQP) {
                        context.fillStyle = '#c00';
                    } else {
                        context.fillStyle = '#000';
                        //context.font = "10px "+font_name;
                    }
                }
                words[n] = '';
                line = words[n];
            }
            var x = words[n].indexOf("^");
            //Log.info("words["+n+"]:"+words[n]);
            if (x > 0) {
                linebreak = true;
                words[n] = words[n].substring(0, x);
            }
            if (ignore_space) {
                var testLine = line + words[n];
            } else {
                var testLine = line + words[n] + " ";
            }

            var metrics = context.measureText(testLine);
            var testWidth = metrics.width;
            if (testWidth > maxWidth) {
                context.fillText(line, xpos, ypos);
                if (ignore_space) {
                    line = words[n];
                } else {
                    line = words[n] + " ";
                }
                ypos += lineHeight + padding;
                //Log.info("OuttestWidth:"+testWidth+":"+line +"   ypos:  "+ypos);
            } else {
                line = testLine;
                if (linebreak) {
                    context.fillText(line, xpos, ypos);
                    line = "";
                    ypos += lineHeight + padding;
                }
                //Log.info("IntestWidth:"+testWidth+":"+line +"   ypos:  "+ypos);

            }
            linebreak = false;
        }
        while (line.charAt(0) == " ") {
            line = line.substr(1);
        }
        if (line.length > 0) {
            context.fillText(line, xpos, ypos);
        }
    } catch (e) {}
}


//-----------------------

function challenge_flag_score(yc, yk) {
    //Log.info("challenge_flag_score("+yc+", "+yk+")");
    //強化レッスンチャレンジ スコア獲得時の処理
    var scored = false;
    if (challenge_dir == "up") {
        if (yk < yc) {
            scored = true;
        }
    } else {
        if (yk > yc) {
            scored = true;
        }
    }
    if (scored) {
        //prey_eaten = play_audio_file(prey_eaten, "preyeat", "/Resources/", true, DoOtherSounds);
        prey_eaten = play_audio_file(prey_appears, "preyeat", "/Resources/", true, DoOtherSounds);
        if (ScoreValid) {
            Score += 1000;
            replace_scoretext((Score).toString());
            //Log.info("Score added");
        }
    } else {
        //Log.info("Not Score added");
    }
}


var x;
var y;
var s;

function calc_key_moving_image_data(id) {
    var curr_count = key_moving_image_ani_curr_path_count[id];
    var max_count = key_moving_image_ani_curr_path_duration[id];
    if (curr_count == 0) {
        x = key_moving_image_ani_x0[id];
        y = key_moving_image_ani_y0[id];
        s = key_moving_image_ani_s0[id];
        key_moving_image_ani_currscale[id] = s;
    } else if (curr_count == max_count) {
        x = key_moving_image_ani_x1[id];
        y = key_moving_image_ani_y1[id];
        s = key_moving_image_ani_s1[id];
        key_moving_image_ani_currscale[id] = s;
    } else {
        x = key_moving_image_ani_x0[id] + (key_moving_image_ani_x1[id] - key_moving_image_ani_x0[id]) * curr_count / max_count;
        y = key_moving_image_ani_y0[id] + (key_moving_image_ani_y1[id] - key_moving_image_ani_y0[id]) * curr_count / max_count;
        s = key_moving_image_ani_s0[id] + (key_moving_image_ani_s1[id] - key_moving_image_ani_s0[id]) * curr_count / max_count;
        key_moving_image_ani_currscale[id] = s;
    }
}

function choose_key_moving_next_path(id, path_num) {
    //Log.info("choose_key_moving_next_path("+id+", "+path_num+")");
    try {
        var obj = key_moving_image_ani_object[id].childNodes.item(path_num * 2 + 1);
        key_moving_image_ani_curr_path_duration[id] = parseInt(obj.getAttribute("data-tqani-period"));
        key_moving_image_ani_curr_path_count[id] = 0;
        key_moving_image_ani_x0[id] = parseInt(obj.getAttribute("data-tqani-x0"));
        key_moving_image_ani_x1[id] = parseInt(obj.getAttribute("data-tqani-x1"));
        key_moving_image_ani_y0[id] = parseInt(obj.getAttribute("data-tqani-y0"));
        key_moving_image_ani_y1[id] = parseInt(obj.getAttribute("data-tqani-y1"));
        key_moving_image_ani_s0[id] = parseFloat(obj.getAttribute("data-tqani-s0"));
        key_moving_image_ani_s1[id] = parseFloat(obj.getAttribute("data-tqani-s1"));
    } catch (e) {
        catchlog(e);
    }
}


function do_step_key_moving_image() {
    //Log.info("do_step_key_moving_image");
    try {
        var i;
        for (i = 0; i < key_moving_image_ani_active_count; i++) {
            var id = key_moving_image_ani_active_list[i];
            var obj = image_object[key_moving_image_ani_object_playing[id]];
            var rep = key_moving_image_ani_playcount[id];
            // now check if this path is finished
            var dur = ++key_moving_image_ani_curr_path_count[id];
            if (dur >= key_moving_image_ani_curr_path_duration[id]) {
                var path = ++key_moving_image_ani_path_playing[id];
                if ((2 * path + 1) >= key_moving_image_ani_object[id].childNodes.length) {
                    // paths are completed, check if restart is required
                    if (rep == 0) {
                        // start path again
                        key_moving_image_ani_path_playing[id] = 0;
                        path = 0;
                    } else if (rep == 1) {
                        // playing is done
                        stop_key_moving_image_animation(id);
                        return;
                    } else {
                        key_moving_image_ani_path_playing[id]--;
                        path--;
                    }
                }
                choose_key_moving_next_path(id, path);
            }
            calc_key_moving_image_data(id);
            // choose next image
            if (key_moving_image_ani_prey_duration[id] != null) {
                //獲物をつかまえた時
                //Log.info("prey:"+key_moving_image_ani_prey_key_count[id]+"/"+key_moving_image_ani_prey_duration[id]);
                if (++key_moving_image_ani_prey_key_count[id] == key_moving_image_ani_prey_duration[id]) {
                    prey_eaten = play_audio_file(prey_eaten, "preyeat", "/Resources/", true, DoOtherSounds);
                    if (ScoreValid) {
                        Score += parseInt(key_moving_image_ani_signtext[id]);
                        replace_scoretext((Score).toString());
                    }
                    if (key_moving_image_ani_prey2fx[id] != null) {
                        prey_2fx = null;
                        key_moving_image_ani_signtext[id] = null;
                        play_audio_file(prey_2fx, key_moving_image_ani_prey2fx[id], "/Resources", true, DoOtherSounds);
                    }
                    if (key_moving_image_ani_prey2[id] == null) {
                        // prey disappears here
                        stop_key_moving_image_animation(id);
                        return;
                    }
                    // make sure timed image is off
                    image_def_istimed[key_moving_image_ani_id[id]] = false;
                }
            }
            if (key_moving_image_ani_prey_duration[id] != null && key_moving_image_ani_prey_key_count[id] > key_moving_image_ani_prey_duration[id] && key_moving_image_ani_prey2[id] != null) {
                // use image 2
                var offset = image_def_item_offset[key_moving_image_ani_prey2[id]];
                key_moving_image_ani_object_playing[id] = offset;
                image_object[offset].setAttribute("ani_id", id);
                image_object[offset].setAttribute("obj_offset", offset);
            } else {
                if (!(image_def_item_count[key_moving_image_ani_id[id]] > 1 && image_def_istimed[key_moving_image_ani_id[id]]) || key_moving_image_ani_canvas[id] == null) {
                    var offset = key_moving_image_ani_object_playing[id];
                    if (image_def_item_count[key_moving_image_ani_id[id]] > 1) {
                        offset -= image_def_item_offset[key_moving_image_ani_id[id]];
                        var prevoffset = offset;
                        var selection = key_moving_image_ani_selection[id];
                        if (selection == "random") {
                            offset = Math.round(Math.random() * image_def_item_count[key_moving_image_ani_id[id]]);
                            if (offset >= image_def_item_count[key_moving_image_ani_id[id]]) {
                                offset--;
                            }
                        } else if (selection == "sequential") {
                            offset++;
                            if (offset >= (image_def_item_count[key_moving_image_ani_id[id]])) {
                                offset = 0;
                            }
                        }
                        offset += image_def_item_offset[key_moving_image_ani_id[id]];
                        key_moving_image_ani_object_playing[id] = offset;
                        image_object[offset].setAttribute("ani_id", id);
                        image_object[offset].setAttribute("obj_offset", offset);
                    }
                }
            }
            if (!(image_def_item_count[key_moving_image_ani_id[id]] > 1 && image_def_istimed[key_moving_image_ani_id[id]]) || key_moving_image_ani_canvas[id] == null) {
                key_moving_image_ani_canvas[id] = document.createElement("canvas");
                key_moving_image_ani_canvas[id].id = "canvas-" + id;
                var st = key_moving_image_ani_signtext[id];
                if (st != null) {
                    var sf = Math.round(parseInt(key_moving_image_ani_sign_fontsize[id]) * s);
                    var sx = key_moving_image_ani_sign_x[id] * 2 * s;
                    var sy = key_moving_image_ani_sign_y[id] * 2 * s;
                    if (sx < 0) {
                        key_moving_image_ani_canvas[id].width = image_object[offset].width * 2 * s;
                        key_moving_image_ani_canvas[id].height = image_object[offset].height * 2 * s;
                        key_moving_image_ani_context[id] = key_moving_image_ani_canvas[id].getContext("2d");
                        key_moving_image_ani_context[id].drawImage(image_object[offset], -sx, -sy, image_object[offset].width * s, image_object[offset].height * s);
                        key_moving_image_ani_context[id].font = (sf).toString() + "pt " + font_name;
                        key_moving_image_ani_context[id].fillText(st, 0, sf + 5);
                    } else {
                        key_moving_image_ani_canvas[id].width = image_object[offset].width * 2 * s + 1;
                        key_moving_image_ani_canvas[id].height = image_object[offset].height * 2 * s + 1;
                        key_moving_image_ani_context[id] = key_moving_image_ani_canvas[id].getContext("2d");
                        key_moving_image_ani_context[id].drawImage(image_object[offset], 0, 0, image_object[offset].width * s, image_object[offset].height * s);
                        key_moving_image_ani_context[id].font = (sf).toString() + "pt " + font_name;
                        wrapText(key_moving_image_ani_context[id], st, sx, sy, key_moving_image_ani_sign_width[id] * 2 * s, sf, null);
                    }
                } else {
                    key_moving_image_ani_canvas[id].width = image_object[offset].width * 2 * s + 1;
                    key_moving_image_ani_canvas[id].height = image_object[offset].height * 2 * s + 1;
                    key_moving_image_ani_context[id] = key_moving_image_ani_canvas[id].getContext("2d");
                    key_moving_image_ani_context[id].drawImage(image_object[offset], image_x[offset] * s, image_y[offset] * s, image_object[offset].width * s, image_object[offset].height * s);
                }
                try {
                    key_moving_image_ani_div[id].removeChild(key_moving_image_ani_div[id].firstChild);
                } catch (e) {}
                key_moving_image_ani_div[id].appendChild(key_moving_image_ani_canvas[id]);
            }
            key_moving_image_ani_stylesheet[id].removeRule(0);
            key_moving_image_ani_stylesheet[id].addRule("#canvas-" + id, "z-index: " + key_moving_image_ani_z[id] + "; position: absolute; left: " + (x).toString() + "px; top: " + (y).toString() + "px;");
            if (id == kewala_ext_ani) {
                if (challenger_ext_ani != null) {
                    challenge_strokes++;
                    //Log.info("challenge_strokes: "+challenge_strokes);
                    var obj;
                    obj = document.getElementById("div-" + challenger_ext_ani);
                    if (obj == null) {
                        obj = document.getElementById("div-" + challenger_ext_ani + "-0");
                    }
                    if (obj == null) {
                        obj = document.getElementById("div-" + challenger_ext_ani + "-1");
                    }
                    if (obj == null) {
                        obj = document.getElementById("div-" + challenger_ext_ani + "-2");
                    }
                    if (obj != null) {
                        try {
                            var xnow = window.getComputedStyle(obj, null);
                            var sleft = xnow.getPropertyValue("left");
                            var ileft = Math.round(parseInt(sleft.substring(0, sleft.length - 2)));
                            var stop = xnow.getPropertyValue("top");
                            var itop = Math.round(parseInt(stop.substring(0, stop.length - 2)));
                            //var pos = "x="+(ileft).toString()+" y="+(itop).toString();
                            //replace_scoretext((pos).toString());
                        } catch (ee) {
                            catchlog(ee);
                        }
                        if (challenge_flag1 == challenge_strokes) {
                            challenge_flag_score(itop, y);
                        }
                        if (challenge_flag2 == challenge_strokes) {
                            challenge_flag_score(itop, y);
                        }
                    }
                }
            }
        }
    } catch (e) {
        catchlog(e);
    }
}


function start_key_moving_image(script, curr_scr_item, id, action, selection, playcount, foreground, visible, pathoffset) {
    //Log.info("start_key_moving_image("+script+","+ curr_scr_item+","+ id+","+ action+","+ selection+","+ playcount+","+ foreground+","+ visible+","+ pathoffset +")");


    try {
        var offset = 0;
        if (selection == "random") {
            offset = Math.round(Math.random() * image_def_item_count[key_moving_image_ani_id[id]]);
            if (offset >= image_def_item_count[key_moving_image_ani_id[id]]) {
                offset--;
            }
        }
        offset += image_def_item_offset[key_moving_image_ani_id[id]];
        if (image_object[offset] == null) {
            //Log.info("Image for animation "+id+" not loaded");
        }
        key_moving_image_ani_object_playing[id] = offset;
        if (foreground == null) {
            key_moving_image_ani_foreground[id] = false;
        } else {
            key_moving_image_ani_foreground[id] = foreground == "true";
        }

        if (playcount == null) {
            key_moving_image_ani_playcount[id] = 1;
        } else {
            key_moving_image_ani_playcount[id] = parseInt(playcount);
        }
        if (key_moving_image_ani_prey_duration[id] != null) {
            key_moving_image_ani_prey_key_count[id] = 0;
            play_audio_file(prey_appears, "preyahed", "/Resources/", true, DoOtherSounds);
        }

        key_moving_image_ani_path_playing[id] = pathoffset;
        choose_key_moving_next_path(id, key_moving_image_ani_path_playing[id]);
        calc_key_moving_image_data(id);
        key_moving_image_ani_object_playing[id] = offset;
        image_object[offset].setAttribute("ani_id", id);
        image_object[offset].setAttribute("obj_offset", offset);
        key_moving_image_ani_canvas[id] = document.createElement("canvas");
        key_moving_image_ani_canvas[id].id = "canvas-" + id;


        var st = key_moving_image_ani_signtext[id];
        if (st != null) { // signTextがある場合

            var sf = Math.round(parseInt(key_moving_image_ani_sign_fontsize[id]) * s);
            var sx = key_moving_image_ani_sign_x[id] * 2 * s;
            var sy = key_moving_image_ani_sign_y[id] * 2 * s;
            if (sx < 0) {
                key_moving_image_ani_canvas[id].width = image_object[offset].width * 2 * s;
                key_moving_image_ani_canvas[id].height = image_object[offset].height * 2 * s;
                key_moving_image_ani_context[id] = key_moving_image_ani_canvas[id].getContext("2d");
                key_moving_image_ani_context[id].drawImage(image_object[offset], -sx, -sy, image_object[offset].width * s, image_object[offset].height * s);
                key_moving_image_ani_context[id].font = (sf).toString() + "pt " + font_name;
                key_moving_image_ani_context[id].fillText(st, 0, sf + 5);
            } else {
                key_moving_image_ani_canvas[id].width = image_object[offset].width * 2 * s + 1;
                key_moving_image_ani_canvas[id].height = image_object[offset].height * 2 * s + 1;
                key_moving_image_ani_context[id] = key_moving_image_ani_canvas[id].getContext("2d");
                key_moving_image_ani_context[id].drawImage(image_object[offset], 0, 0, image_object[offset].width * s, image_object[offset].height * s);
                key_moving_image_ani_context[id].font = (sf).toString() + "pt " + font_name;
                key_moving_image_ani_context[id].fillText(st, sx, sy);
            }
        } else {
            var kx = image_x[offset] * s;
            var ky = image_y[offset] * s;
            key_moving_image_ani_canvas[id].width = image_object[offset].width * 2 * s + 1;
            key_moving_image_ani_canvas[id].height = image_object[offset].height * 2 * s + 1;
            key_moving_image_ani_context[id] = key_moving_image_ani_canvas[id].getContext("2d");
            key_moving_image_ani_context[id].drawImage(image_object[offset], kx, ky, image_object[offset].width * s, image_object[offset].height * s);
        }
        key_moving_image_ani_stylesheet[id].addRule("#canvas-" + id, "z-index: " + key_moving_image_ani_z[id] + "; position: absolute; left: " + (x).toString() + "px; top: " + (y).toString() + "px;");
        key_moving_image_ani_div[id].appendChild(key_moving_image_ani_canvas[id]);
        draw_region.appendChild(key_moving_image_ani_div[id]);
        key_moving_image_ani_active_list[key_moving_image_ani_active_count++] = id;
        //Log.info("key_moving_image_ani_active_list["+ (key_moving_image_ani_active_count-1) +"]:"+key_moving_image_ani_active_list[key_moving_image_ani_active_count++]);
        //Log.info("key_moving_image_ani_active_count:"+ key_moving_image_ani_active_count);
        // if there are multiple images and they are timed, set a timer to work through them
        if (image_def_item_count[key_moving_image_ani_id[id]] > 1 && image_def_istimed[key_moving_image_ani_id[id]]) {
            d0 = parseInt(image_period[offset]);
            key_moving_image_ani_timestep[id] = new KeyMovingImageTimestep(id);
            key_moving_image_ani_timestep[id].start(d0);
        }
    } catch (e) {
        catchlog(e);
    }
}

function stop_key_moving_image_animation(id) {
    var i;
    for (i = 0; i < key_moving_image_ani_active_count; i++) {
        if (key_moving_image_ani_active_list[i] == id) {
            if (image_def_item_count[key_moving_image_ani_id[id]] > 1 && image_def_istimed[key_moving_image_ani_id[id]]) {
                key_moving_image_ani_object_playing[id] = -1;
            }
            try {
                key_moving_image_ani_div[id].removeChild(key_moving_image_ani_div[id].firstChild);
                draw_region.removeChild(key_moving_image_ani_div[id]);
            } catch (e) {}
            var j;
            for (j = i + 1; j < key_moving_image_ani_active_count; j++) {
                key_moving_image_ani_active_list[j - 1] = key_moving_image_ani_active_list[j];
            }
            key_moving_image_ani_active_count--;
            break;
        }
    }
}

//キー操作で動くアニメーション
function animate_key_moving_image(script, curr_scr_item, id, action, delay, selection, playcount, foreground, visible, pathoffset, signtext, sign_x, sign_y, sign_fontsize, sign_width, sign_height, prey2, prey_duration, prey2fx) {
    //Log.info("animate_key_moving_image("+ script +","+ curr_scr_item +","+ id +","+ action +","+ delay +","+ selection +","+ playcount +","+ foreground +","+ visible +","+ pathoffset +","+ signtext +","+ sign_x +","+ sign_y +","+ sign_fontsize +","+ sign_width +","+ sign_height +","+ prey2 +","+ prey_duration +","+ prey2fx+")");
    // return true if script should wait
    if (signtext != null) {
        key_moving_image_ani_signtext[id] = signtext;
        if (sign_x == null) {
            key_moving_image_ani_sign_x[id] = 0;
        } else {
            key_moving_image_ani_sign_x[id] = sign_x;
        }
        if (sign_y == null) {
            key_moving_image_ani_sign_y[id] = 0;
        } else {
            key_moving_image_ani_sign_y[id] = sign_y;
        }
        if (sign_fontsize == null) {
            key_moving_image_ani_sign_fontsize[id] = 20;
        } else {
            key_moving_image_ani_sign_fontsize[id] = sign_fontsize;
        }
        if (sign_width == null) {
            key_moving_image_ani_sign_width[id] = 100;
        } else {
            key_moving_image_ani_sign_width[id] = sign_width;
        }
        if (sign_height == null) {
            key_moving_image_ani_sign_height[id] = 100;
        } else {
            key_moving_image_ani_sign_height[id] = sign_height;
        }
    }
    if (prey_duration != null) {
        //Log.info("prey_duration is not null");
        key_moving_image_ani_prey2[id] = prey2;
        key_moving_image_ani_prey_duration[id] = prey_duration;
        key_moving_image_ani_prey2fx[id] = prey2fx;
        //Log.info("key_moving_image_ani_prey_duration["+id+"]:"+key_moving_image_ani_prey_duration[id]);
    }
    if (pathoffset == null) {
        key_moving_image_ani_path_offset[id] = 0;
    } else {
        key_moving_image_ani_path_offset[id] = parseInt(pathoffset);
    }
    if (selection == null) {
        key_moving_image_ani_selection[id] = "sequential";
        selection = "sequential";
    } else {
        key_moving_image_ani_selection[id] = selection;
    }
    if (visible == null) {
        key_moving_image_ani_visible[id] = false;
    } else {
        key_moving_image_ani_visible[id] = visible == "true";
    }
    switch (action) {
        case "restart":
            init_part_key_moving_image_animation(id);
        case "start":
            if (delay != null) {
                d0 = parseInt(delay);
                setTimeout(function () {
                    key_moving_image_delay_handler(script, curr_scr_item, id, action, selection, playcount, foreground, visible);
                    script = null;
                    curr_scr_item;
                    id = null;
                    action = null;
                    selection = null;
                    playcount = null;
                    foreground = null;
                }, d0);
                if (foreground != null && foreground == "true") {
                    return true;
                }
                return false;
            }
            if (key_moving_image_ani_object_playing[id] >= 0) {
                stop_key_moving_image_animation(id);
            }
            key_moving_image_ani_action[id] = action;
            key_moving_image_ani_script[id] = script;
            key_moving_image_ani_curr_scr_item[id] = curr_scr_item;
            start_key_moving_image(script, curr_scr_item, id, action, selection, playcount, foreground, key_moving_image_ani_visible[id], key_moving_image_ani_path_offset[id]);
            if (foreground != null && foreground == "true") {
                return true;
            }
            return false;
        case "stop":
            stop_key_moving_image_animation(id);
            return false;
        case "wait":
            if (key_moving_image_ani_object_playing[id] >= 0) {
                key_moving_image_ani_foreground[id] = true;
                key_moving_image_ani_script[id] = script;
                key_moving_image_ani_curr_scr_item[id] = curr_scr_item;
                return true;
            } else {
                return false;
            }
    }
}


//----------------------
var lesson_type;
var lesson_active;
var lesson_script;
var predatorappears_script = "predatorappears_script";
var predatorbites_script = "predatorbites_script";
var predatormisses_script = "predatormisses_script";
var lesson_item;
var lesson_beep = null;
//var prey_appears = "https://storage.googleapis.com/" + "tqcloud.appspot.com";
var prey_appears = null;
var STORAGE_PATH = get_Bucket();

var prey_eaten = null;
var prey_2fx = null;
var stimulus_text;
var stimulus_index;
var response_text;
var response_index;
var line_start_time;
var error_colour = "ff0000";
var font_fore_colour = "000000";
var font_back_colour = "ffffff";
var font_name = "Default";
var font_size = "18";
var org_font_size;
var font_size_int = 18;

var stimbasediv;
var stimbasecanvas;
var stimbasecontext;

var stimreddiv;
var stimredcanvas;
var stimredcontext;


function stimline_create() {
    //Log.info("stimline_create is called");
    if (stimbasediv != null) {
        try {
            stimbasediv.removeChild(stimbasecanvas);
            draw_region.removeChild(stimbasediv);
            stimreddiv.removeChild(stimredcanvas);
            draw_region.removeChild(stimreddiv);
        } catch (e) {}
    }
    stimbasediv = document.createElement("div");
    stimbasediv.style.position = "absolute";
    var stimwidth = 600;
    if (IsTQP) {
        stimbasediv.style.top = "120px";
        stimbasediv.style.left = "32px";
    } else {
        if (IsTFSExtLesson) {
            stimbasediv.style.top = "28px";
            stimbasediv.style.left = "30px";
            stimbasediv.style.width = "400px";
            stimwidth = 400;
        } else {
            stimbasediv.style.top = "24px";
            stimbasediv.style.left = "30px";
            stimbasediv.style.width = "600px";
            stimwidth = 600;
        }
    }
    font_size = org_font_size;
    stimbasediv.style.zIndex = 10000;
    stimbasediv.style.height = (font_size_int + 17).toString() + "px"; // padding of 5 top 5 bottom
    if (browser == 4) {
        stimbasediv.style.visibility = "hidden";
    } else {
        stimbasediv.hidden = true;
    }
    if (font_fore_colour != font_back_colour) {
        stimbasediv.style.backgroundColor = "#" + font_back_colour;
    }
    stimbasecanvas = document.createElement("canvas");
    stimbasecanvas.width = 600;
    stimbasecanvas.height = font_size_int + 17;
    stimbasecontext = stimbasecanvas.getContext("2d");
    stimbasecontext.font = font_size + "px " + font_name;
    stimbasecontext.fillStyle = "#" + font_fore_colour;
    stimbasediv.appendChild(stimbasecanvas);
    draw_region.appendChild(stimbasediv);
    // check stimulus text will fit
    // 行をはみ出す場合はフォントサイズを小さくする
    var mtr = stimbasecontext.measureText(stimulus_text);
    while ((mtr.width + 10) > stimwidth) {
        font_size--;
        Log.info("ajst_font_size: " + font_size);
        stimbasecontext.font = font_size + "px " + font_name;
        mtr = stimbasecontext.measureText(stimulus_text);
    }
    // now colouring line floating over blacktext
    stimreddiv = document.createElement("div");
    stimreddiv.style.position = "absolute";
    stimreddiv.style.top = stimbasediv.style.top;
    stimreddiv.style.left = stimbasediv.style.left;
    stimreddiv.style.zIndex = 10001;
    stimreddiv.style.width = stimbasediv.style.width;
    stimreddiv.style.height = stimbasediv.style.height;
    if (browser == 4) {
        stimreddiv.style.visibility = "hidden";
    } else {
        stimreddiv.hidden = true;
    }
    stimredcanvas = document.createElement("canvas");
    stimredcanvas.width = stimbasecanvas.width;
    stimredcanvas.height = stimbasecanvas.height;
    stimredcontext = stimredcanvas.getContext("2d");
    stimredcontext.font = font_size + "px " + font_name;
    stimredcontext.fillStyle = "#" + error_colour;
    stimreddiv.appendChild(stimredcanvas);
    draw_region.appendChild(stimreddiv);
}

function stimline_settext(s) {
    //Log.info("stimline_settext("+s+")");
    //練習テキスト表示
    stimbasecontext.clearRect(0, 0, stimbasecanvas.width, stimbasecanvas.height);
    stimbasecontext.fillText(s, 5, font_size_int + 5); // padding 5x 5y
    stimredcontext.clearRect(0, 0, stimbasecanvas.width, stimbasecanvas.height);
}

function stimline_setcolourat(n) {
    stimredcontext.clearRect(0, 0, stimbasecanvas.width, stimbasecanvas.height);
    if (n == 0) {
        stimredcontext.fillText(stimulus_text.charAt(0), 5, font_size_int + 5);
        stimredcontext.fillText("_", 5, font_size_int + 5);
    } else {
        var mtr = stimredcontext.measureText(stimulus_text.substr(0, n));
        stimredcontext.fillText(stimulus_text.charAt(n), mtr.width + 5, font_size_int + 5);
        stimredcontext.fillText("_", mtr.width + 5, font_size_int + 5);
    }
}

var respbasediv;
var respbasecanvas;
var respbasecontext;

var respreddiv;
var respredcanvas;
var respredcontext;

var cursordiv;
var cursorcanvas;
var cursorcontext;

var Mapadiv;
var Mapacanvas;
var Mapacontext;

var Mapjdiv;
var Mapjcanvas;
var Mapjcontext;

var Map1div;
var Map1canvas;
var Map1context;
var Map1text = "";

var Map2div;
var Map2canvas;
var Map2context;
var Map2text = "";

var Map3div;
var Map3canvas;
var Map3context;
var Map3text = "";

var Map4div;
var Map4canvas;
var Map4context;
var Map4text = "";

function respline_create() {
    //Log.info("respline_create() is called");
    if (respbasediv != null) {
        try {
            respbasediv.removeChild(respbasecanvas);
            draw_region.removeChild(respbasediv);
            respreddiv.removeChild(respredcanvas);
            draw_region.removeChild(respreddiv);
        } catch (e) {}
    }
    //テキスト入力欄
    response_text = "";
    response_index = 0;
    respbasediv = document.createElement("div");
    respbasediv.style.position = "absolute";
    if (IsTQP) {
        respbasediv.style.top = "165px";
        respbasediv.style.left = "32px";
    } else {
        if (IsTFSExtLesson) {
            respbasediv.style.top = "61px";
            respbasediv.style.left = "30px";
            respbasediv.style.width = "400px";
        } else {
            respbasediv.style.top = "61px";
            respbasediv.style.left = "30px";
            respbasediv.style.width = "600px";
        }
    }
    respbasediv.style.zIndex = 10000;
    respbasediv.style.height = (font_size_int + 17).toString() + "px"; // padding of 5 top 5 bottom
    if (browser == 4) {
        respbasediv.style.visibility = "hidden";
    } else {
        respbasediv.hidden = true;
    }
    if (font_fore_colour != font_back_colour) {
        respbasediv.style.backgroundColor = "#" + font_back_colour;
    }
    respbasecanvas = document.createElement("canvas");
    respbasecanvas.width = 600;
    respbasecanvas.height = font_size_int + 17;
    respbasecontext = respbasecanvas.getContext("2d");
    respbasecontext.font = font_size + "px " + font_name;
    respbasecontext.fillStyle = "#" + font_fore_colour;
    respbasediv.appendChild(respbasecanvas);
    draw_region.appendChild(respbasediv);
    // now colouring line floating over blacktext
    respreddiv = document.createElement("div");
    respreddiv.style.position = "absolute";
    respreddiv.style.top = respbasediv.style.top;
    respreddiv.style.left = respbasediv.style.left;
    respreddiv.style.zIndex = 10001;
    respreddiv.style.width = respbasediv.style.width;
    respreddiv.style.height = respbasediv.style.height;
    if (browser == 4) {
        respreddiv.style.visibility = "hidden";
    } else {
        respreddiv.hidden = true;
    }
    respredcanvas = document.createElement("canvas");
    respredcanvas.width = respbasecanvas.width;
    respredcanvas.height = respbasecanvas.height;
    respredcontext = respredcanvas.getContext("2d");
    respredcontext.font = font_size + "px " + font_name;
    respredcontext.fillStyle = "#" + error_colour;
    respreddiv.appendChild(respredcanvas);
    draw_region.appendChild(respreddiv);
    if (cursordiv == null) {
        makecursor();
    }
    //cursordiv.type = "text";
    cursordiv.value = "";
    cursordiv.style.top = respbasediv.style.top;
    cursordiv.style.left = respbasediv.style.left;
    cursordiv.style.width = "20px";
    cursordiv.style.height = (font_size_int + 17).toString() + "px"; // padding of 5 top 5 bottom
    cursorcontext.font = font_size + "px " + font_name;
    cursorcanvas.top = respbasediv.style.top;
    cursorcanvas.left = respbasediv.style.left;
    cursorcanvas.width = 20;
    cursorcanvas.height = (font_size_int + 17).toString(); // padding of 5 top 5 bottom
    cursordiv.focus();
}

function respline_clear() {
    respredcontext.clearRect(0, 0, respredcanvas.width, respredcanvas.height);
    respbasecontext.clearRect(0, 0, respredcanvas.width, respbasecanvas.height);
    cursordiv.style.left = (32 + 5).toString() + "px";
    cursorcanvas.left = (32 + 5);
}

function respline_addcharat(n, isred) {
    //Log.info("respline_addcharat");
    cursordiv.value = "";
    var mtr = respbasecontext.measureText(response_text.substr(0, n - 1));
    if (isred) {
        respredcontext.fillText(response_text.charAt(n - 1), mtr.width + 5, font_size_int + 5);
    } else {
        respbasecontext.fillText(response_text.charAt(n - 1), mtr.width + 5, font_size_int + 5);
    }
    mtr = respbasecontext.measureText(response_text.substr(0, n));
    cursordiv.style.left = (32 + 5 + mtr.width).toString() + "px";
    cursorcanvas.left = (32 + 5 + mtr.width);
}

function respline_setline(s) {
    cursordiv.textContent = "";
    respbasecontext.clearRect(0, 0, respbasecanvas.width, respbasecanvas.height);
    var mtr = respbasecontext.measureText(s);
    respbasecontext.fillText(s, 5, font_size_int + 5);
    cursordiv.style.left = (32 + 5 + mtr.width).toString() + "px";
    cursorcanvas.left = (32 + 5 + mtr.width);
}

function respline_setcolour(n) {
    respredcontext.clearRect(0, 0, respredcanvas.width, respredcanvas.height);
    var i;
    for (i = 0; i < n; i++) {
        if (needscolour[i]) {
            var mtr = respbasecontext.measureText(response_text.substr(0, i));
            respredcontext.fillText(response_text.charAt(i), mtr.width + 5, font_size_int + 5);
        }
    }
}

function respline_backspaceto(n) {
    var mtr = respbasecontext.measureText(response_text.substr(0, n));
    respredcontext.clearRect(mtr.width + 5, 0, respredcanvas.width, respredcanvas.height);
    respbasecontext.clearRect(mtr.width + 5, 0, respbasecanvas.width, respbasecanvas.height);
    cursordiv.style.left = (32 + 5 + mtr.width).toString() + "px";
    cursorcanvas.left = (32 + 5 + mtr.width);
}

var inputfieldshidden = true;

function line_hide() {
    inputfieldshidden = true;
    cursordiv.style.top = 0;
    cursordiv.style.left = 0;
    cursordiv.style.width = "640px";
    cursordiv.style.height = "480px";
    cursorcanvas.top = 0;
    cursorcanvas.left = 0;
    cursorcanvas.width = 640;
    cursorcanvas.height = 480;
    cursorcontext.font = "1px " + font_name;
    //cursordiv.type = "hidden";
    if (browser == 4) {
        stimbasediv.style.visibility = "hidden";
        respbasediv.style.visibility = "hidden";
    } else {
        stimbasediv.hidden = true;
        respbasediv.hidden = true;
    }
    if (browser == 4) {
        stimreddiv.style.visibility = "hidden";
        respreddiv.style.visibility = "hidden";
    } else {
        stimreddiv.hidden = true;
        respreddiv.hidden = true;
    }
    if (maptext_test) {
        if (browser == 4) {
            Map1div.style.visibility = "hidden";
        } else {
            Map1div.hidden = true;
        }
        if (browser == 4) {
            Map2div.style.visibility = "hidden";
        } else {
            Map2div.hidden = true;
        }
        if (browser == 4) {
            Map3div.style.visibility = "hidden";
        } else {
            Map3div.hidden = true;
        }
        if (browser == 4) {
            Map4div.style.visibility = "hidden";
        } else {
            Map4div.hidden = true;
        }
    }
}

function line_show() {
    inputfieldshidden = false;
    //cursordiv.type = "text";
    cursordiv.style.top = respbasediv.style.top;
    cursordiv.style.left = respbasediv.style.left;
    cursordiv.style.width = "20px";
    cursordiv.style.height = (font_size_int + 17).toString() + "px"; // padding of 5 top 5 bottom
    cursorcontext.font = font_size + "px " + font_name;
    cursorcanvas.top = respbasediv.style.top;
    cursorcanvas.left = respbasediv.style.left;
    cursorcanvas.width = 20;
    cursorcanvas.height = (font_size_int + 17).toString(); // padding of 5 top 5 bottom
    cursordiv.focus();
    if (browser == 4) {
        stimbasediv.style.visibility = "visible";
        respbasediv.style.visibility = "visible";
    } else {
        stimbasediv.hidden = false;
        respbasediv.hidden = false;
    }
    if (browser == 4) {
        stimreddiv.style.visibility = "visible";
        respreddiv.style.visibility = "visible";
    } else {
        stimreddiv.hidden = false;
        respreddiv.hidden = false;
    }
    if (maptext_test) {
        if (browser == 4) {
            Map1div.style.visibility = "visible";
        } else {
            Map1div.hidden = false;
        }
        if (browser == 4) {
            Map2div.style.visibility = "visible";
        } else {
            Map2div.hidden = false;
        }
        if (browser == 4) {
            Map3div.style.visibility = "visible";
        } else {
            Map3div.hidden = false;
        }
        if (browser == 4) {
            Map4div.style.visibility = "visible";
        } else {
            Map4div.hidden = false;
        }
    }
}

function SetSpacing(s) {


    //202106 入力カスタマイズ機能追加
    if (CourseID == "Accuracy Challenge (Romaji)" || CourseID == "Speed Challenge (Romaji)" || CourseID == "Advanced Challenge (Romaji)" || CourseID == "Skill Tests (Romaji)" || CourseID == "Royal Challenge 2 (Romaji)") {

        //Log.info(t);

        //ヘボン式テキスト
        original = ['shi', 'chi', 'tsu', 'fu', 'sha', 'shu', 'sho', 'cha', 'chu', 'cho', 'ja', 'ji', 'ju', 'jo'];

        //ユーザ設定入力
        custom = [];

        if (CustomInput != 'None') {
            custom = CustomInput.split(',');

            //テキスト置換

            for (i = 0; i < original.length; i++) {

                reg = original[i]
                s = s.replace(new RegExp(reg, "g"), custom[i]);

            }
            s = s.replace(/ct/g, "tt");
            s = s.replace(/jz/g, "zz");
            s = s.replace(/fh/g, "hh");
        }

        //Log.info(t);

    }



    if (!SingleSpace) {
        return s;
    }
    var t = "";

    for (i = 0; i < s.length; i++) {
        if (!(s.charAt(i) == " " && s.charAt(i - 1) == " ")) {
            t += s.charAt(i);
        }
    }


    return t;
}

function reposition_image(obj, x, y, visible) {
    try {
        var id = obj.getAttribute("obj_id");
        var offset = parseInt(obj.getAttribute("obj_offset"));
        image_x[offset] = x;
        image_y[offset] = y;
        image_def_stylesheet[id].removeRule(0);
        image_def_stylesheet[id].addRule("#div-" + id, "z-index: " +
            image_z[offset].toString() + "; position: absolute; left: " +
            image_x[offset].toString() + "px; top: " +
            image_y[offset].toString() + "px; opacity: " +
            image_a[offset].toString() + ";"
        );
        if (browser == 4) {
            if (!visible) {
                image_def_div[id].style.visibility = "visible";
            } else {
                image_def_div[id].style.visibility = "hidden";
            }
        } else {
            image_def_div[id].hidden = visible;
        }
    } catch (e) {
        catchlog(e);
    }
}

function findkey(keytomatch, att) {
    try {
        if (keytomatch == " ") {
            keytomatch = "Spacebar";
        } else if (keytomatch == "\r") {
            keytomatch = "Enter";
        }
        for (var i = 1; i < tqkbdef.childNodes.length; i += 2) {
            var row = tqkbdef.childNodes.item(i);
            var keys = row.childNodes;
            for (var j = 1; j < keys.length; j += 2) {
                lastkey = keys.item(j);
                if (lastkey.getAttribute(att) == keytomatch) {
                    var z = lastkey.getAttribute("name").indexOf("Space");
                    if (z == 0 || lastkey.getAttribute("name").length == 1) {
                        lastbasekeytomatch = lastkey.getAttribute("name");
                        lastkeytomatch = keytomatch;
                        lastnormkey = lastkey;
                    } else {
                        z = 0;
                    }
                    return true;
                }
            }
        }
        return false;
    } catch (e) {
        catchlog(e);
    }
}

function getlastimagepos(lastkey) {
    try {
        var ic;
        switch (lastkey.getAttribute("imagepos")) {
            case "blue":
                ic = 0;
                break;
            case "red":
                ic = 1;
                break;
            case "orange":
                ic = 2;
                break;
            case "green":
                ic = 3;
                break;
            case "grey":
                ic = 4;
                break;
        }
        return ic;
    } catch (e) {
        catchlog(e);
    }
}

function showhidemainkey(keytomatch, displayit) {
    try {
        var found = false;
        if (IsKeypadLesson && keytomatch == " ") {
            keytomatch = "\r";
        }
        if (keytomatch == " ") {
            keytomatch = "Spacebar";
        } else if (keytomatch == "\r") {
            keytomatch = "Enter";
        }
        if (findkey(keytomatch, "name")) {
            var ic = getlastimagepos(lastkey);
            if (displayit) {
                var xx = parseInt(tqkbdef.getAttribute("XPos")) + parseInt(lastkey.getAttribute("x"));
                var yy = parseInt(tqkbdef.getAttribute("YPos")) + parseInt(lastkey.getAttribute("y"));
                reposition_image(NormalKeys[ic], xx, yy, false);
            } else {
                if (browser == 4) {
                    image_def_div[NormalKeys[ic].getAttribute("obj_id")].style.visibility = "hidden";
                    if (!IsKeypadLesson) {
                        image_def_div[LShiftKeys[0].getAttribute("obj_id")].style.visibility = "hidden";
                        image_def_div[RShiftKeys[0].getAttribute("obj_id")].style.visibility = "hidden";
                    }
                } else {
                    image_def_div[NormalKeys[ic].getAttribute("obj_id")].hidden = true;
                    if (!IsKeypadLesson) {
                        image_def_div[LShiftKeys[0].getAttribute("obj_id")].hidden = true;
                        image_def_div[RShiftKeys[0].getAttribute("obj_id")].hidden = true;
                    }
                }
            }
        } else if (findkey(keytomatch, "sname")) {
            var ic = getlastimagepos(lastkey);
            if (displayit) {
                var xx = parseInt(tqkbdef.getAttribute("XPos")) + parseInt(lastkey.getAttribute("x"));
                var yy = parseInt(tqkbdef.getAttribute("YPos")) + parseInt(lastkey.getAttribute("y"));
                reposition_image(NormalKeys[ic], xx, yy, false);
                if (!IsKeypadLesson) {
                    if (lastkey.getAttribute("hand_side") == "left") {
                        findkey("RShift", "name");
                        var offset = RShiftKeys[0].getAttribute("obj_offset");
                        reposition_image(RShiftKeys[0], image_x[offset], image_y[offset], false);
                    } else {
                        findkey("LShift", "name");
                        var offset = LShiftKeys[0].getAttribute("obj_offset");
                        reposition_image(LShiftKeys[0], image_x[offset], image_y[offset], false);
                    }
                }
            } else {
                if (browser == 4) {
                    image_def_div[NormalKeys[ic].getAttribute("obj_id")].style.visibility = "hidden";
                    if (!IsKeypadLesson) {
                        image_def_div[LShiftKeys[0].getAttribute("obj_id")].style.visibility = "hidden";
                        image_def_div[RShiftKeys[0].getAttribute("obj_id")].style.visibility = "hidden";
                    }
                } else {
                    image_def_div[NormalKeys[ic].getAttribute("obj_id")].hidden = true;
                    if (!IsKeypadLesson) {
                        image_def_div[LShiftKeys[0].getAttribute("obj_id")].hidden = true;
                        image_def_div[RShiftKeys[0].getAttribute("obj_id")].hidden = true;
                    }
                }
            }
        } else if (findkey(keytomatch, "usdname")) {
            // do dead key first
            var matchkey = lastkey;
            var deadkey = lastkey.getAttribute("usdeadkey");
            findkey(deadkey, "name");
            var deadmatch = lastkey;
            var icd = getlastimagepos(deadmatch);
            if (displayit) {
                var xx = parseInt(tqkbdef.getAttribute("XPos")) + parseInt(deadmatch.getAttribute("x"));
                var yy = parseInt(tqkbdef.getAttribute("YPos")) + parseInt(deadmatch.getAttribute("y"));
                reposition_image(NormalKeys[icd], xx, yy, false);
            } else {
                if (browser == 4) {
                    image_def_div[NormalKeys[icd].getAttribute("obj_id")].style.visibility = "hidden";
                    if (!IsKeypadLesson) {
                        image_def_div[LShiftKeys[0].getAttribute("obj_id")].style.visibility = "hidden";
                        image_def_div[RShiftKeys[0].getAttribute("obj_id")].style.visibility = "hidden";
                    }
                } else {
                    image_def_div[NormalKeys[icd].getAttribute("obj_id")].hidden = true;
                    if (!IsKeypadLesson) {
                        image_def_div[LShiftKeys[0].getAttribute("obj_id")].hidden = true;
                        image_def_div[RShiftKeys[0].getAttribute("obj_id")].hidden = true;
                    }
                }
            }
            // now actual key
            lastkey = matchkey;
            var ic = getlastimagepos(lastkey);
            if (displayit) {
                var xx = parseInt(tqkbdef.getAttribute("XPos")) + parseInt(lastkey.getAttribute("x"));
                var yy = parseInt(tqkbdef.getAttribute("YPos")) + parseInt(lastkey.getAttribute("y"));
                reposition_image(NormalKeys[ic], xx, yy, false);
            } else {
                if (browser == 4) {
                    image_def_div[NormalKeys[ic].getAttribute("obj_id")].style.visibility = "hidden";
                    if (!IsKeypadLesson) {
                        image_def_div[LShiftKeys[0].getAttribute("obj_id")].style.visibility = "hidden";
                        image_def_div[RShiftKeys[0].getAttribute("obj_id")].style.visibility = "hidden";
                    }
                } else {
                    image_def_div[NormalKeys[ic].getAttribute("obj_id")].hidden = true;
                    if (!IsKeypadLesson) {
                        image_def_div[LShiftKeys[0].getAttribute("obj_id")].hidden = true;
                        image_def_div[RShiftKeys[0].getAttribute("obj_id")].hidden = true;
                    }
                }
            }
        } else if (findkey(keytomatch, "usdsname")) {} else if (findkey(keytomatch, "sdname")) {
            // first the shifted deadkey
            var matchkey = lastkey;
            var deadkey = lastkey.getAttribute("sdeadkey");
            findkey(deadkey, "sname");
            var deadmatch = lastkey;
            var icd = getlastimagepos(deadmatch);
            if (displayit) {
                var xx = parseInt(tqkbdef.getAttribute("XPos")) + parseInt(deadmatch.getAttribute("x"));
                var yy = parseInt(tqkbdef.getAttribute("YPos")) + parseInt(deadmatch.getAttribute("y"));
                reposition_image(NormalKeys[icd], xx, yy, false);
                if (!IsKeypadLesson) {
                    if (deadmatch.getAttribute("hand_side") == "left") {
                        findkey("RShift", "name");
                        var offset = RShiftKeys[0].getAttribute("obj_offset");
                        reposition_image(RShiftKeys[0], image_x[offset], image_y[offset], false);
                    } else {
                        findkey("LShift", "name");
                        var offset = LShiftKeys[0].getAttribute("obj_offset");
                        reposition_image(LShiftKeys[0], image_x[offset], image_y[offset], false);
                    }
                }
            } else {
                if (browser == 4) {
                    image_def_div[NormalKeys[icd].getAttribute("obj_id")].style.visibility = "hidden";
                    if (!IsKeypadLesson) {
                        image_def_div[LShiftKeys[0].getAttribute("obj_id")].style.visibility = "hidden";
                        image_def_div[RShiftKeys[0].getAttribute("obj_id")].style.visibility = "hidden";
                    }
                } else {
                    image_def_div[NormalKeys[icd].getAttribute("obj_id")].hidden = true;
                    if (!IsKeypadLesson) {
                        image_def_div[LShiftKeys[0].getAttribute("obj_id")].hidden = true;
                        image_def_div[RShiftKeys[0].getAttribute("obj_id")].hidden = true;
                    }
                }
            }
            // now the real key
            lastkey = matchkey;
            var ic = getlastimagepos(lastkey);
            if (displayit) {
                var xx = parseInt(tqkbdef.getAttribute("XPos")) + parseInt(lastkey.getAttribute("x"));
                var yy = parseInt(tqkbdef.getAttribute("YPos")) + parseInt(lastkey.getAttribute("y"));
                reposition_image(NormalKeys[ic], xx, yy, false);
            } else {
                if (browser == 4) {
                    image_def_div[NormalKeys[ic].getAttribute("obj_id")].style.visibility = "hidden";
                    if (!IsKeypadLesson) {
                        image_def_div[LShiftKeys[0].getAttribute("obj_id")].style.visibility = "hidden";
                        image_def_div[RShiftKeys[0].getAttribute("obj_id")].style.visibility = "hidden";
                    }
                } else {
                    image_def_div[NormalKeys[ic].getAttribute("obj_id")].hidden = true;
                    if (!IsKeypadLesson) {
                        image_def_div[LShiftKeys[0].getAttribute("obj_id")].hidden = true;
                        image_def_div[RShiftKeys[0].getAttribute("obj_id")].hidden = true;
                    }
                }
            }
        } // add support for other modifier keys here
    } catch (e) {
        catchlog(e);
    }
}

function playkeysoundsequence(keytomatch) {
    try {
        var usemodifier = false;
        var origlastkey = null;
        if (keytomatch == "Spacebar") {
            keytomatch = " ";
        }
        if (findkey(keytomatch, "name")) {
            if (IsKeypadLesson) {
                origlastkey = lastkey;
            } else {
                origlastkey = lastnormkey;
            }
        } else if (findkey(keytomatch, "sname")) {
            origlastkey = lastnormkey;
            usemodifier = true;
            keysoundmax = 0;
            keysoundcount = 0;
            if (lastkey.getAttribute("hand_side") == "left") {
                findkey("RShift", "name");
                keysoundfiles["RShift"] = play_audio_file(keysoundfiles["RShift"],
                    lastkey.getAttribute("sound").substring(0, lastkey.getAttribute("sound").length - 4),
                    null, true, DoControlSounds);
            } else {
                findkey("LShift", "name");
                keysoundfiles["LShift"] = play_audio_file(keysoundfiles["LShift"],
                    lastkey.getAttribute("sound").substring(0, lastkey.getAttribute("sound").length - 4),
                    null, true, DoControlSounds);
            }
        } else if (findkey(keytomatch, "usdname")) {
            origlastkey = lastnormkey;
            keytomatch = lastnormkey.getAttribute("name");
            usemodifier = true;
            keysoundmax = 0;
            keysoundcount = 0;
            var deadkey = lastnormkey.getAttribute("usdeadkey");
            findkey(deadkey, "name");
            var deadkeymatch = lastnormkey;
            keysoundfiles[deadkey] = play_audio_file(keysoundfiles[deadkey],
                deadkeymatch.getAttribute("sound").substring(0, deadkeymatch.getAttribute("sound").length - 4),
                null, true, DoControlSounds);
        } else if (findkey(keytomatch, "usdsname")) {} else if (findkey(keytomatch, "sdname")) {
            origlastkey = lastnormkey;
            keytomatch = lastnormkey.getAttribute("name");
            usemodifier = true;
            keysoundmax = 0;
            keysoundcount = 0;
            findkey("LShift", "name");
            keysoundfiles["LShift"] = play_audio_file(keysoundfiles["LShift"],
                lastkey.getAttribute("sound").substring(0, lastkey.getAttribute("sound").length - 4),
                null, true, DoControlSounds);
            var deadkey = lastnormkey.getAttribute("sdeadkey");
            findkey(deadkey, "sname");
            var deadkeymatch = lastkey;
            keysoundfiles[deadkey] = play_audio_file(keysoundfiles[deadkey],
                deadkeymatch.getAttribute("sound").substring(0, deadkeymatch.getAttribute("sound").length - 4),
                null, false, DoControlSounds);
            keysoundsequence[keysoundmax++] = keysoundfiles[deadkey];
        } else if (findkey(keytomatch, "sdsname")) {} else if (findkey(keytomatch, "gagname")) {} else if (findkey(keytomatch, "gagsname")) {} else if (findkey(keytomatch, "gatname")) {} else if (findkey(keytomatch, "gatsname")) {} // add other modifiers here
        if (usemodifier) {
            keysoundfiles[keytomatch] = play_audio_file(keysoundfiles[keytomatch],
                origlastkey.getAttribute("sound").substring(0, origlastkey.getAttribute("sound").length - 4),
                null, false, DoControlSounds);
            keysoundsequence[keysoundmax++] = keysoundfiles[keytomatch];
        } else {
            keysoundfiles[keytomatch] = play_audio_file(keysoundfiles[keytomatch],
                origlastkey.getAttribute("sound").substring(0, origlastkey.getAttribute("sound").length - 4),
                null, true, DoControlSounds);
        }
    } catch (e) {
        catchlog(e);
    }
}

function highlight(keytomatch, prevkey, nextkey, minihands) {
    try {
        var found = false;
        var addleft2 = false;
        var addright = 0;
        if (prevkey != null) {
            unhighlight(prevkeytomatch, prevkey, true);
            pairtestkeycount++;
        }
        if (IsKeypadLesson && (keytomatch == " " || keytomatch == "\r")) {
            keytomatch = "Enter";
        }
        if (findkey(keytomatch, "name")) {
            found = true;
        } else if (findkey(keytomatch, "sname")) {
            found = true;
        } else if (findkey(keytomatch, "usdname")) {
            found = true;
            addright = 1;
        } else if (findkey(keytomatch, "usdsname")) {
            found = true;
            addright = 1;
        } else if (findkey(keytomatch, "sdname")) {
            found = true;
            addleft2 = true;
            addright = 1;
        } else if (findkey(keytomatch, "sdsname")) {
            found = true;
        } else if (findkey(keytomatch, "gagname")) {
            found = true;
        } else if (findkey(keytomatch, "gagsname")) {
            found = true;
        } else if (findkey(keytomatch, "gatname")) {
            found = true;
        } else if (findkey(keytomatch, "gatsname")) {
            found = true;
        } // add other qualifier keys here
        if (found) {
            nextkey = lastkey;
            lastkeytomatch = keytomatch;
        }
        if (found) {
            if (minihands) {
                playkeysoundsequence(keytomatch);
            }
            var id, id2;
            var ic = getlastimagepos(nextkey);
            var x = parseInt(tqkbdef.getAttribute("XPos"));
            var y = parseInt(tqkbdef.getAttribute("YPos"));
            if (minihands) {
                switch (nextkey.getAttribute("finger")) {
                    case "1":
                        if (nextkey.getAttribute("hand_side") == "left") {
                            reposition_image(LeftPairHands[1], 156, 238, false);
                            switch (lastkey.getAttribute("name")) {
                                case "RShift":
                                    if (addright != 0) {
                                        if (addright != 1) {
                                            reposition_image(RightPairHands[addright + 4], 316, 238, false);
                                        } else {
                                            reposition_image(RightPairHands[1], 316, 238, false);
                                        }
                                    } else {
                                        reposition_image(RightPairHands[1], 316, 238, false);
                                    }
                                    default:
                                        if (addright != 0) {
                                            reposition_image(RightPairHands[addright], 316, 238, false);
                                        } else {
                                            reposition_image(RightPairHands[0], 316, 238, false);
                                        }
                            }
                        } else {
                            reposition_image(RightPairHands[1], 316, 238, false);
                            switch (lastkey.getAttribute("name")) {
                                case "LShift":
                                    reposition_image(LeftPairHands[1], 156, 238, false);
                                default:
                                    reposition_image(LeftPairHands[0], 156, 238, false);
                            }
                        }
                        break;
                    case "2":
                        if (nextkey.getAttribute("hand_side") == "left") {
                            if (addleft2) {
                                reposition_image(LeftPairHands[6], 156, 238, false);
                            } else {
                                reposition_image(LeftPairHands[2], 156, 238, false);
                            }
                            switch (lastkey.getAttribute("name")) {
                                case "RShift":
                                    if (addright != 0) {
                                        if (addright != 1) {
                                            reposition_image(RightPairHands[addright + 4], 316, 238, false);
                                        } else {
                                            reposition_image(RightPairHands[1], 316, 238, false);
                                        }
                                    } else {
                                        reposition_image(RightPairHands[1], 316, 238, false);
                                    }
                                    default:
                                        if (addright != 0) {
                                            reposition_image(RightPairHands[addright], 316, 238, false);
                                        } else {
                                            reposition_image(RightPairHands[0], 316, 238, false);
                                        }
                            }
                        } else {
                            if (addright != 0) {
                                reposition_image(RightPairHands[6], 316, 238, false);
                            } else {
                                reposition_image(RightPairHands[2], 316, 238, false);
                            }
                            switch (lastkey.getAttribute("name")) {
                                case "LShift":
                                    reposition_image(LeftPairHands[1], 156, 238, false);
                                default:
                                    reposition_image(LeftPairHands[0], 156, 238, false);
                            }
                        }
                        break;
                    case "3":
                        if (nextkey.getAttribute("hand_side") == "left") {
                            if (addleft2) {
                                reposition_image(LeftPairHands[7], 156, 238, false);
                            } else {
                                reposition_image(LeftPairHands[3], 156, 238, false);
                            }
                            switch (lastkey.getAttribute("name")) {
                                case "RShift":
                                    if (addright != 0) {
                                        if (addright != 1) {
                                            reposition_image(RightPairHands[addright + 4], 316, 238, false);
                                        } else {
                                            reposition_image(RightPairHands[1], 316, 238, false);
                                        }
                                    } else {
                                        reposition_image(RightPairHands[1], 316, 238, false);
                                    }
                                    default:
                                        if (addright != 0) {
                                            reposition_image(RightPairHands[addright], 316, 238, false);
                                        } else {
                                            reposition_image(RightPairHands[0], 316, 238, false);
                                        }
                            }
                        } else {
                            if (addright != 0) {
                                reposition_image(RightPairHands[7], 316, 238, false);
                            } else {
                                reposition_image(RightPairHands[3], 316, 238, false);
                            }
                            switch (lastkey.getAttribute("name")) {
                                case "LShift":
                                    reposition_image(LeftPairHands[1], 156, 238, false);
                                default:
                                    reposition_image(LeftPairHands[0], 156, 238, false);
                            }
                        }
                        break;
                    case "4":
                        if (nextkey.getAttribute("hand_side") == "left") {
                            if (addleft2) {
                                reposition_image(LeftPairHands[8], 156, 238, false);
                            } else {
                                reposition_image(LeftPairHands[4], 156, 238, false);
                            }
                            switch (lastkey.getAttribute("name")) {
                                case "RShift":
                                    if (addright != 0) {
                                        if (addright != 1) {
                                            reposition_image(RightPairHands[addright + 4], 316, 238, false);
                                        } else {
                                            reposition_image(RightPairHands[1], 316, 238, false);
                                        }
                                    } else {
                                        reposition_image(RightPairHands[1], 316, 238, false);
                                    }
                                    default:
                                        if (addright != 0) {
                                            reposition_image(RightPairHands[addright], 316, 238, false);
                                        } else {
                                            reposition_image(RightPairHands[0], 316, 238, false);
                                        }
                            }
                        } else {
                            if (addright != 0) {
                                reposition_image(RightPairHands[8], 316, 238, false);
                            } else {
                                reposition_image(RightPairHands[4], 316, 238, false);
                            }
                            switch (lastkey.getAttribute("name")) {
                                case "LShift":
                                    reposition_image(LeftPairHands[1], 156, 238, false);
                                default:
                                    reposition_image(LeftPairHands[0], 156, 238, false);
                            }
                        }
                        break;
                    case "5":
                        if (nextkey.getAttribute("hand_side") == "left") {
                            reposition_image(LeftPairHands[5], 156, 238, false);
                            switch (lastkey.getAttribute("name")) {
                                case "RShift":
                                    if (addright != 0) {
                                        if (addright != 1) {
                                            reposition_image(RightPairHands[addright + 4], 316, 238, false);
                                        } else {
                                            reposition_image(RightPairHands[1], 316, 238, false);
                                        }
                                    } else {
                                        reposition_image(RightPairHands[1], 316, 238, false);
                                    }
                                    default:
                                        if (addright != 0) {
                                            reposition_image(RightPairHands[addright], 316, 238, false);
                                        } else {
                                            reposition_image(RightPairHands[0], 316, 238, false);
                                        }
                            }
                        } else {
                            reposition_image(RightPairHands[5], 316, 238, false);
                            switch (lastkey.getAttribute("name")) {
                                case "LShift":
                                    reposition_image(LeftPairHands[1], 156, 238, false);
                                default:
                                    reposition_image(LeftPairHands[0], 156, 238, false);
                            }
                        }
                        break;
                }
            }
            // set up colouring for required key
            switch (nextkey.getAttribute("image")) {
                case "kpdlng":
                    if (keytomatch == "Enter") {
                        id = EnterKeys[0].getAttribute("obj_id");
                    } else {
                        if (nextkey.getAttribute("imagepos") == "blue") {
                            id = KpdLngKeys[0].getAttribute("obj_id");
                        } else {
                            id = KpdLngKeys[1].getAttribute("obj_id");
                        }
                    }
                    if (browser == 4) {
                        image_def_div[id].style.visibility = "visible";
                    } else {
                        image_def_div[id].hidden = false;
                    }
                    break;
                case "kpdwd":
                    if (keytomatch == "Enter") {
                        id = EnterKeys[1].getAttribute("obj_id");
                    } else {
                        if (nextkey.getAttribute("imagepos") == "green") {
                            id = KpadWdKeys[0].getAttribute("obj_id");
                        } else {
                            id = KpadWdKeys[1].getAttribute("obj_id");
                        }
                    }
                    if (browser == 4) {
                        image_def_div[id].style.visibility = "visible";
                    } else {
                        image_def_div[id].hidden = false;
                    }
                    break;
                case "keys":
                    showhidemainkey(keytomatch, true);
                    break;
                case "keycl":
                    id = CapsLockKeys[0].getAttribute("obj_id");
                    if (browser == 4) {
                        image_def_div[id].style.visibility = "visible";
                    } else {
                        image_def_div[id].hidden = false;
                    }
                    break;
                case "keyen":
                    if (ic == 0) {
                        id = EnterKeys[0].getAttribute("obj_id");
                    } else {
                        id = EnterKeys[1].getAttribute("obj_id");
                    }
                    if (browser == 4) {
                        image_def_div[id].style.visibility = "visible";
                    } else {
                        image_def_div[id].hidden = false;
                    }
                    break;
                case "keysh":
                    if (nextkey.getAttribute("name") == "LShift") {
                        if (ic == 0) {
                            id = LShiftKeys[0].getAttribute("obj_id");
                        } else {
                            id = LShiftKeys[1].getAttribute("obj_id");
                        }
                        if (browser == 4) {
                            image_def_div[id].style.visibility = "visible";
                        } else {
                            image_def_div[id].hidden = false;
                        }
                    } else if (nextkey.getAttribute("name") == "RShift") {
                        if (ic == 0) {
                            id = RShiftKeys[0].getAttribute("obj_id");
                        } else {
                            id = RShiftKeys[1].getAttribute("obj_id");
                        }
                        if (browser == 4) {
                            image_def_div[id].style.visibility = "visible";
                        } else {
                            image_def_div[id].hidden = false;
                        }
                    } else if (nextkey.getAttribute("image") == "right") {
                        if (ic == 0) {
                            id = RShiftKeys[0].getAttribute("obj_id");
                        } else {
                            id = RShiftKeys[1].getAttribute("obj_id");
                        }
                        if (browser == 4) {
                            image_def_div[id].style.visibility = "visible";
                        } else {
                            image_def_div[id].hidden = false;
                        }
                    } else {
                        if (ic == 0) {
                            id = LShiftKeys[0].getAttribute("obj_id");
                        } else {
                            id = LShiftKeys[1].getAttribute("obj_id");
                        }
                        if (browser == 4) {
                            image_def_div[id].style.visibility = "visible";
                        } else {
                            image_def_div[id].hidden = false;
                        }
                    }
                    break;
                case "keyal":
                    if (ic == 0) {
                        id = RAltKeys[0].getAttribute("obj_id");
                    } else {
                        id = RAltKeys[1].getAttribute("obj_id");
                    }
                    if (browser == 4) {
                        image_def_div[id].style.visibility = "visible";
                    } else {
                        image_def_div[id].hidden = false;
                    }
                    break;
                case "keysp":
                    id = SpaceBarKeys[0].getAttribute("obj_id");
                    if (browser == 4) {
                        image_def_div[id].style.visibility = "visible";
                    } else {
                        image_def_div[id].hidden = false;
                    }
                    break;
                case "kpdwd":
                case "keyct":
                    if (IsKeypadLesson) {
                        if (nextkey.getAttribute("imagepos") == "red") {
                            id = RAltKeys[0].getAttribute("obj_id");
                            if (browser == 4) {
                                image_def_div[id].style.visibility = "visible";
                            } else {
                                image_def_div[id].hidden = false;
                            }
                        } else {
                            id = RCtltKeys[0].getAttribute("obj_id");
                            if (browser == 4) {
                                image_def_div[id].style.visibility = "visible";
                            } else {
                                image_def_div[id].hidden = false;
                            }
                        }
                    } else {
                        if (ic == 0) {
                            id = RAltKeys[0].getAttribute("obj_id");
                        } else {
                            id = RAltKeys[1].getAttribute("obj_id");
                        }
                        if (browser == 4) {
                            image_def_div[id].style.visibility = "visible";
                        } else {
                            image_def_div[id].hidden = false;
                        }
                    }
                    break;
            }
        }
    } catch (e) {
        catchlog(e);
    }
}


function unhighlight(keytomatch, keydata, minihands) {
    try {
        var found = false;
        var i, ic, id;
        ic = getlastimagepos(keydata);
        if (IsKeypadLesson && (keytomatch == " " || keytomatch == "\r")) {
            keytomatch = "Enter";
        }
        if (findkey(keytomatch, "name")) {
            found = true;
        } else if (findkey(keytomatch, "sname")) {
            found = true;
        } else if (findkey(keytomatch, "usdname")) {
            found = true;
        } else if (findkey(keytomatch, "usdsname")) {
            found = true;
        } else if (findkey(keytomatch, "sdname")) {
            found = true;
        } else if (findkey(keytomatch, "sdsname")) {
            found = true;
        } else if (findkey(keytomatch, "gagname")) {
            found = true;
        } else if (findkey(keytomatch, "gagsname")) {
            found = true;
        } else if (findkey(keytomatch, "gatname")) {
            found = true;
        } else if (findkey(keytomatch, "gatsname")) {
            found = true;
        } // add other qualifier keys here
        if (found) {
            nextkey = lastkey;
            lastkeytomatch = keytomatch;
        }
        switch (nextkey.getAttribute("image")) {
            case "kpdlng":
                if (keytomatch == "Enter") {
                    id = EnterKeys[0].getAttribute("obj_id");
                } else {
                    if (nextkey.getAttribute("imagepos") == "blue") {
                        id = KpdLngKeys[0].getAttribute("obj_id");
                    } else {
                        id = KpdLngKeys[1].getAttribute("obj_id");
                    }
                }
                if (browser == 4) {
                    image_def_div[id].style.visibility = "hidden";
                } else {
                    image_def_div[id].hidden = true;
                }
                break;
            case "kpdwd":
                if (keytomatch == "Enter") {
                    id = EnterKeys[1].getAttribute("obj_id");
                } else {
                    if (nextkey.getAttribute("imagepos") == "green") {
                        id = KpadWdKeys[0].getAttribute("obj_id");
                    } else {
                        id = KpadWdKeys[1].getAttribute("obj_id");
                    }
                }
                if (browser == 4) {
                    image_def_div[id].style.visibility = "hidden";
                } else {
                    image_def_div[id].hidden = true;
                }
                break;
            case "keys":
                showhidemainkey(keytomatch, false);
                break;
            case "keycl":
                id = CapsLockKeys[0].getAttribute("obj_id");
                if (browser == 4) {
                    image_def_div[id].style.visibility = "hidden";
                } else {
                    image_def_div[id].hidden = true;
                }
                break;
            case "keyen":
                if (ic == 0) {
                    id = EnterKeys[0].getAttribute("obj_id");
                    if (browser == 4) {
                        image_def_div[id].style.visibility = "hidden";
                    } else {
                        image_def_div[id].hidden = true;
                    }
                } else {
                    id = EnterKeys[1].getAttribute("obj_id");
                    if (browser == 4) {
                        image_def_div[id].style.visibility = "hidden";
                    } else {
                        image_def_div[id].hidden = true;
                    }
                }
                break;
            case "keysh":
                if (keydata.getAttribute("name") == "LShift") {
                    if (ic == 0) {
                        id = LShiftKeys[0].getAttribute("obj_id");
                    } else {
                        id = LShiftKeys[1].getAttribute("obj_id");
                    }
                    if (browser == 4) {
                        image_def_div[id].style.visibility = "hidden";
                    } else {
                        image_def_div[id].hidden = true;
                    }
                }
                if (keydata.getAttribute("name") == "RShift") {
                    if (ic == 0) {
                        id = RShiftKeys[0].getAttribute("obj_id");
                    } else {
                        id = RShiftKeys[1].getAttribute("obj_id");
                    }
                    if (browser == 4) {
                        image_def_div[id].style.visibility = "hidden";
                    } else {
                        image_def_div[id].hidden = true;
                    }
                } else if (keydata.getAttribute("image") == "right") {
                    if (ic == 0) {
                        id = RShiftKeys[0].getAttribute("obj_id");
                    } else {
                        id = RShiftKeys[1].getAttribute("obj_id");
                    }
                    if (browser == 4) {
                        image_def_div[id].style.visibility = "hidden";
                    } else {
                        image_def_div[id].hidden = true;
                    }
                } else {
                    if (ic == 0) {
                        id = LShiftKeys[0].getAttribute("obj_id");
                    } else {
                        id = LShiftKeys[1].getAttribute("obj_id");
                    }
                    if (browser == 4) {
                        image_def_div[id].style.visibility = "hidden";
                    } else {
                        image_def_div[id].hidden = true;
                    }
                }
                break;
            case "keyal":
                if (ic == 0) {
                    id = RAltKeys[0].getAttribute("obj_id");
                    if (browser == 4) {
                        image_def_div[id].style.visibility = "hidden";
                    } else {
                        image_def_div[id].hidden = true;
                    }
                } else {
                    id = RAltKeys[1].getAttribute("obj_id");
                    if (browser == 4) {
                        image_def_div[id].style.visibility = "hidden";
                    } else {
                        image_def_div[id].hidden = true;
                    }
                }
                break;
            case "keysp":
                if (ic == 4) {
                    id = SpaceBarKeys[1].getAttribute("obj_id");
                    if (browser == 4) {
                        image_def_div[id].style.visibility = "hidden";
                    } else {
                        image_def_div[id].hidden = true;
                    }
                } else {
                    id = SpaceBarKeys[0].getAttribute("obj_id");
                    if (browser == 4) {
                        image_def_div[id].style.visibility = "hidden";
                    } else {
                        image_def_div[id].hidden = true;
                    }
                }
                break;
            case "keyct":
                if (IsKeyPadLesson) {
                    for (i = 0; i < 2; i++) {
                        id = RAltKeys[i].getAttribute("obj_id");
                        if (browser == 4) {
                            image_def_div[id].style.visibility = "hidden";
                        } else {
                            image_def_div[id].hidden = true;
                        }
                    }
                    for (i = 0; i < 2; i++) {
                        id = RCtlKeys[i].getAttribute("obj_id");
                        if (browser == 4) {
                            image_def_div[id].style.visibility = "hidden";
                        } else {
                            image_def_div[id].hidden = true;
                        }
                    }
                } else {
                    if (ic == 0) {
                        id = RCtlKeys[0].getAttribute("obj_id");
                        if (browser == 4) {
                            image_def_div[id].style.visibility = "hidden";
                        } else {
                            image_def_div[id].hidden = true;
                        }
                    } else {
                        id = RCtlKeys[1].getAttribute("obj_id");
                        if (browser == 4) {
                            image_def_div[id].style.visibility = "hidden";
                        } else {
                            image_def_div[id].hidden = true;
                        }
                    }
                }
                break;
        }
        if (minihands) {
            for (i = 0; i < LeftPairHands.length; i++) {
                id = LeftPairHands[i].getAttribute("obj_id");
                if (browser == 4) {
                    image_def_div[id].style.visibility = "hidden";
                } else {
                    image_def_div[id].hidden = true;
                }
            }
            for (i = 0; i < RightPairHands.length; i++) {
                id = RightPairHands[i].getAttribute("obj_id");
                if (browser == 4) {
                    image_def_div[id].style.visibility = "hidden";
                } else {
                    image_def_div[id].hidden = true;
                }
            }
        }
    } catch (e) {
        catchlog(e);
    }
}

function preparehands(keylist) {
    //Log.info("preparehands(\""+keylist+"\")");
    var matchkey;
    var useleft = false;
    var keytomatch;
    var useshift = false;
    var x = parseInt(tqkbdef.getAttribute("XPos")) + 8;
    var y = parseInt(tqkbdef.getAttribute("YPos")) + parseInt(tqkbdef.getAttribute("Height")) - 4;
    var xr = parseInt(tqkbdef.getAttribute("XPos")) + parseInt(tqkbdef.getAttribute("Width")) + 22;
    var offset;
    var newx;
    var newy;

    playcount = 0;
    ghostcurrent = 1; // next hand will be after home keys
    // position left home hand
    if (!IsKeypadLesson) {
        reposition_image(ghostkeys[0], x + 10, y - 1, false);
    }
    ghostsequence[0] = null;
    ghostreplace[0] = -11;
    // position right home hand
    if (IsKeypadLesson) {
        reposition_image(ghostkeys[1], xr - 110, y, false);
        //reposition_image(ghostkeys[1], xr-100, y - 1, false);
        // xr-100 は大きくなると右、y-1 は 大きくなると下
    } else {
        reposition_image(ghostkeys[1], xr, y - 1, false);
    }
    ghostsequence[1] = null;
    ghostreplace[1] = -11;

    ghostcount = 2;
    for (var i = 0; i < keylist.length; i++) {
        keytomatch = keylist.charAt(i);
        useshift = false;
        if (keytomatch == " ") {
            if (IsKeypadLesson) {
                keytomatch = "Enter";
            } else {
                keytomatch = "Spacebar";
            }
        } else if (keytomatch == "\r") {
            keytomatch = "Enter";
        }
        if (keytomatch == "Spacebar") {
            if (lastkey.getAttribute("hand_side") == "left") {
                findkey(keytomatch, "name");
                matchkey = lastkey;
                useleft = false;
                if (ghostcount == 2) {
                    ghostreplace[ghostcount] = 1;
                } else {
                    ghostreplace[ghostcount] = ghostcount - 1;
                }
                newx = xr + parseInt(lastkey.getAttribute("handdx"));
            } else {
                findkey(keytomatch, "name");
                matchkey = lastkey;
                useleft = true;
                if (ghostcount == 2) {
                    ghostreplace[ghostcount] = 0;
                } else {
                    ghostreplace[ghostcount] = ghostcount - 1;
                }
                newx = x + parseInt(lastkey.getAttribute("handdx"));
            }
            newy = y + parseInt(lastkey.getAttribute("handdy"));
            ghostkeys[ghostcount] = makeimage("ghost" + ghostcount.toString(),
                STORAGE_PATH + KbdGhostBase + lastkey.getAttribute("hand"),
                1.0, newx, newy, "13000", 0.6);
            ghostsequence[ghostcount] = lastkey;
            ghostcount++;
        } else if (findkey(keytomatch, "name")) {
            matchkey = lastkey;
            if (lastkey.getAttribute("hand_side") == "left") {
                useleft = true;
                if (ghostcount == 2) {
                    ghostreplace[ghostcount] = 0;
                } else {
                    ghostreplace[ghostcount] = 0;
                }
                newx = x + parseInt(lastkey.getAttribute("handdx"));
            } else {
                useleft = false;
                if (ghostcount == 2) {
                    ghostreplace[ghostcount] = 1;
                } else {
                    ghostreplace[ghostcount] = ghostcount - 1;
                }
                newx = xr + parseInt(lastkey.getAttribute("handdx"));
            }
            newy = y + parseInt(lastkey.getAttribute("handdy"));
            ghostkeys[ghostcount] = makeimage("ghost" + ghostcount.toString(),
                STORAGE_PATH + KbdGhostBase + lastkey.getAttribute("hand"),
                1.0, newx, newy, "13000", 0.6);
            ghostsequence[ghostcount] = lastkey;
            ghostcount++;
        } else if (findkey(keytomatch, "sname")) {
            matchkey = lastkey;
            useshift = true;
            if (lastkey.getAttribute("hand_side") == "left") {
                useleft = true;
                findkey("RShift", "name");
                newx = xr + parseInt(lastkey.getAttribute("handdx"));
                newy = y + parseInt(lastkey.getAttribute("handdy"));
                ghostkeys[ghostcount] = makeimage("ghost" + ghostcount.toString(),
                    STORAGE_PATH + KbdGhostBase + lastkey.getAttribute("hand"),
                    1.0, newx, newy, "13000", 0.6);
                ghostsequence[ghostcount] = lastkey;
                ghostreplace[ghostcount] = -5;
                ghostcount++;
                newx = x + parseInt(matchkey.getAttribute("handdx"));
            } else {
                useleft = false;
                findkey("LShift", "name");
                newx = x + parseInt(lastkey.getAttribute("handdx"));
                newy = y + parseInt(lastkey.getAttribute("handdy"));
                ghostkeys[ghostcount] = makeimage("ghost" + ghostcount.toString(),
                    STORAGE_PATH + KbdGhostBase + lastkey.getAttribute("hand"),
                    1.0, newx, newy, "13000", 0.6);
                ghostsequence[ghostcount] = lastkey;
                ghostreplace[ghostcount] = -3;
                ghostcount++;
                newx = xr + parseInt(matchkey.getAttribute("handdx"));
            }
            newy = y + parseInt(matchkey.getAttribute("handdy"));
            ghostkeys[ghostcount] = makeimage("ghost" + ghostcount.toString(),
                STORAGE_PATH + KbdGhostBase + matchkey.getAttribute("hand"),
                1.0, newx, newy, "13000", 0.6);
            ghostsequence[ghostcount] = matchkey;
            if (useshift) {
                if (useleft) {
                    ghostreplace[ghostcount] = -1;
                } else {
                    ghostreplace[ghostcount] = -2;
                }
            } else {
                ghostreplace[ghostcount] = -4;
            }
            ghostcount++;

        } else if (findkey(keytomatch, "usdname")) {
            // output the unshifted dead key first
            matchkey = lastkey;
            var deadkey = lastkey.getAttribute("usdeadkey");
            findkey(deadkey, "name");
            var deadlast = lastkey;
            if (deadlast.getAttribute("hand_side") == "left") {
                useleft = true;
                if (ghostcount == 2) {
                    ghostreplace[ghostcount] = 0;
                } else {
                    ghostreplace[ghostcount] = 0;
                }
                newx = x + parseInt(deadlast.getAttribute("handdx"));
            } else {
                useleft = false;
                if (ghostcount == 2) {
                    ghostreplace[ghostcount] = 1;
                } else {
                    ghostreplace[ghostcount] = ghostcount - 1;
                }
                newx = xr + parseInt(deadlast.getAttribute("handdx"));
            }
            newy = y + parseInt(deadlast.getAttribute("handdy"));
            ghostkeys[ghostcount] = makeimage("ghost" + ghostcount.toString(),
                STORAGE_PATH + KbdGhostBase + deadlast.getAttribute("hand"),
                1.0, newx, newy, "13000", 0.6);
            ghostsequence[ghostcount] = lastkey;
            ghostcount++;
            // now output the visible key
            lastkey = matchkey;
            if (lastkey.getAttribute("hand_side") == "left") {
                useleft = true;
                if (ghostcount == 2) {
                    ghostreplace[ghostcount] = 0;
                } else {
                    ghostreplace[ghostcount] = 0;
                }
                newx = x + parseInt(lastkey.getAttribute("handdx"));
            } else {
                useleft = false;
                if (ghostcount == 2) {
                    ghostreplace[ghostcount] = 1;
                } else {
                    ghostreplace[ghostcount] = ghostcount - 1;
                }
                newx = xr + parseInt(lastkey.getAttribute("handdx"));
            }
            newy = y + parseInt(lastkey.getAttribute("handdy"));
            ghostkeys[ghostcount] = makeimage("ghost" + ghostcount.toString(),
                STORAGE_PATH + KbdGhostBase + lastkey.getAttribute("hand"),
                1.0, newx, newy, "13000", 0.6);
            ghostsequence[ghostcount] = deadlast;
            ghostcount++;
        } else if (findkey(keytomatch, "usdsname")) {
            // output the unshifted dead key first
            matchkey = lastkey;
            var deadkey = lastkey.getAttribute("usdeadkey");
            findkey(deadkey, "name");
            var deadlast = lastkey;
            if (deadlast.getAttribute("hand_side") == "left") {
                useleft = true;
                if (ghostcount == 2) {
                    ghostreplace[ghostcount] = 0;
                } else {
                    ghostreplace[ghostcount] = 0;
                }
                newx = x + parseInt(deadlast.getAttribute("handdx"));
            } else {
                useleft = false;
                if (ghostcount == 2) {
                    ghostreplace[ghostcount] = 1;
                } else {
                    ghostreplace[ghostcount] = ghostcount - 1;
                }
                newx = xr + parseInt(deadlast.getAttribute("handdx"));
            }
            newy = y + parseInt(deadlast.getAttribute("handdy"));
            ghostkeys[ghostcount] = makeimage("ghost" + ghostcount.toString(),
                STORAGE_PATH + KbdGhostBase + deadlast.getAttribute("hand"),
                1.0, newx, newy, "13000", 0.6);
            ghostsequence[ghostcount] = deadlast;
            ghostcount++;
            // now output the visible key with a shift key
            useshift = true;
            if (matchkey.getAttribute("hand_side") == "left") {
                useleft = true;
                findkey("RShift", "name");
                newx = xr + parseInt(lastkey.getAttribute("handdx"));
                newy = y + parseInt(lastkey.getAttribute("handdy"));
                ghostkeys[ghostcount] = makeimage("ghost" + ghostcount.toString(),
                    STORAGE_PATH + KbdGhostBase + lastkey.getAttribute("hand"),
                    1.0, newx, newy, "13000", 0.6);
                ghostsequence[ghostcount] = lastkey;
                ghostreplace[ghostcount] = -5;
                ghostcount++;
                lastkeytomatch = keytomatch;
                newx = x + parseInt(matchkey.getAttribute("handdx"));
            } else {
                useleft = false;
                findkey("LShift", "name");
                newx = x + parseInt(lastkey.getAttribute("handdx"));
                newy = y + parseInt(lastkey.getAttribute("handdy"));
                ghostkeys[ghostcount] = makeimage("ghost" + ghostcount.toString(),
                    STORAGE_PATH + KbdGhostBase + lastkey.getAttribute("hand"),
                    1.0, newx, newy, "13000", 0.6);
                ghostsequence[ghostcount] = lastkey;
                ghostreplace[ghostcount] = -3;
                ghostcount++;
                lastkeytomatch = keytomatch;
                newx = xr + parseInt(matchkey.getAttribute("handdx"));
            }
            newy = y + parseInt(matchkey.getAttribute("handdy"));
            ghostkeys[ghostcount] = makeimage("ghost" + ghostcount.toString(),
                STORAGE_PATH + KbdGhostBase + matchkey.getAttribute("hand"),
                1.0, newx, newy, "13000", 0.6);
            ghostsequence[ghostcount] = lastkey;
            if (useshift) {
                if (useleft) {
                    ghostreplace[ghostcount] = -1;
                } else {
                    ghostreplace[ghostcount] = -2;
                }
            } else {
                ghostreplace[ghostcount] = -4;
            }
            ghostcount++;
        } else if (findkey(keytomatch, "sdname")) {
            // output the shidted deadkey first
            matchkey = lastkey;
            var deadkey = lastkey.getAttribute("sdeadkey");
            findkey(deadkey, "sname");
            var deadlast = lastkey;
            useshift = true;
            if (deadlast.getAttribute("hand_side") == "left") {

                useleft = true;
                findkey("RShift", "name");
                newx = xr + parseInt(lastkey.getAttribute("handdx"));
                newy = y + parseInt(lastkey.getAttribute("handdy"));
                ghostkeys[ghostcount] = makeimage("ghost" + ghostcount.toString(),
                    STORAGE_PATH + KbdGhostBase + lastkey.getAttribute("hand"),
                    1.0, newx, newy, "13000", 0.6);
                ghostsequence[ghostcount] = lastkey;
                ghostreplace[ghostcount] = -5;
                ghostcount++;
                lastkeytomatch = keytomatch;
                newx = x + parseInt(deadlast.getAttribute("handdx"));
            } else {
                useleft = false;
                findkey("LShift", "name");
                newx = x + parseInt(lastkey.getAttribute("handdx"));
                newy = y + parseInt(lastkey.getAttribute("handdy"));
                ghostkeys[ghostcount] = makeimage("ghost" + ghostcount.toString(),
                    STORAGE_PATH + KbdGhostBase + lastkey.getAttribute("hand"),
                    1.0, newx, newy, "13000", 0.6);
                ghostsequence[ghostcount] = lastkey;
                ghostreplace[ghostcount] = -3;
                ghostcount++;
                lastkeytomatch = keytomatch;
                newx = xr + parseInt(deadlast.getAttribute("handdx"));
            }
            newy = y + parseInt(deadlast.getAttribute("handdy"));
            ghostkeys[ghostcount] = makeimage("ghost" + ghostcount.toString(),
                STORAGE_PATH + KbdGhostBase + deadlast.getAttribute("hand"),
                1.0, newx, newy, "13000", 0.6);
            ghostsequence[ghostcount] = deadlast;
            if (useshift) {
                if (useleft) {
                    ghostreplace[ghostcount] = -1;
                } else {
                    ghostreplace[ghostcount] = -2;
                }
            } else {
                ghostreplace[ghostcount] = -4;
            }
            ghostcount++;

            // now output the key
            useshift = false;
            if (matchkey.getAttribute("hand_side") == "left") {
                useleft = true;
                if (ghostcount == 2) {
                    ghostreplace[ghostcount] = 0;
                } else {
                    ghostreplace[ghostcount] = 0;
                }
                newx = x + parseInt(matchkey.getAttribute("handdx"));
            } else {
                useleft = false;
                if (ghostcount == 2) {
                    ghostreplace[ghostcount] = 1;
                } else {
                    ghostreplace[ghostcount] = ghostcount - 1;
                }
                newx = xr + parseInt(matchkey.getAttribute("handdx"));
            }
            newy = y + parseInt(matchkey.getAttribute("handdy"));
            ghostkeys[ghostcount] = makeimage("ghost" + ghostcount.toString(),
                STORAGE_PATH + KbdGhostBase + matchkey.getAttribute("hand"),
                1.0, newx, newy, "13000", 0.6);
            ghostsequence[ghostcount] = lastkey;
            ghostcount++;

        } else if (findkey(keytomatch, "sdsname")) {} else if (findkey(keytomatch, "gatname")) {} else if (findkey(keytomatch, "gatsname")) {} else if (findkey(keytomatch, "gagname")) {} else if (findkey(keytomatch, "gagsname")) {} // need code added here for dead key, alt and ctrl
    }
}

function runpairtest(text) {
    //Log.info("runpairtest(\""+text+"\")");
    var useleft = false;
    pair_test = true;
    hide_allminikeys();

    show_largekbd();

    if (!ghostonly) {
        godsv11 = play_audio_file(godsv11, "godvs11", null, true, DoControlSounds);
    }
    stimulus_text = GenerateKeyboardPairTest(text);
    ghostlist = text;
    preparehands(ghostlist);
    playinghands = true;
    playtimerid = setInterval(playhands_handler, 1000);
}

function mk_check(s) {
    try {
        switch (s) {
            case ",":
                return "cma";
            case ";":
                return "semi";
            case ".":
                return "dot";
            case "&":
                return "amp";
            case "$":
                return "dlr";
            case "+":
                return "pls";
            case "-":
                return "min";
            case "\"":
                return "quot";
            case "'":
                return "apos";
            case "(":
                return "opar";
            case ")":
                return "cpar";
            case "%":
                return "per";
            case "@":
                return "ats";
            case "#":
                return "hsh";
            case "*":
                return "ast";
            case "!":
                return "exc";
            case "?":
                return "que";
            case "/":
                return "div";
            case ">":
                return "gth";
            case "<":
                return "lth";
            case ":":
                return "col";
            case "^":
                return "car";
            case "=":
                return "equ";
            default:
                // check for shifted chars
                if (findkey(s, "name")) {
                    return s;
                } else if (findkey(s, "sname")) {
                    return s.toLowerCase();
                } // handle dead jeys etc here
                return s;
        }
    } catch (e) {
        catchlog(e);
    }
}


function mk_check_alt(s) {
    //Log.info("mk_check_alt is called");
    try {
        switch (s) {
            case ",":
                return "cma";
            case ";":
                return "semi";
            case ".":
                return "dot";
            case "&":
                return "amp";
            case "$":
                return "dlr";
            case "+":
                return "pls";
            case "-":
                return "min";
            case "\"":
                return "quot";
            case "'":
                return "apos";
            case "(":
                return "opar";
            case ")":
                return "cpar";
            case "%":
                return "per";
            case "@":
                return "ats";
            case "#":
                return "hsh";
            case "*":
                return "ast";
            case "!":
                return "exc";
            case "?":
                return "que";
            case "/":
                return "div";
            case ">":
                return "gth";
            case "<":
                return "lth";
            case ":":
                return "col";
            case "^":
                return "car";
            case "=":
                return "equ";
            default:
                // check for shifted chars
                if (findkey(s, "name")) {
                    return s;
                } else if (findkey(s, "sname")) {
                    //Log.info(s);
                    //return s.toUpperCase();
                    return s;
                } // handle dead jeys etc here
                return s;
        }
    } catch (e) {
        catchlog(e);
    }
}



function setoneminikey(key) {
    //Log.info("setoneminikey is called");
    //Log.info(key);
    try {
        if (image_def_div["mk" + mk_check(key)] != null) {
            return;
        }
        var s = key.getAttribute("name");
        var x = parseInt(tqkbdef.getAttribute("MiniXPos")) + MINIXPOS_OFFSET; //ミニキーボードの位置
        var y = parseInt(tqkbdef.getAttribute("MiniYPos")) + MINIYPOS_OFFSET; //+40;
        var colour = "dr";
        if (image_def_div["mk" + mk_check(s)] == null) {
            switch (key.getAttribute("imagepos")) {
                case "blue":
                    colour = "bl";
                    break;
                case "green":
                    colour = "gr";
                    break;
                case "red":
                    colour = "rd";
                    break;
                case "orange":
                    colour = "or";
                    break;
                case "dark":
                    colour = "dr";
                    break;
            }
            var mkid = "mk" + mk_check(s);
            makeimage(mkid, STORAGE_PATH + "/keyboards/keys/" + key.getAttribute("image") + colour + ".png", minikeytopscale, x + minikeytopscale * (parseInt(key.getAttribute("x")) + 8), y + minikeytopscale * (parseInt(key.getAttribute("y")) + 8), "12500", 0.6);
            draw_region.appendChild(image_def_div[mkid]);
        }
    } catch (e) {
        catchlog(e);
    }
}


function preparekeylist(text) {
    //Log.info("preparekeylist is called");
    try {
        var i = 0;
        if (minikeys == "") {
            findkey("Enter", "name");
            setoneminikey(lastkey);
            findkey("Spacebar", "name");
            setoneminikey(lastkey);
        }

        hide_allminikeys();

        if (image_object["mkRShift"] == null) {
            findkey("RShift", "name");
            setoneminikey(lastkey);
            rshiftdiv = image_def_div["mkRShift"];
        }
        if (image_object["mkLShift"] == null) {
            findkey("LShift", "name");
            setoneminikey(lastkey);
            lshiftdiv = image_def_div["mkLShift"];
        }
        if (image_object["mkRAlt"] == null && image_object["mkGRAlt"] == null) {
            if (!findkey("RAlt", "name")) {
                findkey("GRAlt", "name");
            }
            setoneminikey(lastkey);
            graltdiv = image_def_div["mkGRAlt"];
        }
        if (image_object["mkLAlt"] == null && image_object["mkAlt"] == null) {
            if (!findkey("LAlt", "name")) {
                findkey("Alt", "name");
            }
            setoneminikey(lastkey);
        }
        minikeys = text;
        //Log.info("minikeys' length: "+ minikeys.length);
        for (i = 0; i < text.length; i++) {
            var k = text.charAt(i);
            if (!findkey(k, "name")) {
                if (!findkey(k, "sname")) {
                    if (!findkey(k, "usdname")) {
                        if (!findkey(k, "usdsname")) {
                            if (!findkey(k, "agname")) {
                                if (!findkey(k, "sdname")) {
                                    if (!findkey(k, "sdsname")) {
                                        if (!findkey(k, "gatname")) {
                                            if (!findkey(k, "gatsname")) {
                                                if (!findkey(k, "gagname")) {
                                                    if (!findkey(k, "gagsname")) {}
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            setoneminikey(lastkey);
            var fkey = lastkey;
            if (fkey.getAttribute("usdeadkey") != null) {
                var deadkey = fkey.getAttribute("usdeadkey");
                if (image_object["mk" + mk_check(deadkey)] == null) {
                    findkey(deadkey, "name");
                    setoneminikey(lastkey);
                    deaddiv = image_def_div["mk" + mk_check(deadkey)];
                }
            }
            if (fkey.getAttribute("gagdeadkey") != null) {
                var deadkey = fkey.getAttribute("gagdeadkey");
                findkey(deadkey, "agname");
                deadkey = lastkey.getAttribute("name");
                if (image_object["mk" + mk_check(deadkey)] == null) {
                    findkey(deadkey, "name");
                    setoneminikey(lastkey);
                    gagdiv = image_def_div["mk" + mk_check(deadkey)];
                }
            }
            if (fkey.getAttribute("gatdeadkey") != null) {
                var deadkey = fkey.getAttribute("gatdeadkey");
                findkey(deadkey, "agname");
                deadkey = lastkey.getAttribute("name");
                if (image_object["mk" + mk_check(deadkey)] == null) {
                    findkey(deadkey, "name");
                    setoneminikey(lastkey);
                    gatdiv = image_def_div["mk" + mk_check(deadkey)];
                }
            }
        }
    } catch (e) {
        catchlog(e);
    }
}


function do_lesson(script, item, type, text, alttext, audience) {
    Log.info("do lesson is called");

    var i = 0;
    if (audience != null) {
        if (Audience == static_formal && audience == "casual") {
            return false;
        }
        if (Audience == static_casual && audience == "formal") {
            return false;
        }
    }
    lesson_type = type;
    lesson_script = script;
    lesson_item = item;
    stimulus_index = 0;
    response_text = "";
    response_index = 0;
    lesson_active = 0;
    CollectWeakWords = false;
    line_start_time = (new Date()).getTime();
    if (type != "keylist" && ShowButtons && buttonshidden) {
        doshowbuttons();
    }
    switch (type) {
        case "cpaccuracy":
            Log.info("cpaccuracy");
            // チェックポイント
            if (save_tmpresult(text)) {
                //Log.info("lesson skipped");
                skipLesson = true;
                suspend = true;
                //				do_endlesson(text);
                //				inProgress = true;
                return false;
            } else {
                inProgress = true;
                accuracy_test = true;
                stimulus_text = SetSpacing(text);
                CollectWeakWords = true;
                LessonType = static_practice;
            }
            break;
        case "accuracy":
            inProgress = true;
            accuracy_test = true;
            stimulus_text = SetSpacing(text);
            CollectWeakWords = true;
            LessonType = static_practice;
            break;

        case "keylist":
            preparekeylist(text);
            if (!IsTQP && kewalatimeoutactive == null) {
                // use the first keylist as the trigger to start kewala timeouts
                kewalperiodsindex = 1; // allow time for any pairtest start
                kewalacurrtimecount = 0;
                kewalatimeoutactive = true;
            }
            return false;
        case "mixed":
            inProgress = true;
            accuracy_test = true;
            stimulus_text = generate2(text);
            CollectWeakWords = true;
            LessonType = static_mixedtext;
            break;
        case "speed":
            inProgress = true;
            speed_test = true;
            HadSpeedTest = true;
            stimulus_text = SetSpacing(text);
            LessonType = static_speedtext;
            break;
        case "pairtest":
            inProgress = true;
            if (TimeOutID != "") {
                clearInterval(TimeOutID);
                //				Log.info("clearInterval(TimeOutID)");
            }
            hide_minikbd();
            if (text == "asdf" || text == "jkl;") {
                ghostonly = true;
            }
            status_line.textContent = "";
            runpairtest(text);
            break;
        case "numbertest":
            inProgress = true;
            accuracy_test = true;
            stimulus_text = generatenum(text.substring(1), 44, text.charAt(0));
            CollectWeakWords = true;
            LessonType = static_mixedtext;
            break;
        case "numberspeed":
            inProgress = true;
            speed_test = true;
            stimulus_text = generatenum(text.substring(1), 44, text.charAt(0));
            CollectWeakWords = true;
            LessonType = static_mixedtext;
            break;
        case "weaktest":
            canSkip = true;
            if (save_tmpresult(text)) {
                Log.info("lesson skipped");
                skipLesson = true;
                suspend = true;
                return false;
            } else {
                statusLineLife = 5;
                status_line.style.color = "black";
                status_line.textContent = "苦手なキーの練習です。";

                var t = PrepareWeakTest(WeakDisplayCount);
                if (t > 0) {
                    WeakDisplayCount = t;
                    LessonType = static_weaktest;
                    break;
                }
            }
            return false;
        case "endlesson":
            inProgress = false;
            //Log.info("case endlesson");
            do_endlesson(text);
            return false;
        case "remedialpairtest":
            inProgress = false;
            if (TimeOutID != "") {
                clearInterval(TimeOutID);
                //				Log.info("clearInterval(TimeOutID)");
            }
            var t = PrepareRemedialPairTest();
            if (t.length > 1) {
                lesson_type = "pairtest";
                runpairtest(t);
            } else {
                return false;
            }
            break;
        case "maptexttest":
            inProgress = true;
            IsHenkan = true;
            maptext_test = true;
            LessonType = static_practice;
            stimulus_text = text;
            CreateMapTextChoices(text);
            break;
        case "altmaptexttest":
            inProgress = true;
            IsHenkan = true;
            IsAltMapTextLesson = true;
            LessonType = static_practice;
            stimulus_text = text;
            CreateAltMapTextChoices(text, alttext);
            break;
    }
    if (stimulus_text != null) {
        stimline_create();
        stimline_settext(stimulus_text);
        if (!IsAltMapTextLesson && !pair_test) {
            stimline_setcolourat(0);
        }
        respline_create();
        if (!pair_test) {
            show_lessonfields();
            minitimerid = setInterval(flipminikeys_handler, 500);
        }
    }
    return true;
}

function replace_signtext(aniid, id, s) {
    //	Log.info("replace_signtext("+aniid+", "+id+", "+s+")");
    if (static_image_ani_context[aniid] != null && !(static_image_ani_postcard[aniid] != null)) {
        static_image_ani_context[aniid].clearRect(0, 0, static_image_ani_canvas[aniid].width, static_image_ani_canvas[aniid].height);
    } else if (key_static_image_ani_context[aniid] != null && !(key_static_image_ani_postcard[aniid] != null)) {
        key_static_image_ani_context[aniid].clearRect(0, 0, key_static_image_ani_canvas[aniid].width, key_static_image_ani_canvas[aniid].height);
    } else if (moving_image_ani_context[aniid] != null && !(moving_image_ani_postcard[aniid] != null)) {
        moving_image_ani_context[aniid].clearRect(0, 0, moving_image_ani_canvas[aniid].width, moving_image_ani_canvas[aniid].height);
    } else if (key_moving_image_ani_context[aniid] != null && !(key_moving_image_ani_postcard[aniid] != null)) {
        key_moving_image_ani_context[aniid].clearRect(0, 0, key_moving_image_ani_canvas[aniid].width, key_moving_image_ani_canvas[aniid].height);
    }
    var offset = image_def_item_offset[static_image_ani_id[aniid]];
    var x;
    var y;
    if (planets_type) {
        x = parseInt(image_sign_x[offset]);
        y = parseInt(image_sign_y[offset]);
    } else {
        x = parseInt(image_x[offset]) + parseInt(image_sign_x[offset]);
        y = parseInt(image_y[offset]) + parseInt(image_sign_y[offset]);
    }
    var maxWidth = parseInt(image_sign_width[offset]);
    var lineHeight = parseInt(image_sign_fontsize[offset]) + 5;

    if (id == "scroll") { //結果表示画面の調整
        if (IsTQP) {
            static_image_ani_context[aniid].font = "17px " + font_name;
            lineHeight = 15
        } else {
            static_image_ani_context[aniid].font = "12px " + font_name;
            lineHeight = 12
        }
    }

    wrapText(static_image_ani_context[aniid], s, x, y, maxWidth, lineHeight, image_sign_nowrap[offset]);
}

//TFS スコア表示の更新
function replace_scoretext(s) {
    var aniid = "Scoreani";
    static_image_ani_context[aniid].clearRect(0, 0, static_image_ani_canvas[aniid].width, static_image_ani_canvas[aniid].height);
    var offset = image_def_item_offset[static_image_ani_id[aniid]]; //2

    var score_fontsize = 0;
    // スコア文字列の幅を取得
    var score_canvas = document.createElement('canvas');
    var score_context = score_canvas.getContext('2d');

    do { //スコア文字列が SCORETEXT_MAXWIDTH を超える場合はフォントサイズを小さくする
        score_context.font = (image_sign_fontsize[offset] - score_fontsize).toString() + "pt " + font_name;
        var metrics = score_context.measureText(s);
        score_fontsize += 1;
    } while (metrics.width > SCORETEXT_MAXWIDTH);

    var x = parseInt(image_x[offset]) + parseInt(image_sign_x[offset]) - metrics.width;
    var y = parseInt(image_y[offset]) + parseInt(image_sign_y[offset]);
    var maxWidth = parseInt(image_sign_width[offset]);
    var lineHeight = parseInt(image_sign_fontsize[offset]) + 5;



    wrapText(static_image_ani_context[aniid], s, x, y, maxWidth, lineHeight, image_sign_nowrap[offset]);
}

var obj = {};

function save_tmpresult(text) {
    //Log.info("save_tmpresult is called");
    try {
        if (skipLesson) {
            return false;
        }

        if (text == "none") {
            show = false;
        } else {
            show = true;
        }
        if (isNaN(totalerrtime)) {
            totalerrtime = 0;
        }
        if (TimeOutID != "") {
            clearInterval(TimeOutID);
        }

        if (show) { //スピード計算
            //			if(IsTest){
            //				nspeed = totalkeycount*60000.0/5.0/LessonPeriod/1000;
            //			}else{
            nspeed = totalkeycount * 60000.0 / 5.0 / (totalkeytime + totalerrtime);
            //				Log.info("totalkeycount: "+totalkeycount);
            //				Log.info("time: "+(totalkeytime+totalerrtime));
            //			}
            if (nspeed < 0) {
                nspeed = 0;
            }
            if (DoWPM) {
                speed = (nspeed).toFixed(1);
                goal = (TargetSpeed).toFixed(0);
            } else {
                speed = (nspeed * 5.0).toFixed(1);
                goal = (TargetSpeed * 5.0).toFixed(0);
            }
            //正確率の計算
            naccuracy = ((totalkeycount - totalerrcount) / totalkeycount) * 100.0;
            if (naccuracy < 0) {
                naccuracy = 0;
            }
            accuracy = (naccuracy).toFixed(1);
            if (naccuracy < 50.0) {
                //accuracy = "0.0";
                //naccuracy = "0.0";
            }
        } else {
            nspeed = 0.0;
            speed = "0.0";
            goal = "0";
            accuracy = "0.0";
            naccuracy = 0.0;
        }

        // Send results to host and get back praise message and goal speed
        var obj = new Object();
        var SentSeed = Math.round(Math.random() * 1000000);
        obj.SessionID = SessionID;
        obj.StudentID = StudentID;
        obj.ProductID = ProductID;
        obj.CourseID = CourseID;
        obj.LessonID = LessonID;
        obj.LanguageID = LanguageID;
        obj.HadSpeedTest = HadSpeedTest;
        obj.Akey = Akey;


        if (isNaN(nspeed)) {
            obj.Speed = 0.0;
        } else {
            obj.Speed = nspeed;
        }
        if (isNaN(naccuracy)) {
            obj.Accuracy = 0.0;
        } else {
            obj.Accuracy = naccuracy;
        }
        obj.Score = Score;
        obj.Seed = SentSeed;
        tmpSeed = obj.Seed;
        obj.DistributorKey = DistributorKey;

        var keys = new Array();
        TotalLessonTime = 0;
        var i = 0;
        if (show) {
            var k;
            var z;
            var errorRate;
            maxErrorRate = 0;
            for (z = 32; z < 127; z++) {
                k = recordkey[String.fromCharCode(z)];
                if (k != null) {
                    if (k.symbol == " " || k.symbol == "<" || k.symbol == ">" || k.symbol == "{" || k.symbol == "}" || k.symbol == "[" || k.symbol == "]")
                        continue;
                    //キー毎の最悪の正確率を計算
                    if (k.inkeylist && k.strokecount >= 2) {
                        var things = new Object();
                        things.symbol = mk_check_alt(k.symbol);
                        things.errorcount = k.errorcount;
                        things.strokecount = k.strokecount;
                        things.keytime = k.keytime;
                        TotalLessonTime += k.keytime;
                        errorRate = things.errorcount / things.strokecount;
                        if (maxErrorRate < errorRate) {
                            maxErrorRate = errorRate
                        }
                        keys[i] = things;
                        i++;
                    }
                }
            }
        }
        obj.RecordKey = keys;
        obj.StartTime = StartTime;
        var et = new Date();
        //		EndTime  = et.getTime()-3000;	//表示待ち時間3sec
        EndTime = et.getTime();

        obj.EndTime = EndTime;
        if (StartTime == null) {
            obj.StartTime = EndTime;
        }


        var tmpLessonTime = EndTime - StartTime;

        //		Log.info("tmpLessonTime : "+ tmpLessonTime/1000);
        //		Log.info("TotalLessonTime : "+ TotalLessonTime/1000);

        if (TotalLessonTime > tmpLessonTime) {
            TotalLessonTime = tmpLessonTime;
        }

        obj.TotalLessonTime = TotalLessonTime / 1000.0 / 60.0 / 60.0;

        maxErrorRate = (1 - maxErrorRate) * 100;

        tmpresult = "jsonobject=" + JSON.stringify(obj);
        Log.info("st:" + StartTime + "  et:" + EndTime + "  dur:" + (EndTime - StartTime) + "  dur2:" + TotalLessonTime + "  keyMaxErrorRate:" + maxErrorRate);


        //スキップする条件、全体のエラー率、キー毎のエラー率(max)、目標スピードなど
        //Log.info("maxErrorRate:"+maxErrorRate+"  accuracy:" +accuracy+ "  TargetSpeed:" + TargetSpeed + "  speed:" + speed  );
        //Log.info("SkipSpeedRate * TargetSpeed : " + SkipSpeedRate * TargetSpeed)
        //		if(maxErrorRate <= SkipMaxKeyError && SkipAccuracy <= naccuracy && SkipSpeedRate * TargetSpeed <= nspeed){
        if (maxErrorRate => SkipMaxKeyError && SkipAccuracy <= naccuracy && SkipSpeedRate * TargetSpeed / 100 <= nspeed) {
            if (!isSatisfy && AllowSkip) {
                canSkip = true;
                isSatisfy = true;
                if (confirm("あなたは十分にタイプできています。このレッスンをスキップしますか。")) {
                    return true;
                } else {
                    //Log.info("lesson NOT skipped1");
                    return false;
                }
            }
            return false;

        } else {
            if (!canSkip) {
                canSkip = true;
                //				alert("ここまでのレッスン成績を保存しました。引き続き頑張りましょう。");
                statusLineLife = 5;
                status_line.style.color = "black";
                status_line.textContent = "ここまでのレッスン成績を保存しました。引き続き頑張りましょう。";

                //				Log.info("lesson NOT skipped2");
            }
            return false;
        }

        return true;

    } catch (e) {
        catchlog(e);
    }

}


function do_endlesson(text) {

    //Log.info("do endlesson is called");
    var show;
    var et = new Date();
    //	EndTime  = et.getTime()-3000;	//表示待ち時間3sec
    EndTime = et.getTime();

    try {
        donelesson = true;
        hide_lessonfields();
        document.body.style.cursor = "wait";
        if (text == "intro") {
            show = false;
        } else {
            show = true;
        }
        if (kewalatimeoutactive != null) {
            kewalatimeoutactive = false;
            keytimeoutactive = false;
            clearInterval(keytimeouttimerid);
        }
        if (IsTFSExtLesson) {
            if (image_def_item_offset["TrailMap1"] != null) {
                if (ScoreValid) {
                    Score += 1000; // for finishing an extension lesson
                    replace_scoretext((Score).toString());
                }
            }
        } else {
            if (image_def_item_offset["TrailMap1"] != null) {
                if (ScoreValid) {
                    Score += 2000; // for finishing a lesson
                    replace_scoretext((Score).toString());
                }
            }
        }
        if (isNaN(totalerrtime)) {
            totalerrtime = 0;
        }
        inProgress = false;
        if (TimeOutID != "") {
            clearInterval(TimeOutID);
        }

        if (show) { //スピード計算
            if (IsTest) {
                //				nspeed = totalkeycount*60000.0/5.0/LessonPeriod/1000;
                nspeed = totalkeycount * 60000.0 / 5.0 / (EndTime - StartTime);
            } else {
                nspeed = totalkeycount * 60000.0 / 5.0 / (totalkeytime + totalerrtime);
            }
            if (nspeed < 0) {
                nspeed = 0;
            }
            if (DoWPM) {
                speed = (nspeed).toFixed(1);
                goal = (TargetSpeed).toFixed(0);
            } else {
                speed = (nspeed * 5.0).toFixed(1);
                goal = (TargetSpeed * 5.0).toFixed(0);
            }
            //正確率の計算
            naccuracy = ((totalkeycount - totalerrcount) / totalkeycount) * 100.0;
            if (naccuracy < 0) {
                naccuracy = 0;
            }
            accuracy = (naccuracy).toFixed(1);
            if (naccuracy < 50.0) {
                //accuracy = "0.0";
                //naccuracy = "0.0";
            }
        } else {
            nspeed = 0.0;
            speed = "0.0";
            goal = "0";
            accuracy = "0.0";
            naccuracy = 0.0;
        }

        // Send results to host and get back praise message and goal speed
        var obj = new Object();
        var SentSeed = Math.round(Math.random() * 1000000);
        //Log.info(SessionID)
        obj.SessionID = SessionID;
        obj.StudentID = StudentID;
        obj.ProductID = ProductID;
        obj.CourseID = CourseID;
        obj.LessonID = LessonID;
        obj.LanguageID = LanguageID;
        obj.HadSpeedTest = HadSpeedTest;
        obj.Akey = Akey;

        if (isNaN(nspeed)) {
            obj.Speed = 0.0;
        } else {
            obj.Speed = nspeed;
        }
        if (isNaN(naccuracy)) {
            obj.Accuracy = 0.0;
        } else {
            obj.Accuracy = naccuracy;
        }
        obj.Score = Score;
        obj.Seed = SentSeed;
        obj.DistributorKey = DistributorKey;


        TotalLessonTime = 0;
        var keys = new Array();
        var i = 0;
        if (show) {
            var k;
            var z;
            for (z = 32; z < 127; z++) {
                k = recordkey[String.fromCharCode(z)];
                //Log.info("k= "+String.fromCharCode(z));
                if (k != null) {
                    if (k.symbol == " " || k.symbol == "<" || k.symbol == ">" || k.symbol == "{" || k.symbol == "}" || k.symbol == "[" || k.symbol == "]")
                        continue;
                    if (k.inkeylist && k.strokecount >= 2) {
                        var things = new Object();
                        things.symbol = mk_check_alt(k.symbol);
                        things.errorcount = k.errorcount;
                        things.strokecount = k.strokecount;
                        things.keytime = k.keytime;
                        TotalLessonTime += k.keytime;
                        keys[i] = things;
                        i++;
                    }
                }

            }
        }
        obj.RecordKey = keys;
        obj.StartTime = StartTime;

        obj.EndTime = EndTime;
        if (StartTime == null) {
            obj.StartTime = EndTime;
        }


        var tmpLessonTime = EndTime - StartTime;

        //		Log.info("tmpLessonTime : "+ tmpLessonTime/1000);
        //		Log.info("TotalLessonTime : "+ TotalLessonTime/1000);

        if (TotalLessonTime > tmpLessonTime) {
            TotalLessonTime = tmpLessonTime;
        }

        obj.TotalLessonTime = TotalLessonTime / 1000.0 / 60.0 / 60.0;




        //Log.info("st:"+StartTime+"  et:"+EndTime+"  dur:"+(EndTime-StartTime)+"  dur2:"+TotalLessonTime);

        var data = "jsonobject=" + JSON.stringify(obj);


        // 中断の場合、チェックポイント時の成績を保存する
        if (suspend) {
            data = tmpresult;
        }
        //Log.info(data)
        var phttp = new XMLHttpRequest();
        phttp.open("POST", HOSTNAME + "/endlesson.py", false);
        phttp.send(data);

        // values returning from session end request
        var results = phttp.responseText;
        obj = JSON.parse(results);

        // $.ajax({
        // 	type:'post',
        // 	url:STORAGE_PATH+"/endlesson.py",
        // 	contentType:'text/plain',
        // 	async: false,
        // 	data:data,
        // })
        // .done(function(results){
        // 	obj = JSON.parse(results);
        // })
        // .fail(function(error){
        // 	Log.info(error);
        // });


        var ReturnedSeed = obj.Seed;
        if ((ReturnedSeed - 1) != SentSeed && (ReturnedSeed - 1) != tmpSeed) {
            // Problem in Communications with host
            document.body.style.cursor = "default";
            return;
        }
        // レッスン結果画面を表示
        // Complete display of results
        //Log.info("data:"+data);
        if (show) {
            var s = LessonHeader + "^ 　^ ";
            if (LanguageID == "JAP-TQ") {
                s += StudentName + static_jendname + "^ ";
            } else {
                s += StudentName + "^ ";
            }
            if (DoWPM) {
                s += static_yourspeed + speed + static_wpm + "^ ";
                s += static_goalspeed + goal + static_wpm + "^ ";
            } else {
                s += static_yourspeed + speed + static_kpm + "^ ";
                s += static_goalspeed + goal + static_kpm + "^ ";
            }
            s += static_accuracy + accuracy + "%" + "^ 　^ ";
            s += ' ignore_space ';
            s += obj.Praise;
            //Log.info("s="+s);

            // Put results into Scroll or equivalent for TQP
            replace_signtext("scrollani", "scroll", s);
        }
        status_line.style.color = "black";
        status_line.textContent = static_pressbutton;
        document.body.style.cursor = "default";

    } catch (e) {
        catchlog(e);
    }
}




function process_script(script_name, item_start) {
    //Log.info("process_script: " + script_name+", "+item_start);
    try {
        var html_objects = document.getElementById(script_name);
        var s = html_objects.getAttribute("data-tqscr-repeat");
        //Log.info(s);
        var repeat;
        if (s == null) {
            repeat = 1;
        } else {
            repeat = parseInt(s);
        }
        var randlow;
        s = html_objects.getAttribute("data-tqscr-randlow");
        if (s == null) {
            randlow = 0;
        } else {
            randlow = parseInt(s);
        }
        var randhigh;
        s = html_objects.getAttribute("data-tqscr-randhigh");
        if (s == null) {
            randhigh = 0;
        } else {
            randhigh = parseInt(s);
        }
        var wait_for_event = false;
        //var curr_item = parseInt(item_start);
        curr_item = parseInt(item_start);
        var ctx;
        steponesc = false;
        while (!wait_for_event) {
            //Log.info("roop curr_item: "+ curr_item)
            var obj = html_objects.childNodes.item(curr_item * 2 + 1);
            if (obj == null) {
                break;
            }
            //Log.info("process_script("+script_name+", "+curr_item+"):"+obj.getAttribute("data-tqscr-id")+":"+obj.getAttribute("data-tqscr-type"));
            //Log.info("script="+obj.outerHTML);
            // object行の実際の処理

            switch (obj.getAttribute("data-tqscr-op")) {
                case "load":
                    //Log.info("load="+obj.getAttribute("data-tqscr-type"));
                    switch (obj.getAttribute("data-tqscr-type")) {
                        case "image":
                            load_image(obj.getAttribute("data-tqscr-id"));
                            break;
                        case "audio":
                            load_audio(obj.getAttribute("data-tqscr-id"));
                            break;
                    }
                    curr_item++;
                    break;
                case "static-images-animation":
                    //Log.info("static-images-animation:"+curr_item+":"+lesson_item);
                    //タイピングテスト終了処理
                    if (obj.getAttribute("data-tqscr-id") == "reportbackgroundani") {
                        skipLesson = false;
                    }

                    //kewala 新しいキーのモクモクでタイムアウトしないように
                    if (obj.getAttribute("data-tqscr-id") == "keycloudsani") {
                        clearInterval(TimeOutID);
                    }

                    var skipmessage = function () {
                        //音が出ないときのための指示
                        status_line.textContent = "Escキーを押してスキップできます";
                    }
                    var skipmapscreen = function () {
                        process_script('main_script', lesson_item + 1);
                    }

                    //kewala マップフラグ
                    if (obj.getAttribute("data-tqscr-id") == "mapani") {
                        mapaniFlag = true;
                        setTimeout(skipmessage, 6000);
                        //setTimeout(skipmapscreen,12000);
                        //showSkipMessage();
                    } else {
                        mapaniFlag = false;
                        status_line.textContent = "";
                    }
                    if (obj.getAttribute("data-tqscr-atend") != null) { //Log.info("set at end for "+obj.getAttribute("data-tqscr-id"));
                        static_image_ani_atend[obj.getAttribute("data-tqscr-id")] = true;
                    } else {
                        static_image_ani_atend[obj.getAttribute("data-tqscr-id")] = null;
                    }

                    wait_for_event = animate_static_image(script_name, curr_item,
                        obj.getAttribute("data-tqscr-id"),
                        obj.getAttribute("data-tqscr-action"),
                        obj.getAttribute("data-tqscr-delay"),
                        static_image_ani_selection[obj.getAttribute("data-tqscr-id")],
                        obj.getAttribute("data-tqscr-playcount"),
                        obj.getAttribute("data-tqscr-foreground"),
                        obj.getAttribute("data-tqscr-visible")
                    );
                    curr_item++;
                    //練習開始時にマップの点を打つ
                    if (obj.getAttribute("data-tqscr-id") == "TrailMap1ani") {
                        SetTrailMap("0");
                    }
                    break;
                case "moving-images-animation":
                    //Log.info("moving-images-animation:"+obj.getAttribute("data-tqscr-id")+":"+curr_item+":"+lesson_item);
                    if (!skipLesson || obj.getAttribute("data-tqscr-action") == "stop") {
                        //Log.info("moving image ani");
                        show_minikbd();
                        show_allminikeys();
                        var a = obj.getAttribute("data-tqscr-action");
                        if (a != null && a == "start") {
                            var t = obj.getAttribute("data-tqscr-type");
                            if (t != null) {
                                if (t.indexOf("challenger") == 0) {
                                    if (obj.getAttribute("data-tqscr-atend") != null) {
                                        //Log.info("set at end for "+obj.getAttribute("data-tqscr-id"));
                                        moving_image_ani_atend[obj.getAttribute("data-tqscr-id")] = true;
                                    } else {
                                        moving_image_ani_atend[obj.getAttribute("data-tqscr-id")] = null;
                                    }
                                    challenger_ext_ani = obj.getAttribute("data-tqscr-id");
                                    if (kewala_ext_ani != null) {
                                        SetChallengeParams();
                                    }
                                    curr_item++;
                                    break;
                                }
                            }
                        }
                        if (obj.getAttribute("data-tqscr-id") == "kewaladancingani" &&
                            obj.getAttribute("data-tqscr-action") == "start") {
                            //Log.info("lesson_item,curr_item" + lesson_item + "," + curr_item);
                            lesson_item = curr_item;
                            danceaniFlag = true;
                        }

                        //kewala 最後
                        if (obj.getAttribute("data-tqscr-id") == "kewalauppathani") {
                            hide_minikbd();
                            hide_allminikeys();
                            clearInterval(TimeOutID);
                        }

                        wait_for_event = animate_moving_image(script_name, curr_item,
                            obj.getAttribute("data-tqscr-id"),
                            obj.getAttribute("data-tqscr-action"),
                            obj.getAttribute("data-tqscr-delay"),
                            moving_image_ani_selection[obj.getAttribute("data-tqscr-id")],
                            obj.getAttribute("data-tqscr-playcount"),
                            obj.getAttribute("data-tqscr-foreground"),
                            obj.getAttribute("data-tqscr-visible")
                        );
                    }
                    curr_item++;
                    break;
                case "audio":
                    //Log.info("audio:"+curr_item+":"+lesson_item);
                    //Log.info("audio ani:"+obj.getAttribute("data-tqscr-id"));
                    if (!skipLesson) {
                        wait_for_event = animate_audio(script_name, curr_item,
                            obj.getAttribute("data-tqscr-id"),
                            obj.getAttribute("data-tqscr-action"),
                            obj.getAttribute("data-tqscr-delay"),
                            obj.getAttribute("data-tqscr-playcount"),
                            obj.getAttribute("data-tqscr-foreground"),
                            obj.getAttribute("data-tqscr-type")
                        );
                    }
                    curr_item++;
                    break;

                case "lesson":
                    if (obj.getAttribute("data-tqscr-type") == "blank") {
                        //Log.info("lesson-blank");
                        if (skipLesson) {
                            skipLesson = false;
                        }
                    } else {
                        if (!skipLesson) {
                            wait_for_event = do_lesson(script_name, curr_item,
                                obj.getAttribute("data-tqscr-type"),
                                obj.getAttribute("data-tqscr-text"),
                                obj.getAttribute("data-tqscr-alttext"),
                                obj.getAttribute("data-tqscr-audience")
                            );
                        }
                    }
                    curr_item++;
                    break;


                case "endlesson":
                    //Log.info("case endlesson");
                    do_endlesson(true);
                    return false;

                case "key-static-images-animation":
                    //Log.info("key static image ani");
                    wait_for_event = animate_key_static_image(script_name, curr_item,
                        obj.getAttribute("data-tqscr-id"),
                        obj.getAttribute("data-tqscr-action"),
                        obj.getAttribute("data-tqscr-delay"),
                        static_image_ani_selection[obj.getAttribute("data-tqscr-id")],
                        obj.getAttribute("data-tqscr-playcount"),
                        obj.getAttribute("data-tqscr-foreground"),
                        obj.getAttribute("data-tqscr-visible")
                    );
                    curr_item++;
                    break;
                case "key-moving-images-animation":
                    //Log.info("key moving image ani");
                    var a = obj.getAttribute("data-tqscr-action");
                    if (a != null && a == "stop") {
                        var id = obj.getAttribute("data-tqscr-id");
                        if (image_def_istimed[key_moving_image_ani_id[id]]) { //アニメ―ション
                            var vis = obj.getAttribute("data-tqscr-visible");
                            if (vis != null && vis == "false") {
                                key_moving_image_ani_visible[id] = false;
                            }
                            key_moving_image_ani_object_playing[id] = -1;
                            try {
                                if (key_moving_image_ani_div[id].firstChild != null) {
                                    key_moving_image_ani_div[id].removeChild(key_moving_image_ani_div[id].firstChild);
                                }
                                if (key_moving_image_ani_playcount[id] == 0) {
                                    draw_region.removeChild(key_moving_image_ani_div[id]);
                                }
                            } catch (e) {

                            }
                        } else {
                            stop_key_moving_image_animation(id); //静止画
                        }
                        curr_item++;
                        break;
                    }
                    if (a != null && a == "start") {
                        var t = obj.getAttribute("data-tqscr-type");
                        if (t != null) {
                            if (t.indexOf("kewala") == 0) {
                                kewala_ext_ani = obj.getAttribute("data-tqscr-id");
                                if (challenger_ext_ani != null) {
                                    SetChallengeParams();
                                }
                            }
                        }
                    }
                    if (obj.getAttribute("data-tqscr-id") == "predator") {
                        if (ValidPredator) {
                            predator_line = true;
                            predator_running = false;
                        }
                        curr_item++;
                        break;
                    }
                    wait_for_event = animate_key_moving_image(script_name, curr_item,
                        obj.getAttribute("data-tqscr-id"),
                        obj.getAttribute("data-tqscr-action"),
                        obj.getAttribute("data-tqscr-delay"),
                        key_moving_image_ani_selection[obj.getAttribute("data-tqscr-id")],
                        obj.getAttribute("data-tqscr-playcount"),
                        obj.getAttribute("data-tqscr-foreground"),
                        obj.getAttribute("data-tqscr-visible"),
                        obj.getAttribute("data-tqscr-offset"),
                        obj.getAttribute("data-tqscr-signtext"),
                        obj.getAttribute("data-tqscr-sign-x"),
                        obj.getAttribute("data-tqscr-sign-y"),
                        obj.getAttribute("data-tqscr-sign-fontsize"),
                        obj.getAttribute("data-tqscr-sign-width"),
                        obj.getAttribute("data-tqscr-sign-height"),
                        obj.getAttribute("data-tqscr-prey2"),
                        obj.getAttribute("data-tqscr-prey-duration"),
                        obj.getAttribute("data-tqscr-prey2fx")
                    );
                    curr_item++;
                    break;

                case "delay":
                    //Log.info(lesson_item + " : delay called");
                    if (!skipLesson) {
                        var tid = setTimeout(function () {
                            script_delay_handler(script_name, curr_item);
                        }, parseInt(obj.getAttribute("data-tqscr-delay")));
                        if (obj.getAttribute("data-tqscr-esc") != null) {
                            steponesc = true;
                            esctimerid = tid;
                            esc_script = script_name;
                            esc_line = curr_item;
                        }
                        wait_for_event = true;
                    } else {
                        curr_item++;
                    }
                    break;

                case "script":
                    //Log.info(lesson_item +" ::: "+curr_item);
                    tmp_curr_item = curr_item;
                    process_script(obj.getAttribute("data-tqscr-id"), 0);
                    curr_item = tmp_curr_item;
                    //Log.info(lesson_item +" ::: "+curr_item);
                    curr_item++;
                    break;
                case "blank":
                    curr_item++;
                    break;
            }

        }
        if (repeat == 0) {
            if (randhigh != randlow) {
                var t = Math.random() * (randhigh - randlow) + randlow;
                setTimeout(function () {
                    script_delay_handler(script_name, -1);
                }, t);
            }
        }
    } catch (ee) {
        catchlog(ee);
    }
}

function ensure_create_stylesheet() {
    //if (browser == 4) {
    //	return;
    //}
    if (typeof document.createStyleSheet === 'undefined') {
        document.createStyleSheet = (function () {
            function createStyleSheet(href) {
                if (typeof href !== 'undefined') {
                    var element = document.createElement('link');
                    element.type = 'text/css';
                    element.rel = 'stylesheet';
                    element.href = href;
                } else {
                    var element = document.createElement('style');
                    element.type = 'text/css';
                }

                document.getElementsByTagName('head')[0].appendChild(element);
                var sheet = document.styleSheets[document.styleSheets.length - 1];

                if (typeof sheet.addRule === 'undefined')
                    sheet.addRule = addRule;

                if (typeof sheet.removeRule === 'undefined')
                    sheet.removeRule = sheet.deleteRule;

                return sheet;
            }

            function addRule(selectorText, cssText, index) {
                if (typeof index === 'undefined')
                    index = this.cssRules.length;
                try {
                    this.insertRule(selectorText + ' {' + cssText + '}', index);
                } catch (eee) {
                    catchlog(eee);
                }
            }

            function removeRule(index) {
                if (typeof index === 'undefined')
                    index = 0;

                this.deleteRule(index);
            }

            return createStyleSheet;
        })();
    }
}

var CLICKME = static_click;
var status_line;
var UseEnterKey;


function focus_handler(e) {
    if (status_line != null) {
        status_line.textContent = "";
    }
    if (cursordiv == null) {
        makecursor();
    }
    cursordiv.focus();
    //setInterval(cursortimer_handler, 50);
    if (!pair_test && !inputfieldshidden && respbasediv != null) {
        //cursordiv.type = "text";
        cursordiv.style.top = respbasediv.style.top;
        cursordiv.style.left = respbasediv.style.left;
        cursordiv.style.width = "20px";
        cursordiv.style.height = (font_size_int + 17).toString() + "px"; // padding of 5 top 5 bottom
        cursorcontext.font = font_size + "px " + font_name;
        cursorcanvastop = respbasediv.style.top;
        cursorcanvas.top = respbasediv.style.top;
        cursorcanvas.left = respbasediv.style.left;
        cursorcanvas.width = 20;
        cursorcanvas.height = (font_size_int + 17).toString(); // padding of 5 top 5 bottom
        if (response_text != null && response_text != "") {
            var mtr;
            mtr = respbasecontext.measureText(response_text);
            cursordiv.style.left = (32 + 5 + mtr.width).toString() + "px";
            cursorcanvas.left = (32 + 5 + mtr.width);
        }
    }
}

function blur_handler(e) {
    status_line.style.color = "black";
    status_line.textContent = CLICKME;
    if (!pair_test && !inputfieldshidden && respbasediv != null) {
        //cursordiv.type = "text";
        cursordiv.style.top = respbasediv.style.top;
        cursordiv.style.left = respbasediv.style.left;
        cursordiv.style.width = "20px";
        cursordiv.style.height = (font_size_int + 17).toString() + "px"; // padding of 5 top 5 bottom
        cursorcontext.font = font_size + "px " + font_name;
        cursorcanvas.top = respbasediv.style.top;
        cursorcanvas.left = respbasediv.style.left;
        cursorcanvas.width = 20;
        cursorcanvas.height = (font_size_int + 17).toString(); // padding of 5 top 5 bottom
    }
}

function keyup_handler(e) {
    var code;
    if (browser == 4) {
        code = window.event.keyCode;
    } else {
        code = e.keyCode;
    }
    //Log.info("keyup_code: "+code);

}

var rand_time = Math.floor(Math.random() * 20) - 9;
var inject_time = 0;

function keypress_handler(e) {
    if (!ENABLE_TYPE) {
        e.preventDefault()
        return;
    }
    //Log.info("keypress_handler("+e+")");
    // remove following block when scaling works
    if (e.ctrlKey || e.altKey) {
        return true;
    }
    kewalacurrtimecount = 0;
    kewalaperiodsindex = 0;
    keytimeoutactive = true;
    keytimeoutcount = 0;

    var c;
    var code = e.charCode;
    console.log("koko 1", code);
    //Log.info("keypress_code: "+code);
    if (code == null || code == 0) {
        code = e.keyCode;
        if (code == null) {
            code = e.which;
        }
    }
    e.preventDefault();
    if (cursordiv != null) {
        cursordiv.value = "";
    }
    if (maptext_test) {
        maptexttesttinp(e);
        return;
    }
    if (IsAltMapTextLesson) {
        altmaptexttesttinp(e);
        return;
    }
    var backspace = false;
    if (code < 32) {
        if (speed_test) {
            LastCapslockState = false;
            if (code == 13) {
                c = "\r";
            } else {
                if (code != 8 || response_index == 0) { // only allow backspaces when not at line start
                    return;
                }
                //backspace = true;
                //c = "!"; //dummy value
                e.preventDefault();
                return;
            }
        } else {
            if (e.keyCode != 13) {
                lesson_beep = play_audio_file(lesson_beep, "beep", null, true, DoErrorBeep);
                return;
            }
            c = '\r';
        }
    } else {
        c = String.fromCharCode(code);
        var s = String.fromCharCode(e.keyCode || e.which);
        if (s.toUpperCase() === s && !e.shiftKey) {
            if (code >= 65 && code <= 90) {
                LastCapslockState = true;
            } else {
                LastCapslockState = false;
            }
        } else {
            LastCapslockState = false;
        }
    }
    if (pairfielddiv != null) {
        pairfielddiv.value = "";
        e.preventDefault();
    }
    if (stimulus_index == 0) { //行の先頭
        lastkeytime = (new Date()).getTime();
        if (kewala_ext_ani != null && challenger_ext_ani != null && !challenge_started) {
            challenge_started = true;
            animate_moving_image("main_script", 0,
                challenger_ext_ani,
                "start",
                null,
                moving_image_ani_selection[challenger_ext_ani],
                1,
                false,
                true
            );
        }
    }


    console.log("Input:" + c);
    console.log("Exp:" + stimulus_text.charAt(stimulus_index));
    if (stimulus_text.charAt(stimulus_index) != '') {
        if (inject_time != rand_time) {
            c = stimulus_text.charAt(stimulus_index);
            inject_time++;
        } else {
            console.log("Random time:" + rand_time);
            rand_time = Math.floor(Math.random() * 20) - 9;
            inject_time = 0;
        }
    }



    switch (lesson_type) {
        case "numbertest":
        case "weaktest":
        case "mixed":
        case "accuracy":
        case "cpaccuracy":
            if (stimulus_index >= stimulus_text.length) {
                if (IsKeypadLesson && c != '\r') {
                    processkey('\r', true, c);
                    lesson_beep = play_audio_file(lesson_beep, "beep", null, true, DoErrorBeep);
                } else if (UseEnterKey && c != '\r') {
                    processkey('\r', true, c);
                    lesson_beep = play_audio_file(lesson_beep, "beep", null, true, DoErrorBeep);
                } else if (!UseEnterKey && !IsKeypadLesson && c != ' ') {
                    processkey(' ', true, c);
                    lesson_beep = play_audio_file(lesson_beep, "beep", null, true, DoErrorBeep);
                } else {
                    if (IsKeypadLesson && c == '\r') {
                        processkey('\r', false, c);
                    } else if (UseEnterKey && c == '\r') {
                        processkey('\r', false, c);
                    } else if (!UseEnterKey && !IsKeypadLesson && c == ' ') {
                        processkey(' ', false, c);
                    }

                    LastLineTotalKeyTime = (new Date()).getTime() - line_start_time;
                    LastLineTotalCharCount = stimulus_index;
                    StimulusCount += stimulus_index;
                    hide_lessonfields();
                    if (lesson_type == "weaktest" && WeakDisplayCount < TotalWeakCount) {
                        SetTrailMap(stimulus_text);
                        var t = PrepareWeakTest(WeakDisplayCount);
                        if (t > 0) {

                            process_script(lesson_script, lesson_item.toString());
                            return;
                        }
                    } else {
                        if (LineStrokes > 0) {
                            if ((LineErrors / LineStrokes) < 0.5) {
                                SetTrailMap(stimulus_text);
                                if (kewala_ext_ani != null) {
                                    //Log.info("before maxpath k="+kewala_ext_ani);
                                    var max_path = Math.round(key_moving_image_ani_object[kewala_ext_ani].childNodes.length / 2) - 1;
                                    //Log.info("after maxpath");
                                    //TFS強化レッスン 終了時の判定
                                    Log.info("key_moving_image_ani_path_playing[kewala_ext_ani]:" + key_moving_image_ani_path_playing[kewala_ext_ani] + "  max_path: " + max_path);
                                    if (kewala_ext_ani == "kewala2ani" && key_moving_image_ani_path_playing[kewala_ext_ani] >= (max_path - 1)) {
                                        var id = "kewala2ani";
                                        var obj;
                                        obj = document.getElementById("div-" + challenger_ext_ani);
                                        if (obj == null) {
                                            obj = document.getElementById("div-" + challenger_ext_ani + "-0");
                                        }
                                        if (obj == null) {
                                            obj = document.getElementById("div-" + challenger_ext_ani + "-1");
                                        }
                                        if (obj == null) {
                                            obj = document.getElementById("div-" + challenger_ext_ani + "-2");
                                        }
                                        if (obj != null) {
                                            try {
                                                //Log.info(obj);
                                                var xnow = window.getComputedStyle(obj, null);
                                                //Log.info(xnow);
                                                var sleft = xnow.getPropertyValue("left");
                                                //Log.info(sleft);
                                                var ileft = Math.round(parseInt(sleft.substring(0, sleft.length - 2)));
                                                //Log.info(ileft);
                                                var stop = xnow.getPropertyValue("top");
                                                //Log.info(stop);
                                                var itop = Math.round(parseInt(stop.substring(0, stop.length - 2)));

                                                //Log.info("itop: "+itop+" key_moving_image_ani_y1["+id+"]: "+key_moving_image_ani_y1[id] );
                                                kewala_won = false;
                                                if (dir == "up") {
                                                    if (itop > key_moving_image_ani_y1[id]) {
                                                        kewala_won = true;
                                                    }
                                                } else {
                                                    if (itop < key_moving_image_ani_y1[id]) {
                                                        kewala_won = true;
                                                    }
                                                }
                                                Log.info("kewala_won:" + kewala_won);

                                            } catch (ee) {
                                                catchlog(ee);
                                            }
                                        }
                                    }
                                }
                                //Log.info("kewala_won: "+kewala_won);

                                process_script(lesson_script, eval(lesson_item + 1).toString());
                            } else {
                                LineStrokes = 0;
                                LineErrors = 0;
                                stimulus_index = 0;
                                response_index = 0;
                                response_text = "";
                                respline_clear();
                                show_lessonfields();
                                status_line.style.color = "black";
                                status_line.textContent = static_toomany;
                            }
                        } else {
                            SetTrailMap(stimulus_text);

                            process_script(lesson_script, eval(lesson_item + 1).toString());
                        }
                    }
                    LineTotKeyTime = 0;
                    stimulus_index = 0;
                }
            } else {
                if (c != stimulus_text.charAt(stimulus_index) && !(IsKeypadLesson && c == '\r' && stimulus_text.charAt(stimulus_index) == ' ')) {
                    if (IsKeypadLesson && stimulus_text.charAt(stimulus_index) == ' ') {
                        processkey("\r", true, c);
                    } else {
                        processkey(stimulus_text.charAt(stimulus_index), true, c);
                    }
                    lesson_beep = play_audio_file(lesson_beep, "beep", null, true, DoErrorBeep);
                } else {
                    processkey(c, false, c);
                    if (IsKeypadLesson && c == "\r") {
                        c = " ";
                    }
                    response_text += c;
                    stimulus_index++;
                    stimline_setcolourat(stimulus_index);
                    response_index++; //正しくタイプした数
                    respline_addcharat(response_index, false);
                    if (predator_line) {
                        if (!predator_running) {
                            if (response_index > 2) {
                                predator_running = true;
                                // set the number of keystrokes required by user to beat the predator, the 0.9 brings it close to end of line
                                // 練習テキストの3文字目からPredetorが現れ、全体の0.9倍まで打てばPredatorは戻る
                                predator_stop_count = Math.round(stimulus_text.length * 0.9);
                                if (predator_stop_count < 12) {
                                    predator_stop_count = 12;
                                }
                                // set the time value in the path entries for predator approach, the 0.8 means they must go a little faster
                                // Predatorの接近スピードを設定 0.8はちょっと早い
                                var old_x = (LastLineTotalKeyTime * 0.8 * (stimulus_text.length / LastLineTotalCharCount) - 4000.0) / 1000.0;
                                var x = 0.8 * LastLineTotalKeyTime / LastLineTotalCharCount * (stimulus_text.length - 4) / 1000.0;
                                var y = 12 / TargetSpeed * (stimulus_text.length - 4);
                                if (x > y) x = y;
                                var obj = moving_image_ani_object["predatornormalani"].childNodes.item(5); // last path in predatornormalani
                                obj.setAttribute("data-tqani-period", (x).toString());
                                process_script("predatorappears_script", 0);
                            }
                        } else {
                            if (response_index >= predator_stop_count) {
                                predator_running = false;
                                predator_line = false;

                                process_script("predatormisses_script", 0);
                            }
                        }
                    }
                    do_step_key_static_image();
                    do_step_key_moving_image();
                }
            }
            break;
        case "numberspeed":
        case "speed":
            //Log.info("c : "+ c);
            if (backspace) {
                response_index--;
                response_text = response_text.substring(0, response_index);
                respline_backspaceto(response_index);
                match_resp_stim();
                stimline_setcolourat(stimulus_index);
                respline_setcolour(response_index);
                break;
            } else if (stimulus_index >= stimulus_text.length || response_index > (stimulus_text.length + 10)) {
                var DoNextLine = false;
                if (IsKeypadLesson && c == " ") {
                    DoNextLine = true;
                } else if (UseEnterKey || lesson_type == 'numberspeed') {

                    if (c == '\r') {
                        DoNextLine = true;

                    } else if (response_index > (stimulus_text.length + 10)) {
                        DoNextLine = true;
                    }

                } else {
                    if (c == ' ') {
                        DoNextLine = true;
                    } else if (response_index > (stimulus_text.length + 10)) {
                        DoNextLine = true;
                    }
                }
                if (DoNextLine) {
                    // time to move to next script line
                    LastLineTotalKeyTime = LineTotKeyTime;
                    LineTotKeyTime = 0;
                    LastLineTotalCharCount = stimulus_text.length;
                    StimulusCount += stimulus_text.length;
                    SpeedLineCalc();
                    hide_lessonfields();
                    if (LineStrokes > 0) {
                        if ((LineErrors / LineStrokes) < 0.5) {
                            SetTrailMap(stimulus_text);

                            process_script(lesson_script, eval(lesson_item + 1).toString());
                        } else {
                            LineStrokes = 0;
                            LineErrors = 0;
                            stimulus_index = 0;
                            response_index = 0;
                            response_text = "";
                            respline_clear();
                            show_lessonfields();
                            status_line.style.color = "black";
                            status_line.textContent = static_toomany;
                            e.preventDefault();
                            return false;
                        }
                    } else {
                        SetTrailMap(stimulus_text);

                        process_script(lesson_script, eval(lesson_item + 1).toString());
                    }
                    stimulus_index = 0;
                } else {
                    match_resp_stim();
                    stimline_setcolourat(stimulus_index);
                    respline_addcharat(response_index);
                    respline_setcolour(response_index);
                }
                return true;
            } else {
                if (predator_line) {
                    if (!predator_running) {
                        if (response_index > 2) {
                            predator_running = true;
                            // set the number of keystrokes required by user to beat the predator, the 0.9 brings it close to end of line
                            // 練習テキストの3文字目からPredetorが現れ、全体の0.9倍まで打てばPredatorは戻る
                            predator_stop_count = Math.round(stimulus_text.length * 0.9);
                            if (predator_stop_count < 12) {
                                predator_stop_count = 12;
                            }
                            // set the time value in the path entries for predator approach, the 0.8 means they must go a little faster
                            // Predatorの接近スピードを設定 0.8はちょっと早い
                            var old_x = (LastLineTotalKeyTime * 0.8 * (stimulus_text.length / LastLineTotalCharCount) - 4000.0) / 1000.0;
                            var x = 0.8 * LastLineTotalKeyTime / LastLineTotalCharCount * (stimulus_text.length - 4) / 1000.0;
                            var y = 12 / TargetSpeed * (stimulus_text.length - 4);
                            if (x > y) x = y;
                            var obj = moving_image_ani_object["predatornormalani"].childNodes.item(5); // last path in predatornormalani
                            obj.setAttribute("data-tqani-period", (x).toString());
                            process_script("predatorappears_script", 0);
                        }
                    } else {
                        if (response_index >= predator_stop_count) {
                            predator_running = false;
                            predator_line = false;

                            process_script("predatormisses_script", 0);
                        }
                    }
                }

                do_step_key_static_image();
                do_step_key_moving_image();
                if (response_index == 0) {
                    lastkeytime = new Date().getTime();
                }
                if (IsKeypadLesson && c == "\r") {
                    c = " ";
                }
                response_text += c;
                response_index++;
                processkey(c, false, c);
            }
            // see how response and stimulus line match
            var MaxKeyinIndex = response_index - 1;
            if (MaxKeyinIndex < 0) {
                return;
            }
            match_resp_stim();
            stimline_setcolourat(stimulus_index);
            respline_addcharat(response_index);
            respline_setcolour(response_index);
            break;
        case "pairtest":

            if (playinghands || lastkey == null) {
                break;
            }
            var id;
            if (c == stimulus_text.charAt(stimulus_index)) {
                status_line.textContent = "";
                processkey(stimulus_text.charAt(stimulus_index), false, c);
                stimulus_index++;
                if (stimulus_index >= stimulus_text.length) {
                    unhighlight(c, prevkey, true);
                    for (var i = 0; i < LeftPairHands.length; i++) {
                        id = LeftPairHands[i].getAttribute("obj_id");
                        if (browser == 4) {
                            image_def_div[id].style.visibility = "hidden";
                        } else {
                            image_def_div[id].hidden = true;
                        }
                    }
                    for (var i = 0; i < RightPairHands.length; i++) {
                        id = RightPairHands[i].getAttribute("obj_id");
                        if (browser == 4) {
                            image_def_div[id].style.visibility = "hidden";
                        } else {
                            image_def_div[id].hidden = true;
                        }
                    }
                    hide_largekbd();
                    line_hide();
                    stimulus_text = "";
                    pair_test = false;
                    hide_lessonfields();
                    stoppairtestfield();

                    process_script(lesson_script, eval(lesson_item + 1).toString());
                    break;
                }
                var keytomatch = "";
                if (stimulus_index > 0) {
                    keytomatch = stimulus_text.charAt(stimulus_index - 1);
                    if (findkey(keytomatch, "name")) {}
                    if (findkey(keytomatch, "sname")) {} else if (findkey(keytomatch, "usdname")) {} else if (findkey(keytomatch, "usdsname")) {} else if (findkey(keytomatch, "sdname")) {} else if (findkey(keytomatch, "sdsname")) {} else if (findkey(keytomatch, "gagname")) {} else if (findkey(keytomatch, "gagsname")) {} else if (findkey(keytomatch, "gatname")) {} else if (findkey(keytomatch, "gatsname")) {} // add other qualifier keys here
                    prevkey = lastnormkey;
                    prevkeytomatch = lastkeytomatch;
                }
                keytomatch = stimulus_text.charAt(stimulus_index);
                var found = false;
                if (findkey(keytomatch, "name")) {
                    found = true;
                }
                if (findkey(keytomatch, "sname")) {
                    found = true;
                } else if (findkey(keytomatch, "usdname")) {
                    found = true;
                } else if (findkey(keytomatch, "usdsname")) {
                    found = true;
                } else if (findkey(keytomatch, "sdname")) {
                    found = true;
                } else if (findkey(keytomatch, "sdsname")) {
                    found = true;
                } else if (findkey(keytomatch, "gagname")) {
                    found = true;
                } else if (findkey(keytomatch, "gagsname")) {
                    found = true;
                } else if (findkey(keytomatch, "gatname")) {
                    found = true;
                } else if (findkey(keytomatch, "gatsname")) {
                    found = true;
                } // add other qualifier keys here
                highlight(keytomatch, prevkey, lastnormkey, true);
            } else {
                processkey(stimulus_text.charAt(stimulus_index), true, c);
            }
            break;
    }
    return false;
}



function keydown_handler(e) {
    var code, e_key;
    if (donelesson) {
        e.preventDefault();
        return false;
    }
    if (browser == 4) {
        code = window.event.keyCode;
        e_key = e.key;
    } else {
        code = e.keyCode;
        e_key = e.key;
    }
    if (cursordiv != null) {
        cursordiv.value = "";
    }
    if (pairfielddiv != null) {
        pairfielddiv.value = "";
    }
    //Log.info("keydown_code: "+e_key+":"+code);

    //	if(browser == 6){
    //		Log.info("229");
    //		code = e_key.charCodeAt(0);;
    //		Log.info("code :"+code);
    //	}


    if (code == 27) {
        //Log.info("esc pressed")
        if (steponesc) {
            steponesc = false;
            clearTimeout(esctimerid);

            process_script(esc_script, eval(esc_line + 1).toString());
        } else {
            // handle Escape key if possible
            if (playinghands) {
                skipPlayingHands();
            } else if (mapaniFlag) {
                skipMapAnimation();
            } else if (danceaniFlag) {
                skipDanceAnimation();
                danceaniFlag = false;

            }
        }
        return;
    }
    // return true in following block when scaling works
    if (code == 17 || code == 18) { // allow ctrl and alt based sequences through
        return false;
    }
    if (code == 16) {
        return true;
    }
    if (code > 127) {
        status_line.style.color = "red";
        status_line.textContent = static_turnoffhenkan;
    }
    switch (code) {
        case 8: // backspace
            if (lesson_type == "speed" || lesson_type == "numberspeed") {
                if (response_index > 0) {
                    response_index--;
                    response_text = response_text.substring(0, response_index);
                    respline_backspaceto(response_index);
                    match_resp_stim();
                    stimline_setcolourat(stimulus_index);
                    respline_setcolour(response_index);
                }
            }
            if (browser == 4) {
                window.event.keyCode = null;
            } else {}
            e.preventDefault();
            return false;
        default:
            break;
    }
    return true;
}

function show_allminikeys() {
    //Log.info("showallminikeys is loaded");
    try {
        if (ghostonly) {
            return;
        }
        //Log.info("minikeys: "+minikeys);
        var i;
        if (browser == 4) {
            image_def_div["mkEnter"].style.visibility = "visible";
            if (!IsKeypadLesson) {
                image_def_div["mkSpacebar"].style.visibility = "visible";
            }
            for (i = 0; i < minikeys.length; i++) {
                if (findkey(minikeys.charAt(i), "name")) {
                    image_def_div["mk" + mk_check(minikeys.charAt(i))].style.visibility = "visible";
                }
            }
            if (lshiftdiv != null) {
                lshiftdiv.style.visibility = "visible";
                rshiftdiv.style.visibility = "visible";
            }
            if (deaddiv != null) {
                deaddiv.style.visibility = "visible";
            }
            if (gagdiv != null) {
                gagdiv.style.visibility = "visible";
            }
            if (gatdiv != null) {
                gatdiv.style.visibility = "visible";
            }
            if (graltdiv != null) {
                graltdiv.style.visibility = "visible";
            }
        } else {
            image_def_div["mkEnter"].hidden = false;
            if (!IsKeypadLesson) {
                image_def_div["mkSpacebar"].hidden = false;
            }
            for (i = 0; i < minikeys.length; i++) {
                if (findkey(minikeys.charAt(i), "name")) {
                    image_def_div["mk" + mk_check(minikeys.charAt(i))].hidden = false;
                }
            }
            if (lshiftdiv != null) {
                lshiftdiv.hidden = false;
                rshiftdiv.hidden = false;
            }
            if (gagdiv != null) {
                gagdiv.hidden = false;
            }
            if (gatdiv != null) {
                gatdiv.hidden = false;
            }
            if (graltdiv != null) {
                graltdiv.hidden = false;
            }
            if (deaddiv != null) {
                deaddiv.hidden = false;
            }
        }
    } catch (e) {
        catchlog(e);
    }
}

function hide_allminikeys() {
    try {
        var i;
        if (ghostonly) {
            return;
        }
        //Log.info("minikeys: "+minikeys);
        if (browser == 4) {
            //Log.info(browser);
            image_def_div["mkEnter"].style.visibility = "hidden";
            if (!IsKeypadLesson) {
                image_def_div["mkSpacebar"].style.visibility = "hidden";
            }
            for (i = 0; i < minikeys.length; i++) {
                if (findkey(minikeys.charAt(i), "name")) {
                    image_def_div["mk" + mk_check(minikeys.charAt(i))].style.visibility = "hidden";
                }
            }
            if (lshiftdiv != null) {
                lshiftdiv.style.visibility = "hidden";
                rshiftdiv.style.visibility = "hidden";
            }
            if (deaddiv != null) {
                deaddiv.style.visibility = "hidden";
            }
            if (gagdiv != null) {
                gagdiv.style.visibility = "hidden";
            }
            if (gatdiv != null) {
                gatdiv.style.visibility = "hidden";
            }
            if (graltdiv != null) {
                graltdiv.style.visibility = "hidden";
            }
        } else {
            //Log.info(browser);
            image_def_div["mkEnter"].hidden = true;
            if (!IsKeypadLesson) {
                image_def_div["mkSpacebar"].hidden = true;
            }
            for (i = 0; i < minikeys.length; i++) {
                if (findkey(minikeys.charAt(i), "name")) {
                    image_def_div["mk" + mk_check(minikeys.charAt(i))].hidden = true;
                }
                //Log.info(minikeys.charAt(i));
            }
            if (lshiftdiv != null) {
                lshiftdiv.hidden = true;
                rshiftdiv.hidden = true;
            }
            if (deaddiv != null) {
                deaddiv.hidden = true;
            }
            if (gagdiv != null) {
                gagdiv.hidden = true;
            }
            if (gatdiv != null) {
                gatdiv.hidden = true;
            }
            if (graltdiv != null) {
                graltdiv.hidden = true;
            }
        }
    } catch (e) {
        catchlog(e);
    }
}


function show_minikbd() {
    if (browser == 4) {
        image_def_div["minikbd"].style.visibility = "visible";
        image_def_div["minikbd_s"].style.visibility = "hidden";
    } else {
        image_def_div["minikbd"].hidden = false;
        image_def_div["minikbd_s"].hidden = true;
    }
    minikbd_shown = true;
}

function show_minikbd_s() {
    if (browser == 4) {
        image_def_div["minikbd_s"].style.visibility = "visible";
        image_def_div["minikbd"].style.visibility = "hidden";
    } else {
        image_def_div["minikbd_s"].hidden = false;
        image_def_div["minikbd"].hidden = true;
    }
    minikbd_shown = true;
}


function hide_minikbd() {
    if (browser == 4) {
        image_def_div["minikbd"].style.visibility = "hidden";
        image_def_div["minikbd_s"].style.visibility = "hidden";
    } else {
        image_def_div["minikbd"].hidden = true;
        image_def_div["minikbd_s"].hidden = true;
    }
    minikbd_shown = false;
}


function show_largekbd() {
    if (browser == 4) {
        image_def_div["kbd"].style.visibility = "visible";
        image_def_div["kbd_s"].style.visibility = "hidden";
    } else {
        image_def_div["kbd"].hidden = false;
        image_def_div["kbd_s"].hidden = true;
    }
    largekbd_shown = true;

    //Log.info("largekbd_shown: "+largekbd_shown);
}

function show_largekbd_s() {
    if (browser == 4) {
        image_def_div["kbd"].style.visibility = "hidden";
        image_def_div["kbd_s"].style.visibility = "visible";
    } else {
        image_def_div["kbd"].hidden = true;
        image_def_div["kbd_s"].hidden = false;
    }
    largekbd_shown = true;
    //Log.info("largekbd_shown: "+largekbd_shown);
}


function hide_largekbd() {
    if (browser == 4) {
        image_def_div["kbd"].style.visibility = "hidden";
        image_def_div["kbd_s"].style.visibility = "hidden";
    } else {
        image_def_div["kbd"].hidden = true;
        image_def_div["kbd_s"].hidden = true;
    }
    largekbd_shown = false;
    //Log.info("largekbd_shown: "+largekbd_shown);
}



function hide_lessonfields() {
    if (ghostonly || LessonID.search("Intro") >= 0) {
        return;
    }
    if (minitimerid != null) {
        clearInterval(minitimerid);
        minitimerid = null;
    }
    hide_allminikeys();
    hide_minikbd();
    line_hide();
    speed_test = false;
    accuracy_test = false;
}

function show_lessonfields() {
    //Log.info("show_lessonfields");
    if (ghostonly) {
        return;
    }
    show_minikbd();
    line_show();
    show_allminikeys();
    if (IsTQP) {
        replace_signtext("lessonnameani", "lessonname", LessonHeader);
        replace_signtext("lessontypeani", "lessontype", LessonType);
        if (LessonTimeToComplete == null) {
            LessonTimeToComplete = static_timetocomplete;
            replace_signtext("lessontimeani", "lessontime", LessonTimeToComplete);
            if (IsTest) {
                LessonProgress = "";
            } else {
                LessonProgress = static_lessonprogress;
            }
            replace_signtext("lessonprogressani", "lessonprogress", LessonProgress);
        } else {
            replace_signtext("lessontimeani", "lessontime", LessonTimeToComplete);
            replace_signtext("lessonprogressani", "lessonprogress", LessonProgress);
        }
    } else if (planets_type) {
        replace_signtext("lessonprogressani", "lessonprogress", LessonProgress);
    }
}

function SpeedLineCalc() {
    // see how response and stimulus line match
    var MaxKeyinIndex = response_text.length - 1;
    var MaxStimIndex = stimulus_text.length - 1;
    var StimIndex;
    var KeyinIndex;
    var IsMatched = true;
    var i;
    var j;
    var s2;
    var currchar;
    LineStrokes = MaxKeyinIndex;
    LineErrors = 0;
    for (StimIndex = 0, KeyinIndex = 0; StimIndex <= MaxStimIndex; StimIndex++) {
        currchar = stimulus_text.charAt(StimIndex); //一文字ずつクロール
        if (response_text.charAt(KeyinIndex) == null)
            break;
        if (currchar == response_text.charAt(KeyinIndex)) { //練習テキストと入力テキストが一致
            KeyinIndex++;
            if (KeyinIndex > MaxKeyinIndex)
                break;
        } else {
            if (IsMatched) {
                // hit a bad spot
                IsMatched = false;
                // see if there is hope for a match later
                for (i = KeyinIndex; i <= MaxKeyinIndex; i++) {
                    s2 = response_text.substr(i, 3); //入力した文字から3文字抜き出す
                    j = stimulus_text.indexOf(s2, StimIndex); //3文字とクロールする1文字を比較し、一致した位置を返す
                    if (j > 0 && (j - StimIndex) < (s2.length * 3)) {
                        // there is a matching point
                        StimIndex = j - 1;
                        KeyinIndex = i;
                        IsMatched = true;
                        break;
                    } else { //3文字と一致しなかった場合 or 
                        if (recordkey[currchar] == null) {
                            recordkey[currchar] = new Object();
                            recordkey[currchar].symbol = currchar;
                            recordkey[currchar].inkeylist = false;
                            recordkey[currchar].errorcount = 0;
                            recordkey[currchar].strokecount = 0;
                            recordkey[currchar].keytime = 0;
                        }
                        var k = recordkey[currchar];
                        LineErrors++;
                        k.errorcount++;
                        totalerrcount++;
                        if (k.strokecount > 0) {
                            totalerrtime += k.keytime / k.strokecount;
                        }

                        if (CollectWeakWords) {
                            var thisword = GetCurrentWord();
                            if (thisword != "") {
                                var found = false;
                                for (var n = 0; n < TotalWeakCount; n++) {
                                    if (WeakWordList[n] == thisword) {
                                        found = true;
                                        break;
                                    }
                                }
                                if (!found) {
                                    WeakWordList[TotalWeakCount] = thisword;
                                    TotalWeakCount++;
                                }
                            }
                        }
                    }
                }
                if (!IsMatched) {
                    break;
                } else {}
            }
        }
    }
}

function match_resp_stim() {
    try {
        var MaxKeyinIndex = response_text.length - 1;
        var MaxStimIndex = stimulus_text.length - 1;
        var s = "";
        var StimIndex;
        var KeyinIndex;
        var IsMatched = true;
        var i;
        var j;
        var s2;
        var isbad = false;
        needscolour = new Array(100);
        for (StimIndex = 0, KeyinIndex = 0; StimIndex <= MaxStimIndex; StimIndex++) {
            if (stimulus_text.charAt(StimIndex) == response_text.charAt(KeyinIndex)) {
                s += stimulus_text.charAt(StimIndex);
                needscolour[s.length - 1] = isbad;
                KeyinIndex++;
                if (KeyinIndex > MaxKeyinIndex)
                    break;
            } else {
                if (IsMatched) {
                    // hit a bad spot
                    IsMatched = false;
                    //s += bad;
                    isbad = true;
                    // see if there is hope for a match later
                    for (i = KeyinIndex; i <= MaxKeyinIndex; i++) {
                        s2 = response_text.substr(i, 3);
                        j = stimulus_text.indexOf(s2, StimIndex);
                        if (j > 0 && (j - StimIndex) < (s2.length * 3)) {
                            // there is a matching point
                            StimIndex = j - 1;
                            KeyinIndex = i;
                            IsMatched = true;
                            isbad = false;
                            break;
                        } else {
                            s += response_text.charAt(i);
                            needscolour[s.length - 1] = isbad;
                        }
                    }
                    if (!IsMatched) {
                        break;
                    } else {}
                } else {
                    needscolour[s.length - 1] = isbad;
                }
            }
        }
        if (!IsMatched)
            i = StimIndex;
        else
            i = StimIndex + 1;
        stimulus_index = i;
    } catch (e) {
        catchlog(e);
    }
}

function StepAlt() {
    //Log.info("StepAlt is called");
    if (stimulus_index == 0) {
        lastkeytime = (new Date()).getTime();
    }
    stimulus_index++;
    if (currmapkey.IsDouble) {
        //Log.info("isdouble");
        stimulus_index++;
    }
    var istart = mapindex[stimulus_index];
    var s = mapunspacedtext;
    //Log.info("cursor="+String(stimulus_index) + "len="+String(s.length));
    //Log.info("istart="+String(istart));
    if (stimulus_index >= s.length) {
        // time to move to next script line
        LastLineTotalKeyTime = (new Date()).getTime() - line_start_time;
        LastLineTotalCharCount = stimulus_index;
        if (LineStrokes > 0) {
            if ((LineErrors / LineStrokes) < 0.5) {
                LastLineTotalKeyTime = (new Date()).getTime() - line_start_time;
                LastLineTotalCharCount = stimulus_index;
                StimulusCount += stimulus_index;
                LineTotKeyTime = 0;
                stimulus_index = 0;
                mapspaced_index = 0;
                hide_lessonfields();

                process_script(lesson_script, eval(lesson_item + 1).toString());
            } else {
                LineStrokes = 0;
                LineErrors = 0;
                stimulus_index = 0;
                response_index = 0;
                response_text = "";
                respline_clear();
                status_line.style.color = "black";
                status_line.textContent = static_toomany;
            }
        } else {
            LastLineTotalKeyTime = (new Date()).getTime() - line_start_time;
            LastLineTotalCharCount = stimulus_index;
            StimulusCount += stimulus_index;
            LineTotKeyTime = 0;
            stimulus_index = 0;
            mapspaced_index = 0;
            hide_lessonfields();

            process_script(lesson_script, eval(lesson_item + 1).toString());
        }
        return;
    }
    var i;
    mapspaced_index = istart;
    response_text = mapspacedtext.substring(0, istart);
    response_index = response_text.length;
    //Log.info("response_text="+response_text+". len="+String(response_index)+" char="+String(mapspacedtext.charCodeAt(response_index+1)));
    stimline_setcolourat(mapspaced_index);
    respline_setline(response_text);
    if ((response_index + 1) < mapspacedtext.length && mapspacedtext.charCodeAt(response_index + 1) != 32) {
        //Log.info("next is pair");
        currmapkey = mapkeylist[s.charAt(stimulus_index)];
        var i;
        for (i = 0; i < currmapkey.pairs.length; i++) {
            if (s.substr(stimulus_index, 2) == (currmapkey.pairs[i]).symbol) {
                currmapkey = (currmapkey.pairs[i]);
                //Log.info("found match");
                break;
            }
        }
    } else {
        currmapkey = mapkeylist[s.charAt(stimulus_index)];
    }
    currmapchars = "";
    //HighlightMaptextCurrChar();
    if (DoOtherSounds && currmapkey != null) {
        if (currmapkey.audio != null) {
            jsounds[currmapkey.audio] = play_audio_file(jsounds[currmapkey.audio], currmapkey.audio, null, true, DoControlSounds);
            //Log.info("sound1="+KbdSoundBase + "k-j/" + currmapkey.audio );
        } else {
            var c = currmapkey.letters[0].toLowerCase();
            jsounds[c] = play_audio_file(jsounds[c], c, null, true, DoControlSounds);
            //Log.info("sound2="+KbdSoundBase + "k-j/" + c);
        }
    }

    if (stimulus_index >= stimulus_text.length) {
        // time to move to next script line
        stimulus_index = 0;
        mapspaced_index = 0;
        hide_lessonfields();

        process_script(lesson_script, eval(lesson_item + 1).toString());
        return;
    }
}


function maptexttesttinp(e) {
    var c;
    var code = e.charCode;
    console.log("koko 2", code);
    if (code == null || code == 0) {
        code = e.keyCode;
        if (code == null) {
            code = e.which;
        }
    }
    if (cursordiv != null) {
        cursordiv.value = "";
    }
    var backspace = false;
    if (code < 32) {
        if (speed_test) {
            LastCapslockState = false;
            if (code == 13) {
                c = " ";
            } else {
                if (code != 8 || response_index == 0) { // only allow backspaces when not at line start
                    return;
                }
                backspace = true;
                c = "!"; //dummy value
            }
        } else {
            if (e.keyCode != 13) {
                lesson_beep = play_audio_file(lesson_beep, "beep", null, true, DoErrorBeep);
                e.preventDefault();
                return;
            }
            c = '\r';
        }
    } else {
        c = String.fromCharCode(code);
        var s = String.fromCharCode(e.keyCode || e.which);
        if (s.toUpperCase() === s && !e.shiftKey) {
            if (code >= 65 && code <= 90) {
                LastCapslockState = true;
            } else {
                LastCapslockState = false;
            }
        } else {
            LastCapslockState = false;
        }
    }
    //Log.info("maptextesttinp="+String(code)+" c="+c);
    var i = 0;
    var k;
    var source = stimulus_text;
    status_line.textContent = "";
    console.log("Exp2:" + stimulus_text.charAt(stimulus_index));
    c = c.toUpperCase();
    //minit.stop();
    if (currmapchars.length == 0) {
        if (maparray[stimulus_index].symbol == static_jjoin) {
            //Log.info("found っ");
            var nextmapkey = (maparray[stimulus_index + 1]);
            //Log.info("nextmap="+nextmapkey.symbol);
            var found = false;
            //Log.info("no double");
            for (k = 0; k < nextmapkey.letters.length; k++) {
                //Log.info("char="+c+" test="+nextmapkey.letters[k].charAt(0));
                if (s.toUpperCase() == nextmapkey.letters[k].charAt(0)) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                lesson_beep = play_audio_file(lesson_beep, "beep", null, true, DoErrorBeep);
                processkey(currmapkey.letters[0].substr(0, 1).toLowerCase(), true, c);
                e.preventDefault();
                //Log.info("returning3");
                return;
            }
            e.preventDefault();
            lookahead = c;
            StepAlt();
            return;
        }
        if (stimulus_index > 0 && maparray[stimulus_index - 1].symbol == static_jjoin) {
            //Log.info("found previous っ");
            if (s.toUpperCase() != lookahead.toUpperCase()) {
                if (DoErrorBeep) {
                    lesson_beep = play_audio_file(lesson_beep, "beep", null, true, DoErrorBeep);
                }
                processkey(currmapkey.letters[0].substr(0, 1).toLowerCase(), true, s);
                //stimulus_index--;
                e.preventDefault();
                //response_text = response_text.substr(0, response_text.length-1);
                //respline_setline(response_text);
                //Log.info("returning2");
                return;
            }
        }
        for (i = 0; i < currmapkey.letters.length; i++) {
            //Log.info("try="+currmapkey.letters[i].substr(0,1));
            //Log.info("c="+c);
            if (c == currmapkey.letters[i].substr(0, 1)) {
                //Log.info("match="+currmapkey.letters[i]);
                //Log.info("length="+String(String(currmapkey.letters[i]).length));
                if (String(currmapkey.letters[i]).length > 1) {
                    currmapchars = c;
                    //Log.info("returning");
                    e.preventDefault();
                    response_index++;
                    response_text = response_text + s.toUpperCase();
                    respline_setline(response_text);
                    processkey(s, false, s);
                    return;
                }
                //Log.info("break");
                break;
            }
        }
        //Log.info("end loop i="+String(i));
        if (i >= currmapkey.letters.length) {
            e.preventDefault();
            //Log.info("error 1");
            // Note an error on this character
            if (stimulus_index == 0)
                lastkeytime = new Date().getTime();
            if (DoErrorBeep) {
                lesson_beep = play_audio_file(lesson_beep, "beep", null, true, DoErrorBeep);
            }
            processkey(currmapkey.letters[0].substr(0, 1).toLowerCase(), true, s);
            //Log.info("returning2");
            return;
        }
        if (Boolean(usespan[stimulus_index])) {
            //Log.info("matched N");
            currmapchars = c;
            e.preventDefault();
            response_index++;
            response_text = response_text + c.toUpperCase();
            respline_setline(response_text);
            processkey(s, false, s);
            return;
        }
    } else {
        var s2 = (currmapchars + c).toUpperCase();
        var found = false;
        if (currmapchars == "nn" && c == "N") {
            for (i = 0; i < (maparray[stimulus_index + 1]).letters.length; i++) {
                //Log.info("check2="+String((maparray[stimulus_index+1]).letters[i]).charAt(0));
                if (String((maparray[stimulus_index + 1]).letters[i]).charAt(0) == c) {
                    StepAlt();
                    currmapchars = c.toLowerCase();
                    e.preventDefault();
                    response_index++;
                    response_text = response_text + c;
                    respline_setline(response_text);
                    processkey(s, false, s);
                    return;
                }
            }
        }
        if (Boolean(usespan[stimulus_index])) {
            //Log.info("check span");
            if (s2 == "NN") {
                //Log.info("got NN so far");
                for (i = 0; i < (maparray[stimulus_index + 1]).letters.length; i++) {
                    //Log.info("check="+String((maparray[stimulus_index+1]).letters[i]).charAt(0));
                    if (String((maparray[stimulus_index + 1]).letters[i]).charAt(0) == "N") {
                        currmapchars = s2.toLowerCase();
                        e.preventDefault();
                        response_index++;
                        response_text = response_text.substr(0, response_text.length - 1) + currmapkey.symbol;
                        //response_text = response_text+s.toUpperCase();
                        respline_setline(response_text);
                        processkey(s, false, s);
                        return;
                    }
                }
            } else if (s2 == "N'" || s2 == "XN") {
                //Log.info("let N' or XN finish");
            } else if (s2.length == 2) {
                //Log.info("could be first char of next symbol");
                for (i = 0; i < (maparray[stimulus_index + 1]).letters.length; i++) {
                    if (c == (maparray[stimulus_index + 1]).letters[i].substr(0, 1)) {
                        //Log.info("terminate single N");
                        StepAlt();
                        response_text = response_text.substr(0, response_text.length - 1) + currmapkey.symbol;
                        if (String((maparray[stimulus_index]).letters[i]).length > 1) {
                            //Log.info("this letter will need more letters");
                            currmapkey = (maparray[stimulus_index]);
                            currmapchars = c;
                            e.preventDefault();
                            response_index++;
                            response_text = response_text + c.toUpperCase();
                            respline_setline(response_text);
                            processkey(s, false, s);
                            return;
                        }
                        //Log.info("let this letter terminate");
                        currmapkey = (maparray[stimulus_index]);
                        currmapchars = "";
                        s2 = c;
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    //Log.info("not valid next symbol start, show error");
                    e.preventDefault();
                    // Note an error on this character
                    if (DoErrorBeep) {
                        lesson_beep = play_audio_file(lesson_beep, "beep", null, true, DoErrorBeep);
                    }
                    cursordiv.value = "";
                    processkey((maparray[stimulus_index + 1]).letters[0].substr(0, 1).toLowerCase(), true, s);
                    return;
                }
            } else {
                // must be of form NNx
                //Log.info("check for N with 2 chars of next symbol");
                var d = ("n" + c).toUpperCase();
                for (i = 0; i < (maparray[stimulus_index + 1]).letters.length; i++) {
                    if (d == (maparray[stimulus_index + 1]).letters[i].substr(0, 2)) {
                        //Log.info("terminate single N");
                        stimulus_index++;
                        stimline_setcolourat(stimulus_index);
                        response_text = response_text.substr(0, response_text.length - 1) + currmapkey.symbol;
                        if (String((maparray[stimulus_index]).letters[i]).length > 2) {
                            //Log.info("this letter will need more letters");
                            currmapchars = d.toLowerCase();
                            e.preventDefault();
                            response_index++;
                            response_text = response_text + c.toUpperCase();
                            respline_setline(response_text);
                            processkey(s, false, s);
                            return;
                        }
                        //Log.info("let this letter terminate");
                        currmapkey = (maparray[stimulus_index]);
                        currmapchars = "n";
                        s2 = ("n" + c).toUpperCase();
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    //Log.info("check for NN with 1 char of next symbol");
                    for (i = 0; i < (maparray[stimulus_index + 1]).letters.length; i++) {
                        if (c == (maparray[stimulus_index + 1]).letters[i].substr(0, 1)) {
                            //Log.info("terminate double N");
                            stimulus_index++;
                            stimline_setcolourat(stimulus_index);
                            if (String((maparray[stimulus_index]).letters[i]).length > 1) {
                                //Log.info("this letter will need more letters");
                                currmapkey = (maparray[stimulus_index]);
                                currmapchars = c;
                                e.preventDefault();
                                response_index++;
                                response_text = response_text + c.toUpperCase();
                                respline_setline(response_text);
                                processkey(s, false, s);
                                return;
                            }
                            //Log.info("let this letter terminate");
                            currmapkey = (maparray[stimulus_index]);
                            currmapchars = "";
                            s2 = c.toUpperCase();
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        //Log.info("not valid next symbol start, show error");
                        e.preventDefault();
                        // Note an error on this character
                        if (DoErrorBeep) {
                            lesson_beep = play_audio_file(lesson_beep, "beep", null, true, DoErrorBeep);
                        }
                        cursordiv.value = "";
                        processkey((maparray[stimulus_index + 1]).letters[0].substr(0, 1).toLowerCase(), true, s);
                        return;
                    }
                }
            }
        }
        var j = -1;
        cursordiv.value = "";
        for (i = 0; i < currmapkey.letters.length; i++) {
            if (String(currmapkey.letters[i]).length < s2.length)
                continue;
            if (s2 == currmapkey.letters[i].substr(0, s2.length)) {
                if (String(currmapkey.letters[i]).length > s2.length) {
                    currmapchars = s2;
                    e.preventDefault();
                    response_index++;
                    response_text = response_text + c;
                    respline_setline(response_text);
                    processkey(s, false, s);
                    return;
                }
                if (j == -1)
                    j = i;
                break;
            } else if (s2.substr(0, s2.length - 1) == currmapkey.letters[i].substr(0, s2.length - 1)) {
                if (j == -1)
                    j = i;
            }
        }
        if (j == -1) {
            j = 0;
        }
        if (i >= currmapkey.letters.length) {
            e.preventDefault();
            //Log.info("error 2");
            // Note an error on this character
            if (stimulus_index == 0)
                lastkeytime = new Date().getTime();
            if (DoErrorBeep) {
                lesson_beep = play_audio_file(lesson_beep, "beep", null, true, DoErrorBeep);
            }
            //Log.info("j="+String(j)+" map="+currmapkey.letters[j]+" s="+s);
            processkey(currmapkey.letters[j].substr(s2.length - 1, 1).toLowerCase(), true, s);
            return;
        }
    }
    // completed one foreign char, now move the graphics cursors along
    //Log.info("reached next char");
    e.preventDefault();
    processkey(s, false, s);
    StepAlt();
}

function altmaptexttesttinp(e) {
    var keyindone = false;
    var i, j, k;
    var source = altstimtext;
    status_line.textContent = "";
    var c;
    var code = e.charCode;
    console.log("koko 3", code);
    if (code == null || code == 0) {
        code = e.keyCode;
        if (code == null) {
            code = e.which;
        }
    }
    if (cursordiv != null) {
        cursordiv.value = "";
    }
    var backspace = false;
    if (code < 32) {
        if (speed_test) {
            LastCapslockState = false;
            if (code == 13) {
                c = " ";
            } else {
                if (code != 8 || response_index == 0) { // only allow backspaces when not at line start
                    return;
                }
                backspace = true;
                c = "!"; //dummy value
            }
        } else {
            if (e.keyCode != 13) {
                lesson_beep = play_audio_file(lesson_beep, "beep", null, true, DoErrorBeep);
                e.preventDefault();
                return;
            }
            c = '\r';
        }
    } else {
        c = String.fromCharCode(code);
        var s = String.fromCharCode(e.keyCode || e.which);
        if (s.toUpperCase() === s && !e.shiftKey) {
            if (code >= 65 && code <= 90) {
                LastCapslockState = true;
            } else {
                LastCapslockState = false;
            }
        } else {
            LastCapslockState = false;
        }
    }
    //Log.info("altmaptextesttinp="+String(code)+" c="+c);
    status_line.textContent = "";
    c = c.toUpperCase();
    e.preventDefault();
    if (c == " ") {
        //Log.info("hit space");
        //e.preventDefault();
        if (currmapkey == null) {
            //Log.info("matches null");
            if (stimulus_index >= source.length) {
                // time to move to next script line
                LastLineTotalKeyTime = (new Date()).getTime() - line_start_time;
                LastLineTotalCharCount = stimulus_index;
                if (LineStrokes > 0) {
                    if ((LineErrors / LineStrokes) < 0.5) {
                        LastLineTotalKeyTime = (new Date()).getTime() - line_start_time;
                        LastLineTotalCharCount = stimulus_index;
                        StimulusCount += stimulus_index;
                        LineTotKeyTime = 0;
                        stimulus_index = 0;
                        hide_lessonfields();

                        process_script(lesson_script, eval(lesson_item + 1).toString());
                    } else {
                        LineStrokes = 0;
                        LineErrors = 0;
                        stimulus_index = 0;
                        response_index = 0;
                        response_text = "";
                        respline_clear();
                        status_line.style.color = "black";
                        status_line.textContent = static_toomany;
                    }
                } else {
                    LastLineTotalKeyTime = (new Date()).getTime() - line_start_time;
                    LastLineTotalCharCount = stimulus_index;
                    StimulusCount += stimulus_index;
                    LineTotKeyTime = 0;
                    stimulus_index = 0;
                    hide_lessonfields();

                    process_script(lesson_script, eval(lesson_item + 1).toString());
                }
                return;
            } else {
                // replace current input line by kanji material
                //Log.info("replace input text by kanji");
                var sind = 0;
                var rind = 0;
                var stxt = altmaptext;
                var rtxt = altstimtext;
                while (sind < stimulus_index) {
                    //Log.info("auto="+stxt.substring(sind));
                    //Log.info("text="+rtxt.substring(rind));
                    rind = rtxt.indexOf("*", rind + 1);
                    sind = stxt.indexOf("*", sind + 1);
                }
                //Log.info("done");
                response_text = rtxt.substring(0, rind);
                respline_setline(response_text);
                kanjiindex = rind;
                otherindex = sind;
                keyindone = true;
            }
        } else {
            //Log.info("not null="+currmapkey.symbol);
            if (DoErrorBeep) {
                lesson_beep = play_audio_file(lesson_beep, "beep", null, true, DoErrorBeep);
            }
            processkey(currmapkey.letters[0].substr(0, 1).toLowerCase(), true, c);
            //Log.info("returning2");
            return;
        }
    } else {
        if (currmapkey == null || currmapkey.symbol == "*") {
            //e.preventDefault();
            //Log.info("error 1");
            // Note an error on this character
            if (stimulus_index == 0)
                lastkeytime = new Date().getTime();
            if (DoErrorBeep) {
                lesson_beep = play_audio_file(lesson_beep, "beep", null, true, DoErrorBeep);
            }
            processkey(" ", true, c);
            //Log.info("returning2");
            return;
        }


        if (currmapchars.length == 0) {
            if (maparray[stimulus_index] != null && maparray[stimulus_index].symbol == static_jjoin) {
                //Log.info("found っ");
                var nextmapkey = (maparray[stimulus_index + 1]);
                //Log.info("nextmap="+nextmapkey.symbol);
                var found = false;
                //Log.info("no double");
                for (k = 0; k < nextmapkey.letters.length; k++) {
                    //Log.info("char="+c+" test="+nextmapkey.letters[k].charAt(0));
                    if (c == nextmapkey.letters[k].charAt(0)) {
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    if (DoErrorBeep) {
                        lesson_beep = play_audio_file(lesson_beep, "beep", null, true, DoErrorBeep);
                    }
                    processkey(currmapkey.letters[0].substr(0, 1).toLowerCase(), true, c);
                    //e.preventDefault();
                    //Log.info("returning3");
                    return;
                }
                //lookahead = c;
                StepAltAlt(source);
                return;
            }
            /*
            if (stimulus_index > 0 && maparray[stimulus_index-1] != null && maparray[stimulus_index-1].symbol == static_jjoin) {
            //Log.info("found previous っ");
            if (c != lookahead) {
            if (DoErrorBeep) {
            lesson_beep = play_audio_file(lesson_beep, "beep", null, true, DoErrorBeep);
            }
            processkey(currmapkey.letters[0].substr(0,1).toLowerCase(), true, c);
            stimulus_index--;
            //e.preventDefault();
            //Log.info("returning2");
            return;
            } else {
            response_text = response_text+static_jjoin+"  ";
            respline_setline(response_text);
            }
            }
            */
            for (i = 0; i < currmapkey.letters.length; i++) {
                //Log.info("try="+currmapkey.letters[i].substr(0,1));
                //Log.info("c="+c);
                if (c == currmapkey.letters[i].substr(0, 1)) {
                    //Log.info("match="+currmapkey.letters[i]);
                    //Log.info("length="+String(String(currmapkey.letters[i]).length));
                    if (String(currmapkey.letters[i]).length > 1) {
                        currmapchars = c;
                        //Log.info("returning");
                        lastinline = response_text;
                        response_text = response_text + c;
                        respline_setline(response_text);
                        processkey(c, false, c);
                        return;
                    }
                    //Log.info("break");
                    break;
                }
            }
            //Log.info("end loop i="+String(i));
            if (i >= currmapkey.letters.length) {
                //e.preventDefault();
                //Log.info("error 1");
                // Note an error on this character
                if (stimulus_index == 0) {
                    lastkeytime = new Date().getTime();
                }
                if (DoErrorBeep) {
                    lesson_beep = play_audio_file(lesson_beep, "beep", null, true, DoErrorBeep);
                }
                processkey(currmapkey.letters[0].substr(0, 1).toLowerCase(), true, c);
                //Log.info("returning2");
                return;
            }
            if (Boolean(usespan[stimulus_index])) {
                //Log.info("matched N");
                currmapchars = c;
                lastinline = response_text;
                response_text = response_text + c;
                respline_setline(response_text);
                processkey(c, false, c);
                return;
            }
        } else {
            var s2 = (currmapchars + c).toUpperCase();
            var found = false;
            if (currmapchars == "nn" && c == "N") {
                for (i = 0; i < (maparray[stimulus_index + 1]).letters.length; i++) {
                    //Log.info("check2="+String((maparray[stimulus_index+1]).letters[i]).charAt(0));
                    if (String((maparray[stimulus_index + 1]).letters[i]).charAt(0) == c) {
                        StepAltAlt();
                        currmapchars = c.toLowerCase();
                        response_index++;
                        response_text = response_text + c;
                        respline_setline(response_text);
                        processkey(s, false, s);
                        return;
                    }
                }
            }
            if (Boolean(usespan[stimulus_index])) {
                //Log.info("check span");
                if (s2 == "NN") {
                    //Log.info("got NN so far");
                    for (i = 0; i < (maparray[stimulus_index + 1]).letters.length; i++) {
                        //Log.info("check="+String((maparray[stimulus_index+1]).letters[i]).charAt(0));
                        if (String((maparray[stimulus_index + 1]).letters[i]).charAt(0) == "N") {
                            currmapchars = s2.toLowerCase();
                            lastinline = response_text;
                            response_text = response_text.substr(0, response_text.length - 1) + currmapkey.symbol;
                            //response_text = response_text+c;
                            respline_setline(response_text);
                            processkey(c, false, c);
                            return;
                        }
                    }
                } else if (s2 == "N'" || s2 == "XN") {
                    //Log.info("let N' or XN finish");
                } else if (s2.length == 2) {
                    //Log.info("could be first char of next symbol");
                    for (i = 0; i < (maparray[stimulus_index + 1]).letters.length; i++) {
                        if (c == (maparray[stimulus_index + 1]).letters[i].substr(0, 1)) {
                            //Log.info("terminate single N");
                            stimulus_index++;
                            response_text = response_text.substr(0, response_text.length - 1) + currmapkey.symbol;
                            if (String((maparray[stimulus_index]).letters[i]).length > 1) {
                                //Log.info("this letter will need more letters");
                                currmapkey = (maparray[stimulus_index]);
                                currmapchars = c;
                                lastinline = response_text;
                                response_text = response_text + currmapchars;
                                respline_setline(response_text);
                                processkey(c, false, c);
                                return;
                            }
                            //Log.info("let this letter terminate");
                            currmapkey = (maparray[stimulus_index]);
                            currmapchars = "";
                            s2 = c;
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        //Log.info("not valid next symbol start, show error");
                        //e.preventDefault();
                        // Note an error on this character
                        if (DoErrorBeep) {
                            lesson_beep = play_audio_file(lesson_beep, "beep", null, true, DoErrorBeep);
                        }
                        processkey((maparray[stimulus_index + 1]).letters[0].substr(0, 1).toLowerCase(), true, c);
                        return;
                    }
                } else {
                    // must be of form NNx
                    //Log.info("check for N with 2 chars of next symbol");
                    var d = ("n" + c).toUpperCase();
                    for (i = 0; i < (maparray[stimulus_index + 1]).letters.length; i++) {
                        if (d == (maparray[stimulus_index + 1]).letters[i].substr(0, 2)) {
                            //Log.info("terminate single N");
                            stimulus_index++;
                            response_text = response_text.substr(0, response_text.length - 1) + currmapkey.symbol;
                            if (String((maparray[stimulus_index]).letters[i]).length > 2) {
                                //Log.info("this letter will need more letters");
                                currmapchars = d.toLowerCase();
                                lastinline = response_text;
                                response_text = response_text + currmapchars;
                                respline_setline(response_text);
                                processkey(c, false, c);
                                return;
                            }
                            //Log.info("let this letter terminate");
                            currmapkey = (maparray[stimulus_index]);
                            currmapchars = "";
                            s2 = ("n" + c).toUpperCase();
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        //Log.info("check for NN with 1 char of next symbol");
                        for (i = 0; i < (maparray[stimulus_index + 1]).letters.length; i++) {
                            if (c == (maparray[stimulus_index + 1]).letters[i].substr(0, 1)) {
                                //Log.info("terminate double N");
                                stimulus_index++;
                                if (String((maparray[stimulus_index]).letters[i]).length > 1) {
                                    //Log.info("this letter will need more letters");
                                    currmapkey = (maparray[stimulus_index]);
                                    currmapchars = c;
                                    lastinline = response_text;
                                    response_text = response_text + currmapchars;
                                    respline_setline(response_text);
                                    processkey(c, false, c);
                                    return;
                                }
                                //Log.info("let this letter terminate");
                                currmapkey = (maparray[stimulus_index]);
                                currmapchars = "";
                                s2 = c.toUpperCase();
                                found = true;
                                break;
                            }
                        }
                        if (!found) {
                            //Log.info("not valid next symbol start, show error");
                            //e.preventDefault();
                            // Note an error on this character
                            if (DoErrorBeep) {
                                lesson_beep = play_audio_file(lesson_beep, "beep", null, true, DoErrorBeep);
                            }
                            processkey((maparray[stimulus_index + 1]).letters[0].substr(0, 1).toLowerCase(), true, c);
                            return;
                        }
                    }
                }
            }
            j = -1;
            for (i = 0; i < currmapkey.letters.length; i++) {
                //Log.info("i="+String(i)+" map="+currmapkey.letters[i]+" s="+s);
                if (String(currmapkey.letters[i]).length < s2.length) {
                    //Log.info("1");
                    continue;
                }
                //Log.info("2");
                if (s2 == currmapkey.letters[i].substr(0, s2.length)) {
                    //Log.info("3");
                    if (String(currmapkey.letters[i]).length > s2.length) {
                        currmapchars = s2;
                        lastinline = response_text;
                        response_text = response_text + c;
                        respline_setline(response_text);
                        processkey(c, false, c);
                        return;
                    }
                    if (j == -1)
                        j = i;
                    break;
                } else if (s2.substr(0, s2.length - 1) == currmapkey.letters[i].substr(0, s2.length - 1)) {
                    //Log.info("4");
                    if (j == -1)
                        j = i;
                }
            }
            //Log.info("5");
            if (j == -1)
                j = 0;
            if (i >= currmapkey.letters.length) {
                //e.preventDefault();
                //Log.info("error 2");
                // Note an error on this character
                if (stimulus_index == 0)
                    lastkeytime = new Date().getTime();
                if (DoErrorBeep) {
                    lesson_beep = play_audio_file(lesson_beep, "beep", null, true, DoErrorBeep);
                }
                //Log.info("i="+String(i)+" j="+String(j)+" map="+currmapkey.letters[j]+" s="+s+".");
                processkey(currmapkey.letters[j].substr(s.length - 1, 1).toLowerCase(), true, c);
                return;
            }
        }
    }
    // completed one foreign char, now move the graphics cursors along
    //Log.info("reached next char");
    //e.preventDefault();
    processkey(c, false, c);
    StepAltAlt(source);
    return;

}

function StepAltAlt(source) {
    if (stimulus_index == 0)
        lastkeytime = new Date().getTime();
    stimulus_index++;
    if (currmapkey != null && currmapkey.IsDouble) {
        //Log.info("isdouble");
        stimulus_index++;
    }
    var istart = mapindex[stimulus_index];
    var s = altmaptext;
    //Log.info("cursor="+String(stimulus_index) + "len="+String(s.length));
    //Log.info("istart="+String(istart));
    response_text = altstimtext.substring(0, kanjiindex) + s.substring(otherindex, stimulus_index);
    respline_setline(response_text);
    currmapkey = maparray[stimulus_index];
    if (currmapkey != null && currmapkey.symbol != null) {
        //Log.info("selected maparray="+currmapkey.symbol);
    } else {
        //Log.info("selected maparray="+"null");
    }
    currmapchars = "";
    if (stimulus_index >= altmaptext.length) {
        // time to move to next script line
        LastLineTotalKeyTime = (new Date()).getTime() - line_start_time;
        LastLineTotalCharCount = stimulus_index;
        if (LineStrokes > 0) {
            if ((LineErrors / LineStrokes) < 0.5) {
                LastLineTotalKeyTime = (new Date()).getTime() - line_start_time;
                LastLineTotalCharCount = stimulus_index;
                StimulusCount += stimulus_index;
                LineTotKeyTime = 0;
                stimulus_index = 0;
                hide_lessonfields();

                process_script(lesson_script, eval(lesson_item + 1).toString());
            } else {
                LineStrokes = 0;
                LineErrors = 0;
                stimulus_index = 0;
                response_index = 0;
                response_text = "";
                respline_clear();
                status_line.style.color = "black";
                status_line.textContent = static_toomany;
            }
        } else {
            LastLineTotalKeyTime = (new Date()).getTime() - line_start_time;
            LastLineTotalCharCount = stimulus_index;
            StimulusCount += stimulus_index;
            LineTotKeyTime = 0;
            stimulus_index = 0;
            hide_lessonfields();

            process_script(lesson_script, eval(lesson_item + 1).toString());
        }
        return;
    }
}

var pairfielddiv = null;

function makecursor() {
    cursordiv = document.getElementById("cursordiv");
    cursordiv.style.position = "absolute";
    cursordiv.style.top = 0;
    cursordiv.style.left = 0;
    cursordiv.style.zIndex = 11000;
    cursordiv.style.width = "640px";
    cursordiv.style.height = "480px";
    cursordiv.style.backgroundColor = "transparent";
    cursordiv.style.outline = "none";
    cursordiv.style.border = "none";
    if (LessonID.search("Intro") >= 0) {
        cursordiv.contentEditable = "false";
        if (browser == 4) {
            cursordiv.style.visibility = "hidden";
        } else {
            cursordiv.hidden = true;
        }
    } else {
        cursordiv.contentEditable = "true";
    }
    cursordiv.spellcheck = false;
    cursordiv.rows = 1;
    cursordiv.tabIndex = 0;
    cursorcanvas = document.createElement("canvas");
    cursorcanvas.top = 0;
    cursorcanvas.left = 0;
    cursorcanvas.width = 640;
    cursorcanvas.height = 480;
    cursorcontext = cursorcanvas.getContext("2d");
    cursorcontext.font = "1px " + font_name;
    cursorcontext.fillStyle = "#" + font_fore_colour;
    cursordiv.appendChild(cursorcanvas);
    cursordiv.focus();
}

function startpairtestfield() {
    show_largekbd();
    if (cursordiv == null) {
        makecursor();
    }
    cursordiv.style.top = "0px";
    cursordiv.style.left = "0px";
    cursordiv.style.width = "640px";
    cursordiv.style.height = "480px";
    //cursordiv.type = "hidden";
    cursordiv.value = "";
    cursorcanvas.top = 0;
    cursorcanvas.left = 0;
    cursorcanvas.width = 640;
    cursorcanvas.height = 480;
    cursorcontext.font = "1px " + font_name;
    cursordiv.focus();
    status_line.textContent = "";
}

function stoppairtestfield() {}


function PrepareRemedialPairTest() {
    var i = 0;
    var maxerror = 0;
    var ti = "";
    worstkey = "";
    prevworstkey = "";
    var k;
    var z;
    for (z = 32; z < 127; z++) {
        k = recordkey[String.fromCharCode(z)];
        if (k != null) {
            if (k.symbol == " ") {
                continue;
            }
            if (k.errorcount > maxerror) {
                prevworstkey = worstkey;
                maxerror = k.errorcount;
                worstkey = k.symbol;
            }
        }
    }
    if (worstkey != "") {
        if (prevworstkey == "") {
            var key = worstkey;
            if (findkey(key, "name")) {
                prevworstkey = lastkey.getAttribute("pairpal");
            } else if (findkey(key, "sname")) {
                prevworstkey = lastkey.getAttribute("pairpal");
            } else if (findkey(key, "usdname")) {
                prevworstkey = lastkey.getAttribute("pairpal");
            } else if (findkey(key, "usdsname")) {
                prevworstkey = lastkey.getAttribute("pairpal");
            } else if (findkey(key, "sdname")) {
                prevworstkey = lastkey.getAttribute("pairpal");
            } else if (findkey(key, "sdsname")) {
                prevworstkey = lastkey.getAttribute("pairpal");
            } else if (findkey(key, "gagname")) {
                prevworstkey = lastkey.getAttribute("pairpal");
            } else if (findkey(key, "gagsname")) {
                prevworstkey = lastkey.getAttribute("pairpal");
            } else if (findkey(key, "gatname")) {
                prevworstkey = lastkey.getAttribute("pairpal");
            } else if (findkey(key, "gatsname")) {
                prevworstkey = lastkey.getAttribute("pairpal");
            } else { // add other modifiers here
                prevworstkey = "f";
            }
        }
        ti = worstkey + prevworstkey;
        return ti;
    } else {
        return "";
    }
}

function PrepareWeakTest(offset) {
    try {
        var i = 0;

        var s = "";
        if (TotalWeakCount <= 0) {
            return 0;
        }
        var p;
        for (i = offset; i < TotalWeakCount; i++) {
            if (s == "") {
                s = WeakWordList[i];
            } else {
                s += " " + WeakWordList[i];
            }
            if (s.length >= 40) {
                break;
            }
        }
        offset = i + 1;
        if (s == "") {
            return 0;
        }
        stimulus_text = s;
        return i + 1;

    } catch (e) {
        catchlog(e);
    }
}

function KeyToString(key) {
    var ts = "";
    if (key == null || key == "")
        if (UseEnterKey)
            ts = static_theenter;
        else
            ts = static_thespacebar;
    else if (key == " ")
        ts = static_thespacebar;
    else if (key == '\r')
        ts = static_theenter;
    else if (findkey(key, "name")) {
        ts = static_the + key;
    } else if (findkey(key, "sname")) {
        if (lastkey.getAttribute("hand_side") == "left") {
            ts = static_rshift + lastkey.getAttribute("name");
        } else {
            ts = static_lshift + lastkey.getAttribute("name");
        }
    } else if (findkey(key, "usdname")) {
        var matchkey = lastkey;
        var deadkey = lastnormkey.getAttribute("usdeadkey");
        ts = static_the + deadkey + static_keythen + matchkey.getAttribute("name") + static_term;
    } else if (findkey(key, "usdsname")) {

    } else if (findkey(key, "sdname")) {
        var matchkey = lastkey;
        var deadkey = lastnormkey.getAttribute("sdeadkey");
        findkey(deadkey, "sname");
        ts = static_lshift + lastkey.getAttribute("name") + static_keythen + matchkey.getAttribute("name") + static_term;
    } else if (findkey(key, "sdsname")) {

    } else if (findkey(key, "gagname")) {

    } else if (findkey(key, "gagsname")) {

    } else if (findkey(key, "gatname")) {

    } else if (findkey(key, "gatsname")) {

    } // add other modifiers here
    return ts;
}

function GetCurrentWord() {
    var source = stimulus_text;
    if (source.charAt(stimulus_index) == ' ') {
        return "";
    }
    var i = stimulus_index;
    while (i > 0 && source.charAt(i) != ' ') i--;
    if (i != 0) {
        i++;
    }
    var start = i;
    i = stimulus_index;
    while (i < source.length && source.charAt(i) != ' ') {
        i++;
    }
    return source.substring(start, i);
}

function CreateAltMapTextChoices(ti, tialt) {
    var i, j, k, ii;
    var pairi = -1;
    var lastcount = 0;
    var s = tialt;

    kanjiindex = 0;
    otherindex = 0;
    altstimtext = ti;
    altmaptext = tialt;
    Log.info("start CreateAltMapTextChoices");
    for (i = 0; i < s.length; i++) {
        var maxlen = 0;
        var c = s.charAt(i);
        var mapkey = mapkeylist[c];
        //Log.info("c="+c+" i="+String(i));
        if (mapkey == null) {
            //Log.info("nomap");
            maparray[i] = null;
            usespan[i] = false;
            continue;
        }
        pairi = -1;
        if (mapkey.pairs != null) {
            for (k = 0; k < mapkey.pairs.length; k++) {
                if (s.substring(i, i + 2) == (mapkey.pairs[k]).symbol) {
                    pairi = k;
                    c = (mapkey.pairs[k]).symbol;
                    break;
                }
            }
        }
        var tmapkey;
        ii = i;
        if (pairi >= 0) {
            //Log.info("pairs");
            tmapkey = (mapkey.pairs[pairi]);
            maparray[i] = tmapkey;
            usespan[i] = false;
            i++;
            maparray[i] = tmapkey;
            usespan[i] = false;
        } else {
            //Log.info("nopairs");
            tmapkey = mapkey;
            if (tmapkey.symbol == static_jjoin) {
                //Log.info("is っ");
                var nextmapkey = mapkeylist[s.charAt(i + 1)];
                if (nextmapkey != null) {
                    //Log.info("next is "+nextmapkey.symbol);
                    var lets = new Array();
                    var letcount = 0;
                    var l;
                    for (k = 0; k < nextmapkey.letters.length; k++) {
                        //Log.info("next romaji is "+nextmapkey.letters[k]);
                        for (l = 0; l < letcount; l++) {
                            if (lets[l] == nextmapkey.letters[k].charAt(0))
                                break;
                        }
                        if (l >= letcount) {
                            lets[letcount] = nextmapkey.letters[k].charAt(0);
                            letcount++;
                        }
                    }
                    for (k = 0; k < letcount; k++) {
                        //Log.info("next first is "+lets[k]);
                        tmapkey.letters[k] = lets[k];
                    }
                    for (; k < 4; k++) {
                        tmapkey.letters[k] = "";
                    }
                }
            }
            maparray[i] = tmapkey;
            usespan[i] = false;
        }
        //Log.info("c="+c);
        if (ii > 0 && maparray[ii - 1] != null && (maparray[ii - 1]).symbol == "ん") {
            usespan[ii - 1] = true;
            //Log.info("usespan set="+(maparray[ii-1]).symbol);
        }
    }
    currmapkey = (maparray[0]);
    currmapchars = "";
}

function CreateMapTextChoices(ti) {
    //Log.info("CreateMapTextChoices("+ti+") is called");

    //	if(ti.length>15){
    //		font_size = 35 - ti.length;
    //	}

    var i, j, k, ii;
    var pairi = -1;
    var lastcount = 0;
    var s = ti;
    var spaces = "                   ";
    var pre = ""; // "<font face='"+FontName+"'>";
    var pend = ""; // "</font>";
    if (Mapadiv != null) {
        try {
            Mapadiv.removeChild(Mapacanvas);
            draw_region.removeChild(Mapadiv);
        } catch (e) {}
    }
    Mapadiv = document.createElement("div");
    Mapadiv.style.position = "absolute";
    if (IsTQP) {
        Mapadiv.style.top = "101px";
        Mapadiv.style.left = "32px";
    } else {
        Mapadiv.style.top = "21px";
        Mapadiv.style.left = "32px";
    }
    Mapadiv.style.zIndex = 10000;
    Mapadiv.style.width = "600px";
    Mapadiv.style.height = (font_size_int + 17).toString() + "px"; // padding of 5 top 5 bottom
    if (browser == 4) {
        Mapadiv.style.visibility = "hidden";
    } else {
        Mapadiv.hidden = true;
    }
    Mapadiv.style.backgroundColor = "#" + font_back_colour;
    Mapacanvas = document.createElement("canvas");
    Mapacanvas.width = 600;
    Mapacanvas.height = font_size_int + 17;
    Mapacontext = Mapacanvas.getContext("2d");
    Mapacontext.font = font_size + "px " + font_name;
    Mapacontext.fillStyle = "#" + font_fore_colour;
    Mapadiv.appendChild(Mapacanvas);
    draw_region.appendChild(Mapadiv);

    if (Mapjdiv != null) {
        try {
            Mapjdiv.removeChild(Mapjcanvas);
            draw_region.removeChild(Mapjdiv);
        } catch (e) {}
    }
    Mapjdiv = document.createElement("div");
    Mapjdiv.style.position = "absolute";
    if (IsTQP) {
        Mapjdiv.style.top = "101px";
        Mapjdiv.style.left = "32px";
    } else {
        Mapjdiv.style.top = "21px";
        Mapjdiv.style.left = "32px";
    }
    Mapjdiv.style.zIndex = 10000;
    Mapjdiv.style.width = "600px";
    Mapjdiv.style.height = (font_size_int + 17).toString() + "px"; // padding of 5 top 5 bottom
    if (browser == 4) {
        Mapjdiv.style.visibility = "hidden";
    } else {
        Mapjdiv.hidden = true;
    }
    Mapjdiv.style.backgroundColor = "#" + font_back_colour;
    Mapjcanvas = document.createElement("canvas");
    Mapjcanvas.width = 600;
    Mapjcanvas.height = font_size_int + 17;
    Mapjcontext = Mapjcanvas.getContext("2d");
    Mapjcontext.font = font_size + "px " + font_name;
    Mapjcontext.fillStyle = "#" + font_fore_colour;
    Mapjdiv.appendChild(Mapjcanvas);
    draw_region.appendChild(Mapjdiv);

    if (Map1div != null) {
        try {
            Map1div.removeChild(Map1canvas);
            draw_region.removeChild(Map1div);
        } catch (e) {}
    }
    Map1div = document.createElement("div");
    Map1div.style.position = "absolute";
    if (IsTQP) {
        Map1div.style.top = "214px"; //218
        Map1div.style.left = "32px";
    } else {
        Map1div.style.top = "214px"; //218
        Map1div.style.left = "32px";
    }
    Map1div.style.zIndex = 10000;
    Map1div.style.width = "600px";
    Map1div.style.height = (font_size_int + 17).toString() + "px"; // padding of 5 top 5 bottom
    if (browser == 4) {
        Map1div.style.visibility = "hidden";
    } else {
        Map1div.hidden = true;
    }
    if (font_fore_colour != font_back_colour) {
        Map1div.style.backgroundColor = "#" + font_back_colour;
    }
    Map1canvas = document.createElement("canvas");
    Map1canvas.width = 600;
    Map1canvas.height = font_size_int + 17;
    Map1context = Map1canvas.getContext("2d");
    Map1context.font = font_size + "px " + font_name;
    Map1context.fillStyle = "#" + font_fore_colour;
    Map1div.appendChild(Map1canvas);
    draw_region.appendChild(Map1div);

    if (Map2div != null) {
        try {
            Map2div.removeChild(Map2canvas);
            draw_region.removeChild(Map2div);
        } catch (e) {}
    }
    Map2div = document.createElement("div");
    Map2div.style.position = "absolute";
    if (IsTQP) {
        Map2div.style.top = "243px";
        Map2div.style.left = "32px";
    } else {
        Map2div.style.top = "243px";
        Map2div.style.left = "32px";
    }
    Map2div.style.zIndex = 10000;
    Map2div.style.width = "600px";
    Map2div.style.height = (font_size_int + 17).toString() + "px"; // padding of 5 top 5 bottom
    if (browser == 4) {
        Map2div.style.visibility = "hidden";
    } else {
        Map2div.hidden = true;
    }
    if (font_fore_colour != font_back_colour) {
        Map2div.style.backgroundColor = "#" + font_back_colour;
    }
    Map2canvas = document.createElement("canvas");
    Map2canvas.width = 600;
    Map2canvas.height = font_size_int + 17;
    Map2context = Map2canvas.getContext("2d");
    Map2context.font = font_size + "px " + font_name;
    Map2context.fillStyle = "#" + font_fore_colour;
    Map2div.appendChild(Map2canvas);
    draw_region.appendChild(Map2div);

    if (Map3div != null) {
        try {
            Map3div.removeChild(Map3canvas);
            draw_region.removeChild(Map3div);
        } catch (e) {}
    }
    Map3div = document.createElement("div");
    Map3div.style.position = "absolute";
    if (IsTQP) {
        Map3div.style.top = "268px";
        Map3div.style.left = "32px";
    } else {
        Map3div.style.top = "268px";
        Map3div.style.left = "32px";
    }
    Map3div.style.zIndex = 10000;
    Map3div.style.width = "600px";
    Map3div.style.height = (font_size_int + 17).toString() + "px"; // padding of 5 top 5 bottom
    if (browser == 4) {
        Map3div.style.visibility = "hidden";
    } else {
        Map3div.hidden = true;
    }
    if (font_fore_colour != font_back_colour) {
        Map3div.style.backgroundColor = "#" + font_back_colour;
    }
    Map3canvas = document.createElement("canvas");
    Map3canvas.width = 600;
    Map3canvas.height = font_size_int + 17;
    Map3context = Map3canvas.getContext("2d");
    Map3context.font = font_size + "px " + font_name;
    Map3context.fillStyle = "#" + font_fore_colour;
    Map3div.appendChild(Map3canvas);
    draw_region.appendChild(Map3div);

    if (Map4div != null) {
        try {
            Map4div.removeChild(Map4canvas);
            draw_region.removeChild(Map4div);
        } catch (e) {}
    }
    Map4div = document.createElement("div");
    Map4div.style.position = "absolute";
    if (IsTQP) {
        Map4div.style.top = "293px";
        Map4div.style.left = "32px";
    } else {
        Map4div.style.top = "293px";
        Map4div.style.left = "32px";
    }
    Map4div.style.zIndex = 10000;
    Map4div.style.width = "600px";
    Map4div.style.height = (font_size_int + 17).toString() + "px"; // padding of 5 top 5 bottom
    if (browser == 4) {
        Map4div.style.visibility = "hidden";
    } else {
        Map4div.hidden = true;
    }
    if (font_fore_colour != font_back_colour) {
        Map4div.style.backgroundColor = "#" + font_back_colour;
    }
    Map4canvas = document.createElement("canvas");
    Map4canvas.width = 600;
    Map4canvas.height = font_size_int + 17;
    Map4context = Map4canvas.getContext("2d");
    Map4context.font = font_size + "px " + font_name;
    Map4context.fillStyle = "#" + font_fore_colour;
    Map4div.appendChild(Map4canvas);
    draw_region.appendChild(Map4div);

    //等幅フォントかのチェック
    var mtr;
    mtr = Mapacontext.measureText("A");
    var awidth;
    awidth = mtr.width;
    mtr = Mapacontext.measureText(" ");
    var swidth;
    swidth = mtr.width;
    if (swidth != awidth) {
        font_name = 'monospace';
        //alert(static_notfixedpitch);
        //return;
    }

    var jspacewidth = awidth;
    text = "";
    Log.info("start CreateMapTextChoices");
    var
    let;
    var maxw = 1;
    var Map1text = "";
    var Map2text = "";
    var Map3text = "";
    var Map4text = "";
    var ss = "";
    mapunspacedtext = s;
    mapspaced_index = 0;
    for (i = 0; i < s.length; i++) {
        var maxlen = 0;
        var c = s.charAt(i);
        var mapkey = mapkeylist[c];
        if (mapkey == null) {
            continue;
        }
        pairi = -1;
        if (mapkey.pairs != null) {
            for (k = 0; k < mapkey.pairs.length; k++) {
                if (s.substring(i, i + 2) == (mapkey.pairs[k]).symbol) {
                    pairi = k;
                    c = (mapkey.pairs[k]).symbol;
                    break;
                }
            }
        }
        var tmapkey;
        ii = i;
        if (pairi >= 0) {
            tmapkey = (mapkey.pairs[pairi]);
            maparray[i] = tmapkey;
            usespan[i] = false;
            i++;
            maparray[i] = tmapkey;
            usespan[i] = false;
        } else {
            tmapkey = mapkey;
            if (tmapkey.symbol == static_jjoin) {
                var nextmapkey = mapkeylist[s.charAt(i + 1)];
                if (nextmapkey != null) {
                    var lets = new Array();
                    var letcount = 0;
                    var l;
                    for (k = 0; k < nextmapkey.letters.length; k++) {
                        for (l = 0; l < letcount; l++) {
                            if (lets[l] == nextmapkey.letters[k].charAt(0))
                                break;
                        }
                        if (l >= letcount) {
                            lets[letcount] = nextmapkey.letters[k].charAt(0);
                            letcount++;
                        }
                    }
                    for (k = 0; k < letcount; k++) {
                        tmapkey.letters[k] = lets[k];
                    }
                    for (; k < 4; k++) {
                        tmapkey.letters[k] = "";
                    }
                }
            }
            maparray[i] = tmapkey;
            usespan[i] = false;
        }
        if (ii > 0 && (maparray[ii - 1]).symbol == "ん") {
            usespan[ii - 1] = true;
        }
        for (k = 0; k < tmapkey.letters.length; k++) {
            let = tmapkey.letters[k];
            if (let.length > maxw) {
                maxw =
                    let.length;
            }
        }
        var t = (tmapkey.letters[0]).length;
        Map1text = pre + Map1text + tmapkey.letters[0] + spaces.substr(0, maxw + 2 - String(tmapkey.letters[0]).length) + pend;
        if (tmapkey.letters.length > 1) {
            Map2text = pre + Map2text + tmapkey.letters[1] + spaces.substr(0, maxw + 2 - String(tmapkey.letters[1]).length) + pend;
        } else {
            Map2text = pre + Map2text + spaces.substr(0, maxw + 2) + pend;
        }
        if (tmapkey.letters.length > 2) {
            Map3text = pre + Map3text + tmapkey.letters[2] + spaces.substr(0, maxw + 2 - String(tmapkey.letters[2]).length) + pend;
        } else {
            Map3text = pre + Map3text + spaces.substr(0, maxw + 2) + pend;
        }
        if (tmapkey.letters.length > 3) {
            Map4text = pre + Map4text + tmapkey.letters[3] + spaces.substr(0, maxw + 2 - String(tmapkey.letters[3]).length) + pend;
        } else {
            Map4text = pre + Map4text + spaces.substr(0, maxw + 2) + pend;
        }
        mtr = Mapjcontext.measureText(c);
        var jwidth = mtr.width;
        var twidth = (maxw + 2) * awidth;
        var addcount = maxw; //(twidth - jwidth) / jspacewidth  + (ii % 2);
        if (lastcount > 0) {
            for (j = 0; j < lastcount; j++)
                ss += " ";
        }
        ss += c;
        ti = ss;
        if (c.length > 1) {
            addcount -= 2;
        }
        lastcount = addcount;

        font_size = org_font_size;


        if (Map1text.length > 60) { //入力候補がはみ出さないように調整
            font_size = parseInt(Map1text.length / (-4) + 14 + org_font_size);
            //Log.info("tl:"+Map1text.length+"    fs:"+font_size);
        }
    }

    //Log.info(org_font_size);


    var blanks = "                                                                    ";
    Map1context.font = font_size + "px " + font_name;
    Map1context.fillText(Map1text, 5, font_size_int + 5);
    if (Map1text != blanks.substring(0, Map1text.lengh)) {
        if (browser == 4) {
            Map1div.style.visibility = "visible";
        } else {
            Map1div.hidden = false;
        }
    }
    Map2context.font = font_size + "px " + font_name;
    Map2context.fillText(Map2text, 5, font_size_int + 5);
    if (Map2text != blanks.substring(0, Map2text.lengh)) {
        if (browser == 4) {
            Map2div.style.visibility = "visible";
        } else {
            Map2div.hidden = false;
        }
    }
    Map3context.font = font_size + "px " + font_name;
    Map3context.fillText(Map3text, 5, font_size_int + 5);
    if (Map3text != blanks.substring(0, Map3text.lengh)) {
        if (browser == 4) {
            Map3div.style.visibility = "visible";
        } else {
            Map3div.hidden = false;
        }
    }
    Map4context.font = font_size + "px " + font_name;
    Map4context.fillText(Map4text, 5, font_size_int + 5);
    if (Map4text != blanks.substring(0, Map4text.lengh)) {
        if (browser == 4) {
            Map4div.style.visibility = "visible";
        } else {
            Map4div.hidden = false;
        }
    }
    // set up spaced out text for later use in highlighting
    mapspacedtext = ti;
    ss = ti;
    mapindex[0] = 0;
    i = 1;
    j = 1;
    while (i < ss.length) {
        while (ss.charCodeAt(i) == 32)
            i++;
        mapindex[j++] = i;
        i++;
        if (i < ss.length) {
            if (ss.charCodeAt(i) != 32) {
                i++; // skip second of paired chars
                mapindex[j++] = -1;
            }
        } else {
            mapindex[j++] = 999;
        }
    }
    Respstimulus_index = 0;
    currmapkey = (maparray[0]);
    currmapchars = "";
    stimulus_text = mapspacedtext;
    font_size = org_font_size;
    if (DoOtherSounds && currmapkey != null) {
        if (currmapkey.audio != null) {
            jsounds[currmapkey.audio] = play_audio_file(jsounds[currmapkey.audio], currmapkey.audio, null, true, DoControlSounds);
        } else {
            jsounds[currmapkey.letters[0].toLowerCase()] = play_audio_file(jsounds[currmapkey.letters[0].toLowerCase()], currmapkey.letters[0].toLowerCase(), null, true, DoControlSounds);
        }
    }

}

function showTimeout(t_key) {
    if (IsTQP) {
        status_line.style.color = "black";
        status_line.textContent = static_timeout;
    }
}

//キー判定
function processkey(key, iserror, typedkey) {
    //Log.info("processkey("+key+", "+iserror+", "+typedkey+")");
    //Log.info("LineStrokes: "+LineStrokes+",     LineErrors: "+LineErrors);

    ////////////////////////////////
    // 202205実験
    // キー入力をトリガーにする場合はここに書く
    // 入力行が変わるタイミングの場合は stimline_create へ
    //	if(totalkeycount % 30 == 0){
    //		Log.info( "totalkeycount : " + totalkeycount );

    //		var obj2 = new Object();
    //		obj2.SessionID = SessionID;
    //		obj2.StudentID = StudentID;
    //		obj2.totalkeycount = totalkeycount;
    //		data = "jsonobject="+JSON.stringify(obj2);

    //		var phttplog = new XMLHttpRequest();
    //		phttplog.open("POST", HOSTNAME+"/putlog.py", true);
    //		phttplog.send(data);
    //	}
    // 実験ここまで
    ////////////////////////////////

    var i;
    var keyTimeOut = false; //キータイムアウト

    if (playinghands) {
        return;
    }
    var currenttime = (new Date()).getTime();


    //	if(!IsStarted && IsTest){
    if (!IsStarted) {
        start_timer(LessonPeriod);
        //		Log.info("start_timer("+LessonPeriod+")");
        IsStarted = true;
    }
    if (lastkeytime == null) {
        lastkeytime = currenttime;
        return;
    } else {
        if (TimeOutID != "" || pair_test) {
            clearInterval(TimeOutID);
        }
        if (!pair_test && !IsTest) {
            TimeOutID = setTimeout("showTimeout('" + key + "')", 5000);
        }
    }
    var keytime = currenttime - lastkeytime; // 前のキー入力からの時間
    //Log.info("keytime1: "+keytime+"   currenttime: "+currenttime+",     lastkeytime: "+lastkeytime);
    //Log.info(keytime);
    if (keytime <= 0)
        keytime = 1000;
    if (!pair_test) {
        if (keytime > 5000 && !IsTest) {
            keytime = 5000;
            keyTimeOut = true;
        }
        if (recordkey[key] == null) {
            recordkey[key] = new Object();
            recordkey[key].symbol = key;
            recordkey[key].inkeylist = false;
            recordkey[key].errorcount = 0;
            recordkey[key].strokecount = 0;
            recordkey[key].keytime = 0;
        }
        if (!iserror) {
            recordkey[key].inkeylist = true;
        }
        LineStrokes++;
        var k = recordkey[key];
        if (iserror) { //ミスタイプの場合
            //Log.info("ErrStreak = "+ErrStreak);
            totalerrtime += keytime;
            if (!ErrStreak) { //連続したタイプミス以外の場合
                LineErrors++;
                k.errorcount++;
                totalerrcount++;
            }
            ErrStreak = true;

            //Log.info("LineErrors:"+LineErrors+"  totalerrcount:"+totalerrcount);
        } else { //正しいタイプの場合
            totalkeycount++;
            totalkeytime += keytime;
            LineTotKeyTime += keytime;
            if (keyTimeOut && !ErrStreak) {
                LineErrors++;
                k.errorcount++;
                totalerrcount++;
            }
            ErrStreak = false;
            //Log.info("totalkeycount:"+totalkeycount+"  LineTotKeyTime:"+LineTotKeyTime);
        }
        k.strokecount++;
        k.keytime += keytime;
    }
    //Log.info("ErrStreak = "+ErrStreak);
    //Log.info("totalerrcount = "+totalerrcount);

    if (iserror) {
        if (CollectWeakWords) { //苦手なキーの収集
            var thisword = GetCurrentWord();
            if (thisword != "") {
                var found = false;
                for (i = 0; i < TotalWeakCount; i++) {
                    if (WeakWordList[i] == thisword) {
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    WeakWordList[TotalWeakCount] = thisword;
                    TotalWeakCount++;
                }
            }
        }
        if (speed_test) {
            status_line.textContent = "";
        } else {
            var ts = KeyToString(key);
            if (maptext_test || IsAltMapTextLesson) {
                if (currmapkey != null) {
                    ts = currmapkey.letters[0];
                    if (ts.length != 1 && currmapchars != "") {
                        ts = ts.substr(currmapchars.length);
                    }
                    ts = ts.toLowerCase();
                }
            }
            if (LastCapslockState) {
                status_line.style.color = "red";
                status_line.textContent = static_capslockkey;
            } else {
                var typed = typedkey;
                status_line.style.color = "black";
                statusLineLife = 0;
                if (typed == " ") {
                    status_line.textContent = static_errorpress + ts + static_youpressed + static_thespacebar + static_key;
                } else if (typed == "\r") {
                    status_line.textContent = static_errorpress + ts + static_youpressed + static_theenter + static_key;
                } else {
                    status_line.textContent = static_errorpress + ts + static_youpressedthe + typed + static_key;
                }
            }
        }
    } else {
        if (statusLineLife > 0) {
            statusLineLife--;
        } else {
            statusLineLife = 0;
            status_line.textContent = "";
        }
    }
    if (!pair_test && LessonCharCount != 0 && totalkeycount > 3) {
        //残り時間の計算
        var avkeytime = (totalkeytime + totalerrtime) / (totalkeycount + totalerrcount) / 1000.; // in seconds
        var p = (StimulusCount + stimulus_index) * 100.0 / LessonCharCount;
        if (IsTest) { //タイピングテストの場合
            //Log.info("typing test!");
            LessonProgress = "";
        } else {
            if (p < 100.0) {
                LessonProgress = static_lessonprogress + (p).toFixed(0) + "%";
            } else {
                LessonProgress = static_lessonprogress + "100%";
            }
        }
        var e = avkeytime * (LessonCharCount - (StimulusCount + stimulus_index)) / 60.;
        if (IsTest) { //タイピングテストの場合  LessonPeriod
            //LessonTimeToComplete = static_timetocomplete +":"+( LessonPeriod - StartTime) ;

        } else {
            if (e > 0.0) {
                if (IsHenkan) { //変換レッスンは残り時間を2倍に
                    LessonTimeToComplete = static_timetocomplete + (e * 2).toFixed(1) + static_min;
                } else {
                    LessonTimeToComplete = static_timetocomplete + (e).toFixed(1) + static_min;
                }
            } else {
                LessonTimeToComplete = static_timetocomplete + "0" + static_min;
            }
        }
        if (IsTQP) {
            replace_signtext("lessontimeani", "lessontime", LessonTimeToComplete);
            replace_signtext("lessonprogressani", "lessonprogress", LessonProgress);
        }
    }
    lastkeytime = currenttime;
}

function start_timer() {
    //タイピングテストのタイマー
    var st = new Date();
    StartTime = st.getTime();
    //Log.info("start time:"+StartTime);
    //	setTimeout('do_endlesson('+true+')',period*1000);

}


var timer = setInterval(function () {
    //タイピングテストの残り時間表示
    if (IsTest) {
        var now = new Date();
        CurrentTime = now.getTime();
        ElapsedTime = (CurrentTime - StartTime) / 1000;
        if (ElapsedTime) {
            LessonTimeToComplete = static_timetocomplete + parseInt((LessonPeriod - CurrentTime / 1000 + StartTime / 1000) / 60) + static_min + " " + parseInt(LessonPeriod - CurrentTime / 1000 + StartTime / 1000) % 60 + static_sec;


            //		LessonTimeToComplete = static_timetocomplete + parseInt(LessonPeriod - CurrentTime/1000 + StartTime/1000) + static_sec;



        } else {
            LessonTimeToComplete = static_timetocomplete + parseInt(LessonPeriod / 60) + static_min + " " + parseInt(LessonPeriod) % 60 + static_sec;



        }
        replace_signtext("lessontimeani", "lessontime", LessonTimeToComplete);

        if (ElapsedTime >= LessonPeriod) {
            //			Log.info("ElapsedTime: "+ElapsedTime);
            clearInterval(timer);
            HideTextImages();
        }
    }
}, 250);



//  タイピングテスト終了時
function HideTextImages() {
    skipLesson = true;
    process_script("main_script", ++lesson_item);
    line_hide();




}




function click_handler(e) {
    status_line.textContent = "";
    if (e.target == document.getElementById("helpbutton")) {
        return;
    }
    if (e.target == document.getElementById("nextbutton")) {
        return;
    }
    if (e.target == document.getElementById("extbutton")) {
        return;
    }
    if (e.target == document.getElementById("mainbutton")) {
        return;
    }
    if (cursordiv == null) {
        makecursor();
    }
    cursordiv.focus();
}


function init_lesson() {
    loadNaughtyWords("gvdl,dvou,tiju,ebno,bstf,hpe,btt,ifmm");
    var i = 10 + Host.substr(10).indexOf("/");
    HOSTNAME = Host.substring(0, i);
    //STORAGE_PATH = 'https://storage.googleapis.com/tqcloud.appspot.com';
    //STORAGE_PATH = prey_appears;

    if (LessonID.lastIndexOf("e") == (LessonID.length - 1)) {
        var sec = LessonID.substring(LessonID.length - 2, LessonID.length - 1).toLowerCase();
        if ((sec >= "a" && sec <= "z")) {
            if (ProductPath.indexOf("TFS") >= 0 && (CourseID.indexOf("Basic") >= 0 || CourseID.indexOf("Royal") >= 0)) {
                IsTFSExtLesson = true;
            }
        }
    }

    status_line = document.createElement("stattext");
    status_line.type = "text";
    if (LessonCharCount == 0 || !IsTQP) {
        status_line.textContent = "";
    } else {
        status_line.style.color = "black";
        status_line.textContent = CLICKME;
    }
    status_line.style.position = "absolute";
    status_line.style.top = "480px";
    status_line.style.left = "2px";
    status_line.style.zIndex = 10000;
    status_line.style.width = "636px";
    draw_region.appendChild(status_line);
    //document.onkeydown =  keydown_handler;
    //document.onkeypress =  keypress_handler;
    //document.onclick = click_handler;

    if ((ProductPath.indexOf("TFS") >= 0 && (CourseID.indexOf("Basic") >= 0 || CourseID.indexOf("Royal") >= 0)) && NumRevisions > 10) {
        if (SCORE_LIMIT) {
            ScoreValid = false;
            //alert("復習回数が10回を超えているので、スコアは加算されません。");
            if (!confirm("復習回数が10回を超えているので、スコアは加算されません。このまま練習を続けますか?")) {
                //キャンセルがクリックされたらメインメニューに戻る
                var url = "/studentmainmenu.py" +
                    "?StudentID=" + StudentID + "&SessionID=" + SessionID + "&Akey=" + Akey +
                    "&LanguageID=" + LanguageID + "&ProductID=" + ProductID +
                    "&CourseID=" + CourseID + "&LessonID=" + LessonID +
                    "&DistributorKey=" + DistributorKey +
                    "&html5=true";
                window.open(url, "_self");
            }
        }
    }

}

function doresize() {
    var winwidth = window.innerWidth;
    var winheight = window.innerHeight;
    //if ((winwidth/winheight) > (640.0/540.0)) {
    if (winwidth < 640.0 || winheight < 540.0) {
        //draw_scale = winheight/540.0;
        draw_scale = 1.0;
        draw_xoff = (winwidth - (draw_scale * 640)) / 2.0;

        if (draw_xoff < 0) draw_xoff = 0;

    } else if ((winwidth / winheight) > (640.0 / 540.0)) {

        draw_scale = winheight / 540.0;
        draw_xoff = (winwidth - (draw_scale * 640)) / 2.0;

    } else {
        draw_scale = winwidth / 640.0;
        draw_xoff = 0;
    }
    var rule = "position: absolute; top: 0px; left: 0px; " + keyframe_prefix + "transform: translate(" + Math.round(draw_xoff).toString() + "px, 0px) scale(" + draw_scale + ", " + draw_scale + ");";
    try {
        draw_region_stylesheet.removeRule(0);
    } catch (e) {}
    draw_region_stylesheet.addRule("#drawregion", rule);
}

function makeimage(name, url, s, x, y, z, a) {

    //  s:  倍率
    //  x:  横位置  y:  縦位置
    //  z:  z-index
    //  a:  透過度
    try {
        if (PrefKeyboard == "ukkbd" || PrefKeyboard == "ukkbd-i") {
            if (name == "mkEnter") {
                y += 13;
            }
        }
        image_def_item_offset[name] = image_count;
        image_def_item_count[name] = 1;
        image_def_div[name] = document.createElement('div');
        image_def_div[name].id = "div-" + name;
        image_def_stylesheet[name] = document.createStyleSheet();

        image_object[image_count] = new Image();
        image_x[image_count] = x;
        image_y[image_count] = y;
        image_z[image_count] = z;
        image_a[image_count] = a;
        image_s[image_count] = s;
        image_is_loaded[image_count] = false;
        image_object[image_count].onload = function (e) {
            var obj = e.target;
            var offset = parseInt(obj.getAttribute("obj_offset"));
            var id = obj.getAttribute("obj_id");
            if (offset != null) {
                image_is_loaded[offset] = true;
                image_canvas[offset] = document.createElement("canvas");
                image_canvas[offset].width = image_object[offset].width * 2 * s;
                image_canvas[offset].height = image_object[offset].height * 2 * s;
                image_context[offset] = image_canvas[offset].getContext("2d");
                image_context[offset].drawImage(image_object[offset], 0, 0, image_s[offset] * image_object[offset].width, image_s[offset] * image_object[offset].height);
                image_def_div[id].appendChild(image_canvas[offset]);
                //Log.info("rule="+"#div-"+id);
                //Log.info("val="+"z-index: "
                //		+image_z[offset].toString()+"; position: absolute; left: "
                //		+image_x[offset].toString()+"px; top: "
                //		+image_y[offset].toString()+"px; opacity: "
                //		+image_a[offset].toString()+";");
                image_def_stylesheet[id].addRule("#div-" + id, "z-index: " +
                    image_z[offset].toString() + "; position: absolute; left: " +
                    image_x[offset].toString() + "px; top: " +
                    image_y[offset].toString() + "px; opacity: " +
                    image_a[offset].toString() + ";"
                );
                if (image_is_waiting[offset]) {
                    image_is_waiting[offset] = false;
                }
                if (browser == 4) {
                    image_def_div[id].style.visibility = "hidden"; // images are normally created hidden
                } else {
                    image_def_div[id].hidden = true; // images are normally created hidden
                }
                draw_region.appendChild(image_def_div[id]);
            }
        };
        image_object[image_count].setAttribute("obj_offset", image_count);
        image_object[image_count].setAttribute("obj_id", name);
        image_is_waiting[image_count] = false;
        image_is_loaded[image_count] = false;
        //Log.info(url);
        image_url[image_count] = url;
        image_object[image_count].src = url; // start loading the image
        // remainder of setup for the image will occur when the load completes
        return image_object[image_count++];
    } catch (ee) {
        catchlog(ee);
    }
}

function init_key_images() {
    //Log.info('init_key_images')
    //Log.info('STORAGE_PATH:' + STORAGE_PATH)

    for (var i = 0; i < 9; i++) {
        LeftPairHands[i] = makeimage("lph" + (i).toString(), STORAGE_PATH + "/keyboards/pairtesthands/" + LPHNames[i] + ".png", 1.0, 0, 0, "12400", 1.0);
    }
    for (var i = 0; i < 9; i++) {
        RightPairHands[i] = makeimage("rph" + (i).toString(), STORAGE_PATH + "/keyboards/pairtesthands/" + RPHNames[i] + ".png", 1.0, 0, 0, "12400", 1.0);
    }
    for (var i = 0; i < 5; i++) {
        NormalKeys[i] = makeimage("nk" + (i).toString(), STORAGE_PATH + "/keyboards/keys/" + NKNames[i] + ".png", 1.0, 0, 0, "12500", 0.6);
    }
    var x, y, row, key;
    x = parseInt(tqkbdef.getAttribute("XPos"));
    y = parseInt(tqkbdef.getAttribute("YPos"));

    if (!IsKeypadLesson) {
        row = tqkbdef.childNodes.item(5);
        for (var i = 1; i < row.childNodes.length; i += 2) {
            key = row.childNodes.item(i);
            if (key.getAttribute("name") == "CAPS") {
                break;
            }
        }
        CapsLockKeys[0] = makeimage("tk0", STORAGE_PATH + "/keyboards/keys/" + CLKNames[0] + ".png", 1.0,
            x + parseInt(key.getAttribute("x")), y + parseInt(key.getAttribute("y")), "12500", 0.6);

        row = tqkbdef.childNodes.item(7);
        for (var i = 1; i < row.childNodes.length; i += 2) {
            key = row.childNodes.item(i);
            if (key.getAttribute("name") == "LShift") {
                break;
            }
        }
        for (var i = 0; i < 2; i++) {
            if (PrefKeyboard == "ukkbd" || PrefKeyboard == "ukkbd-i" || PrefKeyboard == "frenchkbd") {
                LShiftKeys[i] = makeimage("lsk" + (i).toString(), STORAGE_PATH + "/keyboards/keys/" + LSKUKNames[i] + ".png", 1.0,
                    x + parseInt(key.getAttribute("x")), y + parseInt(key.getAttribute("y")), "12500", 0.6);
            } else {
                LShiftKeys[i] = makeimage("lsk" + (i).toString(), STORAGE_PATH + "/keyboards/keys/" + LSKNames[i] + ".png", 1.0,
                    x + parseInt(key.getAttribute("x")), y + parseInt(key.getAttribute("y")), "12500", 0.6);
            }
        }

        row = tqkbdef.childNodes.item(7);
        for (var i = 1; i < row.childNodes.length; i += 2) {
            key = row.childNodes.item(i);
            if (key.getAttribute("name") == "RShift") {
                break;
            }
        }
        for (var i = 0; i < 2; i++) {
            RShiftKeys[i] = makeimage("rsk" + (i).toString(), STORAGE_PATH + "/keyboards/keys/" + RSKNames[i] + ".png", 1.0,
                x + parseInt(key.getAttribute("x")), y + parseInt(key.getAttribute("y")), "12500", 0.6);
        }

        row = tqkbdef.childNodes.item(9);
        for (var i = 1; i < row.childNodes.length; i += 2) {
            key = row.childNodes.item(i);
            if (key.getAttribute("name") == "LAlt" || key.getAttribute("name") == "Alt") {
                break;
            }
        }
        for (var i = 0; i < 2; i++) {
            if (IsKeypadLesson) {
                if (i == 0) {
                    LAltKeys[i] = makeimage("alk" + (i).toString(), STORAGE_PATH + "/keyboards/keys/" + "rd.png", 1.0,
                        x + parseInt(key.getAttribute("x")), y + parseInt(key.getAttribute("y")), "12500", 0.6);
                } else {
                    LAltKeys[i] = makeimage("alk" + (i).toString(), STORAGE_PATH + "/keyboards/keys/" + "gy.png", 1.0,
                        x + parseInt(key.getAttribute("x")), y + parseInt(key.getAttribute("y")), "12500", 0.6);
                }
            } else {
                LAltKeys[i] = makeimage("alk" + (i).toString(), STORAGE_PATH + "/keyboards/keys/" + LAKNames[i] + ".png", 1.0,
                    x + parseInt(key.getAttribute("x")), y + parseInt(key.getAttribute("y")), "12500", 0.6);
            }
        }

        row = tqkbdef.childNodes.item(9);
        for (var i = 1; i < row.childNodes.length; i += 2) {
            key = row.childNodes.item(i);
            if (key.getAttribute("name") == "RAlt" || key.getAttribute("name") == "Alt Gr") {
                break;
            }
        }
        for (var i = 0; i < 2; i++) {
            if (IsKeypadLesson) {
                if (i == 0) {
                    RAltKeys[i] = makeimage("alk" + (i).toString(), STORAGE_PATH + "/keyboards/keys/" + "rd.png", 1.0,
                        x + parseInt(key.getAttribute("x")), y + parseInt(key.getAttribute("y")), "12500", 0.6);
                } else {
                    RAltKeys[i] = makeimage("alk" + (i).toString(), STORAGE_PATH + "/keyboards/keys/" + "gy.png", 1.0,
                        x + parseInt(key.getAttribute("x")), y + parseInt(key.getAttribute("y")), "12500", 0.6);
                }
            } else {
                RAltKeys[i] = makeimage("alk" + (i).toString(), STORAGE_PATH + "/keyboards/keys/" + RAKNames[i] + ".png", 1.0,
                    x + parseInt(key.getAttribute("x")), y + parseInt(key.getAttribute("y")), "12500", 0.6);
            }
        }

        row = tqkbdef.childNodes.item(9);
        for (var i = 1; i < row.childNodes.length; i += 2) {
            key = row.childNodes.item(i);
            if (key.getAttribute("name") == "RCtrl") {
                break;
            }
        }
        for (var i = 0; i < 2; i++) {
            if (IsKeypadLesson) {
                if (i == 0) {
                    RCtlKeys[i] = makeimage("ctk" + (i).toString(), STORAGE_PATH + "/keyboards/keys/" + key.getAttribute("image") + "gr.png", 1.0,
                        x + parseInt(key.getAttribute("x")), y + parseInt(key.getAttribute("y")), "12500", 0.6);
                } else {
                    RCtlKeys[i] = makeimage("ctk" + (i).toString(), STORAGE_PATH + "/keyboards/keys/" + key.getAttribute("image") + "gy.png", 1.0,
                        x + parseInt(key.getAttribute("x")), y + parseInt(key.getAttribute("y")), "12500", 0.6);
                }
            } else {
                RCtlKeys[i] = makeimage("ctk" + (i).toString(), STORAGE_PATH + "/keyboards/keys/" + RCKNames[i] + ".png", 1.0,
                    x + parseInt(key.getAttribute("x")), y + parseInt(key.getAttribute("y")), "12500", 0.6);
            }
        }

        row = tqkbdef.childNodes.item(9);
        for (var i = 1; i < row.childNodes.length; i += 2) {
            key = row.childNodes.item(i);
            if (key.getAttribute("name") == "LCtrl") {
                break;
            }
        }
        for (var i = 0; i < 2; i++) {
            LCtlKeys[i] = makeimage("ctk" + (i).toString(), STORAGE_PATH + "/keyboards/keys/" + LCKNames[i] + ".png", 1.0,
                x + parseInt(key.getAttribute("x")), y + parseInt(key.getAttribute("y")), "12500", 0.6);
        }

        row = tqkbdef.childNodes.item(9);
        for (var i = 1; i < row.childNodes.length; i += 2) {
            key = row.childNodes.item(i);
            if (key.getAttribute("name") == "Spacebar") {
                break;
            }
        }
        for (var i = 0; i < 2; i++) {
            SpaceBarKeys[i] = makeimage("sk" + (i).toString(), STORAGE_PATH + "/keyboards/keys/" + SBKNames[i] + ".png", 1.0,
                x + parseInt(key.getAttribute("x")), y + parseInt(key.getAttribute("y")), "12500", 0.6);
        }

        row = tqkbdef.childNodes.item(3);
        for (var i = 1; i < row.childNodes.length; i += 2) {
            key = row.childNodes.item(i);
            if (key.getAttribute("name") == "Tab") {
                break;
            }
        }
        for (var i = 0; i < 2; i++) {
            TabKeys[i] = makeimage("tk" + (i).toString(), STORAGE_PATH + "/keyboards/keys/" + TKNames[i] + ".png", 1.0,
                x + parseInt(key.getAttribute("x")), y + parseInt(key.getAttribute("y")), "12500", 0.6);
        }
    } else {
        try {
            for (var k = 1; k < 11; k += 2) {
                row = tqkbdef.childNodes.item(k);
                for (var j = 1; j < row.childNodes.length; j += 2) {
                    key = row.childNodes.item(j);
                    if (key.getAttribute("name") == "Enter") {
                        continue;
                    }
                    if (key.getAttribute("image") == "kpdlng") {
                        for (var i = 0; i < 2; i++) {
                            KpadLngKeys[i] = makeimage("klng" + (i).toString(), STORAGE_PATH + "/keyboards/keys/" + KpadLngNames[i] + ".png", 1.0,
                                x + parseInt(key.getAttribute("x")), y + parseInt(key.getAttribute("y")), "12500", 0.6);
                        }
                    }
                    if (key.getAttribute("image") == "kpdwd") {
                        for (var i = 0; i < 2; i++) {
                            KpadWdKeys[i] = makeimage("kwd" + (i).toString(), STORAGE_PATH + "/keyboards/keys/" + KpadWdNames[i] + ".png", 1.0,
                                x + parseInt(key.getAttribute("x")), y + parseInt(key.getAttribute("y")), "12500", 0.6);
                        }
                    }
                }
            }
        } catch (e) {}
    }

    try {
        var done = false;
        for (var k = 1; k < 11; k += 2) {
            if (done) {
                break;
            }
            row = tqkbdef.childNodes.item(k);
            for (var j = 1; j < row.childNodes.length; j += 2) {
                if (done) {
                    break;
                }
                key = row.childNodes.item(j);
                if (key.getAttribute("name") == "Enter") {
                    done = true;
                    for (var i = 0; i < 2; i++) {
                        if (IsKeypadLesson) {
                            if (i == 0) {
                                if (key.getAttribute("imagepos") == "blue") {
                                    EnterKeys[i] = makeimage("ek" + (i).toString(), STORAGE_PATH + "/keyboards/keys/" + key.getAttribute("image") + "bl.png", 1.0,
                                        x + parseInt(key.getAttribute("x")), y + parseInt(key.getAttribute("y")), "12500", 0.6);
                                } else {
                                    EnterKeys[i] = makeimage("ek" + (i).toString(), STORAGE_PATH + "/keyboards/keys/" + key.getAttribute("image") + "gr.png", 1.0,
                                        x + parseInt(key.getAttribute("x")), y + parseInt(key.getAttribute("y")), "12500", 0.6);
                                }
                            } else {
                                EnterKeys[i] = makeimage("ek" + (i).toString(), STORAGE_PATH + "/keyboards/keys/" + key.getAttribute("image") + "gy.png", 1.0,
                                    x + parseInt(key.getAttribute("x")), y + parseInt(key.getAttribute("y")), "12500", 0.6);
                            }
                        } else {
                            EnterKeys[i] = makeimage("ek" + (i).toString(), STORAGE_PATH + "/keyboards/keys/" + EKNames[i] + ".png", 1.0,
                                x + parseInt(key.getAttribute("x")), y + parseInt(key.getAttribute("y")), "12500", 0.6);
                        }
                    }
                }
            }
        }
    } catch (e) {

    }
    return;
}

flg = '';
var obj = {};

function init_prefs() {
    //Log.info('code.js init_prefs')
    var i = 10 + Host.substr(10).indexOf("/");

    //Log.info(i);

    //STORAGE_PATH = Host.substring(0,i);
    //STORAGE_PATH = get_Bucket();

    //Log.info('STORAGE_PATH' + STORAGE_PATH)
    var phttp = new XMLHttpRequest();
    phttp.open("POST", HOSTNAME + "/startlesson.py", false)
    var SentSeed = Math.round(Math.random() * 1000000);

    var pdata = {
        "SessionID": SessionID,
        "StudentID": StudentID,
        "ProductID": ProductID,
        "CourseID": CourseID,
        "LessonID": LessonID,
        "LanguageID": LanguageID,
        "Seed": SentSeed,
        "Akey": Akey
    };
    var pdata = JSON.stringify(pdata);
    //Log.info(pdata)
    phttp.send(pdata);
    var studentprefs = phttp.responseText;
    var obj = JSON.parse(studentprefs);
    //Log.info(obj)

    // $.ajax({
    //  	type:'post',
    //  	url:STORAGE_PATH+"/startlesson.py",
    //  	contentType:'application/json',
    //  	async: true,
    //  	data:pdata,
    //  })
    //  .then(function(studentprefs){
    // 	 obj = JSON.parse(studentprefs);
    // 	 flg = 1
    //  	test();
    //  })
    //  .fail(function(error){
    //Log.info(error);
    //  });

    var ReturnSeed = obj.Seed;
    if ((ReturnSeed - 1) != SentSeed) {
        //abort
        return;
    }
    // else{
    // 	setTimeout(
    // 		function () {
    //Log.info("アラートを表示したました。");
    // 		  alert("3秒経ったのでアラートを表示しました。");
    // 		}, 
    // 		"3000"
    // 	);
    // }

    DoWPM = obj.WPM;
    TargetSpeed = obj.TargetSpeed;
    TestPeriod = obj.TestPeriod;
    Audience = obj.Audience;
    //Log.info("Audience: "+Audience);
    DoErrorBeep = obj.EnableErrorBeep;
    DoControlSounds = obj.EnableControlSounds;
    DoOtherSounds = obj.EnableOtherSounds;
    UseEnterKey = obj.EnterFlag;
    //Log.info("UseEnterKey:" + UseEnterKey);
    SingleSpace = obj.SSFlag;
    if (IsKeypadLesson) {
        PrefKeyboard = obj.Keypad;
    } else {
        PrefKeyboard = obj.Keyboard;
    }
    //Log.info(STORAGE_PATH)
    //Log.info(LocalKeyboard)

    //cloudHost = 'Flex'
    //LocalKeyboard = CloudBucketPath + LocalKeyboard + PrefKeyboard + ".xml";
    //Log.info("kbd_xml: "+ LocalKeyboard);
    Score = obj.Score;
    var x = obj.LastWPM;
    if (x != 0) { //前行の結果を利用する場合の初期値
        x = 1.0 / (x * 5.0 / 60.0 / 1000);
        LastLineTotalKeyTime = x * 100.0;
        LastLineTotalCharCount = 100;
    }
    org_font_size = obj.LessonFontSize;
    font_size = org_font_size;
    font_size_int = parseInt(font_size);
    //	font_name = obj.LessonFontName;
    if (obj.LessonFontName == 'Default') {
        font_name = 'monospace'
    } else {
        font_name = obj.LessonFontName;
    }

    font_fore_colour = obj.LessonFontForeColour;
    font_back_colour = obj.LessonFontBackColour;
    error_colour = obj.LessonFontErrorColour;
    StudentName = obj.StudentName;


    xhttp = new XMLHttpRequest();
    xhttp.open("POST", HOSTNAME + "/getXml.py", false);
    xhttp.send(PrefKeyboard);
    var parser = new DOMParser();
    var xmlDoc = parser.parseFromString(xhttp.responseText, "application/xml");
    var xmlkbd = xmlDoc; //xhttp.responseXML;
    //Log.info(xmlkbd);


    // $.ajax({
    // 	type: 'post',
    // 	url: '/getXml.py',
    // 	contentType:"application/json",	
    // 	async: false,
    // 	data:PrefKeyboard,
    // })
    // .then(function(data){
    //Log.info('OK');
    // 	xmlkbd = data;
    // 	test2(xmlkbd);

    // })
    // .fail(function(error){
    //Log.info('NG');
    //Log.info(error);
    // });


    //xhttp.responseXML;


    tqkbdef = xmlkbd.childNodes.item(1);
    var x = parseInt(tqkbdef.getAttribute("XPos")) - 8; //Pairtestのキーボードの位置
    var y = parseInt(tqkbdef.getAttribute("YPos")) - 8;
    var mx = parseInt(tqkbdef.getAttribute("MiniXPos")) + MINIXPOS_OFFSET; //ミニキーボードの位置
    var my = parseInt(tqkbdef.getAttribute("MiniYPos")) + MINIYPOS_OFFSET;

    //Log.info(STORAGE_PATH); //https://1-04-dot-tqcloud.appspot.com
    //Log.info(STORAGE_PATH + "/keyboards/layouts/images/" + PrefKeyboard + ".png"); //https://1-04-dot-tqcloud.appspot.com/keyboards/layouts/images/japengkbd.png
    //STORAGE_PATH = 'https://storage.googleapis.com/tqcloud.appspot.com';
    //STORAGE_PATH = prey_appears;
    makeimage("kbd", STORAGE_PATH + "/keyboards/layouts/images/" + PrefKeyboard + ".png", 1.02, x, y, "12000", 1.0);
    makeimage("kbd_s", STORAGE_PATH + "/keyboards/layouts/images/" + PrefKeyboard + "_s.png", 1.02, x, y, "12000", 1.0);
    makeimage("minikbd", STORAGE_PATH + "/keyboards/layouts/images/" + PrefKeyboard + ".png", minikeyscale, mx, my, "12000", 1.0);
    makeimage("minikbd_s", STORAGE_PATH + "/keyboards/layouts/images/" + PrefKeyboard + "_s.png", minikeyscale, mx, my, "12000", 1.0);
    ghostkeys[0] = makeimage("ghost0", STORAGE_PATH + KbdGhostBase + "homel.png", 1.0, 0, 0, "13000", 0.6);
    //Log.info(ghostkeys[0])
    ghostkeys[1] = makeimage("ghost1", STORAGE_PATH + KbdGhostBase + "homer.png", 1.0, 0, 0, "13000", 0.6);


    if (IsHenkan) {
        KbdSoundBase += "k-j/";
        xhttp = new XMLHttpRequest();
        xhttp.open("GET", HOSTNAME + "/msimemap.py", false);
        xhttp.send();

        parser = new DOMParser();
        xmlDoc = parser.parseFromString(xhttp.responseText, "application/xml");
        var xmlkbd = xmlDoc; //xhttp.responseXML;
        tqmapdef = xmlkbd.childNodes.item(1);

        //		var xmlime = xhttp.responseXML;

        var rows = tqmapdef.childNodes;
        var n = rows.length;
        var i, j, k;
        for (var i = 1; i < rows.length; i += 2) {
            var row = rows.item(i);
            var letters = row.childNodes;
            var key = row.getAttribute("value");
            var audio = row.getAttribute("audio");
            var lookahead = row.getAttribute("lookahead");
            var newchar = {};
            newchar.letters = new Array();
            newchar.pairs = new Array();
            newchar.symbol = key;
            if (audio)
                newchar.audio = audio;
            if (lookahead)
                newchar.lookahead = true;
            for (var j = 1, k = 0; j < letters.length; j += 2) {
                if (String(letters.item(j).localName) == "letters") {
                    newchar.letters.push(letters.item(j).getAttribute("value"));
                } else {
                    var moreletters = letters.item(j).childNodes;
                    var morekey = letters.item(j).getAttribute("value");
                    var morenewchar = {};
                    morenewchar.letters = new Array();
                    morenewchar.symbol = morekey;
                    morenewchar.IsDouble = true;
                    for (var n = 1; n < moreletters.length; n += 2) {
                        morenewchar.letters.push(moreletters.item(n).getAttribute("value"));
                    }
                    newchar.pairs[k++] = morenewchar;
                }
            }
            mapkeylist[key] = newchar;
        }
    }

    if (isipad) {
        DoErrorBeep = false;
        DoControlSounds = false;
        DoOtherSounds = false;
    } else if (browser == 6 || browser == 5) {
        DoErrorBeep = false;
        DoControlSounds = false;
    }
    return;
}

function dohidebuttons() {
    var hb = document.getElementById("helpbutton");
    hb.style.visibility = "hidden";
    var mb = document.getElementById("mainbutton");
    mb.style.visibility = "hidden";
    var eb = document.getElementById("extbutton");
    eb.style.visibility = "hidden";
    var nb = document.getElementById("nextbutton");
    nb.style.visibility = "hidden";
    buttonshidden = true;
}

function doshowbuttons() {
    var hb = document.getElementById("helpbutton");
    hb.style.visibility = "visible";
    var mb = document.getElementById("mainbutton");
    mb.style.visibility = "visible";
    if (!(ExtLessonID == null || ExtLessonID == "")) {
        var eb = document.getElementById("extbutton");
        eb.style.visibility = "visible";
    }
    if (!(NextLessonID == null || NextLessonID == "")) {
        var nb = document.getElementById("nextbutton");
        nb.style.visibility = "visible";
    }
    buttonshidden = false;
}




//特殊キーの初期値
var shift_pressed = false;

//キーが押されていることを検知
document.onkeydown = function (event) {
    var key_event = event || window.event;
    if (key_event.shiftKey) {
        shift_pressed = (key_event.shiftKey);
        if (minikbd_shown) {
            hide_minikbd();
            show_minikbd_s();
        }
        if (largekbd_shown) {
            hide_largekbd();
            show_largekbd_s();
        }
    }
}

//キーが離されたことを検知
document.onkeyup = function (event) {
    var key_event = event || window.event;
    if (shift_pressed) {
        if (minikbd_shown) {
            hide_minikbd();
            show_minikbd();
        }
        if (largekbd_shown) {
            hide_largekbd();
            show_largekbd();
        }
    }
    shift_pressed = false;
}


function init() {


    //Log.info("ua="+ua+" bname="+bname+" bver="+bver);
    dummy = document.getElementById("dummy");
    if (!ShowButtons) {
        dohidebuttons();
    }
    if (ua.indexOf("firefox") >= 0) {
        browser = 1;
        sound_suffix = ".mp3";
        keyframe_prefix = "-moz-";
    } else if ((ua.indexOf("msie 10") >= 0 && bver.indexOf("msie 10") >= 0) || ua.indexOf("edge") >= 0 || ua.indexOf("trident") >= 0) {
        browser = 4;
        if (ua.indexOf("edge") >= 0) {
            edgebrowser = true;
            keyframe_prefix = "";
        } else {
            edgebrowser = false;
            keyframe_prefix = "-ms-";
        }
        sound_suffix = ".mp3";
    } else if ((ua.indexOf("chrome") >= 0 && bver.indexOf("chrome") >= 0)) {
        if (ua.indexOf("crios") >= 0) {
            isipad = true;
        }
        browser = 3;
        sound_suffix = ".mp3";
        keyframe_prefix = "-webkit-";
    } else if (ua.indexOf("opera") >= 0) {
        browser = 7;
        sound_suffix = ".ogg";
        keyframe_prefix = "-o-";
    } else if (ua.indexOf("ipad") >= 0 && bver.indexOf("applewebkit") >= 0) {
        browser = 5;
        isipad = true;
        sound_suffix = ".mp3";
        keyframe_prefix = "-webkit-";
    } else if (ua.indexOf("safari") >= 0 && bver.indexOf("safari") >= 0 && platver.indexOf("win32") >= 0) {
        browser = 2;
        sound_suffix = ".mp3";
        keyframe_prefix = "-webkit-";
    } else if (ua.indexOf("safari") >= 0 && bver.indexOf("safari") >= 0) {
        browser = 6;
        sound_suffix = ".mp3";
        keyframe_prefix = "-webkit-";
    } else if ((ua.indexOf("windows nt 10") >= 0 || bver.indexOf("windows nt 10") >= 0)) {
        browser = 4;
        sound_suffix = ".mp3";
        keyframe_prefix = "-ms-";
    }
    //Log.info("browser="+String(browser));
    var be;
    if (ProductPath.indexOf("TQP") >= 0) {
        IsTQP = true;
    } else {
        if (CourseID.indexOf("Henkan") >= 0 || CourseID.indexOf("Skill") >= 0 || CourseID.indexOf("Keypad") >= 0 || CourseID.indexOf("Punctuation") >= 0) {
            IsTQP = true;
        } else {
            IsTQP = false;
        }
    }
    //Log.info("IsTQP:"+IsTQP);
    be = document.getElementById("helpbutton");
    be.innerHTML = static_help;
    be = document.getElementById("nextbutton");
    be.innerHTML = static_nextlesson;
    be = document.getElementById("extbutton");
    be.innerHTML = static_extlesson;
    be = document.getElementById("mainbutton");
    be.innerHTML = static_mainmenu;
    if (browser == 4) {
        if (window.addEventListener) {
            window.addEventListener('resize', doresize, false);
        } else {
            window.attachEvent('onresize', doresize);
        }
    } else {
        window.addEventListener('resize', doresize, false);
    }
    be = document.getElementById("main_script");
    LessonCharCount = parseInt(be.getAttribute("data-tqscr-chars"));
    LessonPeriod = parseInt(be.getAttribute("data-tqscr-time")); //タイピングテスト
    //Log.info("LessonPeriod="+LessonPeriod);
    LessonHeader = be.getAttribute("data-tqscr-lesson");
    var spec = "";
    try {
        spec = be.getAttribute("data-tqscr-spec");
        if (spec == "tqpp") {
            planets_type = true;
            IsTQP = false;
        } else if (spec == "keypad") { // keypad
            IsKeypadLesson = true;
        } else if (spec == "henkan") { // henkan
            IsHenkan = true;
        } else if (spec == "test") { // skill test
            IsTest = true;
        }

    } catch (eee) {

    }
    //TODO
    HelpPath = be.getAttribute("data-tqscr-help") + ".html";
    HelpPath = ProductPath + LanguagePath + "/Help/" + HelpPath;
    NextLessonID = be.getAttribute("data-tqscr-next");
    if (NextLessonID == null || NextLessonID == "") {
        var eb = document.getElementById("nextbutton");
        eb.style.visibility = "hidden";
    }
    ExtLessonID = be.getAttribute("data-tqscr-ext");
    if (ExtLessonID == null || ExtLessonID == "") {
        var eb = document.getElementById("extbutton");
        eb.style.visibility = "hidden";
    }
    if (!IsTQP) {
        dohidebuttons();
    }
    draw_region = document.getElementById("drawregion");
    ensure_create_stylesheet();
    draw_region_stylesheet = document.createStyleSheet();
    doresize();
    draw_region.style = draw_region_stylesheet;
    if (cursordiv == null) {
        makecursor();
    }
    dummy.addEventListener("focus", focus_handler, false);
    dummy.addEventListener("blur", blur_handler, false);
    dummy.addEventListener("click", click_handler, false);
    cursordiv.addEventListener("keydown", keydown_handler, false);
    cursordiv.addEventListener("keyup", keyup_handler, false);
    cursordiv.addEventListener("keypress", keypress_handler, false);
    //window.onfocus = focus_handler;
    //window.onblur =  blur_handler;
    init_image_objects();
    init_audio_objects();
    init_static_image_animations();
    init_moving_image_animations();
    init_key_static_image_animations();
    init_key_moving_image_animations();
    init_audio_animations();
    init_lesson();
    init_prefs();
    init_key_images();
    draw_region_canvas = document.createElement("canvas");
    //Log.info(draw_region_canvas)
    draw_region_context = draw_region_canvas.getContext("2d");
    //Log.info(draw_region_context)
    draw_region_context.font = font_size + "pt " + font_name;
    //Log.info(draw_region_context)
    keytimeouttimerid = setInterval(keytimer_handler, 1000);
    //Log.info(keytimeouttimerid)
    document.body.style.cursor = "default";
    //alert("test");
    process_script("main_script", 0);
}

//function Log.info(s) {
//	try {
//Log.info(s);
//	} catch (e) {
//	}
//}

window['init'] = init;
//(ua.indexOf("msie 10") >= 0 && bver.indexOf("msie 10") >= 0 )