var r=51,g=204,b=204;
var phase = 1;

function change() {

    $("body").css("background-color", 'rgb('+ r + ','+ g + ','+ b + ')');

    switch (phase) {
        case 1 ://0 255 204
            r--;
            if (g==255)
                g++;
            if (r==0){
                phase = 2;
            }

            break;
        case 2://0 255 153

            b--;

            if (b==153){
                phase=3;
            }

            break;
        case 3 ://0 255 0

            b--;
            if(b==20){
                phase=4;
            }

            break;
        case 4://51 204 51

            if (g>204){
                g--
            }

            r++;
            if (b!=51)
                b++;

            if(r==51)
                phase=5;

            break;
        case 5 ://102 255 51

            if (g!=255)
                g++;

            r++;

            if (r==102){
                phase=6;
            }

            break;
        case 6://153 255 51

            r++;

            if(r==153)
                phase=7;

            break;
        case 7 ://204 255 51

            r++;

            if(r==204)
                phase=8;

            break;
        case 8://255 255 0

            if (b!=20)
                b--;

            if (r!=225)
                r++;

            if(b==20){
                phase = 9;
            }

            break;

        case 9://255 255 255

            if (r!=255)
                r++;

            b++;

            if (b==200)
                phase = 10;

            break;

        case 10://0 255 255

            r--;
            if (b!=255)
                b++;

            if(r==0)
                phase=11;

            break;

        case 11://51 204 204

            r++;
            g--;
            b--;

            if (r==51)
                phase=1;

            break;



    }

    setTimeout(function() {
        change();
    }, 20);

}

$(document).ready(function(){

    change();

});