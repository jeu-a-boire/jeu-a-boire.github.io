var code;
var player_key;
var image_de_base;

function showUser(user){

    $("#contenu").html("");
    $("#btnLancerPartie").hide();
    $("#body").css("display","block");
    $("#body").css("justify-content","");
    $("#body").css("align-items","");

    var k=0;

    for (var key in user) {


        if (key == player_key && k==0){
            $("#btnLancerPartie").show();
        }

        if (user.hasOwnProperty(key)) {
            $("#contenu").append("<div class=\"card\" style=\"width: 20%;display:inline-block\">\n" +
                "<img class=\"card-img-top\" src="+ user[key].image +" alt=\"Card image\" style=\"width:100%\">\n" +
                "<div class=\"card-body\">\n" +
                "<h4 class=\"card-title\">"+ user[key].username +"</h4>\n" +
                "</div>" +
                "</div>");
        }
        k++;
    }

}

function creerUnePartie() {

    var username = $("#input_pseudo_creer").val();

    if (username == "") {
        alert("Il faut saisir un pseudo!");
        return;
    }

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

        var image;

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
        alert("Il faut saisir un code");
        return;
    }

    var codeRef = firebase.database().ref("partie/"+code);

    codeRef.once('value').then(function(snapshot) {

        var gameJSON = snapshot.val();

        if (gameJSON == undefined){ //Le code est mauvais
            alert("La partie que vous essayez de joindre n'existe pas");
        }
        else{

            var lastkey = 0;

            for (var key in gameJSON.players) {
                if (gameJSON.players.hasOwnProperty(key)) {
                    lastkey = key;

                    if (gameJSON.players[key].username == username){
                        alert("l'identifiant est déjà utilisé");
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

/**
 * fonction appelée une fois que l'utilisateur a saisie un numéro de partie, et l'a rejoint (menu où on voit les noms)
 */
function showGameInfo(){

    $("#code").html("Code de la partie : " + code).show();

    var playerRef = firebase.database().ref('partie/'+ code +'/players/');

    playerRef.on('value', function(snapshot) {
        showUser(snapshot.val());
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

        });
    });

});