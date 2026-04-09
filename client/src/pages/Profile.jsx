import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Briefcase, GraduationCap, Target, FileText, CheckCircle2, AlertCircle, Save, Trash2, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { userAPI, aiAPI } from '../utils/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

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
      targetCompanies: user?.preferences?.targetCompanies?.join(', ') || '',
      experience: user?.preferences?.experience || 'fresher'
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
      setMessage(error.response?.data?.message || error.message || 'Error parsing resume');
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
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile</h1>
        <p className="text-gray-500 dark:text-slate-400 mt-1">Manage your information and resume</p>
      </motion.div>

      {/* Message */}
      {message && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl border-2 ${
            message.includes('Error') 
              ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400'
              : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400'
          }`}
        >
          {message}
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Personal Information */}
        <motion.div variants={itemVariants}>
          <Card className="h-full">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Personal Information</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                icon={User}
              />

              <Input
                label="Email"
                value={user?.email || ''}
                icon={Mail}
                disabled
              />

              <Input
                label="Role"
                value={user?.role === 'cse' ? 'CSE/IT' : 'Non-CSE'} 
                icon={Briefcase}
                disabled
              />

              {user?.stream && (
                <Input
                  label="Stream"
                  value={user.stream}
                  icon={GraduationCap}
                  disabled
                />
              )}

              <div className="pt-4 border-t border-gray-100 dark:border-slate-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Education</h3>
                <div className="space-y-4">
                  <Input
                    label="Degree"
                    name="education.degree"
                    value={formData.education.degree}
                    onChange={handleChange}
                    placeholder="e.g., B.Tech in Computer Science"
                    icon={GraduationCap}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Year"
                      name="education.year"
                      type="number"
                      value={formData.education.year}
                      onChange={handleChange}
                      placeholder="e.g., 2025"
                    />
                    <Input
                      label="Institution"
                      name="education.institution"
                      value={formData.education.institution}
                      onChange={handleChange}
                      placeholder="e.g., MIT"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 dark:border-slate-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Preferences</h3>
                <div className="space-y-4">
                  <Input
                    label="Desired Role"
                    name="preferences.desiredRole"
                    value={formData.preferences.desiredRole}
                    onChange={handleChange}
                    placeholder="e.g., Software Engineer"
                    icon={Target}
                  />
                  <Input
                    label="Target Companies"
                    name="preferences.targetCompanies"
                    value={formData.preferences.targetCompanies}
                    onChange={handleChange}
                    placeholder="e.g., Google, Microsoft, Amazon"
                  />
                </div>
              </div>

              <Button
                type="submit"
                loading={loading}
                icon={Save}
                className="w-full"
              >
                Save Changes
              </Button>
            </form>
          </Card>
        </motion.div>

        {/* Resume & Account */}
        <div className="space-y-6">
          {/* Resume Section */}
          <motion.div variants={itemVariants}>
            <Card>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Resume</h2>
              </div>
              
              {user?.resume?.uploaded ? (
                <div className="mb-6">
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex items-center gap-3 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 mb-4"
                  >
                    <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-green-800 dark:text-green-300">Resume Uploaded</p>
                      <p className="text-sm text-green-600 dark:text-green-400">Parsed and ready for AI interviews</p>
                    </div>
                  </motion.div>
                  
                  {user?.resume?.parsed?.skills && (
                    <div>
                      <h4 className="font-semibold text-gray-700 dark:text-slate-300 mb-3">Detected Skills:</h4>
                      <div className="flex flex-wrap gap-2">
                        {user.resume.parsed.skills.map((skill, i) => (
                          <motion.span
                            key={i}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                            className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium"
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
                    className="flex items-center gap-3 p-4 rounded-xl bg-yellow-50 dark:bg-yellow-900/20"
                  >
                    <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center">
                      <AlertCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-yellow-800 dark:text-yellow-300">No Resume</p>
                      <p className="text-sm text-yellow-600 dark:text-yellow-400">Upload to get personalized interviews</p>
                    </div>
                  </motion.div>
                </div>
              )}

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Paste Resume Text
                </label>
                <textarea
                  name="resumeText"
                  value={formData.resumeText}
                  onChange={handleChange}
                  rows={8}
                  placeholder="Paste your resume content here..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <Button
                onClick={handleResumeUpload}
                loading={loading}
                variant="secondary"
                className="w-full"
                icon={FileText}
              >
                Parse Resume with AI
              </Button>
            </Card>
          </motion.div>

          {/* Account Section */}
          <motion.div variants={itemVariants}>
            <Card>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Account</h2>
              </div>
              
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start" icon={Shield}>
                  Change Password
                </Button>
                <Button variant="danger" className="w-full justify-start" icon={Trash2}>
                  Delete Account
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;