//
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

if (M) {M.tinymce_mathslate = M.tinymce_mathslate || {};}
var NS = M && M.tinymce_mathslate || {};
var CSS = {
   EDITOR: 'mathslate-tinymce',
   TOOLBOX: 'mathslate-toolbox',
   DRAGNODE: 'mathslate-toolbox-drag',
   UNDO: 'mathslate-undo-button',
   REDO: 'mathslate-redo-button',
   CLEAR: 'mathslate-clear-button',
   HELP: 'mathslate-help-button'
};
/* Constructor function for an editor of a page.
 * @method Editor
 * @param string editorID
 * @param string config
 */
NS.Editor=function(editorID,config){
    this.node=Y.one(editorID);
    this.node.setHTML(M.util.get_string('nomathjax','tinymce_mathslate'));
    if(!MathJax){
        return;
    }
    this.node.setHTML('');
    //Set MathJax to us HTML-CSS rendering on all browsers
    MathJax.Hub.setRenderer('HTML-CSS');
    var toolboxID=Y.guid();
    var workID=Y.guid();
    this.node.addClass(CSS.EDITOR);
    //Place math editor on page
    this.node.appendChild(Y.Node.create('<div id="' +toolboxID +'" class="'+CSS.TOOLBOX+'">'));
    this.node.appendChild(Y.Node.create('<div id="' +workID +'" >'));

    var mje=new NS.MathJaxEditor('#'+workID);

    var me=this;
    me.output = function(f){return mje.output(f);};

    var tbox={tools: [],
        fillToolBox: function(tools){
        function Tool(snippet) {
            function findBlank(snippet) {
                if (Array.isArray(snippet[2])) {
                    snippet[2].forEach(function(a){
                    if (Array.isArray(a)) {
                            findBlank(a);
                        }
                        else if(a==='[]') {
                        newID=Y.guid();
                        snippet[2][snippet[2].indexOf(a)]=['mn',{},'[]'];
                        }
                    });
                }
            }
            this.id=Y.guid();

            function title(s){
                if(typeof s==='string'){return s;}
                if(s[1]==='undefined'){return '';}
                var o='';
                if(typeof s[1].tex!=='undefined'){
                    s[1].tex.forEach(function(t){
                         if(typeof t==='string'){o+=t;}
                         else {o+=title(s[2][t]);}
                    });
                    return o;
                }
                if(typeof s[2]==='string'){return s[2];}
                if(typeof s[2]==='undefined'){return '';}
                s[2].forEach(function(t){o+=title(t);});
                return o;
            }
            this.json=JSON.stringify(snippet);
            this.HTMLsnippet=[['span', {id: this.id, title: title(snippet)}, [['math', {}, [snippet]]]]];

            findBlank(snippet);
            tbox.tools.push(this);
        }
        var tabs={children: [{label: "<span title=\"TeX\"><math><mi>T</mi><mspace width=\"-.14em\"/>"
             +"<mpadded height=\"-.5ex\" depth=\"+.5ex\" voffset=\"-.5ex\">"
             +"<mrow class=\"MJX-TeXAtom-ORD\"><mi>E</mi></mrow></mpadded>"
             +"<mspace width=\"-.115em\" /> <mi>X</mi> </math></span>",
        content: "<span id='latex-input'></span>"}]};
        tools.forEach(function(tab){
            var q=Y.Node.create('<p></p>');
            tab.tools.forEach(function(snippet){
                var t = new Tool(snippet);
                MathJax.HTML.addElement(q.getDOMNode(),'span',{},t.HTMLsnippet);
                if(snippet[0]&&snippet[0]!=='br'){q.append('&thinsp; &thinsp;');}
                });
            tabs.children.push({label: tab.label, content: q.getHTML()});
        });
        var tabview = new Y.TabView(
            tabs
            );
        if(Y.one('#'+toolboxID)){
            tabview.render('#'+toolboxID);
            new NS.TeXTool('#latex-input',function(json){mje.addMath(json);});
        }

    },
        getToolByID: function(id){
        var t;
        this.tools.forEach(function(tool){
            if(tool.id){ if(tool.id===id) {t=tool;}}
        });
        return t;
    }
    };


    mje.canvas.on('drop:hit',function(e){
        if(e.drag.get('data')) {
            mje.addMath(e.drag.get('data'));
        }
    });
 /* function passed to MathJax to initiate dragging after math is formated
  * @function makeToolsDraggable
  */
    function makeToolsDraggable(){
        tbox.tools.forEach(function(tool) {
            Y.one('#'+tool.id).on('click',function(){
                mje.addMath(tool.json);
            });
            var d=new Y.DD.Drag({node: '#'+tool.id});
            d.set('data',tool.json);
            d.on('drag:start', function() {
                this.get('dragNode').addClass(CSS.DRAGNODE);
            });
            d.on('drag:end', function() {
                this.get('node').setStyle('top' , '0');
                this.get('node').setStyle('left' , '0');
                this.get('node').removeClass(CSS.DRAGNODE);
            });
        });
    }

    //Fetch configuration string for tools and initialyze
    Y.on('io:success',function(id,o){
        if(tbox.tools.length===0) {
            tbox.fillToolBox(Y.JSON.parse(o.response));
            MathJax.Hub.Queue(["Typeset",MathJax.Hub,toolboxID]);
            MathJax.Hub.Queue(makeToolsDraggable);
        }
    });
    if(config===undefined) {
        Y.io(NS.config);
    } else {
        Y.io(config);
    }
};
