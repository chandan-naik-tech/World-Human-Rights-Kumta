const { Settings } = require('../models');
const fs = require('fs');
const path = require('path');

// Helper to format settings output to match legacy Mongoose deep nesting
const formatSettings = (settings) => {
  return {
    id: settings.id,
    heroTitle: settings.heroTitle,
    heroSubtitle: settings.heroSubtitle,
    heroBanners: settings.heroBanners,
    history: settings.history,
    mission: settings.mission,
    vision: settings.vision,
    objectives: settings.objectives,
    presidentMessage: {
      name: settings.presidentName,
      photoUrl: settings.presidentPhotoUrl,
      message: settings.presidentMessage
    },
    directorMessage: {
      name: settings.directorName,
      photoUrl: settings.directorPhotoUrl,
      message: settings.directorMessage
    },
    contactDetails: {
      address: settings.address,
      phone1: settings.phone1,
      phone2: settings.phone2,
      email: settings.email,
      whatsapp: settings.whatsapp,
      googleMapsEmbedUrl: settings.googleMapsEmbedUrl
    },
    developerName: settings.developerName,
    developerPhone: settings.developerPhone,
    developerPhotoUrl: settings.developerPhotoUrl
  };
};

// @desc    Get website settings (singleton)
// @route   GET /api/settings
// @access  Public
const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      // Create default settings if none exist
      settings = await Settings.create({});
    }
    res.status(200).json({ success: true, data: formatSettings(settings) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update website settings
// @route   PUT /api/settings
// @access  Private/Admin
const updateSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }

    const {
      heroTitle,
      heroSubtitle,
      history,
      mission,
      vision,
      objectives, // array of strings
      presidentName,
      presidentMessage: presMsg,
      directorName,
      directorMessage: dirMsg,
      address,
      phone1,
      phone2,
      email,
      whatsapp,
      googleMapsEmbedUrl,
      developerName,
      developerPhone
    } = req.body;

    // Handle objectives parsing robustly (accept JSON array or raw string split by newlines/commas)
    let finalObjectives = settings.objectives;
    if (objectives !== undefined) {
      try {
        const parsed = typeof objectives === 'string' ? JSON.parse(objectives) : objectives;
        if (Array.isArray(parsed)) {
          finalObjectives = parsed;
        } else {
          finalObjectives = [String(parsed)];
        }
      } catch (err) {
        // Fallback: split by newlines or commas
        finalObjectives = String(objectives)
          .split(/[\n,]/)
          .map(o => o.trim())
          .filter(Boolean);
      }
    }

    // Handle files uploads (heroBanners, presidentPhoto, directorPhoto)
    let updatedBanners = settings.heroBanners;
    let presidentPhoto = settings.presidentPhotoUrl;
    let directorPhoto = settings.directorPhotoUrl;
    let developerPhoto = settings.developerPhotoUrl;

    if (req.files) {
      // Banners
      if (req.files.heroBanners && req.files.heroBanners.length > 0) {
        // Delete old non-default banners
        settings.heroBanners.forEach(banner => {
          if (banner && !banner.includes('default-banner')) {
            const oldPath = path.join(__dirname, '..', banner);
            if (fs.existsSync(oldPath)) {
              fs.unlinkSync(oldPath);
            }
          }
        });
        updatedBanners = req.files.heroBanners.map(file => `/uploads/${file.filename}`);
      }

      // President Photo
      if (req.files.presidentPhoto && req.files.presidentPhoto.length > 0) {
        if (settings.presidentPhotoUrl && !settings.presidentPhotoUrl.includes('default-avatar')) {
          const oldPath = path.join(__dirname, '..', settings.presidentPhotoUrl);
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }
        }
        presidentPhoto = `/uploads/${req.files.presidentPhoto[0].filename}`;
      }

      // Director Photo
      if (req.files.directorPhoto && req.files.directorPhoto.length > 0) {
        if (settings.directorPhotoUrl && !settings.directorPhotoUrl.includes('default-avatar')) {
          const oldPath = path.join(__dirname, '..', settings.directorPhotoUrl);
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }
        }
        directorPhoto = `/uploads/${req.files.directorPhoto[0].filename}`;
      }

      // Developer Photo
      if (req.files.developerPhoto && req.files.developerPhoto.length > 0) {
        if (settings.developerPhotoUrl && !settings.developerPhotoUrl.includes('default-avatar')) {
          const oldPath = path.join(__dirname, '..', settings.developerPhotoUrl);
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }
        }
        developerPhoto = `/uploads/${req.files.developerPhoto[0].filename}`;
      }
    }

    await settings.update({
      heroTitle: heroTitle !== undefined ? heroTitle : settings.heroTitle,
      heroSubtitle: heroSubtitle !== undefined ? heroSubtitle : settings.heroSubtitle,
      heroBanners: updatedBanners,
      history: history !== undefined ? history : settings.history,
      mission: mission !== undefined ? mission : settings.mission,
      vision: vision !== undefined ? vision : settings.vision,
      objectives: finalObjectives,
      presidentName: presidentName !== undefined ? presidentName : settings.presidentName,
      presidentMessage: presMsg !== undefined ? presMsg : settings.presidentMessage,
      presidentPhotoUrl: presidentPhoto,
      directorName: directorName !== undefined ? directorName : settings.directorName,
      directorMessage: dirMsg !== undefined ? dirMsg : settings.directorMessage,
      directorPhotoUrl: directorPhoto,
      address: address !== undefined ? address : settings.address,
      phone1: phone1 !== undefined ? phone1 : settings.phone1,
      phone2: phone2 !== undefined ? phone2 : settings.phone2,
      email: email !== undefined ? email : settings.email,
      whatsapp: whatsapp !== undefined ? whatsapp : settings.whatsapp,
      googleMapsEmbedUrl: googleMapsEmbedUrl !== undefined ? googleMapsEmbedUrl : settings.googleMapsEmbedUrl,
      developerName: developerName !== undefined ? developerName : settings.developerName,
      developerPhone: developerPhone !== undefined ? developerPhone : settings.developerPhone,
      developerPhotoUrl: developerPhoto
    });

    res.status(200).json({ success: true, data: formatSettings(settings) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getSettings,
  updateSettings
};
