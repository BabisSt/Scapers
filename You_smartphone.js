const puppeteer = require('puppeteer')
const fs = require('fs')
const common_code = require('./_Common_code.js')
const path = require('path');
let config = null;

async function tutorial() {
	try {
		const URL = 'https://www.you.gr/tilefonia-tablets/smartphones-ana-brand/ola-ta-smartphones?view=grid&ps=80'
		config = await common_code.init(URL)


		let pagesToScrape = 1;
		let currentPage = 1
		let data = []
		while (currentPage <= pagesToScrape) {
			await common_code.autoScroll(page);
			let newResults = await config.page.evaluate(() => {
				let results = []
				let items = document.querySelectorAll('div.cmnProductItem.flexCol_xs_6.flexCol_sm_6.flexCol_md_6.flexCol_lg_4.flexCol_xl_3')
				items.forEach((item) => {
					try     //an brei antikeimena pou exoun eksantlithei tote phgaine catch
					{
						results.push({
							title: item.querySelector(' div.inner.radiusCorners h2 a.title').innerText,
							url: item.querySelector('div.inner.radiusCorners h2 a.title').href,
							image: item.querySelector('picture img.productImg').src,
							price_old: item.querySelector('span.old-price').innerText,
							price_new: item.querySelector('span.final-price').innerText,
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
				await config.page.click('li.page-item a.page-link')
				await config.page.waitForSelector('div.cmnProductItem.flexCol_xs_6.flexCol_sm_6.flexCol_md_6.flexCol_lg_4.flexCol_xl_3')
				await config.page.waitForSelector('li.page-item a.page-link')
			}
			currentPage++;
		}


		//for discount , convert string to numbers and do the formula
		for (let i = 0; i < data.length; i++) {
			price_new = data[i].price_new.substring(0, data[i].price_new.indexOf(','));
			price_old = data[i].price_old.substring(0, data[i].price_old.indexOf(','));

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