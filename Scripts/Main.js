//************************************************//
//ѕеречислени€
var EnumModule = (function () {
    return {
        AlcoEnum: AlcoEnum,
        AlcoSizeEnum: AlcoSizeEnum
    };
    //≈сть алкоголь или нет 
    function AlcoEnum() {
        var alcoEnum = {
            0: "Alcohol Free",
            1: "Alcoholic"
        };
        return alcoEnum;
    };
    //–азмер алкогол€ Long, Short...
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
        var item = {};
        $.ajax({
            url: 'DB/AllCoctailsList.xml',
            dataType: "xml",
            async: false,
            success: function (document) {
                $(document).find("Cocktail").each(function () {
                    if ($(this).attr('id') == id) {
                        item.Id = id;
                        item.Name = $(this).find('name').text(),
                        item.Alco = $(this).find('alco').text(),
                        item.AlcoSize = $(this).find('type').text(),
                        item.Img = $(this).find('img').text(),
                        item.Content = $(this).find('content').text(),
                        item.AdditionalContent = $(this).find('adContent').text()
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