// controller for handling trend-related requests
const pinterestService = require('../services/pinterestService');

class TrendsController {
    // get pinterest trends
    async getTrends(req, res) {
        try {
            const trends = await pinterestService.getTrends();
            res.json({
                success: true,
                data: trends
            });
        } catch (error) {
            console.error('Error in trends controller:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch Pinterest trends'
            });
        }
    }
}

module.exports = new TrendsController(); 