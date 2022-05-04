const puppeteer = require('puppeteer')
const fs = require('fs')
const common_code = require('./_Common_code.js')
const path = require('path');
let config = null;


async function tutorial() {
	try {
		const URL = 'https://www.happydeals.gr/zone.php?cat=%CE%A4%CE%B5%CF%87%CE%BD%CE%BF%CE%BB%CE%BF%CE%B3%CE%AF%CE%B1'
		config = await common_code.init(URL)


		let pagesToScrape = 1;
		let currentPage = 1
		let data = []
		while (currentPage <= pagesToScrape) {
			await common_code.autoScroll(page);
			let newResults = await config.page.evaluate(() => {
				let results = []
				let items = document.querySelectorAll('.type-deal.deal-small.col-lg-3.col-md-4')
				items.forEach((item) => {
					try     //an brei antikeimena pou exoun eksantlithei tote phgaine catch
					{
						results.push({
							title: item.querySelector('h2.entry-title.py-2.px-1 a').innerText,
							url: item.querySelector('h2.entry-title.py-2.px-1 a').href,
							image: item.querySelector('a.d-flex figure img.img-fluid.rounded-md').src,
							price_old: item.querySelector('div.deal-worth.ml-2').innerText,
							price_new: item.querySelector('div.deals-loop-price').innerText,

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


		//for discount , convert string to numbers and do the formula
		for (let i = 0; i < data.length; i++) {

			price_new = data[i].price_new
			price_new = price_new.replace(',', '.')

			price_old = data[i].price_old;
			price_old = price_old.replace(',', '.')
			if (price_new[0] == 'α') {
				price_new = price_new.substring(4);
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
