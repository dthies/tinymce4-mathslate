// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Text editor mathslate plugin.
 *
 * @package    tinymce_mathslate
 * @copyright  2013 Daniel Thies  <dthies@ccal.edu>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

M.tinymce_mathslate = M.tinymce_mathslate|| {};
var NS = M && M.tinymce_mathslate || {};
/* Constructor function for an editor of a page.
 * @method Editor
 * @param string editorID
 * @param string config
 */
NS.TeXTool=function(editorID,addMath){
    var input=Y.Node.create('<input type="text">');
    var tool=Y.Node.create('<span>\\[ \\]</span>');
    if(addMath){
        tool.on('click',function(){
            addMath(tool.json);
        });
    }
    Y.one(editorID).appendChild(input);
    Y.one(editorID).appendChild(tool);
    input.focus();
    var drag=new Y.DD.Drag({node: tool});
    drag.on('drag:end', function() {
        this.get('node').setStyle('top' , '0');
        this.get('node').setStyle('left' , '0');
    });
    input.on ('change',function(){
        var jax = MathJax.Hub.getAllJax(tool.generateID())[0];
        MathJax.Hub.Queue(['Text',jax,input.getDOMNode().value]);
        MathJax.Hub.Queue(["Typeset",MathJax.Hub,tool.generateID()]);

        var snippet;
        function findSnippet() {
            var mml = MathJax.Hub.getAllJax(tool.generateID())[0].root.toMathML();
            mml = mml.replace(/.*<math xmlns=\"http:\/\/www.w3.org\/1998\/Math\/MathML\" display=\"block\">\s*/,'[').replace(/\s*<\/math.*/,']');
            if (/<mtext mathcolor="red">/.test(mml)||/<merror/.test(mml)) {
                console.log(mml);
                snippet=[''];
                tool.json=null;
                MathJax.Hub.Queue(['Text',jax,'']);
                //tool.setHTML('Unrecognized Expression');
                return;
            }
            //console.log(mml);
            snippet = mml.replace('<mrow>', '["mrow",{"tex": "'+input.getDOMNode().value +'"},[');
            snippet = snippet.replace(/ class="[^"]*"/g,'');
            ['mrow','mfrac','msub','msup','msubsup','munder','mover','munderover','msqrt','mroot','mtable','mtr','mtd'].forEach(function(tag){
                snippet = snippet.replace(new RegExp('<'+tag+'>','g'),'["'+tag+'",{},[').replace(new RegExp('</'+tag+'>',"g"),"]],");
            });
            snippet=snippet.replace(/<mo stretchy="false">/g,'["mo",{"stretchy": "false"},"');
    
            ['mo','mi','mn','mtext'].forEach(function(tag){
                snippet = snippet.replace(new RegExp('<'+tag+'>','g'),'["'+tag+'",{},"').replace(new RegExp('</'+tag+'>',"g"),'"],');
            });

            snippet=snippet.replace(/<mi mathvariant="([a-z]*)">/g,'["mi",{"mathvariant": "$1"},"');
            snippet=snippet.replace(/<mtable rowspacing="([^"]*)" columnspacing="([^"]*)">/g,'["mtable", {"rowspacing":"$1","columnspacing":"$2"},[');
            snippet=snippet.replace(/<mstyle displaystyle="true">/g,'["mstyle",{"displaystyle": "true"},[').replace(/<\/mstyle>/g,']]');
            snippet=snippet.replace(/,\s*\]/g,']');
            snippet=snippet.replace(/\\/g,'\\\\');
            snippet=snippet.replace(/<!--.*?-->/g,'');
            snippet=snippet.replace(/&#x([\dA-F]{4});/g,'\\u$1');

            snippet='["mrow", {"tex":["'+input.getDOMNode().value.replace(/\\/g,'\\\\')+'"]},' + snippet + ']';
    
            console.log(snippet);
            tool.json=snippet;
            if(/<[a-z]/.test(snippet)){
                console.log(snippet);
                snippet=[''];
                tool.json=null;
                return;
            }
            snippet=[Y.JSON.parse(snippet)];
        }
        MathJax.Hub.Queue(findSnippet);

        MathJax.Hub.Queue(function(){
            drag.set('data',tool.json);
            addMath(tool.json);
        });
    });
};

