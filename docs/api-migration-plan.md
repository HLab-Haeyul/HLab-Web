# API Migration Plan

## Goal

Move the remaining portfolio and project state off static TypeScript files, in-memory refs, and browser storage so the public pages and admin pages read and write the same backend records.

## Current Frontend State

### Already API-backed

- Admin authentication and session refresh live in `src/shared/api/authApi.ts`.
- Blog list/detail/page-content CRUD lives in `src/entities/blog-post/api/blogApi.ts`.
- Blog likes and comments live in `src/features/blog/post-engagement/api/blogInteractionApi.ts`.
- Portfolio metrics live in `src/features/portfolio/metrics/api/portfolioMetricsApi.ts`.

### Still static or client-only

- Portfolio profile content in `src/entities/profile/model/usePortfolioProfileContent.ts`
  - Reads defaults from `src/entities/profile/model/copy.ts`, `src/entities/profile/model/profileShowcase.ts`, and `src/entities/stack/model/stackDetail.ts`.
  - Persists overrides to `localStorage`.
  - Editable fields today: `heroTitle`, `awards[]`, `careerTimeline[]`, `stackItems[]`.
- Portfolio certificates in `src/entities/certificate/model/usePortfolioCertificates.ts`
  - Reads defaults from `src/entities/certificate/model/certificates.ts`.
  - Persists overrides to `localStorage`.
- Projects in `src/pages/projects/model/useProjectArchivePage.ts`
  - Public pages read `worksByLocale` from `src/entities/project/model/works.ts`.
- Admin project manager in `src/pages/admin/project-manager/model/useAdminProjectManagerPage.ts`
  - Create/update/delete only mutates in-memory state.
  - Nothing persists across reloads.

## Required API Surfaces

### 1. Portfolio Profile Document

Use one locale-scoped document for the editable portfolio profile data that is currently split across hero title, awards, career timeline, and stack items.

Endpoints:

- `GET /api/portfolio/profile?locale=ko|en`
- `PATCH /api/portfolio/profile?locale=ko|en`
- `POST /api/portfolio/profile/reset?locale=ko|en`
  - Recommended if the frontend will stop shipping default seed data for restore flows.

Suggested payload:

```json
{
  "heroTitle": "McKinsey-style problem solving\n발본색원(拔本塞源)한 개발자",
  "awards": [
    {
      "year": "2025",
      "title": "서울대학교 SCSC 온라인 해커톤 (최우수상, 1등)",
      "organizer": "SCSC 연구 동호회",
      "imageSrc": "https://cdn.example.com/awards/scsc-2025.png",
      "imageAlt": "SCSC hackathon award certificate"
    }
  ],
  "careerTimeline": [
    {
      "id": "career-hlab-product",
      "category": "Product Build",
      "role": "Frontend Developer",
      "organization": "HLab",
      "startedAt": "2025-01",
      "endedAt": "2025-03",
      "periodLabel": "2025.01 - 2025.03",
      "durationLabel": "3개월",
      "summary": "개인 서비스 HLab의 초기 설계와 프론트엔드 구현을 맡았습니다.",
      "highlights": [
        "Vue 3 기반 공개 페이지와 관리자 화면 구성",
        "블로그, 포트폴리오, 프로젝트 정보 구조 통합"
      ]
    }
  ],
  "stackItems": [
    {
      "label": "Vue 3",
      "category": "Frontend",
      "proficiency": "Advanced",
      "icon": "logos:vue",
      "imageSrc": "",
      "imageAlt": "",
      "capability": {
        "projectUsed": true,
        "practicalUsed": true,
        "internalsExplored": false
      }
    }
  ],
  "updatedAt": "2026-03-21T00:00:00.000Z"
}
```

Notes:

- `stackTicker` can stay derived on the frontend from `stackItems`.
- Portfolio metrics should keep using the existing `/api/portfolio/metrics` API.
- Read-only copy such as `heroLead`, `principles`, stack page labels, and section headings can stay code-owned for now.

### 2. Portfolio Certificates

The current admin UI edits the entire ordered certificate rail: create, update, duplicate, reorder, delete, and restore default. A bulk locale document is the simplest match.

Endpoints:

- `GET /api/portfolio/certificates?locale=ko|en`
- `PUT /api/portfolio/certificates?locale=ko|en`
- `POST /api/portfolio/certificates/reset?locale=ko|en`
  - Recommended if restore-to-default must work after seed files are removed.

Suggested payload:

```json
{
  "certificates": [
    {
      "title": "정보처리기사",
      "issuer": "한국산업인력공단",
      "issuedAt": "2025-06",
      "credentialId": "1234-5678",
      "description": "백엔드와 시스템 설계 기초 역량을 검증하는 국가기술자격입니다.",
      "tags": ["Backend", "Architecture", "CS"],
      "status": "verified",
      "imageSrc": "https://cdn.example.com/certificates/engineer.png",
      "imageAlt": "정보처리기사 자격증"
    }
  ],
  "updatedAt": "2026-03-21T00:00:00.000Z"
}
```

Notes:

- `PUT` is a better fit than item-level CRUD because the current UI already works on the full ordered list.
- Mutation responses should return the normalized saved list so the frontend can immediately replace local state.

### 3. Projects

Projects should become the single source of truth for:

- Portfolio home featured works
- Project archive page
- Admin project manager

Endpoints:

- `GET /api/projects?locale=ko|en`
- `GET /api/projects/:id?locale=ko|en`
- `POST /api/projects?locale=ko|en`
- `PATCH /api/projects/:id?locale=ko|en`
- `DELETE /api/projects/:id?locale=ko|en`
- `PUT /api/projects/reorder?locale=ko|en`
  - Optional for now, but recommended once explicit ordering is exposed in the admin UI.

Suggested project shape:

```json
{
  "id": "hlab",
  "title": "HLab",
  "summary": "개인 소프트웨어 연구실",
  "impact": "업무 기록률 +31% 상승",
  "stack": ["Vue 3", "ECharts", "FastAPI", "Jenkins", "GCP"],
  "imageSrc": "https://cdn.example.com/projects/hlab.png",
  "imageAlt": "HLab logo",
  "teamRole": "Frontend Developer",
  "troubleshootingMarkdown": "## What broke\n...\n## What changed\n...",
  "collaborationLinks": [
    {
      "name": "Git Repository (Web)",
      "url": "https://github.com/fixgramwork/HLab-Web"
    }
  ],
  "retrospectivePostIds": ["hlab-state-refactor", "hlab-admin-workflow"],
  "displayOrder": 1,
  "updatedAt": "2026-03-21T00:00:00.000Z"
}
```

Notes:

- Public pages only need a subset of these fields today, but the backend model should persist the admin-only fields that already exist in the UI.
- `retrospectivePostIds` should replace the current keyword-based project-to-blog matching in `useProjectArchivePage.ts`.
- `displayOrder` prevents list ordering from depending on array insertion order.

### 4. Image Upload / Storage

The current admin forms read files into base64 data URLs in the browser. That works for demos, but not as a durable content pipeline.

Endpoints:

- `POST /api/uploads/images`
- `DELETE /api/uploads/images/:id`
  - Optional if unused files need cleanup.

Suggested upload response:

```json
{
  "id": "img_01JQ...",
  "url": "https://cdn.example.com/uploads/portfolio/certificate-01.png",
  "contentType": "image/png",
  "width": 1280,
  "height": 720
}
```

Use cases:

- Certificate images
- Award images
- Project images
- Profile photo later, if that section becomes editable

## Non-blocking Later APIs

These are not required to remove local storage and static content from the current editable flow:

- Portfolio copy API for `heroLead`, principles, section copy, and stack page labels
- Portfolio profile photo API if the photo becomes editor-managed
- Explicit portfolio page read model such as `GET /api/portfolio/page?locale=...`
  - Optional optimization if the public page should load one combined document instead of multiple requests

## Frontend Migration Order

1. Add `src/entities/profile/api/portfolioProfileApi.ts`.
2. Add `src/entities/certificate/api/portfolioCertificatesApi.ts`.
3. Add `src/entities/project/api/projectApi.ts`.
4. Add `src/shared/api/uploadApi.ts`.
5. Replace localStorage hydration in `usePortfolioProfileContent.ts` and `usePortfolioCertificates.ts` with API fetch + save flows.
6. Replace `worksByLocale` reads in the portfolio and project pages with `/api/projects`.
7. Persist admin project manager create/update/delete to API using stable project `id` values.
8. Replace `FileReader`-only image persistence with upload API URLs.
9. Remove static seed files only after reset flows and backend responses are stable.

## Backend Contract Notes

- Keep `locale` as a required query parameter to match the current route structure.
- Public `GET` endpoints should be cacheable.
- Write endpoints should require the same admin bearer-token flow already used by the blog APIs.
- Return explicit validation errors and do not silently fall back to seed data or browser storage when the API is unavailable.
- Prefer one consistent response envelope for new APIs, ideally:

```json
{
  "data": {}
}
```

- If reset endpoints are added, the source of truth for defaults must move to the backend. The frontend should not keep hidden backup content once migration is complete.
