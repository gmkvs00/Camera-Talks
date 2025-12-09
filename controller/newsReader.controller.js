const News = require('@models/news'); 


exports.getPublicNewsList = async (req, res) => {
  try {
    let {
      page = 1,
      limit = 10,
      category,
      tag,
      q,
      sort = "latest",
    } = req.query;

    page = parseInt(page, 10) || 1;
    limit = parseInt(limit, 10) || 10;

    const filter = { status: "published" };

    if (category) filter.category = category;
    if (tag) filter.tags = tag;

    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { excerpt: { $regex: q, $options: "i" } },
        { content: { $regex: q, $options: "i" } },
      ];
    }

    let sortOption = { publishedAt: -1 }; // latest by default

    // future: if you add viewCount or isFeatured, you can change sort here
    if (sort === "oldest") sortOption = { publishedAt: 1 };

    const [items, total] = await Promise.all([
      News.find(filter)
        .sort(sortOption)
        .skip((page - 1) * limit)
        .limit(limit)
        .select(
          "title slug excerpt featuredImage category tags publishedAt metaTitle metaDescription"
        )
        .populate("author", "name") // only name from User
        .lean(),
      News.countDocuments(filter),
    ]);

    return res.json({
      success: true,
      data: items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("Error getPublicNewsList:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch news",
    });
  }
};

// GET /api/public/news/:slug
exports.getPublicNewsBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const article = await News.findOne({
      slug,
      status: "published",
    })
      .populate("author", "name")
      .lean();

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }

    return res.json({
      success: true,
      data: article,
    });
  } catch (err) {
    console.error("Error getPublicNewsBySlug:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch article",
    });
  }
};

// GET /api/public/news/home
// Homepage sections: latest + (optionally) category-wise blocks
exports.getPublicNewsHome = async (req, res) => {
  try {
    const latestLimit = 10;

    const latest = await News.find({
      status: "published",
    })
      .sort({ publishedAt: -1 })
      .limit(latestLimit)
      .select(
        "title slug excerpt featuredImage category tags publishedAt"
      )
      .lean();

    // Example: category-wise grouping (optional)
    // you can build this on frontend also using 'latest' data
    const byCategory = {};
    latest.forEach((item) => {
      const cat = item.category || "General";
      if (!byCategory[cat]) byCategory[cat] = [];
      byCategory[cat].push(item);
    });

    return res.json({
      success: true,
      data: {
        latest,
        byCategory,
      },
    });
  } catch (err) {
    console.error("Error getPublicNewsHome:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch homepage data",
    });
  }
};
