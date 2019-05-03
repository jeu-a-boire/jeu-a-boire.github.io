var angle1 = 0;
var angle2 = 0;


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

function openNav() {
    document.getElementById("mySidenav").style.width = "100%";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}

function onFileSelected(event,imageId){

    var selectedFile = event.target.files[0];
    var reader = new FileReader();

    var imgtag = document.getElementById(imageId);
    imgtag.title = selectedFile.name;

    reader.onload = function(event) {
        imgtag.src = event.target.result;

        rotateImage(imgtag,0);
        $("#"+imageId).data("base64",$("#canvas").toDataURL());
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

$(document).on("click", "#rotate_1", function(){
    angle1 += 90;
    rotateImage(document.getElementById('myimage'),angle1);
    $("#myimage").data('base64',document.getElementById('canvas').toDataURL());
    $("#myimage").css('transform','rotate(' + angle1 + 'deg)');
});

$(document).on("click", "#rotate_2", function(){
    angle2 += 90;
    rotateImage(document.getElementById('myimage'),angle2);
    $("#myimage_creer").data('base64',document.getElementById('canvas').toDataURL());
    $("#myimage_creer").css('transform','rotate(' + angle2 + 'deg)');
});

$(document).on("click", ".file-select-button", function(){
    $(this).prev().click();
});

$(document).on("click", ".left_arrow_side_bar", function(){
    $("#body").show();
    $("#proposer").hide();
    trouverLeBonBooleenMenuEnFonctionDeState();
});



function signalerUnProbleme(){
    mettreTousLesMenuAFalse();
    menu_signaler_probleme = true;
    $("#proposer").show();
    $("#body").hide();
    closeNav();
}

function proposerUnJeu(){
    mettreTousLesMenuAFalse();
    menu_proposer_jeu = true;
    $("#proposer").show();
    $("#body").hide();
    closeNav();
}

function revenirALaPartie(){

    //faire des if avec tous les menus possible
    //ici, ceux que je dois hide()
    if (menu_supprimer_joueur){
        //pas besoin de fire qqch, il faudra faire qqch dans la prochaine section
    }

    //ici ceux que je dois show()
    if (state == "menu_avant_partie"){
        showUser();
        $("#code").show();
    }

}


function quitterLaPartie() {
    document.location.reload(true);
}

function rotateImage(img,degree)
{

    var canvas = document.getElementById('canvas');

    if(document.getElementById('canvas')){

        var context = canvas.getContext("2d");

        context.clearRect(0,0,canvas.width,canvas.height);

        context.save();

        // move to the center of the canvas
        context.translate(img.width/2,img.height/2);

        // rotate the canvas to the specified degrees
        context.rotate(degree*Math.PI/180);

        // draw the image
        // since the context is rotated, the image will be rotated also
        context.drawImage(img,-img.width/2,-img.width/2);

        // we’re done with the rotating so restore the unrotated context
        context.restore();

    }

}