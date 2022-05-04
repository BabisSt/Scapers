const puppeteer = require('puppeteer')
const fs = require('fs')
const common_code = require('./_Common_code.js')
const path = require('path');
let config = null;


async function tutorial() {
	try {
		const URL = 'https://www.drele.com/product-category/gaming-computers/'
		config = await common_code.init(URL)
		let pagesToScrape = 12;
		let currentPage = 1
		let data = []
		while (currentPage <= pagesToScrape) {
			await common_code.autoScroll(page);
			let newResults = await config.page.evaluate(() => {
				let results = []
				let items = document.querySelectorAll('.taxable.shipping-taxable.purchasable.product-type-simple')
				items.forEach((item) => {
					try {
						results.push({
							title: item.querySelector('div.cg-product-info a span.name').innerText.slice(0, -36),
							url: item.querySelector('a.woocommerce-LoopProduct-link.woocommerce-loop-product__link').href,
							image: item.querySelector('img.attachment-shop_catalog.size-shop_catalog.wp-post-image').src,
							price_old: item.querySelector('span.woocommerce-Price-amount.amount bdi').innerText,
							price_new: item.querySelector('ins span.woocommerce-Price-amount.amount bdi').innerText,
						})
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
				await config.page.click(' li a.next.page-numbers')
				await config.page.waitForSelector('.taxable.shipping-taxable.purchasable.product-type-simple')
				await config.page.waitForSelector(' li a.next.page-numbers')
			}
			currentPage++;
		}


		//for discount , convert string to numbers and do the formula
		for (let i = 0; i < data.length; i++) {
			data[i].discount = (((parseInt(data[i].price_old) - parseInt(data[i].price_new)) / parseInt(data[i].price_old)) * 100).toFixed(1)
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