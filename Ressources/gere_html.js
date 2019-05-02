function creerPartieMenu(){
    $("#accueil").hide();
    $("#creerUnePartie").show();
}

function rejoindrePartieMenu(){
    $("#accueil").hide();
    $("#rejoindreUnePartie").show();
}

function onFileSelected(event,imageId){

    var selectedFile = event.target.files[0];
    var reader = new FileReader();

    var imgtag = document.getElementById(imageId);
    imgtag.title = selectedFile.name;

    reader.onload = function(event) {
        imgtag.src = event.target.result;
        $("#"+imageId).data("base64",event.target.result)
    };

    reader.readAsDataURL(selectedFile);
}

$(document).on("click", ".left_arrow", function(){
    $(this).parent().hide();
    $("#accueil").show();
});

$(document).on("click", ".file-select-button", function(){
    $(this).prev().click();
    console.log($(this));
});