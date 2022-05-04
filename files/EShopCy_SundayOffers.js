const puppeteer = require('puppeteer')
const fs = require('fs')
const common_code = require('./_Common_code.js')
const path = require('path');
let config = null;


async function tutorial() {
	try {
		const URL = 'https://www.e-shop.cy/crazysundays'
		config = await common_code.init(URL)


		let pagesToScrape = 1;
		let currentPage = 1
		let data = []
		while (currentPage <= pagesToScrape) {
			await common_code.autoScroll(page);
			let newResults = await config.page.evaluate(() => {
				let results = []
				let items = document.querySelectorAll('table.crazy-container')
				items.forEach((item) => {
					try     //an brei antikeimena pou exoun eksantlithei tote phgaine catch
					{
						results.push({
							title: item.querySelector('tr.crazy-title-row td.normal.crazy-title-cell a.main b').innerText,
							url: item.querySelector('td.normal.crazy-title-cell a.main').href,
							image: item.querySelector('tr.crazy-row td.crazy-col-left a img').src,
							price_old: item.querySelector('div.crazy-price-wrapper p.before-price').innerText,
							price_new: item.querySelector('div.crazy-price-wrapper p.after-price').innerText,
							discount: item.querySelector('td.crazy-discount.normal b').innerText
						})
					}
					catch (error) {
						console.error(error)
					}


				})
				return results
			})

			data = data.concat(newResults);


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
