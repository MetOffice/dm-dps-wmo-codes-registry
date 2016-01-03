// Create UML class display from globals:
//       ClassDiagramClasses
//       ClassDiagramObjectProperties

$(function(){

    // Sizing constants
    var WIDTH = 150;
    var HEIGHT = 60;
    var SPACING = 50;
    var LABEL_WIDTH = 120;
    var LABEL_HEIGHT = 40;

    // New shape types
    var owlClass    = {};
    owlClass.Class = joint.shapes.basic.Generic.extend({

        markup: [
        '<g class="rotatable">',
        '<g class="scalable">',
        '<rect class="owl-class-name-rect"/><rect class="owl-class-attrs-rect"/>',
        '</g>',
        '<text class="owl-class-name-text"/><text class="owl-class-attrs-text"/>',
        '</g>'
        ].join(''),

        defaults: joint.util.deepSupplement({

            type: 'owl.Class',

            attrs: {
                rect: { 'width': 200 },

                '.owl-class-name-rect': { 'stroke': 'black', 'stroke-width': 2, 'fill': '#cfe2f3' },
                '.owl-class-attrs-rect': { 'stroke': 'black', 'stroke-width': 2, 'fill': '#cfe2f3' },

                '.owl-class-name-text': {
                    'ref': '.owl-class-name-rect', 'ref-y': .5, 'ref-x': .5, 'text-anchor': 'middle', 'y-alignment': 'middle', 'font-weight': 'bold',
                    'fill': 'black', 'font-size': 12, 'font-family': 'Arial, helvetica, sans-serif'
                },
                '.owl-class-attrs-text': {
                    'ref': '.owl-class-attrs-rect', 'ref-y': 5, 'ref-x': 5,
                    'fill': 'black', 'font-size': 12, 'font-family': 'Arial, helvetica, sans-serif'
                }
            },

            name: [],
            attributes: []

        }, joint.shapes.basic.Generic.prototype.defaults),

        initialize: function() {

            this.on('change:name change:attributes change:methods', function() {
                this.updateRectangles();
                this.trigger('owl-update');
            }, this);

            this.updateRectangles();

            joint.shapes.basic.Generic.prototype.initialize.apply(this, arguments);
        },

        getClassName: function() {
            return this.get('name');
        },

        updateRectangles: function() {

            var attrs = this.get('attrs');

            var rects = [
            { type: 'name', text: this.getClassName() },
            { type: 'attrs', text: this.get('attributes') }
            ];

            var offsetY = 0;

            _.each(rects, function(rect) {

                var lines = _.isArray(rect.text) ? rect.text : [rect.text];
                var rectHeight = lines.length * 20 + 20;

                attrs['.owl-class-' + rect.type + '-text'].text = lines.join('\n');
                attrs['.owl-class-' + rect.type + '-rect'].height = rectHeight;
                attrs['.owl-class-' + rect.type + '-rect'].transform = 'translate(0,' + offsetY + ')';

                offsetY += rectHeight;
            });
        }
    });

    var labelBlock = joint.shapes.basic.Generic.extend({

        markup: ['<g class="rotatable"><g class="scalable"><rect/></g>',
             '<text class="content"/>',
             '</g>'].join(''),

        defaults: joint.util.deepSupplement({

            type: 'owl.LabelBlock',

            // see joint.css for more element styles
            attrs: {
                rect: {
                    fill: 'white', stroke: 'white', width: LABEL_WIDTH,  height: LABEL_HEIGHT
                },
                text: {
                    fill: 'black', 'font-size': 12, 'font-family': 'Arial, helvetica, sans-serif'
                },
                '.content': {
                    text: '',
                    ref: 'rect',
                    'ref-x': .5,
                    'ref-y': .5,
                    'y-alignment': 'middle',
                    'x-alignment': 'middle'
                }
            },

            content: ''

        }, joint.shapes.basic.Generic.prototype.defaults),

        initialize: function() {
            var attrs = this.get('attrs');
            attrs['.content'].text = this.get('content');
            joint.shapes.basic.Generic.prototype.initialize.apply(this, arguments);
        },

        setDivContent: function(cell, content) {
            // Append the content to div as html.
            cell.attr({ div : {
                html: content
            }});
        }

    });

    var labelPorts = joint.shapes.basic.Generic.extend(_.extend({}, joint.shapes.basic.PortsModelInterface, {

        markup: '<g class="rotatable"><g class="scalable"><rect class="body"/></g><text class="label"/><g class="inPorts"/><g class="outPorts"/></g>',
        portMarkup: '<g class="port port<%= id %>"><circle class="port-body"/><text class="port-label"/></g>',

        defaults: joint.util.deepSupplement({

            type: 'devs.Model',
            size: { width: 1, height: 1 },

            inPorts: ['in'],
            outPorts: ['out'],

            attrs: {
                '.': { magnet: false },
                '.body': {
                    width: 150, height: 250, stroke: 'none'
                },
                '.port-body': {
                    r: 3, magnet: 'passive', stroke: 'none'
                },
                text: {
                    'pointer-events': 'none'
                },
                '.label': { text: '', 'ref-x': .5, 'ref-y': 10, ref: '.body', 'text-anchor': 'middle', 
                             fill: '#000000', 'font-size': 12, 'font-family': 'Arial, helvetica, sans-serif' },
            }

        }, joint.shapes.basic.Generic.prototype.defaults),

        getPortAttrs: function(portName, index, total, selector, type) {

            var attrs = {};

            var portClass = 'port' + index;
            var portSelector = selector + '>.' + portClass;
            var portBodySelector = portSelector + '>.port-body';

            attrs[portBodySelector] = { port: { id: portName || _.uniqueId(type) , type: type } };
            attrs[portSelector] = { ref: '.body', 'ref-x': 0.5};

            if (selector === '.outPorts') { attrs[portSelector]['ref-dy'] = 0; }

            return attrs;
        }
    }));


    var owlPropertyIn = joint.dia.Link.extend({
        defaults: {
            type: 'owl.PropertyIn',
            router: { name: 'manhattan' },
            connector: { name: 'rounded' }
        }
    });

    var owlPropertyOut = joint.dia.Link.extend({
        defaults: {
            type: 'owl.PropertyOut',
            attrs: { '.marker-target': { d: 'M 10 0 L 0 5 L 10 10 z', fill: 'black' }, '.font-size' : 10},
            router: { name: 'manhattan' },
            connector: { name: 'rounded' }
        }
    });

    // Process the classes and properties
    var indexClass = function(cells, classIndex, spec) {
        var wraptext = joint.util.breakText(spec.label, { width: WIDTH });
        var cls = new owlClass.Class({
            size: {width: WIDTH, height: HEIGHT},
            name: wraptext
        });
        classIndex[spec.uri] = cls;
        cells.push(cls);
    };

    var addProperty = function(cells, classIndex, d, r, labelText) {
        var domain = classIndex[d];
        var range = classIndex[r];
        if ( ! _.isUndefined(domain) && ! _.isUndefined(range) ) {
            var wraptext = joint.util.breakText(labelText, { width: LABEL_WIDTH });
            var label = new labelPorts({
                size: {width: LABEL_WIDTH,  height: LABEL_HEIGHT},
                attrs: {
                    '.label': { text: wraptext }
                }
            });
            var inLink = new owlPropertyIn({
                source: { id: domain.id },
                target: { id: label.id, selector: label.getPortSelector('in') },
            });
            var outLink = new owlPropertyOut({
                source: { id: label.id, selector: label.getPortSelector('out') },
                target: { id: range.id },
            });
            cells.push(label);
            cells.push(inLink);
            cells.push(outLink);
        };
    };

    // Create the layout
    var graph = new joint.dia.Graph;

    var paper = new joint.dia.Paper({
        el: $('#paper'),
        width: WIDTH*8,
        height: 1000,
        gridSize: 1,
        model: graph
    });

    // Just give the viewport a little padding.
    V(paper.viewport).translate(10, 10);

    var layout = function() {
        var cells = [];
        var classIndex = {};

        _.each(ClassDiagramClasses, _.partial(indexClass, cells, classIndex));
        _.each(ClassDiagramObjectProperties, function(spec){
            _.each(spec.domain, function(d){
                _.each(spec.range, function(r){
                    addProperty(cells, classIndex, d, r, spec.label);
                });
            });
        });
        _.each(ClassDiagramClasses, function(spec){
            var sub = classIndex[spec.uri];
            _.each(spec.superClasses, function(supURI){
                var sup = classIndex[supURI];
                if ( ! _.isUndefined(sup) ) {
                    var scLink = new joint.shapes.uml.Generalization({ 
                        source: { id: sub.id }, 
                        target: { id: sup.id },
                        router: { name: 'manhattan' },
                        connector: { name: 'rounded' }
                    });
                    cells.push(scLink);
                };
            });
        });

        graph.resetCells( cells );
        joint.layout.DirectedGraph.layout(graph, { setLinkVertices: false });
    }

    layout();

});
