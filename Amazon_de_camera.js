const puppeteer = require('puppeteer')
const fs = require('fs')
const common_code = require('./_Common_code.js')
const path = require('path');
let config = null;

async function tutorial() {
	try {
		const URL = 'https://www.amazon.de/s?k=Digital+Cameras&i=photo&rh=n%3A571862&s=review-rank&c=ts&qid=1651153041&ts_id=571862&ref=sr_st_review-rank'
		config = await common_code.init(URL)

		let pagesToScrape = 30;
		let currentPage = 1
		let data = []
		while (currentPage <= pagesToScrape) {
			await common_code.autoScroll(page);
			let newResults = await config.page.evaluate(() => {
				let results = []
				let items = document.querySelectorAll('div.s-main-slot.s-result-list.s-search-results.sg-row div.s-result-item.s-asin.sg-col-0-of-12.sg-col-16-of-20.sg-col.s-widget-spacing-small.sg-col-12-of-16')
				items.forEach((item) => {
					try {
						results.push({
							title: item.querySelector('span.a-size-medium.a-color-base.a-text-normal').innerText,
							url: item.querySelector('a.a-link-normal.s-underline-text.s-underline-link-text.s-link-style.a-text-normal').href,
							image: item.querySelector('img.s-image').src,
							price_old: item.querySelector('div span.a-price.a-text-price span.a-offscreen').innerText.slice(1),
							price_new: item.querySelector('span.a-price-whole').innerText,
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
				await config.page.click('a.s-pagination-item.s-pagination-next.s-pagination-button.s-pagination-separator')
				await config.page.waitForSelector('div.s-main-slot.s-result-list.s-search-results.sg-row div.s-result-item.s-asin.sg-col-0-of-12.sg-col-16-of-20.sg-col.s-widget-spacing-small.sg-col-12-of-16')
				await config.page.waitForSelector('a.s-pagination-item.s-pagination-next.s-pagination-button.s-pagination-separator')
			}
			currentPage++;
		}



		for (let i = 0; i < data.length; i++) {
			price_new = data[i].price_new
			price_old = data[i].price_old

			data[i].discount = (((parseFloat(price_old) - parseFloat(price_new)) / parseFloat(price_old)) * 100).toFixed(1)
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