const ensureAuthenticated = require('../Middlewares/Auth');

const router = require('express').Router();


router.get('/', ensureAuthenticated, (req, res) => {
    console.log("Fetching products" ,req.user);
    res.status(200)
    .json([
        {
            name: "Product 1",
            price: 100,
        },
         {
            name: "mobile",
            price: 500,
        }
    ])
      
    
});


module.exports = router;
