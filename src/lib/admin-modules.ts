/**
 * Admin Module Template Generator
 * 
 * This file defines shared types and utility functions for creating consistent
 * admin CRUD pages across all 27 tables.
 */

// =============================================
// DB TABLE → ADMIN MODULE CONFIGURATION MAP
// =============================================
export interface AdminModule {
  table: string;          // DB table name (in cag_new schema)
  title: string;          // Page title
  addTitle: string;       // Add form title
  searchColumn: string;   // Column to search on
  columns: {             // List view columns
    key: string;
    label: string;
    type?: 'text' | 'badge' | 'date' | 'image' | 'link' | 'boolean';
  }[];
  formFields: {          // Add/Edit form fields
    name: string;
    label: string;
    type: 'text' | 'textarea' | 'richtext' | 'select' | 'date' | 'file' | 'image' | 'boolean' | 'number' | 'url' | 'password';
    required?: boolean;
    placeholder?: string;
    hint?: string;
    options?: { value: string; label: string }[];
    isHindi?: boolean;    // Hindi counterpart field
  }[];
}

// =============================================
// ALL ADMIN MODULE CONFIGS
// =============================================
export const ADMIN_MODULES: Record<string, AdminModule> = {
  'audit-reports': {
    table: 'audit_reports',
    title: 'Audit Reports',
    addTitle: 'Add Audit Report',
    searchColumn: 'title_en',
    columns: [
      { key: 'title_en', label: 'Title (EN)' },
      { key: 'year_of_report', label: 'Year' },
      { key: 'report_type', label: 'Report Type' },
      { key: 'sector', label: 'Sector' },
      { key: 'is_active', label: 'Status', type: 'boolean' },
      { key: 'created_at', label: 'Created', type: 'date' },
    ],
    formFields: [
      { name: 'title_en', label: 'Title (English)', type: 'text', required: true },
      { name: 'title_hi', label: 'Title (Hindi)', type: 'text', isHindi: true },
      { name: 'overview_en', label: 'Overview (English)', type: 'richtext' },
      { name: 'overview_hi', label: 'Overview (Hindi)', type: 'richtext', isHindi: true },
      { name: 'government_type_id', label: 'Government Type', type: 'select' },
      { name: 'state_id', label: 'State', type: 'select' },
      { name: 'report_type', label: 'Report Type', type: 'text' },
      { name: 'sector', label: 'Sector', type: 'text' },
      { name: 'year_of_report', label: 'Year of Report', type: 'number' },
      { name: 'date_tabled', label: 'Date Tabled in Parliament', type: 'date' },
      { name: 'main_report_file', label: 'Main Report File (PDF)', type: 'file' },
      { name: 'noody_book_file', label: 'Noody Book (PDF)', type: 'file' },
      { name: 'youtube_video_url', label: 'YouTube Video URL', type: 'url' },
      { name: 'digital_report_url', label: 'Digital Report URL', type: 'url' },
      { name: 'is_active', label: 'Active', type: 'boolean' },
    ]
  },
  'news': {
    table: 'news',
    title: 'News',
    addTitle: 'Add News',
    searchColumn: 'title_en',
    columns: [
      { key: 'title_en', label: 'Title (EN)' },
      { key: 'news_type', label: 'Type' },
      { key: 'tag', label: 'Tag' },
      { key: 'publish_date', label: 'Published', type: 'date' },
      { key: 'is_active', label: 'Status', type: 'boolean' },
    ],
    formFields: [
      { name: 'title_en', label: 'Title (English)', type: 'text', required: true },
      { name: 'title_hi', label: 'Title (Hindi)', type: 'text', isHindi: true },
      { name: 'content_en', label: 'Content (English)', type: 'richtext' },
      { name: 'content_hi', label: 'Content (Hindi)', type: 'richtext', isHindi: true },
      { name: 'news_type', label: 'News Type', type: 'select', options: [
        { value: 'general', label: 'General' },
        { value: 'press_release', label: 'Press Release' },
        { value: 'announcement', label: 'Announcement' },
      ]},
      { name: 'tag', label: 'Tag', type: 'text' },
      { name: 'image_url', label: 'Image', type: 'image' },
      { name: 'publish_date', label: 'Publish Date', type: 'date' },
      { name: 'is_active', label: 'Active', type: 'boolean' },
    ]
  },
  'notifications': {
    table: 'notifications',
    title: 'Notifications',
    addTitle: 'Add Notification',
    searchColumn: 'title_en',
    columns: [
      { key: 'title_en', label: 'Title (EN)' },
      { key: 'content_type', label: 'Type' },
      { key: 'publish_date', label: 'Published', type: 'date' },
      { key: 'expiry_date', label: 'Expires', type: 'date' },
      { key: 'is_active', label: 'Status', type: 'boolean' },
    ],
    formFields: [
      { name: 'title_en', label: 'Title (English)', type: 'text', required: true },
      { name: 'title_hi', label: 'Title (Hindi)', type: 'text', isHindi: true },
      { name: 'content_type', label: 'Content Type', type: 'select', options: [
        { value: 'link', label: 'Link' },
        { value: 'file', label: 'File' },
      ]},
      { name: 'link_url', label: 'Link URL', type: 'url' },
      { name: 'file_url', label: 'Upload File (PDF)', type: 'file' },
      { name: 'publish_date', label: 'Publish Date', type: 'date' },
      { name: 'expiry_date', label: 'Expiry Date', type: 'date' },
      { name: 'is_active', label: 'Active', type: 'boolean' },
    ]
  },
  'banners': {
    table: 'banners',
    title: 'Banners',
    addTitle: 'Add Banner',
    searchColumn: 'title_en',
    columns: [
      { key: 'title_en', label: 'Title' },
      { key: 'image_url', label: 'Image', type: 'image' },
      { key: 'display_order', label: 'Order' },
      { key: 'is_active', label: 'Status', type: 'boolean' },
    ],
    formFields: [
      { name: 'title_en', label: 'Title (English)', type: 'text', required: true },
      { name: 'title_hi', label: 'Title (Hindi)', type: 'text', isHindi: true },
      { name: 'subtitle_en', label: 'Subtitle (English)', type: 'text' },
      { name: 'subtitle_hi', label: 'Subtitle (Hindi)', type: 'text', isHindi: true },
      { name: 'image_url', label: 'Banner Image', type: 'image', required: true },
      { name: 'link_url', label: 'Link URL', type: 'url' },
      { name: 'display_order', label: 'Display Order', type: 'number' },
      { name: 'is_active', label: 'Active', type: 'boolean' },
    ]
  },
  'pages': {
    table: 'pages',
    title: 'Pages / CMS',
    addTitle: 'Add Page',
    searchColumn: 'title_en',
    columns: [
      { key: 'title_en', label: 'Title (EN)' },
      { key: 'slug', label: 'Slug' },
      { key: 'section', label: 'Section' },
      { key: 'is_active', label: 'Status', type: 'boolean' },
    ],
    formFields: [
      { name: 'title_en', label: 'Title (English)', type: 'text', required: true },
      { name: 'title_hi', label: 'Title (Hindi)', type: 'text', isHindi: true },
      { name: 'slug', label: 'URL Slug', type: 'text', required: true, hint: 'e.g. about/history' },
      { name: 'section', label: 'Section', type: 'text', hint: 'e.g. about, governance' },
      { name: 'content_en', label: 'Content (English)', type: 'richtext' },
      { name: 'content_hi', label: 'Content (Hindi)', type: 'richtext', isHindi: true },
      { name: 'meta_description', label: 'Meta Description', type: 'textarea' },
      { name: 'display_order', label: 'Display Order', type: 'number' },
      { name: 'is_active', label: 'Active', type: 'boolean' },
    ]
  },
  'publications': {
    table: 'publications',
    title: 'Publications',
    addTitle: 'Add Publication',
    searchColumn: 'title_en',
    columns: [
      { key: 'title_en', label: 'Title (EN)' },
      { key: 'pub_type', label: 'Type' },
      { key: 'publish_date', label: 'Published', type: 'date' },
      { key: 'is_active', label: 'Status', type: 'boolean' },
    ],
    formFields: [
      { name: 'title_en', label: 'Title (English)', type: 'text', required: true },
      { name: 'title_hi', label: 'Title (Hindi)', type: 'text', isHindi: true },
      { name: 'pub_type', label: 'Publication Type', type: 'select', options: [
        { value: 'circular', label: 'Circular' },
        { value: 'manual', label: 'Manual' },
        { value: 'guideline', label: 'Guideline' },
        { value: 'notice', label: 'Notice' },
        { value: 'report', label: 'Report' },
        { value: 'other', label: 'Other' },
      ], required: true },
      { name: 'description_en', label: 'Description (English)', type: 'textarea' },
      { name: 'description_hi', label: 'Description (Hindi)', type: 'textarea', isHindi: true },
      { name: 'file_url', label: 'Upload File (PDF)', type: 'file' },
      { name: 'publish_date', label: 'Publish Date', type: 'date' },
      { name: 'display_order', label: 'Display Order', type: 'number' },
      { name: 'is_active', label: 'Active', type: 'boolean' },
    ]
  },
  'media-gallery': {
    table: 'media_gallery',
    title: 'Media Gallery',
    addTitle: 'Add Media',
    searchColumn: 'title_en',
    columns: [
      { key: 'title_en', label: 'Title (EN)' },
      { key: 'media_type', label: 'Type' },
      { key: 'gallery_date', label: 'Date', type: 'date' },
      { key: 'is_active', label: 'Status', type: 'boolean' },
    ],
    formFields: [
      { name: 'title_en', label: 'Title (English)', type: 'text', required: true },
      { name: 'title_hi', label: 'Title (Hindi)', type: 'text', isHindi: true },
      { name: 'media_type', label: 'Media Type', type: 'select', options: [
        { value: 'photo', label: 'Photo' },
        { value: 'video', label: 'Video' },
      ], required: true },
      { name: 'file_url', label: 'Upload File/Image', type: 'file' },
      { name: 'video_url', label: 'Video URL (YouTube)', type: 'url' },
      { name: 'thumbnail_url', label: 'Thumbnail', type: 'image' },
      { name: 'gallery_date', label: 'Gallery Date', type: 'date' },
      { name: 'display_order', label: 'Display Order', type: 'number' },
      { name: 'is_active', label: 'Active', type: 'boolean' },
    ]
  },
  'events': {
    table: 'events',
    title: 'Events',
    addTitle: 'Add Event',
    searchColumn: 'title_en',
    columns: [
      { key: 'title_en', label: 'Title (EN)' },
      { key: 'venue', label: 'Venue' },
      { key: 'start_date', label: 'Start Date', type: 'date' },
      { key: 'end_date', label: 'End Date', type: 'date' },
      { key: 'is_active', label: 'Status', type: 'boolean' },
    ],
    formFields: [
      { name: 'title_en', label: 'Title (English)', type: 'text', required: true },
      { name: 'title_hi', label: 'Title (Hindi)', type: 'text', isHindi: true },
      { name: 'description_en', label: 'Description (English)', type: 'richtext' },
      { name: 'description_hi', label: 'Description (Hindi)', type: 'richtext', isHindi: true },
      { name: 'venue', label: 'Venue', type: 'text' },
      { name: 'start_date', label: 'Start Date', type: 'date' },
      { name: 'end_date', label: 'End Date', type: 'date' },
      { name: 'image_url', label: 'Event Image', type: 'image' },
      { name: 'file_url', label: 'Upload File (PDF)', type: 'file' },
      { name: 'is_active', label: 'Active', type: 'boolean' },
    ]
  },
  'faqs': {
    table: 'faqs',
    title: 'FAQs',
    addTitle: 'Add FAQ',
    searchColumn: 'question_en',
    columns: [
      { key: 'question_en', label: 'Question (EN)' },
      { key: 'category', label: 'Category' },
      { key: 'display_order', label: 'Order' },
      { key: 'is_active', label: 'Status', type: 'boolean' },
    ],
    formFields: [
      { name: 'question_en', label: 'Question (English)', type: 'textarea', required: true },
      { name: 'question_hi', label: 'Question (Hindi)', type: 'textarea', isHindi: true },
      { name: 'answer_en', label: 'Answer (English)', type: 'richtext', required: true },
      { name: 'answer_hi', label: 'Answer (Hindi)', type: 'richtext', isHindi: true },
      { name: 'category', label: 'Category', type: 'text' },
      { name: 'display_order', label: 'Display Order', type: 'number' },
      { name: 'is_active', label: 'Active', type: 'boolean' },
    ]
  },
  'quick-links': {
    table: 'quick_links',
    title: 'Quick Links',
    addTitle: 'Add Quick Link',
    searchColumn: 'title_en',
    columns: [
      { key: 'title_en', label: 'Title (EN)' },
      { key: 'url', label: 'URL', type: 'link' },
      { key: 'link_type', label: 'Type' },
      { key: 'display_order', label: 'Order' },
      { key: 'is_active', label: 'Status', type: 'boolean' },
    ],
    formFields: [
      { name: 'title_en', label: 'Title (English)', type: 'text', required: true },
      { name: 'title_hi', label: 'Title (Hindi)', type: 'text', isHindi: true },
      { name: 'url', label: 'URL', type: 'url', required: true },
      { name: 'link_type', label: 'Link Type', type: 'select', options: [
        { value: 'external', label: 'External' },
        { value: 'internal', label: 'Internal' },
      ]},
      { name: 'icon_url', label: 'Icon Image', type: 'image' },
      { name: 'display_order', label: 'Display Order', type: 'number' },
      { name: 'is_active', label: 'Active', type: 'boolean' },
    ]
  },
  'recruitment-notices': {
    table: 'recruitment_notices',
    title: 'Recruitment Notices',
    addTitle: 'Add Recruitment Notice',
    searchColumn: 'title_en',
    columns: [
      { key: 'title_en', label: 'Title (EN)' },
      { key: 'notice_date', label: 'Notice Date', type: 'date' },
      { key: 'closing_date', label: 'Closing Date', type: 'date' },
      { key: 'is_active', label: 'Status', type: 'boolean' },
    ],
    formFields: [
      { name: 'title_en', label: 'Title (English)', type: 'text', required: true },
      { name: 'title_hi', label: 'Title (Hindi)', type: 'text', isHindi: true },
      { name: 'description_en', label: 'Description (English)', type: 'richtext' },
      { name: 'description_hi', label: 'Description (Hindi)', type: 'richtext', isHindi: true },
      { name: 'file_url', label: 'Upload Notice (PDF)', type: 'file' },
      { name: 'notice_date', label: 'Notice Date', type: 'date', required: true },
      { name: 'closing_date', label: 'Closing Date', type: 'date' },
      { name: 'is_active', label: 'Active', type: 'boolean' },
    ]
  },
  'tenders': {
    table: 'tenders',
    title: 'Tenders',
    addTitle: 'Add Tender',
    searchColumn: 'title_en',
    columns: [
      { key: 'title_en', label: 'Title (EN)' },
      { key: 'reference_no', label: 'Ref. No.' },
      { key: 'issue_date', label: 'Issue Date', type: 'date' },
      { key: 'last_date', label: 'Last Date', type: 'date' },
      { key: 'is_active', label: 'Status', type: 'boolean' },
    ],
    formFields: [
      { name: 'title_en', label: 'Title (English)', type: 'text', required: true },
      { name: 'title_hi', label: 'Title (Hindi)', type: 'text', isHindi: true },
      { name: 'reference_no', label: 'Reference Number', type: 'text' },
      { name: 'file_url', label: 'Upload Tender Document (PDF)', type: 'file' },
      { name: 'issue_date', label: 'Issue Date', type: 'date' },
      { name: 'submission_date', label: 'Submission Date', type: 'date' },
      { name: 'last_date', label: 'Last Date', type: 'date' },
      { name: 'is_active', label: 'Active', type: 'boolean' },
    ]
  },
  'former-cags': {
    table: 'former_cags',
    title: 'Former CAGs',
    addTitle: 'Add Former CAG',
    searchColumn: 'name_en',
    columns: [
      { key: 'name_en', label: 'Name (EN)' },
      { key: 'tenure_from', label: 'Tenure From' },
      { key: 'tenure_to', label: 'Tenure To' },
      { key: 'display_order', label: 'Order' },
      { key: 'is_active', label: 'Status', type: 'boolean' },
    ],
    formFields: [
      { name: 'name_en', label: 'Full Name (English)', type: 'text', required: true },
      { name: 'name_hi', label: 'Full Name (Hindi)', type: 'text', isHindi: true },
      { name: 'tenure_from', label: 'Tenure From', type: 'text', placeholder: 'e.g. 1948' },
      { name: 'tenure_to', label: 'Tenure To', type: 'text', placeholder: 'e.g. 1954' },
      { name: 'description_en', label: 'Description (English)', type: 'richtext' },
      { name: 'description_hi', label: 'Description (Hindi)', type: 'richtext', isHindi: true },
      { name: 'image_url', label: 'Portrait Image', type: 'image' },
      { name: 'display_order', label: 'Display Order', type: 'number' },
      { name: 'is_active', label: 'Active', type: 'boolean' },
    ]
  },
  'org-designations': {
    table: 'org_designations',
    title: 'Org. Designations',
    addTitle: 'Add Designation',
    searchColumn: 'title_en',
    columns: [
      { key: 'title_en', label: 'Designation (EN)' },
      { key: 'level', label: 'Level' },
      { key: 'display_order', label: 'Order' },
      { key: 'is_active', label: 'Status', type: 'boolean' },
    ],
    formFields: [
      { name: 'title_en', label: 'Designation (English)', type: 'text', required: true },
      { name: 'title_hi', label: 'Designation (Hindi)', type: 'text', isHindi: true },
      { name: 'parent_id', label: 'Parent Designation', type: 'select' },
      { name: 'level', label: 'Hierarchy Level', type: 'number' },
      { name: 'display_order', label: 'Display Order', type: 'number' },
      { name: 'is_active', label: 'Active', type: 'boolean' },
    ]
  },
  'org-officers': {
    table: 'org_officers',
    title: 'Org. Officers',
    addTitle: 'Add Officer',
    searchColumn: 'full_name_en',
    columns: [
      { key: 'full_name_en', label: 'Name (EN)' },
      { key: 'email', label: 'Email' },
      { key: 'charge_from', label: 'Charge From', type: 'date' },
      { key: 'is_active', label: 'Status', type: 'boolean' },
    ],
    formFields: [
      { name: 'prefix', label: 'Prefix (Shri/Smt/Dr.)', type: 'text' },
      { name: 'full_name_en', label: 'Full Name (English)', type: 'text', required: true },
      { name: 'full_name_hi', label: 'Full Name (Hindi)', type: 'text', isHindi: true },
      { name: 'designation_id', label: 'Designation', type: 'select' },
      { name: 'email', label: 'Email', type: 'text' },
      { name: 'phone', label: 'Phone', type: 'text' },
      { name: 'profile_image', label: 'Profile Image', type: 'image' },
      { name: 'brief_description', label: 'Brief Description', type: 'textarea' },
      { name: 'charge_from', label: 'Charge From', type: 'date' },
      { name: 'charge_to', label: 'Charge To', type: 'date' },
      { name: 'is_active', label: 'Active', type: 'boolean' },
    ]
  },
  'public-consultations': {
    table: 'public_consultations',
    title: 'Public Consultations',
    addTitle: 'Add Consultation',
    searchColumn: 'title_en',
    columns: [
      { key: 'title_en', label: 'Title (EN)' },
      { key: 'publish_date', label: 'Publish Date', type: 'date' },
      { key: 'expiry_date', label: 'Expiry Date', type: 'date' },
      { key: 'total_views', label: 'Views' },
      { key: 'total_downloads', label: 'Downloads' },
      { key: 'is_active', label: 'Status', type: 'boolean' },
    ],
    formFields: [
      { name: 'title_en', label: 'Title (English)', type: 'text', required: true },
      { name: 'title_hi', label: 'Title (Hindi)', type: 'text', isHindi: true },
      { name: 'description_en', label: 'Description (English)', type: 'richtext' },
      { name: 'description_hi', label: 'Description (Hindi)', type: 'richtext', isHindi: true },
      { name: 'file_url', label: 'Upload Document (PDF)', type: 'file' },
      { name: 'publish_date', label: 'Publish Date', type: 'date' },
      { name: 'expiry_date', label: 'Expiry Date', type: 'date' },
      { name: 'is_active', label: 'Active', type: 'boolean' },
    ]
  },
  'offices': {
    table: 'offices',
    title: 'Offices',
    addTitle: 'Add Office',
    searchColumn: 'name_en',
    columns: [
      { key: 'name_en', label: 'Office Name (EN)' },
      { key: 'office_type', label: 'Type' },
      { key: 'phone', label: 'Phone' },
      { key: 'email', label: 'Email' },
      { key: 'is_active', label: 'Status', type: 'boolean' },
    ],
    formFields: [
      { name: 'name_en', label: 'Office Name (English)', type: 'text', required: true },
      { name: 'name_hi', label: 'Office Name (Hindi)', type: 'text', isHindi: true },
      { name: 'office_type', label: 'Office Type', type: 'select', options: [
        { value: 'central', label: 'Central' },
        { value: 'state', label: 'State' },
        { value: 'training', label: 'Training' },
      ], required: true },
      { name: 'sub_type', label: 'Sub Type', type: 'text' },
      { name: 'state_id', label: 'State', type: 'select' },
      { name: 'address', label: 'Address', type: 'textarea' },
      { name: 'phone', label: 'Phone', type: 'text' },
      { name: 'email', label: 'Email', type: 'text' },
      { name: 'website_url', label: 'Website URL', type: 'url' },
      { name: 'latitude', label: 'Latitude', type: 'text' },
      { name: 'longitude', label: 'Longitude', type: 'text' },
      { name: 'display_order', label: 'Display Order', type: 'number' },
      { name: 'is_active', label: 'Active', type: 'boolean' },
    ]
  },
  'state-accounts': {
    table: 'state_accounts',
    title: 'State Accounts',
    addTitle: 'Add State Account',
    searchColumn: 'title_en',
    columns: [
      { key: 'title_en', label: 'Title (EN)' },
      { key: 'account_year', label: 'Year' },
      { key: 'month', label: 'Month' },
      { key: 'volume', label: 'Volume' },
      { key: 'is_active', label: 'Status', type: 'boolean' },
    ],
    formFields: [
      { name: 'title_en', label: 'Title (English)', type: 'text', required: true },
      { name: 'title_hi', label: 'Title (Hindi)', type: 'text', isHindi: true },
      { name: 'state_id', label: 'State', type: 'select' },
      { name: 'account_year', label: 'Account Year', type: 'number', required: true },
      { name: 'month', label: 'Month', type: 'text' },
      { name: 'volume', label: 'Volume', type: 'text' },
      { name: 'file_url', label: 'Upload File (PDF)', type: 'file' },
      { name: 'external_link', label: 'External Link URL', type: 'url' },
      { name: 'is_active', label: 'Active', type: 'boolean' },
    ]
  },
  'journal-issues': {
    table: 'journal_issues',
    title: 'Journal Issues',
    addTitle: 'Add Journal Issue',
    searchColumn: 'issn',
    columns: [
      { key: 'volume_number', label: 'Volume' },
      { key: 'issue_number', label: 'Issue' },
      { key: 'year', label: 'Year' },
      { key: 'issn', label: 'ISSN' },
      { key: 'publication_date', label: 'Published', type: 'date' },
      { key: 'is_active', label: 'Status', type: 'boolean' },
    ],
    formFields: [
      { name: 'volume_number', label: 'Volume Number', type: 'number', required: true },
      { name: 'issue_number', label: 'Issue Number', type: 'number', required: true },
      { name: 'year', label: 'Year', type: 'number', required: true },
      { name: 'issn', label: 'ISSN', type: 'text' },
      { name: 'publication_date', label: 'Publication Date', type: 'date' },
      { name: 'cover_image', label: 'Cover Image', type: 'image' },
      { name: 'full_pdf_url', label: 'Full Issue PDF', type: 'file' },
      { name: 'is_active', label: 'Active', type: 'boolean' },
    ]
  },
  'journal-articles': {
    table: 'journal_articles',
    title: 'Journal Articles',
    addTitle: 'Add Article',
    searchColumn: 'title',
    columns: [
      { key: 'title', label: 'Title' },
      { key: 'author', label: 'Author' },
      { key: 'doi', label: 'DOI' },
      { key: 'display_order', label: 'Order' },
      { key: 'is_active', label: 'Status', type: 'boolean' },
    ],
    formFields: [
      { name: 'issue_id', label: 'Journal Issue', type: 'select', required: true },
      { name: 'title', label: 'Article Title', type: 'text', required: true },
      { name: 'author', label: 'Author(s)', type: 'text' },
      { name: 'keywords', label: 'Keywords', type: 'text' },
      { name: 'doi', label: 'DOI', type: 'text' },
      { name: 'file_url', label: 'Article PDF', type: 'file' },
      { name: 'display_order', label: 'Display Order', type: 'number' },
      { name: 'is_active', label: 'Active', type: 'boolean' },
    ]
  },
  'states': {
    table: 'states',
    title: 'States',
    addTitle: 'Add State',
    searchColumn: 'name_en',
    columns: [
      { key: 'code', label: 'Code' },
      { key: 'name_en', label: 'Name (EN)' },
      { key: 'name_hi', label: 'Name (HI)' },
      { key: 'is_active', label: 'Status', type: 'boolean' },
    ],
    formFields: [
      { name: 'code', label: 'State Code', type: 'text', required: true, placeholder: 'e.g. MH' },
      { name: 'name_en', label: 'Name (English)', type: 'text', required: true },
      { name: 'name_hi', label: 'Name (Hindi)', type: 'text', isHindi: true },
      { name: 'is_active', label: 'Active', type: 'boolean' },
    ]
  },
  'government-types': {
    table: 'government_types',
    title: 'Government Types',
    addTitle: 'Add Government Type',
    searchColumn: 'name_en',
    columns: [
      { key: 'name_en', label: 'Name (EN)' },
      { key: 'name_hi', label: 'Name (HI)' },
      { key: 'is_active', label: 'Status', type: 'boolean' },
    ],
    formFields: [
      { name: 'name_en', label: 'Name (English)', type: 'text', required: true },
      { name: 'name_hi', label: 'Name (Hindi)', type: 'text', isHindi: true },
      { name: 'is_active', label: 'Active', type: 'boolean' },
    ]
  },
  'users': {
    table: 'admin_users',
    title: 'Admin Users',
    addTitle: 'Add Admin User',
    searchColumn: 'username',
    columns: [
      { key: 'username', label: 'Username' },
      { key: 'full_name', label: 'Full Name' },
      { key: 'email', label: 'Email' },
      { key: 'role', label: 'Role' },
      { key: 'is_active', label: 'Status', type: 'boolean' },
    ],
    formFields: [
      { name: 'username', label: 'Username', type: 'text', required: true },
      { name: 'full_name', label: 'Full Name', type: 'text', required: true },
      { name: 'email', label: 'Email', type: 'text', required: true },
      { name: 'password_hash', label: 'Password', type: 'password', required: true, hint: 'Password must be hashed on save. On edit, leave blank to keep unchanged.' },
      { name: 'role', label: 'Role', type: 'select', required: true, options: [
        { value: 'admin', label: 'Admin' },
        { value: 'super_admin', label: 'Super Admin' }
      ]},
      { name: 'is_active', label: 'Active', type: 'boolean' },
    ]
  },
  'audit-report-files': {
    table: 'audit_report_files',
    title: 'Audit Report Files',
    addTitle: 'Add Audit Report File',
    searchColumn: 'file_type',
    columns: [
      { key: 'report_id', label: 'Report ID' },
      { key: 'file_type', label: 'File Type' },
      { key: 'file_url', label: 'File URL', type: 'link' },
      { key: 'display_order', label: 'Order' },
      { key: 'is_active', label: 'Status', type: 'boolean' },
    ],
    formFields: [
      { name: 'report_id', label: 'Audit Report', type: 'select', required: true },
      { name: 'file_type', label: 'File Type', type: 'text', required: true },
      { name: 'file_url', label: 'Upload File (PDF)', type: 'file', required: true },
      { name: 'display_order', label: 'Display Order', type: 'number' },
      { name: 'is_active', label: 'Active', type: 'boolean' },
    ]
  },
};
