const puppeteer = require('puppeteer')
const fs = require('fs')
const common_code = require('./_Common_code.js')
const path = require('path');
let config = null;


async function tutorial() {
	try {
		const URL = 'https://www.skroutz.gr/c/68/keyboards.html?price_drops=1'
		config = await common_code.init(URL)



		let pagesToScrape = 1;
		let currentPage = 1
		let data = []
		while (currentPage <= pagesToScrape) {
			await common_code.autoScroll(page);
			let newResults = await config.page.evaluate(() => {
				let results = []
				let items = document.querySelectorAll('li.cf.card.with-skus-slider')
				items.forEach((item) => {
					try     //an brei antikeimena pou exoun eksantlithei tote phgaine catch
					{
						results.push({
							title: item.querySelector('div.card-content h2 a.js-sku-link').innerText,
							url: item.querySelector('div.card-content h2 a.js-sku-link').href,
							image: item.querySelector('li.cf.card.with-skus-slider a.js-sku-link.pic img').src,
							price_old: item.querySelector('div.price.react-component.reviewable div strike').innerText,
							price_new: item.querySelector('div.price.react-component.reviewable div a.js-sku-link.sku-link').innerText,
						})
					}
					catch (error) {
						console.error(error)
					}


				})
				return results
			})
			//console.log(data.price)
			data = data.concat(newResults);

			if (currentPage < pagesToScrape) {
				await config.page.goto('https://www.skroutz.gr/c/68/keyboards.html?price_drops=1&page=' + (currentPage + 1), {
					waitUntil: 'networkidle2',
					timeout: 0
				});

			}
			currentPage++;
		}


		//for discount , convert string to numbers and do the formula
		for (let i = 0; i < data.length; i++) {

			price_new = data[i].price_new.substring(0, data[i].price_new.indexOf(','));
			price_new = price_new.replace('.', ',')

			price_old = data[i].price_old.substring(0, data[i].price_old.indexOf(','));
			price_old = price_old.replace('.', ',')

			if (price_new[0] == 'α') {
				price_new = price_new.substring(3);
				data[i].price_new = price_new
			}
			data[i].discount = (((parseFloat(price_old.split(',').join('')) - parseFloat(price_new.split(',').join(''))) / parseFloat(price_old.split(',').join(''))) * 100).toFixed(1)
		}


		common_code.top_discound(data)
		common_code.replace_url(data)

		var scriptName = path.parse(__filename).name;
		common_code.save_file(data, scriptName);


	}
	catch (error) {
		console.error(error)
	}
	finally {
		if (config == null)
			console.log("didnt found it")
		else
			await config.browser.close()
	}
}




tutorial()
