const express = require("express");
const router = express.Router();
const usersLayout = "../views/layouts/users"

/**
 * GET |
 * login page
 */
router.get('/login', async (req, res) => {
    res.render("users/login");
});

module.exports = router;