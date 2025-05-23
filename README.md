# Scrapers

This project includes scrapers for various websites.

### Supported Websites:
- Drele.gr
- E-shop.cy
- HappyDeals.gr
- Kotsovolos.gr
- Lagwoika.gr
- MediaMarkt.gr
- MGManager.gr
- Plaisio.gr
- Public.gr
- Skroutz.gr (and Skroutz.cy.com)
- WebSupplies.gr
- You.gr

### How it Works:

To run the program, the following libraries are required:
- `sudo apt install npm`
- `npm i puppeteer`

### Running the Program:
1. Inside the `Scraping` folder, run the command:
```
   npm run All
```

For each website:
- Open a terminal inside the folder and run the command `npm run All`.
- The program will either open and close Google Chrome tabs or run in headless mode without opening the browser.
- **Do not interact with the program** until it finishes running.

### Results:
For each site, there are two folders:
- **Csv_products**
- **Json_products**

In these folders, you will find the CSV and JSON files generated by the scrapers.

#### Opening CSV Files:
- **For Linux (using LibreOffice)**:
  - Select: `unicode (utf-8)`
  - Separator: `Comma`
  
- **For Windows (using Microsoft Excel)**:
  - Open Excel and select `Data` from the top left.
  - Choose `Import from text/csv` and select the desired CSV file.

### Options & Additional Features:
- **Execution Time**: To measure the execution time of the program, use the following command:
  ```
  time npm run All
  ```

  ### Public Site Option:
- Use the command `npm run Major` to scrape only the main categories of the site, saving time.

### Headless Mode:
- Inside each `.js` file, you can set the `headless` option:
  - `headless: true` -> The browser will not open during execution.
  - `headless: false` -> The browser will open tabs during execution.

### Running a Single Program:
- For quick execution of one specific program, use the following command:
  ```
  npm run One
  ```


This completes the details about the Public Site Option, headless mode, and running a single program. Let me know if you need further clarification or details!

