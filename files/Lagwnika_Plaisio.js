const puppeteer = require('puppeteer')
const fs = require('fs')
const common_code = require('./_Common_code.js')
const path = require('path');
let config = null;


async function tutorial() {
	try {
		const URL = 'https://www.lagonika.gr/katastima/plaiso/'
		config = await common_code.init(URL)

		let pagesToScrape = 40;
		let currentPage = 1
		let data = []
		while (currentPage <= pagesToScrape) {
			await common_code.autoScroll(page);
			let newResults = await config.page.evaluate(() => {
				let results = []
				let items = document.querySelectorAll('div.prosfores.type-prosfores.status-publish.has-post-thumbnail')
				items.forEach((item) => {
					try {
						if (getComputedStyle(item.querySelector('h3.la-listview-title a')).getPropertyValue('color') == 'rgb(46, 46, 50)') {
							results.push({
								title: item.querySelector('h3.la-listview-title').innerText,
								url_original: item.querySelector('div.la-des-prosfora-btn a').href,
								url_lagwnika: item.querySelector('div.lagonika-listview-offer-top-image a').href,
								image: item.querySelector('div.lagonika-listview-offer-top-image a img').src,
								time_start: item.querySelector('div.la-prin-apo').innerText,
								time_stop: item.querySelector('span.la-listview-StartStop').innerText,
								price_new: item.querySelector('div.la-offer-price').innerText,

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
				await config.page.click('ul li a.page-link.next')
				await config.page.waitForSelector('div.prosfores.type-prosfores.status-publish.has-post-thumbnail')
				await config.page.waitForSelector('ul li a.page-link.next')
			}
			currentPage++;
		}



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
