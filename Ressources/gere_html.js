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

    console.log("on file selected");

    angle1=0;
    angle2=0;

    var selectedFile = event.target.files[0];
    var reader = new FileReader();

    var imgtag = document.getElementById(imageId);
    imgtag.title = selectedFile.name;

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

        rotateImage(0,imageId);
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

$(document).on("click", "#rotate_1", function(){angle1 += 90;
    rotateImage(angle1,"myimage");
});

$(document).on("click", "#rotate_2", function(){
    angle2 += 90;
    rotateImage(angle2,"myimage_creer");
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

function rotateImage(degree,element_name) {

    degree = degree%360;

    console.log("rotate");

    var img = document.getElementById('img_bis2');

    switch (degree) {
        case 0:drawImage_0(img,element_name);
            break;
        case 90:drawImage_90(img,element_name);
            break;
        case 180:drawImage_180(img,element_name);
            break;
        case 270:drawImage_270(img,element_name);
            break;

    }

}

function drawImage_0(img,element_name){
    var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");

    c.height = document.getElementById('img_bis').height;
    c.width = document.getElementById('img_bis').width;
    ctx.drawImage(img, 0, 0);

    var tempCanvas = document.createElement("canvas"),
        tCtx = tempCanvas.getContext("2d");

    var min;

    if (c.height>c.width)
        min = c.width;

    else
        min = c.height;


    tempCanvas.width = min;
    tempCanvas.height = min;

    tCtx.drawImage(c,0,0);

    var img2 = tempCanvas.toDataURL();

    resizeBase64Img(img2, 500, 500,element_name);


}

function drawImage_180(img,element_name){

    var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");

    c.height = document.getElementById('img_bis').height;
    c.width = document.getElementById('img_bis').width;


    ctx.clearRect(0,0,c.width,c.height);

    // save the unrotated context of the canvas so we can restore it later
    // the alternative is to untranslate & unrotate after drawing
    ctx.save();

    // move to the center of the canvas
    ctx.translate(c.width/2,c.height/2);

    // rotate the canvas to the specified degrees
    ctx.rotate(Math.PI);

    // draw the image
    // since the context is rotated, the image will be rotated also
    ctx.drawImage(img,-c.width/2,-c.width/2);

    // we’re done with the rotating so restore the unrotated context
    ctx.restore();

    var tempCanvas = document.createElement("canvas"),
        tCtx = tempCanvas.getContext("2d");

    var min;

    if (c.height>c.width)
        min = c.width;

    else
        min = c.height;


    tempCanvas.width = min;
    tempCanvas.height = min;

    tCtx.drawImage(c,0,0);

    var img2 = tempCanvas.toDataURL();

    resizeBase64Img(img2, 500, 500,element_name);

}

function drawImage_90(img,element_name){

    var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");

    c.height = document.getElementById('img_bis').width;
    c.width = document.getElementById('img_bis').height;


    ctx.clearRect(0,0,c.width,c.height);

    // save the unrotated context of the canvas so we can restore it later
    // the alternative is to untranslate & unrotate after drawing
    ctx.save();

    // move to the center of the canvas
    ctx.translate(c.width/2,c.height/2);

    // rotate the canvas to the specified degrees
    ctx.rotate(Math.PI/2);

    // draw the image
    // since the context is rotated, the image will be rotated also
    ctx.drawImage(img,-c.width/2,-c.width/2);

    // we’re done with the rotating so restore the unrotated context
    ctx.restore();

    var tempCanvas = document.createElement("canvas"),
        tCtx = tempCanvas.getContext("2d");

    var min;

    if (c.height>c.width)
        min = c.width;

    else
        min = c.height;


    tempCanvas.width = min;
    tempCanvas.height = min;

    tCtx.drawImage(c,0,0);

    var img2 = tempCanvas.toDataURL();

    resizeBase64Img(img2, 500, 500,element_name);

}

function drawImage_270(img,element_name){

    var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");

    c.height = document.getElementById('img_bis').width;
    c.width = document.getElementById('img_bis').height;


    ctx.clearRect(0,0,c.width,c.height);

    // save the unrotated context of the canvas so we can restore it later
    // the alternative is to untranslate & unrotate after drawing
    ctx.save();

    // move to the center of the canvas
    ctx.translate(c.width/2,c.height/2);

    // rotate the canvas to the specified degrees
    ctx.rotate(-Math.PI/2);

    // draw the image
    // since the context is rotated, the image will be rotated also
    ctx.drawImage(img,-c.width/2,-c.width/2);

    // we’re done with the rotating so restore the unrotated context
    ctx.restore();

    var tempCanvas = document.createElement("canvas"),
        tCtx = tempCanvas.getContext("2d");

    var min;

    if (c.height>c.width)
        min = c.width;

    else
        min = c.height;


    tempCanvas.width = min;
    tempCanvas.height = min;

    tCtx.drawImage(c,0,0);

    var img2 = tempCanvas.toDataURL();

    resizeBase64Img(img2, 500, 500,element_name);
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
}