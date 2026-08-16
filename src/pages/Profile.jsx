// Profile page (spec section 25).
//
// Avatar flow: selecting a file shows it INSTANTLY via a local object URL
// (so the user sees their photo right away, no waiting on the network),
// then the file is uploaded in the background to the backend, which
// streams it to Cloudinary and returns the permanent hosted URL. If the
// upload fails, we roll the preview back to the last saved photo.

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Camera, Loader2, Mail, Phone, Globe2, CalendarDays, Save, User as UserIcon, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import FormField from "../components/FormField";
import { COMMON_TIMEZONES } from "../utils/timezones";

const formatJoined = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
};

const Profile = () => {
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef(null);

  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [timezone, setTimezone] = useState(user?.timezone || "Asia/Kolkata");
  const [saving, setSaving] = useState(false);

  const [localPreview, setLocalPreview] = useState(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    setName(user?.name || "");
    setPhone(user?.phone || "");
    setTimezone(user?.timezone || "Asia/Kolkata");
  }, [user]);

  // Clean up the temporary local object URL once it's no longer needed,
  // to avoid leaking memory across repeated selections.
  useEffect(() => () => {
    if (localPreview) URL.revokeObjectURL(localPreview);
  }, [localPreview]);

  const handleAvatarPick = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB");
      return;
    }

    // Show the picked photo immediately, straight from the user's device.
    const objectUrl = URL.createObjectURL(file);
    setLocalPreview(objectUrl);

    uploadAvatar(file);
  };

  const uploadAvatar = async (file) => {
    setUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const res = await api.post("/auth/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      updateUser({ profileImage: res.data.data.profileImage });
      toast.success("Profile photo updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Couldn't upload that photo");
    } finally {
      setUploadingAvatar(false);
      setLocalPreview(null); // now safe to show the permanent Cloudinary URL from user.profileImage
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put("/auth/profile", { name, phone, timezone });
      updateUser(res.data.data);
      toast.success("Profile updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Couldn't save your profile");
    } finally {
      setSaving(false);
    }
  };

  // What to actually render in the avatar circle: the freshly-picked local
  // file while uploading, otherwise whatever's saved on the account.
  const avatarSrc = localPreview || user?.profileImage;

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-display font-bold text-gray-900 dark:text-slate-100">Profile</h1>
        <p className="text-gray-500 dark:text-slate-400 text-sm">Manage your personal details and photo.</p>
      </div>

      {/* PHOTO */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-5 sm:p-6 mb-5 flex items-center gap-5"
      >
        <div className="relative shrink-0">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-brand-gradient flex items-center justify-center text-white text-2xl font-bold">
            {avatarSrc ? (
              <img src={avatarSrc} alt={user?.name} className="w-full h-full object-cover" />
            ) : (
              user?.name?.[0]?.toUpperCase() || "U"
            )}
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingAvatar}
            className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-white dark:bg-slate-800 border-2 border-white dark:border-slate-900 shadow-md flex items-center justify-center text-brand-600 dark:text-brand-300 hover:bg-brand-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-60"
            title="Change photo"
          >
            {uploadingAvatar ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Camera className="w-3.5 h-3.5" />}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarPick}
          />
        </div>
        <div>
          <p className="font-semibold text-gray-900 dark:text-slate-100">{user?.name}</p>
          <p className="text-sm text-gray-400 dark:text-slate-500">{user?.email}</p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="mt-2 text-xs font-semibold text-brand-600 dark:text-brand-300 hover:text-brand-700 dark:hover:text-brand-200"
          >
            {uploadingAvatar ? "Uploading..." : "Upload new photo"}
          </button>
        </div>
      </motion.div>

      {/* DETAILS */}
      <motion.form
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        onSubmit={handleSave}
        className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4"
      >
        <FormField
          label="Full name"
          icon={UserIcon}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
        />
        <FormField
          label="Email"
          icon={Mail}
          value={user?.email || ""}
          disabled
          hint={
            user?.emailVerified
              ? "Verified — email can't be changed here to protect account recovery."
              : "Not verified yet."
          }
          rightSlot={
            user?.emailVerified ? (
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
            ) : null
          }
          className="disabled:cursor-not-allowed disabled:opacity-70"
        />
        <FormField
          label="Mobile number"
          icon={Phone}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="9876543210"
        />
        <div>
          <label className="mb-1.5 block text-[13px] font-semibold text-gray-700 dark:text-slate-300">Timezone</label>
          <div className="relative">
            <Globe2 className="w-[18px] h-[18px] absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 pointer-events-none" />
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full pl-10 pr-4 py-[11px] border border-gray-200 dark:border-slate-700 rounded-xl outline-none input-focus-ring bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 text-[15px] transition-all"
            >
              {COMMON_TIMEZONES.map((tz) => (
                <option key={tz} value={tz}>{tz}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-400 dark:text-slate-500 pt-1">
          <CalendarDays className="w-4 h-4" />
          Member since {formatJoined(user?.createdAt)}
        </div>

        <button
          type="submit"
          disabled={saving}
          className="btn-gradient w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold disabled:opacity-60"
        >
          {saving ? <Loader2 className="w-[18px] h-[18px] animate-spin" /> : <Save className="w-[18px] h-[18px]" />}
          Save changes
        </button>
      </motion.form>
    </div>
  );
};

export default Profile;
