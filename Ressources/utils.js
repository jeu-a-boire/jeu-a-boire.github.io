function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max)); //entre 0 et max-1
}

function getAUserRandom(){

    var k=0;

    for (var key in players_list){
        if (players_list.hasOwnProperty(key)){
            k++;
        }
    }

    //k correspond au nb de joueurs

    var r = getRandomInt(k);
    k=0;

    for (key in players_list){
        if (players_list.hasOwnProperty(key)){
            if (r==k)
                return key;
            k++;
        }
    }


}

function getQuestion(name){

    var playerRef = firebase.database().ref('questions/'+name);


    playerRef.once('value', function (snapshot) {

        var questions = snapshot.val();
        var k=0;

        var r = getRandomInt(questions.nombre);

        for(var key in questions){

            if (questions.hasOwnProperty(key) && key!='nombre'){

                if (k==r) {
                    console.log(questions[key]);
                    return questions[key];
                }

                k++;
            }

        }

    });
}