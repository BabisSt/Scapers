const puppeteer = require('puppeteer')
const fs = require('fs')
const common_code = require('./_Common_code.js')
const path = require('path');
let config = null;


async function tutorial() {
	try {
		const URL = 'https://www.plaisio.gr/pc-perifereiaka/desktops/prosfora?location=categories%3dpc+%26+%ce%a0%ce%b5%cf%81%ce%b9%cf%86%ce%b5%cf%81%ce%b5%ce%b9%ce%b1%ce%ba%ce%ac%2cdesktops%3bproductstatusdescr%3d%ce%a0%cf%81%ce%bf%cf%83%cf%86%ce%bf%cf%81%ce%ac%2cclearance'
		config = await common_code.init(URL)

		let pagesToScrape = 3;
		let currentPage = 1
		let data = []
		while (currentPage <= pagesToScrape) {
			await common_code.autoScroll(page);
			let newResults = await config.page.evaluate(() => {
				let results = []
				let items = document.querySelectorAll('.column.item')
				items.forEach((item) => {
					try     //an brei antikeimena pou exoun eksantlithei tote phgaine catch
					{
						if (item.querySelector('div.price-container div.price div div.from-price').innerText) {
							results.push({
								title: item.querySelector('.product-title').innerText,
								url: item.querySelector('a').href,
								image: item.querySelector('div.image a picture img.lazyloaded').srcset,
								price_old: item.querySelector('div.price-container div.price div div.from-price').innerText,
								price_new: item.querySelector('div.price-container div.price div div.price').innerText,
							})
						}
					}
					catch (error) {
						console.error(error)
					}
				})
				return results
			})

			data = data.concat(newResults)

			if (currentPage < pagesToScrape) {
				//await config.page.waitForTimeout(5000);
				await config.page.click('div.text-center ul.pagination li.next.arrow a')
				await config.page.waitForSelector('.column.item')
				await config.page.waitForSelector('div.text-center ul.pagination li.next.arrow a')
			}
			currentPage++;
		}


		//for discount , convert string to numbers and do the formula
		for (let i = 0; i < data.length; i++) {
			price_new = data[i].price_new.substring(0, data[i].price_new.indexOf(','));
			price_new = price_new.replace('.', ',')

			price_old = data[i].price_old.substring(0, data[i].price_old.indexOf(','));
			price_old = price_old.replace('.', ',')

			data[i].discount = (((parseInt(price_old.split(',').join('')) - parseInt(price_new.split(',').join(''))) / parseInt(price_old.split(',').join(''))) * 100).toFixed(1)
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
