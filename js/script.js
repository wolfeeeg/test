// количество дней в месяце
function DayInMonth(year,month){
    var dayCount = new Date(year, month, 0).getDate();
    return dayCount;
}
// какой сегодня год
function NowYear() {
    var newDate = new Date();
    var year = newDate.getFullYear();
    return year;
}
// получаем месяц
function Month(position) {
    var newDate = new Date();
    var month = newDate.getMonth() + position;
    return month;
}
function SetTitleDate(n,y){
    var NameMonth = ["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"];
    $('.date-panel .now-date').html(NameMonth[Month(n)-1]+' '+y);
    $('.wrap-content').attr('id','month-'+Month(n)); // устанавливаем id для каждого месяца
}
function GetMonthName(n){
    var NameMonth = ["января","февраля","марта","апреля","мая","июня","июля","августа","сентября","октября","ноября","декабря"];
    return NameMonth[Month(n)-1];
}
// день недели
function DateWeek(n,y){
    var date = new Date();
    date.setYear(y);
    date.setMonth(n);
    date.setDate(1);
    var week = date.getDay();
    if(week == 0) week = 7; // для воскресенья
    return week;
}
// сегодняшний день
function NowDate(){
    var date = new Date();
    var now = date.getDate();
    return now;
}
// расставляем даты
function SetDate(n,p,year){
    searchClose();
    SetTitleDate(n,year);  //title date
    $('.number').removeAttr('id');
    var days = DayInMonth(year,Month(n));
    $(".table td").css('cursor','default');
    var week = DateWeek(p,year);
    var ot = week - 1;
    // заполняем для предыдущего месяца
    var z = DayInMonth(year,Month(n-1)) - ot + 1; 
    for (var i=0; i < ot; i++){
       var obj = $(".table td").eq(i);
       obj.find('.number').html(z);
       z++;
    }
    // заполняем для нынешнего месяца
    var k = 0;
    for (i=ot; i < days + ot; i++){
       k++;
       var obj = $(".table td").eq(i);
       obj.css('cursor','pointer');
       obj.find('.number').html(k).attr('id','day'+k);
    }
    var tr = null;
    if($('.table .trlast').find('span[id *= day]').attr('id')) tr = true;
    if(!tr){
        $('.trlast').hide();
    }
    else{
        $('.trlast').show();
    }
    tr = null;
    $('.HaveNode').remove();
    // установка данных из LocalStorage
    var mass = localStorage.getItem('notes') ? JSON.parse(localStorage.getItem('notes')) : [];
    var size = SIZE(mass);
    if(size > 0){
        for (var l=0; l < size; l++){
            if(mass[l][0][0] == n && mass[l][0][1] == p && mass[l][0][2] == year){
                var ele = $('.table td span[id = day'+mass[l][0][3]+']');
                var parent = ele.parents('td');
                var headNode = mass[l][1][0];
                var personNode = mass[l][1][1];
                var personDate = mass[l][1][2];
                var personDescriptin = mass[l][1][3];
                parent.css('background','#c2e4fe');
                ele.after('<div class="HaveNode" rel=""><div class="headNode">'+headNode+'</div><div class="personNode">'+personNode+'</div><div class="personDate">'+personDate+'</div><div class="personDescriptin">'+personDescriptin+'</div></div>'); 
            }
        }
    }   
}   
// следующий и предидущий месяцы
function NextMonth(){
    CloseAdd();
    savedate.monthpos = savedate.monthpos + 1;
    savedate.mon = savedate.mon + 1;
    if(savedate.mon > 11 ) {
        savedate.mon = 0;
        savedate.year = savedate.year + 1 ;
    }
    else if(savedate.mon < 0){
        savedate.mon = 11;
        savedate.year = savedate.year - 1 ;
    }
    if(savedate.monthpos > 4 ) {
        savedate.monthpos = -7;
    }
    else if(savedate.monthpos < -7){
        savedate.monthpos = 4;
    }
    $('.table td').removeClass('current').css({'background':'#ffffff'}); 
    $('.table td .number').html('').removeAttr('id');        
    SetDate(savedate.monthpos,savedate.mon,savedate.year);
    if(savedate.monthpos == 1) SetCurrentDay();
    $('.table td .ramp').remove();       
}
function PrevMonth(){
    CloseAdd();
    savedate.monthpos = savedate.monthpos - 1;
    savedate.mon = savedate.mon - 1;
    if(savedate.mon > 11 ) {
        savedate.mon = 0;
        savedate.year = savedate.year + 1 ;
    }
    else if(savedate.mon < 0){
        savedate.mon = 11;
        savedate.year = savedate.year - 1 ;
    }
    if(savedate.monthpos > savedate.monthdelay[0] ) {
        savedate.monthpos = -savedate.monthdelay[1];
    }
    else if(savedate.monthpos < -savedate.monthdelay[1]){
        savedate.monthpos = savedate.monthdelay[0];
    }
    $('.table td').removeClass('current').css({'background':'#ffffff'}); 
    $('.table td .number').html('').removeAttr('id');         
    SetDate(savedate.monthpos,savedate.mon,savedate.year);
    if(savedate.monthpos == 1) SetCurrentDay();
    $('.table td .ramp').remove();    
}
function searchClose(){
    $('.search-result').hide();
    $('.search .close').hide();
    $('.search-plank').val('Событие, дата или участник');
}
function SIZE(obj){
    if(!obj) obj = 0;
    return obj.filter(function(value) { return value !== undefined }).length;
}

function sorting(i,ii){
    if (i[0][4] > ii[0][4])
        return 1; 
    else
        return -1;
}

function findNode(obj,text){
    text = text.toLowerCase();
    var mass =[];
    var k = 0;
    var note = localStorage.getItem('notes') ? JSON.parse(localStorage.getItem('notes')) : [];
    
    var size = SIZE(note);
    if(size > 0){
        for (var l=0; l < size; l++){
            var str  = note[l][1][0].toLowerCase();
            var str2 = note[l][1][3].toLowerCase();
            
            if(str.indexOf(text) > -1 || str2.indexOf(text) > -1){
                mass[k] = note[l];
                k++;
            }
        }
        // сортируем массив
        mass.sort(sorting);
    }
    return mass;
}

$('.search-plank').on('keyup',function(){
    $('ul.result li').remove();
    var mass = findNode($(this),$(this).val());
    if (!mass) {var mass;}
    size = SIZE(mass);
    if(size > 0 && $(this).val() != '') {
        for (var i=0; i < size; i++ ) {
            var first = '';
            var last ='';
            if(i == 0){
                first = "first";
            }
            if(i == size-1){
                last = "last";
            }
            if(first || last) {
                if(!last) last = '';
                if(!first) first = '';
                var begin = "<li monthpos='"+mass[i][0][0]+"' mon='"+mass[i][0][1]+"' year='"+mass[i][0][2]+"' day='"+mass[i][0][3]+"' class='"+first+" "+last+"'>";
            }
            else{
                var begin = "<li monthpos='"+mass[i][0][0]+"' mon='"+mass[i][0][1]+"' year='"+mass[i][0][2]+"' day='"+mass[i][0][3]+"'>";
            }
            var li = begin+"<div class='title'>"+mass[i][1][0]+"</div><div class='date'>"+mass[i][1][2]+" "+mass[i][0][2]+"</div></li>";
            $('ul.result').append(li);
        }
        $('.search-result').show();
        $('.search .close').show();
        $('.search-result .plank .result li').hover(
            function(){
                $(this).toggleClass('active');
            },
            function(){
                $(this).toggleClass('active');
            }
        );
        $('.search-result .plank .result li').on('click',function(){
            var monthpos = parseInt($(this).attr('monthpos'));
            var month = parseInt($(this).attr('mon'));
            var year = parseInt($(this).attr('year'));
            var day = parseInt($(this).attr('day'));
            $('.table td').css('background','#ffffff');
            SetDate(monthpos,month,year);
            searchClose();
            savedate.monthpos = monthpos;
            savedate.mon = month;
            savedate.year = year;
            if (monthpos == 1 && year == NowYear()) {
                SetCurrentDay();
            }
            $('.table td #day'+day).click(); 
        });
    }
    else{
        $('.search-result').hide();
        $('.search .close').hide();
    }
});

$('.QuickAdd .add').focusin(function(){
    $(this).toggleClass('color');
    $(this).keypress(function(e){
        if(e.keyCode==13){
            $('.QuickAdd .sub').click();
        }
    });
});
$('.QuickAdd .add').blur(function(){
    $(this).toggleClass('color');
});
$('.search .search-plank').focusin(function(){
    $(this).toggleClass('color');
    CloseAdd();
    hideAdd();
});
$('.search .search-plank').blur(function(){
    $(this).toggleClass('color');
});

function QuickAdd(){
    var text = $('.QuickAdd .add').val();
    var split = text.split(',');
    var date = split[0].split(' ');
    var number = parseInt(date[0]);
    if(number){
            var year = parseInt(date[2]);
            var title = split[1];
            if (!year) year = savedate.year;
            var month;
            if(date[1]){
                switch (date[1].toLowerCase()) {
                  case 'январь': 
                  case 'января': 
                  month = 0;
                  break;
                  case 'февраль': 
                  case 'февраля': 
                  month = 1;
                  break;
                  case 'март': 
                  case 'марта': 
                  month = 2;
                  break;
                  case 'апрель': 
                  case 'апреля': 
                  month = 3;
                  break;
                  case 'май': 
                  case 'мая': 
                  month = 4;
                  break;
                  case 'июнь': 
                  case 'июня': 
                  month = 5;
                  break;
                  case 'июль': 
                  case 'июля': 
                  month = 6;
                  break;
                  case 'август': 
                  case 'августа': 
                  month = 7;
                  break;
                  case 'сентябрь': 
                  case 'сентября': 
                  month = 8;
                  break;
                  case 'октябрь': 
                  case 'октября': 
                  month = 9;
                  break;
                  case 'ноябрь': 
                  case 'ноября': 
                  month = 10;
                  break;
                  case 'декабрь': 
                  case 'декабря': 
                  month = 11;
                  break;
                  default:
                    month = savedate.mon;
                    
                }
            }
            else{
                month = savedate.mon;
            }    
            var delay = savedate.mon - savedate.monthpos;
            var monthpos = month - delay;
            if(monthpos != 1) $('td.current').removeClass('current').css('background','#ffffff');
            SetDate(monthpos,month,year);
            if (monthpos == 1 && year == NowYear()) {
                SetCurrentDay();
            }
            savedate.monthpos = monthpos;
            savedate.mon = month;
            savedate.year = year;
            hideAdd();
            $('.table td #day'+number).click(); 
            $('.table td #day'+number).parents('td').find('input.date').val('') 
            if(title){
                $('.table td #day'+number).parents('td').find('input.event').val(title).hide().next('.hiddenForInput').html(title).show();
            }  
    }
}
function Clear(){
    localStorage.clear();
    location.reload();
}
// закрыть окна
function hideAdd(){
    $(".content-header .QuickAddNote").removeClass('active');
    $('#qAdd').removeClass('active');
    $('.QuickAddNote .add').val('5 марта 2013, Название события');
}
function toggleAdd(){
    $('.content-header .QuickAddNote').toggleClass('active');
    $('#qAdd').toggleClass('active');
    $('.QuickAddNote .add').val('5 марта 2013, Название события');
    CloseAdd();
}

function CloseAdd(){
    $('.table td .addnoteLeft').remove();
    $('.table td .addnoteRight').remove();
}
// установка сегодняшнего дня
function SetCurrentDay(){
    CloseAdd();
    var t = $('.table td').find('#day'+NowDate());
    var cur = t.parent('div').parent('td').addClass('current').addClass('first').css('background','#f4f4f4');
    //t.click();
    return cur;
}
// переход на сегодняшний день
function GoToCurrentDay(){
    var date = new Date();
    var mo = date.getMonth();
    savedate = {
        mon: mo,
        monthpos: 1,
        monthdelay: [],
        year: NowYear(),
    }
    savedate.monthdelay['0'] = 12 - mo,
    savedate.monthdelay['1'] = mo - 1,
    SetDate(savedate.monthpos,savedate.mon,savedate.year);
    SetCurrentDay();
}
// рамка, фон и событие при клике
$('.table td').on('click', function(){
    if($(this).find('span[id *= day]').attr('id')){
        hideAdd();
        $('.table td').css('background','#ffffff');
        $('.table td').each(function(){
            if($(this).find('div').hasClass('HaveNode')) $(this).css('background','#c2e4fe');
        });
        $(this).css('background','#e5f1f9');
        $('.table td .ramp').remove(); 
        CloseAdd();   
        
        if($(this).index() > 4){
            var node = $('.HideForNode2').html(); 
        }
        else{
            var node = $('.HideForNode').html(); 
        }
        $(this).find('.numb').before('<div class="ramp"></div>' +node); 
        if($(this).find('div').hasClass('HaveNode')){
          var headNode = $(this).find('.headNode').html();
          var personNode = $(this).find('.personNode').html();
          var personDescriptin = $(this).find('.personDescriptin').html();
          $(this).find('.note input.event').val(headNode);
          $(this).find('.note input.date').val($(this).find('.number').html()+' '+GetMonthName(savedate.monthpos));
          $(this).find('.note input.date').hide();
          $(this).find('.note input.date').next('.hiddenForInput').html($(this).find('.number').html()+' '+GetMonthName(savedate.monthpos));
          $(this).find('.note input.name').val(personNode);
          $(this).find('.note textarea').html(personDescriptin);
        }
        else{
            $(this).find('.note input.del').hide();
            $(this).find('.note input.date').val($(this).find('.number').html()+' '+GetMonthName(savedate.monthpos));
            $(this).find('.note input.date').hide();
            $(this).find('.note input.date').next('.hiddenForInput').html($(this).find('.number').html()+' '+GetMonthName(savedate.monthpos));
        }
        if(!$(this).hasClass('current')) $('.current').css('background','#f4f4f4'); 
        if($(this).parent('tr').index() > 4) {
            $(this).find('.note').css('top','-211px');
            $(this).find('.treug').css('top','80px');
        }
        $(this).find('.note').on('click', function(event){
            event.stopPropagation();
        });
        $('input.go').on('click', function(event){
            event.stopPropagation();
            var parent = $(this).parents('td');
            if(!parent.find('div').hasClass('HaveNode')){
                var headNode = $(this).parent('.padd').find('input.event').val();
                var personNode = $(this).parent('.padd').find('input.name').val();
                var personDate = $(this).parent('.padd').find('input.date').val();
                var personDescriptin = $(this).parent('.padd').find('textarea').val();
                parent.css('background','#c2e4fe');
                parent.find('.number').after('<div class="HaveNode" rel=""><div class="headNode">'+headNode+'</div><div class="personNode">'+personNode+'</div><div class="personDate">'+personDate+'</div><div class="personDescriptin">'+personDescriptin+'</div></div>');                
                CloseAdd();
                // запись данных в LS
                var day = parseInt(parent.find('.number').html());
                var mass = [];
                var setdate = [];
                var date = [];
                var ms = savedate.mon+1;                    
                sdate = new Date(savedate.year+","+ms+","+day);
                sort = sdate.getTime();                  
                setdate = [savedate.monthpos,savedate.mon,savedate.year,day,sort];
                date = [headNode,personNode,personDate,personDescriptin];
                mass = [setdate,date];
                var note = localStorage.getItem('notes') ? JSON.parse(localStorage.getItem('notes')) : [];
                var size = SIZE(note);
                note[size] = mass;
                localStorage.setItem('notes', JSON.stringify(note));
            }
            else{
                var headNode = $(this).parent('.padd').find('input.event').val();
                var personNode = $(this).parent('.padd').find('input.name').val();
                var personDate = $(this).parent('.padd').find('input.date').val();
                var personDescriptin = $(this).parent('.padd').find('textarea').val();
                parent.find('.headNode').html(headNode);
                parent.find('.personNode').html(personNode);   
                parent.find('.personDate').html(personDate);
                parent.find('.personDescriptin').html(personDescriptin);    
                CloseAdd();
                // запись данных в LS
                var day = parseInt(parent.find('.number').html());
                var mass = [];
                var setdate = [];
                var date = [];
                var ms = savedate.mon+1;
                sdate = new Date(savedate.year+","+ms+","+day);
                sort = sdate.getTime();
                setdate = [savedate.monthpos,savedate.mon,savedate.year,day,sort];
                date = [headNode,personNode,personDate,personDescriptin];
                mass = [setdate,date];
                var note = localStorage.getItem('notes') ? JSON.parse(localStorage.getItem('notes')) : [];
                var size = SIZE(note);
                if(size > 0){
                    for (var l=0; l < size; l++){
                        if(note[l][0][0] == savedate.monthpos && note[l][0][1] == savedate.mon && note[l][0][2] == savedate.year && note[l][0][3] == day){
                            var current = l;
                        }
                    }
                }
                note[current] = mass;
                localStorage.setItem('notes', JSON.stringify(note));
            }
        });
        $(this).find('span.close').on('click', function(event){
            event.stopPropagation();
            $('.table td .addnoteLeft').remove();
            $('.table td .addnoteRight').remove();
        });
        $(this).find('input.del').on('click', function(event){
            event.stopPropagation();
            //удаляем из LS
            var parent = $(this).parents('td');
            var day = parseInt(parent.find('.number').html());
            var note = localStorage.getItem('notes') ? JSON.parse(localStorage.getItem('notes')) : [];
            var size = SIZE(note);
            if(size > 0){
                for (var l=0; l < size; l++){
                    if(note[l][0][0] == savedate.monthpos && note[l][0][1] == savedate.mon && note[l][0][2] == savedate.year && note[l][0][3] == day){
                        note.splice(l,1);
                    }
                }
            }
            localStorage.setItem('notes', JSON.stringify(note));
            $(this).parents('td').find('.HaveNode').remove();
            CloseAdd();
        });
        $(this).find('.note #blur').blur(function(event){
            event.stopPropagation();
            if(this.value != this.defaultValue) {
                $(this).hide();
                $(this).next('.hiddenForInput').show().html(this.value);
                if( $(this).hasClass('name') ) $(this).after('<span class="persons">Участники:</span>');
            }
        });
    }
});

GoToCurrentDay();