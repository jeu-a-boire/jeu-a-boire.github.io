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

var angle1 = 0;

$(document).on("click", "#rotate_1", function(){
    angle1 += 90;
    $("#myimage").css('transform','rotate(' + angle1 + 'deg)');
    $("#myimage").data('transform',angle1);
});

var angle2 = 0;

$(document).on("click", "#rotate_2", function(){
    angle2 += 90;
    $("#myimage_creer").css('transform','rotate(' + angle2 + 'deg)');
    $("#myimage_creer").data("transform",angle2)
});





$(document).on("click", ".file-select-button", function(){
    $(this).prev().click();
});