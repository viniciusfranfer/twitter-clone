import Notification from '../models/notification.model.js';
import Post from '../models/post.model.js';
import User from '../models/user.model.js';

import { v2 as cloudinary } from 'cloudinary';

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }).populate({
      path: "user",
      select: "-password",
    })
      .populate({
        path: "comments.user",
        select: "-password",
      })

    if (posts.length === 0) return res.status(404).json([]);

    res.status(200).json(posts);

  } catch (error) {
    console.log(`Error in getAllPosts controller: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
}

export const getFollowingPosts = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const following = user.following;

    const feedPosts = await Post.find({ user: { $in: following } })
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      })

    res.status(200).json(feedPosts);

  } catch (error) {
    console.log(`Error in getFollowingPosts controller: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
}

export const getLikedPosts = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const likedPosts = await Post.find({ _id: { $in: user.likedPosts } })
      .populate({
        path: "user",
        select: "-password",
      }).populate({
        path: "comments.user",
        select: "-password",
      })

    res.status(200).json(likedPosts);

  } catch (error) {
    console.log(`Error in getLikedPosts controller: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
}

export const getUserPosts = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: "User not found" });

    const posts = await Post.find({ user: user._id })
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      })

      res.status(200).json(posts);

  } catch (error) {
    console.log(`Error in getUserPosts controller: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
}

export const createPost = async (req, res) => {
  try {
    const { text } = req.body;
    let { img } = req.body;
    const userId = req.user._id.toString();

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!text && !img) return res.status(400).json({ error: "Text or image is required for a Post" });

    if (img) {
      const updatedResponse = await cloudinary.uploader.upload(img);
      img = updatedResponse.secure_url;
    }

    const newPost = new Post({
      user: userId,
      text,
      img,
    });

    await newPost.save();
    res.status(201).json(newPost);

  } catch (error) {
    console.log(`Error in createPost controller: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

export const likeUnlikePost = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const userLikedPost = post.likes.includes(userId);

    let notification = new Notification({
      from: userId,
      to: post.user,
      type: "like",
    });

    if (userLikedPost) {
      await Post.updateOne({ _id: id }, { $pull: { likes: userId } });
      await User.updateOne({ _id: userId }, { $pull: { likedPosts: id } });
      res.status(200).json({ message: "Post unliked successfully" });

      notification = await Notification.findOneAndDelete({ from: userId, to: post.user, type: "like" });
    } else {
      post.likes.push(userId);
      await User.updateOne({ _id: userId }, { $push: { likedPosts: id } });
      await post.save();

      await notification.save();

      res.status(200).json({ message: "Post liked successfully" });
    }

  } catch (error) {
    console.log(`Error in likeUnlikePost controller: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

export const commentOnPost = async (req, res) => {
  try {
    const { text } = req.body;
    let { img } = req.body;
    const userId = req.user._id;
    const postId = req.params.id;

    if (!text && !img) return res.status(400).json({ error: "Text or image is required for a Comment" });

    if (img) {
      const updatedResponse = await cloudinary.uploader.upload(img);
      img = updatedResponse.secure_url;
    }

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = { user: userId, text, img };

    post.comments.push(comment);
    await post.save();

    res.status(200).json(post);

  } catch (error) {
    console.log(`Error in commentOnPost controller: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "You can't delete this post" });
    }

    if (post.img) {
      const imgId = post.img.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imgId);
    }

    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Post deleted successfully" })

  } catch (error) {
    console.log(`Error in deletePost controller: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

