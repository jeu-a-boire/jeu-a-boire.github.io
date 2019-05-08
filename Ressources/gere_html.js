var angle1 = 0;
var angle2 = 0;
var nb_modes = 1;

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

/** montre le choix des modes **/
function lancerLaPartie(){

    state = "choisir_mode";

    if (superUser) {
        firebase.database().ref('partie/' + code + '/status/').set(state);
    }

    mettreTousLesMenuAFalse();
    menu_choisir_mode = true;
    $("#game_info").hide();
    var coderef = $("#code");
    var btn_nav = $("#btn_nav");
    if (superUser)
        coderef.html("Selectionner les modes de la partie : ");
    else
        coderef.html("Selection des modes en cours...");

    coderef.css("text-shadow","0 0 5px #00fff5");
    btn_nav.css("text-shadow","0 0 5px #00fff5");
    coderef.css("color","#00fff5");
    btn_nav.css("color","#00fff5");
    $("#menuChoisirMode").show();

    if (superUser) {
        $("#btn_glowing_play").show();

        modes = {
            "Commun":true,
            "Conseil des gorgées":false,
            "Devine tête":false,
            "Pour combien":false
        };

        firebase.database().ref('partie/'+ code +'/modes/').set(modes);

        var list = document.getElementById('menuChoisirMode').children;

        for(var i=0;i<list.length;i++){
            for(var key in modes) {
                if (list[i].innerHTML == key && modes[key] == true) {
                    glowing_without_database(list[i],'green',true);
                }
                else if (list[i].innerHTML == key && modes[key] == false){
                    glowing_without_database(list[i],'green',false);
                }
            }
        }
    }
    else{
        reagisEnFonctionDesModesActifs();
    }
}

function play(){

    if (nb_modes>0) {

        state = "in_game";
        metAJourStatut();


        if (superUser) {
            donneLesModesChoisis(true);
            reagisAuModeActuel();
            $("#btn_nav_in_game").show();
        }
        else{
            reagisAuModeActuel();
        }


        $("#code").hide();
        $("#menuChoisirMode").hide();
        $("#gameDiv").show();

    }
    else{
        showAlert("Vous devez choisir au moins un mode!");
    }
}

function openNav() {
    document.getElementById("mySidenav").style.width = "100%";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}

function openInGameNav() {
    document.getElementById("mySidenavInGame").style.width = "100%";
}

function closeInGameNav() {
    document.getElementById("mySidenavInGame").style.width = "0";
}

function revenirAuMenuPrincipal(){

    console.log("revenirAuMenuPrincipal");

    hideAllModes();
    if (superUser) {
        state = "menu_avant_partie";
        metAJourStatut();
        closeInGameNav();

        //todo: a chaque ajout de mode clear in db les traces
        firebase.database().ref('partie/' + code + '/conseil_gorgees/').remove();
        firebase.database().ref('partie/' + code + '/game/').remove();
        firebase.database().ref('partie/' + code + '/modes/').remove();
        firebase.database().ref('partie/' + code + '/pour_combien/').remove();

    }else{
        showAlert("Le meneur de jeu a choisi de revenir au menu principal");
    }
    mettreTousLesMenuAFalse();
    trouverLeBonBooleenMenuEnFonctionDeState();
    $("#gameDiv").hide();
    $("#spinner").show();
    showUser();
    $("#spinner").hide();
    $("#code").html("Code de la partie : " + code).show();
    $("#game_info").show();
    $("#code").show();
}

$(document).on("click", "#btn_alert", function(){
    $("#exampleModalCenter").modal('hide');
});

$(document).on("click", ".left_arrow", function(){
    $(this).parent().hide();
    $("#accueil").show();
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












/*************************              Gère l'activation des modes                ******************************/

function glowing(contexte,color){

    if (superUser) {

        var className = $('#' + contexte.id).attr('class');

        if (className.includes('glowing-glowing-' + color)) {
            className = 'glowing';

            nb_modes--;

            firebase.database().ref('partie/'+ code +'/modes/'+$('#' + contexte.id).html()).set(false);

        } else {
            className = ' glowing-glowing-' + color;

            nb_modes++;

            firebase.database().ref('partie/'+ code +'/modes/'+$('#' + contexte.id).html()).set(true);
        }

        $('#' + contexte.id).attr('class', className);

    }

    donneLesModesChoisis(false);

}

function glowing_without_database(contexte,color,glow){

    var className = $('#' + contexte.id).attr('class');

    if (!glow) {
        className = 'glowing';
    } else {
        className = ' glowing-glowing-' + color;
    }

    $('#' + contexte.id).attr('class', className);

}









/********************************       Images        ****************************/

function onFileSelected(event,imageId){

    $("#body").hide();
    showSpinner();

    console.log("on file selected");

    angle1=0;
    angle2=0;

    var selectedFile = event.target.files[0];
    var reader = new FileReader();

    var imgtag = document.getElementById(imageId);
    imgtag.title = selectedFile.name;
    document.getElementById('img_bis').title = selectedFile.name;
    document.getElementById('img_bis2').title = selectedFile.name;

    reader.onload = function(event) {

        console.log("in");

        imgtag.src = event.target.result;

        var img_bis = $("#img_bis");

        img_bis.attr("src",imgtag.src);

        var img_bis2 = $("#img_bis2");

        img_bis2.attr("src",imgtag.src);

        var img = $("#"+imageId);

        img.attr("currentSrc", event.target.result);
        img.attr("src", event.target.result);

        //rotateImage2(0,imageId);

        setTimeout(function() {
            rotateImage2(0, imageId);
        },500);
    };

    reader.readAsDataURL(selectedFile);
}

$(document).on("click", "#rotate_1", function(){
    angle1 += 90;
    showSpinner();
    $("#body").hide();
    rotateImage2(angle1,"myimage");
});

$(document).on("click", "#rotate_2", function(){
    angle2 += 90;
    showSpinner();
    $("#body").hide();
    rotateImage2(angle2,"myimage_creer");
});

$(document).on("click", ".file-select-button", function(){
    $(this).prev().click();
});

function rotateImage2(degrees,element_name){

    var canvas = document.getElementById("canvas");
    var image = document.getElementById('img_bis2');

    var widthFactor,heightFactor;

    var ctx=canvas.getContext("2d");
    canvas.style.width="20%";

    if(degrees == 90 || degrees == 270) {
        canvas.width = image.height;
        canvas.height = image.width;
        if (canvas.height>canvas.width){
            widthFactor = 1;
            heightFactor = canvas.height/canvas.width;
        }
        else{
            heightFactor = 1;
            widthFactor = canvas.height/canvas.width;
        }
    } else {
        canvas.width = image.width;
        canvas.height = image.height;
        if (canvas.height<canvas.width){
            widthFactor = 1;
            heightFactor = canvas.height/canvas.width;
        }
        else{
            heightFactor = 1;
            widthFactor = canvas.height/canvas.width;
        }
    }

    ctx.clearRect(0,0,canvas.width,canvas.height);
    if(degrees == 90 || degrees == 270) {
        ctx.translate(image.height/2,image.width/2);
    } else {
        ctx.translate(image.width/2,image.height/2);
    }
    ctx.rotate(degrees*Math.PI/180);
    ctx.drawImage(image,-image.width/2,-image.height/2);

    resizeBase64Img(canvas.toDataURL(), 500*widthFactor, 500*heightFactor,element_name);

}

function resizeBase64Img(base64, width, height,element_name) {
    var canvas = document.getElementById("canvas");
    canvas.width = width;
    canvas.height = height;
    var context = canvas.getContext("2d");
    $("<img/>").attr("src",base64).on('load',function() {
        context.scale(width/this.width,  height/this.height);
        context.drawImage(this, 0, 0);
        $("#"+element_name).data('base64',canvas.toDataURL());
        gere_image_little(canvas.toDataURL(),element_name);
    });
}

function gere_image_little(base64,element_name){

    var img = $("#"+element_name);

    img.attr("currentSrc", base64);
    img.attr("src", base64);

    $("#spinner").hide();
    $("#body").show();
}