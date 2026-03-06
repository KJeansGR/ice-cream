document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("ice-cream-form");

    form.onsubmit = (e) => {
        clearErrors();

        let name = document.getElementById("name").value.trim();
        let email = document.getElementById("email").value.trim();
        let waf = document.getElementById("waffle");
        let sug = document.getElementById("sugar");
        let cup = document.getElementById("cup");

        if(!name){
            document.getElementById("err-name").style.display = "block";
            e.preventDefault();
        }
        if(!email){
            document.getElementById("err-email").style.display = "block";
            e.preventDefault();
        }
        if(!waf.checked && !sug.checked && !cup.checked){
            document.getElementById("err-cone").style.display = "block";
            e.preventDefault();
        }
    };
});

function clearErrors(){
    let errors = document.getElementsByClassName("err");

    for(let er of errors){
        er.style.display = "none";
    }
}


