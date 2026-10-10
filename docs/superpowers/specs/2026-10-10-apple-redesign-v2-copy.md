# Apple redesign v2: copy deck (EN / RU / UZ)

**Date:** 2026-10-10 · **Status:** Draft for your review · **Spec:** `2026-10-10-apple-redesign-v2-design.md`

How to read this: every string below is new or rewritten. **Source** says where the fact comes from:
**CV** = your CV (EN/RU/UZ PDFs in `public/cv`), **SITE** = a fact already on the live site, **NEW** = my
wording only (UI text, no new fact). Nothing here states a fact that is in neither the CV nor the site.
Items tagged **[confirm]** are the ones I'd like you to check first.

Rules applied: first person, sentence case, no filler adjectives. RU uses masculine first-person forms (as your
RU CV does). UZ is Latin with the straight apostrophe the site already uses. Stack tool names are not translated.
Mark edits inline or just tell me; I'll carry them into all three files.

Sentence-case sweep (mechanical, not listed here): every remaining Title Case string in `ru.json` and `uz.json`
(for example "Отправить Сообщение", "Xabar Yuborish") is lowercased except proper nouns. The diff will show it.

---

## 1. Home

### Hero
| Key | EN | RU | UZ | Source |
|---|---|---|---|---|
| `home.hero.role` | DevOps engineer | DevOps-инженер | DevOps muhandisi | CV |
| `home.hero.lead` | I build cloud infrastructure, CI/CD pipelines and monitoring on AWS and GCP. | Строю облачную инфраструктуру, CI/CD-пайплайны и мониторинг на AWS и GCP. | AWS va GCP'da bulut infratuzilmasi, CI/CD pipeline'lari va monitoring tizimlarini quraman. | CV |
| `home.hero.downloadCV` | Download CV | Скачать CV | CV yuklab olish | existing |
| `home.hero.getInTouch` | Get in touch | Связаться | Bog'lanish | existing |
| `profile.location` | Tashkent, Uzbekistan | Ташкент, Узбекистан | Toshkent, O'zbekiston | existing |

Removed: `home.hero.roles.*` (all five, including `awsCertified`), `home.hero.greeting`, `profile.shortBio`.

### Section headings and links
| Key | EN | RU | UZ |
|---|---|---|---|
| `home.work.title` | Selected work | Избранные работы | Tanlangan ishlar |
| `home.work.all` | All projects | Все проекты | Barcha loyihalar |
| `home.experience.title` | Experience | Опыт | Tajriba |
| `home.experience.more` | More about me | Обо мне подробнее | Men haqimda batafsil |
| `home.stack.title` | Stack | Стек | Texnologiyalar |
| `home.contact.title` | Get in touch | Связаться | Bog'lanish |
| `home.contact.body` | For work, projects or questions, write to {email}. | По вопросам работы и проектов пишите на {email}. | Ish, loyihalar yoki savollar bo'yicha {email} manziliga yozing. |
| `home.contact.cta` | Get in touch | Связаться | Bog'lanish |

(`{email}` renders as a link via `t.rich`.) Removed: all `home.skills.*`, `home.experience.subtitle/viewDetails/showAll/showLess/visit`,
`home.projects.*`, `home.cta.*`. "Learn more ›" reuses `common.learnMore`.

### Stack (rows and items)
| Row label (`home.stack.rows.*`) | EN | RU | UZ | Items (not translated) |
|---|---|---|---|---|
| `cloud` | Cloud | Облако | Bulut | AWS · GCP |
| `containers` | Containers | Контейнеры | Konteynerlar | Docker |
| `cicd` | CI/CD | CI/CD | CI/CD | Jenkins · GitLab CI · GitHub Actions |
| `observability` | Observability | Наблюдаемость | Observability | Prometheus · Grafana · Loki · Alertmanager · ELK · Datadog · Sentry |
| `systems` | Systems | Системы | Tizimlar | Linux · Nginx · Tomcat · Vault · Networking · Load balancing · DNS |
| `data` | Data | Данные | Ma'lumotlar | PostgreSQL · MySQL · MongoDB · Redis · Kafka · RabbitMQ · Solr |
| `scripting` | Scripting | Скрипты | Skriptlar | Python · Bash |

Source: CV "Technologies" block, plus Sentry, Kafka, RabbitMQ and Solr from the KPI/PraaktisGo tech lists on the site.

---

## 2. About

| Key | EN | RU | UZ | Source |
|---|---|---|---|---|
| `about.title` | About | Обо мне | Men haqimda | existing |
| `about.intro.p1` | I'm a DevOps engineer based in Tashkent. I build and run cloud infrastructure on AWS and GCP, automate delivery with Jenkins and Docker, and set up the monitoring that tells a team when something is wrong. | Я DevOps-инженер из Ташкента. Строю и поддерживаю облачную инфраструктуру в AWS и GCP, автоматизирую поставку кода с помощью Jenkins и Docker и настраиваю мониторинг, который сообщает команде, когда что-то идёт не так. | Men Toshkentda ishlaydigan DevOps muhandisiman. AWS va GCP'da bulut infratuzilmasini quraman va ishlatib turaman, Jenkins va Docker yordamida yetkazib berishni avtomatlashtiraman hamda biror narsa noto'g'ri ketganda jamoaga xabar beradigan monitoringni sozlayman. | CV, SITE |
| `about.intro.p2` | I started in frontend development as an intern at DataSite Technology, then moved into DevOps at KPI in 2023. I'm also studying economics at Tashkent State University of Economics. | Я начинал с фронтенд-разработки: был стажёром в DataSite Technology, а в 2023 году перешёл в DevOps в KPI. Параллельно учусь на экономиста в Ташкентском государственном экономическом университете. | Men frontend dasturlashdan boshladim: DataSite Technology'da stajyor bo'ldim, 2023-yilda esa KPI'da DevOps'ga o'tdim. Shuningdek, Toshkent davlat iqtisodiyot universitetida iqtisodiyot yo'nalishida o'qiyman. | CV |
| `about.intro.p3` | Outside work I use Linux, go to the gym and play Clash Royale. **[confirm]** | Вне работы сижу на Linux, хожу в спортзал и играю в Clash Royale. | Ishdan tashqari Linux'dan foydalanaman, sport zaliga qatnayman va Clash Royale o'ynayman. | SITE (old fun facts) |
| `about.sections.experience` | Experience | Опыт | Tajriba | NEW |
| `about.sections.education` | Education | Образование | Ta'lim | existing |
| `about.sections.languages` | Languages | Языки | Tillar | existing |
| `about.education.degree` | Bachelor's degree in economics | Бакалавр экономики | Iqtisodiyot bakalavri | CV |
| `about.languages.level.native` | Native | Родной | Ona tili | CV |
| `about.languages.level.advanced` | Advanced (C1) | Продвинутый (C1) | Ilg'or (C1) | CV |
| `about.languages.level.basic` | Basic (A1) | Базовый (A1) | Boshlang'ich (A1) | CV |

Uzbek: Native · English: Advanced (C1) · Russian: Basic (A1). The institution name and logo are the existing `data.education`
entry. Removed: `about.subtitle`, `about.sections.bio/skills/values/funFacts`, all certification strings, `comingSoon*`.
Company name: v2 uses "KPI" everywhere (as the site does; your CV writes "kpi.com").

---

## 3. Experience (home rows, About rows, detail pages)

Shared labels

| Key | EN | RU | UZ |
|---|---|---|---|
| `experienceDetail.back` | About | Обо мне | Men haqimda |
| `experienceDetail.whatIDid` | What I did | Что я делал | Nima qildim |
| `experienceDetail.company` | Company | Компания | Kompaniya |
| `experienceDetail.dates` | Dates | Период | Davr |
| `experienceDetail.type` | Type | Тип | Turi |
| `experienceDetail.website` | Visit website | Открыть сайт | Saytga o'tish |
| `employmentTypes.*` | Full-time · Freelance · Internship | Полная занятость · Фриланс · Стажировка | To'liq vaqt · Frilanser · Amaliyot |

### KPI (`kpi-com-devops-engineer`)
| Field | EN | RU | UZ |
|---|---|---|---|
| `position` | DevOps engineer | DevOps-инженер | DevOps muhandisi |
| `duration` | May 2023 – present | Май 2023 – настоящее время | May 2023 – hozir |
| `summary` | Observability, secure device-to-cloud integration and AWS cost optimization. | Наблюдаемость, безопасная интеграция устройств с облаком и оптимизация затрат на AWS. | Observability, qurilmalarni bulutga xavfsiz ulash va AWS xarajatlarini optimallashtirish. |
| `points[0]` | Built a central observability stack with Prometheus, Grafana, Loki and Alertmanager, cutting incident response time by 60%. | Построил централизованный стек наблюдаемости на Prometheus, Grafana, Loki и Alertmanager, сократив время реакции на инциденты на 60%. | Prometheus, Grafana, Loki va Alertmanager asosida markazlashtirilgan observability stekini qurdim, bu hodisalarga javob berish vaqtini 60% ga qisqartirdi. |
| `points[1]` | Designed a secure attendance integration for Hikvision face-recognition devices over ISUP 5.0 with outbound TLS, so client sites need no inbound exposure and other systems integrate through an API. | Спроектировал безопасную интеграцию учёта посещаемости для устройств распознавания лиц Hikvision по ISUP 5.0 с исходящим TLS: клиентским площадкам не нужен входящий доступ, а другие системы подключаются через API. | Hikvision yuzni tanish qurilmalari uchun ISUP 5.0 va chiquvchi TLS asosida xavfsiz davomat integratsiyasini loyihaladim: mijoz joylarida kiruvchi ulanish kerak emas, boshqa tizimlar esa API orqali ulanadi. |
| `points[2]` | Wrote a Python Prometheus exporter that exposes business KPIs for real-time monitoring. | Написал на Python экспортёр для Prometheus, который отдаёт бизнес-метрики для мониторинга в реальном времени. | Biznes KPI'larini real vaqtda monitoring qilish uchun Python'da Prometheus eksporteri yozdim. |
| `points[3]` | Automated database schema synchronization across dev, stage and prod with a Python CLI tool, reducing manual errors. | Автоматизировал синхронизацию схем баз данных между dev, stage и prod с помощью CLI-утилиты на Python, что снизило число ручных ошибок. | Dev, stage va prod muhitlari o'rtasida ma'lumotlar bazasi sxemalarini sinxronlashni Python CLI vositasi bilan avtomatlashtirdim, bu qo'lda yo'l qo'yiladigan xatolarni kamaytirdi. |
| `points[4]` | Cut monthly AWS costs by 20% by optimizing EC2 and S3 usage and adopting Savings Plans. | Сократил ежемесячные расходы на AWS на 20%: оптимизировал использование EC2 и S3 и перешёл на Savings Plans. | EC2 va S3 foydalanishini optimallashtirib, Savings Plans'ga o'tib, AWS oylik xarajatlarini 20% ga kamaytirdim. |
| `points[5]` | Prevented production outages by finding Tomcat thread-exhaustion bottlenecks and adding automated recovery. | Предотвратил сбои в продакшене: нашёл узкие места с исчерпанием потоков в Tomcat и добавил автоматическое восстановление. | Tomcat'da oqimlar tugashi bilan bog'liq to'siqlarni topib, avtomatik tiklashni qo'shib, production uzilishlarining oldini oldim. |
| `points[6]` | Upgraded the legacy GitLab Omnibus installation to the latest stable release, strengthening CI/CD security and performance. | Обновил устаревший GitLab Omnibus до последней стабильной версии, повысив безопасность и производительность CI/CD. | Eskirgan GitLab Omnibus'ni oxirgi barqaror versiyaga yangilab, CI/CD xavfsizligi va tezligini oshirdim. |
| `points[7]` | Deployed and managed Docker-based applications across environments and automated builds with Jenkins. | Развёртывал и поддерживал приложения на Docker в разных средах и автоматизировал сборки с помощью Jenkins. | Docker asosidagi ilovalarni turli muhitlarda joylashtirdim va boshqardim, build'larni Jenkins bilan avtomatlashtirdim. |

Sources: points 0–6 are CV bullets in CV order; point 7 is from the site's KPI responsibilities. Dropped because
CV does not support them: "visibility and reliability metrics by 40%", "GitLab performance by 30%", "deployment times by 50%".

### PraaktisGo (`praaktisgo-devops-engineer`), Freelance
| Field | EN | RU | UZ |
|---|---|---|---|
| `position` | DevOps engineer | DevOps-инженер | DevOps muhandisi |
| `duration` | Jan 2025 – Jul 2026 | Январь 2025 – июль 2026 | Yanvar 2025 – iyul 2026 |
| `summary` | Zero-downtime AWS migration, Jenkins CI/CD and 99.9% uptime. | Миграция AWS без простоя, CI/CD на Jenkins и аптайм 99,9%. | AWS'ni to'xtovsiz ko'chirish, Jenkins CI/CD va 99,9% uptime. |
| `points[0]` | Led a zero-downtime migration of production AWS infrastructure to a new account and region, with no data loss. | Руководил миграцией продакшен-инфраструктуры AWS в новый аккаунт и регион без простоя и без потери данных. | Production AWS infratuzilmasini yangi akkaunt va regionga to'xtovsiz va ma'lumotlarni yo'qotmasdan ko'chirishga rahbarlik qildim. |
| `points[1]` | Reached 99.9% uptime with proactive monitoring, alerting and incident prevention. | Достиг аптайма 99,9% благодаря проактивному мониторингу, алертингу и профилактике инцидентов. | Proaktiv monitoring, alerting va hodisalarning oldini olish orqali 99,9% uptime'ga erishdim. |
| `points[2]` | Cut deployment time by 50% with Jenkins CI/CD automation and Docker-based environment standardization. | Сократил время деплоя на 50% за счёт автоматизации CI/CD на Jenkins и стандартизации окружений на Docker. | Jenkins CI/CD avtomatlashtirishi va Docker asosida muhitlarni standartlashtirish orqali deploy vaqtini 50% ga qisqartirdim. |
| `points[3]` | Designed cross-cloud cost tracking and performance monitoring to support a hybrid-cloud strategy. | Спроектировал кросс-облачный учёт затрат и мониторинг производительности для гибридной облачной стратегии. | Gibrid bulut strategiyasini qo'llab-quvvatlash uchun bulutlararo xarajatlarni kuzatish va unumdorlik monitoringini loyihaladim. |
| `points[4]` | Secured $100K in Google Cloud credits (GFS Cloud Program 2024) and $10K in AWS Activate Portfolio credits. | Получил кредиты Google Cloud на $100K (GFS Cloud Program 2024) и кредиты AWS Activate Portfolio на $10K. | Google Cloud'dan $100K kredit (GFS Cloud Program 2024) va AWS Activate Portfolio'dan $10K kredit jalb qildim. |
| `points[5]` | Cut operational overhead by 15% through the Google Workspace Business Plan and cloud cost governance. | Снизил операционные расходы на 15% благодаря тарифу Google Workspace Business и практикам управления облачными затратами. | Google Workspace Business rejasi va bulut xarajatlarini boshqarish amaliyotlari orqali operatsion xarajatlarni 15% ga kamaytirdim. |
| `points[6]` | Enforced security best practices across AWS and GCP, including IAM hardening, network segmentation and controlled access policies. | Внедрил практики безопасности в AWS и GCP: усиление IAM, сегментация сети и политики контролируемого доступа. | AWS va GCP'da xavfsizlik amaliyotlarini joriy etdim: IAM hardening, tarmoq segmentatsiyasi va nazorat ostidagi kirish siyosatlari. |
| `points[7]` | Documented the architecture, deployment workflows and operating standards to help onboarding and continuity. | Задокументировал архитектуру, процессы деплоя и операционные стандарты — для онбординга и преемственности. | Arxitektura, deploy jarayonlari va operatsion standartlarni hujjatlashtirdim — yangi a'zolarni o'rgatish va uzluksizlik uchun. |

Source: all eight are CV bullets.

### DataSite Technology (`datasite-technology-frontend-developer`), Internship **[confirm]**
| Field | EN | RU | UZ |
|---|---|---|---|
| `position` | Frontend engineer (intern) | Фронтенд-инженер (стажёр) | Frontend muhandis (stajyor) |
| `duration` | Sep 2022 – May 2023 | Сентябрь 2022 – май 2023 | Sentyabr 2022 – may 2023 |
| `summary` | Responsive React interfaces built from Figma designs. | Адаптивные интерфейсы на React по макетам из Figma. | Figma dizaynlari asosida React'da adaptiv interfeyslar. |
| `points[0]` | Built responsive web interfaces with HTML5, CSS3, JavaScript and React. | Делал адаптивные веб-интерфейсы на HTML5, CSS3, JavaScript и React. | HTML5, CSS3, JavaScript va React yordamida adaptiv veb-interfeyslar yaratdim. |
| `points[1]` | Turned Figma designs into production-ready pages. | Превращал макеты Figma в готовые к продакшену страницы. | Figma dizaynlarini productionga tayyor sahifalarga aylantirdim. |
| `points[2]` | Worked with backend and DevOps teams and got early exposure to deployment workflows and version control. | Работал с бэкенд- и DevOps-командами и впервые познакомился с процессами деплоя и контролем версий. | Backend va DevOps jamoalari bilan ishladim va deploy jarayonlari hamda versiyalarni boshqarish bilan dastlabki tanishuvga ega bo'ldim. |

Source: CV. This replaces the live EN/RU/UZ text (Oct 2021 – Apr 2023, "Frontend Developer", "mentored junior developers",
"page load by 30%"), which contradicts the CV and `data.ts`. **[confirm]** the CV is right.

---

## 4. Projects

Shared labels

| Key | EN | RU | UZ |
|---|---|---|---|
| `projects.title` | Projects | Проекты | Loyihalar |
| `projects.back` | Projects | Проекты | Loyihalar |
| `projects.whatIBuilt` | What I built | Что я сделал | Nima yaratdim |
| `projects.company` | Company | Компания | Kompaniya |
| `projects.year` | Year | Год | Yil |
| `projects.status.label` | Status | Статус | Holat |
| `projects.status.completed` | Completed | Завершен | Tugallangan |
| `projects.status.inProgress` | In progress | В процессе | Jarayonda |
| `projects.technologies` | Technologies | Технологии | Texnologiyalar |
| `projects.openInTelegram` | Open in Telegram | Открыть в Telegram | Telegram'da ochish |
| `projects.empty.title` | No projects yet | Пока нет проектов | Hozircha loyihalar yo'q |
| `projects.empty.description` | Check back soon. | Загляните позже. | Keyinroq qaytib ko'ring. |
| `common.learnMore` | Learn more | Подробнее | Batafsil |

Removed: `projects.subtitle/featured/featuredBadge/all/viewProject/viewProjectDetails/viewCode/liveDemo/aboutProject/projectLinks`.
Viewer labels (`zoomIn`, `play`, …) are already sentence case and unchanged. Company names are `PraaktisGo`, `KPI`, `KPI`,
and `Personal project` / `Личный проект` / `Shaxsiy loyiha`.

### Jenkins CI/CD pipeline (PraaktisGo · 2025)
| Field | EN | RU | UZ |
|---|---|---|---|
| `title` | Jenkins CI/CD pipeline | CI/CD-пайплайн на Jenkins | Jenkins CI/CD pipeline'i |
| `summary` | An automated build, test and deploy pipeline on Jenkins and AWS, with Prometheus watching the build infrastructure. | Автоматизированный пайплайн сборки, тестирования и деплоя на Jenkins и AWS; за инфраструктурой сборки следит Prometheus. | Jenkins va AWS asosidagi avtomatlashtirilgan build, test va deploy pipeline'i; build infratuzilmasini Prometheus kuzatadi. |
| `outcome` **[confirm]** | Deployment time down 50%. | Время деплоя сократилось на 50%. | Deploy vaqti 50% ga qisqardi. |
| `points[0]` | Automates builds, tests and deployments across dev and prod, with AWS CodeDeploy handling the rollout. | Автоматизирует сборку, тесты и деплой в dev и prod; раскатку выполняет AWS CodeDeploy. | Dev va prod muhitlarida build, test va deploy'ni avtomatlashtiradi; joylashtirishni AWS CodeDeploy bajaradi. |
| `points[1]` | Jenkins agents run on custom AMIs with the build tools preinstalled (JDK, Ant, Git, AWS CLI), and the pipeline provisions agents on demand. | Агенты Jenkins работают на собственных AMI с предустановленными инструментами сборки (JDK, Ant, Git, AWS CLI), а пайплайн создаёт агентов по требованию. | Jenkins agentlari build vositalari (JDK, Ant, Git, AWS CLI) oldindan o'rnatilgan maxsus AMI'larda ishlaydi, pipeline esa agentlarni talab bo'yicha yaratadi. |
| `points[2]` | Build artifacts go to S3 and are deployed with CodeDeploy. | Артефакты сборки попадают в S3 и деплоятся через CodeDeploy. | Build artefaktlari S3'ga yuklanadi va CodeDeploy orqali deploy qilinadi. |
| `points[3]` | Post-build scripts send changelogs and build status to a Telegram group. | Скрипты после сборки отправляют список изменений и статус сборки в группу Telegram. | Build'dan keyingi skriptlar o'zgarishlar ro'yxati va build holatini Telegram guruhiga yuboradi. |
| `points[4]` | Prometheus and node_exporter track resource usage on the Jenkins controller and agents. | Prometheus и node_exporter отслеживают использование ресурсов на контроллере и агентах Jenkins. | Prometheus va node_exporter Jenkins controller va agentlarida resurslardan foydalanishni kuzatadi. |

Key technologies on the tile: Jenkins · AWS CodeDeploy · S3 · Prometheus. Source: SITE description. The 50% outcome is
the CV's PraaktisGo figure; **[confirm]** it belongs to this project.

### HikGateway integration (KPI · 2025)
| Field | EN | RU | UZ |
|---|---|---|---|
| `title` | HikGateway integration | Интеграция HikGateway | HikGateway integratsiyasi |
| `summary` | A remote-device platform that lets Hikvision devices behind NAT and firewalls connect to the cloud, with no inbound exposure at customer sites. | Платформа удалённого подключения: устройства Hikvision за NAT и файрволами выходят в облако, а на площадках клиентов не нужен входящий доступ. | Masofaviy qurilmalar platformasi: NAT va firewall ortidagi Hikvision qurilmalari bulutga ulanadi, mijoz joylarida esa kiruvchi ulanish kerak emas. |
| `outcome` | (none) | | |
| `points[0]` | Devices open persistent, encrypted outbound ISUP connections to a cloud-hosted HikGateway, so customer sites need no static IP and no inbound ports. | Устройства устанавливают постоянные зашифрованные исходящие ISUP-соединения с HikGateway в облаке, поэтому клиентским площадкам не нужны статический IP и входящие порты. | Qurilmalar bulutdagi HikGateway'ga doimiy, shifrlangan chiquvchi ISUP ulanishlarini ochadi, shuning uchun mijoz joylariga statik IP va kiruvchi portlar kerak emas. |
| `points[1]` | HikGateway is the control plane: it handles device registration, session lifecycle, status monitoring and events. | HikGateway выступает плоскостью управления: регистрация устройств, жизненный цикл сессий, мониторинг статуса и события. | HikGateway boshqaruv qatlami vazifasini bajaradi: qurilmalarni ro'yxatga olish, sessiya hayot tsikli, holat monitoringi va hodisalar. |
| `points[2]` | Backend services manage devices, read events and send control commands through HikGateway's ISAPI interfaces over HTTPS, without touching the devices directly. | Бэкенд-сервисы управляют устройствами, читают события и отправляют команды через интерфейсы ISAPI HikGateway по HTTPS, не обращаясь к устройствам напрямую. | Backend xizmatlari qurilmalarni boshqaradi, hodisalarni o'qiydi va boshqaruv buyruqlarini HikGateway'ning ISAPI interfeyslari orqali HTTPS bilan yuboradi, qurilmalarga bevosita murojaat qilmaydi. |
| `points[3]` | The design is outbound-only, TLS-encrypted, network-isolated and API-driven, which suits large multi-tenant deployments. | Архитектура построена на исходящих соединениях, TLS-шифровании, изоляции сети и API-интеграции, что подходит для крупных мультитенантных развёртываний. | Arxitektura faqat chiquvchi ulanishlar, TLS shifrlash, tarmoq izolyatsiyasi va API integratsiyasiga asoslangan, bu yirik multi-tenant joylashtirishlarga mos keladi. |

Key technologies: ISUP 5.0 · HikGateway · ISAPI · TLS. Source: SITE description, CV KPI bullet.

### Monitoring stack (KPI · 2023)
| Field | EN | RU | UZ |
|---|---|---|---|
| `title` | Monitoring stack | Стек мониторинга | Monitoring steki |
| `summary` | A central observability stack for metrics, logs and alerts across KPI's infrastructure and applications. | Централизованный стек наблюдаемости для метрик, логов и алертов по инфраструктуре и приложениям KPI. | KPI infratuzilmasi va ilovalari bo'yicha metrikalar, loglar va alertlar uchun markazlashtirilgan observability steki. |
| `outcome` | Incident response time down 60%. | Время реакции на инциденты сократилось на 60%. | Hodisalarga javob berish vaqti 60% ga qisqardi. |
| `points[0]` | Prometheus collects metrics from node_exporter (system), jmx_exporter (Java), cAdvisor (containers) and a custom exporter for application metrics. | Prometheus собирает метрики через node_exporter (система), jmx_exporter (Java), cAdvisor (контейнеры) и собственный экспортёр метрик приложений. | Prometheus metrikalarni node_exporter (tizim), jmx_exporter (Java), cAdvisor (konteynerlar) va ilova metrikalari uchun maxsus eksporter orqali yig'adi. |
| `points[1]` | Grafana dashboards cover infrastructure health, application performance and business metrics. | Дашборды Grafana показывают состояние инфраструктуры, производительность приложений и бизнес-метрики. | Grafana dashboardlari infratuzilma holati, ilova unumdorligi va biznes metrikalarini ko'rsatadi. |
| `points[2]` | Loki aggregates logs from every service, with Promtail collecting and forwarding them. | Loki агрегирует логи всех сервисов, а Promtail собирает и пересылает их. | Loki barcha xizmatlar loglarini jamlaydi, Promtail esa ularni yig'ib uzatadi. |
| `points[3]` | Alertmanager routes and deduplicates alerts and sends critical ones to Telegram. | Alertmanager маршрутизирует и дедуплицирует алерты, а критические отправляет в Telegram. | Alertmanager alertlarni yo'naltiradi va takrorlanishlarini olib tashlaydi, muhimlarini Telegram'ga yuboradi. |
| `points[4]` | The whole stack runs in containers and is built for high availability. | Весь стек работает в контейнерах и рассчитан на высокую доступность. | Butun stek konteynerlarda ishlaydi va yuqori mavjudlikka mo'ljallangan. |

Key technologies: Prometheus · Grafana · Loki · Alertmanager. Source: SITE description; 60% is a CV figure for this stack.

### SaveThis4Me Telegram bot (Personal project · 2024)
| Field | EN | RU | UZ |
|---|---|---|---|
| `title` | SaveThis4Me Telegram bot | Telegram-бот SaveThis4Me | SaveThis4Me Telegram boti |
| `summary` | A public Telegram bot that saves videos and posts from Instagram, YouTube, TikTok, X, Reddit and Pinterest into your chat. | Публичный Telegram-бот, который сохраняет видео и посты из Instagram, YouTube, TikTok, X, Reddit и Pinterest прямо в чат. | Instagram, YouTube, TikTok, X, Reddit va Pinterest'dagi video va postlarni to'g'ridan-to'g'ri chatga saqlaydigan ommaviy Telegram bot. |
| `outcome` | (none) | | |
| `points[0]` | Paste a link and get the media back as a native Telegram video, photo or album. | Отправьте ссылку и получите медиа обратно как обычное видео, фото или альбом Telegram. | Havolani yuboring va media'ni Telegram'ning o'z video, rasm yoki albomi ko'rinishida qaytarib oling. |
| `points[1]` | Instagram users can bind their account and share posts to the @savethis4me relay account from the Instagram app, delivered through signed Meta webhooks. | Пользователи Instagram могут привязать аккаунт и делиться постами с аккаунтом @savethis4me прямо из приложения Instagram; доставка идёт через подписанные вебхуки Meta. | Instagram foydalanuvchilari akkauntini bog'lab, postlarni Instagram ilovasidan @savethis4me akkauntiga ulashishi mumkin; yetkazib berish imzolangan Meta webhook'lari orqali amalga oshadi. |
| `points[2]` | YouTube links open a quality picker with estimated file sizes and an audio-only option, and downloads run in a background job queue with live progress and per-user limits. | Ссылки YouTube открывают выбор качества с оценкой размера файла и вариантом «только аудио»; загрузки идут через фоновую очередь с живым прогрессом и лимитами на пользователя. | YouTube havolalari sifat tanlash oynasini ochadi: fayl hajmi taxminan ko'rsatiladi va faqat audio varianti bor; yuklashlar fon navbatida jonli progress va foydalanuvchi limitlari bilan bajariladi. |
| `points[3]` | Built-in tools recognize songs with Shazam, turn videos into round video notes and extract voice notes. | Встроенные инструменты распознают песни через Shazam, превращают видео в круглые видеосообщения и извлекают голосовые. | Ichki vositalar qo'shiqlarni Shazam orqali taniydi, videolarni dumaloq video xabarlarga aylantiradi va ovozli xabarlarni ajratib oladi. |
| `points[4]` | Written in Python with python-telegram-bot and FastAPI, using yt-dlp, gallery-dl and FFmpeg; users, cached media and metrics live in PostgreSQL, and everything runs in Docker with per-domain concurrency limits and rate limiting. | Написан на Python с python-telegram-bot и FastAPI, использует yt-dlp, gallery-dl и FFmpeg; пользователи, кэш медиа и метрики хранятся в PostgreSQL, всё работает в Docker с лимитами параллельности по доменам и rate limiting. | Python'da python-telegram-bot va FastAPI bilan yozilgan, yt-dlp, gallery-dl va FFmpeg'dan foydalanadi; foydalanuvchilar, keshlangan media va metrikalar PostgreSQL'da saqlanadi, hammasi Docker'da domen bo'yicha parallellik limitlari va rate limiting bilan ishlaydi. |
| `points[5]` | It began as an invite-only hobby project for Instagram Reels and Stories and was rebuilt from scratch as an open bot. | Начинался как закрытый хобби-проект для Instagram Reels и Stories, затем был полностью переписан как открытый бот. | Instagram Reels va Stories uchun faqat taklif bilan ishlaydigan hobbi loyiha sifatida boshlangan, keyin ochiq bot sifatida noldan qayta qurilgan. |

Key technologies: Python · FastAPI · PostgreSQL · Docker. Source: SITE description, condensed. No outcome line.

---

## 5. Contact

| Key | EN | RU | UZ |
|---|---|---|---|
| `contact.header.title` | Get in touch | Связаться | Bog'lanish |
| `contact.form.nameLabel` | Name | Имя | Ism |
| `contact.form.emailLabel` | Email | Email | Email |
| `contact.form.subjectLabel` | Subject | Тема | Mavzu |
| `contact.form.messageLabel` | Message | Сообщение | Xabar |
| `contact.form.namePlaceholder` | Your name | Ваше имя | Ismingiz |
| `contact.form.emailPlaceholder` | you@example.com | you@example.com | you@example.com |
| `contact.form.subjectPlaceholder` | What is it about? | О чём вы хотите написать? | Nima haqida? |
| `contact.form.messagePlaceholder` | Your message | Ваше сообщение | Xabaringiz |
| `contact.form.send` | Send message | Отправить сообщение | Xabar yuborish |
| `contact.form.sending` | Sending… | Отправка… | Yuborilmoqda… |
| `contact.form.success` | Message sent. I'll reply by email. | Сообщение отправлено. Я отвечу по почте. | Xabar yuborildi. Elektron pochta orqali javob beraman. |
| `contact.form.error` | Your message wasn't sent. Please try again. | Сообщение не отправлено. Попробуйте ещё раз. | Xabar yuborilmadi. Qayta urinib ko'ring. |
| `contact.form.invalidEmail` | Enter a valid email address. | Введите корректный адрес электронной почты. | To'g'ri elektron pochta manzilini kiriting. |
| `contact.form.sendAnother` | Send another message | Отправить ещё одно сообщение | Yana xabar yuborish |
| `contact.form.charLimitWarning` | You're close to the character limit. | Вы приближаетесь к лимиту символов. | Belgilar limitiga yaqinlashdingiz. |
| `contact.info.email` | Email | Email | Email |
| `contact.info.phone` | Phone | Телефон | Telefon |
| `contact.info.location` | Location | Город | Joylashuv |

Removed: `contact.header.subtitle`, `contact.form.title/description/name/email/message`, `contact.info.title/description`,
all `contact.responseTimes.*`. Values for email, phone and location come from the profile (CV).

---

## 6. Navigation, footer, 404

| Key | EN | RU | UZ |
|---|---|---|---|
| `navigation.about` / `projects` / `contact` | About · Projects · Contact | Обо мне · Проекты · Контакты | Men haqimda · Loyihalar · Aloqa |
| `navigation.languageNames.*` (endonyms) | English · Русский · O'zbekcha | English · Русский · O'zbekcha | English · Русский · O'zbekcha |
| `footer.copyright` | © {year} {name} | © {year} {name} | © {year} {name} |
| `footer.email` | Email | Почта | Pochta |
| `notFound.title` | Page not found | Страница не найдена | Sahifa topilmadi |
| `notFound.body` | This page doesn't exist or has moved. | Такой страницы нет, или она переехала. | Bunday sahifa yo'q yoki boshqa joyga ko'chirilgan. |
| `notFound.cta` | Back to home | На главную | Bosh sahifaga |

Footer links `GitHub · LinkedIn · X · Instagram` are brand names, not translated. Removed: `footer.template`, `footer.github`,
`profile.lastUpdated`, `ariaLabels.visitGitHub/connectLinkedIn/followTwitter/sendEmail/followInstagram`, and the "CV" nav label.
The CV menu's language names and download strings stay (sentence-cased by the sweep).

---

## 7. Chatbot (UI strings only)

| Key | EN | RU | UZ |
|---|---|---|---|
| `chatbot.welcome` | Hi, I'm Shaxriyor's AI assistant. Ask me about his work, experience or projects. | Здравствуйте, я AI-ассистент Шахрияра. Спросите меня о его работе, опыте или проектах. | Salom, men Shaxriyorning AI yordamchisiman. Uning ishi, tajribasi yoki loyihalari haqida mendan so'rang. |
| `chatbot.popup.title` | Hi, I'm Shaxriyor's AI assistant | Здравствуйте, я AI-ассистент Шахрияра | Salom, men Shaxriyorning AI yordamchisiman |
| `chatbot.popup.subtitle` | Ask me about his work, experience or projects. | Спросите меня о его работе, опыте или проектах. | Uning ishi, tajribasi yoki loyihalari haqida mendan so'rang. |
| `chatbot.popup.startChat` | Start chat | Начать чат | Suhbatni boshlash |
| `chatbot.popup.maybeLater` | Maybe later | Не сейчас | Keyinroq |
| `chatbot.errors.generic` | Something went wrong. Please try again. | Что-то пошло не так. Попробуйте ещё раз. | Nimadir xato ketdi. Qayta urinib ko'ring. |

Unchanged: `title`, `status`, `placeholder`, `aria.*`, the off-topic rate-limit messages.

**System prompt facts (`src/lib/chat-system-prompt.ts`), content only.** Remove the CERTIFICATIONS block (three AWS "Planned"
entries and the expired English certificate). Align EXPERIENCE with §3 (CV wording; drop the 40%, 30%, KPI-50%, team-size,
industry and location details; DataSite is an internship, Sep 2022 – May 2023). Align SKILLS with the Stack in §1. Align LANGUAGES
with the CV (Uzbek native, English C1, Russian A1). Align PROJECTS with §4. Rate limiting, logging and the model are untouched.

---

## 8. Metadata (SEO strings)

| Key | EN | RU | UZ |
|---|---|---|---|
| `metadata.home.description` | DevOps engineer in Tashkent building cloud infrastructure, CI/CD pipelines and monitoring on AWS and GCP. | DevOps-инженер из Ташкента: облачная инфраструктура, CI/CD-пайплайны и мониторинг на AWS и GCP. | Toshkentlik DevOps muhandisi: AWS va GCP'da bulut infratuzilmasi, CI/CD pipeline'lari va monitoring. |
| `metadata.about.description` | About {name}, a DevOps engineer in Tashkent working with AWS and GCP. | О {name}: DevOps-инженер из Ташкента, работающий с AWS и GCP. | {name} haqida: AWS va GCP bilan ishlaydigan toshkentlik DevOps muhandisi. |
| `metadata.projects.description` | Projects by {name}: CI/CD, observability and secure device integration. | Проекты {name}: CI/CD, наблюдаемость и безопасная интеграция устройств. | {name} loyihalari: CI/CD, observability va qurilmalarni xavfsiz integratsiya qilish. |
| `metadata.contact.description` | Contact {name} about DevOps and cloud work. | Связаться с {name} по вопросам DevOps и облачных проектов. | DevOps va bulut loyihalari bo'yicha {name} bilan bog'lanish. |
| `profile.bio` | DevOps engineer in Tashkent building cloud infrastructure, CI/CD pipelines and monitoring on AWS and GCP. | DevOps-инженер из Ташкента: облачная инфраструктура, CI/CD-пайплайны и мониторинг на AWS и GCP. | Toshkentlik DevOps muhandisi: AWS va GCP'da bulut infratuzilmasi, CI/CD pipeline'lari va monitoring. |

Page `<title>` patterns (`{name} - {title}` etc.) are unchanged.

---

## 9. What I need from you

1. Skim EN first; flag anything that sounds wrong for you. RU/UZ follow whatever you change in EN, and tell me about any
   RU/UZ phrasing you'd say differently.
2. The three **[confirm]** items: the Clash Royale sentence, the DataSite fix, the 50% on the Jenkins project.
3. Anything you can add that is real: a measurable outcome for a project, or tools from the cut list.
