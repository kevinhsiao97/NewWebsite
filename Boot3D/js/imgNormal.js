/**
 * Created by iceleaf on 2016/12/3.
 */
function DrawImage(hotimg)
{
    $(hotimg).jqthumb({
        classname      : 'jqthumb',
        width          : '100%',
        height         : '100%',
        position       : { y: '50%', x: '50%'},
        zoom           : '1',
        method         : 'auto',
    });
}

function DrawContentImg(hotimg)
{
    $(hotimg).jqthumb({
        classname      : 'jqthumb',
        width          : '100%',
        height         : '100%',
        position       : { y: '50%', x: '50%'},
        zoom           : '1',
        method         : 'auto',
    });
}