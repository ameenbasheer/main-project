import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiArrowLeft,
  FiUser,
  FiMail,
  FiCheckCircle,
  FiSave,
  FiCamera,
  FiPackage,
  FiLogOut,
  FiChevronRight,
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

// Read a File into a base64 data URL the backend stores in the user's `avatar` field.
function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Could not read the image file.'));
    reader.readAsDataURL(file);
  });
}

export default function Profile() {
  const { user, updateUser, logout } = useAuth();
  const { farmerProfile, updateFarmerProfile } = useApp();
  const navigate = useNavigate();
  const isFarmer = user?.role === 'farmer';
  const isAdmin = user?.role === 'admin';

  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [profile, setProfile] = useState({
    location: farmerProfile?.location || '',
    totalArea: farmerProfile?.totalArea || 0,
    areaUnit: farmerProfile?.areaUnit || 'acre',
    soilType: farmerProfile?.soilType || '',
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [fill, setFill] = useState(0);

  const setField = (key, value) => setProfile((p) => ({ ...p, [key]: value }));

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    try {
      setAvatar(await fileToDataUrl(file));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const changes = {};
      if (name.trim() && name !== user?.name) changes.name = name.trim();
      if (avatar !== (user?.avatar || '')) changes.avatar = avatar;
      if (Object.keys(changes).length) await updateUser(changes);
      if (isFarmer) {
        await updateFarmerProfile({ ...profile, totalArea: Number(profile.totalArea) || 0 });
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err.message || 'Could not save your profile.');
    } finally {
      setSaving(false);
    }
  };

  const initials = (user?.name || '?')
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  // Live profile-completeness score (role-aware).
  const completeness = useMemo(() => {
    const checks = [!!name.trim(), !!avatar];
    if (isFarmer) {
      checks.push(!!profile.location.trim(), Number(profile.totalArea) > 0, !!profile.soilType.trim());
    }
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [name, avatar, isFarmer, profile.location, profile.totalArea, profile.soilType]);

  // Animate the bar from 0 → current value on mount, then track live edits.
  useEffect(() => {
    setFill(completeness);
  }, [completeness]);

  const inputClass =
    'w-full rounded-lg border border-[#E6EDE4] bg-white px-4 py-2 text-[#0E2A18] text-sm outline-none transition-colors placeholder:text-[#A6B0A6] focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15';
  const labelText = 'text-xs font-medium tracking-wide mb-2 block text-[#5F6E62]';
  const sectionLabel = 'text-[11px] uppercase tracking-[0.15em] font-semibold mb-4 text-[#8A978C]';

  return (
    <div className="max-w-2xl mx-auto">
      <div className="rounded-2xl border border-[#E6EDE4] bg-white p-5 sm:p-[32px] gr-fade-up">
        {/* Header row */}
        <div className="mb-5">
          <Link
            to={isAdmin ? '/admin' : isFarmer ? '/dashboard' : '/marketplace'}
            className="inline-flex items-center gap-2 text-sm no-underline text-[#5F6E62] hover:bg-[#F6F8F5] transition-colors group rounded-lg px-2 py-1 -ml-2"
          >
            <FiArrowLeft size={16} className="group-hover:-translate-x-[3px] transition-transform" />
            Back
          </Link>
        </div>

        {/* Identity */}
        <div className="flex items-center gap-4">
          <label className="relative w-[88px] h-[88px] shrink-0 cursor-pointer group" title="Change profile picture">
            {avatar ? (
              <img src={avatar} alt="Profile" className="w-[88px] h-[88px] rounded-full object-cover" />
            ) : (
              <span className="w-[88px] h-[88px] rounded-full flex items-center justify-center text-2xl font-semibold bg-emerald-50 text-emerald-700">
                {initials}
              </span>
            )}
            <span className="absolute bottom-0 right-0 w-[30px] h-[30px] rounded-full bg-emerald-600 text-white flex items-center justify-center border-2 border-white transition-transform group-hover:scale-110">
              <FiCamera size={13} />
            </span>
            <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
          </label>

          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-bold truncate text-[#0E2A18]">{user?.name || 'Your name'}</h1>
            <p className="text-sm flex items-center gap-2 mt-1 text-[#5F6E62]">
              <FiMail size={13} className="shrink-0" />
              <span className="truncate">{user?.email}</span>
            </p>
            <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-wider border border-[#E6EDE4] rounded-full px-2 py-1 text-emerald-600">
              <FiUser size={11} /> {user?.role}
            </span>
          </div>
        </div>

        {/* Completeness bar */}
        <div className="mt-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-[#5F6E62]">Profile completeness</span>
            <span className="text-xs font-semibold tabular-nums text-emerald-600">{completeness}%</span>
          </div>
          <div className="h-[6px] w-full rounded-full bg-[#EDF1EB]">
            <div
              className="h-full rounded-full bg-emerald-600 transition-[width] duration-700 ease-out"
              style={{ width: `${fill}%` }}
            />
          </div>
        </div>

        <hr className="my-5 border-t border-[#EDF1EB]" />

        <form onSubmit={handleSave}>
          {/* Account details */}
          <section>
            <p className={sectionLabel}>Account details</p>
            <div className="mb-4">
              <span className={labelText}>Full name</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
                placeholder="Your name"
              />
            </div>
            <div>
              <span className={labelText}>Email</span>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full rounded-lg border border-[#E6EDE4] bg-[#F6F8F5] px-4 py-2 text-sm text-[#9AA69C] outline-none cursor-not-allowed"
              />
            </div>
          </section>

          {/* Farm details */}
          {isFarmer && (
            <>
              <hr className="my-5 border-t border-[#EDF1EB]" />
              <section>
                <p className={sectionLabel}>Farm details</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <span className={labelText}>Location</span>
                    <input
                      type="text"
                      value={profile.location}
                      onChange={(e) => setField('location', e.target.value)}
                      className={inputClass}
                      placeholder="e.g. Pune, Maharashtra"
                    />
                  </div>
                  <div>
                    <span className={labelText}>Total area</span>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={profile.totalArea}
                      onChange={(e) => setField('totalArea', e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <span className={labelText}>Area unit</span>
                    <select
                      value={profile.areaUnit}
                      onChange={(e) => setField('areaUnit', e.target.value)}
                      className={inputClass}
                    >
                      <option value="acre">acre</option>
                      <option value="hectare">hectare</option>
                      <option value="sqm">sq. metre</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <span className={labelText}>Soil type</span>
                    <input
                      type="text"
                      value={profile.soilType}
                      onChange={(e) => setField('soilType', e.target.value)}
                      className={inputClass}
                      placeholder="e.g. Loamy"
                    />
                  </div>
                </div>
              </section>
            </>
          )}

          {error && (
            <p className="text-rose-600 text-sm bg-rose-50 border border-rose-200 rounded-lg px-4 py-3 mt-5">
              {error}
            </p>
          )}

          <div className="flex items-center gap-3 mt-5">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 text-sm font-semibold text-white border rounded-lg px-4 py-2 bg-emerald-600 hover:bg-emerald-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <FiSave size={15} className={saving ? 'animate-spin' : ''} />
              {saving ? 'Saving…' : 'Save changes'}
            </button>
            {saved && (
              <span className="flex items-center gap-2 text-sm font-medium gr-pop text-emerald-600">
                <FiCheckCircle size={16} /> Saved
              </span>
            )}
          </div>
        </form>

        <hr className="my-5 border-t border-[#EDF1EB]" />

        {/* Quick links */}
        <div className="flex flex-col">
          {!isAdmin && (
            <Link
              to="/orders"
              className="flex items-center gap-3 px-2 py-3 -mx-2 rounded-lg text-sm no-underline text-[#0E2A18] hover:bg-[#F6F8F5] transition-colors group"
            >
              <FiPackage size={17} className="text-emerald-600" />
              <span className="flex-1 font-medium">My Orders</span>
              <FiChevronRight size={17} className="text-[#8A978C] group-hover:translate-x-[3px] transition-transform" />
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-2 py-3 -mx-2 rounded-lg text-sm text-rose-600 hover:bg-rose-50 transition-colors group"
          >
            <FiLogOut size={17} className="text-rose-500" />
            <span className="flex-1 text-left font-medium">Logout</span>
            <FiChevronRight size={17} className="opacity-50 group-hover:translate-x-[3px] transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
