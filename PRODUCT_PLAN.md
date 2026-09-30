# Physio Report: product plan

## Purpose

Build a web application for one physiotherapy clinician (the owner's friend) to manage patients and create clinical reports. The clinician signs in and has access to all application features. The application should work on a phone and a laptop.

## Main workflow

1. The clinician logs in.
2. The clinician creates or selects a patient.
3. The clinician creates a report for that patient, either from an available template or by entering the report fields directly.
4. The clinician can edit the report and preview the finished result.
5. The clinician downloads the report as a PDF.
6. The patient and report remain stored in the database and can be opened again from the application.

## Report templates

- Templates contain reusable report fields and layout choices.
- The clinician can choose a template when creating a report and edit templates for future use.
- Changes to a template should not silently change reports that were already saved. A saved report should retain its own content and enough template information to reproduce its preview and PDF.
- The exact fields and report format will be provided by the owner later. Do not assume a final clinical form before those requirements arrive.

## Access and data

- The initial product is for a single clinician with full access; a multi-role permission system is not currently required.
- Login is required for patient, template, and report operations. The backend must verify the session token on protected requests.
- Patient records, report content, and templates are stored in the database. The PDF is generated from the saved report; whether to store the PDF file itself can be decided when export is implemented.
- Patient information is sensitive and should only be accessible through authenticated application endpoints.

## Build order

1. Complete session handling: verify tokens in the backend, attach them to frontend API requests, and add logout.
2. Build patient creation, list, and details with database storage.
3. Gather the exact report fields and define the report data model.
4. Build template creation, editing, and selection.
5. Build report creation, editing, database storage, and a patient report history in the UI.
6. Build report preview and PDF download.
7. Test the full workflow on phone and laptop layouts.

## Current state (2026-09-24)

Registration and login exist, and the dashboard is a static starting screen. Patient pages, report pages, template management, PDF export, and backend token verification are not yet implemented. This plan describes the target behavior, not completed functionality.
