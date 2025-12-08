const News = require('@models/news');

exports.createNews = async (req, res) => {
  try {
    const {
      title,
      slug,
      content,
      excerpt,
      category,
      tags,
      status,
      featuredImage,
      metaTitle,
      metaDescription,
      publishedAt,
    } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required.' });
    }

    if (slug) {
      const existingSlug = await News.findOne({ slug });
      if (existingSlug) {
        return res.status(400).json({ message: 'Slug already exists. Please use a different one.' });
      }
    }

    const news = await News.create({
      title,
      slug,
      content,
      excerpt,
      category,
      tags,
      status,
      featuredImage,
      metaTitle,
      metaDescription,
      publishedAt: status === 'published' ? (publishedAt || new Date()) : null,
      author: req.user._id, // from auth middleware
    });

    return res.status(201).json({
      message: 'News created successfully.',
      data: news,
    });
  } catch (error) {
    console.error('createNews error:', error);
    return res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

exports.getNewsList = async (req, res) => {
  try {
    let {
      page = 1,
      limit = 10,
      search = '',
      status,
      category,
    } = req.query;

    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

    const filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }

    if (status) {
      filter.status = status;
    }

    if (category) {
      filter.category = category;
    }

    const total = await News.countDocuments(filter);

    const newsList = await News.find(filter)
      .populate('author', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return res.json({
      data: newsList,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('getNewsList error:', error);
    return res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

exports.getNewsById = async (req, res) => {
  try {
    const news = await News.findById(req.params.id).populate('author', 'name email');
    if (!news) {
      return res.status(404).json({ message: 'News not found.' });
    }
    return res.json({ data: news });
  } catch (error) {
    console.error('getNewsById error:', error);
    return res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

exports.updateNews = async (req, res) => {
  try {
    const {
      title,
      slug,
      content,
      excerpt,
      category,
      tags,
      status,
      featuredImage,
      metaTitle,
      metaDescription,
      publishedAt,
    } = req.body;

    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ message: 'News not found.' });
    }

    // Optional: only author or admins can edit – you can add logic here using req.user.role

    if (slug && slug !== news.slug) {
      const existingSlug = await News.findOne({ slug });
      if (existingSlug) {
        return res.status(400).json({ message: 'Slug already exists. Please use a different one.' });
      }
      news.slug = slug;
    }

    if (title !== undefined) news.title = title;
    if (content !== undefined) news.content = content;
    if (excerpt !== undefined) news.excerpt = excerpt;
    if (category !== undefined) news.category = category;
    if (tags !== undefined) news.tags = tags;
    if (featuredImage !== undefined) news.featuredImage = featuredImage;
    if (metaTitle !== undefined) news.metaTitle = metaTitle;
    if (metaDescription !== undefined) news.metaDescription = metaDescription;

    if (status !== undefined) {
      news.status = status;
      if (status === 'published' && !news.publishedAt) {
        news.publishedAt = publishedAt || new Date();
      }
      if (status !== 'published') {
        news.publishedAt = null;
      }
    }

    await news.save();

    return res.json({
      message: 'News updated successfully.',
      data: news,
    });
  } catch (error) {
    console.error('updateNews error:', error);
    return res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

exports.deleteNews = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ message: 'News not found.' });
    }

    await news.deleteOne();

    return res.json({ message: 'News deleted successfully.' });
  } catch (error) {
    console.error('deleteNews error:', error);
    return res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

exports.newsDataTable = async (req, res) => {
  try {
    const { draw, start = 0, length = 10, search } = req.query;

    const limit = parseInt(length, 10) || 10;
    const skip = parseInt(start, 10) || 0;

    // base query: all news
    let query = {};

    // DataTables-style global search
    // search.value will contain the term
    if (search && search.value) {
      const searchValue = search.value.trim();
      if (searchValue) {
        query = {
          $or: [
            { title: { $regex: searchValue, $options: 'i' } },
            { slug: { $regex: searchValue, $options: 'i' } },
            { category: { $regex: searchValue, $options: 'i' } },
            { tags: { $regex: searchValue, $options: 'i' } },
            { status: { $regex: searchValue, $options: 'i' } },
          ],
        };
      }
    }

    const [data, recordsTotal, recordsFiltered] = await Promise.all([
      News.find(query)
        .sort({ createdAt: -1 }) // latest news first
        .skip(skip)
        .limit(limit)
        .lean()
        .populate('author', 'name email'), // optional: send basic author info
      News.countDocuments({}),       // total without filter
      News.countDocuments(query),    // total with filter
    ]);

    res.json({
      draw: parseInt(draw, 10) || 0,
      recordsTotal,
      recordsFiltered,
      data,
    });
  } catch (err) {
    console.error('newsDataTable error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};