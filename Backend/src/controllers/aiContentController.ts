import { Request, Response } from 'express';
import { generate30DayCalendar, generateDailyPost } from '../utils/aiContentService';
import logger from '../utils/logger';

export async function create30DayCalendar(req: Request, res: Response) {
  try {
    const { niche, city, platform } = req.body;

    if (!niche || !city || !platform) {
      return res
        .status(400)
        .json({ error: 'niche, city, and platform are required' });
    }

    const result = await generate30DayCalendar({ niche, city, platform });

    return res.json(result);
  } catch (error: any) {
    logger.error('Error in create30DayCalendar controller', {
      error: error.message,
      requestBody: req.body,
    });
    return res
      .status(500)
      .json({ error: 'Failed to generate 30-day calendar', message: error.message });
  }
}

export async function createAiContent(req: Request, res: Response) {
  try {
    const { niche, city, platform } = req.body;
    // Note: 'date' and 'context' would typically come from request or DB. Using defaults for now.

    if (!niche || !city || !platform) {
      return res
        .status(400)
        .json({ error: 'niche, city, and platform are required' });
    }

    const result = await generateDailyPost({ niche, city, platform, date: new Date().toISOString().split('T')[0], context: { last7DaysContent: [], recentStats: 'No stats available', brandPositioning: 'Generic' } });

    return res.json(result);
  } catch (error: any) {
    logger.error('Error in createAiContent controller', {
      error: error.message,
      requestBody: req.body,
    });
    return res
      .status(500)
      .json({ error: 'Failed to generate AI content', message: error.message });
  }
}