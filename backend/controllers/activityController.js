const { Activity } = require('../models');
const fs = require('fs');
const path = require('path');

const formatActivity = (item) => {
  if (!item) return null;
  return {
    _id: item.id,
    id: item.id,
    title: item.title,
    description: item.description,
    type: item.type,
    date: item.date,
    imageUrl: item.imageUrl,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt
  };
};

// @desc    Get all activities
// @route   GET /api/activities
// @access  Public
const getActivities = async (req, res) => {
  try {
    const { type } = req.query;
    let query = {};
    if (type) {
      query.type = type;
    }
    const activities = await Activity.findAll({
      where: query,
      order: [['date', 'DESC']]
    });
    const data = activities.map(item => formatActivity(item));
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single activity
// @route   GET /api/activities/:id
// @access  Public
const getActivityById = async (req, res) => {
  try {
    const activity = await Activity.findByPk(req.params.id);
    if (!activity) {
      return res.status(404).json({ success: false, message: 'Activity not found' });
    }
    res.status(200).json({ success: true, data: formatActivity(activity) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new activity
// @route   POST /api/activities
// @access  Private/Admin
const createActivity = async (req, res) => {
  try {
    const { title, description, type, date } = req.body;

    let imageUrl = '';
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const activity = await Activity.create({
      title,
      description,
      type,
      date: date || new Date(),
      imageUrl
    });

    res.status(201).json({ success: true, data: formatActivity(activity) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update activity
// @route   PUT /api/activities/:id
// @access  Private/Admin
const updateActivity = async (req, res) => {
  try {
    let activity = await Activity.findByPk(req.params.id);
    if (!activity) {
      return res.status(404).json({ success: false, message: 'Activity not found' });
    }

    const { title, description, type, date } = req.body;

    let imageUrl = activity.imageUrl;
    if (req.file) {
      if (activity.imageUrl && activity.imageUrl.startsWith('/uploads/')) {
        const oldPath = path.join(__dirname, '..', activity.imageUrl);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      imageUrl = `/uploads/${req.file.filename}`;
    }

    await activity.update({
      title: title !== undefined ? title : activity.title,
      description: description !== undefined ? description : activity.description,
      type: type !== undefined ? type : activity.type,
      date: date !== undefined ? date : activity.date,
      imageUrl
    });

    res.status(200).json({ success: true, data: formatActivity(activity) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete activity
// @route   DELETE /api/activities/:id
// @access  Private/Admin
const deleteActivity = async (req, res) => {
  try {
    const activity = await Activity.findByPk(req.params.id);
    if (!activity) {
      return res.status(404).json({ success: false, message: 'Activity not found' });
    }

    if (activity.imageUrl && activity.imageUrl.startsWith('/uploads/')) {
      const filePath = path.join(__dirname, '..', activity.imageUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await activity.destroy();
    res.status(200).json({ success: true, message: 'Activity deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getActivities,
  getActivityById,
  createActivity,
  updateActivity,
  deleteActivity
};
