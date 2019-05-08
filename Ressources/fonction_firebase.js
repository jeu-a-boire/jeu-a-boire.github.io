var code;
var player_key;
var username;
var image_de_base;
var superUser=false;
var iHaveAProblemOfConnection = false;
var players_list;
var numberOfPlayer = 0;
var ajout_btn_supp_utilisateur = false;
var listModes = [];
//les variables pour savoir je suis dans quel état
var menu_avant_lancer_partie = false;
var menu_supprimer_joueur = false;
var menu_signaler_probleme = false;
var menu_proposer_jeu = false;
var menu_choisir_mode = false;
var menu_in_game=false;
var state = "Pas de partie";

function mettreTousLesMenuAFalse(){
    menu_signaler_probleme = false;
    menu_supprimer_joueur = false;
    menu_avant_lancer_partie = false;
    menu_proposer_jeu = false;
    menu_choisir_mode = false;
    menu_in_game=false;
}

function trouverLeBonBooleenMenuEnFonctionDeState(){
    switch (state) {
        case  "menu_avant_partie":
            menu_avant_lancer_partie = true;
            break;

        case "chosir_mode":
            menu_choisir_mode = true;
            break;

        case 'in_game':
            menu_in_game=true;
            break;


        default:menu_avant_lancer_partie=true;
    }
}

function metAJourStatut() {
    firebase.database().ref('partie/' + code + '/status/').set(state);
    trouverLeBonBooleenMenuEnFonctionDeState();
}

function showUser(){

    var user = players_list;

    $("#contenu").html("");
    $("#btnLancerPartie").hide();


    var k=0;

    for (var key in user) {


        if (key == player_key && k==0) {
            $("#btnLancerPartie").show();
            superUser = true;
            if (!ajout_btn_supp_utilisateur) {
                $("#mySidenav").prepend("<a href='#' id='btn_supp_utilisateur' onclick='supprimerUnUtilisateur()'>Supprimer un joueur</a>")
                ajout_btn_supp_utilisateur = true;
            }
        }

        if (user.hasOwnProperty(key)) {
            $("#contenu").append("<div class=\"card\" style=\"width: 20%;display:inline-block\">\n" +
                "<div><img class=\"card-img-top\" src="+ user[key].image + " alt=\"Card image\"></div>\n" +
                "<div class=\"card-title\" style=\"margin-bottom:0.2rem;margin-top:0.2rem;\">" + user[key].username +"</div>\n" +
                "</div>");
        }
        k++;
    }

    $("#spinner").hide();
    $("#body").show();
    $("#body").css("display","block");
    $("#body").css("justify-content","");
    $("#body").css("align-items","");

}

function showUserForSupp(){

    var user = players_list;

    $("#contenu").html("");
    $("#btnLancerPartie").hide();


    var k=0;

    for (var key in user) {

        if (user.hasOwnProperty(key)) {
            $("#contenu").append("<div class=\"card\" onclick='supprimerlUtilisateur("+ key +")' style=\"width: 20%;display:inline-block\">\n" +
                "<div><img class=\"card-img-top\" src="+ user[key].image + " alt=\"Card image\" style=\"width:100%\"></div>\n" +
                "<div class=\"card-title\" style=\"margin-bottom:0.2rem;margin-top:0.2rem;\">" + user[key].username +"</div>\n" +
                "</div>");
        }
        k++;
    }

    $("#contenu").prepend("<button type=\"button\" class=\"btn btn-dark\" onclick=\"revenirALaPartie();\">Revenir à la partie</button>\n");
    $("#contenu").prepend("<div style='margin-left: 15%;margin-right: 15%'>Cliquez sur les joueurs que vous souhaitez supprimer :</div>");

    $("#body").show();
    $("#body").css("display","block");
    $("#body").css("justify-content","");
    $("#body").css("align-items","");

}

function supprimerlUtilisateur(key){
    firebase.database().ref('partie/'+ code +'/players/' + key).remove();
}

function supprimerUnUtilisateur(){

    $("#code").hide();
    $("#btnLancerPartie").hide();
    mettreTousLesMenuAFalse();
    menu_supprimer_joueur = true;
    closeNav();
    showUserForSupp();

}

function creerUnePartie() {

    var username = $("#input_pseudo_creer").val();

    if (username == "") {
        showAlert("Il faut saisir un pseudo!");
        return;
    }

    this.username = username;

    $("#body").hide();
    showSpinner();

    var partieRef = firebase.database().ref("partie/");

    partieRef.once('value').then(function(snapshot) {

        var partieJSON = snapshot.val();

        code_ok=false;

        while(!code_ok) {

            code_ok = true;

            code = getRandomInt(899999) + 100000;

            for (var key in partieJSON) {

                if (partieJSON.hasOwnProperty(key)) {

                    if (key == code) {
                        code_ok = false;
                        break;
                    }

                }

            }

        }

        var im;

        if($("#myimage_creer").data("base64") == undefined){
            im = image_de_base;
        }
        else
            im = $("#myimage_creer").data("base64");



        var canvas = document.getElementById('canvas');

        var img = document.getElementById("myimage_creer");

        var max;

        if (img.height>img.width)
            max = img.height;

        else
            max = img.width;

        canvas.height = max;
        canvas.width = max;


        var image = new Image();
        image.src = im;
        image.onload = function () {
            var canvasContext = canvas.getContext('2d');
            var wrh = image.width / image.height;
            var newWidth = canvas.width;
            var newHeight = newWidth / wrh;
            if (newHeight > canvas.height) {
                newHeight = canvas.height;
                newWidth = newHeight * wrh;
            }
            var xOffset = newWidth < canvas.width ? ((canvas.width - newWidth) / 2) : 0;
            var yOffset = newHeight < canvas.height ? ((canvas.height - newHeight) / 2) : 0;

            canvasContext.drawImage(image, xOffset, yOffset, newWidth, newHeight);

            firebase.database().ref('partie/'+ code +'/players/1').set({
                username: username,
                image:canvas.toDataURL()
            });


            firebase.database().ref('partie/' + code + '/status/').set("menu_avant_partie");

            setDate();

            player_key = 1;

            $("#creerUnePartie").hide();
            $("#game_info").show();
            showGameInfo();

        };


    });

}

function rejoindreUnePartie(){


    code = $("#input_code_rejoindre").val();
    var username = $("#input_pseudo_rejoindre").val();

    if (code == ""){ //Le code est mauvais
        showAlert("Il faut saisir un code");
        return;
    }

    if (username == "") {
        showAlert("Il faut saisir un pseudo!");
        return;
    }

    this.username = username;

    $("#body").hide();
    showSpinner();

    var codeRef = firebase.database().ref("partie/"+code);

    codeRef.once('value').then(function(snapshot) {

        var gameJSON = snapshot.val();

        if (gameJSON == undefined){ //Le code est mauvais
            $("#body").show();
            $("#spinner").hide();
            showAlert("La partie que vous essayez de joindre n'existe pas");
            return;
        }
        else{

            if (gameJSON.status != "menu_avant_partie"){
                showAlert("La partie que vous essayez de rejoindre est en cours");
                $("#body").show();
                $("#spinner").hide();
                return;
            }

            var lastkey = 0;

            for (var key in gameJSON.players) {
                if (gameJSON.players.hasOwnProperty(key)) {
                    lastkey = key;

                    if (gameJSON.players[key].username == username){
                        $("#body").show();
                        $("#spinner").hide();
                        showAlert("L'identifiant est déjà utilisé");
                        return;
                    }

                }
            }

            lastkey = parseInt(lastkey);

            lastkey += getRandomInt(1000000)+1;

            console.log(lastkey);

            player_key = lastkey;

            var im;

            if($("#myimage").data("base64") == undefined){
                im = image_de_base;
            }
            else
                im = $("#myimage").data("base64");

            var canvas = document.getElementById('canvas');

            var img = document.getElementById("myimage_creer");

            var max;

            if (img.height>img.width)
                max = img.height;

            else
                max = img.width;

            canvas.height = max;
            canvas.width = max;


            var image = new Image();
            image.src = im;
            image.onload = function () {
                var canvasContext = canvas.getContext('2d');
                var wrh = image.width / image.height;
                var newWidth = canvas.width;
                var newHeight = newWidth / wrh;
                if (newHeight > canvas.height) {
                    newHeight = canvas.height;
                    newWidth = newHeight * wrh;
                }
                var xOffset = newWidth < canvas.width ? ((canvas.width - newWidth) / 2) : 0;
                var yOffset = newHeight < canvas.height ? ((canvas.height - newHeight) / 2) : 0;

                canvasContext.drawImage(image, xOffset, yOffset, newWidth, newHeight);

                firebase.database().ref('partie/' + code + '/players/' + lastkey).set({
                    username: username,
                    image: canvas.toDataURL()
                });


                $("#rejoindreUnePartie").hide();
                $("#game_info").show();

                showGameInfo();

                setTimeout(checkIfMyConnectionIsNotAMistake(), 3000);

            };

        }

    });

}

function setDate(){
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = dd + '/' + mm + '/' + yyyy;

    firebase.database().ref('partie/' + code + '/date/').set(today);

}

/**
 * Si on se connecte pile en même temps que quelqu'un, on peut avoir un pb d'identifiant pareil, cette fonction gère ce problème
 */
function checkIfMyConnectionIsNotAMistake(){
    for (var key in players_list){
        if (players_list.hasOwnProperty(key)){

            if (player_key == key && players_list[key].username!=username){
                iHaveAProblemOfConnection = true;
                quitterLaPartie();
            }

        }
    }
}

function envoyerProposition(){

    var ref;

    if (menu_signaler_probleme)
        ref='erreur/';
    if (menu_proposer_jeu)
        ref='proposition/';


    var erreur = $("#textarea_proposer").val();
    var number;

    var codeRef = firebase.database().ref(ref);

    codeRef.once('value').then(function(snapshot) {

        var erreurJSON = snapshot.val();

        if (erreurJSON == undefined){ //Le code est mauvais
            number=1;
        }
        else{

            var lastkey = 0;

            for (var key in erreurJSON) {
                if (erreurJSON.hasOwnProperty(key)) {
                    lastkey = key;
                }
            }

            lastkey++;
            number = lastkey;

        }

        firebase.database().ref(ref + number).set({
            "username":players_list[player_key].username,
            "valeur":erreur
        });

    });

    mettreTousLesMenuAFalse();
    $("#body").show();
    $("#proposer").hide();
    trouverLeBonBooleenMenuEnFonctionDeState();
}

/**
 * fonction appelée une fois que l'utilisateur a saisie un numéro de partie, et l'a rejoint (menu où on voit les noms)
 */
function showGameInfo(){

    state = "menu_avant_partie";

    if (superUser)
        metAJourStatut();

    menu_avant_lancer_partie = true;

    $("#code").html("Code de la partie : " + code).show();

    var playerRef = firebase.database().ref('partie/'+ code +'/players/');

    playerRef.on('value', function(snapshot) {

        players_list=snapshot.val();

        var user_is_present_in_database = false;
        var k=0;

        for (var key in players_list) {

            if (players_list.hasOwnProperty(key)) {

                if (key == player_key) {
                    user_is_present_in_database = true;
                    if (k == 0)
                        superUser = true;
                }

            }

            k++;

        }

        numberOfPlayer=k;

        if (!user_is_present_in_database) {
            quitterLaPartie();
        }


        if (menu_avant_lancer_partie)
            showUser();
        else if (menu_supprimer_joueur)
            showUserForSupp();
        else if (menu_in_game && superUser){
            $("#btn_nav_in_game").show();
        }

        checkIfMyConnectionIsNotAMistake();



    });

    reagisEnFonctionDuStatus();

}

function reagisEnFonctionDuStatus(){

    var statusRef = firebase.database().ref('partie/'+ code +'/status/');

    statusRef.on('value', function(snapshot) {
        var statut = snapshot.val();

        if (statut != state){ //Il faut modifier le visuel

            if (state == "menu_avant_partie" && statut == "choisir_mode"){
                lancerLaPartie();
            }

            if (state == "choisir_mode" && statut == "in_game"){
                play();
            }

            if (state == 'in_game' && statut == 'menu_avant_partie'){
                revenirAuMenuPrincipal();
            }

        }

        state = statut;

    });



}

function reagisEnFonctionDesModesActifs(){

    console.log("Réagis en fonction des modes actifs");

    var modesRef = firebase.database().ref('partie/'+ code +'/modes/');

    modesRef.on('value', function(snapshot) {
        var modes = snapshot.val();
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
    });
}

/**Cette fontion rempli la variable listModes**/
function donneLesModesChoisis(boolean) {
    var playerRef = firebase.database().ref('partie/' + code + '/modes/');
    var k=0;

    playerRef.once('value', function (snapshot) {
        listModes = [];
        var modes = snapshot.val();
        for (var key in modes){

            if (modes.hasOwnProperty(key)) {

                if (modes[key]) {
                    listModes[k++]=key;
                }
            }

        }

        if (boolean){
            choisisUnMode();
        }

    });
}

var remove = false;

/**
 * On disconnect, on enleve le joueur de la partie dans la bdd
 */

window.addEventListener('beforeunload', function (e) {

    if (code!=undefined && code!=null) {

        if (numberOfPlayer == 1 && !remove)
            firebase.database().ref('partie/'+ code).remove();

        if (!iHaveAProblemOfConnection)
            firebase.database().ref('partie/'+ code +'/players/' + player_key).remove();

        remove=true;

    }

});

/**
 * Load une image de base
 */
$(document).ready(function() {

    var num = getRandomInt(8) + 1; //entre 1 et 9

    var codeRef = firebase.database().ref("images/"+num);

    codeRef.once('value').then(function(snapshot) {

        image_de_base = snapshot.val();

        $(".img_profile_menu").each(function () {

            $(this).attr("src", image_de_base);
            $(this).attr("currentSrc", image_de_base);
            $("#img_bis").attr("currentSrc", image_de_base);

        });

        $("#img_bis").attr("currentSrc", image_de_base);
        $("#img_bis").attr("src", image_de_base);
        $("#img_bis2").attr("currentSrc", image_de_base);
        $("#img_bis2").attr("src", image_de_base);

    });

});