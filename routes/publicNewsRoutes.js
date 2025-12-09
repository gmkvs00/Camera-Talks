// routes/publicNews.routes.js
const express = require('express');
const router = express.Router();

const newsReader = require('@controller/newsReader.controller'); 

router.get('/news', newsReader.getPublicNewsList);       
router.get('/news/home', newsReader.getPublicNewsHome);  
router.get('/news/:slug', newsReader.getPublicNewsBySlug); 

module.exports = router;
