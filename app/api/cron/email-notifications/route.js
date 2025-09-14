import { NextResponse } from 'next/server';
import { getBlocksForNotification, markEmailSent, checkUserOverlappingNotifications } from '../../../../lib/services/quietBlocks.js';
import { sendEmailNotification } from '../../../../lib/emailService.js';

export async function GET(request) {
  try {
    // Verify this is a legitimate cron request
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET || 'your-cron-secret';
    
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get blocks that need notifications
    const blocksNeedingNotification = await getBlocksForNotification();
    let processedCount = 0;
    let skippedCount = 0;

    // Process each block
    for (const block of blocksNeedingNotification) {
      try {
        // Check if user has overlapping notifications in the last 10 minutes
        const hasOverlap = await checkUserOverlappingNotifications(block.userId);
        
        if (!hasOverlap) {
          await sendEmailNotification(block);
          await markEmailSent(block._id);
          processedCount++;
          console.log(`✅ Email sent for block: ${block.title} to ${block.userEmail}`);
        } else {
          skippedCount++;
          console.log(`⏭️ Skipped overlapping notification for: ${block.title}`);
        }
      } catch (error) {
        console.error(`❌ Failed to process block ${block._id}:`, error);
      }
    }

    return NextResponse.json({ 
      success: true, 
      totalBlocks: blocksNeedingNotification.length,
      processed: processedCount,
      skipped: skippedCount,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('CRON email notification error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// Also allow POST for manual testing
export async function POST(request) {
  return GET(request);
}