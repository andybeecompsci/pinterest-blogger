// service for handling pinterest trends scraping
const puppeteer = require('puppeteer');

class PinterestService {
    // initialize puppeteer browser
    async initBrowser() {
        return await puppeteer.launch({
            headless: 'new',  // use new headless mode
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
    }

    // scrape trends from pinterest
    async getTrends() {
        const browser = await this.initBrowser();
        try {
            const page = await browser.newPage();
            
            // navigate to pinterest trends
            await page.goto('https://trends.pinterest.com/');
            
            // wait for trends to load
            await page.waitForSelector('.trendingTerm', { timeout: 5000 });
            
            // extract trending terms
            const trends = await page.evaluate(() => {
                const trendElements = document.querySelectorAll('.trendingTerm');
                return Array.from(trendElements).map(element => ({
                    term: element.textContent.trim(),
                    category: element.closest('.trendCategory')?.querySelector('.categoryName')?.textContent || 'General'
                }));
            });
            
            return trends;
        } catch (error) {
            console.error('Error scraping Pinterest trends:', error);
            throw error;
        } finally {
            await browser.close();
        }
    }
}

module.exports = new PinterestService(); 