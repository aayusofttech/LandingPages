/* ==========================================================
   Dudhkoshi Hydropower — interactions (AOS + GSAP + vanilla JS)
   ========================================================== */
(function () {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const IMG = 'assets/images/';
  const ICON = 'assets/icons/';

  /* ---------------- Data ---------------- */
const team = [
  {
    name: 'Kadam KC',
    role: 'Chairman',
    img: 'kadam-kc.png',
    group: ['directors'],
    bio: [
      '<a href="#" class="text-primary">Kadam KC</a>, an entrepreneur with a master\'s in environmental science and geotechnical engineering from UK universities, has over 15 years in business.',
      'His leadership bridges the gap between complex geotechnical requirements and environmental stewardship, ensuring the Dudhkoshi project adheres to the highest global standards.',
      'While in the UK, he was active in both business and social work. After returning to Nepal, he focused on hydropower, successfully completing Puwa Khola-1 Hydropower (4 MW). He chairs Aayu Entertainments Pvt. Ltd. and is launching Fishtail Dream Park in Pokhara. He also founded Dhaulagiri Construction and Development Pvt. Ltd. and serves on the board of High Himalaya Hydro Construction Pvt. Ltd.'
    ],
    meta: [
      ['Background', 'UK Master’s Alumnus'],
      ['Experience', '15+ Years'],
      ['Focus', 'Geotechnical &amp; Environmental']
    ]
  },

  {
    name: 'Abhigya Malla',
    role: 'Director',
    img: 'abhigya-malla.png',
    group: ['directors'],
    bio: [
      '<a href="#" class="text-primary">Abhigya Malla</a> is a finance professional, project developer, and emerging leader in Nepal’s hydropower and construction sector. She holds a Master’s degree in Professional Accountancy and a Master’s in Commerce with a specialization in Finance from Macquarie University, Australia. She currently serves as Vice President and Finance Controller at High Himalaya Hydro Construction Pvt. Ltd., where she is involved in the development and management of several hydropower projects.',
      'Her portfolio includes Aayu Malun (21 MW), Puwa Khola (4 MW), Hongu Khola (28.9 MW), Midim Khola (3 MW), and Upper Tamor A (60 MW). As a youth contractor and project developer, she combines strong financial expertise with practical experience in infrastructure development. She also serves as Managing Director of Union Hydropower Public Ltd., further demonstrating her leadership and commitment to Nepal’s growing hydropower industry.'
    ],
    meta: [
      ['Background', 'Australia Master’s Alumnus'],
      ['Experience', '7+ Years'],
      ['Focus', 'Finance &amp; Contractor']
    ]
  },

  {
    name: 'Bikram Gautam',
    role: 'Director',
    img: 'bikram-gautam.png',
    group: ['directors'],
    bio: [
      '<a href="#" class="text-primary">Bikram Gautam</a>, with over 15 years of experience leading large-scale manufacturing and construction teams, brings deep expertise in the Real Estate and Mines business sectors.',
      'He has a strong track record in end-to-end product development, operational leadership, and project execution. His experience includes strategic planning, cross-functional team management, process optimization, and delivering high-quality, cost-effective solutions that drive sustainable business growth and long-term value.'
    ],
    meta: [
      ['Background', 'Australia Master’s Alumnus'],
      ['Experience', '7+ Years'],
      ['Focus', 'Finance &amp; Contractor']
    ]
  },

  {
    name: 'Arun Kumar Agarwal',
    role: 'Director',
    img: 'arun-kumar-agarwal.png',
    group: ['directors'],
    bio: [
      '<a href="#" class="text-primary">Arun Kumar Agarwal</a> is a prominent businessman with extensive experience in the construction, infrastructure, trading, and retail sectors. As the driving force behind Rajesh Trade Link, he has played an important role in building and expanding a strong business presence across the country. His entrepreneurial portfolio also includes RTL Mall and Goyal Aluminum, reflecting his diverse interests and ability to manage businesses across multiple industries.',
      'With a focus on quality, reliability, and long-term growth, he has developed an extensive nationwide distribution network that enables his businesses to effectively serve customers and partners in different markets. His leadership is characterized by strategic vision, strong business relationships, and a commitment to sustainable growth. Through his ventures, he continues to contribute to the development of construction, infrastructure, distribution, and commercial sectors while strengthening his position as an influential entrepreneur.'
    ],
    meta: [
      ['Background', 'Operations Management'],
      ['Experience', '14+ Years'],
      ['Focus', 'Resource Allocation &amp; PMO']
    ]
  }
];

  const defaultBio = p => [
    `<a href="#" class="text-primary">${p.name}</a> serves as a ${p.role} on the Board of Dudhkoshi Hydropower Nepal Pvt. Ltd.`,
    'As a member of the Board, they help guide the strategic direction of the 95.7 MW Dudhkoshi-2 (Jaleshwor) peaking run-of-river project, supporting sound governance, transparency and accountability to investors, lenders and local communities.'
  ];
  const defaultMeta = p => [['Position', p.role], ['Board', 'Dudhkoshi Hydropower'], ['Focus', 'Governance &amp; Strategy']];

const gallery = [
  { src: 'assets/images/gallery/1.png', cat: 'infra', alt: 'Gallery image 1' },
  { src: 'assets/images/gallery/2.png', cat: 'infra', alt: 'Gallery image 2' },
  { src: 'assets/images/gallery/3.png', cat: 'infra', alt: 'Gallery image 3' },
  { src: 'assets/images/gallery/4.jpeg', cat: 'infra', alt: 'Gallery image 4' },
  { src: 'assets/images/gallery/5.jpeg', cat: 'infra', alt: 'Gallery image 5' },
  { src: 'assets/images/gallery/6.jpeg', cat: 'infra', alt: 'Gallery image 6' },
  { src: 'assets/images/gallery/7.jpeg', cat: 'infra', alt: 'Gallery image 7' },
  { src: 'assets/images/gallery/8.jpeg', cat: 'infra', alt: 'Gallery image 8' },
  { src: 'assets/images/gallery/9.jpeg', cat: 'infra', alt: 'Gallery image 9' },
  { src: 'assets/images/gallery/10.jpeg', cat: 'infra', alt: 'Gallery image 10' },
  { src: 'assets/images/gallery/11.png', cat: 'infra', alt: 'Gallery image 11' },
  { src: 'assets/images/gallery/12.png', cat: 'infra', alt: 'Gallery image 12' }
];


const news = [
  {
    title: 'Laxmi Sunrise Bank-led consortium to invest in 70 MW Dudhkoshi 22',
    by: 'By Dudhkoshi',
    date: 'Feb,27 2026',
    text: 'The project is being constructed at the Dudhkoshi River of the Solukhumbu district with an estimated project cost ...',
    img: 'news-event.jpg'
  },
  {
    title: 'दूधकोशी–२ आयोजनाको क्षमता बढेर पुग्यो ९६ मेगावाट, लागत पनि थपियो',
    by: 'By Dudhkoshi',
    date: 'Feb,27 2026',
    text: 'काठमाडौँ। निजी लगानीमा निर्माण सुरु भएको दूधकोशी–२ अर्धजलासय जलविद्युत आयोजनाको क्षमता बढेर ९५.७ मेगावाट पुगेको छ। यसअघि ७० मेगावाटमा....',
    img:"aa1d64d6.png"
  }
];

const sideNews = [
  {
    tag: 'TECHNOLOGY',
    img: 'aa1d64d6.png',
    title: 'दूधकोशी–२ आयोजनाको क्षमता बढेर पुग्यो ९६ मेगावाट, लागत पनि थपियो',
    date: 'Feb,27 2026',
  },
  {
    img: 'news-event.jpg',

        tag: 'EVENT',
    title: 'Laxmi Sunrise Bank-led consortium to invest in 70 MW Dudhkoshi 22',
  date: 'Feb,27 2026',
  }
];

  const po = {
scheme: {
  title: 'Scheme and Capacity',
  rows: [
    ['Installed Capacity', '95.7 MW', 'formula : P=ρ·g·Q·H<sub>n</sub>·η'],
    ['Gross Head', '144.5 m', 'formula : H<sub>g</sub> = Z<sub>intake</sub> - Z<sub>powerhouse</sub>'],
    ['Net Head', 'NULL', 'formula : H<sub>n</sub> = H<sub>g</sub> - ∑hf'],
    ['Design Discharge', '83.5 m<sup>3</sup>/s', 'formula : Q = A·v'],
    ['Type of Scheme', 'Run-of-River (6-hour Peaking)', '']
  ],
  note: 'It is a 95.7 MW, 6-hour peaking run-of-river hydropower project located in Solukhumbu, Koshi Province. The project utilizes the Dudhkoshi River to generate clean and reliable energy for Nepal.'
},

water: {
  title: 'Water Conveyance',
  rows: [
    ['Headrace Tunnel Length', '4,791 m', 'Lₜ'],
    ['Headrace Tunnel Type', 'Concrete Lined Inverted D-Shaped', ''],
    ['Tunnel Diameter', '5.6 m (finished)', 'D = 2·r'],
    ['Surge Shaft Type', 'Restricted Orifice Surge Shaft', ''],
    ['Surge Shaft Height', '69 m', ''],
    ['Surge Shaft Internal Diameter', '16.0 m', ''],
    ['Penstock Type', 'Underground', ''],
    ['Penstock Length', '80 m (Surge Shaft–Drop Shaft) + 96.97 m (Drop Shaft) + 96.62 m (Inclined Penstock Tunnel)', 'Lₚ'],
    ['Penstock Internal Diameter', '4.6 m', '']
  ],
  note: 'Designed with underground tunneling structures to minimize environmental impact while maintaining optimum hydraulic efficiency.'
},

powerhouse: {
  title: 'Powerhouse',
  rows: [
    ['Powerhouse Type', 'Surface Powerhouse', ''],
    ['Dimensions', '55 m × 26.5 m × 35.3 m', 'V = L·W·H'],
    ['Design Tailwater Level', '644.5 masl', ''],
    ['Tailrace Tunnels', '2 nos., 94.30 m long, 5.5 m × 3.45 m each', '']
  ],
  note: 'Houses state-of-the-art control units and multi-stage generating equipment engineered for high-head operational efficiency.'
},

turbine: {
  title: 'Turbine & Generator',
  rows: [
    ['Turbine Type', 'Vertical Axis Francis', ''],
    ['Number of Units', '2 Units', ''],
    ['Rated Output per Unit', '47.845 MW', ''],
    ['Installed Capacity', '95.7 MW', ''],
    ['Rated Efficiency', 'NULL', 'η<sub>overall</sub>'],
    ['Generator Output', 'NULL', 'S = P / PF']
  ],
  note: 'Vertical axis Francis turbines selected for the project\'s head and discharge conditions.'
},

evac: {
  title: 'Power Evacuation',
  rows: [
    ['Transmission Voltage', 'TBD — not provided for Dudhkoshi-2', ''],
    ['Interconnection Point', 'TBD — not provided for Dudhkoshi-2', ''],
    ['Transmission Line Length', 'TBD — not provided for Dudhkoshi-2', 'L_line']
  ],
  note: 'Power evacuation details for this project have not yet been provided by the client — placeholder values above must be replaced before publishing.'
}
};

  const faqs = {
    technical: [
      ['What is the Dudhkoshi-2 (Jaleswar) Hydroelectric Project?', 'It is a 95.7 MW, 6-hour peaking run-of-river hydropower project located in Solukhumbu, Koshi Province. The project utilizes the Dudhkoshi River to generate clean and reliable energy for Nepal.'],
      ['Who owns and develops the project?', 'The project is owned and developed by Dudhkoshi Hydro Power Pvt. Ltd., committed to developing sustainable energy infrastructure in Nepal.'],
      ['How much energy will the project generate annually?', 'The project will generate approximately 543.48 GWh of energy annually, including dry-season and wet-season production optimized for Nepal\'s power demand.'],
      ['What type of hydropower scheme is Dudhkoshi-2?', 'It is a 6-hour peaking run-of-river (PRoR) hydropower scheme designed to supply stable energy during peak demand periods.']
    ],
    environmental: [
      ['How does the project protect the Dudhkoshi river ecosystem?', 'As a run-of-river scheme, the project diverts only part of the flow and returns it to the river downstream of the powerhouse, avoiding a large storage reservoir.'],
      ['What is the expected carbon reduction?', 'Clean hydropower displaces fossil-fuel generation, contributing to an estimated 85% carbon reduction compared with thermal alternatives.'],
      ['Are local communities consulted?', 'Yes. Communities in Solukhumbu are engaged throughout planning and construction, with a focus on local employment and benefit sharing.']
    ],
    corporate: [
      ['What is the total project cost?', 'The total project cost is NRs. 415.7 Crore, covering civil works, electro-mechanical equipment, transmission infrastructure, financing costs and contingencies.'],
      ['What is the capital structure?', 'The project follows a balanced 75:25 debt-to-equity ratio, with debt provided by a banking consortium.'],
      ['How can investors get in touch?', 'Please use the inquiry form above or email aayududhkoshi@gmail.com and our team will respond promptly.']
    ]
  };

  /* ---------------- Header ---------------- */
  const header = $('#siteHeader');
  const backTop = $('#backTop');
  const onScroll = () => {
    header.classList.toggle('scrolled', scrollY > 10);
    backTop.classList.toggle('show', scrollY > 800);
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  backTop.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));

  const menuBtn = $('#menuBtn'), mobileMenu = $('#mobileMenu');
  menuBtn.addEventListener('click', () => mobileMenu.classList.toggle('open'));
  $$('#mobileMenu a').forEach(a => a.addEventListener('click', () => mobileMenu.classList.remove('open')));

  // active nav on scroll
  const navSections = ['home', 'about', 'gallery', 'team', 'projOv'].map(id => document.getElementById(id));
  const spy = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      $$('.nav-link').forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  navSections.forEach(s => s && spy.observe(s));

  /* ---------------- About accordion ---------------- */
  $$('#principles .acc-item').forEach(item => {
    $('.acc-head', item).addEventListener('click', () => {
      const wasOpen = item.classList.contains('open');
      $$('#principles .acc-item').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });

  /* ---------------- Map zoom ---------------- */
  let mapScale = 1;
  const mapImg = $('#mapImg');
  $('#zoomIn').addEventListener('click', () => { mapScale = Math.min(2, mapScale + .25); mapImg.style.transform = `scale(${mapScale})`; });
  $('#zoomOut').addEventListener('click', () => { mapScale = Math.max(1, mapScale - .25); mapImg.style.transform = `scale(${mapScale})`; });

  /* ---------------- Team ---------------- */
  const personList = $('#personList');
  let activePerson = 0;
  function renderPeople(filter = 'all') {
    const list = team.map((p, i) => ({ p, i })).filter(({ p }) => filter === 'all' || p.group.includes(filter));
    personList.innerHTML = list.map(({ p, i }) => `
      <button class="person-btn flex items-center gap-4 px-3 h-16 ${i === activePerson ? 'active' : ''}" data-i="${i}">
        <img src="${IMG + p.img}" alt="${p.name}" />
        <span><span class="block font-manrope font-medium text-sm text-ink-dark">${p.name}</span><span class="block text-[12px] text-ink-dark">${p.role}</span></span>
      </button>`).join('');
    $('#personEmpty').classList.toggle('hidden', list.length > 0);
    $$('.person-btn', personList).forEach(b => b.addEventListener('click', () => selectPerson(+b.dataset.i)));
  }
  function selectPerson(i, animate = true) {
    activePerson = i;
    const p = team[i];
    $$('.person-btn', personList).forEach(b => b.classList.toggle('active', +b.dataset.i === i));
    const apply = () => {
      $('#pImg').src = IMG + p.img; $('#pImg').alt = p.name;
      $('#pName').textContent = p.name;
      $('#pRole').textContent = p.role.toUpperCase();
      $('#pBio').innerHTML = (p.bio || defaultBio(p)).map(t => `<p>${t}</p>`).join('');
      $('#pMeta').innerHTML = (p.meta || defaultMeta(p)).map(([k, v]) => `<div class="detail-row flex justify-between py-2"><span class="font-medium text-ink-dark">${k}</span><span class="text-ink w-[180px]">${v}</span></div>`).join('');
    };
    if (animate && window.gsap) {
      gsap.to(['#pImg', '#pName', '#pRole', '#pBio', '#pMeta'], {
        opacity: 0, y: 10, duration: .2, stagger: .03, onComplete: () => {
          apply();
          gsap.to(['#pImg', '#pName', '#pRole', '#pBio', '#pMeta'], { opacity: 1, y: 0, duration: .45, stagger: .05, ease: 'power2.out' });
        }
      });
    } else apply();
  }
  $$('#teamTabs .tab-btn').forEach(btn => btn.addEventListener('click', () => {
    $$('#teamTabs .tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderPeople(btn.dataset.filter);
    if (window.gsap) gsap.from('#personList .person-btn', { opacity: 0, x: -20, duration: .4, stagger: .06 });
  }));
  renderPeople(); selectPerson(0, false);

  /* ---------------- Gallery ---------------- */
  let galItems = gallery.slice(), galIndex = 0;
  const dotsWrap = $('#carDots');
  const wrap = i => (i + galItems.length) % galItems.length;
  function renderDots() {
    const n = Math.min(4, galItems.length);
    dotsWrap.innerHTML = Array.from({ length: n }, (_, i) => `<button class="car-dot ${i === galIndex % n ? 'active' : ''}" data-i="${i}" aria-label="Slide ${i + 1}"></button>`).join('');
    $$('.car-dot', dotsWrap).forEach(d => d.addEventListener('click', () => goTo(+d.dataset.i)));
  }
  function setSlides() {
    const main = galItems[galIndex], prev = galItems[wrap(galIndex - 1)], next = galItems[wrap(galIndex + 1)];
    $('#carMainImg').src = main.src; $('#carMainImg').alt = main.alt;
    $('#carPrevImg').src =  prev.src;
    $('#carNextImg').src =  next.src;
    renderDots();
  }
  function goTo(i, dir = 1) {
    if (!galItems.length) return;
    galIndex = wrap(i);
    if (window.gsap) {
      gsap.timeline()
        .to('#carMainImg', { opacity: 0, x: -30 * dir, duration: .25, ease: 'power1.in' })
        .to(['#carPrevImg', '#carNextImg'], { opacity: 0, duration: .2 }, 0)
        .add(setSlides)
        .fromTo('#carMainImg', { opacity: 0, x: 30 * dir, scale: 1.03 }, { opacity: 1, x: 0, scale: 1, duration: .5, ease: 'power2.out' })
        .to(['#carPrevImg', '#carNextImg'], { opacity: 1, duration: .4 }, '<');
    } else setSlides();
  }
  $('#carNext').addEventListener('click', () => goTo(galIndex + 1, 1));
  $('#carPrev').addEventListener('click', () => goTo(galIndex - 1, -1));
  let autoplay = setInterval(() => goTo(galIndex + 1, 1), 5000);
  $('#carouselView').addEventListener('mouseenter', () => clearInterval(autoplay));
  $('#carouselView').addEventListener('mouseleave', () => { clearInterval(autoplay); autoplay = setInterval(() => goTo(galIndex + 1, 1), 5000); });
  // swipe
  let sx = 0;
  $('#carouselView').addEventListener('touchstart', e => sx = e.touches[0].clientX, { passive: true });
  $('#carouselView').addEventListener('touchend', e => { const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 40) goTo(galIndex + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1); });

  function renderGrid() {
    $('#galleryGrid').innerHTML = galItems.map(g => `<figure><img src="${g.src}" alt="${g.alt}" loading="lazy" /></figure>`).join('');
    if (window.gsap) gsap.from('#galleryGrid figure', { opacity: 0, y: 30, duration: .5, stagger: .06 });
  }
  $$('#galFilters .pill-filter').forEach(btn => btn.addEventListener('click', () => {
    $$('#galFilters .pill-filter').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const c = btn.dataset.cat;
    galItems = c === 'all' ? gallery.slice() : gallery.filter(g => g.cat === c);
    galIndex = 0; goTo(0); renderGrid();
  }));
  let gridMode = false;
  $('#gridToggle').addEventListener('click', () => {
    gridMode = !gridMode;
    $('#carouselView').classList.toggle('hidden', gridMode);
    $('#gridView').classList.toggle('hidden', !gridMode);
    $('#gridLabel').textContent = gridMode ? 'Slide View' : 'Grid View';
    if (gridMode) renderGrid();
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  });
  setSlides();

  /* ---------------- News ---------------- */
  $('#newsGrid').innerHTML = news.map((n, i) => `
    <article class="news-card p-4 pb-9" data-aos="fade-up" data-aos-delay="${(i % 2) * 100}">
      <div class="thumb"><img src="${IMG}${n.img}" alt="${n.title}" loading="lazy" /></div>
      <h4 class="news-title mt-6 px-[2px]">${n.title}</h4>
      <div class="flex justify-between text-base text-ink-dark mt-4 px-[2px]"><span>${n.by}</span><span>${n.date}</span></div>
      <p class="text-sm leading-5 text-ink-dark mt-8 px-[2px]">${n.text}</p>
      <a href="#" class="link-arrow mt-4 px-[2px]">Read More <img src="${ICON}arrow-right.svg" alt="" class="w-6 h-[22px] -ml-1" /></a>
    </article>`).join('');
  $('#sideNews').innerHTML = sideNews.map((n, i) => `
    <a href="#" class="side-item block py-5 first:pt-0 ml-0 mr-[12px] lg:pl-0" data-aos="fade-left" data-aos-delay="${i * 80}">
      <p class="text-sm text-primary-dark font-medium">${n.tag}</p>
      <div class="flex gap-2.5 mt-1">
        <img src="${IMG}${n.img}" alt="" class="w-[61px] h-[80px] object-cover rounded-md shrink-0" />
        <div><p class="t">${n.title}</p>
          <p class="flex items-center gap-2 text-[9px] text-ink-dark mt-3"><img src="${ICON}calendar.svg" alt="" class="w-[18px] h-5" />${n.date}</p>
        </div>
      </div>
    </a>`).join('');

  /* ---------------- Project overview tabs ---------------- */
  function renderPO(key) {
    const d = po[key];
    $('#poTitle').textContent = d.title;
    $('#poBody').innerHTML = d.rows.map(([a, b, c]) => `
      <div class="po-row grid grid-cols-[1fr_1fr] md:grid-cols-[268px_1fr_auto] gap-2 items-center py-2.5 text-sm text-ink-dark">
        <span>${a}</span><span>${b}</span><span class="formula hidden md:block md:min-w-[190px]">${c}</span>
      </div>`).join('') +
      `<div class="flex gap-2.5 mt-8 text-[11px] leading-5 text-ink-dark"><span class="text-sm font-medium shrink-0 -mt-0.5">Note :</span><p>${d.note}</p></div>`;
    if (window.gsap) gsap.from('#poBody > *', { opacity: 0, y: 12, duration: .4, stagger: .05, ease: 'power2.out' });
  }
  $$('#poTabs .po-tab').forEach(t => t.addEventListener('click', () => {
    $$('#poTabs .po-tab').forEach(b => b.classList.remove('active'));
    t.classList.add('active');
    renderPO(t.dataset.tab);
  }));
  renderPO('scheme');

  // headworks components toggle
  // 1st 
  // $('#compToggle').addEventListener('click', () => {
  //   const w = $('#compWrap'); w.classList.toggle('closed');
  //   $('.toggle-caret').style.transform = w.classList.contains('closed') ? 'rotate(180deg)' : '';
  // });
  // // 2nd
  // $('#compToggle2').addEventListener('click', () => {
  //   const w = $('#compWrap2'); w.classList.toggle('closed');
  //   $('.toggle-caret').style.transform = w.classList.contains('closed') ? 'rotate(180deg)' : '';
  // });
  // // 3rd
  // $('#compToggle3').addEventListener('click', () => {
  //   const w = $('#compWrap3'); w.classList.toggle('closed');
  //   $('.toggle-caret').style.transform = w.classList.contains('closed') ? 'rotate(180deg)' : '';
  // });
  // // 4th
  // $('#compToggle4').addEventListener('click', () => {
  //   const w = $('#compWrap4'); w.classList.toggle('closed');
  //   $('.toggle-caret').style.transform = w.classList.contains('closed') ? 'rotate(180deg)' : '';
  // });
const toggles = [
  { toggle: '#compToggle', wrap: '#compWrap' },
  { toggle: '#compToggle2', wrap: '#compWrap2' },
  { toggle: '#compToggle3', wrap: '#compWrap3' },
  { toggle: '#compToggle4', wrap: '#compWrap4' }
];

toggles.forEach(({ toggle, wrap }) => {
  $(toggle).addEventListener('click', () => {
    // Hide all other sections
    toggles.forEach(({ wrap: otherWrap }) => {
      if (otherWrap !== wrap) {
        $(otherWrap).classList.add('closed');
      }
    });

    // Toggle the clicked section
    const current = $(wrap);
    current.classList.toggle('closed');

    // Update carets
    toggles.forEach(({ wrap: otherWrap, toggle: otherToggle }) => {
      const caret = $(otherToggle).querySelector('.toggle-caret');
      if (caret) {
        caret.style.transform = $(otherWrap).classList.contains('closed')
          ? 'rotate(180deg)'
          : '';
      }
    });
  });
});


  /* ---------------- FAQ ---------------- */
  function renderFaq(key) {
    $('#faqList').innerHTML = faqs[key].map(([q, a], i) => `
      <div class="faq-item ${i === 0 ? 'open' : ''}">
        <button class="faq-q w-full flex items-center justify-between gap-4 px-5 h-[60px] text-left">
          <span class="q">${i + 1}. ${q}</span>
          <svg class="shrink-0 mr-10" width="16" height="16" viewBox="0 0 16 16"><path d="M1 8h14" stroke="#111" stroke-width="1.6"/><path class="pm-v" d="M8 1v14" stroke="#111" stroke-width="1.6"/></svg>
        </button>
        <div class="a-wrap"><div><p class="px-5 pb-4  text-sm leading-5 text-ink-dark max-w-[780px]">${a}</p></div></div>
      </div>`).join('');
    $$('#faqList .faq-item').forEach(item => $('.faq-q', item).addEventListener('click', () => {
      const open = item.classList.contains('open');
      $$('#faqList .faq-item').forEach(x => x.classList.remove('open'));
      if (!open) item.classList.add('open');
    }));
    if (window.gsap) gsap.from('#faqList .faq-item', { opacity: 0, y: 16, duration: .4, stagger: .07 });
  }
  $$('#faqTabs .faq-tab').forEach(t => t.addEventListener('click', () => {
    $$('#faqTabs .faq-tab').forEach(b => b.classList.remove('active'));
    t.classList.add('active'); renderFaq(t.dataset.faq);
  }));
  renderFaq('technical');

  /* ---------------- Contact form ---------------- */
  $('#inquiryForm').addEventListener('submit', e => {
    e.preventDefault();
    const f = e.target, msg = $('#formMsg');
    let ok = true;
    ['name', 'email', 'message'].forEach(n => {
      const el = f.elements[n];
      const valid = n === 'email' ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value.trim()) : el.value.trim().length > 1;
      el.classList.toggle('error', !valid); ok = ok && valid;
    });
    msg.classList.remove('hidden');
    if (!ok) { msg.textContent = 'Please fill in all fields with valid details.'; msg.className = 'text-sm mt-3 text-red-600'; return; }
    msg.textContent = 'Thank you! Your inquiry has been sent. Our team will contact you shortly.';
    msg.className = 'text-sm mt-3 text-[#006C49]';
    f.reset();
  });
  $$('#inquiryForm .field').forEach(el => el.addEventListener('input', () => el.classList.remove('error')));

  /* ---------------- AOS ---------------- */
  AOS.init({ duration: 800, easing: 'ease-out-cubic', once: true, offset: 60 });

  /* ---------------- GSAP ---------------- */
  if (!window.gsap) return;
  gsap.registerPlugin(ScrollTrigger);

  // hero intro
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.from('#siteHeader', { y: -80, opacity: 0, duration: .7 })
    .from('.hero-anim:first-child', { opacity: 0, y: -20, duration: .6 }, '-=.3')
    .from('.hero-line', { yPercent: 110, duration: .9, stagger: .15 }, '-=.3')
    .from('.hero-anim:not(:first-child)', { opacity: 0, y: 30, duration: .7, stagger: .15 }, '-=.5')
    .from('.hero-float', { opacity: 0, y: 60, duration: .8, stagger: .12 }, '-=.4');

  // hero background parallax
  gsap.to('.hero-card', { backgroundPosition: 'center 40%', ease: 'none', scrollTrigger: { trigger: '#home', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('#heroCards', { y: -30, ease: 'none', scrollTrigger: { trigger: '#home', start: 'top top', end: 'bottom top', scrub: true } });

  // counters
  $$('.counter').forEach(el => {
    const to = parseFloat(el.dataset.to), dec = +(el.dataset.dec || 0);
    const obj = { v: 0 };
    ScrollTrigger.create({
      trigger: el, start: 'top 90%', once: true,
      onEnter: () => gsap.to(obj, { v: to, duration: 2, ease: 'power2.out', onUpdate: () => el.textContent = obj.v.toFixed(dec) })
    });
  });

  // capital bars
  $$('.bar-fill').forEach(b => ScrollTrigger.create({ trigger: b, start: 'top 90%', once: true, onEnter: () => b.style.width = b.dataset.w }));

  // timeline progress line
  gsap.to('#tlProgress', { height: '100%', ease: 'none', scrollTrigger: { trigger: '#timeline', start: 'top 70%', end: 'bottom 60%', scrub: true } });
  gsap.from('.timeline-dot', { scale: 0, duration: .5, stagger: .2, ease: 'back.out(2)', scrollTrigger: { trigger: '#timeline', start: 'top 75%' } });

  // CTA & watermark
  gsap.fromTo('.cta-section .bg', { scaleX: -1.15, scaleY: 1.15 }, { scaleX: -1, scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.cta-section', start: 'top bottom', end: 'bottom top', scrub: true } });
  gsap.from('#watermark', { yPercent: 40, opacity: 0, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: '#watermark', start: 'top 100%' } });
})();
