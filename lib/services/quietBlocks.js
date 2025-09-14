import { getDatabase } from '../mongodb.js';
import { ObjectId } from 'mongodb';

export async function createQuietBlock(userId, data) {
  const db = await getDatabase();
  const collection = db.collection('quiet_blocks');

  const quietBlock = {
    userId,
    title: data.title,
    description: data.description,
    startTime: data.startTime,
    endTime: data.endTime,
    emailSent: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await collection.insertOne(quietBlock);
  return { ...quietBlock, _id: result.insertedId.toString() };
}

export async function getUserQuietBlocks(userId) {
  const db = await getDatabase();
  const collection = db.collection('quiet_blocks');

  const blocks = await collection
    .find({ userId })
    .sort({ startTime: 1 })
    .toArray();

  return blocks.map(block => ({
    ...block,
    _id: block._id?.toString(),
  }));
}

export async function deleteQuietBlock(userId, blockId) {
  const db = await getDatabase();
  const collection = db.collection('quiet_blocks');

  const result = await collection.deleteOne({
    _id: new ObjectId(blockId),
    userId,
  });

  return result.deletedCount > 0;
}

export async function getUpcomingBlocks(userId) {
  const db = await getDatabase();
  const collection = db.collection('quiet_blocks');
  const now = new Date();

  const blocks = await collection
    .find({
      userId,
      startTime: { $gt: now },
    })
    .sort({ startTime: 1 })
    .limit(5)
    .toArray();

  return blocks.map(block => ({
    ...block,
    _id: block._id?.toString(),
  }));
}

export async function getBlocksForNotification() {
  const db = await getDatabase();
  const collection = db.collection('quiet_blocks');
  const usersCollection = db.collection('users');
  const now = new Date();
  const tenMinutesFromNow = new Date(now.getTime() + 10 * 60 * 1000);

  const blocks = await collection
    .find({
      startTime: {
        $gte: now,
        $lte: tenMinutesFromNow,
      },
      emailSent: false,
    })
    .toArray();

  // Get user details for each block
  const blocksWithUsers = await Promise.all(
    blocks.map(async (block) => {
      const user = await usersCollection.findOne({ _id: new ObjectId(block.userId) });
      return {
        ...block,
        _id: block._id?.toString(),
        userEmail: user?.email,
        userName: user?.name,
      };
    })
  );

  return blocksWithUsers;
}

export async function markEmailSent(blockId) {
  const db = await getDatabase();
  const collection = db.collection('quiet_blocks');

  await collection.updateOne(
    { _id: new ObjectId(blockId) },
    {
      $set: {
        emailSent: true,
        updatedAt: new Date(),
      },
    }
  );
}

export async function checkUserOverlappingNotifications(userId) {
  const db = await getDatabase();
  const collection = db.collection('quiet_blocks');
  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

  const recentNotifications = await collection.findOne({
    userId,
    emailSent: true,
    updatedAt: { $gte: tenMinutesAgo },
  });

  return !!recentNotifications;
}