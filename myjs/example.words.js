// word frequencies of first two chapters of Oliver Twist
function word_c(){
  d3.wordcloud()
      .size([600, 240])
      .fill(d3.scale.ordinal().range(["#884400", "#448800", "#888800", "#444400"]))
      .words(words)
      .onwordclick(function(d, i) {
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
            foo.className = "alert bg-primary";
            foo.innerHTML="";
            var len = drug_side_effects_map[d.name].length;
            for (var side_effect_ind = 0;side_effect_ind < len;side_effect_ind++ )
            {
              console.log('side_effect',drug_side_effects_map[d.name][side_effect_ind]);
              add(drug_side_effects_map[d.name][side_effect_ind]);
            }
            console.log('drug_sideeffects',drug_side_effects_map[d.name]);
          }
          radar_function(radardata,d);
        }
        else{
          console.log("click:", d);
          document.getElementById('drug_results').innerHTML ="Results";
          document.getElementById('results').innerHTML='Results for '+ d.name;
          word_click(d);
          word_map= new Map();
          populate_word_cloud(d);
          topics = Object.keys(word_map);
          auto_func(topics);
        }

      })
      .start();
}

word_map = new Map();
word_pos_map = new Map();
wordcloud_map = new Map();
var global_text;
var words = [];

function search_func(val)
{
    var arr = Object.keys(word_pos_map);
    if(arr.includes(val))
    {
        console.log("global text", word_pos_map[val]);
        for (const [key, value] of Object.entries(word_pos_map)) {
            d3.select(word_pos_map[key]).transition().style('font-size', wordcloud_map[key].size + 'px');
        }
        d3.select(word_pos_map[val]).transition().style('font-size', wordcloud_map[val].size + 15 + 'px');

        document.getElementById('search_bar').value = '';
    }

}
