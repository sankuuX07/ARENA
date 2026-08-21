import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getStudentProfile, updateStudentProfile, uploadProfilePhoto } from '../services/profileService';
import { UserProfile } from '../types';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { PageHeader } from '../components/ui/PageHeader';
import { TagInput } from '../components/ui/TagInput';
import {
  User,
  Mail,
  GraduationCap,
  BookOpen,
  Code2,
  Brain,
  Edit3,
  Save,
  XCircle,
  Camera,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

const SUGGESTED_SKILLS = [
  'Data Structures',
  'Algorithms',
  'SQL',
  'React',
  'Node.js',
  'System Design',
  'OOPs',
  'DBMS',
  'Git',
  'Operating Systems',
];

const SUGGESTED_LANGUAGES = ['C', 'C++', 'Java', 'Python', 'JavaScript', 'TypeScript', 'Go', 'Rust', 'SQL'];

const GRADUATION_YEARS = ['2024', '2025', '2026', '2027', '2028', '2029', '2030'];

export const ProfilePage: React.FC = () => {
  const { currentUser, updateUserProfileState } = useAuth();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [uploadingPhoto, setUploadingPhoto] = useState<boolean>(false);

  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Editable Form State
  const [fullName, setFullName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [dateOfBirth, setDateOfBirth] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const [college, setCollege] = useState<string>('');
  const [degree, setDegree] = useState<string>('');
  const [branch, setBranch] = useState<string>('');
  const [graduationYear, setGraduationYear] = useState<string>('');
  const [bio, setBio] = useState<string>('');
  const [skills, setSkills] = useState<string[]>([]);
  const [programmingLanguages, setProgrammingLanguages] = useState<string[]>([]);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string>('');

  useEffect(() => {
    const loadProfileData = async () => {
      if (!currentUser) return;
      setLoading(true);
      try {
        const data = await getStudentProfile(currentUser.uid);
        populateState(data);
      } catch (err: any) {
        setErrorMessage(err.message || 'Unable to load your profile. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, [currentUser]);

  const populateState = (data: UserProfile) => {
    setProfile(data);
    setFullName(data.fullName || '');
    setPhone(data.phone || '');
    setDateOfBirth(data.dateOfBirth || '');
    setGender(data.gender || '');
    setCollege(data.college || '');
    setDegree(data.degree || '');
    setBranch(data.branch || '');
    setGraduationYear(data.graduationYear || '');
    setBio(data.bio || '');
    setSkills(data.skills || []);
    setProgrammingLanguages(data.programmingLanguages || []);
    setProfilePhotoUrl(data.profilePhotoUrl || '');
  };

  const getInitials = (name?: string): string => {
    if (!name) return 'ST';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const validateForm = (): boolean => {
    setErrorMessage('');
    setSuccessMessage('');

    if (!fullName.trim()) {
      setErrorMessage('Full Name is required.');
      return false;
    }

    if (phone.trim() && !/^[0-9+\-\s()]{7,15}$/.test(phone.trim())) {
      setErrorMessage('Please enter a valid phone number format.');
      return false;
    }

    if (bio.length > 500) {
      setErrorMessage('Biography must not exceed 500 characters.');
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!currentUser || !validateForm()) return;

    setSaving(true);
    try {
      const updates: Partial<UserProfile> = {
        fullName: fullName.trim(),
        phone: phone.trim(),
        dateOfBirth,
        gender,
        college: college.trim(),
        degree: degree.trim(),
        branch: branch.trim(),
        graduationYear,
        bio: bio.trim(),
        skills,
        programmingLanguages,
        profilePhotoUrl,
      };

      const updatedProfile = await updateStudentProfile(currentUser.uid, updates);
      setProfile(updatedProfile);
      updateUserProfileState(updatedProfile);

      setSuccessMessage('Profile updated successfully.');
      setIsEditing(false);
    } catch (err: any) {
      setErrorMessage(err.message || 'Profile could not be updated. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser) return;

    setUploadingPhoto(true);
    setErrorMessage('');
    try {
      const photoUrl = await uploadProfilePhoto(currentUser.uid, file);
      setProfilePhotoUrl(photoUrl);

      // Auto-update Firestore with new photo URL
      const updatedProfile = await updateStudentProfile(currentUser.uid, { profilePhotoUrl: photoUrl });
      setProfile(updatedProfile);
      updateUserProfileState(updatedProfile);

      setSuccessMessage('Profile photo updated successfully.');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to upload profile photo.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1.5rem' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading your student profile...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', width: '100%' }}>
      <PageHeader
        title="Student Profile"
        description="View and manage your academic, technical, and personal placement preparation details."
        icon={<User size={24} />}
        action={
          <Button
            variant={isEditing ? 'outline' : 'primary'}
            icon={isEditing ? <XCircle size={16} /> : <Edit3 size={16} />}
            onClick={() => {
              if (isEditing && profile) populateState(profile); // Reset edits on cancel
              setIsEditing(!isEditing);
            }}
          >
            {isEditing ? 'Cancel Edit' : 'Edit Profile'}
          </Button>
        }
      />

      {/* Alert Banners */}
      {successMessage && (
        <div className="health-status success" style={{ marginBottom: '1.5rem' }}>
          <CheckCircle2 size={20} />
          <div>
            <div className="status-label">Success</div>
            <div className="status-detail">{successMessage}</div>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="error-alert" style={{ marginBottom: '1.5rem' }}>
          <div className="error-alert-header">
            <AlertCircle size={18} />
            <span className="error-title">Profile Error</span>
          </div>
          <div className="error-message" style={{ marginBottom: 0 }}>
            {errorMessage}
          </div>
        </div>
      )}

      {/* Main Profile Summary Card */}
      <Card style={{ marginBottom: '2rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            flexWrap: 'wrap',
          }}
        >
          {/* Avatar / Photo Upload Container */}
          <div style={{ position: 'relative' }}>
            <div
              style={{
                width: 100,
                height: 100,
                borderRadius: '50%',
                overflow: 'hidden',
                background: 'var(--primary-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontSize: '2rem',
                fontWeight: 800,
                boxShadow: 'var(--shadow-glow)',
                border: '3px solid var(--border-color-glow)',
              }}
            >
              {profilePhotoUrl ? (
                <img
                  src={profilePhotoUrl}
                  alt={fullName || 'Student'}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                getInitials(fullName)
              )}
            </div>

            <label
              htmlFor="photo-upload-input"
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'var(--primary)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)',
              }}
              title="Upload profile photo (Max 2MB)"
            >
              <Camera size={16} />
              <input
                id="photo-upload-input"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                style={{ display: 'none' }}
                onChange={handlePhotoSelect}
                disabled={uploadingPhoto}
              />
            </label>
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
              <h2 className="section-title" style={{ fontSize: '1.6rem' }}>
                {fullName || 'Student Name'}
              </h2>
              <Badge variant="primary">Role: student</Badge>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Mail size={15} />
                <span>{profile?.email}</span>
              </div>
              {college && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <GraduationCap size={15} />
                  <span>
                    {college} {graduationYear ? `(Batch '${graduationYear.slice(-2)})` : ''}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Profile Form / View Sections */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))', gap: '1.5rem' }}>
        {/* Personal Information */}
        <Card>
          <div className="arena-card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={18} style={{ color: 'var(--primary)' }} />
              <h3 className="card-title">Personal Information</h3>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.3rem', color: 'var(--text-muted)' }}>
                Full Name *
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-main)',
                  }}
                />
              ) : (
                <div style={{ fontSize: '0.95rem', fontWeight: 500 }}>{fullName || 'Not provided'}</div>
              )}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.3rem', color: 'var(--text-muted)' }}>
                Email Address (Read-only)
              </label>
              <div style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>{profile?.email}</div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.3rem', color: 'var(--text-muted)' }}>
                Phone Number
              </label>
              {isEditing ? (
                <input
                  type="text"
                  placeholder="+91 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-main)',
                  }}
                />
              ) : (
                <div style={{ fontSize: '0.95rem', fontWeight: 500 }}>{phone || 'Not provided'}</div>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.3rem', color: 'var(--text-muted)' }}>
                  Date of Birth
                </label>
                {isEditing ? (
                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-input)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-main)',
                    }}
                  />
                ) : (
                  <div style={{ fontSize: '0.95rem', fontWeight: 500 }}>{dateOfBirth || 'Not provided'}</div>
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.3rem', color: 'var(--text-muted)' }}>
                  Gender
                </label>
                {isEditing ? (
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-input)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-main)',
                    }}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                ) : (
                  <div style={{ fontSize: '0.95rem', fontWeight: 500 }}>{gender || 'Not provided'}</div>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Academic Information */}
        <Card>
          <div className="arena-card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <GraduationCap size={18} style={{ color: 'var(--secondary)' }} />
              <h3 className="card-title">Academic Information</h3>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.3rem', color: 'var(--text-muted)' }}>
                College / University
              </label>
              {isEditing ? (
                <input
                  type="text"
                  placeholder="e.g. ABC Engineering College"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-main)',
                  }}
                />
              ) : (
                <div style={{ fontSize: '0.95rem', fontWeight: 500 }}>{college || 'Not provided'}</div>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.3rem', color: 'var(--text-muted)' }}>
                  Degree
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    placeholder="e.g. B.Tech / B.E."
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-input)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-main)',
                    }}
                  />
                ) : (
                  <div style={{ fontSize: '0.95rem', fontWeight: 500 }}>{degree || 'Not provided'}</div>
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.3rem', color: 'var(--text-muted)' }}>
                  Graduation Year
                </label>
                {isEditing ? (
                  <select
                    value={graduationYear}
                    onChange={(e) => setGraduationYear(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-input)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-main)',
                    }}
                  >
                    <option value="">Select Year</option>
                    {GRADUATION_YEARS.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div style={{ fontSize: '0.95rem', fontWeight: 500 }}>{graduationYear || 'Not provided'}</div>
                )}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.3rem', color: 'var(--text-muted)' }}>
                Branch / Department
              </label>
              {isEditing ? (
                <input
                  type="text"
                  placeholder="e.g. Computer Science & Engineering"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-main)',
                  }}
                />
              ) : (
                <div style={{ fontSize: '0.95rem', fontWeight: 500 }}>{branch || 'Not provided'}</div>
              )}
            </div>
          </div>
        </Card>

        {/* Technical Skills & Languages */}
        <Card style={{ gridColumn: 'span 1' }}>
          <div className="arena-card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Brain size={18} style={{ color: 'var(--warning)' }} />
              <h3 className="card-title">Technical Skills & Concepts</h3>
            </div>
          </div>

          {isEditing ? (
            <TagInput
              tags={skills}
              onChange={setSkills}
              placeholder="Add skill (e.g. React, Data Structures)..."
              suggestions={SUGGESTED_SKILLS}
              variant="primary"
            />
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {skills.length > 0 ? (
                skills.map((s, i) => (
                  <Badge key={i} variant="primary">
                    {s}
                  </Badge>
                ))
              ) : (
                <span style={{ fontSize: '0.9rem', color: 'var(--text-dim)', fontStyle: 'italic' }}>
                  No skills specified yet.
                </span>
              )}
            </div>
          )}
        </Card>

        <Card style={{ gridColumn: 'span 1' }}>
          <div className="arena-card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Code2 size={18} style={{ color: 'var(--success)' }} />
              <h3 className="card-title">Programming Languages</h3>
            </div>
          </div>

          {isEditing ? (
            <TagInput
              tags={programmingLanguages}
              onChange={setProgrammingLanguages}
              placeholder="Add language (e.g. Java, C++)..."
              suggestions={SUGGESTED_LANGUAGES}
              variant="success"
            />
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {programmingLanguages.length > 0 ? (
                programmingLanguages.map((l, i) => (
                  <Badge key={i} variant="success">
                    {l}
                  </Badge>
                ))
              ) : (
                <span style={{ fontSize: '0.9rem', color: 'var(--text-dim)', fontStyle: 'italic' }}>
                  No programming languages specified yet.
                </span>
              )}
            </div>
          )}
        </Card>
      </div>

      {/* Biography Card */}
      <Card style={{ marginTop: '1.5rem' }}>
        <div className="arena-card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BookOpen size={18} style={{ color: 'var(--primary)' }} />
            <h3 className="card-title">About Me / Biography</h3>
          </div>
          {isEditing && (
            <span style={{ fontSize: '0.78rem', color: bio.length > 500 ? 'var(--error)' : 'var(--text-dim)' }}>
              {bio.length} / 500 chars
            </span>
          )}
        </div>

        {isEditing ? (
          <textarea
            rows={4}
            placeholder="Tell us about your background, competitive learning goals, and placement interests..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            style={{
              width: '100%',
              padding: '0.85rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-input)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              fontSize: '0.95rem',
              resize: 'vertical',
              outline: 'none',
            }}
          />
        ) : (
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
            {bio || 'No biography written yet.'}
          </p>
        )}
      </Card>

      {/* Save Action Footer in Edit Mode */}
      {isEditing && (
        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <Button
            variant="secondary"
            onClick={() => {
              if (profile) populateState(profile);
              setIsEditing(false);
            }}
          >
            Cancel
          </Button>
          <Button variant="primary" icon={<Save size={16} />} loading={saving} onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      )}
    </div>
  );
};
