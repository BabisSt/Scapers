const puppeteer = require('puppeteer')
const fs = require('fs')
const common_code = require('./_Common_code.js')
const path = require('path');
let config = null;


async function tutorial() {
	try {
		const URL = 'https://www.mgmanager.gr/2100-branded-pcs'
		config = await common_code.init(URL)


		let pagesToScrape = 20;
		let currentPage = 1
		let data = []
		while (currentPage <= pagesToScrape) {
			await common_code.autoScroll(page);
			let newResults = await config.page.evaluate(() => {
				let results = []
				let items = document.querySelectorAll('.ajax_block_product')
				items.forEach((item) => {
					try     //an brei antikeimena pou exoun eksantlithei tote phgaine catch
					{
						results.push({
							title: item.querySelector(' a.product-name').innerText,
							url: item.querySelector('a.product-name').href,
							image: item.querySelector('a.product_img_link img.replace-2x.img-responsive.front-image').src,
							price_old: item.querySelector('span.old-price.product-price').innerText.slice(8),
							price_new: item.querySelector('span.price.product-price').innerText,
							//profit: item.querySelector('.sale_percentage1').innerText.slice(11),
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
				await config.page.click(' li#pagination_next_bottom.pagination_next a')
				await config.page.waitForSelector('.ajax_block_product')
				await config.page.waitForSelector(' li#pagination_next_bottom.pagination_next a')
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