#!/usr/bin/env python3

from __future__ import annotations

import shutil
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps
from reportlab.lib.pagesizes import A4
from reportlab.lib.utils import ImageReader
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parents[1]
TMP_DIR = ROOT / "tmp" / "pdfs"
OUTPUT_PDF = ROOT / "output" / "pdf" / "kimminjae-portfolio.pdf"
PUBLIC_PDF = ROOT / "public" / "downloads" / "kimminjae-portfolio.pdf"
PROFILE_IMAGE = ROOT / "src" / "assets" / "images" / "MyPicture.jpeg"
FONT_PATH = Path("/System/Library/Fonts/AppleSDGothicNeo.ttc")

DPI = 150
PAGE_WIDTH = 1240
PAGE_HEIGHT = 1754
MARGIN = 88

BG = "#0b1120"
PANEL = "#101827"
CARD = "#0f1726"
BORDER = "#273346"
TEXT = "#eef4ff"
TEXT_MUTED = "#b6c3d8"
TEXT_SUBTLE = "#8fa2bf"
ACCENT = "#7ea2f0"


PROFILE = {
    "name": "김민재",
    "title": "Backend Engineer · Malware Analyst",
    "headline": "무한한 공학의 세계",
    "lead": (
        "공학은 무한한 탐구의 여정입니다. 저는 이 여정에서 매일 새로운 도전을 즐기며, "
        "깊이 있는 분석과 창의적인 솔루션을 통해 문제를 해결하는 것을 좋아합니다."
    ),
    "email": "kimminje661@outlook.kr",
    "github": "https://github.com/fixgramwork",
    "velog": "https://velog.io/@fixgram003/posts",
    "notion": (
        "https://fixgram.notion.site/135532fb19db80edb8b7c45d41e3c78f"
        "?v=135532fb19db8176a4d0000c6f34383d&source=copy_link"
    ),
}

METRICS = [
    ("출시 프로젝트", "1"),
    ("평균 Lighthouse", "96"),
    ("보안+개발 경력", "0년"),
]

PROJECTS = [
    {
        "title": "HLab",
        "summary": "개인 소프트웨어 연구실",
        "impact": "업무 기록률 +31% 상승",
        "stack": "Vue 3, ECharts, FastAPI, Jenkins, GCP",
        "links": [
            "Web Repo: github.com/fixgramwork/HLab-Web",
            "Backend Repo: github.com/fixgramwork/HLab-Backend",
        ],
    },
    {
        "title": "CLUE",
        "summary": "클라우드 기반 통합 교육 서비스",
        "impact": "기존 서비스 대비 사용자 이동 시간 80% 절약",
        "stack": "SpringBoot, Fastapi, AWS, GitAction",
        "links": [
            "Workspace Notion: victorious-secure-70d.notion.site",
            "Git Organization: github.com/SIZZ-Project",
        ],
    },
    {
        "title": "SIZZ",
        "summary": "신뢰성 있는 뉴스 플랫폼",
        "impact": "일일 활성 사용자 +15%",
        "stack": "Next, TypeScript, Tailwind, Axios",
        "links": [
            "Workspace Notion: accurate-oak-9c7.notion.site",
            "Git Organization: github.com/SIZZ-Project",
        ],
    },
]

PRINCIPLES = [
    "장식보다 구조를 먼저 설계",
    "문제의 본질을 탐색하고 해결책을 명확히",
    "협업과 팀원들의 성장을 중시",
    "측정 가능한 성과 개선",
]

AWARDS = [
    ("2025", "서울대학교 SCSC 온라인 해커톤 (최우수상, 1등)", "SCSC 연구 동호회"),
    ("2025", "WHITEHACK CONST (10등)", "BSSM"),
    ("2025", "2025 BSSM 전공 동아리 대회 (장려상, 6등)", "BSSM"),
    ("2024", "2024 동계 AppJam (최우수상, 1등)", "AppJam"),
    ("2024", "2024 부경대학교 정보보안 영재 교육 (우수 학생)", "부경대학교 영재교육원"),
    ("2024", "BSSM 2024 하계 해커톤 (인기상, 4등)", "BSSM"),
]

STUDY_LINKS = [
    "Velog: velog.io/@fixgram003/posts",
    "Tistory: hading25.tistory.com",
    "Notion: fixgram.notion.site/135532fb19db80edb8b7c45d41e3c78f",
]


def font(size: int) -> ImageFont.FreeTypeFont:
    if not FONT_PATH.exists():
        raise FileNotFoundError(f"Required font not found: {FONT_PATH}")
    return ImageFont.truetype(str(FONT_PATH), size=size)


def text_width(draw: ImageDraw.ImageDraw, value: str, text_font: ImageFont.FreeTypeFont) -> int:
    left, _, right, _ = draw.textbbox((0, 0), value, font=text_font)
    return right - left


def line_height(text_font: ImageFont.FreeTypeFont) -> int:
    _, top, _, bottom = text_font.getbbox("김민재Portfolio")
    return bottom - top


def wrap_text(
    draw: ImageDraw.ImageDraw,
    text: str,
    text_font: ImageFont.FreeTypeFont,
    max_width: int,
) -> list[str]:
    if not text:
        return []

    wrapped: list[str] = []
    for paragraph in text.splitlines():
        if not paragraph.strip():
            wrapped.append("")
            continue

        current = ""
        for word in paragraph.split(" "):
            candidate = word if not current else f"{current} {word}"
            if text_width(draw, candidate, text_font) <= max_width:
                current = candidate
                continue

            if current:
                wrapped.append(current)
                current = ""

            chunk = ""
            for char in word:
                candidate_chunk = f"{chunk}{char}"
                if not chunk or text_width(draw, candidate_chunk, text_font) <= max_width:
                    chunk = candidate_chunk
                    continue
                wrapped.append(chunk)
                chunk = char
            current = chunk

        if current:
            wrapped.append(current)

    return wrapped


def draw_paragraph(
    draw: ImageDraw.ImageDraw,
    text: str,
    x: int,
    y: int,
    max_width: int,
    text_font: ImageFont.FreeTypeFont,
    fill: str,
    line_gap: int,
) -> int:
    lines = wrap_text(draw, text, text_font, max_width)
    height = line_height(text_font)
    for line in lines:
        draw.text((x, y), line, font=text_font, fill=fill)
        y += height + line_gap
    return y


def draw_header_footer(draw: ImageDraw.ImageDraw, page_number: int) -> None:
    draw.line((MARGIN, 38, PAGE_WIDTH - MARGIN, 38), fill=BORDER, width=2)
    draw.line((MARGIN, PAGE_HEIGHT - 64, PAGE_WIDTH - MARGIN, PAGE_HEIGHT - 64), fill=BORDER, width=2)
    footer_font = font(18)
    draw.text((MARGIN, PAGE_HEIGHT - 48), "Kim Minjae Portfolio", font=footer_font, fill=TEXT_SUBTLE)
    right_text = f"Page {page_number}"
    right_width = text_width(draw, right_text, footer_font)
    draw.text(
        (PAGE_WIDTH - MARGIN - right_width, PAGE_HEIGHT - 48),
        right_text,
        font=footer_font,
        fill=TEXT_SUBTLE,
    )


def card(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], fill: str = CARD) -> None:
    draw.rounded_rectangle(box, radius=28, fill=fill, outline=BORDER, width=2)


def render_profile_image() -> Image.Image:
    image = Image.open(PROFILE_IMAGE).convert("RGB")
    return ImageOps.fit(image, (248, 320), method=Image.Resampling.LANCZOS)


def section_kicker(draw: ImageDraw.ImageDraw, label: str, x: int, y: int) -> int:
    kicker_font = font(20)
    draw.text((x, y), label.upper(), font=kicker_font, fill=ACCENT)
    return y + line_height(kicker_font) + 8


def draw_metric_row(page: Image.Image, draw: ImageDraw.ImageDraw, y: int) -> int:
    total_gap = 18
    card_width = (PAGE_WIDTH - (MARGIN * 2) - (total_gap * 2)) // 3
    metric_value_font = font(40)
    metric_label_font = font(20)

    for index, (label, value) in enumerate(METRICS):
        left = MARGIN + index * (card_width + total_gap)
        top = y
        right = left + card_width
        bottom = y + 132
        card(draw, (left, top, right, bottom))

        value_width = text_width(draw, value, metric_value_font)
        draw.text(
            (left + (card_width - value_width) // 2, top + 26),
            value,
            font=metric_value_font,
            fill=TEXT,
        )

        label_lines = wrap_text(draw, label, metric_label_font, card_width - 24)
        label_y = top + 82
        for line in label_lines:
            line_width = text_width(draw, line, metric_label_font)
            draw.text(
                (left + (card_width - line_width) // 2, label_y),
                line,
                font=metric_label_font,
                fill=TEXT_SUBTLE,
            )
            label_y += line_height(metric_label_font) + 4

    return y + 132


def draw_project_block(
    page: Image.Image,
    draw: ImageDraw.ImageDraw,
    project: dict[str, object],
    top: int,
    height: int,
) -> int:
    left = MARGIN
    right = PAGE_WIDTH - MARGIN
    card(draw, (left, top, right, top + height))

    title_font = font(34)
    label_font = font(18)
    value_font = font(22)

    y = top + 28
    draw.text((left + 28, y), project["title"], font=title_font, fill=TEXT)
    y += line_height(title_font) + 20

    fields = [
        ("Summary", project["summary"]),
        ("Impact", project["impact"]),
        ("Stack", project["stack"]),
    ]
    for field_label, field_value in fields:
        draw.text((left + 28, y), field_label, font=label_font, fill=TEXT_SUBTLE)
        y += line_height(label_font) + 6
        y = draw_paragraph(draw, str(field_value), left + 28, y, right - left - 56, value_font, TEXT, 6)
        y += 12

    draw.text((left + 28, y), "Links", font=label_font, fill=TEXT_SUBTLE)
    y += line_height(label_font) + 6
    for link in project["links"]:
        y = draw_paragraph(draw, f"- {link}", left + 28, y, right - left - 56, font(18), TEXT_MUTED, 6)
        y += 4

    return top + height


def build_page_one() -> Path:
    page = Image.new("RGB", (PAGE_WIDTH, PAGE_HEIGHT), BG)
    draw = ImageDraw.Draw(page)
    draw_header_footer(draw, 1)

    hero_box = (MARGIN, 88, PAGE_WIDTH - MARGIN, 570)
    card(draw, hero_box, fill=PANEL)

    x = hero_box[0] + 34
    y = hero_box[1] + 34
    y = section_kicker(draw, "Portfolio", x, y)
    name_font = font(38)
    headline_font = font(58)
    title_font = font(24)
    body_font = font(24)

    draw.text((x, y), PROFILE["name"], font=name_font, fill="#dce7ff")
    y += line_height(name_font) + 6
    draw.text((x, y), PROFILE["headline"], font=headline_font, fill=TEXT)
    y += line_height(headline_font) + 14
    draw.text((x, y), PROFILE["title"], font=title_font, fill=TEXT_MUTED)
    y += line_height(title_font) + 20
    y = draw_paragraph(draw, PROFILE["lead"], x, y, 560, body_font, TEXT_MUTED, 10)
    y += 18
    y = draw_paragraph(
        draw,
        f"Email  {PROFILE['email']}\nGitHub  {PROFILE['github']}",
        x,
        y,
        560,
        font(20),
        TEXT_SUBTLE,
        8,
    )

    profile = render_profile_image()
    page.paste(profile, (PAGE_WIDTH - MARGIN - 282, hero_box[1] + 48))
    draw.rounded_rectangle(
        (PAGE_WIDTH - MARGIN - 282, hero_box[1] + 48, PAGE_WIDTH - MARGIN - 34, hero_box[1] + 368),
        radius=24,
        outline=BORDER,
        width=2,
    )

    y = draw_metric_row(page, draw, 610) + 44
    y = section_kicker(draw, "Selected Work", MARGIN, y)
    heading_font = font(34)
    desc_font = font(22)
    draw.text((MARGIN, y), "대표 프로젝트", font=heading_font, fill=TEXT)
    y += line_height(heading_font) + 8
    y = draw_paragraph(
        draw,
        "프론트엔드와 백엔드를 모두 다루며 결과 지표로 연결한 작업들입니다.",
        MARGIN,
        y,
        PAGE_WIDTH - (MARGIN * 2),
        desc_font,
        TEXT_MUTED,
        6,
    )
    y += 18
    draw_project_block(page, draw, PROJECTS[0], y, 470)

    output_path = TMP_DIR / "kimminjae-portfolio-page-1.png"
    page.save(output_path, optimize=True)
    return output_path


def build_page_two() -> Path:
    page = Image.new("RGB", (PAGE_WIDTH, PAGE_HEIGHT), BG)
    draw = ImageDraw.Draw(page)
    draw_header_footer(draw, 2)

    y = 98
    y = section_kicker(draw, "Projects", MARGIN, y)
    heading_font = font(34)
    body_font = font(22)
    draw.text((MARGIN, y), "서비스 중심 프로젝트 아카이브", font=heading_font, fill=TEXT)
    y += line_height(heading_font) + 10
    y = draw_paragraph(
        draw,
        "문제 정의, 구현, 배포, 운영까지 전체 흐름을 책임지는 방식으로 작업했습니다.",
        MARGIN,
        y,
        PAGE_WIDTH - (MARGIN * 2),
        body_font,
        TEXT_MUTED,
        6,
    )

    y = 280
    y = draw_project_block(page, draw, PROJECTS[1], y, 490) + 24
    draw_project_block(page, draw, PROJECTS[2], y, 490)

    output_path = TMP_DIR / "kimminjae-portfolio-page-2.png"
    page.save(output_path, optimize=True)
    return output_path


def draw_awards_table(draw: ImageDraw.ImageDraw, top: int) -> int:
    left = MARGIN
    right = PAGE_WIDTH - MARGIN
    row_height = 74
    table_height = row_height * (len(AWARDS) + 1)
    card(draw, (left, top, right, top + table_height), fill=PANEL)

    year_x = left + 28
    title_x = left + 160
    org_x = right - 250
    header_font = font(20)
    body_font = font(19)

    draw.text((year_x, top + 22), "Year", font=header_font, fill=TEXT_SUBTLE)
    draw.text((title_x, top + 22), "Award", font=header_font, fill=TEXT_SUBTLE)
    draw.text((org_x, top + 22), "Organizer", font=header_font, fill=TEXT_SUBTLE)

    for row_index in range(1, len(AWARDS) + 1):
        y = top + row_index * row_height
        draw.line((left + 2, y, right - 2, y), fill=BORDER, width=2)

    for index, (year, title, organizer) in enumerate(AWARDS):
        row_top = top + row_height * (index + 1) + 18
        draw.text((year_x, row_top), year, font=body_font, fill=TEXT)
        draw_paragraph(draw, title, title_x, row_top, org_x - title_x - 24, body_font, TEXT, 4)
        draw_paragraph(draw, organizer, org_x, row_top, right - org_x - 28, body_font, TEXT_MUTED, 4)

    return top + table_height


def draw_side_panel(
    draw: ImageDraw.ImageDraw,
    box: tuple[int, int, int, int],
    title: str,
    lines: list[str],
) -> None:
    card(draw, box)
    title_font = font(26)
    body_font = font(20)
    x = box[0] + 26
    y = box[1] + 24
    draw.text((x, y), title, font=title_font, fill=TEXT)
    y += line_height(title_font) + 18
    for line in lines:
        y = draw_paragraph(draw, f"- {line}", x, y, box[2] - box[0] - 52, body_font, TEXT_MUTED, 6)
        y += 8


def build_page_three() -> Path:
    page = Image.new("RGB", (PAGE_WIDTH, PAGE_HEIGHT), BG)
    draw = ImageDraw.Draw(page)
    draw_header_footer(draw, 3)

    y = 98
    y = section_kicker(draw, "Awards", MARGIN, y)
    heading_font = font(34)
    desc_font = font(22)
    draw.text((MARGIN, y), "수상 경력과 작업 원칙", font=heading_font, fill=TEXT)
    y += line_height(heading_font) + 10
    y = draw_paragraph(
        draw,
        "학습 속도와 실전 문제 해결력을 검증한 최근 이력입니다.",
        MARGIN,
        y,
        PAGE_WIDTH - (MARGIN * 2),
        desc_font,
        TEXT_MUTED,
        6,
    )
    y += 18
    y = draw_awards_table(draw, y) + 28

    gutter = 22
    panel_width = (PAGE_WIDTH - (MARGIN * 2) - gutter) // 2
    left_box = (MARGIN, y, MARGIN + panel_width, PAGE_HEIGHT - 150)
    right_box = (MARGIN + panel_width + gutter, y, PAGE_WIDTH - MARGIN, PAGE_HEIGHT - 150)
    draw_side_panel(draw, left_box, "Working Principles", PRINCIPLES)

    contact_lines = [
        f"Email: {PROFILE['email']}",
        "GitHub: github.com/fixgramwork",
        *STUDY_LINKS,
    ]
    draw_side_panel(draw, right_box, "Contact & Study Links", contact_lines)

    output_path = TMP_DIR / "kimminjae-portfolio-page-3.png"
    page.save(output_path, optimize=True)
    return output_path


def build_pdf(page_paths: list[Path]) -> None:
    OUTPUT_PDF.parent.mkdir(parents=True, exist_ok=True)
    PUBLIC_PDF.parent.mkdir(parents=True, exist_ok=True)

    pdf = canvas.Canvas(str(OUTPUT_PDF), pagesize=A4)
    for page_path in page_paths:
        pdf.drawImage(ImageReader(str(page_path)), 0, 0, width=A4[0], height=A4[1])
        pdf.showPage()
    pdf.save()
    shutil.copy2(OUTPUT_PDF, PUBLIC_PDF)


def main() -> None:
    TMP_DIR.mkdir(parents=True, exist_ok=True)
    page_paths = [build_page_one(), build_page_two(), build_page_three()]
    build_pdf(page_paths)


if __name__ == "__main__":
    main()
