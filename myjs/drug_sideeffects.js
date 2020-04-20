function add(keyword) {
    console.log('keyword',keyword);
    //Create an input type dynamically.
    var element = document.createElement("input");

    //Assign different attributes to the element.
    element.setAttribute("type", "button");
    element.setAttribute("value", keyword);
    element.setAttribute("name", keyword);
    element.setAttribute("class", "btn btn-sm btn-danger");
    element.setAttribute("id", "backMe");
    element.onclick = function () {

    };

    var foo = document.getElementById("drug_side_effects");
    var arr = Array.from(foo.children);
    var flag = 1;
    if (keyword != "") {
        arr.forEach(function (d) {
            if (d.value == keyword) {
                flag = 0;
            }
        });

        if (flag == 1 || foo.childElementCount == 0) {
            foo.appendChild(element); //Append the element in page (in span).
        }
    }
}

function delete_sideeffects(){
    var foo = document.getElementById("drug_side_effects");
    document.getElementById("drug_side_effects").className = "alert bg-primary";
    foo.innerHTML="";
}