# Busan Public Job Navigator

Busan Public Job Navigator is a complete service architecture that goes beyond simply aggregating recruitment information from Busan Metropolitan City-affiliated public corporations and agencies. Based on a young job seeker's profile, it provides **application eligibility assessment, job posting summaries, risk factor detection, roadmap generation, cover letter experience matching, change detection, and links to youth support policies**.

## 1. Core Features

- Integrated job posting dashboard: displays institution, role, employment type, application deadline, D-Day, and original posting link
- Personalized application assessment: automatically classifies postings as immediately applicable, applicable after preparation, or difficult to apply for
- Preparation fit score: calculated based on required qualifications, preferred qualifications, job interests, experience keywords, and time remaining until the deadline
- AI-powered job posting summary: structures and displays eligibility requirements, preferred qualifications, schedule, required documents, and key precautions
- Risk factor highlighting: detects duplicate applications, no edits after final submission, blind recruitment violations, supporting documents, shift work, and other risks
- Deadline alerts and calendar integration: supports alerts and schedule saving through Expo Notifications and Calendar
- Employment roadmap: automatically generates tasks based on each posting's D-Day and the user's preparation level
- Cover letter coach: analyzes public-sector cover letter prompts by competency and matches them with the user's experiences
- Job posting change center: compares newly imported datasets with previous postings and generates a history of newly added, modified, and deleted postings
- Youth support policy connection: recommends relevant policies based on the user's situation, such as interview support, NCS preparation, and data portfolio development
- DIVE 2026 dataset adapter: converts real datasets by adjusting only the mapping file, even when the provided dataset uses different column names

## 2. Tech Stack

- Expo + React Native + TypeScript
- React Navigation
- AsyncStorage
- Expo DocumentPicker / FileSystem
- Expo Notifications / Calendar
- Local-first architecture: enables demos with sample data even when network conditions at the hackathon venue are unstable

## 3. How to Run

```bash
cd busan-public-job-navigator
npm install
npm run start
```

Run on Android or iOS:

```bash
npm run android
npm run ios
```

Type check:

```bash
npm run typecheck
```

## 4. How to Apply a Dataset

When the actual dataset is provided, apply it in the following order.

1. Place the original file in `data/raw/`.
2. Save it in JSON or CSV format.
3. If the column names differ from the sample, add the original column names to `data/mappings/dive2026.mapping.json`.
4. In the app, go to **My Page → Import Dataset** and select the file.
5. The app converts the data into the standard `JobPosting` schema and generates a change history in the Change Center.

CLI conversion is also available.

```bash
npm run dataset:convert -- data/raw/dive2026.csv data/generated/jobs.normalized.json
```

Or convert the sample dataset:

```bash
npm run dataset:sample
```

## 5. Standard Job Posting Schema

Internally, the app standardizes all job postings into the following structure.

- `id`, `sourceId`
- `title`, `institution`, `department`
- `employmentType`, `jobCategory`, `roles`
- `recruitCount`, `workRegion`, `workLocation`
- `applicationStartAt`, `applicationEndAt`
- `applicationUrl`, `originalUrl`, `attachmentUrls`
- `eligibility`: education, major, experience, required qualifications, residence, and other requirements
- `preferences`: preferred qualifications, preferred applicant groups, and keywords
- `process`: recruitment process stages
- `documents`: required documents
- `cautions`: important notes and precautions
- `tags`: search and recommendation tags
- `originalPayload`: preserved original data

## 6. Project Structure

```text
busan-public-job-navigator/
  App.tsx
  app.json
  package.json
  data/
    sample/               # Sample job postings, policies, and change history for demo
    raw/                  # Location for importing the original DIVE 2026 dataset
    mappings/             # Dataset column mapping files
    generated/            # Location for saving converted output
  scripts/
    convert-dive-dataset.ts
  src/
    components/           # Cards, badges, buttons, and screen layouts
    context/              # Global data state and storage integration
    data/                 # Default profile and cover letter prompts
    navigation/           # Stack/Tab navigation
    screens/              # Home, search, detail, roadmap, cover letter, my page, dataset, and change center screens
    services/             # Recommendation, assessment, summary, roadmap, change detection, and dataset adapter services
    theme/                # Colors, spacing, and typography
    types/                # Domain types
    utils/                # Date and text utilities
```

## 8. Next Development Steps

When the detailed structure of the dataset is released during the hackathon finals, prioritize the following improvements.

- Extract text from attached PDF files and connect an LLM-based summary API
- Build institution-specific original posting link crawlers or OpenAPI synchronization jobs
- Implement personal data consent handling and local encrypted storage
- Move push notifications to a server-based architecture
- Build an administrator web console for data review and validation
- Integrate real Busan youth support policy APIs or official links
