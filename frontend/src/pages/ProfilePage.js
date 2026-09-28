import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getStudentProfile, updateStudentProfile, uploadProfilePhoto } from '../services/profileService';
import { UserProfile } from '../types';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { PageHeader } from '../components/ui/PageHeader';
import { TagInput } from '../components/ui/TagInput';
import { User, Mail, GraduationCap, BookOpen, Code2, Brain, Edit3, Save, XCircle, Camera, CheckCircle2, AlertCircle, } from 'lucide-react';
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
export const ProfilePage = () => {
    const { currentUser, updateUserProfileState } = useAuth();
    const [profile, setProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    // Editable Form State
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [gender, setGender] = useState('');
    const [college, setCollege] = useState('');
    const [degree, setDegree] = useState('');
    const [branch, setBranch] = useState('');
    const [graduationYear, setGraduationYear] = useState('');
    const [bio, setBio] = useState('');
    const [skills, setSkills] = useState([]);
    const [programmingLanguages, setProgrammingLanguages] = useState([]);
    const [profilePhotoUrl, setProfilePhotoUrl] = useState('');
    useEffect(() => {
        const loadProfileData = async () => {
            if (!currentUser)
                return;
            setLoading(true);
            try {
                const data = await getStudentProfile(currentUser.uid);
                populateState(data);
            }
            catch (err) {
                setErrorMessage(err.message || 'Unable to load your profile. Please try again.');
            }
            finally {
                setLoading(false);
            }
        };
        loadProfileData();
    }, [currentUser]);
    const populateState = (data) => {
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
    const getInitials = (name) => {
        if (!name)
            return 'ST';
        const parts = name.trim().split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name.slice(0, 2).toUpperCase();
    };
    const validateForm = () => {
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
        if (!currentUser || !validateForm())
            return;
        setSaving(true);
        try {
            const updates = {
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
        }
        catch (err) {
            setErrorMessage(err.message || 'Profile could not be updated. Please try again.');
        }
        finally {
            setSaving(false);
        }
    };
    const handlePhotoSelect = async (e) => {
        const file = e.target.files?.[0];
        if (!file || !currentUser)
            return;
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
        }
        catch (err) {
            setErrorMessage(err.message || 'Failed to upload profile photo.');
        }
        finally {
            setUploadingPhoto(false);
        }
    };
    if (loading) {
        return (_jsx("div", { style: { textAlign: 'center', padding: '4rem 1.5rem' }, children: _jsx("p", { style: { color: 'var(--text-muted)' }, children: "Loading your student profile..." }) }));
    }
    return (_jsxs("div", { style: { maxWidth: 1000, margin: '0 auto', width: '100%' }, children: [_jsx(PageHeader, { title: "Student Profile", description: "View and manage your academic, technical, and personal placement preparation details.", icon: _jsx(User, { size: 24 }), action: _jsx(Button, { variant: isEditing ? 'outline' : 'primary', icon: isEditing ? _jsx(XCircle, { size: 16 }) : _jsx(Edit3, { size: 16 }), onClick: () => {
                        if (isEditing && profile)
                            populateState(profile); // Reset edits on cancel
                        setIsEditing(!isEditing);
                    }, children: isEditing ? 'Cancel Edit' : 'Edit Profile' }) }), successMessage && (_jsxs("div", { className: "health-status success", style: { marginBottom: '1.5rem' }, children: [_jsx(CheckCircle2, { size: 20 }), _jsxs("div", { children: [_jsx("div", { className: "status-label", children: "Success" }), _jsx("div", { className: "status-detail", children: successMessage })] })] })), errorMessage && (_jsxs("div", { className: "error-alert", style: { marginBottom: '1.5rem' }, children: [_jsxs("div", { className: "error-alert-header", children: [_jsx(AlertCircle, { size: 18 }), _jsx("span", { className: "error-title", children: "Profile Error" })] }), _jsx("div", { className: "error-message", style: { marginBottom: 0 }, children: errorMessage })] })), _jsx(Card, { style: { marginBottom: '2rem' }, children: _jsxs("div", { style: {
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1.5rem',
                        flexWrap: 'wrap',
                    }, children: [_jsxs("div", { style: { position: 'relative' }, children: [_jsx("div", { style: {
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
                                    }, children: profilePhotoUrl ? (_jsx("img", { src: profilePhotoUrl, alt: fullName || 'Student', style: { width: '100%', height: '100%', objectFit: 'cover' } })) : (getInitials(fullName)) }), _jsxs("label", { htmlFor: "photo-upload-input", style: {
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
                                    }, title: "Upload profile photo (Max 2MB)", children: [_jsx(Camera, { size: 16 }), _jsx("input", { id: "photo-upload-input", type: "file", accept: "image/jpeg,image/png,image/webp", style: { display: 'none' }, onChange: handlePhotoSelect, disabled: uploadingPhoto })] })] }), _jsxs("div", { style: { flex: 1 }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }, children: [_jsx("h2", { className: "section-title", style: { fontSize: '1.6rem' }, children: fullName || 'Student Name' }), _jsx(Badge, { variant: "primary", children: "Role: student" })] }), _jsxs("div", { style: { display: 'flex', flexWrap: 'wrap', gap: '1.25rem', color: 'var(--text-muted)', fontSize: '0.9rem' }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '0.35rem' }, children: [_jsx(Mail, { size: 15 }), _jsx("span", { children: profile?.email })] }), college && (_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '0.35rem' }, children: [_jsx(GraduationCap, { size: 15 }), _jsxs("span", { children: [college, " ", graduationYear ? `(Batch '${graduationYear.slice(-2)})` : ''] })] }))] })] })] }) }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))', gap: '1.5rem' }, children: [_jsxs(Card, { children: [_jsx("div", { className: "arena-card-header", children: _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '0.5rem' }, children: [_jsx(User, { size: 18, style: { color: 'var(--primary)' } }), _jsx("h3", { className: "card-title", children: "Personal Information" })] }) }), _jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: '1rem' }, children: [_jsxs("div", { children: [_jsx("label", { style: { display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.3rem', color: 'var(--text-muted)' }, children: "Full Name *" }), isEditing ? (_jsx("input", { type: "text", value: fullName, onChange: (e) => setFullName(e.target.value), style: {
                                                    width: '100%',
                                                    padding: '0.65rem 0.85rem',
                                                    borderRadius: 'var(--radius-md)',
                                                    background: 'var(--bg-input)',
                                                    border: '1px solid var(--border-color)',
                                                    color: 'var(--text-main)',
                                                } })) : (_jsx("div", { style: { fontSize: '0.95rem', fontWeight: 500 }, children: fullName || 'Not provided' }))] }), _jsxs("div", { children: [_jsx("label", { style: { display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.3rem', color: 'var(--text-muted)' }, children: "Email Address (Read-only)" }), _jsx("div", { style: { fontSize: '0.95rem', color: 'var(--text-muted)' }, children: profile?.email })] }), _jsxs("div", { children: [_jsx("label", { style: { display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.3rem', color: 'var(--text-muted)' }, children: "Phone Number" }), isEditing ? (_jsx("input", { type: "text", placeholder: "+91 9876543210", value: phone, onChange: (e) => setPhone(e.target.value), style: {
                                                    width: '100%',
                                                    padding: '0.65rem 0.85rem',
                                                    borderRadius: 'var(--radius-md)',
                                                    background: 'var(--bg-input)',
                                                    border: '1px solid var(--border-color)',
                                                    color: 'var(--text-main)',
                                                } })) : (_jsx("div", { style: { fontSize: '0.95rem', fontWeight: 500 }, children: phone || 'Not provided' }))] }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }, children: [_jsxs("div", { children: [_jsx("label", { style: { display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.3rem', color: 'var(--text-muted)' }, children: "Date of Birth" }), isEditing ? (_jsx("input", { type: "date", value: dateOfBirth, onChange: (e) => setDateOfBirth(e.target.value), style: {
                                                            width: '100%',
                                                            padding: '0.65rem 0.85rem',
                                                            borderRadius: 'var(--radius-md)',
                                                            background: 'var(--bg-input)',
                                                            border: '1px solid var(--border-color)',
                                                            color: 'var(--text-main)',
                                                        } })) : (_jsx("div", { style: { fontSize: '0.95rem', fontWeight: 500 }, children: dateOfBirth || 'Not provided' }))] }), _jsxs("div", { children: [_jsx("label", { style: { display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.3rem', color: 'var(--text-muted)' }, children: "Gender" }), isEditing ? (_jsxs("select", { value: gender, onChange: (e) => setGender(e.target.value), style: {
                                                            width: '100%',
                                                            padding: '0.65rem 0.85rem',
                                                            borderRadius: 'var(--radius-md)',
                                                            background: 'var(--bg-input)',
                                                            border: '1px solid var(--border-color)',
                                                            color: 'var(--text-main)',
                                                        }, children: [_jsx("option", { value: "", children: "Select Gender" }), _jsx("option", { value: "Male", children: "Male" }), _jsx("option", { value: "Female", children: "Female" }), _jsx("option", { value: "Other", children: "Other" }), _jsx("option", { value: "Prefer not to say", children: "Prefer not to say" })] })) : (_jsx("div", { style: { fontSize: '0.95rem', fontWeight: 500 }, children: gender || 'Not provided' }))] })] })] })] }), _jsxs(Card, { children: [_jsx("div", { className: "arena-card-header", children: _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '0.5rem' }, children: [_jsx(GraduationCap, { size: 18, style: { color: 'var(--secondary)' } }), _jsx("h3", { className: "card-title", children: "Academic Information" })] }) }), _jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: '1rem' }, children: [_jsxs("div", { children: [_jsx("label", { style: { display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.3rem', color: 'var(--text-muted)' }, children: "College / University" }), isEditing ? (_jsx("input", { type: "text", placeholder: "e.g. ABC Engineering College", value: college, onChange: (e) => setCollege(e.target.value), style: {
                                                    width: '100%',
                                                    padding: '0.65rem 0.85rem',
                                                    borderRadius: 'var(--radius-md)',
                                                    background: 'var(--bg-input)',
                                                    border: '1px solid var(--border-color)',
                                                    color: 'var(--text-main)',
                                                } })) : (_jsx("div", { style: { fontSize: '0.95rem', fontWeight: 500 }, children: college || 'Not provided' }))] }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }, children: [_jsxs("div", { children: [_jsx("label", { style: { display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.3rem', color: 'var(--text-muted)' }, children: "Degree" }), isEditing ? (_jsx("input", { type: "text", placeholder: "e.g. B.Tech / B.E.", value: degree, onChange: (e) => setDegree(e.target.value), style: {
                                                            width: '100%',
                                                            padding: '0.65rem 0.85rem',
                                                            borderRadius: 'var(--radius-md)',
                                                            background: 'var(--bg-input)',
                                                            border: '1px solid var(--border-color)',
                                                            color: 'var(--text-main)',
                                                        } })) : (_jsx("div", { style: { fontSize: '0.95rem', fontWeight: 500 }, children: degree || 'Not provided' }))] }), _jsxs("div", { children: [_jsx("label", { style: { display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.3rem', color: 'var(--text-muted)' }, children: "Graduation Year" }), isEditing ? (_jsxs("select", { value: graduationYear, onChange: (e) => setGraduationYear(e.target.value), style: {
                                                            width: '100%',
                                                            padding: '0.65rem 0.85rem',
                                                            borderRadius: 'var(--radius-md)',
                                                            background: 'var(--bg-input)',
                                                            border: '1px solid var(--border-color)',
                                                            color: 'var(--text-main)',
                                                        }, children: [_jsx("option", { value: "", children: "Select Year" }), GRADUATION_YEARS.map((y) => (_jsx("option", { value: y, children: y }, y)))] })) : (_jsx("div", { style: { fontSize: '0.95rem', fontWeight: 500 }, children: graduationYear || 'Not provided' }))] })] }), _jsxs("div", { children: [_jsx("label", { style: { display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.3rem', color: 'var(--text-muted)' }, children: "Branch / Department" }), isEditing ? (_jsx("input", { type: "text", placeholder: "e.g. Computer Science & Engineering", value: branch, onChange: (e) => setBranch(e.target.value), style: {
                                                    width: '100%',
                                                    padding: '0.65rem 0.85rem',
                                                    borderRadius: 'var(--radius-md)',
                                                    background: 'var(--bg-input)',
                                                    border: '1px solid var(--border-color)',
                                                    color: 'var(--text-main)',
                                                } })) : (_jsx("div", { style: { fontSize: '0.95rem', fontWeight: 500 }, children: branch || 'Not provided' }))] })] })] }), _jsxs(Card, { style: { gridColumn: 'span 1' }, children: [_jsx("div", { className: "arena-card-header", children: _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '0.5rem' }, children: [_jsx(Brain, { size: 18, style: { color: 'var(--warning)' } }), _jsx("h3", { className: "card-title", children: "Technical Skills & Concepts" })] }) }), isEditing ? (_jsx(TagInput, { tags: skills, onChange: setSkills, placeholder: "Add skill (e.g. React, Data Structures)...", suggestions: SUGGESTED_SKILLS, variant: "primary" })) : (_jsx("div", { style: { display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }, children: skills.length > 0 ? (skills.map((s, i) => (_jsx(Badge, { variant: "primary", children: s }, i)))) : (_jsx("span", { style: { fontSize: '0.9rem', color: 'var(--text-dim)', fontStyle: 'italic' }, children: "No skills specified yet." })) }))] }), _jsxs(Card, { style: { gridColumn: 'span 1' }, children: [_jsx("div", { className: "arena-card-header", children: _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '0.5rem' }, children: [_jsx(Code2, { size: 18, style: { color: 'var(--success)' } }), _jsx("h3", { className: "card-title", children: "Programming Languages" })] }) }), isEditing ? (_jsx(TagInput, { tags: programmingLanguages, onChange: setProgrammingLanguages, placeholder: "Add language (e.g. Java, C++)...", suggestions: SUGGESTED_LANGUAGES, variant: "success" })) : (_jsx("div", { style: { display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }, children: programmingLanguages.length > 0 ? (programmingLanguages.map((l, i) => (_jsx(Badge, { variant: "success", children: l }, i)))) : (_jsx("span", { style: { fontSize: '0.9rem', color: 'var(--text-dim)', fontStyle: 'italic' }, children: "No programming languages specified yet." })) }))] })] }), _jsxs(Card, { style: { marginTop: '1.5rem' }, children: [_jsxs("div", { className: "arena-card-header", children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '0.5rem' }, children: [_jsx(BookOpen, { size: 18, style: { color: 'var(--primary)' } }), _jsx("h3", { className: "card-title", children: "About Me / Biography" })] }), isEditing && (_jsxs("span", { style: { fontSize: '0.78rem', color: bio.length > 500 ? 'var(--error)' : 'var(--text-dim)' }, children: [bio.length, " / 500 chars"] }))] }), isEditing ? (_jsx("textarea", { rows: 4, placeholder: "Tell us about your background, competitive learning goals, and placement interests...", value: bio, onChange: (e) => setBio(e.target.value), style: {
                            width: '100%',
                            padding: '0.85rem',
                            borderRadius: 'var(--radius-md)',
                            background: 'var(--bg-input)',
                            border: '1px solid var(--border-color)',
                            color: 'var(--text-main)',
                            fontSize: '0.95rem',
                            resize: 'vertical',
                            outline: 'none',
                        } })) : (_jsx("p", { style: { color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }, children: bio || 'No biography written yet.' }))] }), isEditing && (_jsxs("div", { style: { marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }, children: [_jsx(Button, { variant: "secondary", onClick: () => {
                            if (profile)
                                populateState(profile);
                            setIsEditing(false);
                        }, children: "Cancel" }), _jsx(Button, { variant: "primary", icon: _jsx(Save, { size: 16 }), loading: saving, onClick: handleSave, children: "Save Changes" })] }))] }));
};
//# sourceMappingURL=ProfilePage.js.map