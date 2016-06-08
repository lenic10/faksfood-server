var cheerio = require('cheerio');
var request = require('request');

exports.run = function() {
    request('https://www.studentska-prehrana.si/Pages/Directory.aspx', function(error, response, html) {
        if (!error && response.statusCode == 200) {
            get_restaurant_list(html);
        }
    });
}

function get_restaurant_list(html) {
    var data = [];
    var $ = cheerio.load(html);

    //$('[class=restaurantItem]').each(function(i, element) {
    $('[id=ContentHolderMain_ContentHolderMainContent_ContentHolderMainContent_lstvAlphabet_listRestaurants_0_lstvRestaurant_0_liItem_0]').each(function(i, element) {
        var data = [];

        //Get name of restaurant
        var tmp = $(this).find("[class = name] h1 a").text();
        data.name = tmp;

        //Get address and city //had to split the string
        var tmp = $(this).find("[class = name] h2").text();
        tmp = tmp.substr(1).substr(0, tmp.length - 1);
        tmp = tmp.split(", ");
        data.address = tmp[0];
        data.city = tmp[1];

        //Get the price of BON
        var tmp = $(this).find("[class = prices] p")[0];
        tmp = $(tmp).find("strong").text();
        tmp = parseFloat(tmp.replace(",", ".").replace(" EUR", ""));
        data.price = tmp;

        //Get the TOTAL price
        var tmp = $(this).find("[class = prices] p")[1];
        tmp = $(tmp).find("strong").text();
        tmp = parseFloat(tmp.replace(",", ".").replace(" EUR", ""));
        data.price_total = tmp;

        //Get features
        data[i].features = [];
        $(this).find("[class = features] img").each(function(index, element) {
            var tmp = $(this).attr("src");
            tmp = tmp.split("/");
            tmp = tmp[tmp.length - 1];
            tmp = tmp.split(".")[0];
            tmp = tmp.substr(3);

            data.features[index] = tmp;
        });

        //Get LINK && GUID
        var tmp = $(this).find("[class = name] h1 a").attr('href');
        data[i].link = tmp;
        tmp = tmp.split("/");
        tmp = tmp[tmp.length - 1].split("&")[0];
        tmp = tmp.split("?")[1].split("=")[1];
        data.guid = tmp;

        get_restaurant_menus(data);
    });
}


function get_restaurant_menus(data) {

    request(data.link, function(error, response, html) {
        if (!error && response.statusCode == 200) {
            var $ = cheerio.load(html);
            data.menus = []
            $('[class=holderRestaurantInfo] > ol > li').each(function(i, element) {
                data.menus[i] = []
                data.menus[i].class = $(this).find('ul').attr('class');
                data.menus[i].meals = [];

                $(this).find('li').each(function(index, element) {
                    data.menus[i].meals.push($(this).text());
                })
            });

            get_restaurant_info(data);
        }
    });


}


function get_restaurant_info(data) {
    request(data.link.replace("feature=0", "feature=1"), function(error, response, html) {
        if (!error && response.statusCode == 200) {
            var $ = cheerio.load(html);
            data.menus = []

        }
    });
}
/*
data:{
	name:
	address:
	city:
	price:
	price_total:
	guid
	link
	menus: {
		class
		meals:[]
	}
}
*/
