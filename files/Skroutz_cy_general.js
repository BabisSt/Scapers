const puppeteer = require('puppeteer')
const fs = require('fs')
const common_code = require('./_Common_code.js')
const path = require('path');
let config = null;


async function tutorial() {
	try {
		const URL = 'https://www.skroutz.com.cy/1main_products/technologia.html?s=proionta'
		config = await common_code.init(URL)



		let pagesToScrape = 1;
		let currentPage = 1
		let data = []
		while (currentPage <= pagesToScrape) {
			await common_code.autoScroll(page);
			let newResults = await config.page.evaluate(() => {
				let results = []
				let items = document.querySelectorAll('li.item.product.product-item')
				items.forEach((item) => {
					try     //an brei antikeimena pou exoun eksantlithei tote phgaine catch
					{
						results.push({
							title: item.querySelector(' strong.product.name.product-item-name').innerText,
							url: item.querySelector('a.product-item-link').href,
							image: item.querySelector('img.product-image-photo').src,
							price_old: item.querySelector('span.old-price span.price-container.price-final_price.tax.weee .price-wrapper span.price').innerText,
							price_new: item.querySelector('span.price-container.price-final_price.tax.weee .price-wrapper span.price').innerText,
						})
					}
					catch (error) {
						console.error(error)
					}


				})
				return results
			})
			//console.log(data.price)
			data = data.concat(newResults);


			currentPage++;
		}


		//for discount , convert string to numbers and do the formula
		for (let i = 0; i < data.length; i++) {

			price_new = data[i].price_new.substring(0, data[i].price_new.indexOf(','));
			price_new = price_new.replace('.', ',')

			price_old = data[i].price_old.substring(0, data[i].price_old.indexOf(','));
			price_old = price_old.replace('.', ',')

			if (price_new[0] == 'α') {
				price_new = price_new.substring(3);
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
