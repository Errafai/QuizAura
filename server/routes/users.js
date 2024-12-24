const express = require("express");
const router = express.Router();
const usersLayout = "../views/layouts/users"

/**
 * GET |
 * login page
 */
router.get('/login', async (req, res) => {
    res.render("users/login",
      {layout: usersLayout}
    );
});

/**
 * GET |
 * register page
 */
router.get('/register', async (req, res) => {
  res.render("users/register");
});
module.exports = router;