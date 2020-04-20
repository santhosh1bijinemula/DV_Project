// word frequencies of first two chapters of Oliver Twist
function word_c(){
  d3.wordcloud()
      .size([600, 150])
      .fill(d3.scale.ordinal().range(["#884400", "#448800", "#888800", "#444400"]))
      .words(words)
      .onwordclick(function(d, i) {
        if(!d.children && !d._children)
        {
          document.getElementById('drug_results').innerHTML = 'Side Effects for '+ d.name;
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
        }
        else{
          console.log("click:", d);
          document.getElementById('drug_results').innerHTML ="Results";
          document.getElementById('results').innerHTML='Results for '+ d.name;
          word_click(d);
          populate_word_cloud(d);
        }

      })
      .start();
}

word_map = new Map();

var words = [];