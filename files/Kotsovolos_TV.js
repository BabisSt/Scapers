const puppeteer = require('puppeteer')
const fs = require('fs')
const common_code = require('./_Common_code.js')
const path = require('path');
let config = null;

async function tutorial() {
	try {
		const URL = 'https://www.kotsovolos.gr/sound-vision/televisions/led-lcd?pageSize=60'
		config = await common_code.init(URL)

		let pagesToScrape = 6;
		let currentPage = 1
		let data = []
		while (currentPage <= pagesToScrape) {
			await common_code.autoScroll(page);
			let newResults = await config.page.evaluate(() => {
				let results = []
				let items = document.querySelectorAll('div.listWrap div.product')
				items.forEach((item) => {
					try     //an brei antikeimena pou exoun eksantlithei tote phgaine catch
					{
						results.push({
							title: item.querySelector('h2 a').innerText,
							url: item.querySelector('h2 a').href,
							image: item.querySelector('div.img a img').src,
							price_old: item.querySelector('div.priceWithVat').innerText.split('\n')[1].slice(2),
							price_new: item.querySelector('div.priceWithVat').innerText.split("κ")[0].slice(6).split('€')[1].slice(0, -1),
							//profit: item.querySelector('div.priceWithVat').innerText.split("€").pop(),
						})

					}
					catch (error) {
						console.error(error)
					}
				})
				return results
			})

			data = data.concat(newResults);

			if (currentPage < pagesToScrape) {
				await config.page.click('li.pagination_next a')
				await config.page.waitForSelector('div.listWrap div.product')
				await config.page.waitForSelector('li.pagination_next a')
			}
			currentPage++;
		}


		//for discount , convert string to numbers and do the formula
		for (let i = 0; i < data.length; i++) {
			price_new = data[i].price_new.substring(0, data[i].price_new.indexOf('.'));
			price_old = data[i].price_old.substring(0, data[i].price_old.indexOf('.'));

			data[i].discount = (((parseInt(price_old) - parseInt(price_new)) / parseInt(price_old)) * 100).toFixed(1)
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
