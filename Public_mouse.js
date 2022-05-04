const puppeteer = require('puppeteer')
const fs = require('fs')
const common_code = require('./_Common_code.js')
const path = require('path');
let config = null;


async function tutorial() {
	try {
		const URL = 'https://www.public.gr/cat/perifereiaka/mouse?r=90&ob=disc'
		config = await common_code.init(URL)

		let pagesToScrape = 2;
		let currentPage = 1
		let data = []
		const button = await config.page.$('div.py-4.d-flex.flex-column.align-items-center app-mdc-button button.mdc-button.animate.mdc-button--outlined')
		await button.evaluate(b => b.click())
		await config.page.waitForTimeout(5000)
		while (currentPage <= pagesToScrape) {
			await common_code.autoScroll(page);
			let newResults = await config.page.evaluate(() => {
				let results = []
				let items = document.querySelectorAll('div.col.col-6.col-lg-4.col-xl-3.product--view--grid')
				items.forEach((item) => {
					try {
						results.push({
							title: item.querySelector('span.mdc-link-button__label.mdc-link-button__label--clamp--2').innerText,
							url: item.querySelector('a.product__gallery__image.animate').href,
							image: getComputedStyle(item.querySelector('a.product__gallery__image.animate div.animate.img')).getPropertyValue('background-image').slice(5).slice(0, -2),
							price_old: item.querySelector('div.product__price.product__price--initial.mdc-typography--caption.text-text-secondary span').innerText,
							price_new: item.querySelector('div.product__price.product__price--large.text-primary').innerText,
							// profit: item.querySelector('div.product__price.product__price--discount.mdc-typography--caption.text-success span').innerText,
						})
					}
					catch (error) {
						console.error(error)
					}
				})
				return results
			})
			data = newResults


			if (currentPage < pagesToScrape) {

				const button = await config.page.$('div.py-4.d-flex.flex-column.align-items-center app-mdc-button button.mdc-button.animate.mdc-button--outlined')
				await button.evaluate(b => b.click())
			}
			currentPage++;
		}




		//for discount , convert string to numbers and do the formula
		for (let i = 0; i < data.length; i++) {
			price_new = data[i].price_new.substring(0, data[i].price_new.indexOf(','));
			price_new = price_new.replace('.', ',')

			price_old = data[i].price_old.substring(0, data[i].price_old.indexOf('.'));
			price_old = price_old.replace(',', '')

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