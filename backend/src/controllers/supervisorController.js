import Supervisor from "../models/Supervisor.js";
import fs from "fs";
import path from "path";

// =================== HELPER TO PARSE ARRAY FIELDS ===================
const parseField = (field) => {
  if (!field) return [];
  if (typeof field === "string") {
    try { return JSON.parse(field); } 
    catch { return [field]; }
  }
  return Array.isArray(field) ? field : [field];
};

// =================== GET PROFILE ===================
export const getSupervisorProfile = async (req, res) => {
  try {
    console.log('Getting profile for user:', req.user._id);

    const supervisor = await Supervisor.findById(req.user._id)
      .select('-password')
      .populate('supervisions');

    if (!supervisor) {
      console.log('No supervisor found with ID:', req.user._id);
      return res.status(404).json({
        success: false,
        message: 'Supervisor profile not found'
      });
    }

    console.log('Returning profile for:', supervisor.email);

    const profileData = {
      _id: supervisor._id,
      name: supervisor.name,
      email: supervisor.email,
      phone: supervisor.phone,
      address: supervisor.address,
      title: supervisor.title,
      affiliation: supervisor.affiliation,
      experience: supervisor.experience,
      domains: supervisor.domains,
      studies: supervisor.studies,
      profileImage: supervisor.getProfileImageUrl(),
      availability: supervisor.availability,
      skills: supervisor.skills,
      languages: supervisor.languages,
      researchInterests: supervisor.researchInterests,
      qualifications: supervisor.qualifications,
      awards: supervisor.awards,
      statistics: supervisor.statistics,
      supervisions: supervisor.supervisions,
      institution: supervisor.institution,
      department: supervisor.department,
    };

    return res.status(200).json({
      success: true,
      supervisor: profileData
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching supervisor profile',
      error: error.message
    });
  }
};

// =================== UPDATE PROFILE ===================
// @desc    Get all supervisors for dropdown
// @route   GET /api/supervisors/list
// @access  Public
export const getAllSupervisors = async (req, res) => {
  try {
    const supervisors = await Supervisor.find({}, 'name email department')
      .sort({ name: 1 });
    
    res.json(supervisors);
  } catch (error) {
    console.error('Error fetching supervisors:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateSupervisorProfile = async (req, res) => {
  try {
    console.log("=== Update Profile Request ===");
    console.log("User ID:", req.user._id);
    console.log("Request body:", req.body);
    console.log("Uploaded file:", req.file);

    const supervisor = await Supervisor.findById(req.user._id);

    if (!supervisor) {
      return res.status(404).json({ 
        success: false,
        message: "Supervisor not found" 
      });
    }

    const { 
      name, phone, address, title, affiliation, experience, 
      skills, awards, qualifications, languages, researchInterests, 
      removeProfileImage 
    } = req.body;

    // =================== REMOVE PROFILE IMAGE ===================
    if (removeProfileImage === "true") {
      if (supervisor.profileImage?.path && supervisor.profileImage.path !== "/profile-placeholder.png") {
        const oldImagePath = path.join(process.cwd(), supervisor.profileImage.path.replace(/^\//, ''));
        if (fs.existsSync(oldImagePath)) {
          try {
            fs.unlinkSync(oldImagePath);
            console.log("Old profile image removed:", oldImagePath);
          } catch (err) {
            console.error("Failed to delete old image:", err);
          }
        }
      }
      supervisor.profileImage = undefined;
      await supervisor.save();

      const updatedProfile = {
        ...supervisor.toObject(),
        profileImage: supervisor.getProfileImageUrl(),
      };

      return res.status(200).json({
        success: true,
        message: "Profile picture removed",
        supervisor: updatedProfile,
      });
    }

    // =================== UPDATE TEXT FIELDS ===================
    if (name) supervisor.name = name;
    if (phone) supervisor.phone = phone;
    if (address) supervisor.address = address;
    if (title) supervisor.title = title;
    if (affiliation) supervisor.affiliation = affiliation;
    if (experience) supervisor.experience = parseInt(experience);

    // =================== UPDATE ARRAY FIELDS ===================
    if (skills) supervisor.skills = parseField(skills);
    if (awards) supervisor.awards = parseField(awards);
    if (qualifications) supervisor.qualifications = parseField(qualifications);
    if (languages) supervisor.languages = parseField(languages);
    if (researchInterests) supervisor.researchInterests = parseField(researchInterests);

    // =================== UPLOAD NEW PROFILE IMAGE ===================
    if (req.file) {
      console.log("Processing profile image:", req.file);

      if (supervisor.profileImage?.path && supervisor.profileImage.path !== "/profile-placeholder.png") {
        const oldImagePath = path.join(process.cwd(), supervisor.profileImage.path.replace(/^\//, ''));
        if (fs.existsSync(oldImagePath)) {
          try {
            fs.unlinkSync(oldImagePath);
            console.log("Old profile image deleted:", oldImagePath);
          } catch (err) {
            console.error("Failed to delete old image:", err);
          }
        }
      }

      const imageBuffer = fs.readFileSync(req.file.path);
      supervisor.profileImage = {
        data: imageBuffer,
        contentType: req.file.mimetype,
        filename: req.file.filename,
        path: `/uploads/supervisors/profileImages/${req.file.filename}`,
      };

      console.log("New profile image saved:", supervisor.profileImage.path);
    }

    await supervisor.save();

    // =================== RETURN UPDATED PROFILE ===================
    const updatedProfile = {
      _id: supervisor._id,
      name: supervisor.name,
      email: supervisor.email,
      phone: supervisor.phone,
      address: supervisor.address,
      title: supervisor.title,
      affiliation: supervisor.affiliation,
      experience: supervisor.experience,
      domains: supervisor.domains,
      studies: supervisor.studies,
      profileImage: supervisor.getProfileImageUrl(),
      availability: supervisor.availability,
      skills: supervisor.skills,
      languages: supervisor.languages,
      researchInterests: supervisor.researchInterests,
      qualifications: supervisor.qualifications,
      awards: supervisor.awards,
      statistics: supervisor.statistics,
      supervisions: supervisor.supervisions,
      institution: supervisor.institution,
      department: supervisor.department,
    };

    res.status(200).json({ 
      success: true,
      message: "Profile updated successfully", 
      supervisor: updatedProfile
    });

  } catch (error) {
    console.error("Update Supervisor Profile Error:", error);
    res.status(500).json({ 
      success: false,
      message: "Profile update failed", 
      error: error.message 
    });
  }
};
