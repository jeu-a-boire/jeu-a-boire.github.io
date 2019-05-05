var mode_actuel;
var pour_combien_info;
var pour_combien_result;
var conseil_gorgees_question;
var laPartieDuModeEnCoursEstFinis = false;

function choisisUnMode(){

    var i = getRandomInt(listModes.length);

    mode_actuel = listModes[i];

    //a mettre dans chacune des fct séparément des que ts les params sont calculés
    //firebase.database().ref('partie/' + code + '/mode/').set(mode_actuel);

    agisEnFonctionDuMode();
}

//Que pour le super User
function agisEnFonctionDuMode() {

    switch (mode_actuel) {
        case "Commun":
            modeCommun();
            break;
        case 'Conseil des gorgées':
            modeConseilGorgees();
            break;
        case 'Devine tête':
            modeDevineTete();
            break;
        case 'Pour combien':
            modePourCombien();
            break;
        case 'A determiner':
            $("#body").hide();
            $("#spinner").show();
            choisisUnMode();
            break;
    }
}

function modeCommun(){
    console.log("mode commun");
}

function modeDevineTete(){
    console.log("mode devine tête");
}

function reagisAuModeActuel(){


    var statusRef = firebase.database().ref('partie/'+ code +'/mode/');

    statusRef.on('value', function(snapshot) {
        var mode = snapshot.val();

        mode_actuel = mode;
        showMode();


    });
}

function showMode(){

    laPartieDuModeEnCoursEstFinis = false;

    console.log("Show mode :" + mode_actuel);

    switch (mode_actuel) {
        case "Commun":
            $("#body").show();
            $("#spinner").hide();
            showModeCommun();
            break;
        case 'Conseil des gorgées':
            $("#body").show();
            $("#spinner").hide();
            showModeConseilGorgees();
            break;
        case 'Devine tête':
            $("#body").show();
            $("#spinner").hide();
            showModeDevineTete();
            break;
        case 'Pour combien':
            $("#body").show();
            $("#spinner").hide();
            showModePourCombien();
            break;
        case 'A determiner':
            $("#body").hide();
            $("#spinner").show();
            break;
    }
}


/***************  Conseil des gorgées   ******************/

var aVote = false;

function showModeConseilGorgees() {

    aVote = false;

    $("#reponse_conseil_gorgees").hide();

    var playerRef = firebase.database().ref('partie/' + code + '/game/');

    playerRef.once('value', function (snapshot) {


        var questions = snapshot.val();

        conseil_gorgees_question = questions.question;

        $("#conseil_gorgees_phrase").html(questions.question);

        $("#conseil_gorgees_personnage_affichage").html("");

        for (var key in players_list) {

            if (key != player_key) {
                //ce n'est pas la réponse mais les autres propositions
                $("#conseil_gorgees_personnage_affichage").append("<div class=\"card\" onclick=\"vote_conseil_gorgee("+ key +")\" style=\"width: 20%;display:inline-block\">\n" +
                    "<div><img class=\"card-img-top\" src=" + players_list[key].image + " alt=\"Card image\"></div>\n" +
                    "<div class=\"card-title\" style=\"margin-bottom:0.2rem;margin-top:0.2rem;\">" + players_list[key].username + "</div>\n" +
                    "</div>");
            }

        }

        $("#conseil_des_gorgees").show();

    });

}

function vote_conseil_gorgee(key){



    aVote = true;

    firebase.database().ref('partie/' + code + '/conseil_gorgees/'+player_key).set(key);
    $("#conseil_des_gorgees").hide();
    $("#body").hide();
    $("#spinner").show();

    var statusRef = firebase.database().ref('partie/'+ code +'/conseil_gorgees/');

    console.log("J'active la fonction qui affiche les images car j'ai voté");

    statusRef.on('value', function(snapshot) {

        console.log("Je montre les images car j'ai voté");
        console.log("La partie en cours est finsi: "+laPartieDuModeEnCoursEstFinis);


        if (!laPartieDuModeEnCoursEstFinis && aVote) {

            console.log(7);

            var choix = snapshot.val();

            //initialise les votes pour chaque personnes
            for (var key in players_list) {

                if (players_list.hasOwnProperty(key)) {

                    players_list[key].number_of_vote = 0;

                }

            }

            //On compte les votes
            var number_of_vote = 0;
            for (key in choix) {

                if (choix.hasOwnProperty(key)) {

                    players_list[choix[key]].number_of_vote++;
                    number_of_vote++;

                }

            }

            //trouve le max
            var max = 0;
            for (key in choix) {

                if (choix.hasOwnProperty(key)) {

                    if (players_list[choix[key]].number_of_vote > max) {
                        max = players_list[choix[key]].number_of_vote;
                    }

                }

            }

            $("#contenu_reponse_conseil_gorgees").html("");

            var k = 0;
            //On affiche les résultats
            for (key in players_list) {

                if (players_list.hasOwnProperty(key)) {

                    if (players_list[key].number_of_vote == max) {
                        $("#contenu_reponse_conseil_gorgees").append("<div class=\"card\"style=\"width: 20%;display:inline-block\">\n" +
                            "<div><img class=\"card-img-top\" src=" + players_list[key].image + " alt=\"Card image\"></div>\n" +
                            "<div class=\"card-title\" style=\"margin-bottom:0.2rem;margin-top:0.2rem;\">" + players_list[key].username + "</div>\n" +
                            "</div>");
                        k++;
                    }

                }

            }


            if (number_of_vote != numberOfPlayer) {
                if (k > 1) {
                    $("#txt_reponse_conseil_gorgees").html("Les personnes choisies pour l'instant sont :");
                } else {
                    $("#txt_reponse_conseil_gorgees").html("La personne choisie pour l'instant est :");
                }
            } else {
                if (k > 1) {
                    $("#txt_reponse_conseil_gorgees").html("Les personnes suivantes sont choisies et doivent boire 2 gorgées :");
                } else {
                    $("#txt_reponse_conseil_gorgees").html("La personne suivante est choisie et doit boire 2 gorgées :");
                }

                if (superUser) {
                    $("#btn_suivant_reponse_conseil_gorgees").show();
                }

                console.log(124);
                laPartieDuModeEnCoursEstFinis = true;

                console.log("Je redéfinis la fct car j'en ai plus besoin");

                statusRef.off();

            }

            $("#spinner").hide();
            $("#reponse_conseil_gorgees").show();
            $("#body").show();

        }

    });
}


function modeConseilGorgees(){
    console.log("mode conseil gorgées");

    if (superUser){
        remplisDBmodeConseilGorgees();
    }
}

function remplisDBmodeConseilGorgees(){

    var playerRef = firebase.database().ref('questions/conseil_gorgees');

    playerRef.once('value', function (snapshot) {

        var questions = snapshot.val();
        var k=0;

        var r = getRandomInt(questions.nombre);

        for(var key in questions){

            if (questions.hasOwnProperty(key) && key!='nombre'){

                if (k==r) {

                    var str = questions[key];

                    firebase.database().ref('partie/' + code + '/game/').set({
                        question:str
                    });

                    firebase.database().ref('partie/' + code + '/mode/').set('Conseil des gorgées');


                }

                k++;
            }

        }

    });
}

function clear_conseil_gorgees(){


    $("#btn_suivant_reponse_conseil_gorgees").hide();
    $("#reponse_conseil_gorgees").hide();
    $("#body").hide();
    $("#spinner").show();

    if (superUser) {
        firebase.database().ref('partie/' + code + '/conseil_gorgees/').remove();
        firebase.database().ref('partie/' + code + '/game/').remove();
        firebase.database().ref('partie/' + code + '/mode/').set('A determiner');
        mode_actuel='A determiner';
        agisEnFonctionDuMode();
    }
}

/*************** Pour combien   *********************/

function sendPourCombien(){
    var prix = $("#pour_combien_input").val();

    if (prix <= 1000000000) {

        firebase.database().ref('partie/' + code + '/pour_combien/' + player_key).set(prix);

        showResultPourCombien();

    }
    else
        showAlert("La somme max est 1000000000, choisi un nombre inférieur!")
}

function showResultPourCombien(){

    $("#spinner").show();
    var playerRef = firebase.database().ref('partie/' + code + '/pour_combien/');

    playerRef.on('value', function (snapshot) {

        if (!laPartieDuModeEnCoursEstFinis) {

            $("#reponse_pour_combien_contenu").html("");
            $("#reponse_pour_combien_reponse").html("");

            var questions = snapshot.val();
            pour_combien_result = questions;

            var k = 0;

            for (var key in questions) {

                if (key != pour_combien_info.user) {
                    //ce n'est pas la réponse mais les autres propositions
                    $("#reponse_pour_combien_contenu").append("<div class=\"card\" style=\"width: 20%;display:inline-block\">\n" +
                        "<div><img class=\"card-img-top\" src=" + players_list[key].image + " alt=\"Card image\"></div>\n" +
                        "<div class=\"card-title\" style=\"margin-bottom:0.2rem;margin-top:0.2rem;\">" + players_list[key].username + "<br/>" + questions[key] + "</div>\n" +
                        "</div>");
                } else {
                    $("#reponse_pour_combien_reponse").append("<div class=\"card\" style=\"width: 20%;display:inline-block\">\n" +
                        "<div><img class=\"card-img-top\" src=" + players_list[key].image + " alt=\"Card image\"></div>\n" +
                        "<div class=\"card-title\" style=\"margin-bottom:0.2rem;margin-top:0.2rem;\">" + players_list[key].username + "<br/>" + questions[key] + "</div>\n" +
                        "</div>");
                }

                k++;

            }

            if (k == numberOfPlayer) {
                indiqueLesPerdantsPourCombien();
            }


            $("#spinner").hide();

        }

    });


    $("#pour_combien").hide();

    $("#reponse_pour_combien").show();
}

function showModePourCombien(){

    var playerRef = firebase.database().ref('partie/' + code + '/game/');

    playerRef.once('value', function (snapshot) {

        var questions = snapshot.val();

        pour_combien_info = questions;

        if (questions.user == player_key) {
            $("#pour_combien_phrase").html(questions.question + "<br/>Indique pour combien tu le ferais :");
        }
        else{
            $("#pour_combien_phrase").html(questions.question);
        }

        $("#pour_combien").show();

    });
}

function modePourCombien() {
    console.log("mode pour combien");

    if (superUser){

        //user qui ne jouera pas et pour qui il faut deviner le prix
        var user_key = getAUserRandom();
        remplisDBmodePourCombien(user_key);

    }

}

function remplisDBmodePourCombien(user_key){

    var playerRef = firebase.database().ref('questions/pour_combien');

    playerRef.once('value', function (snapshot) {

        var questions = snapshot.val();
        var k=0;

        var r = getRandomInt(questions.nombre);

        for(var key in questions){

            if (questions.hasOwnProperty(key) && key!='nombre'){

                if (k==r) {

                    var str = questions[key];
                    str = str.replace("<prenom>",players_list[user_key].username);

                    firebase.database().ref('partie/' + code + '/game/').set({
                        user:user_key,
                        question:str
                    });

                    firebase.database().ref('partie/' + code + '/mode/').set('Pour combien');

                }

                k++;
            }

        }

    });
}

function indiqueLesPerdantsPourCombien(){
    console.log(80);
    laPartieDuModeEnCoursEstFinis = true;
    $("#btn_suivant_reponse_pour_combien").show();
}

function showDeuxiemePage(){

    $("#pour_combien_page1").hide();
    var bestDifference = 1000000000000;
    var bestid = 0,worstid = 0;
    var worstDifference = 0;
    var result = pour_combien_result[pour_combien_info.user];

    for (var key in pour_combien_result){

        var difference = result - pour_combien_result[key];

        if (difference<0)
            difference = -difference;

        if (difference>=worstDifference){
            worstDifference=difference;
            worstid = key;
        }
        if (difference<=bestDifference){
            bestDifference = difference;
            bestid=key;
        }

    }

    $("#pour_combien_tu_bois").html("");
    $("#pour_combien_tu_distribue").html("");

    $("#pour_combien_tu_bois").append("<div class=\"card\" style=\"width: 20%;display:inline-block\">\n" +
        "<div><img class=\"card-img-top\" src=" + players_list[worstid].image + " alt=\"Card image\"></div>\n" +
        "<div class=\"card-title\" style=\"margin-bottom:0.2rem;margin-top:0.2rem;\">" + players_list[worstid].username+"</div>\n" +
        "</div>");

    $("#pour_combien_tu_distribue").append("<div class=\"card\" style=\"width: 20%;display:inline-block\">\n" +
        "<div><img class=\"card-img-top\" src=" + players_list[bestid].image + " alt=\"Card image\"></div>\n" +
        "<div class=\"card-title\" style=\"margin-bottom:0.2rem;margin-top:0.2rem;\">" + players_list[bestid].username+"</div>\n" +
        "</div>");

    if (superUser){
        $("#pour_combien_page2").append("<span class=\"glowing-glowing-blue\" id=\"btn_next_pour_combien\" style=\"width: 20%;position: fixed;right: 5%;bottom: 5%;\" onclick=\"clear_pour_combien();\">&#10140;</span>");
    }

    $("#pour_combien_page2").show();
}

function showPremierePage(){
    $("#pour_combien_page2").hide();
    $("#pour_combien_page1").show();
}

function clear_pour_combien() {

    $("#btn_suivant_reponse_pour_combien").hide();
    $("#reponse_pour_combien").hide();
    $("#pour_combien_page2").hide();
    $("#body").hide();
    $("#spinner").show();


    if (superUser) {
        firebase.database().ref('partie/' + code + '/pour_combien/').remove();
        firebase.database().ref('partie/' + code + '/game/').remove();
        firebase.database().ref('partie/' + code + '/mode/').set('A determiner');
        mode_actuel='A determiner';
        agisEnFonctionDuMode();
    }
}