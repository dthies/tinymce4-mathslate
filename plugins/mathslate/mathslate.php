<?php
// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * MathSlate editor popup.
 *
 * @package   tinymcefour_mathslate
 * @copyright 2013 Daniel Thies
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */


?><head>
<script src="http://yui.yahooapis.com/3.14.1/build/yui/yui-min.js"></script>
<script type="text/javascript" src="http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML"> </script>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<link rel="stylesheet" type="text/css" href="http:./styles.css">
<script>
// Create a YUI sandbox on your page.
YUI().use('node', 'event', function (Y) {
    // The Node and Event modules are loaded and ready to use.
    // Your code goes here!
});
</script>
<script>
if (typeof M === "undefined") M={};
M.util=M.util||{};
M.util.image_url=M.util.image_url||function(image,module){
    return 'http:'+(module=='tinymce_mathslate'?'./pix/':'../../pix/')+image+'.svg';
}
M.util.get_string = function(image,module){
    return 'http:'+(module=='tinymce_mathslate'?'./pix/':'../../pix/')+image+'.svg';
}
M.tinymce_mathslate=M.tinymce_mathslate||{};
M.tinymce_mathslate.config="http:./config.json";
M.tinymce_mathslate.help="http:./help.html";
</script>
<script src="./strings.js"></script>
<script src="./yui/build/moodle-tinymce_mathslate-snippeteditor/moodle-tinymce_mathslate-snippeteditor-debug.js"> </script>
<script src="./yui/build/moodle-tinymce_mathslate-mathjaxeditor/moodle-tinymce_mathslate-mathjaxeditor-debug.js"> </script>
<script src="./yui/build/moodle-tinymce_mathslate-editor/moodle-tinymce_mathslate-editor-debug.js"> </script>
<script src="./yui/build/moodle-tinymce_mathslate-textool/moodle-tinymce_mathslate-textool-debug.js"> </script>

<script>
YUI().use('moodle-tinymce_mathslate-editor','moodle-tinymce_mathslate-textool', function (Y) {
MathJax.Hub.Queue(['Typeset',MathJax.Hub]);
var editor = new M.tinymce_mathslate.Editor('#editor',"http:./config.json");
var mathEditor = top.tinymce.activeEditor.windowManager.getParams();
mathEditor.output = function(format) { return editor.output(format); }
});
</script>
</head>
<body class="yui3-skin-sam">
<div id='editor' style="width: 500px"></div>
</body>

<?php
/*
if (!file_exists("$CFG->dirroot/lib/mathslate/$lang/mathslate.php")) {
    $lang = 'en';
}

$editor = get_texteditor('tinymcefour');
//$plugin = $editor->get_plugin('mathslate');

// Prevent https security problems.
$relroot = preg_replace('|^http.?://[^/]+|', '', $CFG->wwwroot);

$htmllang = get_html_lang();

//Loads MathJax if it is included in theme header
//print $OUTPUT->header();

//$PAGE->requires->strings_for_js(array( 'mathslate'),'tinymcefour');

//$elementid=$PAGE->bodyid;


$PAGE->requires->yui_module('moodle-tinymcefour_mathslate-editor',
                                'M.tinymcefour_mathslate.initEditor',
                                array(array('elementid'=>$elementid, 'config'=>$CFG->wwwroot . '/local/mathslate/config.json')),
                                true);
*/
