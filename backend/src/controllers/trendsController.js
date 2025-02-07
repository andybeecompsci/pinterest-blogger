// controller for handling trend-related requests
const pinterestService = require('../services/pinterestService');

class TrendsController {
    // get pinterest trends
    async getTrends(req, res) {
        try {
            console.log('Fetching Pinterest trends...');
            const trends = await pinterestService.getTrends();
            
            if (!trends || trends.length === 0) {
                console.log('No trends found');
                return res.status(404).json({
                    success: false,
                    error: 'No trends found'
                });
            }

            console.log(`Successfully fetched ${trends.length} trends`);
            res.json({
                success: true,
                count: trends.length,
                data: trends,
                timestamp: new Date().toISOString()
            });

        } catch (error) {
            console.error('Error in trends controller:', error);
            res.status(500).json({
                success: false,
                error: error.message || 'Failed to fetch Pinterest trends',
                timestamp: new Date().toISOString()
            });
        }
    }
}

module.exports = new TrendsController(); 