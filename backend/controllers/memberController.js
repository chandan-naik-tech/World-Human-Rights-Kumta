const { Member } = require('../models');
const fs = require('fs');
const path = require('path');

const formatMember = (m) => {
  if (!m) return null;
  return {
    _id: m.id,
    id: m.id,
    name: m.name,
    designation: m.designation,
    village: m.village,
    phone: m.phone,
    photoUrl: m.photoUrl,
    description: m.description,
    createdAt: m.createdAt,
    updatedAt: m.updatedAt
  };
};

// @desc    Get all members
// @route   GET /api/members
// @access  Public
const getMembers = async (req, res) => {
  try {
    const members = await Member.findAll({ order: [['createdAt', 'ASC']] });
    const data = members.map(m => formatMember(m));
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single member
// @route   GET /api/members/:id
// @access  Public
const getMemberById = async (req, res) => {
  try {
    const member = await Member.findByPk(req.params.id);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }
    res.status(200).json({ success: true, data: formatMember(member) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new member
// @route   POST /api/members
// @access  Private/Admin
const createMember = async (req, res) => {
  try {
    const { name, designation, village, phone, description } = req.body;

    let photoUrl = '/uploads/default-avatar.png';
    if (req.file) {
      photoUrl = `/uploads/${req.file.filename}`;
    }

    const member = await Member.create({
      name,
      designation,
      village,
      phone: phone || null,
      description: description || '',
      photoUrl
    });

    res.status(201).json({ success: true, data: formatMember(member) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update member
// @route   PUT /api/members/:id
// @access  Private/Admin
const updateMember = async (req, res) => {
  try {
    let member = await Member.findByPk(req.params.id);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }

    const { name, designation, village, phone, description } = req.body;

    let photoUrl = member.photoUrl;
    if (req.file) {
      if (member.photoUrl && member.photoUrl !== '/uploads/default-avatar.png') {
        const oldPath = path.join(__dirname, '..', member.photoUrl);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      photoUrl = `/uploads/${req.file.filename}`;
    }

    await member.update({
      name: name !== undefined ? name : member.name,
      designation: designation !== undefined ? designation : member.designation,
      village: village !== undefined ? village : member.village,
      phone: phone !== undefined ? phone : member.phone,
      description: description !== undefined ? description : member.description,
      photoUrl
    });

    res.status(200).json({ success: true, data: formatMember(member) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete member
// @route   DELETE /api/members/:id
// @access  Private/Admin
const deleteMember = async (req, res) => {
  try {
    const member = await Member.findByPk(req.params.id);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }

    if (member.photoUrl && member.photoUrl !== '/uploads/default-avatar.png') {
      const filePath = path.join(__dirname, '..', member.photoUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await member.destroy();
    res.status(200).json({ success: true, message: 'Member deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getMembers,
  getMemberById,
  createMember,
  updateMember,
  deleteMember
};
