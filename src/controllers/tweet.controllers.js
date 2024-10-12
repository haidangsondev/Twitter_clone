import asyncHandler from "express-async-handler";
import {
  addTweet,
  deleteTweetById,
  getTweetById,
  updateTweetById,
  updateTweetLikesDislikes,
} from "../services/tweet.services.js";
import { addHashtag, removeHashtag } from "../services/hashtag.services.js";
import { addReply, getCommentsUser } from "../services/comment.services.js";
import { createNotification } from "../services/notification.services.js";

export const createTweet = asyncHandler(async (req, res) => {
  const { _id } = req.user;

  const images = req?.files?.images?.map((item) => item.path);

  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({
      success: false,
      message: "Thông tin tạo bài viết là bắt buộc",
    });
  }

  if (images && images.length > 0) {
    req.body.images = images;
  }

  const newTweet = {
    user_id: _id,
    ...req.body,
    hashtags: req.body?.hashtags,
  };

  const tweet = await addTweet(newTweet);

  if (!tweet) {
    return res.status(500).json({
      success: false,
      message: "Tạo tweet không thành công",
    });
  }

  if (req.body.hashtags) {
    const hashtagList = req.body.hashtags;
    await Promise.all(
      hashtagList.map(async (item) => {
        return await addHashtag({ hashtag: item, tweet_ids: tweet._id });
      })
    );
  }

  await createNotification({
    user_id: _id,
    type: "create_tweet",
    targetId: tweet._id,
    targetModel: "Tweet",
    description: `Tạo bài viết: ${tweet.content}`,
  });

  res.status(201).json({
    success: true,
    message: "Tweet đã được tạo thành công",
    tweet,
  });
});

export const updateTweet = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { tweet_id } = req.params;

  const tweet = await getTweetById(tweet_id);

  if (!tweet || String(tweet.user_id) !== String(_id)) {
    return res.status(403).json({
      success: false,
      message: "Bạn không có quyền cập nhật tweet này hoặc tweet không tồn tại",
    });
  }

  const images = req?.files?.images?.map((item) => item.path);

  const updatedTweetData = {
    ...req.body,
  };

  if (images && images.length > 0) {
    updatedTweetData.images = images;
  }

  const updatedTweet = await updateTweetById(tweet_id, updatedTweetData);

  if (!updatedTweet) {
    return res.status(500).json({
      success: false,
      message: "Cập nhật tweet không thành công",
    });
  }

  if (req.body.hashtags) {
    const newHashtags = req.body.hashtags;

    if (tweet.hashtags && tweet.hashtags.length > 0) {
      await Promise.all(
        tweet.hashtags.map(async (oldHashtag) => {
          return await removeHashtag({
            hashtag: oldHashtag,
            tweet_ids: tweet_id,
          });
        })
      );
    }

    await Promise.all(
      newHashtags.map(async (newHashtag) => {
        return await addHashtag({ hashtag: newHashtag, tweet_ids: tweet_id });
      })
    );
  }

  res.status(200).json({
    success: true,
    message: "Tweet đã được cập nhật thành công",
    tweet: updatedTweet,
  });
});

export const deleteTweet = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { tweet_id } = req.params;

  const tweet = await getTweetById(tweet_id);

  if (!tweet || String(tweet.user_id) !== String(_id)) {
    return res.status(403).json({
      success: false,
      message: "Bạn không có quyền xóa tweet này hoặc tweet không tồn tại",
    });
  }

  if (tweet.hashtags && tweet.hashtags.length > 0) {
    await Promise.all(
      tweet.hashtags.map(async (hashtag) => {
        return await removeHashtag({ hashtag, tweet_ids: tweet_id });
      })
    );
  }

  await deleteTweetById(tweet_id);

  res.status(200).json({
    success: true,
    message: "Tweet đã được xóa thành công",
  });
});

export const likeTweet = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { tweet_id } = req.params;

  const tweet = await getTweetById(tweet_id);
  if (!tweet) {
    return res.status(404).json({
      success: false,
      message: "Tweet không tồn tại",
    });
  }

  const alreadyLiked = tweet.likes.includes(_id);
  const alreadyDisliked = tweet.dislikes.includes(_id);

  if (alreadyLiked) {
    tweet.likes = tweet.likes.filter(
      (userId) => String(userId) !== String(_id)
    );
    tweet.likes_count--;
  } else {
    if (alreadyDisliked) {
      tweet.dislikes = tweet.dislikes.filter(
        (userId) => String(userId) !== String(_id)
      );
      tweet.dislikes_count--;
    } else {
      tweet.likes.push(_id);
      tweet.likes_count++;
    }
  }

  await updateTweetLikesDislikes({
    tweet_id,
    likes: tweet.likes,
    dislikes: tweet.dislikes,
    likes_count: tweet.likes_count,
    dislikes_count: tweet.dislikes_count,
  });

  const type = alreadyLiked ? "normal" : "like";
  await createNotification({
    user_id: _id,
    type,
    targetId: tweet_id,
    targetModel: "Tweet",
    description: `${alreadyLiked ? "Đã bỏ thích " : "Đã thích "} bài viết: ${
      tweet.content
    }`,
  });

  res.status(200).json({
    success: true,
    message: alreadyLiked ? "Đã bỏ thích tweet" : "Đã thích tweet",
    tweet,
  });
});

export const dislikeTweet = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { tweet_id } = req.params;

  const tweet = await getTweetById(tweet_id);
  if (!tweet) {
    return res.status(404).json({
      success: false,
      message: "Tweet không tồn tại",
    });
  }

  const alreadyDisliked = tweet.dislikes.includes(_id);
  const alreadyLiked = tweet.likes.includes(_id);

  if (alreadyDisliked) {
    tweet.dislikes = tweet.dislikes.filter(
      (userId) => String(userId) !== String(_id)
    );
    tweet.dislikes_count--;
  } else {
    if (alreadyLiked) {
      tweet.likes = tweet.likes.filter(
        (userId) => String(userId) !== String(_id)
      );
      tweet.likes_count--;
    } else {
      tweet.dislikes.push(_id);
      tweet.dislikes_count++;
    }
  }

  await updateTweetLikesDislikes({
    tweet_id,
    likes: tweet.likes,
    dislikes: tweet.dislikes,
    likes_count: tweet.likes_count,
    dislikes_count: tweet.dislikes_count,
  });

  const type = alreadyDisliked ? "normal" : "dislike";
  await createNotification({
    user_id: _id,
    type,
    targetId: tweet_id,
    targetModel: "Tweet",
    description: `${
      alreadyDisliked ? "Đã bỏ không thích" : "Đã không thích "
    } bài viết: ${tweet.content}`,
  });
  res.status(200).json({
    success: true,
    message: alreadyDisliked
      ? "Đã bỏ không thích tweet"
      : "Đã không thích tweet",
    tweet,
  });
});
export const replyToTweet = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { tweet_id } = req.params;
  const { content } = req.body;

  const tweet = await getTweetById(tweet_id);

  if (!tweet) {
    return res.status(404).json({
      success: false,
      message: "Tweet không tồn tại",
    });
  }

  if (!content) {
    return res.status(400).json({
      success: false,
      message: "Nội dung trả lời không được để trống",
    });
  }

  const reply = await addReply({
    user_id: _id,
    tweet_id: tweet_id,
    content,
  });

  await createNotification({
    user_id: _id,
    type: "reply_tweet",
    targetId: tweet_id,
    targetModel: "Tweet",
    description: `Bình luận bài viết: ${tweet.content}`,
  });

  res.status(201).json({
    success: true,
    message: "Trả lời tweet thành công",
    reply,
  });
});

export const getComments = asyncHandler(async (req, res) => {
  const { tweet_id } = req.params;

  const comments = await getCommentsUser(tweet_id);

  if (!comments) {
    return res.status(404).json({
      success: false,
      message: "Comments không tồn tại",
    });
  }

  res.status(201).json({
    success: true,
    message: "Lấy danh sách bình luận thành công",
    comments,
  });
});
