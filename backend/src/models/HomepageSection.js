import mongoose from 'mongoose';

const HomepageItemSchema = new mongoose.Schema(
  {
    itemId: { type: String, required: true },
    title: { type: String, default: '' },
    subtitle: { type: String, default: '' },
    description: { type: String, default: '' },
    badge: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    imageAlt: { type: String, default: '' },
    linkUrl: { type: String, default: '#' },
    ctaText: { type: String, default: '' },
    bgColor: { type: String, default: '' },
    displayOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { _id: false }
);

const HomepageSectionSchema = new mongoose.Schema(
  {
    sectionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    displayName: { type: String, required: true },
    title: { type: String, default: '' },
    subtitle: { type: String, default: '' },
    description: { type: String, default: '' },
    badgeText: { type: String, default: '' },
    mediaUrl: { type: String, default: '' },
    mediaAlt: { type: String, default: '' },
    secondaryMediaUrl: { type: String, default: '' },
    secondaryMediaAlt: { type: String, default: '' },
    tertiaryMediaUrl: { type: String, default: '' },
    tertiaryMediaAlt: { type: String, default: '' },
    ctaText: { type: String, default: '' },
    ctaLink: { type: String, default: '#' },
    secondaryCtaText: { type: String, default: '' },
    secondaryCtaLink: { type: String, default: '#' },
    displayOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    settings: { type: mongoose.Schema.Types.Mixed, default: {} },
    items: { type: [HomepageItemSchema], default: [] },
  },
  { timestamps: true }
);

const HomepageSection = mongoose.model('HomepageSection', HomepageSectionSchema);
export default HomepageSection;
