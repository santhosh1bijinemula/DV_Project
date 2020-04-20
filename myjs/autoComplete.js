my_autofunc = null;
/*function auto_func(topics){
    $("#autocomplete").autocomplete({
        source: topics
    });
}
*/
$(function () {
    topics= ['symptoms'];
    //my_autofunc = auto_func(topics);

});

$(document).ready(function () {
    //word_c();
    d3.json("final_map.json", function(error, json) {
        if (error) throw error;
        root = json;
        update();
        func();
    });
});


function hideall()
{
    document.getElementById("drug_results").style.display = "none";
    document.getElementById("drug_side_effects").style.display = "none";
    document.getElementById("results").style.display = "none";
    document.getElementById("wordcloud").style.display = "none";
    document.getElementById("panel").style.display = "none";
    document.getElementById("search_bar").style.display = "none";
    document.getElementById("col_panel").style.display = "none";
}