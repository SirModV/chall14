const router = require('express').Router();
const { Post, User } = require('../../models');
const withAuth = require('../../utils/auth');


router.get('/', async (req, res) => {
    try {
        const postData = await Post.findAll({
            include: { model: User, attributes: ['username'] }
        });
        res.status(200).json(postData);
    } catch (err) {
        res.status(500).json(err);
    }
});


router.get('/:id', async (req, res) => {
    try {
        const postData = await Post.findByPk(req.params.id, {
            include: { model: User, attributes: ['username'] }
        });

        if (postData) {
            res.status(200).json(postData);
        } else {
            res.status(404).json({ message: 'No post found with that ID!' });
        }
    } catch (err) {
        res.status(500).json(err);
    }
});


router.post('/', withAuth, async (req, res) => {
    try {
        if (!req.body.title || !req.body.content) {
            return res.status(400).json({ message: "Please provide a title and content for the post." });
        }
        const newPost = await Post.create({
            ...req.body,
            user_id: req.session.user_id
        });

        res.status(200).json({ post: newPost, message: 'Post created successfully!' });
    } catch (err) {
        res.status(400).json(err);
    }
});


router.put('/:id', withAuth, async (req, res) => {
    try {
        const post = await Post.findByPk(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'No post found with that ID!' });
        }

      
        if (post.user_id !== req.session.user_id) {
            return res.status(403).json({ message: 'You do not have permission to update this post.' });
        }

        const postUpdate = await post.update(req.body);

        res.status(200).json({ post: postUpdate, message: 'Post updated successfully!' });
    } catch (err) {
        res.status(500).json(err);
    }
});


router.delete('/:id', withAuth, async (req, res) => {
    try {
        const post = await Post.findByPk(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'No post found with that ID!' });
        }

    
        if (post.user_id !== req.session.user_id) {
            return res.status(403).json({ message: 'You do not have permission to delete this post.' });
        }

        await post.destroy();

        res.status(200).json({ message: 'Post deleted successfully!' });
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;