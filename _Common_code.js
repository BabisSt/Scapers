const puppeteer = require('puppeteer')
const fs = require('fs')

module.exports = {

        init : async function init(URL)
        {
                const browser = await puppeteer.launch({
                        headless: false,
                        args: [
                             '--window-size=1920,1080',
                       ],})

                const page = await browser.newPage()

                await page.setViewport({
                        width: 1920,
                        height: 1080,
                });

                await page.goto(URL,{
                        waitUntil: 'networkidle2',
                        timeout: 0
                });

                var obj = {
                        page: page,
                        browser: browser,
                      
                }

                return obj;

        },

        save_file : function save_file(data,scriptName)
        {
                var stringified = JSON.stringify({product:data})
                fs.writeFileSync("/tmp/"+ scriptName + ".json", stringified );
        },

        replace_url : function replace_url(data)
        {
                const amazon = new RegExp('https://m.media-amazon.com');
                const drele = new RegExp('https://www.drele.com');
                const e_shop = new RegExp('https://www.e-shop.cy');
                const happydeals = new RegExp('https://www.happydeals.gr');
                const kotsovolos = new RegExp('https://assets.kotsovolos.gr');
                const lagwnika = new RegExp('https://www.lagonika.gr');
                const mediamarkt = new RegExp('https://external.webstorage.gr');
                const mgmanager = new RegExp('https://www.mgmanager.gr');
                const plaisio = new RegExp('https://cdn.plaisio.gr');
                const public = new RegExp('https://external.webstorage.gr');
                const skroutzgr = new RegExp('https://d.scdn.gr');
                const skroutzcy = new RegExp('https://www.skroutz.com.cy');
                const websupplies = new RegExp('https://www.websupplies.gr');
                const you = new RegExp('https://images.you.gr');

                for (let i = 0 ; i < data.length ; i++)
                {
                if(amazon.exec(data[i].image))
                        data[i].image = data[i].image.replace(amazon,(("https://nealand.org").concat("/proxy/amazon")))
                else if(drele.exec(data[i].image))
                        data[i].image = data[i].image.replace(drele,(("https://nealand.org").concat("/proxy/drele")))
                else if(e_shop.exec(data[i].image))
                        data[i].image = data[i].image.replace(e_shop,(("https://nealand.org").concat("/proxy/e-shop-cy")))
                else if(happydeals.exec(data[i].image))
                        data[i].image = data[i].image.replace(happydeals,(("https://nealand.org").concat("/proxy/happydeals-gr")))
                else if(kotsovolos.exec(data[i].image))
                        data[i].image = data[i].image.replace(kotsovolos,(("https://nealand.org").concat("/proxy/kotsovolos")))
                else if(lagwnika.exec(data[i].image))
                        data[i].image = data[i].image.replace(lagwnika,(("https://nealand.org").concat("/proxy/lagwnika")))
                else if(mediamarkt.exec(data[i].image))
                        data[i].image = data[i].image.replace(mediamarkt,(("https://nealand.org").concat("/proxy/mediamarkt")))
                else if(mgmanager.exec(data[i].image))
                        data[i].image = data[i].image.replace(mgmanager,(("https://nealand.org").concat("/proxy/mg-manager")))
                else if(plaisio.exec(data[i].image))
                        data[i].image = data[i].image.replace(plaisio,(("https://nealand.org").concat("/proxy/plaisio")))
                else if(public.exec(data[i].image))
                        data[i].image = data[i].image.replace(public,(("https://nealand.org").concat("/proxy/public")))
                else if(skroutzgr.exec(data[i].image))
                        data[i].image = data[i].image.replace(skroutzgr,(("https://nealand.org").concat("/proxy/skoutz-gr")))
                else if(skroutzcy.exec(data[i].image))
                        data[i].image = data[i].image.replace(skroutzcy,(("https://nealand.org").concat("/proxy/skoutz-com-cy")))
                else if(websupplies.exec(data[i].image))
                        data[i].image = data[i].image.replace(websupplies,(("https://nealand.org").concat("/proxy/websupplies-gr")))
                else if(you.exec(data[i].image))
                        data[i].image = data[i].image.replace(you,(("https://nealand.org").concat("/proxy/you-gr")))
                else
                        console.error("No match!");
                }
        },


        top_discound : function top_discound(data)
        {
                top_discount = 0
                position = 0
                for (let i = 0 ; i < data.length ; i++)
                {
                if (parseFloat(data[i].discount) >= parseFloat(top_discount))
                {
                        top_discount = parseFloat(data[i].discount)
                        position  = i  
                }
                }
                if (data.length != 0)
                data[position].top_discount = 'TOP_DISCOUNT'
        },
        


        autoScroll : async function autoScroll(page){
                await page.evaluate(async () => {
                await new Promise((resolve, reject) => {
                        var totalHeight = 0;
                        var distance = 100;
                        var timer = setInterval(() => {
                        var scrollHeight = document.body.scrollHeight;
                        window.scrollBy(0, distance);
                        totalHeight += distance;

                        if(totalHeight >= scrollHeight - window.innerHeight){
                                clearInterval(timer);
                                resolve();
                        }
                        }, 100);
                });
                });
        }
}