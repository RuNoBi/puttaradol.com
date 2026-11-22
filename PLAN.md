# puttaradol.com — แผน Portfolio Website

> เป้าหมาย: เว็บ portfolio สำหรับสมัครฝึกงาน **Data Engineer**
> สไตล์ high-end, creative interactive แต่อ่านง่าย · ภาษาอังกฤษล้วน · ฟอนต์ Inter
> Deploy บน Vercel → domain `puttaradol.com`

---

## 1. หลักคิดของงานนี้

1. **คนอ่านคือ recruiter / senior engineer** มีเวลาดูประมาณ 30–60 วินาที
   → ภายใน 1 หน้าจอแรกต้องรู้ว่า *คุณคือใคร · ทำอะไร · หาอะไรอยู่ (internship) · ติดต่อยังไง*
2. **Effect มีไว้เสริม ไม่ได้มีไว้แย่งซีน** — ทำให้จำได้ 1 อย่าง (ASCII portrait) แล้วที่เหลือเรียบ, สะอาด
3. **ความเป็น Data Engineer ต้องเห็นจาก design** — ใช้ภาษาภาพของ pipeline, schema, log, query
   แต่ข้อมูลจริง (project, ผลลัพธ์, ตัวเลข) สำคัญกว่าลูกเล่นเสมอ
4. **เร็วและไม่พังบนมือถือ** — Lighthouse ≥ 90, เคารพ `prefers-reduced-motion`

---

## 2. Tech Stack

| ส่วน | เลือกใช้ | ใช้ทำอะไร |
|---|---|---|
| Framework | **Next.js (App Router) + TypeScript** | โครงเว็บ, routing, SEO, OG image |
| Styling | **Tailwind CSS v4** | design tokens, layout |
| Font | **Inter** ผ่าน `next/font/google` | ทั้งเว็บ (ใช้ `font-feature-settings: "tnum"` กับตัวเลข) |
| UI motion | **Motion** (`motion/react`) | hover, enter/exit, layout animation, page transition |
| Scroll motion | **GSAP + ScrollTrigger + SplitText** (`@gsap/react`) | pin section, scrub timeline, text reveal |
| 3D / shader | **Three.js + @react-three/fiber + drei** | ASCII portrait (shader) |
| Smooth scroll | **Lenis** | ผูกกับ ScrollTrigger |
| Content | ไฟล์ TS ใน `src/content/` (ภายหลังย้ายเป็น MDX ได้) | ข้อมูล project, skill, experience |
| Analytics | `@vercel/analytics`, `@vercel/speed-insights` | ดูว่ามีคนเข้ามาจากไหน |
| Hosting | **Vercel** + GitHub | auto-deploy ทุกครั้งที่ push |

**แบ่งหน้าที่ Motion vs GSAP ให้ชัด** (กันโค้ดตีกัน):
- Motion = component-level (ปุ่ม, การ์ด, เมนู, เปลี่ยนหน้า)
- GSAP = scroll-level (pin, scrub, timeline ยาว ๆ)
- ห้ามสองตัวคุม property เดียวกันบน element เดียวกัน

---

## 3. Design System

### สี (dark-first, accent เดียว)
```
--bg:        #0A0A0A   พื้นหลัง
--surface:   #121212   การ์ด / panel
--line:      #222222   เส้นแบ่ง, grid
--text:      #EDEDED   ตัวหนังสือหลัก
--muted:     #8A8A8A   ตัวหนังสือรอง
--accent:    #C6FF3D   (lime) หรือ #3DDCFF (cyan) — เลือกอันเดียว ใช้น้อย ๆ
```
มีปุ่มสลับ light mode ได้ทีหลัง (ไม่จำเป็นใน v1)

### Typography (Inter อย่างเดียว)
| Token | ขนาด | น้ำหนัก | ใช้ที่ |
|---|---|---|---|
| display | `clamp(3.5rem, 9vw, 9rem)` | 600, tracking -0.04em | ชื่อใน hero |
| h2 | `clamp(2rem, 4vw, 3.5rem)` | 500, tracking -0.03em | หัว section |
| body | 1.0625rem / 1.6 | 400 | เนื้อหา |
| label | 0.75rem, uppercase, tracking 0.08em | 500 | ป้ายกำกับแบบ `01 — ABOUT` |

### Layout & Motion tokens
- Grid 12 คอลัมน์, max-width 1440px, gutter 24px (มือถือ 16px)
- Ease หลัก: `cubic-bezier(0.16, 1, 0.3, 1)` (expo-out) · duration 0.6s / 0.9s
- Section label มีเลขกำกับ `01 / 02 / 03` ให้ดูเป็นระบบ เหมือน pipeline stage

---

## 4. โครงสร้างหน้าเว็บ (Information Architecture)

```
/                       หน้าเดียวเลื่อนยาว (one-page)
├── #hero
├── #about
├── #pipeline           "How I work"
├── #projects
├── #stack
├── #experience
└── #contact
/projects/[slug]        หน้า case study ของแต่ละ project
/resume.pdf             ไฟล์ resume ให้ดาวน์โหลด
/404                    หน้า not found แบบ "404 — row not found"
```

### รายละเอียดแต่ละ section

**00 · Boot loader** (≈1.2s, แสดงแค่ครั้งแรกต่อ session)
ข้อความแบบ log ไหลขึ้น: `[ok] loading profile… [ok] connecting warehouse…` แล้ว wipe เข้า hero

**01 · Hero**
- ซ้าย: `PUTTARADOL` ตัวใหญ่ (SplitText reveal), บรรทัดรอง `Data Engineer — seeking internship 2027`, ปุ่ม `View projects` / `Download resume`
- ขวา: **ASCII portrait** (ดูข้อ 5) — เมาส์ลากผ่านแล้วสีจริงค่อย ๆ ไหลออกมา
- มุมล่าง: สถานะ `● Available for internship · Bangkok, TH` + เวลาท้องถิ่นแบบ live

**02 · About**
ย่อหน้าสั้น 3–4 บรรทัด + กล่องข้อมูลแบบ "record":
```
name        Puttaradol ...
role        Data Engineering Intern (candidate)
university  ...
focus       batch & streaming pipelines, data modeling
```

**03 · Pipeline — How I work** (จุดเด่นที่บอกว่าเป็นสายดาต้า)
GSAP pin section, เลื่อนแล้ว data packet วิ่งผ่าน node:
`Sources → Ingest → Transform → Warehouse → Serve`
แต่ละ node มีคำอธิบายสั้น ๆ + tool ที่ใช้จริง (เช่น Airflow, dbt, BigQuery)

**04 · Projects** (3–4 งานที่ดีที่สุด)
การ์ดหน้าตาเหมือน dataset/table metadata:
```
project_name   │ Real-time Ride Analytics
type           │ streaming pipeline
stack          │ Kafka · Spark · PostgreSQL · Grafana
impact         │ 2M events/day · p95 latency 1.2s
```
hover → preview ภาพ/diagram ตามเมาส์ (Motion) · คลิก → `/projects/[slug]`

**หน้า case study** ใช้โครงเดียวกันทุกอัน:
Problem → Architecture diagram → Data model → Key decisions → Results (ตัวเลข) → What I'd improve → GitHub / Demo

**05 · Stack** — แสดงเป็น "schema" แบ่งกลุ่ม
`languages` · `processing & orchestration` · `storage & warehouse` · `cloud` · `tooling`
(แต่ละ skill มีระดับ เช่น `daily / comfortable / learning` — ซื่อสัตย์ดีกว่าแถบ % )

**06 · Experience & Education** — timeline แบบ log พร้อม timestamp

**07 · Contact**
หัวข้อใหญ่ `SELECT * FROM opportunities WHERE you = 'hiring';`
Email (คลิก copy), GitHub, LinkedIn, Resume
Footer: `© 2026 Puttaradol · Built with Next.js · Deployed on Vercel`

---

## 5. ASCII Portrait — วิธีทำ (ตัวเอกของเว็บ)

**พฤติกรรมที่ต้องการ**
- ค่าเริ่มต้น: หน้าเป็นตัวอักษร ASCII สีเทา/ขาวบนพื้นดำ
- เอาเมาส์ไป hover → บริเวณรอบเมาส์ค่อย ๆ **ไล่จากโมโนโครมเป็นสีจริงของรูป**
- เมาส์ออกไปแล้วสี **ค่อย ๆ จางกลับ** (มีหาง trail นุ่ม ๆ ไม่ใช่ตัดฉับ)
- ตัวอักษรรอบเมาส์อาจขยับ/สุ่มเปลี่ยนเล็กน้อย ให้รู้สึกมีชีวิต

**วิธีหลัก: Three.js fragment shader** (ลื่นสุด, 60fps ได้แม้ grid ละเอียด)
1. **เตรียมรูป**: ตัดพื้นหลังออกเป็น PNG โปร่งใส (`portrait.png`), crop หัว–ไหล่, เพิ่ม contrast นิดหน่อย
   → พื้นหลังโปร่งใส = ช่องว่าง ไม่งั้นพื้นขาวจะกลายเป็นตัวอักษรเต็มจอ
2. **Glyph atlas**: วาดชุดตัวอักษรด้วย Inter ลง canvas เรียงจากบางไปหนา เช่น ` .:-=+*#%@` แล้วใช้เป็น texture
   (เพราะวาดตำแหน่งเองทุก cell จึงใช้ Inter ได้ ไม่ต้องใช้ monospace)
3. **Shader ต่อ 1 cell**:
   - sample รูปที่กลาง cell → ได้ `color` และ `luma`
   - `luma` → เลือก glyph จาก atlas
   - อ่านค่า `reveal` จาก **mouse trail texture** (0 = เทา, 1 = สีจริง)
   - `finalColor = mix(vec3(luma), color, smoothstep(0,1,reveal))`
4. **Mouse trail**: render target (FBO) ขนาดเล็ก ทุกเฟรมวาดวงกลมนุ่ม ๆ ตรงเมาส์ แล้วคูณ decay `0.96` → ได้หางที่จางเองอัตโนมัติ
5. Uniforms ที่ปรับได้: `uCellSize`, `uRevealRadius`, `uDecay`, `uTime`

**Fallback / มือถือ**
- จอสัมผัส: แตะ/ลากเพื่อ reveal, หรือ auto-reveal เป็นคลื่นช้า ๆ ทุก ๆ ไม่กี่วินาที
- `prefers-reduced-motion` หรือ WebGL ใช้ไม่ได้ → แสดง ASCII แบบ static (pre-render เป็น SVG/PNG)
- โหลด Canvas ผ่าน `next/dynamic` (`ssr: false`) และแสดง placeholder ไปก่อน กัน LCP ช้า

---

## 6. โครงสร้างโฟลเดอร์

```
port/
├── public/
│   ├── images/
│   │   ├── portrait.png          รูปตัดพื้นหลังแล้ว (ใช้ทำ ASCII)
│   │   └── projects/             ภาพประกอบ project
│   ├── resume.pdf
│   └── favicon.svg
├── src/
│   ├── app/
│   │   ├── layout.tsx            ฟอนต์ Inter, metadata, Lenis provider, analytics
│   │   ├── page.tsx              รวมทุก section
│   │   ├── globals.css           design tokens (Tailwind v4 @theme)
│   │   ├── projects/[slug]/page.tsx
│   │   ├── opengraph-image.tsx   OG image อัตโนมัติ
│   │   ├── sitemap.ts
│   │   ├── robots.ts
│   │   └── not-found.tsx
│   ├── components/
│   │   ├── sections/             Hero, About, Pipeline, Projects, Stack, Experience, Contact
│   │   ├── ascii/
│   │   │   ├── AsciiPortrait.tsx     <Canvas> + fallback
│   │   │   ├── AsciiMaterial.ts      shader material
│   │   │   ├── ascii.frag.glsl
│   │   │   ├── useMouseTrail.ts      FBO trail
│   │   │   └── glyphAtlas.ts
│   │   ├── motion/               Reveal, SplitHeading, MagneticButton
│   │   ├── layout/               Nav, Footer, BootLoader, Cursor
│   │   └── ui/                   Button, Tag, RecordTable, SectionLabel
│   ├── content/
│   │   ├── profile.ts            ชื่อ, bio, ลิงก์ติดต่อ
│   │   ├── projects.ts
│   │   ├── stack.ts
│   │   └── experience.ts
│   ├── lib/
│   │   ├── gsap.ts               register ScrollTrigger / SplitText ครั้งเดียว
│   │   ├── lenis.tsx
│   │   └── utils.ts
│   └── hooks/
│       ├── useReducedMotion.ts
│       └── useIsTouch.ts
├── next.config.ts
├── package.json
└── PLAN.md
```

แนวทาง: **ข้อมูลทั้งหมดอยู่ใน `src/content/`** — อยากแก้ข้อความ/เพิ่ม project แก้ไฟล์เดียว ไม่ต้องไปยุ่งกับ component

---

## 7. Roadmap (ประมาณ 2 สัปดาห์ ทำวันละไม่กี่ชั่วโมง)

| Phase | งาน | ผลลัพธ์ |
|---|---|---|
| **0. Content** | เขียน bio, เลือก 3–4 projects, ทำ resume PDF, ตัดพื้นหลังรูป | มีเนื้อหาครบก่อนเริ่มโค้ด |
| **1. Setup** (วัน 1) | create-next-app, Tailwind, Inter, tokens, push GitHub, เชื่อม Vercel | URL `*.vercel.app` ใช้ได้ตั้งแต่วันแรก |
| **2. Layout** (วัน 2–3) | ทุก section แบบ static ไม่มี animation, responsive ครบ | อ่านรู้เรื่องโดยไม่ต้องมี effect |
| **3. ASCII hero** (วัน 4–6) | shader + mouse trail + fallback | ตัวเอกของเว็บเสร็จ |
| **4. Motion** (วัน 7–9) | Lenis, GSAP pipeline pin, SplitText, Motion hover/transition | ความรู้สึก high-end |
| **5. Case studies** (วัน 10–11) | หน้า `/projects/[slug]` + diagram | เนื้อหาเชิงลึก |
| **6. Polish** (วัน 12–13) | SEO, OG image, a11y, Lighthouse, ทดสอบ Safari/มือถือ | พร้อมส่ง |
| **7. Launch** (วัน 14) | ซื้อ domain, ต่อ DNS, ส่งลิงก์ไปสมัคร | `puttaradol.com` ออนไลน์ |

---

## 8. Deploy & Domain

1. สร้าง repo บน GitHub → push โค้ด
2. Vercel → **Add New Project** → import repo (Next.js detect อัตโนมัติ)
3. ซื้อ `puttaradol.com` (ซื้อผ่าน Vercel Domains ง่ายสุด ไม่ต้องตั้ง DNS เอง; หรือ Cloudflare / Namecheap ราคาถูกกว่า)
4. Vercel → Project → **Settings → Domains** → เพิ่ม `puttaradol.com` และ `www.puttaradol.com`
5. ถ้าซื้อข้างนอก: ตั้ง DNS ตามค่าที่ Vercel แสดงในหน้า Domains (ปกติคือ `A` record สำหรับ apex และ `CNAME` สำหรับ `www`)
6. ตั้ง `www` → redirect ไป `puttaradol.com`; HTTPS ได้อัตโนมัติ

---

## 9. Checklist คุณภาพก่อน launch

- [ ] Lighthouse Performance / Accessibility / SEO ≥ 90 (มือถือ)
- [ ] LCP < 2.5s — ASCII canvas lazy-load, ชื่อใน hero เป็น HTML text ไม่ใช่ canvas
- [ ] `prefers-reduced-motion` ปิด animation หนัก ๆ ได้จริง
- [ ] ใช้คีย์บอร์ดเดินได้ทั้งเว็บ, focus ring เห็นชัด, contrast ผ่าน AA
- [ ] Metadata: title, description, OG image, `sitemap.xml`, `robots.txt`, JSON-LD `Person`
- [ ] ทดสอบ Chrome, Safari (macOS + iOS), จอ 375px / 768px / 1440px
- [ ] ลิงก์ทุกอันใช้ได้, resume เปิดได้, email copy ได้
- [ ] ไม่มีคำผิด (ภาษาอังกฤษทั้งเว็บ)

---

## 10. สิ่งที่ต้องเตรียมมาให้ (Content checklist)

- [ ] ชื่อเต็มภาษาอังกฤษ (ตามที่อยากให้แสดง)
- [ ] มหาวิทยาลัย, คณะ, ชั้นปี, ช่วงเวลาที่ฝึกงานได้
- [ ] Bio 2–3 ประโยค: ทำไมสนใจ data engineering
- [ ] Projects 3–4 อัน: ชื่อ, ปัญหา, stack, ผลลัพธ์เป็นตัวเลข, ลิงก์ GitHub, ภาพ/diagram
- [ ] Skills จริงพร้อมระดับ (daily / comfortable / learning)
- [ ] Experience / กิจกรรม / certificate (ถ้ามี)
- [ ] Email, GitHub, LinkedIn
- [ ] Resume PDF
- [ ] รูปหน้าแบบตัดพื้นหลัง (หรือให้ช่วยตัดจากรูปที่ส่งมาก็ได้)
