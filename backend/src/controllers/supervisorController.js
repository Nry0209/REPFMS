import Supervisor from "../models/Supervisor.js";
import fs from "fs";
import path from "path";

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

    // Use the method from the model to get proper profile image URL
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
      profileImage: supervisor.getProfileImageUrl(), // Use the model method
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

    const { name, phone, address, title, affiliation, experience, skills, awards, qualifications, removeProfileImage } = req.body;

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
    if (skills) {
      try { supervisor.skills = JSON.parse(skills); } 
      catch (e) { console.error("Failed to parse skills:", e); }
    }
    if (awards) {
      try { supervisor.awards = JSON.parse(awards); } 
      catch (e) { console.error("Failed to parse awards:", e); }
    }
    if (qualifications) {
      try { supervisor.qualifications = JSON.parse(qualifications); } 
      catch (e) { console.error("Failed to parse qualifications:", e); }
    }

    // =================== UPLOAD NEW PROFILE IMAGE ===================
    if (req.file) {
      console.log("Processing profile image:", req.file);

      // Delete old profile image
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

      // Read uploaded file and save
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
