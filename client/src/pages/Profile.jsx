import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Briefcase, GraduationCap, Target, FileText, CheckCircle2, AlertCircle, Save, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { userAPI, aiAPI } from '../utils/api';
import Card from '../components/ui/Card';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    education: {
      degree: user?.education?.degree || '',
      year: user?.education?.year || '',
      institution: user?.education?.institution || ''
    },
    preferences: {
      desiredRole: user?.preferences?.desiredRole || '',
      targetCompanies: user?.preferences?.targetCompanies?.join(', ') || ''
    },
    resumeText: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('education.') || name.startsWith('preferences.')) {
      const [section, field] = name.split('.');
      setFormData({
        ...formData,
        [section]: {
          ...formData[section],
          [field]: value
        }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const updateData = {
        name: formData.name,
        education: formData.education,
        preferences: {
          ...formData.preferences,
          targetCompanies: formData.preferences.targetCompanies.split(',').map(c => c.trim()).filter(Boolean)
        }
      };

      const res = await userAPI.updateProfile(updateData);
      if (res.data.success) {
        updateUser(res.data.user);
        setMessage('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('Error updating profile');
    }
    setLoading(false);
  };

  const handleResumeUpload = async () => {
    if (!formData.resumeText.trim()) {
      setMessage('Please paste your resume text first');
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      const res = await aiAPI.parseResume({ resumeText: formData.resumeText });
      if (res.data.success) {
        updateUser(res.data.user);
        setMessage('Resume parsed successfully!');
      } else {
        setMessage(res.data.message || 'Error parsing resume');
      }
    } catch (error) {
      console.error('Error parsing resume:', error);
      setMessage(error.response?.data?.message || 'Error parsing resume');
    }
    setLoading(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="font-serif text-4xl text-white mb-2">Profile</h1>
        <p className="text-white/40">Manage your information</p>
      </motion.div>

      {/* Message */}
      {message && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl ${
            message.includes('Error') 
              ? 'bg-red-500/10 border border-red-500/20 text-red-400'
              : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
          }`}
        >
          {message}
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <motion.div variants={itemVariants}>
          <Card className="h-full">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <h2 className="font-serif text-xl text-white">Personal Info</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-violet-500/50 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">Email</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/30 disabled"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">Role</label>
                <input
                  value={user?.role === 'cse' ? 'CSE/IT' : 'Non-CSE'} 
                  disabled
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/30 disabled"
                />
              </div>

              {user?.stream && (
                <div>
                  <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">Stream</label>
                  <input
                    value={user.stream}
                    disabled
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/30 disabled"
                  />
                </div>
              )}

              <div className="pt-4 border-t border-white/5">
                <h3 className="font-medium text-white mb-4">Education</h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    name="education.degree"
                    value={formData.education.degree}
                    onChange={handleChange}
                    placeholder="Degree (e.g., B.Tech in Computer Science)"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-violet-500/50 focus:outline-none transition-colors"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="education.year"
                      value={formData.education.year}
                      onChange={handleChange}
                      placeholder="Year (e.g., 2025)"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-violet-500/50 focus:outline-none transition-colors"
                    />
                    <input
                      type="text"
                      name="education.institution"
                      value={formData.education.institution}
                      onChange={handleChange}
                      placeholder="Institution"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-violet-500/50 focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5">
                <h3 className="font-medium text-white mb-4">Preferences</h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    name="preferences.desiredRole"
                    value={formData.preferences.desiredRole}
                    onChange={handleChange}
                    placeholder="Desired Role (e.g., Software Engineer)"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-violet-500/50 focus:outline-none transition-colors"
                  />
                  <input
                    type="text"
                    name="preferences.targetCompanies"
                    value={formData.preferences.targetCompanies}
                    onChange={handleChange}
                    placeholder="Target Companies (comma separated)"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-violet-500/50 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-white text-black font-medium hover:bg-white/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Save className="w-5 h-5" />
                <span>Save Changes</span>
              </button>
            </form>
          </Card>
        </motion.div>

        {/* Resume & Account */}
        <div className="space-y-4">
          {/* Resume Section */}
          <motion.div variants={itemVariants}>
            <Card>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <h2 className="font-serif text-xl text-white">Resume</h2>
              </div>
              
              {user?.resume?.uploaded ? (
                <div className="mb-6">
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 mb-4"
                  >
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <p className="font-medium text-emerald-400">Resume Uploaded</p>
                      <p className="text-sm text-white/50">Ready for AI interviews</p>
                    </div>
                  </motion.div>
                  
                  {user?.resume?.parsed?.skills && (
                    <div>
                      <h4 className="font-medium text-white/70 mb-3">Detected Skills:</h4>
                      <div className="flex flex-wrap gap-2">
                        {user.resume.parsed.skills.map((skill, i) => (
                          <motion.span
                            key={i}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                            className="px-3 py-1.5 bg-violet-500/20 text-violet-300 rounded-full text-sm"
                          >
                            {skill}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="mb-6">
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex items-center gap-3 p-4 rounded-xl bg-yellow-500/10"
                  >
                    <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                      <AlertCircle className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div>
                      <p className="font-medium text-yellow-400">No Resume</p>
                      <p className="text-sm text-white/50">Upload to get personalized interviews</p>
                    </div>
                  </motion.div>
                </div>
              )}

              <div className="mb-4">
                <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">
                  Paste Resume Text
                </label>
                <textarea
                  name="resumeText"
                  value={formData.resumeText}
                  onChange={handleChange}
                  rows={8}
                  placeholder="Paste your resume content here..."
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-violet-500/50 focus:outline-none resize-none transition-colors"
                />
              </div>

              <button
                onClick={handleResumeUpload}
                disabled={loading}
                className="w-full py-3 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <FileText className="w-5 h-5" />
                <span>Parse Resume with AI</span>
              </button>
            </Card>
          </motion.div>

          {/* Account Section */}
          <motion.div variants={itemVariants}>
            <Card>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <h2 className="font-serif text-xl text-white">Account</h2>
              </div>
              
              <div className="space-y-3">
                <button className="w-full py-3 rounded-xl border border-white/10 text-white/60 hover:text-white hover:bg-white/5 transition-colors text-left flex items-center gap-3">
                  <Shield className="w-5 h-5" />
                  <span>Change Password</span>
                </button>
                <button className="w-full py-3 rounded-xl border border-white/10 text-red-400/60 hover:text-red-400 hover:bg-red-500/5 transition-colors text-left flex items-center gap-3">
                  <Shield className="w-5 h-5" />
                  <span>Delete Account</span>
                </button>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;