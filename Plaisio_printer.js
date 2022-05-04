const puppeteer = require('puppeteer')
const fs = require('fs')
const common_code = require('./_Common_code.js')
const path = require('path');
let config = null;


async function tutorial() {
	try {
		const URL = 'https://www.plaisio.gr/ektiposi/mixanimata-ektiposis/clearance?location=categories%3d%ce%95%ce%ba%cf%84%cf%8d%cf%80%cf%89%cf%83%ce%b7%2c%ce%9c%ce%b7%cf%87%ce%b1%ce%bd%ce%ae%ce%bc%ce%b1%cf%84%ce%b1+%ce%95%ce%ba%cf%84%cf%8d%cf%80%cf%89%cf%83%ce%b7%cf%82%3bproductstatusdescr%3dclearance%2c%ce%a0%cf%81%ce%bf%cf%83%cf%86%ce%bf%cf%81%ce%ac'
		config = await common_code.init(URL)

		await config.page.goto(URL, {
			waitUntil: 'networkidle2',
			timeout: 0
		});

		let pagesToScrape = 5;
		let currentPage = 1
		let data = []
		while (currentPage <= pagesToScrape) {
			await common_code.autoScroll(page);
			let newResults = await config.page.evaluate(() => {
				let results = []
				let items = document.querySelectorAll('.column.item')
				items.forEach((item) => {
					try     //an brei antikeimena pou exoun eksantlithei tote phgaine catch
					{
						if (item.querySelector('div.price-container div.price div div.from-price').innerText) {
							results.push({
								title: item.querySelector('.product-title').innerText,
								url: item.querySelector('a').href,
								image: item.querySelector('div.image a picture img.lazyloaded').srcset,
								price_old: item.querySelector('div.price-container div.price div div.from-price').innerText,
								price_new: item.querySelector('div.price-container div.price div div.price').innerText,
							})
						}
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
				await config.page.click('div.text-center ul.pagination li.next.arrow a')
				await config.page.waitForSelector('.column.item')
				await config.page.waitForSelector('div.text-center ul.pagination li.next.arrow a')
			}
			currentPage++;
		}


		//for discount , convert string to numbers and do the formula
		for (let i = 0; i < data.length; i++) {
			price_new = data[i].price_new.substring(0, data[i].price_new.indexOf(','));
			price_new = price_new.replace('.', ',')

			price_old = data[i].price_old.substring(0, data[i].price_old.indexOf(','));
			price_old = price_old.replace('.', ',')

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