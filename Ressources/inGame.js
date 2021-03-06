var mode_actuel;
var pour_combien_info;
var pour_combien_result;
var conseil_gorgees_info;
var conseil_gorgees_question;
var normal_info;
var dilemme_info;
var reponse_dilemme;
var choix_majorite_dilemme;
var laPartieDuModeEnCoursEstFinis = false;

function choisisUnMode(){
    console.log("choisisUnMode");


    var i = getRandomInt(listModes.length);

    mode_actuel = listModes[i];

    //a mettre dans chacune des fct séparément des que ts les params sont calculés
    //firebase.database().ref('partie/' + code + '/mode/').set(mode_actuel);

    agisEnFonctionDuMode();
}

//Que pour le super User
function agisEnFonctionDuMode() {
    console.log("agisEnFonctionDuMode");


    switch (mode_actuel) {
        case "Commun":
            modeCommun();
            break;
        case 'Conseil des gorgées':
            modeConseilGorgees();
            break;
        case 'Dilemme':
            modeDilemme();
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

function reagisAuModeActuel(){
    console.log("reagisAuModeActuel");


    var statusRef = firebase.database().ref('partie/'+ code +'/mode/');

    statusRef.on('value', function(snapshot) {
        var mode = snapshot.val();

        mode_actuel = mode;
        showMode();


    });
}

function showMode(){
    console.log("showMode");


    laPartieDuModeEnCoursEstFinis = false;

    var body = $("#body");
    var spinner = $("#spinner");

    switch (mode_actuel) {
        case "Commun":
            body.show();
            spinner.hide();
            showModeCommun();
            break;
        case 'Conseil des gorgées':
            body.show();
            spinner.hide();
            showModeConseilGorgees();
            break;
        case 'Dilemme':
            body.show();
            spinner.hide();
            showModeDilemme();
            break;
        case 'Pour combien':
            body.show();
            spinner.hide();
            showModePourCombien();
            break;
        case 'A determiner':
            body.hide();
            spinner.show();
            if (!superUser){
                clear_conseil_gorgees();
                clear_pour_combien();
                clearCommun();
                clearDilemme();
            }
            break;
    }
}

/**************** Général   ***********************/

function hideAllModes(){
    console.log("hideAllModes");

    //todo: a completer avec tous les modes à chaque fois
    hideAllConseilGorgees();
    hideAllPourCombien();
    hideAllCommun();
    hideAllDilemme();
}

/***************    Dilemme     ********************/

function showModeDilemme(){
    console.log("ShowModeDilemme");

    $("#spinner").show();
    $("#body").hide();

    var playerRef = firebase.database().ref('partie/' + code + '/game/');

    playerRef.once('value', function (snapshot) {

        var questions = snapshot.val();

        var h = questions.question[1];
        var b = questions.question[2];
        dilemme_info = questions;

        $("#btn_haut_dilemme").html(h);
        $("#btn_bas_dilemme").html(b);

        $("#btn_haut_dilemme").click(function () {
            voteDilemme(1);
        });

        $("#btn_bas_dilemme").click(function () {
            voteDilemme(2);
        });



        $("#spinner").hide();
        $("#dilemme").show();
        $("#body").show();

    });


}

function voteDilemme(k){
    console.log("voteDilemme");

    $("#spinner").show();
    $("#body").hide();

    firebase.database().ref('partie/' + code + '/dilemme/'+player_key).set(k);

    var statusRef = firebase.database().ref('partie/'+ code +'/dilemme/');

    statusRef.on('value', function(snapshot) {

        dilemmeReagisAuVoteDesAutres(snapshot,statusRef)

    });

}

function dilemmeReagisAuVoteDesAutres(snapshot,statusRef){

    $("#myBar_dilemme_bas").css("width","0%");
    $("#myBar_dilemme_haut").css("width","0%");
    clearTimeout(timeOut);
    realW1=0;
    realW2=0;

    var rep = snapshot.val();
    reponse_dilemme = rep;
    var countH = 0;
    var countB = 0;

    for (var key in rep){

        if (rep.hasOwnProperty(key)){


            if (rep[key] == 1){
                countH++;
            }else if (rep[key] == 2){
                countB++;
            }

        }

    }

    if (countH + countB == numberOfPlayer){
        statusRef.off();
        $("#btn_suivant_dilemme").show();
    }

    var r1 = countH/(countB+countH);
    var r2 = countB/(countB+countH);


    $("#myBar_dilemme_haut").html(dilemme_info.question[1] + " (" + Math.round(r1*10000)/100+"%)");
    $("#myBar_dilemme_bas").html(dilemme_info.question[2] + " (" + Math.round(r2*10000)/100+"%)");

    if (countH == 0){
        $("#myBar_dilemme_haut").removeClass("btn-primary");
    }else{
        $("#myBar_dilemme_haut").addClass("btn-primary");
    }
    if (countB == 0){
        $("#myBar_dilemme_bas").removeClass("btn-danger");
    }else{
        $("#myBar_dilemme_bas").addClass("btn-danger");
    }

    rempliBarReponseDilemme(Math.round(r1*10000)/100,Math.round(r2*10000)/100);

    if (r1>r2){
        choix_majorite_dilemme = 0;
    }
    else if (r1<r2)
        choix_majorite_dilemme = 1;
    else
        choix_majorite_dilemme = 2;

    $("#dilemme").hide();
    $("#reponse_dilemme").show();
    $("#spinner").hide();
    $("#body").show();
}

var realW1=0,realW2=0;
var timeOut;

function rempliBarReponseDilemme(w1,w2){


    if (realW1<w1){
        $("#myBar_dilemme_haut").css("width",realW1+"%");
    }

    if (realW2<w2){
        $("#myBar_dilemme_bas").css("width",realW2+"%");
    }

    if (realW1>w1 && realW2>w2){
        return;
    }

    realW1 += w1/100;
    realW2 += w2/100;

    timeOut = setTimeout(rempliBarReponseDilemme,30,w1,w2);

}

function modeDilemme(){
    console.log("modeDilemme");

    if (superUser){
        remplisDBmodeDilemme();
    }
}

function remplisDBmodeDilemme(){

    console.log("remplisDBmodeDilemme");

    var playerRef = firebase.database().ref('questions/dilemme');

    playerRef.once('value', function (snapshot) {

        var questions = snapshot.val();
        var k=0;

        var r = getRandomInt(questions.nombre);

        for(var key in questions){

            if (questions.hasOwnProperty(key) && key!='nombre'){

                if (k==r) {

                    var str = questions[key];

                    var g1 = getANumberOfGorgees();

                    firebase.database().ref('partie/' + code + '/game/').set({
                        question:str,
                        bois:g1
                    });

                    firebase.database().ref('partie/' + code + '/mode/').set('Dilemme');


                }

                k++;
            }

        }

    });
}

function showDilemmeReponse(){

    var strChoix;

    $("#contenu_dilemme").html("");

    console.log(choix_majorite_dilemme);

    if (choix_majorite_dilemme == 0){
        strChoix = 1;
    }
    else if (choix_majorite_dilemme == 1){
        strChoix = 2;
    }
    else{
        strChoix = "";
    }

    var k = 0;

    console.log(reponse_dilemme);

    for (var key in reponse_dilemme){

        if (reponse_dilemme.hasOwnProperty(key)){

            if (reponse_dilemme[key] != strChoix || choix_majorite_dilemme == 2){

                if (players_list.hasOwnProperty(key)) {

                    $("#contenu_dilemme").append("<div class=\"card\" style=\"width: 20%;display:inline-block\">\n" +
                        "<div><img class=\"card-img-top\" src=" + players_list[key].image + " alt=\"Card image\"></div>\n" +
                        "<div class=\"card-title\" style=\"margin-bottom:0.2rem;margin-top:0.2rem;\">" + players_list[key].username + "</div>\n" +
                        "</div>");

                    k++;

                }

            }

        }

    }

    if (choix_majorite_dilemme == 2)
        $("#txt_reponse_dilemme").html("Egalité, tout le monde bois " + dilemme_info.bois +" "+getStringGorgees(dilemme_info.bois)+"!");
    else{
        if (k>1){
            $("#txt_reponse_dilemme").html("Les personnes suivantes boivent " + dilemme_info.bois +" "+getStringGorgees(dilemme_info.bois)+" :");
        }
        else if (k==0){
            $("#txt_reponse_dilemme").html("Vous avez de la chance, personne ne boit!");
        }
        else{
            $("#txt_reponse_dilemme").html("La personne suivante boit " + dilemme_info.bois +" "+getStringGorgees(dilemme_info.bois)+" :");
        }
    }

    if (superUser){
        $("#btn_suivant_reponse_dilemme").show();
    }

    $("#reponse_dilemme").hide();
    $("#reponse_dilemme_2").show();
}

function clearDilemme(){
    console.log("clearDilemme");

    $("#reponse_dilemme_2").hide();
    $("#reponse_dilemme").hide();
    $("#btn_suivant_dilemme").hide();
    $("#dilemme").hide();
    $("#body").hide();
    $("#spinner").show();

    if (superUser) {
        firebase.database().ref('partie/' + code + '/dilemme/').remove();
        firebase.database().ref('partie/' + code + '/game/').remove();
        firebase.database().ref('partie/' + code + '/mode/').set('A determiner');
        mode_actuel='A determiner';
        agisEnFonctionDuMode();
    }
}

function hideAllDilemme(){
    console.log("hideAllDilemme");
    $("#reponse_dilemme_2").hide();
    $("#reponse_dilemme").hide();
    $("#dilemme").hide();
    $("#btn_suivant_dilemme").hide();
}

/***************  Conseil des gorgées   ******************/

var aVote = false;

function showModeConseilGorgees() {

    console.log("showModeConseilGorgees");


    aVote = false;

    $("#reponse_conseil_gorgees").hide();

    var playerRef = firebase.database().ref('partie/' + code + '/game/');

    playerRef.once('value', function (snapshot) {


        var questions = snapshot.val();

        conseil_gorgees_question = questions.question;
        conseil_gorgees_info = questions;

        $("#conseil_gorgees_phrase").html(questions.question);

        $("#conseil_gorgees_personnage_affichage").html("");

        for (var key in players_list) {

            if (key != player_key && players_list.hasOwnProperty(key)) {
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

    console.log("vote_conseil_gorgee");

    $("#spinner").show();
    $("#body").hide();


    aVote = true;

    firebase.database().ref('partie/' + code + '/conseil_gorgees/'+player_key).set(key);
    $("#conseil_des_gorgees").hide();
    $("#body").hide();
    $("#spinner").show();

    var statusRef = firebase.database().ref('partie/'+ code +'/conseil_gorgees/');

    statusRef.on('value', function(snapshot) {


        if (!laPartieDuModeEnCoursEstFinis && aVote) {

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

                if (choix.hasOwnProperty(key) && players_list.hasOwnProperty(choix[key])) {

                    players_list[choix[key]].number_of_vote++;
                    number_of_vote++;

                }

            }

            //trouve le max
            var max = 0;
            for (key in choix) {

                if (choix.hasOwnProperty(key)  && players_list.hasOwnProperty(choix[key])) {

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
                    $("#txt_reponse_conseil_gorgees").html("Les personnes suivantes sont choisies et doivent boire "+ conseil_gorgees_info.bois +" "+ getStringGorgees(conseil_gorgees_info.bois) +" :");
                } else {
                    $("#txt_reponse_conseil_gorgees").html("La personne suivante est choisie et doit boire "+conseil_gorgees_info.bois+" "+getStringGorgees(conseil_gorgees_info.bois)+" :");
                }

                if (superUser) {
                    $("#btn_suivant_reponse_conseil_gorgees").show();
                }

                laPartieDuModeEnCoursEstFinis = true;

                statusRef.off();

            }

            $("#spinner").hide();
            $("#reponse_conseil_gorgees").show();
            $("#body").show();

        }

    });
}

function modeConseilGorgees(){

    console.log("modeConseilGorgees");


    if (superUser){
        remplisDBmodeConseilGorgees();
    }
}

function remplisDBmodeConseilGorgees(){

    console.log("remplisDBmodeConseilGorgees");

    var playerRef = firebase.database().ref('questions/conseil_gorgees');

    playerRef.once('value', function (snapshot) {

        var questions = snapshot.val();
        var k=0;

        var r = getRandomInt(questions.nombre);

        for(var key in questions){

            if (questions.hasOwnProperty(key) && key!='nombre'){

                if (k==r) {

                    var str = questions[key];
                    var g1 = getANumberOfGorgees();

                    firebase.database().ref('partie/' + code + '/game/').set({
                        question:str,
                        bois:g1
                    });

                    firebase.database().ref('partie/' + code + '/mode/').set('Conseil des gorgées');


                }

                k++;
            }

        }

    });
}

function clear_conseil_gorgees(){

    console.log("clear conseil gorgées");


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

function hideAllConseilGorgees(){
    $("#conseil_des_gorgees").hide();
    $("#reponse_conseil_gorgees").hide();
}

/*************** Pour combien   *********************/

function sendPourCombien(){
    console.log("sendPourCombien");


    var prix = $("#pour_combien_input").val();

    if (isNaN(prix)){
        showAlert("La somme doit être un nombre!");
        return;
    }
    if (prix.length == 0) {
        showAlert("Il faut rentrer un nombre!");
        return;
    }

    if (prix <= 1000000000) {

        firebase.database().ref('partie/' + code + '/pour_combien/' + player_key).set(prix);

        showResultPourCombien();

    }
    else
        showAlert("La somme max est 1000000000, choisi un nombre inférieur!")
}

function showResultPourCombien(){
    console.log("showResultPourCombien");


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

                if (key != pour_combien_info.user && players_list.hasOwnProperty(key)) {
                    //ce n'est pas la réponse mais les autres propositions
                    $("#reponse_pour_combien_contenu").append("<div class=\"card\" style=\"width: 20%;display:inline-block\">\n" +
                        "<div><img class=\"card-img-top\" src=" + players_list[key].image + " alt=\"Card image\"></div>\n" +
                        "<div class=\"card-title\" style=\"margin-bottom:0.2rem;margin-top:0.2rem;\">" + players_list[key].username + "<br/>" + questions[key] + "</div>\n" +
                        "</div>");
                } else if (players_list.hasOwnProperty(key)){
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
            $("#pour_combien_page1").show();

        }

    });


    $("#pour_combien").hide();

    $("#reponse_pour_combien").show();
}

function showModePourCombien(){
    console.log("showModePourCombien");


    var playerRef = firebase.database().ref('partie/' + code + '/game/');

    playerRef.once('value', function (snapshot) {

        var questions = snapshot.val();

        pour_combien_info = questions;

        if (questions.user == player_key) {
            $("#pour_combien_phrase").html(questions.question + "<br/>(Indique pour combien tu le ferais)");
        }
        else{
            $("#pour_combien_phrase").html(questions.question);
        }

        $("#pour_combien").show();

    });
}

function modePourCombien() {
    console.log("modePourCombien");

    if (superUser){

        //user qui ne jouera pas et pour qui il faut deviner le prix
        var user_key = getAUserRandom();
        remplisDBmodePourCombien(user_key);

    }

}

function remplisDBmodePourCombien(user_key){
    console.log("remplisDBmodePourCombien");

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

                    var g1 = getANumberOfGorgees();
                    var g2 = getANumberOfGorgees();

                    firebase.database().ref('partie/' + code + '/game/').set({
                        user:user_key,
                        question:str,
                        bois:g1,
                        distribue:g2
                    });

                    firebase.database().ref('partie/' + code + '/mode/').set('Pour combien');

                }

                k++;
            }

        }

    });
}

function indiqueLesPerdantsPourCombien(){
    console.log("indiqueLesPerdantsPourCombien");

    laPartieDuModeEnCoursEstFinis = true;
    $("#btn_suivant_reponse_pour_combien").show();
}

function showDeuxiemePage(){
    console.log("showDeuxiemePage");

    $("#pour_combien_page1").hide();
    var bestDifference = 1000000000000;
    var bestid = 0,worstid = 0;
    var worstDifference = 0;
    var result = pour_combien_result[pour_combien_info.user];

    for (var key in pour_combien_result){

        if (key!=pour_combien_info.user && players_list.hasOwnProperty(key)) {

            var difference = result - pour_combien_result[key];

            if (difference < 0)
                difference = -difference;

            if (difference >= worstDifference) {
                worstDifference = difference;
                worstid = key;
            }
            if (difference <= bestDifference) {
                bestDifference = difference;
                bestid = key;
            }

        }

    }

    $("#pour_combien_tu_bois").html("");
    $("#pour_combien_tu_distribue").html("");

    if (players_list.hasOwnProperty(worstid)) {

        $("#pour_combien_tu_bois").append("<div class=\"card\" style=\"width: 20%;display:inline-block\">\n" +
            "<div><img class=\"card-img-top\" src=" + players_list[worstid].image + " alt=\"Card image\"></div>\n" +
            "<div class=\"card-title\" style=\"margin-bottom:0.2rem;margin-top:0.2rem;\">" + players_list[worstid].username + "</div>\n" +
            "</div>");

    }

    if (players_list.hasOwnProperty(bestid)) {

        $("#pour_combien_tu_distribue").append("<div class=\"card\" style=\"width: 20%;display:inline-block\">\n" +
            "<div><img class=\"card-img-top\" src=" + players_list[bestid].image + " alt=\"Card image\"></div>\n" +
            "<div class=\"card-title\" style=\"margin-bottom:0.2rem;margin-top:0.2rem;\">" + players_list[bestid].username + "</div>\n" +
            "</div>");

    }

    if (superUser){
        $("#pour_combien_page2").append("<span class=\"glowing-glowing-blue\" id=\"btn_next_pour_combien\" style=\"width: 20%;position: fixed;right: 5%;bottom: 5%;\" onclick=\"clear_pour_combien();\">&#10140;</span>");
    }

    $("#pour_combien_bois_txt").html("Cette personne boit " + pour_combien_info.bois +" "+getStringGorgees(pour_combien_info.bois)+" :");
    $("#pour_combien_distribue_txt").html("Cette personne distribue " + pour_combien_info.distribue +" "+getStringGorgees(pour_combien_info.distribue)+" :");

    $("#pour_combien_page2").show();
}

function showPremierePage(){
    console.log("showPremierePage");

    $("#pour_combien_page2").hide();
    $("#pour_combien_page1").show();
}

function clear_pour_combien() {

    console.log("clear pour combien");

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

function hideAllPourCombien(){
    $("#pour_combien").hide();
    $("#reponse_pour_combien").hide();
}

/****************   Commun      ***********************/

function modeCommun(){
    console.log("modeCommun");

    if (superUser){
         remplisDBmodeNormal();
    }
}

function remplisDBmodeNormal(){
    console.log("remplisDBmodeNormal");

    var playerRef = firebase.database().ref('questions/normal');

    playerRef.once('value', function (snapshot) {

        var questions = snapshot.val();
        var k=0;

        var r = getRandomInt(questions.nombre);

        for(var key in questions){

            if (questions.hasOwnProperty(key) && key!='nombre'){

                if (k==r) {

                    var str = questions[key];
                    var user_key = getAUserRandom();
                    var user_key2 = getAUserRandom();
                    var user_key3 = getAUserRandom();

                    if (str.includes("<prenom2>") && numberOfPlayer>1){

                        while (user_key == user_key2 && numberOfPlayer>1){
                            user_key2 = getAUserRandom();
                        }

                    }
                    if (str.includes("<prenom3>") && numberOfPlayer>2){

                        while ((user_key == user_key3 || user_key2 == user_key3) && numberOfPlayer>2){
                            user_key3 = getAUserRandom();
                        }

                    }

                    str = str.replace("<prenom>",players_list[user_key].username);
                    str = str.replace("<prenom1>",players_list[user_key].username);
                    str = str.replace("<prenom2>",players_list[user_key2].username);
                    str = str.replace("<prenom3>",players_list[user_key3].username);

                    var g1 = getANumberOfGorgees();
                    str = str.replace("<gorgee>",g1 +" "+getStringGorgees(g1));

                    firebase.database().ref('partie/' + code + '/game/').set({
                        question:str
                    });

                    firebase.database().ref('partie/' + code + '/mode/').set('Commun');

                }

                k++;
            }

        }

    });
}

function showModeCommun(){
    console.log("showModeCommun");

    if (superUser){
        $("#btn_suivant_commun").show();
    }

    var playerRef = firebase.database().ref('partie/' + code + '/game/');

    playerRef.once('value', function (snapshot) {

        var questions = snapshot.val();

        normal_info = questions;

        $("#normal_question").html(questions.question);

        $("#NormalMode").show();

    });
}

function hideAllCommun(){
    $("#NormalMode").hide();
}

function clearCommun(){
    $("#NormalMode").hide();

    if (superUser){
        firebase.database().ref('partie/' + code + '/commun/').remove();
        firebase.database().ref('partie/' + code + '/mode/').set('A determiner');
        mode_actuel='A determiner';
        agisEnFonctionDuMode();
    }

}