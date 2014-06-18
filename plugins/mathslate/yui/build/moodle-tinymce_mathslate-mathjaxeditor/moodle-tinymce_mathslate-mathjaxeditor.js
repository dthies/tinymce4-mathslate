YUI.add('moodle-tinymce_mathslate-mathjaxeditor', function (Y, NAME) {

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
 * @copyright  2013-2014 Daniel Thies  <dthies@ccal.edu>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
M.tinymce_mathslate = M.tinymce_mathslate|| {};
NS = M && M.tinymce_mathslate || {};
var CSS = {
    SELECTED: 'mathslate-selected',
    WORKSPACE: 'mathslate-workspace',
    PREVIEW: 'mathslate-preview',
    HIGHLIGHT: 'mathslate-highlight',
    DRAGNODE: 'mathslate-workspace-drag',
    DRAGGEDNODE: 'mathslate-workspace-dragged',
    HELPBOX: 'mathslate-help-box',
    PANEL: 'mathslate-bottom-panel'
};
var SELECTORS = {
    SELECTED: '.' + CSS.SELECTED,
    HIGHLIGHT: '.' + CSS.HIGHLIGHT
};
       
//Constructor for equation workspace
NS.MathJaxEditor=function(id){
        var math=[];
        var se=new NS.mSlots();
        se.slots.push(math);
        this.workspace=Y.one(id).append('<div id="canvas" class="'+CSS.WORKSPACE+'"/>');
        var toolbar= Y.one(id).appendChild(Y.Node.create('<form></form>'));
        var preview = Y.one(id).appendChild(Y.Node.create('<div class="'+CSS.PANEL+'"/>'));
        preview.delegate('click',function(e){
            canvas.get('node').one('#'+this.getAttribute('id')).handleClick(e);
        },'div');
        var canvas=new Y.DD.Drop({
            node: this.workspace.one('#canvas')});
        this.canvas=canvas;
        this.canvas.get('node').on('click',function(){
            se.select();
            render();
        });

    //Place buttons for internal editor functions
/*
    var undo=Y.Node.create('<button type="button" class="'
           +CSS.UNDO+'">'+ '<img class="iiicon" aria-hidden="true" role="presentation" width="16" height="16" src="'
           + M.util.image_url('undo', 'editor_tinymce') + '" title="'+M.util.get_string('undo','tinymce_mathslate')+'"/></button>');
    var redo=Y.Node.create('<button type="button" class="'
           +CSS.REDO+'">'+ '<img class="iiicon" aria-hidden="true" role="presentation" width="16" height="16" src="'
           + M.util.image_url('redo', 'editor_tinymce') + '" title="'+M.util.get_string('redo','tinymce_mathslate')+'"/></button>');
    var clear=Y.Node.create('<button type="button" class="'
           +CSS.CLEAR+'">'+ '<img class="iiicon" aria-hidden="true" role="presentation" width="16" height="16" src="'
           + M.util.image_url('delete', 'editor_tinymce') + '" title="'+M.util.get_string('clear','tinymce_mathslate')+'"/></button>');
    var help=Y.Node.create('<button type="button" class="'
           +CSS.HELP+'">'+ '<img class="iiicon" aria-hidden="true" role="presentation" width="16" height="16" src="'
           + M.util.image_url('help', 'core') + '" title="'+M.util.get_string('help','tinymce_mathslate')+'"/></button>');
*/

    var undo=Y.Node.create('<button type="button" class="' + CSS.UNDO+'"'
           + '" title="'+M.util.get_string('undo','tinymce_mathslate')+'"/>'
           +'<math><mo>&#x25C1;</mo></math>'
           +'</button>');

    var redo=Y.Node.create('<button type="button" class="' + CSS.REDO+'"'
           + '" title="'+M.util.get_string('redo','tinymce_mathslate')+'"/>'
           +'<math><mo>&#x25B7;</mo></math>'
           +'</button>');
    var clear=Y.Node.create('<button type="button" class="' + CSS.CLEAR+'"'
           + '" title="'+M.util.get_string('clear','tinymce_mathslate')+'"/>'
           +'<math><mi>&#x2718;</mi></math>'
           +'</button>');

    var help=Y.Node.create('<button type="button" class="'
           +CSS.HELP+'" title="'
           + M.util.get_string('help','tinymce_mathslate')+'">'
           +'<math><mi>&#xE47C;</mi></math>'
           + '</button>');
    toolbar.appendChild(clear);
    toolbar.appendChild(undo);
    toolbar.appendChild(redo);
    toolbar.appendChild(help);

        redo.on('click',function(){
            se=se.redo();
            math = se.slots[0];
            render();
        });
        undo.on('click',function(){
            se=se.undo();
            math = se.slots[0];
            render();
        });
        clear.on('click',function(){
            if(Y.one(SELECTORS.SELECTED)){
                se.removeSnippet(Y.one(SELECTORS.SELECTED).getAttribute('id'));
            } else {
                math=[];
                se.next=new NS.mSlots();
                se.next.previous=se;
                se=se.next;
                se.slots.push(math);
            }
            render();
        });
 
    help.on('click', function(){
        preview.setHTML('<iframe src="'+NS.help+'" style="width: '
            + preview.getStyle('width') + '" class="'+CSS.HELPBOX+'"/>');
    });
/* Add drag and drop functionality
 * @function makeDraggable
 */
        function makeDraggable () {
            preview.setHTML('<div class="'+CSS.PREVIEW+'">'+se.preview('tex')+'</div>');
            if(se.getSelected()&&preview.one('#'+se.getSelected())) {
                canvas.get('node').one('#'+se.getSelected()).addClass(CSS.SELECTED);
                preview.one('#'+se.getSelected()).addClass(CSS.SELECTED);
            }
                
            se.forEach(function(m){
                var node=canvas.get('node').one('#'+m[1].id);
                if(!node){return;}
                node.setAttribute('title', preview.one('#'+m[1].id).getHTML().replace(/<div *[^>]*>|<\/div>|<br>/g,''));
                node.handleClick = function(e) {
                    var selectedNode = canvas.get('node').one(SELECTORS.SELECTED);
                    if(!selectedNode){
                        e.stopPropagation();
                        se.select(this.getAttribute('id'));
                        render();
                        return;
                    }
                    if(selectedNode===node){
                        node.removeClass(CSS.SELECTED);
                        preview.one('#'+node.getAttribute('id')).removeClass(CSS.SELECTED);
                        se.select();
                        return;
                    }
                    if(selectedNode.one('#'+this.getAttribute('id'))){
                        return;
                    }
                    if(node.one('#'+selectedNode.getAttribute('id'))){
                        return;
                    }
                    e.stopPropagation();
                    se.insertSnippet(selectedNode.getAttribute('id'), se.removeSnippet(node.getAttribute('id')));
                    render();
                };
                node.on('click',function(e) {
                    this.handleClick(e);
                });
                node.on('dblclick',function(e){
                    e.stopPropagation();
                    se.removeSnippet(node.getAttribute('id'));
                    render();
                });
                var selectedNode = canvas.get('node').one(SELECTORS.SELECTED);
                if((!m[1]||!m[1]['class']||m[1]['class']!=='blank') &&
                        !(selectedNode && selectedNode.one('#'+node.getAttribute('id')))){
                    var drag = new Y.DD.Drag({node: node}).plug(Y.Plugin.DDProxy, {
                        resizeFrame: false,
                        moveOnEnd: false
                    });
                    drag.on('drag:start', function(){
                        if(canvas.get('node').one(SELECTORS.SELECTED)){
                            se.select();
                            canvas.get('node').one(SELECTORS.SELECTED).removeClass(CSS.SELECTED);
                        }
                        this.get('node').addClass(CSS.DRAGGEDNODE);
                        var id = Y.guid();
                        this.get('dragNode').set('innerHTML','' );
                        this.get('dragNode').addClass(CSS.DRAGNODE);
                        MathJax.Hub.Queue(['addElement',MathJax.HTML,
                            this.get('dragNode').getDOMNode(),'span',{id: id},
                            [['math',{display: "block"},[Y.JSON.parse(se.getItemByID(m[1].id))]]]]);
                        MathJax.Hub.Queue(['Typeset',MathJax.Hub,id]);
                    });
                    drag.on('drag:end', function(){
                        this.get('node').removeClass(CSS.DRAGGEDNODE);
                    });
                }

                var drop = new Y.DD.Drop({node: node});
                drop.on('drop:hit',function(e){
                    var dragTarget=e.drag.get('node').get('id');
                    if(e.drag.get('data')) {
                        se.insertSnippet(m[1].id,se.createItem(e.drag.get('data')));
                    }
                    else if(dragTarget!==m[1].id&&se.isItem(dragTarget)&&!canvas.get('node').one('#'+dragTarget).one('#'+m[1].id)) {
                        se.insertSnippet(e.drop.get('node').get('id'), se.removeSnippet(dragTarget));
                    }
                    render();
                });
                drop.on('drop:enter',function(e){
                    e.stopPropagation();
                    canvas.get('node').all(SELECTORS.HIGHLIGHT).each(function(n){
                         n.removeClass(CSS.HIGHLIGHT);
                    });
                    this.get('node').addClass(CSS.HIGHLIGHT);
                });
                drop.on('drop:exit',function(e){
                    e.stopPropagation();
                    this.get('node').removeClass(CSS.HIGHLIGHT);
                });
                
            });
        }
        function render() {
            se.rekey();
            canvas.get('node').setHTML('');
            MathJax.Hub.Queue(['addElement',MathJax.HTML,canvas.get('node').getDOMNode(),'math',{display: "block"},math]);
            MathJax.Hub.Queue(["Typeset",MathJax.Hub, 'canvas']);
            MathJax.Hub.Queue(makeDraggable);
        }
        this.render = render;
/* Method for add adding an object to the workspace
 * @method addMath
 * @param string json
 */
        this.addMath=function(json){
            if(!json){
                return;
            }
            if(Y.one(SELECTORS.SELECTED)){
                se.insertSnippet(Y.one(SELECTORS.SELECTED).getAttribute('id'),se.createItem(json));
            } else {
                se.append(se.createItem(json));
            }
            render();
        };
/* Unselected the selected node if any
 * @method clear
 */
        this.clear = function(){
            if(Y.one(SELECTORS.SELECTED)){
                se.removeSnippet(Y.one(SELECTORS.SELECTED).getAttribute('id'));
            } else {
                math=[];
                se.next=new NS.mSlots();
                se.next.previous=se;
                se=se.next;
                se.slots.push(math);
            }
            render();
        };
/* Return output in various formats
 * @method output
 * @param string format
 */
        this.output = function(format){
            function cleanSnippet(s) {
                if (typeof s !== "object") { return s; }
                var t = s.slice(0);
                t.forEach(function(m,index) {
                    if (typeof m !== "object") { return; }
                    if (m[1] && m[1]['class']) {
                        t[index] = '[]';
                        return;
                    }
                    if (m[1] && m[1].id) {
                        delete m[1].id;
                    }
                    if (m[2]) {
                        m[2] = cleanSnippet(m[2]);
                    }
                });
                return t;
            }
            if(format==='MathML') {
                return canvas.get('node').one('script').getHTML();
            }
            if(format==='HTML') {
                return canvas.get('node').one('span').getHTML();
            }
            if(format==='JSON') {
                return Y.JSON.stringify(cleanSnippet(math));
            }
            return se.output(format);
        };
        this.getHTML = function(){
            return canvas.get('node').one('span').getHTML();
        };
        this.redo = function(){
            se = se.redo();
            math = se.slots[0];
            render();
        };
        this.undo = function(){
            se = se.undo();
            math = se.slots[0];
            render();
        };
        render();
};


}, '@VERSION@', {"requires": ["moodle-tinymce_mathslate-snippeteditor", "dd-proxy", "dd-drop"]});
