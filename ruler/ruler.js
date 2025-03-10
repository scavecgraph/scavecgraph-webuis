function createRuler() {
    var $ruler = $('.ruler');
    $ruler.css("visibility","visible");
    $ruler.css("display","block");
    for (var i = 0, step = 0; i < $ruler.innerWidth() / 5; i++, step++) {
        var $tick = $('<div>');
        if (step == 0) {
            $tick.addClass('tickLabel').html(i * 5) ;
        } else if ([1, 3, 5, 7, 9].indexOf(step) > -1) {
            $tick.addClass('tickMinor');
            if (step == 9) {
                step = -1;
            }
        } else {
            $tick.addClass('tickMajor');
        }
        $ruler.append($tick);
    }
}