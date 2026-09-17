const { Leader } = require('../models');
const fs = require('fs');
const path = require('path');

// Helper to format SQLite Leader model to match Mongoose schema
const formatLeader = (l) => {
  if (!l) return null;
  return {
    _id: l.id,
    id: l.id,
    name: l.name,
    designation: l.designation,
    phone: l.phone,
    email: l.email,
    photoUrl: l.photoUrl,
    description: l.description,
    socialLinks: {
      facebook: l.facebook || '',
      instagram: l.instagram || '',
      whatsapp: l.whatsapp || ''
    },
    createdAt: l.createdAt,
    updatedAt: l.updatedAt
  };
};

// @desc    Get all leaders
// @route   GET /api/leaders
// @access  Public
const getLeaders = async (req, res) => {
  try {
    const leaders = await Leader.findAll({ order: [['createdAt', 'ASC']] });
    const data = leaders.map(l => formatLeader(l));
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single leader
// @route   GET /api/leaders/:id
// @access  Public
const getLeaderById = async (req, res) => {
  try {
    const leader = await Leader.findByPk(req.params.id);
    if (!leader) {
      return res.status(404).json({ success: false, message: 'Leader not found' });
    }
    res.status(200).json({ success: true, data: formatLeader(leader) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new leader
// @route   POST /api/leaders
// @access  Private/Admin
const createLeader = async (req, res) => {
  try {
    const { name, designation, phone, email, description, facebook, instagram, whatsapp } = req.body;

    let photoUrl = '/uploads/default-avatar.png';
    if (req.file) {
      photoUrl = `/uploads/${req.file.filename}`;
    }

    const leader = await Leader.create({
      name,
      designation,
      phone: phone || null,
      email: email || null,
      description: description || '',
      photoUrl,
      facebook: facebook || '',
      instagram: instagram || '',
      whatsapp: whatsapp || ''
    });

    res.status(201).json({ success: true, data: formatLeader(leader) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update leader
// @route   PUT /api/leaders/:id
// @access  Private/Admin
const updateLeader = async (req, res) => {
  try {
    let leader = await Leader.findByPk(req.params.id);
    if (!leader) {
      return res.status(404).json({ success: false, message: 'Leader not found' });
    }

    const { name, designation, phone, email, description, facebook, instagram, whatsapp } = req.body;

    let photoUrl = leader.photoUrl;
    if (req.file) {
      if (leader.photoUrl && leader.photoUrl !== '/uploads/default-avatar.png') {
        const oldPath = path.join(__dirname, '..', leader.photoUrl);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      photoUrl = `/uploads/${req.file.filename}`;
    }

    await leader.update({
      name: name !== undefined ? name : leader.name,
      designation: designation !== undefined ? designation : leader.designation,
      phone: phone !== undefined ? phone : leader.phone,
      email: email !== undefined ? email : leader.email,
      description: description !== undefined ? description : leader.description,
      photoUrl,
      facebook: facebook !== undefined ? facebook : leader.facebook,
      instagram: instagram !== undefined ? instagram : leader.instagram,
      whatsapp: whatsapp !== undefined ? whatsapp : leader.whatsapp
    });

    res.status(200).json({ success: true, data: formatLeader(leader) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete leader
// @route   DELETE /api/leaders/:id
// @access  Private/Admin
const deleteLeader = async (req, res) => {
  try {
    const leader = await Leader.findByPk(req.params.id);
    if (!leader) {
      return res.status(404).json({ success: false, message: 'Leader not found' });
    }

    if (leader.photoUrl && leader.photoUrl !== '/uploads/default-avatar.png') {
      const filePath = path.join(__dirname, '..', leader.photoUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await leader.destroy();
    res.status(200).json({ success: true, message: 'Leader deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getLeaders,
  getLeaderById,
  createLeader,
  updateLeader,
  deleteLeader
};
