import HomepageSection from '../models/HomepageSection.js';
import { defaultHomepageSections } from '../seed/homepageDefaultData.js';

// Rule A: These sectionIds are protected and cannot be modified through this CMS.
const PROTECTED_SECTION_IDS = ['featured', 'featured-collection'];

function isProtectedSection(sectionId) {
  return PROTECTED_SECTION_IDS.includes(String(sectionId).toLowerCase().trim());
}

// ─────────────────────────────────────────────────────────
// PUBLIC: GET /api/homepage
// Returns all active sections with active items only, sorted by displayOrder.
// ─────────────────────────────────────────────────────────
export const getPublicHomepage = async (req, res, next) => {
  try {
    const sections = await HomepageSection.find({ isActive: true }).sort({ displayOrder: 1 }).lean();

    const result = {};
    const ordered = [];

    for (const section of sections) {
      // Filter and sort items
      const activeItems = (section.items || [])
        .filter((item) => item.isActive !== false)
        .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

      const formatted = { ...section, items: activeItems };
      result[section.sectionId] = formatted;
      ordered.push(formatted);
    }

    res.json({
      success: true,
      count: ordered.length,
      data: result,
      ordered,
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────
// ADMIN: GET /api/homepage/admin
// Returns all sections (including inactive) for admin management.
// ─────────────────────────────────────────────────────────
export const getAdminHomepage = async (req, res, next) => {
  try {
    const sections = await HomepageSection.find({}).sort({ displayOrder: 1 }).lean();

    const result = {};
    const ordered = [];
    for (const section of sections) {
      const sortedItems = (section.items || []).sort(
        (a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)
      );
      const formatted = { ...section, items: sortedItems };
      result[section.sectionId] = formatted;
      ordered.push(formatted);
    }

    res.json({ success: true, count: ordered.length, data: result, ordered });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────
// ADMIN: GET /api/homepage/admin/:sectionId
// ─────────────────────────────────────────────────────────
export const getAdminSection = async (req, res, next) => {
  try {
    const { sectionId } = req.params;

    if (isProtectedSection(sectionId)) {
      return res.status(403).json({
        success: false,
        message: `Section "${sectionId}" is protected and cannot be managed through this API.`,
      });
    }

    const section = await HomepageSection.findOne({ sectionId }).lean();
    if (!section) {
      return res.status(404).json({ success: false, message: `Section "${sectionId}" not found.` });
    }

    res.json({ success: true, data: section });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────
// ADMIN: POST /api/homepage/admin
// Creates a new homepage section (e.g. new Spotlight section).
// ─────────────────────────────────────────────────────────
export const createAdminSection = async (req, res, next) => {
  try {
    const {
      sectionId, displayName, title, subtitle, description, badgeText,
      mediaUrl, mediaAlt, secondaryMediaUrl, secondaryMediaAlt,
      tertiaryMediaUrl, tertiaryMediaAlt, ctaText, ctaLink,
      secondaryCtaText, secondaryCtaLink, displayOrder, isActive,
      settings, items
    } = req.body;

    if (!sectionId || !String(sectionId).trim()) {
      return res.status(400).json({ success: false, message: 'sectionId is required.' });
    }

    const cleanSectionId = String(sectionId).toLowerCase().trim().replace(/[^a-z0-9_-]+/g, '-');

    if (isProtectedSection(cleanSectionId)) {
      return res.status(403).json({ success: false, message: `Section "${cleanSectionId}" is protected and cannot be created.` });
    }

    const exists = await HomepageSection.findOne({ sectionId: cleanSectionId });
    if (exists) {
      return res.status(409).json({ success: false, message: `Section with ID "${cleanSectionId}" already exists.` });
    }

    const maxOrder = await HomepageSection.findOne().sort({ displayOrder: -1 }).select('displayOrder');
    const nextOrder = displayOrder !== undefined ? Number(displayOrder) : ((maxOrder?.displayOrder || 0) + 1);

    const section = await HomepageSection.create({
      sectionId: cleanSectionId,
      displayName: displayName || title || cleanSectionId,
      title: title || '',
      subtitle: subtitle || '',
      description: description || '',
      badgeText: badgeText || '',
      mediaUrl: mediaUrl || '',
      mediaAlt: mediaAlt || '',
      secondaryMediaUrl: secondaryMediaUrl || '',
      secondaryMediaAlt: secondaryMediaAlt || '',
      tertiaryMediaUrl: tertiaryMediaUrl || '',
      tertiaryMediaAlt: tertiaryMediaAlt || '',
      ctaText: ctaText || 'Explore',
      ctaLink: ctaLink || '#',
      secondaryCtaText: secondaryCtaText || '',
      secondaryCtaLink: secondaryCtaLink || '',
      displayOrder: nextOrder,
      isActive: isActive !== false,
      settings: settings || {},
      items: Array.isArray(items) ? items : [],
    });

    res.status(201).json({ success: true, data: section });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────
// ADMIN: DELETE /api/homepage/admin/:sectionId
// Deletes a homepage section.
// ─────────────────────────────────────────────────────────
export const deleteAdminSection = async (req, res, next) => {
  try {
    const { sectionId } = req.params;

    if (isProtectedSection(sectionId)) {
      return res.status(403).json({ success: false, message: `Section "${sectionId}" is protected and cannot be deleted.` });
    }

    const section = await HomepageSection.findOneAndDelete({ sectionId });
    if (!section) {
      return res.status(404).json({ success: false, message: `Section "${sectionId}" not found.` });
    }

    res.json({ success: true, message: `Section "${sectionId}" deleted successfully.`, data: section });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────
// ADMIN: PUT /api/homepage/admin/:sectionId
// Updates section-level fields (headings, media, CTAs, visibility, order, settings).
// ─────────────────────────────────────────────────────────
export const updateAdminSection = async (req, res, next) => {
  try {
    const { sectionId } = req.params;

    if (isProtectedSection(sectionId)) {
      return res.status(403).json({
        success: false,
        message: `Section "${sectionId}" is protected (Featured Collection) and cannot be modified.`,
      });
    }

    const allowedFields = [
      'displayName', 'title', 'subtitle', 'description', 'badgeText',
      'mediaUrl', 'mediaAlt', 'secondaryMediaUrl', 'secondaryMediaAlt',
      'tertiaryMediaUrl', 'tertiaryMediaAlt',
      'ctaText', 'ctaLink', 'secondaryCtaText', 'secondaryCtaLink',
      'displayOrder', 'isActive', 'settings',
    ];

    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const section = await HomepageSection.findOneAndUpdate(
      { sectionId },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!section) {
      return res.status(404).json({ success: false, message: `Section "${sectionId}" not found.` });
    }

    res.json({ success: true, data: section });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────
// ADMIN: POST /api/homepage/admin/:sectionId/items
// Adds a new item to the section.
// ─────────────────────────────────────────────────────────
export const addSectionItem = async (req, res, next) => {
  try {
    const { sectionId } = req.params;

    if (isProtectedSection(sectionId)) {
      return res.status(403).json({ success: false, message: `Section "${sectionId}" is protected.` });
    }

    const section = await HomepageSection.findOne({ sectionId });
    if (!section) {
      return res.status(404).json({ success: false, message: `Section "${sectionId}" not found.` });
    }

    const { itemId, title, subtitle, description, badge, imageUrl, imageAlt, linkUrl, ctaText, bgColor, displayOrder, isActive, metadata } = req.body;

    if (!itemId || !String(itemId).trim()) {
      return res.status(400).json({ success: false, message: 'itemId is required.' });
    }

    // Ensure no duplicate itemId
    const exists = section.items.some((i) => i.itemId === itemId);
    if (exists) {
      return res.status(409).json({ success: false, message: `Item with itemId "${itemId}" already exists.` });
    }

    const maxOrder = section.items.reduce((max, i) => Math.max(max, i.displayOrder || 0), 0);

    section.items.push({
      itemId: String(itemId).trim(),
      title: title || '',
      subtitle: subtitle || '',
      description: description || '',
      badge: badge || '',
      imageUrl: imageUrl || '',
      imageAlt: imageAlt || '',
      linkUrl: linkUrl || '#',
      ctaText: ctaText || '',
      bgColor: bgColor || '',
      displayOrder: displayOrder !== undefined ? Number(displayOrder) : maxOrder + 1,
      isActive: isActive !== false,
      metadata: metadata || {},
    });

    await section.save();
    res.status(201).json({ success: true, data: section });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────
// ADMIN: PUT /api/homepage/admin/:sectionId/items/:itemId
// Updates a specific item within a section.
// ─────────────────────────────────────────────────────────
export const updateSectionItem = async (req, res, next) => {
  try {
    const { sectionId, itemId } = req.params;

    if (isProtectedSection(sectionId)) {
      return res.status(403).json({ success: false, message: `Section "${sectionId}" is protected.` });
    }

    const section = await HomepageSection.findOne({ sectionId });
    if (!section) {
      return res.status(404).json({ success: false, message: `Section "${sectionId}" not found.` });
    }

    const itemIndex = section.items.findIndex((i) => i.itemId === itemId);
    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: `Item "${itemId}" not found in section "${sectionId}".` });
    }

    const allowedItemFields = [
      'title', 'subtitle', 'description', 'badge',
      'imageUrl', 'imageAlt', 'linkUrl', 'ctaText',
      'bgColor', 'displayOrder', 'isActive', 'metadata',
    ];

    for (const field of allowedItemFields) {
      if (req.body[field] !== undefined) {
        section.items[itemIndex][field] = req.body[field];
      }
    }

    await section.save();
    res.json({ success: true, data: section });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────
// ADMIN: DELETE /api/homepage/admin/:sectionId/items/:itemId
// Removes a specific item from a section.
// ─────────────────────────────────────────────────────────
export const deleteSectionItem = async (req, res, next) => {
  try {
    const { sectionId, itemId } = req.params;

    if (isProtectedSection(sectionId)) {
      return res.status(403).json({ success: false, message: `Section "${sectionId}" is protected.` });
    }

    const section = await HomepageSection.findOne({ sectionId });
    if (!section) {
      return res.status(404).json({ success: false, message: `Section "${sectionId}" not found.` });
    }

    const before = section.items.length;
    section.items = section.items.filter((i) => i.itemId !== itemId);

    if (section.items.length === before) {
      return res.status(404).json({ success: false, message: `Item "${itemId}" not found.` });
    }

    await section.save();
    res.json({ success: true, message: `Item "${itemId}" deleted.`, data: section });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────
// ADMIN: POST /api/homepage/admin/seed-default
// Seeds the database with default content for all non-exempt sections
// if the collection is empty. Use forceReseed=true to reset all sections.
// ─────────────────────────────────────────────────────────
export const seedDefaultHomepage = async (req, res, next) => {
  try {
    const forceReseed = req.body?.forceReseed === true;
    const existing = await HomepageSection.countDocuments();

    if (existing > 0 && !forceReseed) {
      return res.json({
        success: true,
        message: `Database already has ${existing} homepage sections. Use forceReseed:true to reset.`,
        seeded: false,
      });
    }

    if (forceReseed) {
      await HomepageSection.deleteMany({});
    }

    const inserted = await HomepageSection.insertMany(defaultHomepageSections);

    res.status(201).json({
      success: true,
      message: `Successfully seeded ${inserted.length} homepage sections.`,
      seeded: true,
      count: inserted.length,
    });
  } catch (error) {
    next(error);
  }
};
