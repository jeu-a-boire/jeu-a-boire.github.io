function creerPartieMenu(){
    $("#accueil").hide();
    $("#creerUnePartie").show();
}

function rejoindrePartieMenu(){
    $("#accueil").hide();
    $("#rejoindreUnePartie").show();
}

function showAlert(str){
    $("#exampleModalLongTitle").html(str);
    $("#exampleModalCenter").modal('toggle');
}

function showSpinner(){
    $("#spinner").show();
    $("#spinner").css("display","inline-flex");
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

$(document).on("click", "#btn_alert", function(){
    $("#exampleModalCenter").modal('hide');
});

$(document).on("click", ".left_arrow", function(){
    $(this).parent().hide();
    $("#accueil").show();
});



$(document).on("click", ".file-select-button", function(){
    $(this).prev().click();
});