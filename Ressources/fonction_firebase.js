var code;
var player_key;
var image_de_base;
var players_list;
var ajout_btn_supp_utilisateur = false;
//les variables pour savoir je suis dans quel état
var menu_avant_lancer_partie = false;
var menu_supprimer_joueur = false;
var menu_signaler_probleme = false;
var menu_proposer_jeu = false;
var state = "Pas de partie";

function mettreTousLesMenuAFalse(){
    menu_signaler_probleme = false;
    menu_supprimer_joueur = false;
    menu_avant_lancer_partie = false;
    menu_proposer_jeu = false;
}

function trouverLeBonBooleenMenuEnFonctionDeState(){
    switch (state) {
        case  "menu_avant_partie":
            menu_avant_lancer_partie = true;
            break;

        default:menu_avant_lancer_partie=true;
    }
}

function showUser(){

    var user = players_list;

    $("#contenu").html("");
    $("#btnLancerPartie").hide();


    var k=0;

    for (var key in user) {


        if (key == player_key && k==0) {
            $("#btnLancerPartie").show();
            if (!ajout_btn_supp_utilisateur) {
                $("#mySidenav").prepend("<a href='#' id='btn_supp_utilisateur' onclick='supprimerUnUtilisateur()'>Supprimer un joueur</a>")
                ajout_btn_supp_utilisateur = true;
            }
        }

        if (user.hasOwnProperty(key)) {
            $("#contenu").append("<div class=\"card\" style=\"width: 20%;display:inline-block\">\n" +
                "<div><img class=\"card-img-top\" src="+ user[key].image + " alt=\"Card image\"></div>\n" +
                "<div class=\"card-title\">"+ user[key].username +"</div>\n" +
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
                "<div class=\"card-title\">"+ user[key].username +"</div>\n" +
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

        var image,rotation;

        if($("#myimage_creer").data("base64") == undefined){
            image = image_de_base;
        }
        else
            image = $("#myimage_creer").data("base64");

        firebase.database().ref('partie/'+ code +'/players/1').set({
            username: username,
            image:image
        });

        player_key = 1;

        $("#creerUnePartie").hide();
        $("#game_info").show();
        showGameInfo();

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

            lastkey++;

            player_key = lastkey;

            var image;

            if($("#myimage").data("base64") == undefined){
                image = image_de_base;
            }
            else
                image = $("#myimage").data("base64");


            firebase.database().ref('partie/' + code + '/players/' + lastkey).set({
                username: username,
                image: image
            });


            $("#rejoindreUnePartie").hide();
            $("#game_info").show();

            showGameInfo();

        }

    });

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

    menu_avant_lancer_partie = true;

    $("#code").html("Code de la partie : " + code).show();

    var playerRef = firebase.database().ref('partie/'+ code +'/players/');

    playerRef.on('value', function(snapshot) {
        players_list=snapshot.val();

        var user_is_present_in_database = false;

        for (var key in players_list) {

            if (players_list.hasOwnProperty(key)) {

                if (key == player_key)
                    user_is_present_in_database = true;

            }

        }

        if (!user_is_present_in_database) {
            quitterLaPartie();
        }


        if (menu_avant_lancer_partie)
            showUser();
        else if (menu_supprimer_joueur)
            showUserForSupp();
    });

}

/**
 * On disconnect, on enleve le joueur de la partie dans la bdd
 */
window.addEventListener('beforeunload', function (e) {

    if (code!=undefined && code!=null) {

        firebase.database().ref('partie/'+ code +'/players/' + player_key).remove();

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