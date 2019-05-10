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
            "Dilemme":false,
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
        firebase.database().ref('partie/' + code + '/mode/').remove();
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


$(document).ready(function () {

    window.mobilecheck = function() {
        var check = false;
        (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
        return check;
    };

    if (window.mobilecheck()){
        var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

        $('.height-12').each(function(){
            $(this).css("height",h/100*12);
        });


    }


});


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