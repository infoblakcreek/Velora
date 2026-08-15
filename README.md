# GamSetu

**GamSetu** is a Gujarati village administration and record-management web application designed to digitize and simplify everyday Panchayat record-keeping.

The application provides a centralized interface for managing village records, receipts, educational registers, and related administrative data.

> 🚧 **Status:** Actively under development

---

## 🌱 Project Overview

GamSetu is being developed to replace fragmented paper-based workflows with a simple, organized digital system.

The goal is to make common Panchayat tasks easier to:

* Create and manage records
* Search and edit existing information
* Import information from existing documents
* Generate printable documents
* Maintain yearly records
* Reduce repetitive manual work
* Keep related administrative information organized

The application is designed with a Gujarati-first user experience.

---

## ✨ Current Modules

### 🧾 Panchayat Receipt / Bill Book

The Bill Book module manages Panchayat receipts and bills.

Features include:

* Create new bills
* Automatically generate bill numbers
* Add and remove bill rows
* Save bills
* Search existing bills
* Edit bills
* Delete bills
* Generate printable bills
* Export bills as PDF
* View reports
* A4 printing layout

---

### 📋 Talapatrak

The Talapatrak module is used for managing village Talapatrak records.

Current features include:

* Talapatrak management dashboard
* Village-based Talapatrak cards
* Create Talapatrak records
* Edit Talapatrak records
* Save records automatically
* Search and sort records
* Manage yearly records
* Three-dot action menu
* Rename Talapatrak
* Copy data
* Duplicate Talapatrak
* Delete Talapatrak
* Independent duplicated records
* A4 landscape printing
* Repeating print headers
* 20 visible rows per printed page

The Talapatrak module is currently being expanded with additional management features.

---

### 📚 Shikshanupakaran

The Shikshanupakaran module manages educational/material-related village records.

Current development includes:

* Record management
* Create and edit records
* Save records
* Delete records
* Card-based management interface
* Integration with related Talapatrak workflows

---

### 📄 Khata Import

The Khata Import system allows existing Khata information to be extracted from uploaded documents and imported into the application.

The system is divided into dedicated modules:

* `khataUpload.js`
* `khataScanner.js`
* `khataParser.js`
* `khataRenderer.js`

The workflow includes:

1. Upload a PDF
2. Read document pages
3. Extract document text
4. Identify Khata numbers
5. Extract the first Khata holder name
6. Convert the extracted information into structured records
7. Import the records into the editor

This allows existing paper/PDF records to be brought into the digital system without manually entering every record.

---

## 🏗️ Technology

GamSetu is currently built using:

* HTML
* CSS
* JavaScript
* Firebase
* Cloud Firestore
* PDF.js
* OCR/text extraction
* html2canvas
* jsPDF
* Font Awesome

The application is primarily a client-side web application with Firebase providing authentication and database functionality.

---

## 🔥 Firebase

Firebase is used for:

* Authentication
* Cloud Firestore
* Persistent record storage

The application uses authenticated access for administrative data.

---

## 🖨️ Printing

Printing is an important part of GamSetu because many Panchayat workflows still require physical documents.

The application includes print-specific layouts designed for:

* A4 paper
* Landscape orientation where required
* Repeating headers
* Fixed row counts
* Black-and-white printing
* Clean government-document-style layouts

---

## 📁 Project Structure

The project is organized into separate modules so that each major feature has its own responsibilities.

Example:

```text
GamSetu/
│
├── index.html
│
├── css/
│
├── js/
│   ├── talapatrak.js
│   ├── khataUpload.js
│   ├── khataScanner.js
│   ├── khataParser.js
│   ├── khataRenderer.js
│   └── shikshanupakaran.js
│
└── README.md
```

The exact structure may change as development continues.

---

## 🧠 Development Philosophy

GamSetu is being developed with a focus on:

**Simple → Reliable → Practical → Printable**

The goal is not to create unnecessary complexity, but to make real administrative workflows easier for the people who use them.

Special attention is given to:

* Clear interfaces
* Gujarati language support
* Reliable data storage
* Safe record duplication
* Year-based record management
* Importing existing records
* Reducing repetitive work
* Practical printing

---

## 🚧 Development Status

GamSetu is currently under active development.

Some modules are functional while others are still being refined.

Current development focus includes:

* Talapatrak management
* Record duplication
* Record renaming
* Copy functionality
* Khata document import
* Data validation
* Print workflows
* Database reliability
* User experience improvements

---

## 🔗 Original CodePen

The project originally began as a CodePen prototype.

Original CodePen:

https://codepen.io/editor/Kirakim/pen/019f7a4e-1705-7432-b53a-1f715d1f539b/918648ae9239d5dccda18470a2e73d19

The project has since evolved beyond the original prototype into a larger application.

---

## 📌 Project Status

**GamSetu — In Development**

Built to make village administration simpler, more organized, and more digital.
