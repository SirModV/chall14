const router = require('express').Router();
const { Post, User } = require('../models');
const withAuth = require('../utils/auth');


router.get('/', withAuth, async (req, res) => {
    try {
        const userData = await User.findByPk(req.session.user_id, {
            attributes: { exclude: ['password'] },
            include: [{ model: Post }]
        });

        const user = userData.get({ plain: true });

        res.render('dashboard', {
            ...user,
            logged_in: true
        });

    } catch (err) {
        res.status(500).json(err);
    }
});


router.get('/edit/:id', withAuth, async (req, res) => {
    try {
        const postData = await Post.findByPk(req.params.id);
        
        if (postData) {
            const post = postData.get({ plain: true });
            
            res.render('edit-post', {
                post,
                logged_in: true
            });
        } else {
            res.status(404).end();
        }
    } catch (err) {
        res.status(500).json(err);
    }
});


router.get('/new', withAuth, (req, res) => {
    res.render('new-post', {
        logged_in: true
    });
});

module.exports = router;
