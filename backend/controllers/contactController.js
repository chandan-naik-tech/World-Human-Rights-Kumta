const { Contact } = require('../models');

const formatContact = (c) => {
  if (!c) return null;
  return {
    _id: c.id,
    id: c.id,
    name: c.name,
    email: c.email,
    phone: c.phone,
    subject: c.subject,
    message: c.message,
    status: c.status,
    date: c.date,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt
  };
};

// @desc    Submit new contact inquiry
// @route   POST /api/contact
// @access  Public
const submitInquiry = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and message' });
    }

    const inquiry = await Contact.create({
      name,
      email,
      phone: phone || null,
      subject: subject || 'No Subject',
      message
    });

    res.status(201).json({ success: true, data: formatContact(inquiry) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all inquiries
// @route   GET /api/contact
// @access  Private/Admin
const getInquiries = async (req, res) => {
  try {
    const inquiries = await Contact.findAll({ order: [['date', 'DESC']] });
    const data = inquiries.map(item => formatContact(item));
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update inquiry status (read/replied)
// @route   PUT /api/contact/:id
// @access  Private/Admin
const updateInquiryStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !['unread', 'read', 'replied'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid status (unread, read, replied)' });
    }

    const inquiry = await Contact.findByPk(req.params.id);

    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }

    await inquiry.update({ status });

    res.status(200).json({ success: true, data: formatContact(inquiry) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete contact inquiry
// @route   DELETE /api/contact/:id
// @access  Private/Admin
const deleteInquiry = async (req, res) => {
  try {
    const inquiry = await Contact.findByPk(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }

    await inquiry.destroy();
    res.status(200).json({ success: true, message: 'Inquiry deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  submitInquiry,
  getInquiries,
  updateInquiryStatus,
  deleteInquiry
};
