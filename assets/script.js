var data = [
    { "id" : 0, "title" : "محايد", "sound" : "water_please.mp3" },
    { "id" : 1, "title" : "الناقص", "sound" : "oh_my_god.mp3" },
    { "id" : 2, "title" : "تبادل مع اليمين", "sound" : "ewa_yahamiid.mp3" },
    { "id" : 3, "title" : "عاود", "sound" : "rrend.mp3" },
    { "id" : 4, "title" : "محايد", "sound" : "water_please.mp3" },
    { "id" : 5, "title" : "الزائد", "sound" : "b9a_fiya_l7al.mp3" },
    { "id" : 6, "title" : "عفو ملكي", "sound" : "impossi.mp3" },
    { "id" : 7, "title" : "محايد", "sound" : "water_please.mp3" },
    { "id" : 8, "title" : "تخطي جولة", "sound" : "water_please.mp3" },
    { "id" : 9, "title" : "محايد", "sound" : "water_please.mp3" },
    { "id" : 10, "title" : "بالصحة والراحة", "sound" : "new_level.mp3" }
];

var padding, svg, container, vis, pie, arc, arcs, audio, oldpick = [];
reset();

function spin(d){
    
    container.on("click", null);
    if(oldpick.length == data.length){
        reset();
        return;
    }
    audio = new Audio('./assets/Sounds/aller_ssi_brahim.mp3');
    var  ps       = 360/data.length,
            pieslice = Math.round(1440/data.length),
            rng      = Math.floor((Math.random() * 1440) + 360);
        
    rotation = (Math.round(rng / ps) * ps);
    
    picked = Math.round(data.length - (rotation % 360)/ps);
    picked = picked >= data.length ? (picked % data.length) : picked;
    if(oldpick.indexOf(picked) !== -1){
        d3.select(this).call(spin);
        return;
    } else {
        oldpick.push(picked);
    }
    rotation += 90 - Math.round(ps/2);
    audio.play();
    vis.transition()
        .duration(11000)
        .attrTween("transform", rotTween)
        .each("end", function(){
            //mark res as seen
            audio = new Audio('./assets/Sounds/'+data[picked].sound);
            d3.select(".slice:nth-child(" + (picked + 1) + ") path")
            .attr("fill", "#000");
            //populate res
            d3.select("#res")
            .text(data[picked].res);
            oldrotation = rotation;
            
            /* Get the result value from object "data" */
            console.log(data[picked].id)
            
            /* Comment the below line for restrict spin to sngle time */
            container.on("click", spin);
            audio.play();
        });
}

function rotTween(to) {
    var i = d3.interpolate(oldrotation % 360, rotation);
    return function(t) {
    return "rotate(" + i(t) + ")";
    };
}


function getRandomNumbers(){
    var array = new Uint16Array(1000);
    var scale = d3.scale.linear().range([360, 1440]).domain([0, 100000]);
    if(window.hasOwnProperty("crypto") && typeof window.crypto.getRandomValues === "function"){
        window.crypto.getRandomValues(array);
        console.log("works");
    } else {
        //no support for crypto, get crappy random numbers
        for(var i=0; i < 1000; i++){
            array[i] = Math.floor(Math.random() * 100000) + 1;
        }
    }
    return array;
}



function reset() {
    let n = true;
    if (oldpick.length > 0)
    {
        data = data.filter((v, k) => {
            if (v.id == 10 && oldpick.find(val => data[val].id == v.id) == undefined)
                return v;
            if (v.id != 10)
            {
                if ((v.id == 0) || (v.id == 4) || (v.id == 7) || (v.id == 9))
                {
                    if (oldpick.find(val => data[val].id == v.id) != undefined && n)
                        n = false;
                    else
                        return v;
                }
                else
                    return v;
            }
        });
        oldpick = [];
    }
    d3.select('#chart').html("");
    padding = {top:20, right:40, bottom:0, left:0},
        w = 500 - padding.left - padding.right,
        h = 500 - padding.top  - padding.bottom,
        r = Math.min(w, h)/2,
        rotation = 0,
        oldrotation = 0,
        picked = 100000,
        oldpick = [],
        color = d3.scale.category20();
    svg = d3.select('#chart')
        .append("svg")
        .data([data])
        .attr("width",  w + padding.left + padding.right)
        .attr("height", h + padding.top + padding.bottom);
    container = svg.append("g")
        .attr("class", "chartholder")
        .attr("transform", "translate(" + (w/2 + padding.left) + "," + (h/2 + padding.top) + ")");
    vis = container
    .append("g");
    pie = d3.layout.pie().sort(null).value(function(d){return 1;});
    // declare an arc generator function
    arc = d3.svg.arc().outerRadius(r);
    // select paths, use arc generator to draw
    arcs = vis.selectAll("g.slice")
        .data(pie)
        .enter()
        .append("g")
        .attr("class", "slice");
    arcs.append("path")
        .attr("fill", function(d, i){ return color(i); })
        .attr("d", function (d) { return arc(d); });
    // add the text
    arcs.append("text").attr("transform", function(d){
            d.innerRadius = 0;
            d.outerRadius = r;
            d.angle = (d.startAngle + d.endAngle)/2;
            return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")translate(" + (d.outerRadius -10) +")";
        })
        .attr("text-anchor", "end")
        .text( function(d, i) {
            return data[i].title;
        });
    //make arrow
    svg.append("g")
    .attr("transform", "translate(" + (w + padding.left + padding.right) + "," + ((h/2)+padding.top) + ")")
    .append("path")
    .attr("d", "M-" + (r*.15) + ",0L0," + (r*.05) + "L0,-" + (r*.05) + "Z")
    .style({"fill":"black"});
    //draw spin circle
    container.append("circle")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", 60)
    .style({"fill":"white","cursor":"pointer"});
    //spin text
    container.append("text")
    .attr("x", 0)
    .attr("y", 15)
    .attr("text-anchor", "middle")
    .text("SPIN")
    .style({"font-weight":"bold", "font-size":"30px"});

    container.on("click", spin);
}