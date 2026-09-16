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
  table: string;          // DB table name (in cag_revamp schema)
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
  'users': {
    table: 'users',
    title: 'Users Management',
    addTitle: 'Add User',
    searchColumn: 'username',
    columns: [
      { key: 'username', label: 'Username' },
      { key: 'name', label: 'Full Name' },
      { key: 'email', label: 'Email' },
      { key: 'mobile', label: 'Mobile' },
      { key: 'role_name', label: 'Role' },
      { key: 'wing_title', label: 'CAG Wing' },
      { key: 'is_active', label: 'Status', type: 'boolean' },
      { key: 'created_at', label: 'Registered', type: 'date' },
    ],
    formFields: [
      { name: 'username', label: 'Username', type: 'text', required: true },
      { name: 'email', label: 'Email Address', type: 'text', required: true },
      { name: 'password', label: 'Password', type: 'password', hint: '8-20 chars: min 1 uppercase, 1 lowercase, 1 number, 1 special character' },
      { name: 'first_name', label: 'First Name', type: 'text' },
      { name: 'last_name', label: 'Last Name', type: 'text' },
      { name: 'role_id', label: 'System Role', type: 'select', required: true },
      { name: 'wings_id', label: 'CAG Wing', type: 'select' },
      { name: 'mobile', label: 'Mobile Number', type: 'text' },
      { name: 'designation', label: 'Designation', type: 'text' },
      { name: 'posted_office', label: 'Posted Office', type: 'text' },
      { name: 'gender', label: 'Gender', type: 'select', options: [
        { value: 'Male', label: 'Male' },
        { value: 'Female', label: 'Female' },
        { value: 'Other', label: 'Other' }
      ]},
      { name: 'is_active', label: 'Active Status', type: 'boolean' },
    ]
  },
  'admin-users': {
    table: 'users',
    title: 'Users Management',
    addTitle: 'Add User',
    searchColumn: 'username',
    columns: [
      { key: 'username', label: 'Username' },
      { key: 'name', label: 'Full Name' },
      { key: 'email', label: 'Email' },
      { key: 'mobile', label: 'Mobile' },
      { key: 'role_name', label: 'Role' },
      { key: 'wing_title', label: 'CAG Wing' },
      { key: 'is_active', label: 'Status', type: 'boolean' },
      { key: 'created_at', label: 'Registered', type: 'date' },
    ],
    formFields: [
      { name: 'username', label: 'Username', type: 'text', required: true },
      { name: 'email', label: 'Email Address', type: 'text', required: true },
      { name: 'password', label: 'Password', type: 'password', hint: '8-20 chars: min 1 uppercase, 1 lowercase, 1 number, 1 special character' },
      { name: 'first_name', label: 'First Name', type: 'text' },
      { name: 'last_name', label: 'Last Name', type: 'text' },
      { name: 'role_id', label: 'System Role', type: 'select', required: true },
      { name: 'wings_id', label: 'CAG Wing', type: 'select' },
      { name: 'mobile', label: 'Mobile Number', type: 'text' },
      { name: 'designation', label: 'Designation', type: 'text' },
      { name: 'posted_office', label: 'Posted Office', type: 'text' },
      { name: 'gender', label: 'Gender', type: 'select', options: [
        { value: 'Male', label: 'Male' },
        { value: 'Female', label: 'Female' },
        { value: 'Other', label: 'Other' }
      ]},
      { name: 'is_active', label: 'Active Status', type: 'boolean' },
    ]
  },
  'roles': {
    table: 'roles',
    title: 'Roles & Access Control',
    addTitle: 'Add Role',
    searchColumn: 'name',
    columns: [
      { key: 'name', label: 'Role Name' },
      { key: 'parent_name', label: 'Parent Role Hierarchy' },
      { key: 'is_system', label: 'System Role', type: 'boolean' },
      { key: 'is_active', label: 'Status', type: 'boolean' },
      { key: 'created_at', label: 'Created', type: 'date' },
    ],
    formFields: [
      { name: 'name', label: 'Role Name (English)', type: 'text', required: true },
      { name: 'name_hi', label: 'Role Name (Hindi)', type: 'text', isHindi: true },
      { name: 'parent_id', label: 'Parent Role Hierarchy', type: 'select' },
      { name: 'is_active', label: 'Active Status', type: 'boolean' },
    ]
  },
  'roles-permissions': {
    table: 'roles_permissions',
    title: 'Role Permissions & Subsite Scoping',
    addTitle: 'Add Role Permission Scoping',
    searchColumn: 'role_name',
    columns: [
      { key: 'role_name', label: 'Role' },
      { key: 'website_title', label: 'Assigned Subsite / Website' },
      { key: 'state_id', label: 'State ID' },
      { key: 'department_id', label: 'Department ID' },
    ],
    formFields: [
      { name: 'role_id', label: 'Role', type: 'select', required: true },
      { name: 'website_id', label: 'Website / Subsite', type: 'select', required: true },
    ]
  },
  'user-offices': {
    table: 'user_offices',
    title: 'User Offices Directory',
    addTitle: 'Add User Office',
    searchColumn: 'title',
    columns: [
      { key: 'title', label: 'Office Title' },
      { key: 'location', label: 'Location' },
      { key: 'language', label: 'Language' },
      { key: 'is_active', label: 'Status', type: 'boolean' },
      { key: 'created_at', label: 'Created', type: 'date' },
    ],
    formFields: [
      { name: 'title', label: 'Office Title', type: 'text', required: true },
      { name: 'location', label: 'Location / Address', type: 'text' },
      { name: 'language', label: 'Language', type: 'select', options: [
        { value: 'en', label: 'English' },
        { value: 'hi', label: 'Hindi' }
      ]},
      { name: 'is_active', label: 'Active Status', type: 'boolean' },
    ]
  },
  'modules': {
    table: 'modules',
    title: 'System Modules & ACL',
    addTitle: 'Add System Module',
    searchColumn: 'module_name',
    columns: [
      { key: 'module_name', label: 'Module Name' },
      { key: 'controller', label: 'Controller' },
      { key: 'action', label: 'Default Action' },
      { key: 'sub_actions', label: 'Sub-Actions' },
      { key: 'is_active', label: 'Status', type: 'boolean' },
    ],
    formFields: [
      { name: 'module_name', label: 'Module Name', type: 'text', required: true },
      { name: 'controller', label: 'Controller', type: 'text', required: true },
      { name: 'action', label: 'Default Action', type: 'text' },
      { name: 'sub_actions', label: 'Sub-Actions', type: 'text' },
      { name: 'is_active', label: 'Active Status', type: 'boolean' },
    ]
  },
  'wings': {
    table: 'wings',
    title: 'CAG Wings',
    addTitle: 'Add CAG Wing',
    searchColumn: 'title',
    columns: [
      { key: 'title', label: 'Wing Title' },
      { key: 'is_active', label: 'Status', type: 'boolean' },
      { key: 'created', label: 'Created At', type: 'date' },
    ],
    formFields: [
      { name: 'title', label: 'Wing Title', type: 'text', required: true },
      { name: 'is_active', label: 'Active Status', type: 'boolean' },
    ]
  },
  'audit-trail': {
    table: 'audit_trail_log',
    title: 'Audit Trail Logs',
    addTitle: 'Audit Trail',
    searchColumn: 'username_email',
    columns: [
      { key: 'action', label: 'Action' },
      { key: 'username_email', label: 'User / Account' },
      { key: 'table_alias', label: 'Target Module' },
      { key: 'ip_address', label: 'IP Address' },
      { key: 'action_status', label: 'Status' },
      { key: 'action_datetime', label: 'Timestamp', type: 'date' },
    ],
    formFields: []
  },
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
    title: 'State Finance Accounts',
    addTitle: 'Add State Account Statement',
    searchColumn: 'title_en',
    columns: [
      { key: 'title_en', label: 'Title (EN)' },
      { key: 'category_name', label: 'Category' },
      { key: 'account_year', label: 'Year' },
      { key: 'month', label: 'Month' },
      { key: 'volume', label: 'Volume' },
      { key: 'is_active', label: 'Status', type: 'boolean' },
    ],
    formFields: [
      { name: 'title_en', label: 'Title (English)', type: 'text', required: true },
      { name: 'title_hi', label: 'Title (Hindi)', type: 'text', isHindi: true },
      { name: 'state_id', label: 'State / Union Territory', type: 'select' },
      { name: 'category_name', label: 'Account Category', type: 'select', options: [
        { value: 'Accounts at a Glance', label: 'Accounts at a Glance' },
        { value: 'Appropriation Accounts', label: 'Appropriation Accounts' },
        { value: 'Finance Accounts', label: 'Finance Accounts' },
        { value: 'Monthly Key Indicators', label: 'Monthly Key Indicators' },
      ]},
      { name: 'account_year', label: 'Account Year', type: 'number', required: true },
      { name: 'month', label: 'Month (if monthly statement)', type: 'text' },
      { name: 'volume', label: 'Volume Description', type: 'text' },
      { name: 'file_url', label: 'Upload File / CloudFront PDF URL', type: 'file' },
      { name: 'external_link', label: 'External Link URL', type: 'url' },
      { name: 'is_active', label: 'Active', type: 'boolean' },
    ]
  },
  'combined-accounts': {
    table: 'combined_accounts',
    title: 'Combined Finance Accounts & Conferences',
    addTitle: 'Add Combined Account Document',
    searchColumn: 'title_en',
    columns: [
      { key: 'title_en', label: 'Document Title' },
      { key: 'category', label: 'Category' },
      { key: 'account_year', label: 'Year' },
      { key: 'volume', label: 'Volume' },
      { key: 'size', label: 'Size' },
      { key: 'is_active', label: 'Status', type: 'boolean' },
    ],
    formFields: [
      { name: 'title_en', label: 'Document Title (English)', type: 'text', required: true },
      { name: 'title_hi', label: 'Document Title (Hindi)', type: 'text', isHindi: true },
      { name: 'category', label: 'Document Category', type: 'select', options: [
        { value: 'combined', label: 'Combined Finance & Revenue Accounts' },
        { value: 'conference', label: 'State Finance Secretaries Conference' },
      ], required: true },
      { name: 'account_year', label: 'Account / Report Year', type: 'text', required: true, placeholder: '2024 - 25' },
      { name: 'volume', label: 'Volume Description', type: 'text', placeholder: 'Full Comprehensive Volume' },
      { name: 'size', label: 'Document File Size', type: 'text', placeholder: '18.5 MB' },
      { name: 'file_url', label: 'Upload Document / CloudFront PDF Link', type: 'file' },
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
      { name: 'report_id', label: 'Report ID', type: 'number', required: true },
      { name: 'file_type', label: 'File Type', type: 'select', options: [
        { value: 'complete', label: 'Complete Report' },
        { value: 'chapter', label: 'Chapter' },
        { value: 'annexure', label: 'Annexure' },
        { value: 'press_release', label: 'Press Release' },
      ]},
      { name: 'file_url', label: 'File URL', type: 'text', required: true },
      { name: 'display_order', label: 'Display Order', type: 'number' },
      { name: 'is_active', label: 'Active', type: 'boolean' },
    ]
  },
  // --- About Us 9 Subpages Modules ---
  'cag-of-india': {
    table: 'pages',
    title: 'CAG of India Profile',
    addTitle: 'Update CAG Profile',
    searchColumn: 'title_en',
    columns: [
      { key: 'title_en', label: 'Title (EN)' },
      { key: 'title_hi', label: 'Title (HI)' },
      { key: 'slug', label: 'Slug' },
      { key: 'upload_file', label: 'Attachment', type: 'link' },
      { key: 'is_active', label: 'Status', type: 'boolean' },
    ],
    formFields: [
      { name: 'title_en', label: 'Title (English)', type: 'text', required: true },
      { name: 'title_hi', label: 'Title (Hindi)', type: 'text', isHindi: true },
      { name: 'slug', label: 'URL Slug', type: 'text', required: true },
      { name: 'excerpt_en', label: 'Excerpt (English)', type: 'textarea' },
      { name: 'excerpt_hi', label: 'Excerpt (Hindi)', type: 'textarea', isHindi: true },
      { name: 'content_en', label: 'Content (English)', type: 'richtext' },
      { name: 'content_hi', label: 'Content (Hindi)', type: 'richtext', isHindi: true },
      { name: 'upload_file', label: 'Profile Document / Photo', type: 'file' },
      { name: 'is_active', label: 'Active', type: 'boolean' },
    ]
  },
  'our-vision-mission-values': {
    table: 'pages',
    title: 'Our Vision, Mission & Core Values',
    addTitle: 'Update Vision & Mission',
    searchColumn: 'title_en',
    columns: [
      { key: 'title_en', label: 'Title (EN)' },
      { key: 'title_hi', label: 'Title (HI)' },
      { key: 'slug', label: 'Slug' },
      { key: 'is_active', label: 'Status', type: 'boolean' },
    ],
    formFields: [
      { name: 'title_en', label: 'Title (English)', type: 'text', required: true },
      { name: 'title_hi', label: 'Title (Hindi)', type: 'text', isHindi: true },
      { name: 'slug', label: 'URL Slug', type: 'text', required: true },
      { name: 'excerpt_en', label: 'Excerpt (English)', type: 'textarea' },
      { name: 'excerpt_hi', label: 'Excerpt (Hindi)', type: 'textarea', isHindi: true },
      { name: 'content_en', label: 'Content (English)', type: 'richtext' },
      { name: 'content_hi', label: 'Content (Hindi)', type: 'richtext', isHindi: true },
      { name: 'is_active', label: 'Active', type: 'boolean' },
    ]
  },
  'organisation-chart': {
    table: 'organisation_chart',
    title: 'Organisation Chart',
    addTitle: 'Add Officer to Hierarchy',
    searchColumn: 'name',
    columns: [
      { key: 'name', label: 'Officer Name' },
      { key: 'designation', label: 'Designation' },
      { key: 'charge', label: 'Portfolio / Charge' },
      { key: 'level', label: 'Level' },
      { key: 'email', label: 'Email' },
      { key: 'phone', label: 'Phone' },
      { key: 'display_order', label: 'Order' },
    ],
    formFields: [
      { name: 'name_en', label: 'Officer Name (English)', type: 'text', required: true },
      { name: 'name_hi', label: 'Officer Name (Hindi)', type: 'text', isHindi: true },
      { name: 'designation_en', label: 'Designation (English)', type: 'text', required: true },
      { name: 'designation_hi', label: 'Designation (Hindi)', type: 'text', isHindi: true },
      { name: 'charge_en', label: 'Portfolio / Charge (English)', type: 'text' },
      { name: 'charge_hi', label: 'Portfolio / Charge (Hindi)', type: 'text', isHindi: true },
      { name: 'level', label: 'Hierarchy Level (0=CAG, 1=Secy, 2=DyCAG, 3=AddlDyCAG, 4=DG/PD)', type: 'number', required: true },
      { name: 'email', label: 'Email Address', type: 'text' },
      { name: 'phone', label: 'Telephone Number', type: 'text' },
      { name: 'profile_image', label: 'Profile Photo', type: 'image' },
      { name: 'display_order', label: 'Display Order', type: 'number' },
      { name: 'is_active', label: 'Active', type: 'boolean' },
    ]
  },
  'former-cags': {
    table: 'former_cag',
    title: 'Former CAGs Gallery',
    addTitle: 'Add Former CAG',
    searchColumn: 'name',
    columns: [
      { key: 'name', label: 'Officer Name' },
      { key: 'tenure_from', label: 'Tenure From' },
      { key: 'tenure_to', label: 'Tenure To' },
      { key: 'image', label: 'Photo', type: 'image' },
      { key: 'title', label: 'Category' },
    ],
    formFields: [
      { name: 'name_en', label: 'Officer Name (English)', type: 'text', required: true },
      { name: 'name_hi', label: 'Officer Name (Hindi)', type: 'text', isHindi: true },
      { name: 'tenure_from', label: 'Tenure From (Year / Date)', type: 'text', required: true },
      { name: 'tenure_to', label: 'Tenure To (Year / Date)', type: 'text', required: true },
      { name: 'image', label: 'Photograph URL / Upload', type: 'image' },
      { name: 'title', label: 'Title Category', type: 'text', placeholder: 'Former CAG' },
      { name: 'is_active', label: 'Active', type: 'boolean' },
    ]
  },
  'history-of-indian-audit-and-accounts-department': {
    table: 'pages',
    title: 'History of IAAD',
    addTitle: 'Update History of IAAD',
    searchColumn: 'title_en',
    columns: [
      { key: 'title_en', label: 'Title (EN)' },
      { key: 'title_hi', label: 'Title (HI)' },
      { key: 'slug', label: 'Slug' },
      { key: 'upload_file', label: 'Attachment', type: 'link' },
      { key: 'is_active', label: 'Status', type: 'boolean' },
    ],
    formFields: [
      { name: 'title_en', label: 'Title (English)', type: 'text', required: true },
      { name: 'title_hi', label: 'Title (Hindi)', type: 'text', isHindi: true },
      { name: 'slug', label: 'URL Slug', type: 'text', required: true },
      { name: 'excerpt_en', label: 'Excerpt (English)', type: 'textarea' },
      { name: 'excerpt_hi', label: 'Excerpt (Hindi)', type: 'textarea', isHindi: true },
      { name: 'content_en', label: 'Content (English)', type: 'richtext' },
      { name: 'content_hi', label: 'Content (Hindi)', type: 'richtext', isHindi: true },
      { name: 'upload_file', label: 'Historical Document (PDF)', type: 'file' },
      { name: 'is_active', label: 'Active', type: 'boolean' },
    ]
  },
  'audit-advisory-board': {
    table: 'pages',
    title: 'Audit Advisory Board',
    addTitle: 'Update Audit Advisory Board',
    searchColumn: 'title_en',
    columns: [
      { key: 'title_en', label: 'Title (EN)' },
      { key: 'title_hi', label: 'Title (HI)' },
      { key: 'slug', label: 'Slug' },
      { key: 'upload_file', label: 'Attachment', type: 'link' },
      { key: 'is_active', label: 'Status', type: 'boolean' },
    ],
    formFields: [
      { name: 'title_en', label: 'Title (English)', type: 'text', required: true },
      { name: 'title_hi', label: 'Title (Hindi)', type: 'text', isHindi: true },
      { name: 'slug', label: 'URL Slug', type: 'text', required: true },
      { name: 'excerpt_en', label: 'Excerpt (English)', type: 'textarea' },
      { name: 'excerpt_hi', label: 'Excerpt (Hindi)', type: 'textarea', isHindi: true },
      { name: 'content_en', label: 'Content (English)', type: 'richtext' },
      { name: 'content_hi', label: 'Content (Hindi)', type: 'richtext', isHindi: true },
      { name: 'upload_file', label: 'Notification Document (PDF)', type: 'file' },
      { name: 'is_active', label: 'Active', type: 'boolean' },
    ]
  },
  'constitutional-provisions': {
    table: 'pages',
    title: 'Constitutional Provisions',
    addTitle: 'Update Constitutional Provisions',
    searchColumn: 'title_en',
    columns: [
      { key: 'title_en', label: 'Title (EN)' },
      { key: 'title_hi', label: 'Title (HI)' },
      { key: 'slug', label: 'Slug' },
      { key: 'upload_file', label: 'Attachment', type: 'link' },
      { key: 'is_active', label: 'Status', type: 'boolean' },
    ],
    formFields: [
      { name: 'title_en', label: 'Title (English)', type: 'text', required: true },
      { name: 'title_hi', label: 'Title (Hindi)', type: 'text', isHindi: true },
      { name: 'slug', label: 'URL Slug', type: 'text', required: true },
      { name: 'excerpt_en', label: 'Excerpt (English)', type: 'textarea' },
      { name: 'excerpt_hi', label: 'Excerpt (Hindi)', type: 'textarea', isHindi: true },
      { name: 'content_en', label: 'Content (English)', type: 'richtext' },
      { name: 'content_hi', label: 'Content (Hindi)', type: 'richtext', isHindi: true },
      { name: 'upload_file', label: 'Constitutional Reference (PDF)', type: 'file' },
      { name: 'is_active', label: 'Active', type: 'boolean' },
    ]
  },
  'duties-power-and-conditions-of-services-act': {
    table: 'pages',
    title: 'Duties & Powers Act',
    addTitle: 'Update Duties & Powers Act',
    searchColumn: 'title_en',
    columns: [
      { key: 'title_en', label: 'Title (EN)' },
      { key: 'title_hi', label: 'Title (HI)' },
      { key: 'slug', label: 'Slug' },
      { key: 'upload_file', label: 'Attachment', type: 'link' },
      { key: 'is_active', label: 'Status', type: 'boolean' },
    ],
    formFields: [
      { name: 'title_en', label: 'Title (English)', type: 'text', required: true },
      { name: 'title_hi', label: 'Title (Hindi)', type: 'text', isHindi: true },
      { name: 'slug', label: 'URL Slug', type: 'text', required: true },
      { name: 'excerpt_en', label: 'Excerpt (English)', type: 'textarea' },
      { name: 'excerpt_hi', label: 'Excerpt (Hindi)', type: 'textarea', isHindi: true },
      { name: 'content_en', label: 'Content (English)', type: 'richtext' },
      { name: 'content_hi', label: 'Content (Hindi)', type: 'richtext', isHindi: true },
      { name: 'upload_file', label: 'Act Document (PDF)', type: 'file' },
      { name: 'is_active', label: 'Active', type: 'boolean' },
    ]
  },
  'cag-audit-regulations': {
    table: 'pages',
    title: 'Audit Regulation',
    addTitle: 'Update Audit Regulation',
    searchColumn: 'title_en',
    columns: [
      { key: 'title_en', label: 'Title (EN)' },
      { key: 'title_hi', label: 'Title (HI)' },
      { key: 'slug', label: 'Slug' },
      { key: 'upload_file', label: 'Attachment', type: 'link' },
      { key: 'is_active', label: 'Status', type: 'boolean' },
    ],
    formFields: [
      { name: 'title_en', label: 'Title (English)', type: 'text', required: true },
      { name: 'title_hi', label: 'Title (Hindi)', type: 'text', isHindi: true },
      { name: 'slug', label: 'URL Slug', type: 'text', required: true },
      { name: 'excerpt_en', label: 'Excerpt (English)', type: 'textarea' },
      { name: 'excerpt_hi', label: 'Excerpt (Hindi)', type: 'textarea', isHindi: true },
      { name: 'content_en', label: 'Content (English)', type: 'richtext' },
      { name: 'content_hi', label: 'Content (Hindi)', type: 'richtext', isHindi: true },
      { name: 'upload_file', label: 'Regulations Gazette / Book (PDF)', type: 'file' },
      { name: 'is_active', label: 'Active', type: 'boolean' },
    ]
  },
};

