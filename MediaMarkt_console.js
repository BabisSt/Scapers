const puppeteer = require('puppeteer')
const fs = require('fs')
const common_code = require('./_Common_code.js')
const path = require('path');
let config = null;


async function tutorial() {
	try {
		const URL = 'https://www.mediamarkt.gr/category/gaming/konsoles?view=grid'
		config = await common_code.init(URL)


		let pagesToScrape = 1;
		let currentPage = 1
		let data = []
		while (currentPage <= pagesToScrape) {
			await common_code.autoScroll(page);
			let newResults = await config.page.evaluate(() => {
				let results = []
				let items = document.querySelectorAll('div.row.row-grid div.col.col-12.col-sm-6.col-md-4.col-xl-3.app-product-grid')
				items.forEach((item) => {
					try     //an brei antikeimena pou exoun eksantlithei tote phgaine catch
					{
						if (item.querySelector('div.article__head a.article__wrapper').innerText.split('\n')[0] != null && item.querySelector('div.article__head a.article__wrapper').innerText.split('\n')[1] != null) // kai oi duo times uparxoun, to proion exei ekptwsh
						{
							results.push({
								title: item.querySelector('h3.article__title a.animate').innerText,
								url: item.querySelector('h3.article__title a.animate').href,
								image: item.querySelector('img.article__image.animate').src,
								price_old: item.querySelector('div.article__head a.article__wrapper').innerText.split('\n')[0],
								price_new: item.querySelector('div.article__head a.article__wrapper').innerText.split('\n')[1],
							})
						}

					}
					catch (error) {
						console.error(error)
					}


				})
				return results
			})
			//console.log(data.price)
			data = data.concat(newResults);

			if (currentPage < pagesToScrape) {
				await config.page.click('li.pagination-next a')
				await config.page.waitForSelector('div.row.row-grid div.col.col-12.col-sm-6.col-md-4.col-xl-3.app-product-grid')
			}
			currentPage++;
		}


		//for discount , convert string to numbers and do the formula
		for (let i = 0; i < data.length; i++) {
			price_new = data[i].price_new.substring(0, data[i].price_new.indexOf('.'));
			price_old = data[i].price_old.substring(0, data[i].price_old.indexOf('.'));

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