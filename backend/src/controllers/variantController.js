import VariantAttribute from '../models/VariantAttribute.js';

export const getVariants = async (req, res, next) => {
  try {
    const { search, status } = req.query;
    const query = {};
    if (search) query.name = { $regex: search, $options: 'i' };
    if (status && status !== 'Status') query.status = status;

    const items = await VariantAttribute.find(query).sort({ createdAt: -1 });
    const formatted = items.map((v) => ({
      _id: v._id, id: v._id.toString(),
      name: v.name, value: v.valueString || (v.values || []).join(', '),
      values: v.values || [], status: v.status || 'Active',
      date: new Date(v.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    }));
    res.json({ success: true, count: items.length, data: formatted });
  } catch (error) { next(error); }
};

export const createVariant = async (req, res, next) => {
  try {
    const { name, attributeName, values, valueString, status } = req.body;
    const finalName = (name || attributeName || '').trim();
    if (!finalName) return res.status(400).json({ success: false, message: 'Attribute name is required' });

    let parsedValues = Array.isArray(values)
      ? values
      : typeof values === 'string' ? values.split(',').map((v) => v.trim()).filter(Boolean) : [];

    const variant = await VariantAttribute.create({
      name: finalName,
      values: parsedValues,
      valueString: valueString || parsedValues.join(', '),
      status: status || 'Active',
    });
    res.status(201).json({ success: true, message: 'Variant attribute created successfully', data: variant });
  } catch (error) { next(error); }
};

export const updateVariant = async (req, res, next) => {
  try {
    const { name, values, valueString, status } = req.body;
    const updates = {};
    if (name) updates.name = name.trim();
    if (values !== undefined) {
      const parsed = Array.isArray(values) ? values : String(values).split(',').map((v) => v.trim()).filter(Boolean);
      updates.values = parsed;
      updates.valueString = parsed.join(', ');
    }
    if (valueString !== undefined && !values) updates.valueString = valueString;
    if (status) updates.status = status;
    const item = await VariantAttribute.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!item) return res.status(404).json({ success: false, message: 'Variant attribute not found' });
    res.json({ success: true, message: 'Variant attribute updated', data: item });
  } catch (error) { next(error); }
};

export const toggleVariantStatus = async (req, res, next) => {
  try {
    const item = await VariantAttribute.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Variant attribute not found' });
    item.status = item.status === 'Active' ? 'Inactive' : 'Active';
    await item.save();
    res.json({ success: true, message: `Variant marked ${item.status}`, data: { status: item.status } });
  } catch (error) { next(error); }
};

export const deleteVariant = async (req, res, next) => {
  try {
    const item = await VariantAttribute.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Variant attribute not found' });
    res.json({ success: true, message: 'Variant attribute deleted successfully' });
  } catch (error) { next(error); }
};
