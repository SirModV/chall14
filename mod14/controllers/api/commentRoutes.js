const router = require('express').Router();
const { Comment, User, Post } = require('../../models');
const withAuth = require('../../utils/auth');

// Get all comments
router.get('/', async (req, res) => {
 
});

// Get comments for a specific post
router.get('/post/:postId', async (req, res) => {
    try {
        const commentData = await Comment.findAll({
            where: { post_id: req.params.postId },
            include: [
                {
                    model: User,
                    attributes: ['username']
                },
                {
                    model: Post,
                    attributes: ['title']
                }
            ]
        });

        res.status(200).json(commentData);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Create a new comment
router.post('/', withAuth, async (req, res) => {
    try {
        if (!req.body.content || !req.body.post_id) {
            return res.status(400).json({ message: "Please provide content and associated post ID for the comment." });
        }

        const newComment = await Comment.create({
            ...req.body,
            user_id: req.session.user_id
        });

        res.status(200).json({ comment: newComment, message: 'Comment added successfully!' });
    } catch (err) {
        res.status(400).json(err);
    }
});

// Delete a comment by ID
router.delete('/:id', withAuth, async (req, res) => {
    try {
        const commentDelete = await Comment.destroy({
            where: {
                id: req.params.id,
                user_id: req.session.user_id
            }
        });

        if (!commentDelete) {
            res.status(404).json({ message: 'No comment found with that ID or you do not have permission to delete it!' });
            return;
        }

        res.status(200).json(commentDelete);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
