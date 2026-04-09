import User from '../models/User.js';

export const updateProfile = async (req, res) => {
  try {
    const { name, education, preferences, resume } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (education) updateData.education = education;
    if (preferences) updateData.preferences = preferences;
    if (resume) {
      if (resume.parsed) updateData['resume.parsed'] = resume.parsed;
      if (resume.url) updateData['resume.url'] = resume.url;
      updateData['resume.uploaded'] = true;
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      user: user.toJSON()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
};

export const getStats = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    res.json({
      success: true,
      stats: {
        totalInterviews: 0,
        averageScore: 0,
        profileCompleted: user.profileCompleted,
        resumeUploaded: user.resume.uploaded,
        preferences: user.preferences
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching stats',
      error: error.message
    });
  }
};

export const updateRole = async (req, res) => {
  try {
    const { role, stream } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { role, stream } },
      { new: true }
    );

    res.json({
      success: true,
      user: user.toJSON()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating role',
      error: error.message
    });
  }
};