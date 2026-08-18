/**
 * server/models/Organization.js
 *
 * One document = one organization for one specific GSoC year.
 *
 * Collection: gsoc_orgs
 *
 * Example documents:
 *   { gsocId: "apache", year: 2024, name: "Apache", projects: [...] }
 *   { gsocId: "apache", year: 2025, name: "Apache", projects: [...] }
 *
 * Unique index on (gsocId, year) prevents duplicates across syncs.
 */

import mongoose from 'mongoose'

const { Schema } = mongoose

// ─── Project sub-schema ───────────────────────────────────────────────────────
const ProjectSchema = new Schema(
  {
    title:           { type: String, default: '' },
    description:     { type: String, default: '' },
    shortDescription:{ type: String, default: '' },
    projectUrl:      { type: String, default: '' },
    codeUrl:         { type: String, default: '' },
    studentName:     { type: String, default: '' },
    studentUsername: { type: String, default: '' },
    mentors:         [{ type: String }],
    status:          { type: String, default: '' },
  },
  { _id: false }
)

// ─── Main schema — one doc per (org, year) ────────────────────────────────────
const OrgYearSchema = new Schema(
  {
    // ── Identity ──────────────────────────────────────────────────────────────
    gsocId: {
      type:     String,
      required: true,
      trim:     true,
      index:    true,
    },
    year: {
      type:     Number,
      required: true,
      index:    true,
    },

    // ── Organization info (same for all years of this org) ────────────────────
    name:             { type: String, required: true, trim: true, index: true },
    slug:             { type: String, trim: true, index: true },
    description:      { type: String, default: '' },
    descriptionShort: { type: String, default: '' },
    website:          { type: String, default: '' },
    contactEmail:     { type: String, default: '' },
    mailingList:      { type: String, default: '' },
    blogUrl:          { type: String, default: '' },
    twitterUrl:       { type: String, default: '' },
    githubUrl:        { type: String, default: '' },
    logoUrl:          { type: String, default: '' },
    imageUrl:         { type: String, default: '' },
    imageBackgroundColor: { type: String, default: '' },
    category:         { type: String, default: '', index: true },
    topics:           [{ type: String }],
    technologies:     [{ type: String }],
    ideas:            { type: String, default: '' },

    // ── Year-specific data ────────────────────────────────────────────────────
    numProjects:  { type: Number, default: 0 },
    projectsUrl:  { type: String, default: '' },
    projects:     [ProjectSchema],

    // ── Sync metadata ─────────────────────────────────────────────────────────
    lastSyncedAt: { type: Date, default: null },
  },
  {
    timestamps:  true,
    collection:  'gsoc_orgs',
  }
)

// ── Unique compound index — prevents duplicate (org, year) documents ───────────
OrgYearSchema.index({ gsocId: 1, year: 1 }, { unique: true, name: 'unique_org_year' })

// ── Indexes for filtering / searching ─────────────────────────────────────────
OrgYearSchema.index({ year: 1, category: 1 })
OrgYearSchema.index({ technologies: 1 })
OrgYearSchema.index({ topics: 1 })
OrgYearSchema.index({ name: 'text', description: 'text', technologies: 'text', topics: 'text' },
  { name: 'org_text_search' })

export default mongoose.model('OrgYear', OrgYearSchema)
