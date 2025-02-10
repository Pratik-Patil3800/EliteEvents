import React, { useState, useEffect } from 'react';
import { Camera, Save, Check, Loader2, LogOut } from 'lucide-react';
import Navcomp from '../components/Nav2';
import { useUser } from "../context/usercontext";
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const { user, token, updateUser } = useUser();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
    bio: user?.bio || '',
    avatar: user?.avatar || '',
    avatarFile: null,
    avatarPreview: null
  });

  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (e.g., 5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }

      const previewUrl = URL.createObjectURL(file);
      setUserInfo(prev => ({
        ...prev,
        avatarFile: file,
        avatarPreview: previewUrl
      }));
    }
  };
  
  const handleUserInfoChange = (e) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validatePasswords = () => {
    if (passwords.new !== passwords.confirm) {
      toast.error("New passwords don't match!");
      return false;
    }
    if (passwords.new.length < 6) {
      toast.error("Password must be at least 6 characters long!");
      return false;
    }
    return true;
  };

  const handlePasswordUpdate = async () => {
    if (!validatePasswords()) return;
    
    setIsLoading(true);
    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URI}/api/auth/password`,
        passwords,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        }
      );
      
      toast.success("Password updated successfully!");
      setPasswords({ current: '', new: '', confirm: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update password!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignout = async () => {
    
    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URI}/api/auth/signout`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        }
      );
      
      toast.success("Signout successfully!");
      updateUser({
        id: null,
        name: "",
        email: "",
        avatar: "",
        bio: "",
        phone: "",
        location: "",
      },"");
      navigate("/notifications");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to Signout!");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      const formData = new FormData();
      formData.append("name", userInfo.name);
      formData.append("email", userInfo.email);
      formData.append("phone", userInfo.phone);
      formData.append("location", userInfo.location);
      formData.append("bio", userInfo.bio);
  
      if (userInfo.avatarFile) {
        formData.append("avatar", userInfo.avatarFile);
      }
  
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URI}/api/auth/update`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          }
        }
      );
  
      updateUser(response.data,token);
      

      setUserInfo(prev => ({
        ...prev,
        avatar: response.data.avatar,
        avatarFile: null,
        avatarPreview: null
      }));

      toast.success("Profile updated successfully!");
      setIsEditing(false);
      
      // Clean up any object URLs
      if (userInfo.avatarPreview) {
        URL.revokeObjectURL(userInfo.avatarPreview);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed!");
      console.error("Update Error:", error);
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    return () => {
      if (userInfo.avatarPreview) {
        URL.revokeObjectURL(userInfo.avatarPreview);
      }
    };
  }, []);

  return (
    <>
      <Navcomp/>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gray-600 p-6 text-white flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold">Profile Settings</h1>
                <p className="text-gray-200">Manage your account settings and preferences</p>
              </div>
              <LogOut size={25} onClick={handleSignout}/>
            </div>

            {/* Navigation */}
            <div className="border-b">
              <div className="flex">
                <button
                  onClick={() => setActiveSection('profile')}
                  className={`px-6 py-4 font-medium ${
                    activeSection === 'profile'
                      ? 'border-b-2 border-gray-800 text-gray-800'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  Profile Information
                </button>
                <button
                  onClick={() => setActiveSection('security')}
                  className={`px-6 py-4 font-medium ${
                    activeSection === 'security'
                      ? 'border-b-2 border-gray-800 text-gray-800'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  Security
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {activeSection === 'profile' ? (
                <div className="space-y-6">
                  {/* Profile Picture */}
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      <img
                        src={userInfo.avatarPreview || userInfo.avatar || '/default-avatar.png'}
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                      />
                      {isEditing && (
                        <label className="absolute bottom-0 right-0 bg-gray-600 p-2 rounded-full cursor-pointer hover:bg-gray-700 transition-colors">
                          <Camera className="w-4 h-4 text-white" />
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleProfilePicChange}
                          />
                        </label>
                      )}
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">{userInfo.name}</h2>
                      <p className="text-gray-600">{userInfo.email}</p>
                    </div>
                  </div>

                  {/* Form */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={userInfo.name}
                        onChange={handleUserInfoChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={userInfo.email}
                        onChange={handleUserInfoChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={userInfo.phone}
                        onChange={handleUserInfoChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={userInfo.location}
                        onChange={handleUserInfoChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-50"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bio
                      </label>
                      <textarea
                        name="bio"
                        value={userInfo.bio}
                        onChange={handleUserInfoChange}
                        disabled={!isEditing}
                        rows={4}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-50"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="max-w-md mx-auto space-y-6">
                  <h3 className="text-lg font-semibold mb-4">Change Password</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      name="current"
                      value={passwords.current}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      name="new"
                      value={passwords.new}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      name="confirm"
                      value={passwords.confirm}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="mt-8 flex justify-end space-x-4">
                {activeSection === 'profile' && (
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    disabled={isLoading}
                  >
                    {isEditing ? 'Cancel' : 'Edit'}
                  </button>
                )}
                <button
                  onClick={activeSection === 'profile' ? handleSave : handlePasswordUpdate}
                  disabled={isLoading}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;