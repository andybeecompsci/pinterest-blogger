// service for handling pinterest trends scraping
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

class PinterestService {
    constructor() {
        // pinterest credentials should come from environment variables
        this.email = process.env.PINTEREST_EMAIL;
        this.password = process.env.PINTEREST_PASSWORD;
        this.debugDir = path.join(__dirname, '../../../debug-screenshots');
        this.cookiesPath = path.join(__dirname, '../../../cookies.json');
        
        // create debug directory if it doesn't exist
        if (!fs.existsSync(this.debugDir)) {
            fs.mkdirSync(this.debugDir, { recursive: true });
        }
    }

    // initialize puppeteer browser
    async initBrowser() {
        return await puppeteer.launch({
            headless: false,  // set to false to see what's happening
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--window-size=1920,1080'
            ]
        });
    }

    async takeScreenshot(page, name) {
        const screenshotPath = path.join(this.debugDir, `${name}-${Date.now()}.png`);
        await page.screenshot({ path: screenshotPath, fullPage: true });
        console.log(`Screenshot saved: ${screenshotPath}`);
    }

    // save cookies to file
    async saveCookies(page) {
        const cookies = await page.cookies();
        fs.writeFileSync(this.cookiesPath, JSON.stringify(cookies, null, 2));
        console.log('Cookies saved');
    }

    // load cookies from file
    async loadCookies(page) {
        try {
            if (fs.existsSync(this.cookiesPath)) {
                const cookies = JSON.parse(fs.readFileSync(this.cookiesPath));
                await page.setCookie(...cookies);
                console.log('Cookies loaded');
                return true;
            }
        } catch (error) {
            console.log('No valid cookies found');
        }
        return false;
    }

    // verify if session is still valid
    async verifySession(page) {
        try {
            await page.goto('https://www.pinterest.com', { waitUntil: 'networkidle0' });
            // check if we're still logged in by looking for a login button
            const loginButton = await page.$('button[data-test-id="login-button"]');
            return !loginButton; // if no login button, we're logged in
        } catch (error) {
            return false;
        }
    }

    // handle pinterest login
    async login(page) {
        try {
            // try to load existing cookies first
            const cookiesLoaded = await this.loadCookies(page);
            if (cookiesLoaded) {
                // verify if cookies are still valid
                const sessionValid = await this.verifySession(page);
                if (sessionValid) {
                    console.log('Reusing existing session');
                    return;
                }
            }

            // if no valid cookies, proceed with login
            if (!this.email || !this.password) {
                throw new Error('Pinterest credentials not found in environment variables');
            }

            console.log('Proceeding with fresh login');
            await page.goto('https://www.pinterest.com/login/');
            await this.delay(2000); // Add delay before login attempt

            await page.waitForSelector('input[type="email"]', { visible: true });
            await page.waitForSelector('input[type="password"]', { visible: true });

            await page.type('input[type="email"]', this.email);
            await page.type('input[type="password"]', this.password);

            await Promise.all([
                page.click('button[type="submit"]'),
                page.waitForNavigation({ waitUntil: 'networkidle0' })
            ]);

            console.log('Logged in successfully');
            await this.delay(2000);

            // save cookies for future use
            await this.saveCookies(page);

        } catch (error) {
            console.error('Login failed:', error);
            throw new Error('Failed to login to Pinterest');
        }
    }

    // scrape trends from pinterest
    async getTrends() {
        const browser = await this.initBrowser();
        let page = null;

        try {
            // create new page
            page = await browser.newPage();
            
            // set viewport and user agent
            await page.setViewport({ width: 1920, height: 1080 });
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

            // login first
            await this.login(page);
            
            // navigate to pinterest trends
            await page.goto('https://trends.pinterest.com/', {
                waitUntil: 'networkidle0'
            });
            console.log('Navigated to Pinterest Trends');

            // wait for main content to load
            await this.delay(5000); // give time for dynamic content

            // log page content for debugging
            const pageContent = await page.content();
            console.log('Page content loaded, length:', pageContent.length);

            // extract trending terms
            const trends = await page.evaluate(() => {
                const trends = [];
                
                // try to find trend containers
                const trendContainers = document.querySelectorAll('[data-test-id="trend-card"], [data-test-id="trend-item"], .trendingItem');
                console.log('Found trend containers:', trendContainers.length);

                trendContainers.forEach(container => {
                    // log container content for debugging
                    console.log('Container HTML:', container.outerHTML);

                    // try multiple ways to get the trend text
                    let trendText = '';
                    let category = 'General';

                    // try different selectors for trend text
                    const possibleTextElements = [
                        container.querySelector('.trend-title'),
                        container.querySelector('.trend-name'),
                        container.querySelector('h3'),
                        container.querySelector('span[role="heading"]'),
                        container.querySelector('div[style*="font-weight: bold"]')
                    ].filter(Boolean);

                    if (possibleTextElements.length > 0) {
                        trendText = possibleTextElements[0].textContent.trim();
                    } else {
                        // if no specific element found, try getting direct text
                        trendText = container.textContent.trim();
                    }

                    // try to get category
                    const categoryElement = container.closest('section')?.querySelector('h2, .category-title');
                    if (categoryElement) {
                        category = categoryElement.textContent.trim();
                    }

                    if (trendText && trendText.length > 0) {
                        trends.push({
                            term: trendText,
                            category: category,
                            timestamp: new Date().toISOString()
                        });
                    }
                });

                return trends;
            });

            console.log(`Scraped ${trends.length} trends:`, trends);
            return trends;

        } catch (error) {
            console.error('Error scraping Pinterest trends:', error);
            throw error;
        } finally {
            if (page) await page.close();
            await browser.close();
        }
    }

    // handle initial page load and potential cookie consent
    async handleInitialPageLoad(page) {
        try {
            // wait for any content to load
            await page.waitForSelector('body', { timeout: 10000 });
            
            // log the page content for debugging
            const content = await page.content();
            console.log('Page content length:', content.length);
            
            // wait for trends to load (using a more general selector)
            await page.waitForSelector('div[role="main"]', { timeout: 10000 });
            
            // handle cookie consent if it appears
            try {
                const cookieButton = await page.$('button[data-testid="cookie-accept-button"]');
                if (cookieButton) {
                    await cookieButton.click();
                    await this.delay(1000);
                }
            } catch (e) {
                console.log('No cookie consent found or already accepted');
            }

            // ensure the page has loaded completely
            await this.delay(5000);
        } catch (error) {
            console.error('Page load error:', error);
            throw new Error('Failed to load Pinterest Trends page: ' + error.message);
        }
    }

    // extract trends from the page
    async extractTrends(page) {
        try {
            // log the current URL
            console.log('Current URL:', await page.url());
            
            // get page content for debugging
            const content = await page.content();
            fs.writeFileSync(path.join(this.debugDir, 'page-content.html'), content);

            return await page.evaluate(() => {
                const trends = new Set();
                
                // try different selectors for trending content
                const selectors = [
                    // pins
                    'div[data-test-id="pin"] a[title]',
                    'div[data-test-id="pinrep"] a[title]',
                    // ideas
                    'div[data-test-id="idea-card"] span',
                    // trending searches
                    'div[data-test-id="trending-search-item"]',
                    // general text content that might be trends
                    'a[role="link"] div[style*="font-weight: bold"]'
                ];

                selectors.forEach(selector => {
                    document.querySelectorAll(selector).forEach(element => {
                        const text = element.textContent?.trim() || element.getAttribute('title')?.trim();
                        if (text && text.length > 3) {
                            trends.add(text);
                        }
                    });
                });

                return Array.from(trends).map(term => ({
                    term,
                    category: 'General',
                    timestamp: new Date().toISOString()
                }));
            });
        } catch (error) {
            console.error('Error in extractTrends:', error);
            return [];
        }
    }

    // helper method to delay execution (for rate limiting if needed)
    async delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

module.exports = new PinterestService(); 