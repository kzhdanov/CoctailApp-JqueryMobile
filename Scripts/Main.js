//************************************************//
//Перечисления
var EnumModule = (function () {
    return {
        AlcoEnum: AlcoEnum,
        AlcoSizeEnum: AlcoSizeEnum
    };
    //Есть алкоголь или нет 
    function AlcoEnum() {
        var alcoEnum = {
            0: "Alcohol Free",
            1: "Alcoholic"
        };
        return alcoEnum;
    };
    //Размер алкоголя Long, Short...
    function AlcoSizeEnum() {
        var alcoSizeEnum = {
            1: "Hot Drink",
            2: "Long Drink",
            3: "Short Drink",
            4: "Shot Drink"
        };
        return alcoSizeEnum;
    };
})();

//************************************************//
//модуль парсинга XML
var Pars = (function () {
    return {
        GetCocktailsList: GetCocList,
        GetCoctailFullInform: GetCoctailFullInform
    };
               
    function GetCocList(file)
    {
        var itemList = new Array();
        $.ajax({
                url: file,
                dataType: "xml",
                async: false,
                success: function(document){
                    itemList = parse(document);
                },
                error: function () { alert("Error: Something went wrong"); }
        });
            
        function parse(document) {
            var itemList = new Array();
            $(document).find("Cocktail").each(function () {
                var id = $(this).attr('id');
                var tempAlco = $(this).find('alco').text();
                var tempAlcoSize = $(this).find('type').text();
                itemList.push({ 'id': id, 'Name': $(this).find('name').text(), 'Alco': tempAlco, 'AlcoSize': tempAlcoSize });
            });
            return itemList;
        }
        return itemList;
    }

    function GetCoctailFullInform(id) {
        var item = {
            Content: [],
            AdditionalContent: []
        };
        var formula = {
            el: "",
            size: ""
        };
        $.ajax({
            url: 'DB/AllCoctailsList.xml',
            dataType: "xml",
            async: false,
            success: function (document) {
                var i = 0;
                var temp, t;
                $(document).find("Cocktail").each(function () {
                    if ($(this).attr('id') == id) {
                        item.Id = id;
                        item.Name = $(this).find('name').text();
                        item.Alco = $(this).find('alco').text();
                        item.AlcoSize = $(this).find('type').text();
                        item.Img = $(this).find('img').text();
                        //Разбираем состав
                        temp = $(this).find('content').find('item');
                        for (i; i < temp.length; i++) {
                            t = temp[i].textContent.split('~');
                            formula.el = t[0];
                            formula.size = t[1];
                        
                            item.Content.push({ 'el': formula.el, 'size': formula.size });
                        }
                        
                        //Разбираем дополнительные компоненты
                        temp = $(this).find('adContent').find('item');
                        for (i = 0; i < temp.length; i++) {
                            item.AdditionalContent.push(temp[i]);
                        }
                        item.Invented = $(this).find('invented').text();
                        item.How = $(this).find('how').text();
                    }
                }); 
            },
            error: function () { alert("Error: Something went wrong"); }
        });
        return item;
    }
});

//************************************************//
//модуль передающий id
var IdAction = (function () {
    var currentId = 0;
    return {
        setId: setId,
        getId: getId,
        cleanId: cleanId
    };

    function setId(id)
    {
        currentId = id;
    }
    function getId()
    {
        return currentId;
    }
    function cleanId()
    {
        currentId = 0;
    }
})();
//************************************************//
//модуль отрисовки страницы Recipe
var RenderBody = (function () {
    return {
        Render: Render
    };

    function Render(currItem) {       
        var source = $("#mainTemplate").html();
        var template = Handlebars.compile(source);
        $('#Name').html(template({ name: currItem.Name }));
    }
});