const puppeteer = require('puppeteer')
const fs = require('fs')
const common_code = require('./_Common_code.js')
const path = require('path');
let config = null;

async function tutorial() {
	try {
		const URL = 'https://www.websupplies.gr/fotografikes-mihanes#/pageSize=48&viewMode=grid&orderBy=0&pageNumber=1'
		config = await common_code.init(URL)

		let pagesToScrape = 1;
		let currentPage = 1
		let data = []
		while (currentPage <= pagesToScrape) {
			await common_code.autoScroll(page);
			let newResults = await config.page.evaluate(() => {
				let results = []
				let items = document.querySelectorAll('.item-box')
				items.forEach((item) => {
					try {
						results.push({
							title: item.querySelector('h2.product-title a').innerText,
							url: item.querySelector('h2.product-title a').href,
							image: item.querySelector('div.picture a img').src,
							price_old: item.querySelector('span.price.old-price').innerText,
							price_new: item.querySelector('span.price.actual-price').innerText,
							discount: item.querySelector('span.ribbon-txt').innerText
						})
					}
					catch (error) {
						console.error(error)
					}
				})
				return results
			})
			//if(data[0].title !== newResults[0].title)
			data = data.concat(newResults)


			if (currentPage < pagesToScrape) {
				try {
					const button = await config.page.$('div.pager ul li.next-page a')
					await button.evaluate(b => b.click())
					await config.page.waitForTimeout(3000)
				}
				catch (error) {
					console.error(error)
				}


			}
			currentPage++;
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