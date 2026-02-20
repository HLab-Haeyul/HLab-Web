# Blog API v1 Design

## Goal

- 프론트 현재 구현(`src/services/blogApi.ts`, `src/services/blogInteractionApi.ts`)과 바로 호환되는 REST API 계약.
- 블로그 목록/상세/좋아요/댓글 기능 지원.
- 게시글 미디어(이미지/동영상)는 선택값(optional)으로 처리.

## Base

- Base URL: `/api/blog`
- Content-Type: `application/json`
- Locale: `locale` query 필수 (`ko` | `en`)

## Response Envelope

프론트는 아래 두 형태 모두 허용:

1. `{"data": ...}`
2. `{...}` (raw payload)

권장: `{"data": ...}` 형태로 통일.

공통 에러 형식 권장:

```json
{
  "error": {
    "code": "BAD_REQUEST",
    "message": "Invalid locale",
    "details": {}
  }
}
```

## Enums

```ts
type Locale = 'ko' | 'en'
type BlogCategoryKey = 'tech' | 'retrospective' | 'selfDev'
```

## Schemas

### BlogPost

```json
{
  "slug": "vue-state-pitfalls",
  "title": "Vue 상태 관리에서 자주 놓치는 경계선",
  "excerpt": "컴포넌트 분리와 상태 소유권...",
  "publishedAt": "2026.02.11",
  "readTime": "7분",
  "tags": ["Vue", "Architecture", "State"],
  "category": "tech"
}
```

### PopularPost

- `BlogPost` + `heroTag`, `highlight`, `bannerBackground`

### BlogPageCopySet (블로그 메인)

```json
{
  "kicker": "STUDY ARCHIVE",
  "heading": "내가 공부한 기록을 쌓는 블로그",
  "description": "...",
  "popularKicker": "인기 글",
  "popularHeading": "인기글 Top 5",
  "popularDescription": "...",
  "readLabel": "글 읽기",
  "categories": {
    "tech": { "title": "기술", "description": "..." },
    "retrospective": { "title": "프로젝트 회고", "description": "..." },
    "selfDev": { "title": "자기 개발", "description": "..." }
  },
  "popularPosts": [],
  "posts": []
}
```

### BlogPostDetail (상세)

- `BlogPost` + `heroTag`, `authorName`
- 본문: `markdown` 권장(필수), 구버전 호환용으로 `content: string[]`도 허용 가능
- 미디어는 optional

```json
{
  "slug": "vue-state-pitfalls",
  "title": "...",
  "excerpt": "...",
  "publishedAt": "2026.02.11",
  "readTime": "7분",
  "tags": ["Vue"],
  "category": "tech",
  "heroTag": "Tech Deep Dive",
  "authorName": "김민재",
  "markdown": "## 제목\\n\\n본문",
  "images": [
    {
      "src": "https://cdn.example.com/posts/1/cover.png",
      "alt": "cover image",
      "caption": "optional"
    }
  ],
  "videos": [
    {
      "src": "https://cdn.example.com/posts/1/demo.mp4",
      "title": "demo",
      "poster": "https://cdn.example.com/posts/1/poster.jpg",
      "autoplay": false,
      "muted": false,
      "loop": false
    }
  ]
}
```

### EngagementPayload

```json
{
  "likes": 42,
  "liked": true,
  "comments": [
    {
      "id": "cmt_123",
      "authorName": "익명",
      "body": "좋은 글 감사합니다.",
      "createdAt": "2026-02-19T08:30:00.000Z"
    }
  ]
}
```

## Endpoints

### 1) 블로그 메인 데이터

- `GET /api/blog?locale=ko|en`

Response `200`:

- `BlogPageCopySet`

Validation:

- `locale` 없거나 잘못되면 `400`.

---

### 2) 게시글 상세

- `GET /api/blog/{slug}?locale=ko|en`

Response:

- `200`: `BlogPostDetail`
- `404`: slug 없음

Validation:

- `slug` path decode 가능해야 함
- `markdown` 없고 `content`도 없으면 `422` 또는 `500` 대신 서버에서 fallback 생성 권장

---

### 3) 좋아요/댓글 조회

- `GET /api/blog/{slug}/engagement?locale=ko|en`

Response:

- `200`: `EngagementPayload`
- `404`: slug 없음

---

### 4) 좋아요 상태 반영

- `POST /api/blog/{slug}/like?locale=ko|en`

Request:

```json
{
  "liked": true
}
```

Response `200`:

```json
{
  "likes": 43,
  "liked": true
}
```

Notes:

- 이 API는 “toggle”이 아니라 “desired state set”으로 구현 권장.
- 동일 요청 재시도 시 결과가 안정적으로 같아야 함(idempotent 성격).

---

### 5) 댓글 작성

- `POST /api/blog/{slug}/comments?locale=ko|en`

Request:

```json
{
  "authorName": "익명",
  "body": "댓글 내용"
}
```

Rules:

- `body`: trim 후 1자 이상, 최대 2,000자 권장
- `authorName`: optional 취급 가능(비어 있으면 서버에서 locale 기본값: `익명`/`Anonymous`)

Response `201`:

- 생성된 `BlogComment`

---

### 6) 블로그 메인 페이지 내용 수정

- `PATCH /api/blog/page-content?locale=ko|en`

Request:

```json
{
  "heading": "내 블로그 새 제목",
  "description": "메인 소개 문구",
  "popularHeading": "이번 주 인기 글",
  "categories": {
    "tech": {
      "title": "기술 아카이브"
    }
  }
}
```

Request type:

```ts
type BlogMainPagePatchInput = Partial<
  Pick<
    BlogPageCopySet,
    | 'kicker'
    | 'heading'
    | 'description'
    | 'popularKicker'
    | 'popularHeading'
    | 'popularDescription'
    | 'readLabel'
    | 'popularPosts'
    | 'posts'
  >
> & {
  categories?: Partial<Record<BlogCategoryKey, Partial<BlogCategoryCopy>>>
}
```

Response `200`:

- 수정 반영된 최신 `BlogPageCopySet` 전체 반환

## Status Codes (권장)

- `200` OK
- `201` Created
- `400` Bad Request (locale/body/형식 오류)
- `404` Not Found (slug)
- `409` Conflict (중복/경합 정책이 있을 때)
- `422` Unprocessable Entity (검증 실패)
- `429` Too Many Requests (좋아요/댓글 rate limit)
- `500` Internal Server Error

## Auth / Session (권장)

- 현재 프론트는 무인증으로도 동작 가능.
- 좋아요 중복 제어를 위해 최소 하나 필요:
  - HttpOnly 쿠키 기반 세션
  - 또는 `X-Client-Id`(UUID) 헤더 + 서버 저장

## DB Minimal Model (권장)

- `blog_posts` (`slug`, `locale`, `title`, `excerpt`, `markdown`, `category`, `published_at`, `read_time`, ...)
- `blog_post_tags` (`post_id`, `tag`)
- `blog_post_media_images` (`post_id`, `src`, `alt`, `caption`, `sort_order`)
- `blog_post_media_videos` (`post_id`, `src`, `title`, `poster`, `autoplay`, `muted`, `loop`, `sort_order`)
- `blog_post_likes` (`post_id`, `actor_id`, `created_at`) unique(`post_id`, `actor_id`)
- `blog_post_comments` (`id`, `post_id`, `author_name`, `body`, `created_at`)

## Frontend Compatibility Checklist

- `GET /api/blog` -> `BlogPageCopySet` 정확히 반환
- `GET /api/blog/{slug}` -> `markdown` 문자열 반환 (images/videos는 없어도 됨)
- `GET /engagement` -> `likes, liked, comments[]`
- `POST /like` -> `likes, liked`
- `POST /comments` -> 생성 댓글 1건
- `PATCH /page-content` -> 수정된 `BlogPageCopySet`
