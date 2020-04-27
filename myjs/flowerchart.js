
var drug_side_effects_map;
var radardata;
var text_data;
var myChart;

var fisheye = d3.fisheye.circular()
    .radius(200)
    .distortion(2);

var m = new Map();

var width = 600,
    height = 570,
    root;


var force = d3.layout.force()
    .size([width, height])
    .on("tick", tick);

selector="#flower";
var svg = d3.select(selector).append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("x",1000)
    .attr("y", 1000);

var link = svg.selectAll(".link"),
    node = svg.selectAll(".node");
// var nodeEnter = node
//     .append("circle")
//     .attr("class", "circle")
//     .attr("cx", function(d) { return d.x; })
//     .attr("cy", function(d) { return d.y; })
//     .attr("r", 6)
//     .call(force.drag);
var lens = svg.append("circle")
    .attr("class","lens")
    .attr("r", fisheye.radius());


var tool_tip = d3.tip()
    .attr("class", "d3-tip")
    .offset([-8, 0])
    .html(function(d) { return "Name: " + d.name; });
 svg.call(tool_tip);

function update() {
    var nodes = flatten(root),
        links = d3.layout.tree().links(nodes);

    // Restart the force layout.
    force
        .nodes(nodes)
        .links(links)
        .start();

    // Update the links…
    link = link.data(links, function(d) { return d.target.id; });

    // Exit any old links.
    link.exit().remove();

    // Enter any new links.
    link.enter().insert("line", ".node")
        .attr("class", "link")
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    // Update the nodes…
    node = node.data(nodes, function(d) { return d.id; }).style("fill", color);

    // Exit any old nodes.
    node.exit().remove();

    // Enter any new nodes.
    node.enter().append("circle")
        .attr("class", "node")
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })
        .attr("r", function(d) { return Math.sqrt(d.size) / 10 || 4.5; })
        .style("fill", color)
        .on("click", click)
        .on('mouseover', tool_tip.show)
        .on('mouseout', tool_tip.hide);

    svg.on("mousemove", function () {

        fisheye.focus(d3.mouse(this));
        var mouseX = d3.mouse(this)[0];
        var mouseY = d3.mouse(this)[1];
        var r = fisheye.radius();

        lens.attr("cx", mouseX).attr("cy", mouseY);

        node.each(function (d) {
            d.fisheye = fisheye(d);
        });
        link.each(function (d) {
            d.fisheye = fisheye(d);
        });
        node.each(function(d) { d.fisheye = fisheye(d); })
            .attr("cx", function(d) { return d.fisheye.x; })
            .attr("cy", function(d) { return d.fisheye.y; })
            .attr("r", function(d) { return d.fisheye.z * 4.5; });

        link.attr("x1", function(d) { return d.source.fisheye.x; })
            .attr("y1", function(d) { return d.source.fisheye.y; })
            .attr("x2", function(d) { return d.target.fisheye.x; })
            .attr("y2", function(d) { return d.target.fisheye.y; });
    });
    console.log("root in update ",root);
}

function tick() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
}



// Color leaf nodes orange, and packages white or blue.
function color(d) {
    return d._children ? "#3182bd" : d.children ? "#c6dbef" : "#fd8d3c";
}

// Toggle children on click.
function click(d) {
    debugger;
    fisheye.focus(d3.mouse(this));
    var t = d.name;
    document.getElementById('search_bar').value = '';
    unhide();
    if(!d.children && !d._children)
    {
        document.getElementById('drug_results').innerHTML = 'Side Effect Results for '+ d.name;
        document.getElementById("radchar").style.display = "block";
        document.getElementById("drug_results").style.display = "block";
        document.getElementById("drug_side_effects").style.display = "block";
        document.getElementById("heading").style.display = "block";

        if(drug_side_effects_map[d.name][0] === 'x')
        {
            document.getElementById("drug_side_effects").className = "alert bg-danger";
            document.getElementById('drug_side_effects').innerHTML = 'Please Consult your Doctor'.big();
        }

        else
        {
            var foo = document.getElementById("drug_side_effects");

            document.getElementById("drug_side_effects").className = "alert bg-primary";
            foo.innerHTML="";



            var len = drug_side_effects_map[d.name].length;
            for (var side_effect_ind = 0;side_effect_ind < len;side_effect_ind++ )
                {
                    console.log('side_effect',drug_side_effects_map[d.name][side_effect_ind]);
                    add(drug_side_effects_map[d.name][side_effect_ind]);
                }
            radar_function(radardata,d);
        }

    }
    else if (d.children) {
        document.getElementById("radchar").style.display = "none";
        document.getElementById("drug_results").style.display = "none";
        document.getElementById("drug_side_effects").style.display = "none";
        document.getElementById("heading").style.display = "none";

        document.getElementById('results').innerHTML = 'Results for '+ d.name;
        delete_sideeffects();
        populate_map_xy(d,1);
        collapseAll(d);
        word_cloud_id = document.getElementById("wordcloud");
        word_cloud_id.innerHTML="";
        c = d;
        d = parent_node[c.id];
        if(c.name === "symptoms")
            document.getElementById('results').innerHTML='Results';
        else
            document.getElementById('results').innerHTML = 'Results for '+ d.name;
        word_map = new Map();
        populate_word_cloud(d);
        words=[];
        d3.select("#wordcloud").innerHTML = "";

        topics = Object.keys(word_map);
        auto_func(topics);
        d.x= node_xymap[d.name]['x'];
        d.y= node_xymap[d.name]['y'];
        d.px= node_xymap[d.name]['px'];
        d.py= node_xymap[d.name]['py'];
        console.log('after',d);
    } else {
        document.getElementById('results').innerHTML = 'Results for '+ d.name;
        document.getElementById('drug_results').innerHTML = "Results";
        document.getElementById('drug_side_effects').innerHTML = '';

        document.getElementById('drug_results').style.display = "none";
        document.getElementById("radchar").style.display = "none";
        document.getElementById("drug_results").style.display = "none";
        document.getElementById("drug_side_effects").style.display = "none";
        document.getElementById("heading").style.display = "none";

        delete_sideeffects();
        populate_map_xy(d,2);
        console.log("click function",d);
        d.children = d._children;
        d._children = null;
        word_map = new Map();
        populate_word_cloud(d);
        words=[];
        d3.select("#wordcloud").innerHTML = "";
        topics = Object.keys(word_map);
        auto_func(topics);
        d.x= node_xymap[d.name]['x'];
        d.y= node_xymap[d.name]['y'];
        d.px= node_xymap[d.name]['px'];
        d.py= node_xymap[d.name]['py'];
    }

    update();

    node.each(function (d) {
        d.fisheye = fisheye(d);
    });
    link.each(function (d) {
        d.fisheye = fisheye(d);
    });
    node.each(function(d) { d.fisheye = fisheye(d); })
        .attr("cx", function(d) { return d.fisheye.x; })
        .attr("cy", function(d) { return d.fisheye.y; })
        .attr("r", function(d) { return d.fisheye.z * 4.5; });

    link.attr("x1", function(d) { return d.source.fisheye.x; })
        .attr("y1", function(d) { return d.source.fisheye.y; })
        .attr("x2", function(d) { return d.target.fisheye.x; })
        .attr("y2", function(d) { return d.target.fisheye.y; });
}
parent_node = new Map();
// Returns a list of all nodes under the root.
function flatten(root) {
    var nodes = [], i = 0;
    function recurse(node,name) {
        if (node.children) {
            node.children.forEach(function(child)
            {
                recurse(child, node.name);
            });
        }
        m[name+node.name]=node;
        if (!node.id) node.id = ++i;

        if (node.children) {
            node.children.forEach(function(child)
            {
                parent_node[child.id]=node;
            });
        }
        nodes.push(node);
    }

    recurse(root, "");

    return nodes;
}

function collapseAll(node){
    console.log("root", node);
    node.children.forEach(collapse);
    collapse(node);
    update(node);
}

function collapse(d) {
    if (d.children) {
        d._children = d.children;
        d._children.forEach(collapse);
        d.children = null;
    }
}

function expand(d){
    var children = (d.children)?d.children:d._children;
    if (d._children) {
        d.children = d._children;
        d._children = null;
    }
    if(children)
        children.forEach(expand);
}

function expandAll(){
    console.log(root);
    expand(root);
    update(root);
}

function func() {
    x = root.children;
    y = root._children;
    collapseAll(root);
    root.children = null;
    root._children = x;
}
function populate_word_cloud(node)
{
    words=[];
    node.children.forEach(function(child)
    {
        new_node_json_object=child;
        new_node_json_object.text=child.name;
        new_node_json_object.size= 50;
        words.push(new_node_json_object);
    });
    console.log("words",words);
    word_cloud_id = document.getElementById("wordcloud");
    word_cloud_id.innerHTML="";
    word_c();
}
/////////////
function addCode(code){
    var JS = document.createElement('script');
    JS.text = code;
    document.body.appendChild(JS);
}

////////////
node_xymap={};
function populate_map_xy(node, val)
{
    console.log("Inside Populate");
    new_pos_obj={};
    if(val === 1)
    {
        node.children.forEach(function(child)
        {
            new_pos_obj['x']=child.x;
            new_pos_obj['y']=child.y;
            new_pos_obj['px']=child.px;
            new_pos_obj['py']=child.py;

            node_xymap[child.name] = new_pos_obj;
        });
    }
    else if(val === 2)
    {
        node._children.forEach(function(child)
        {

            new_pos_obj['x']=child.x;
            new_pos_obj['y']=child.y;
            new_pos_obj['px']=child.px;
            new_pos_obj['py']=child.py;


            node_xymap[child.name] = new_pos_obj;
        });
    }
    new_pos_obj={};
    new_pos_obj['x']=node.x;
    new_pos_obj['y']=node.y;
    new_pos_obj['px']=node.px;
    new_pos_obj['py']=node.py;
    node_xymap[node.name] = new_pos_obj;
}

