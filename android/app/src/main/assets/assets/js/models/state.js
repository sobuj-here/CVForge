/**
 * CVForge - Reactive State Manager (Enhanced)
 * Handles clean profile defaults, undo/redo history, localStorage persistence,
 * demo data separation, multi-profile switching, and optional section toggles.
 */

import { SAMPLE_PROFILES } from './sampleData.js';

const STORAGE_KEY = 'cvforge_active_profile_v3';
const PROFILES_LIST_KEY = 'cvforge_saved_profiles_v3';
const MAX_HISTORY = 50;

export class StateManager {
  constructor() {
    this.history = [];
    this.future = [];
    this.listeners = new Set();
    this.saveTimeout = null;
    this.lastSaved = null;

    this.profile = this.loadInitialProfile();
    this.ensureStructure(this.profile);
    this.saveHistory();
  }

  /**
   * Returns a clean, professional blank starter profile.
   * Eliminates misleading pre-filled fake qualifications!
   */
  getDefaultProfile() {
    return {
      id: `prof_${Date.now()}`,
      name: 'My Professional CV',
      targetRole: '',
      targetCompany: '',
      country: 'US',
      format: 'reverse-chronological',
      isDemo: false, // Explicit separation between Demo and Real Data
      isFreshGraduate: false,
      referencesAvailableUponRequest: false,
      settings: {
        theme: 'soft-blue', // 'minimal-white' | 'soft-blue' | 'soft-lavender' | 'warm-beige' | 'light-gray' | 'professional-navy' | 'modern-pastel'
        paperSize: 'letter',
        fontFamily: 'Inter',
        fontSizes: {
          name: 24,       // pt (candidate legal name)
          headings: 13,   // pt (section titles)
          body: 10,       // pt (experience bullets, body text)
          contact: 9.5    // pt (contact line & meta dates)
        },
        marginsCustom: {
          top: 15,        // mm
          bottom: 15,     // mm
          left: 15,       // mm
          right: 15       // mm
        },
        fontSize: 'normal', // legacy fallback
        primaryColor: '#1d4ed8',
        accentColor: '#3b82f6',
        spacing: 'normal',
        margins: 'normal',
        showPhoto: false,
        photoSize: 'medium', // 'small' | 'medium' | 'large'
        photoShape: 'circle', // 'circle' | 'square'
        dateFormat: 'Month YYYY'
      },
      enabledSections: {
        summary: true,
        experience: true,
        education: true,
        skills: true,
        projects: true,
        certifications: true,
        languages: true,
        internships: false,
        research: false,
        publications: false,
        achievements: false,
        volunteer: false,
        memberships: false,
        references: true,
        custom: false
      },
      personal: {
        fullName: '',
        headline: '',
        summary: '',
        objective: '',
        strengths: '',
        email: '',
        phone: '',
        location: '',
        nationality: '',
        linkedin: '',
        github: '',
        portfolio: '',
        photoUrl: '',
        dateOfBirth: '',
        drivingLicense: '',
        fatherName: '',
        motherName: '',
        permanentAddress: '',
        religion: '',
        maritalStatus: '',
        gender: ''
      },
      education: [],
      experience: [],
      internships: [],
      researchExperience: [],
      skills: [], // Unified single Skills list: [{ id, name, level }]
      functionalAreas: [],
      projects: [],
      certifications: [],
      languages: [],
      achievements: [],
      volunteer: [],
      publications: [],
      memberships: [],
      academic: {
        researchInterests: [],
        teachingExperience: [],
        grants: [],
        conferences: [],
        memberships: []
      },
      references: [],
      customSections: []
    };
  }

  loadInitialProfile() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.personal && parsed.format) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not load profile from localStorage:', e);
    }
    // Brand new visitor starts with clean blank profile (NOT fake Amazon data)
    return this.getDefaultProfile();
  }

  ensureStructure(p) {
    if (!p) return;
    if (!p.settings) p.settings = {};
    if (!p.settings.theme) p.settings.theme = 'soft-blue';
    if (!p.settings.paperSize) p.settings.paperSize = 'letter';
    if (!p.settings.fontFamily) p.settings.fontFamily = 'Inter';
    if (!p.settings.fontSize) p.settings.fontSize = 'normal';
    if (!p.settings.primaryColor) p.settings.primaryColor = '#1d4ed8';
    if (!p.settings.accentColor) p.settings.accentColor = '#3b82f6';
    if (!p.settings.spacing) p.settings.spacing = 'normal';
    if (!p.settings.margins) p.settings.margins = 'normal';
    if (typeof p.settings.showPhoto === 'undefined') p.settings.showPhoto = false;
    if (!p.settings.photoSize) p.settings.photoSize = 'medium';
    if (!p.settings.photoShape) p.settings.photoShape = 'circle';
    if (!p.settings.fontSizes) {
      p.settings.fontSizes = { name: 24, headings: 13, body: 10, contact: 9.5 };
    }
    if (!p.settings.marginsCustom) {
      p.settings.marginsCustom = { top: 15, bottom: 15, left: 15, right: 15 };
    }
    if (typeof p.isDemo === 'undefined') p.isDemo = false;
    if (typeof p.isFreshGraduate === 'undefined') p.isFreshGraduate = false;
    if (typeof p.referencesAvailableUponRequest === 'undefined') p.referencesAvailableUponRequest = false;

    if (!p.enabledSections) {
      p.enabledSections = {
        summary: true,
        experience: true,
        education: true,
        skills: true,
        projects: true,
        certifications: true,
        languages: true,
        internships: (p.internships || []).length > 0,
        research: (p.researchExperience || []).length > 0,
        publications: (p.publications || []).length > 0,
        achievements: (p.achievements || []).length > 0,
        volunteer: (p.volunteer || []).length > 0,
        memberships: (p.memberships || []).length > 0,
        references: true,
        custom: (p.customSections || []).length > 0
      };
    }

    if (!p.personal) p.personal = {};
    if (typeof p.personal.fatherName === 'undefined') p.personal.fatherName = '';
    if (typeof p.personal.motherName === 'undefined') p.personal.motherName = '';
    if (typeof p.personal.permanentAddress === 'undefined') p.personal.permanentAddress = '';
    if (typeof p.personal.religion === 'undefined') p.personal.religion = '';
    if (typeof p.personal.maritalStatus === 'undefined') p.personal.maritalStatus = '';
    if (typeof p.personal.gender === 'undefined') p.personal.gender = '';
    if (!p.settings.fontStyle) p.settings.fontStyle = 'regular';
    if (!p.settings.fontTarget) p.settings.fontTarget = 'all';
    if (!Array.isArray(p.education)) p.education = [];
    if (!Array.isArray(p.experience)) p.experience = [];
    if (!Array.isArray(p.internships)) p.internships = [];
    if (!Array.isArray(p.researchExperience)) p.researchExperience = [];
    
    // Unified Skills Migration & Structure
    if (p.skills && !Array.isArray(p.skills)) {
      const legacy = p.skills;
      const unified = [];
      const seen = new Set();
      const addMigrated = (name, level = '') => {
        const clean = (name || '').trim();
        if (!clean) return;
        const lower = clean.toLowerCase();
        if (!seen.has(lower)) {
          seen.add(lower);
          unified.push({
            id: `sk_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
            name: clean,
            level: level || ''
          });
        }
      };

      (legacy.technical || []).forEach(s => addMigrated(s?.name, s?.level));
      (legacy.tools || []).forEach(t => addMigrated(typeof t === 'string' ? t : t?.name, t?.level));
      (legacy.programming || []).forEach(s => addMigrated(s?.name, s?.level));
      (legacy.dataAnalysis || []).forEach(s => addMigrated(s?.name, s?.level));
      (legacy.professional || legacy.soft || []).forEach(s => addMigrated(s?.name, s?.level));
      (legacy.communication || []).forEach(s => addMigrated(s?.name, s?.level));
      (legacy.industry || []).forEach(s => addMigrated(typeof s === 'string' ? s : s?.name, s?.level));

      p.skills = unified;
    } else if (!Array.isArray(p.skills)) {
      p.skills = [];
    } else {
      // Validate array elements
      p.skills = p.skills.map((s, idx) => {
        if (typeof s === 'string') {
          return { id: `sk_${idx}_${Date.now()}`, name: s.trim(), level: '' };
        }
        return {
          id: s.id || `sk_${idx}_${Date.now()}`,
          name: (s.name || '').trim(),
          level: (s.level || '').trim()
        };
      }).filter(s => s.name);
    }

    // Attach non-enumerable backward-compatibility getters to prevent breaking legacy code
    try {
      if (!p.skills.technical) {
        Object.defineProperty(p.skills, 'technical', {
          get() { return this; },
          configurable: true,
          enumerable: false
        });
      }
      if (!p.skills.tools) {
        Object.defineProperty(p.skills, 'tools', {
          get() { return this.map(s => s.name); },
          configurable: true,
          enumerable: false
        });
      }
    } catch {}

    if (!Array.isArray(p.functionalAreas)) p.functionalAreas = [];
    if (!Array.isArray(p.projects)) p.projects = [];
    if (!Array.isArray(p.certifications)) p.certifications = [];
    if (!Array.isArray(p.languages)) p.languages = [];
    if (!Array.isArray(p.achievements)) p.achievements = [];
    if (!Array.isArray(p.volunteer)) p.volunteer = [];
    if (!Array.isArray(p.publications)) p.publications = [];
    if (!Array.isArray(p.memberships)) p.memberships = [];
    if (!p.academic) p.academic = { researchInterests: [], teachingExperience: [], grants: [], conferences: [], memberships: [] };
    if (!Array.isArray(p.references)) p.references = [];
    if (!Array.isArray(p.customSections)) p.customSections = [];
  }

  getProfile() {
    return this.profile;
  }

  setProfile(newProfile, pushHistory = true) {
    this.ensureStructure(newProfile);
    if (pushHistory) {
      this.saveHistory();
    }
    this.profile = JSON.parse(JSON.stringify(newProfile));
    this.future = [];
    this.scheduleSave();
    this.notify('profile');
  }

  updatePersonalField(field, value, pushHistory = false) {
    if (pushHistory) this.saveHistory();
    this.profile.personal[field] = value;
    this.profile.isDemo = false; // Editing makes it real user data!
    this.scheduleSave();
    this.notify('personal');
  }

  updateSetting(key, value) {
    this.profile.settings[key] = value;
    this.scheduleSave();
    this.notify('settings');
  }

  setTheme(themeId) {
    this.saveHistory();
    this.profile.settings.theme = themeId;
    const themePresets = {
      'minimal-white': { primaryColor: '#0f172a', accentColor: '#475569' },
      'soft-blue': { primaryColor: '#1d4ed8', accentColor: '#3b82f6' },
      'soft-lavender': { primaryColor: '#6366f1', accentColor: '#8b5cf6' },
      'warm-beige': { primaryColor: '#78350f', accentColor: '#b45309' },
      'light-gray': { primaryColor: '#334155', accentColor: '#64748b' },
      'professional-navy': { primaryColor: '#1e3a8a', accentColor: '#2563eb' },
      'modern-pastel': { primaryColor: '#0f766e', accentColor: '#059669' }
    };
    if (themePresets[themeId]) {
      this.profile.settings.primaryColor = themePresets[themeId].primaryColor;
      this.profile.settings.accentColor = themePresets[themeId].accentColor;
    }
    this.scheduleSave();
    this.notify('settings');
  }

  toggleSectionEnabled(sectionName, isEnabled) {
    this.saveHistory();
    this.profile.enabledSections[sectionName] = !!isEnabled;
    this.scheduleSave();
    this.notify('sections');
  }

  setFormat(formatId) {
    this.saveHistory();
    this.profile.format = formatId;
    this.scheduleSave();
    this.notify('format');
  }

  setCountry(countryCode) {
    this.saveHistory();
    this.profile.country = countryCode;
    if (countryCode === 'US' || countryCode === 'CA') {
      this.profile.settings.paperSize = 'letter';
      this.profile.settings.showPhoto = false;
    } else if (countryCode === 'UK') {
      this.profile.settings.paperSize = 'a4';
      this.profile.settings.showPhoto = false;
    } else if (countryCode === 'DE' || countryCode === 'EU') {
      this.profile.settings.paperSize = 'a4';
    } else if (countryCode === 'BD') {
      this.profile.settings.paperSize = 'a4';
      this.profile.settings.showPhoto = true;
      this.profile.settings.dateFormat = 'DD/MM/YYYY';
    }
    this.scheduleSave();
    this.notify('country');
  }

  setFontStyle(style) {
    this.saveHistory();
    this.profile.settings.fontStyle = style || 'regular';
    this.scheduleSave();
    this.notify('settings');
  }

  setFontTarget(target) {
    this.saveHistory();
    this.profile.settings.fontTarget = target || 'all';
    this.scheduleSave();
    this.notify('settings');
  }

  setFontSizes(fontSizesObj) {
    this.saveHistory();
    if (!this.profile.settings.fontSizes) {
      this.profile.settings.fontSizes = { name: 24, headings: 13, body: 10, contact: 9.5 };
    }
    if (fontSizesObj) {
      if (typeof fontSizesObj.name === 'number' && fontSizesObj.name >= 14 && fontSizesObj.name <= 48) {
        this.profile.settings.fontSizes.name = Number(fontSizesObj.name);
      }
      if (typeof fontSizesObj.headings === 'number' && fontSizesObj.headings >= 9 && fontSizesObj.headings <= 24) {
        this.profile.settings.fontSizes.headings = Number(fontSizesObj.headings);
      }
      if (typeof fontSizesObj.body === 'number' && fontSizesObj.body >= 7 && fontSizesObj.body <= 16) {
        this.profile.settings.fontSizes.body = Number(fontSizesObj.body);
      }
      if (typeof fontSizesObj.contact === 'number' && fontSizesObj.contact >= 7 && fontSizesObj.contact <= 14) {
        this.profile.settings.fontSizes.contact = Number(fontSizesObj.contact);
      }
    }
    this.scheduleSave();
    this.notify('settings');
  }

  resetFontSizes() {
    this.saveHistory();
    this.profile.settings.fontSizes = { name: 24, headings: 13, body: 10, contact: 9.5 };
    this.scheduleSave();
    this.notify('settings');
  }

  setMarginsCustom(marginsObj) {
    this.saveHistory();
    if (!this.profile.settings.marginsCustom) {
      this.profile.settings.marginsCustom = { top: 15, bottom: 15, left: 15, right: 15 };
    }
    const clamp = (val, min, max, def) => {
      const n = Number(val);
      return (!isNaN(n) && n >= min && n <= max) ? n : def;
    };
    if (marginsObj) {
      this.profile.settings.marginsCustom.top = clamp(marginsObj.top, 5, 50, 15);
      this.profile.settings.marginsCustom.bottom = clamp(marginsObj.bottom, 5, 50, 15);
      this.profile.settings.marginsCustom.left = clamp(marginsObj.left, 5, 50, 15);
      this.profile.settings.marginsCustom.right = clamp(marginsObj.right, 5, 50, 15);
    }
    this.scheduleSave();
    this.notify('settings');
  }

  resetMarginsCustom() {
    this.saveHistory();
    this.profile.settings.marginsCustom = { top: 15, bottom: 15, left: 15, right: 15 };
    this.scheduleSave();
    this.notify('settings');
  }

  setFreshGraduate(isFresh) {
    this.saveHistory();
    this.profile.isFreshGraduate = !!isFresh;
    this.scheduleSave();
    this.notify('profile');
  }

  setReferencesAvailableUponRequest(val) {
    this.saveHistory();
    this.profile.referencesAvailableUponRequest = !!val;
    this.scheduleSave();
    this.notify('profile');
  }

  // --- Array Item Operations (Add, Edit, Delete, Reorder) ---
  addItem(sectionKey, item) {
    this.saveHistory();
    if (!Array.isArray(this.profile[sectionKey])) {
      this.profile[sectionKey] = [];
    }
    item.id = item.id || `item_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    this.profile[sectionKey].push(item);
    this.profile.isDemo = false;
    this.scheduleSave();
    this.notify(sectionKey);
    return item.id;
  }

  updateItem(sectionKey, itemId, updatedFields) {
    const arr = this.profile[sectionKey];
    if (Array.isArray(arr)) {
      const idx = arr.findIndex(x => x.id === itemId);
      if (idx !== -1) {
        arr[idx] = { ...arr[idx], ...updatedFields };
        this.profile.isDemo = false;
        this.scheduleSave();
        this.notify(sectionKey);
      }
    }
  }

  deleteItem(sectionKey, itemId) {
    this.saveHistory();
    const arr = this.profile[sectionKey];
    if (Array.isArray(arr)) {
      this.profile[sectionKey] = arr.filter(x => x.id !== itemId);
      this.scheduleSave();
      this.notify(sectionKey);
    }
  }

  moveItem(sectionKey, fromIndex, toIndex) {
    const arr = this.profile[sectionKey];
    if (!Array.isArray(arr) || fromIndex < 0 || toIndex < 0 || fromIndex >= arr.length || toIndex >= arr.length) return;
    this.saveHistory();
    const [moved] = arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, moved);
    this.scheduleSave();
    this.notify(sectionKey);
  }

  // --- Skills Manager (Unified Single Category: Skills) ---
  addSkill(param1, param2) {
    this.saveHistory();
    if (!Array.isArray(this.profile.skills)) {
      this.profile.skills = [];
    }
    // Handle both addSkill(skillItem) and legacy addSkill(categoryKey, skillItem)
    const skillItem = (param2 && typeof param2 === 'object')
      ? param2
      : (typeof param1 === 'object' && param1 ? param1 : { name: typeof param1 === 'string' ? param1 : '', level: '' });
    
    const item = {
      id: skillItem.id || `sk_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      name: (skillItem.name || '').trim(),
      level: (skillItem.level || '').trim()
    };
    this.profile.skills.push(item);
    this.profile.isDemo = false;
    this.scheduleSave();
    this.notify('skills');
    return item;
  }

  updateSkill(id, updates) {
    if (!Array.isArray(this.profile.skills)) return;
    const target = this.profile.skills.find(s => s.id === id);
    if (target) {
      if (updates.name !== undefined) target.name = updates.name;
      if (updates.level !== undefined) target.level = updates.level;
      this.profile.isDemo = false;
      this.scheduleSave();
      this.notify('skills');
    }
  }

  deleteSkill(param1, param2) {
    this.saveHistory();
    const targetId = param2 || param1;
    if (Array.isArray(this.profile.skills)) {
      this.profile.skills = this.profile.skills.filter(s => s.id !== targetId);
    }
    this.scheduleSave();
    this.notify('skills');
  }

  moveSkill(fromIndex, toIndex) {
    if (!Array.isArray(this.profile.skills)) return;
    if (fromIndex < 0 || fromIndex >= this.profile.skills.length) return;
    if (toIndex < 0 || toIndex >= this.profile.skills.length) return;
    this.saveHistory();
    const [moved] = this.profile.skills.splice(fromIndex, 1);
    this.profile.skills.splice(toIndex, 0, moved);
    this.scheduleSave();
    this.notify('skills');
  }

  // --- Undo & Redo System ---
  saveHistory() {
    const snapshot = JSON.stringify(this.profile);
    if (this.history.length > 0 && this.history[this.history.length - 1] === snapshot) {
      return;
    }
    this.history.push(snapshot);
    if (this.history.length > MAX_HISTORY) {
      this.history.shift();
    }
  }

  canUndo() {
    return this.history.length > 0;
  }

  canRedo() {
    return this.future.length > 0;
  }

  undo() {
    if (!this.canUndo()) return;
    const currentSnapshot = JSON.stringify(this.profile);
    this.future.push(currentSnapshot);
    const prevSnapshot = this.history.pop();
    this.profile = JSON.parse(prevSnapshot);
    this.ensureStructure(this.profile);
    this.scheduleSave();
    this.notify('undo');
  }

  redo() {
    if (!this.canRedo()) return;
    const currentSnapshot = JSON.stringify(this.profile);
    this.history.push(currentSnapshot);
    const nextSnapshot = this.future.pop();
    this.profile = JSON.parse(nextSnapshot);
    this.ensureStructure(this.profile);
    this.scheduleSave();
    this.notify('redo');
  }

  // --- Auto-Save ---
  scheduleSave() {
    clearTimeout(this.saveTimeout);
    this.saveTimeout = setTimeout(() => {
      this.saveNow();
    }, 400);
  }

  saveNow() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.profile));
      this.lastSaved = new Date();
      this.notify('saved');
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }

  // --- Load Demo CV ---
  loadDemoProfile(sampleKey = 'senior_engineer') {
    this.saveHistory();
    if (SAMPLE_PROFILES[sampleKey]) {
      const demo = JSON.parse(JSON.stringify(SAMPLE_PROFILES[sampleKey]));
      demo.isDemo = true; // Mark explicitly as demonstration data!
      this.setProfile(demo);
    }
  }

  loadSample(sampleKey) {
    this.loadDemoProfile(sampleKey);
  }

  // --- Multi-Profile Management ---
  getSavedProfilesList() {
    try {
      const list = localStorage.getItem(PROFILES_LIST_KEY);
      return list ? JSON.parse(list) : [];
    } catch {
      return [];
    }
  }

  saveCurrentProfileAs(profileName) {
    const list = this.getSavedProfilesList();
    const id = `profile_${Date.now()}`;
    const clone = JSON.parse(JSON.stringify(this.profile));
    clone.id = id;
    clone.name = profileName || clone.name || 'Untitled Profile';

    list.push({
      id: clone.id,
      name: clone.name,
      targetRole: clone.targetRole || clone.personal?.headline || '',
      updatedAt: new Date().toISOString()
    });

    localStorage.setItem(PROFILES_LIST_KEY, JSON.stringify(list));
    localStorage.setItem(`cvforge_profile_data_${id}`, JSON.stringify(clone));
    this.notify('profilesList');
    return id;
  }

  loadSavedProfile(id) {
    try {
      const stored = localStorage.getItem(`cvforge_profile_data_${id}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.setProfile(parsed);
      }
    } catch (e) {
      console.error('Could not load profile:', e);
    }
  }

  deleteSavedProfile(id) {
    let list = this.getSavedProfilesList();
    list = list.filter(p => p.id !== id);
    localStorage.setItem(PROFILES_LIST_KEY, JSON.stringify(list));
    localStorage.removeItem(`cvforge_profile_data_${id}`);
    this.notify('profilesList');
  }

  resetSection(sectionKey) {
    this.saveHistory();
    switch (sectionKey) {
      case 'personal':
        this.profile.personal = {
          fullName: '', headline: '', summary: '', objective: '', strengths: '',
          email: '', phone: '', location: '', nationality: '', linkedin: '', github: '',
          portfolio: '', photoUrl: '', dateOfBirth: '', drivingLicense: '',
          fatherName: '', motherName: '', permanentAddress: '', religion: '', maritalStatus: '', gender: ''
        };
        break;
      case 'summary':
        if (this.profile.personal) {
          this.profile.personal.summary = '';
          this.profile.personal.objective = '';
          this.profile.personal.strengths = '';
        }
        break;
      case 'experience':
        this.profile.experience = [];
        this.profile.isFreshGraduate = false;
        break;
      case 'education':
        this.profile.education = [];
        break;
      case 'skills':
        this.profile.skills = [];
        this.profile.functionalAreas = [];
        break;
      case 'projects':
        this.profile.projects = [];
        break;
      case 'certifications':
        this.profile.certifications = [];
        break;
      case 'languages':
        this.profile.languages = [];
        break;
      case 'references':
        this.profile.references = [];
        this.profile.referencesAvailableUponRequest = false;
        break;
      case 'internships':
        this.profile.internships = [];
        break;
      case 'research':
      case 'researchExperience':
        this.profile.researchExperience = [];
        break;
      case 'publications':
        this.profile.publications = [];
        break;
      case 'achievements':
        this.profile.achievements = [];
        break;
      case 'volunteer':
        this.profile.volunteer = [];
        break;
      case 'memberships':
        this.profile.memberships = [];
        break;
      case 'academic':
        this.profile.academic = { researchInterests: [], teachingExperience: [], grants: [], conferences: [], memberships: [] };
        break;
      case 'custom':
      case 'customSections':
        this.profile.customSections = [];
        break;
      default:
        if (Array.isArray(this.profile[sectionKey])) {
          this.profile[sectionKey] = [];
        }
    }
    this.scheduleSave();
    this.notify(sectionKey);
  }

  clearAllCandidateData(keepSettings = true) {
    this.saveHistory();
    const currentSettings = keepSettings ? JSON.parse(JSON.stringify(this.profile.settings || {})) : null;
    const currentFormat = keepSettings ? this.profile.format : 'reverse-chronological';
    const currentCountry = keepSettings ? this.profile.country : 'US';

    const clean = this.getDefaultProfile();
    if (keepSettings && currentSettings) {
      clean.settings = currentSettings;
      clean.format = currentFormat;
      clean.country = currentCountry;
    }
    clean.isDemo = false;
    this.profile = clean;
    this.scheduleSave();
    this.notify('reset');
  }

  startNewCV(title = 'My Professional CV') {
    this.saveHistory();
    const clean = this.getDefaultProfile();
    clean.name = title;
    this.profile = clean;
    this.scheduleSave();
    this.notify('reset');
  }

  resetToBlank() {
    this.clearAllCandidateData(true);
  }

  clearAllData() {
    localStorage.clear();
    this.profile = this.getDefaultProfile();
    this.history = [];
    this.future = [];
    this.scheduleSave();
    this.notify('reset');
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notify(event) {
    for (const listener of this.listeners) {
      try {
        listener(event, this.profile);
      } catch (e) {
        console.error('Error in state listener:', e);
      }
    }
  }
}

export const appState = new StateManager();
