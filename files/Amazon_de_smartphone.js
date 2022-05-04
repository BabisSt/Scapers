const puppeteer = require('puppeteer')
const fs = require('fs')
const common_code = require('./_Common_code.js')
const path = require('path');
let config = null;

async function tutorial() {
	try {
		const URL = 'https://www.amazon.de/s?i=electronics&rh=n%3A571954%2Cp_72%3A419117031&s=review-rank&language=en&pd_rd_r=5878c4e2-9695-4eac-8801-ec43b16c2965&pd_rd_w=9EP7o&pd_rd_wg=6wnNU&pf_rd_p=78d5fa09-8886-4404-af2a-d82da3c51b12&pf_rd_r=PP3N7CB2QGEYNW30BQRW&qid=1651153842&ref=sr_st_review-rank'
		config = await common_code.init(URL)



		let pagesToScrape = 20;
		let currentPage = 1
		let data = []
		while (currentPage <= pagesToScrape) {
			await common_code.autoScroll(page);
			let newResults = await config.page.evaluate(() => {
				let results = []
				let items = document.querySelectorAll('div.sg-col-4-of-12.s-result-item.s-asin.sg-col-4-of-16.sg-col.s-widget-spacing-small.sg-col-4-of-20')
				items.forEach((item) => {
					try {
						results.push({
							title: item.querySelector('span.a-size-base-plus.a-color-base.a-text-normal').innerText,
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
				await config.page.waitForSelector('div.sg-col-4-of-12.s-result-item.s-asin.sg-col-4-of-16.sg-col.s-widget-spacing-small.sg-col-4-of-20')
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
