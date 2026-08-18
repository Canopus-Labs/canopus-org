/**
 * Canopus Labs — Static Organization Data
 * Update this file to add, edit or remove organizations.
 * All filtering and search runs entirely from this dataset.
 */

export const organizations = [
  {
    id: "apache",
    slug: "apache-software-foundation",
    name: "Apache Software Foundation",
    logo: "/logos/apache.svg",
    description:
      "The Apache Software Foundation provides support for the Apache community of open-source software projects. Apache projects deliver enterprise-grade, freely available software products that collaborative open-source development benefits users.",
    shortDescription:
      "Powering enterprise open-source software through collaborative, community-driven development across hundreds of projects.",
    technologies: ["Java", "Python", "Scala", "Go", "C++"],
    programs: ["GSoC", "Outreachy"],
    status: "active",
    beginnerFriendly: true,
    founded: "1999",
    github: "https://github.com/apache",
    website: "https://apache.org",
    stars: "50k+",
    repositories: "350+",
    about:
      "The ASF is a 501(c)(3) nonprofit organization that oversees more than 350 leading open-source projects, including Apache HTTP Server — the world's most popular web server software. The foundation provides the infrastructure, legal backing, and community governance for projects ranging from big data (Hadoop, Spark, Flink) to web servers, cloud infrastructure, and machine learning.",
    contributionInfo:
      "Apache projects follow the 'Apache Way' — community-driven development with clear meritocracy. New contributors can start by browsing open issues labeled 'newcomer' or 'good first issue' on individual project repositories. Most projects have mailing lists and Slack channels for discussion.",
    repositories_list: [
      { name: "httpd", description: "Apache HTTP Server", stars: "12.4k", language: "C" },
      { name: "kafka", description: "Distributed event streaming platform", stars: "28.1k", language: "Java" },
      { name: "spark", description: "Unified analytics engine for large-scale data", stars: "38.9k", language: "Scala" },
      { name: "flink", description: "Stateful computations over unbounded data streams", stars: "23.7k", language: "Java" },
    ],
  },
  {
    id: "cncf",
    slug: "cloud-native-computing-foundation",
    name: "Cloud Native Computing Foundation",
    logo: "/logos/cncf.svg",
    description:
      "CNCF is the open-source, vendor-neutral hub of cloud native computing, hosting critical infrastructure projects like Kubernetes, Prometheus, and Envoy to make cloud native ubiquitous.",
    shortDescription:
      "The vendor-neutral home of Kubernetes, Prometheus, and critical cloud native infrastructure projects.",
    technologies: ["Go", "Rust", "Python", "C++", "TypeScript"],
    programs: ["LFX", "GSoC", "Outreachy"],
    status: "active",
    beginnerFriendly: true,
    founded: "2016",
    github: "https://github.com/cncf",
    website: "https://cncf.io",
    stars: "200k+",
    repositories: "100+",
    about:
      "The Cloud Native Computing Foundation (CNCF) is part of the Linux Foundation and serves as the vendor-neutral home for many of the fastest-growing open-source projects in cloud native infrastructure. CNCF hosts Kubernetes, Prometheus, Envoy, Argo, Helm, and 150+ other projects that form the backbone of modern cloud infrastructure.",
    contributionInfo:
      "CNCF projects welcome contributions from the global community. Start with the CNCF Landscape to explore projects, then check individual project contribution guides. LFX Mentorship and Google Summer of Code slots are available for structured mentorship programs.",
    repositories_list: [
      { name: "kubernetes", description: "Production-grade container orchestration", stars: "109k", language: "Go" },
      { name: "prometheus", description: "Monitoring system and time series database", stars: "55k", language: "Go" },
      { name: "envoy", description: "Cloud-native high-performance proxy", stars: "24k", language: "C++" },
      { name: "helm", description: "The Kubernetes package manager", stars: "26k", language: "Go" },
    ],
  },
  {
    id: "linux-foundation",
    slug: "linux-foundation",
    name: "Linux Foundation",
    logo: "/logos/lf.svg",
    description:
      "The Linux Foundation is the world's leading home for collaboration on open-source software, hardware, standards, and data. It supports the largest shared technology investment in history.",
    shortDescription:
      "Home of the Linux kernel and hundreds of collaborative open-source projects shaping the future of technology.",
    technologies: ["C", "C++", "Python", "Go", "Rust", "JavaScript"],
    programs: ["LFX", "Outreachy"],
    status: "active",
    beginnerFriendly: false,
    founded: "2000",
    github: "https://github.com/linuxfoundation",
    website: "https://linuxfoundation.org",
    stars: "150k+",
    repositories: "500+",
    about:
      "The Linux Foundation provides a neutral, trusted hub for developers and organizations to code, manage, and scale open technology projects and ecosystems. It partners with the world's leading technology companies across every major sector, supporting the development of Kubernetes, Node.js, Let's Encrypt, OpenChain, SPDX, and hundreds of other foundational open-source projects.",
    contributionInfo:
      "The LFX Mentorship program (formerly CommunityBridge) provides structured mentorship opportunities across dozens of Linux Foundation projects. Individual projects have their own contribution workflows — consult the project's CONTRIBUTING.md and developer documentation.",
    repositories_list: [
      { name: "linux", description: "Linux kernel source tree", stars: "175k", language: "C" },
      { name: "zephyr", description: "Primary Git repository for Zephyr RTOS", stars: "9.8k", language: "C" },
      { name: "openssl", description: "TLS/SSL and crypto library", stars: "24k", language: "C" },
    ],
  },
  {
    id: "mozilla",
    slug: "mozilla",
    name: "Mozilla",
    logo: "/logos/mozilla.svg",
    description:
      "Mozilla is a global non-profit dedicated to keeping the internet open and accessible to all. Home of Firefox, Thunderbird, MDN Web Docs, and a wide range of open-source web technologies.",
    shortDescription:
      "Global non-profit keeping the web open, free and accessible through Firefox and a thriving open-source ecosystem.",
    technologies: ["Rust", "JavaScript", "Python", "C++", "TypeScript"],
    programs: ["GSoC", "Outreachy"],
    status: "active",
    beginnerFriendly: true,
    founded: "2003",
    github: "https://github.com/mozilla",
    website: "https://mozilla.org",
    stars: "80k+",
    repositories: "400+",
    about:
      "Mozilla believes the internet is a global public resource that must remain open and accessible to all. As a non-profit, Mozilla builds products and pursues policies that help people take control of their online lives. Mozilla created Rust, one of the world's most loved programming languages, and maintains Firefox, the leading privacy-first web browser.",
    contributionInfo:
      "Mozilla welcomes contributions to Firefox, Thunderbird, MDN, and many other projects. The 'Good First Bug' tag on Bugzilla is the best entry point for new contributors. Mozilla also runs structured programs through GSoC and Outreachy.",
    repositories_list: [
      { name: "firefox", description: "Firefox web browser", stars: "12k", language: "JavaScript" },
      { name: "rust", description: "The Rust programming language", stars: "96k", language: "Rust" },
      { name: "gecko-dev", description: "Firefox Source Tree", stars: "4.1k", language: "C++" },
      { name: "servo", description: "The Servo Browser Engine", stars: "27k", language: "Rust" },
    ],
  },
  {
    id: "psf",
    slug: "python-software-foundation",
    name: "Python Software Foundation",
    logo: "/logos/python.svg",
    description:
      "The Python Software Foundation is the organization behind the Python programming language. It promotes, protects, and advances Python and supports and facilitates the growth of a diverse and international community of Python programmers.",
    shortDescription:
      "Stewards of the Python programming language, fostering a global community of developers building with Python.",
    technologies: ["Python", "C", "JavaScript"],
    programs: ["GSoC"],
    status: "active",
    beginnerFriendly: true,
    founded: "2001",
    github: "https://github.com/python",
    website: "https://python.org",
    stars: "60k+",
    repositories: "30+",
    about:
      "The PSF is a 501(c)(3) non-profit that supports the Python ecosystem through grants, fiscal sponsorship, and community events like PyCon. CPython — the reference implementation of Python — is one of the most widely used programming languages in the world, powering web development, data science, AI/ML, automation, and scientific computing.",
    contributionInfo:
      "Python's CPython repository welcomes contributions — from documentation improvements to core language changes. The Python Developer's Guide is the best starting point. PSF participates in Google Summer of Code annually with sub-organizations across the Python ecosystem.",
    repositories_list: [
      { name: "cpython", description: "The Python programming language", stars: "63k", language: "Python" },
      { name: "mypy", description: "Optional static typing for Python", stars: "18k", language: "Python" },
      { name: "typeshed", description: "Collection of library stubs for Python", stars: "4.3k", language: "Python" },
    ],
  },
  {
    id: "kubernetes",
    slug: "kubernetes",
    name: "Kubernetes",
    logo: "/logos/kubernetes.svg",
    description:
      "Kubernetes is an open-source system for automating deployment, scaling, and management of containerized applications. Originally designed by Google, it is now maintained by CNCF.",
    shortDescription:
      "The de-facto standard for container orchestration, enabling automated deployment and scaling of applications.",
    technologies: ["Go", "Shell", "Python"],
    programs: ["GSoC", "LFX"],
    status: "active",
    beginnerFriendly: false,
    founded: "2014",
    github: "https://github.com/kubernetes",
    website: "https://kubernetes.io",
    stars: "109k+",
    repositories: "80+",
    about:
      "Kubernetes (K8s) automates the deployment, scaling, and management of containerized applications. It groups containers that make up an application into logical units for easy management and discovery. Kubernetes is now the industry standard for cloud-native application deployment, supported by every major cloud provider.",
    contributionInfo:
      "Kubernetes has a well-structured contributor ladder, from contributor to member, reviewer, approver, and owner. Start with the Kubernetes Contributor Guide, join SIG (Special Interest Group) meetings, and look for issues labeled 'good first issue' across the kubernetes org.",
    repositories_list: [
      { name: "kubernetes", description: "Production-Grade Container Scheduling and Management", stars: "109k", language: "Go" },
      { name: "website", description: "Kubernetes website and documentation", stars: "4.2k", language: "JavaScript" },
      { name: "minikube", description: "Run Kubernetes locally", stars: "29k", language: "Go" },
    ],
  },
  {
    id: "owasp",
    slug: "owasp-foundation",
    name: "OWASP Foundation",
    logo: "/logos/owasp.svg",
    description:
      "The Open Worldwide Application Security Project is a nonprofit foundation dedicated to improving the security of software through community-led open-source projects, tools, and resources.",
    shortDescription:
      "Nonprofit foundation dedicated to application security through open-source tools, standards and community education.",
    technologies: ["Python", "Java", "JavaScript", "Go", "Ruby"],
    programs: ["GSoC"],
    status: "active",
    beginnerFriendly: true,
    founded: "2001",
    github: "https://github.com/OWASP",
    website: "https://owasp.org",
    stars: "30k+",
    repositories: "200+",
    about:
      "OWASP is a global nonprofit focused on improving software security. It produces the OWASP Top 10 — the standard awareness document for web application security — as well as the OWASP SAMM, OWASP Testing Guide, and hundreds of tools and libraries that security professionals rely on worldwide.",
    contributionInfo:
      "OWASP welcomes contributors of all backgrounds — from developers and security researchers to writers and designers. Projects like ZAP (Zed Attack Proxy), Juice Shop, and WebGoat are great entry points. OWASP participates in Google Summer of Code.",
    repositories_list: [
      { name: "www-project-top-ten", description: "OWASP Top 10 Web Application Security Risks", stars: "9.5k", language: "HTML" },
      { name: "juice-shop", description: "Intentionally insecure web application", stars: "10.1k", language: "TypeScript" },
      { name: "wstg", description: "Web Security Testing Guide", stars: "7.4k", language: "Markdown" },
    ],
  },
  {
    id: "numfocus",
    slug: "numfocus",
    name: "NumFOCUS",
    logo: "/logos/numfocus.svg",
    description:
      "NumFOCUS is a nonprofit that supports and promotes world-class, innovative, open-source scientific computing through fiscal sponsorship and community programs. Home of NumPy, Pandas, Jupyter, and more.",
    shortDescription:
      "Nonprofit home of NumPy, Pandas, Jupyter, and the open scientific computing stack powering data science and research.",
    technologies: ["Python", "C", "C++", "JavaScript", "Julia", "R"],
    programs: ["GSoC"],
    status: "active",
    beginnerFriendly: true,
    founded: "2012",
    github: "https://github.com/numfocus",
    website: "https://numfocus.org",
    stars: "200k+",
    repositories: "50+",
    about:
      "NumFOCUS provides fiscal sponsorship and programmatic support for open-source scientific computing projects. Its sponsored projects — NumPy, SciPy, Pandas, Jupyter, Matplotlib, Astropy, and dozens more — form the foundation of the global data science and scientific computing ecosystem.",
    contributionInfo:
      "NumFOCUS-sponsored projects are all open to contributions. The NumFOCUS Google Summer of Code program is a great starting point. Individual projects like Pandas, NumPy, and Matplotlib have detailed contribution guides and labeled 'good first issue' tickets.",
    repositories_list: [
      { name: "numpy", description: "The fundamental package for scientific computing with Python", stars: "26k", language: "Python" },
      { name: "pandas", description: "Flexible and powerful data analysis / manipulation library", stars: "43k", language: "Python" },
      { name: "jupyter_notebook", description: "Jupyter Interactive Notebook", stars: "11k", language: "Python" },
    ],
  },
  {
    id: "rust-foundation",
    slug: "rust-foundation",
    name: "Rust Foundation",
    logo: "/logos/rust.svg",
    description:
      "The Rust Foundation is an independent nonprofit organization dedicated to stewarding the Rust programming language and ecosystem, supporting maintainers, and growing the global Rust community.",
    shortDescription:
      "Stewards of Rust — the systems programming language designed for performance, reliability, and memory safety.",
    technologies: ["Rust", "LLVM", "WebAssembly"],
    programs: ["GSoC"],
    status: "active",
    beginnerFriendly: false,
    founded: "2021",
    github: "https://github.com/rust-lang",
    website: "https://foundation.rust-lang.org",
    stars: "95k+",
    repositories: "100+",
    about:
      "The Rust Foundation stewards the Rust programming language — the most loved language in Stack Overflow's Developer Survey for many consecutive years. Rust delivers memory safety without garbage collection, making it ideal for systems programming, WebAssembly, embedded systems, and high-performance applications.",
    contributionInfo:
      "Rust development happens in the open on GitHub. The Rust compiler, standard library, and toolchain all welcome contributions. Start with issues labeled 'E-easy' or 'E-mentor' in the rust-lang/rust repository. The Rust project has working groups for different areas (compiler, language, docs, etc.).",
    repositories_list: [
      { name: "rust", description: "The Rust programming language", stars: "96k", language: "Rust" },
      { name: "cargo", description: "The Rust package manager", stars: "12k", language: "Rust" },
      { name: "rustfmt", description: "A tool for formatting Rust code", stars: "5.8k", language: "Rust" },
    ],
  },
  {
    id: "eclipse",
    slug: "eclipse-foundation",
    name: "Eclipse Foundation",
    logo: "/logos/eclipse.svg",
    description:
      "The Eclipse Foundation is home to a global community of developers building open-source tools, runtimes, and frameworks for cloud and edge computing, IoT, AI, automotive, systems engineering, and more.",
    shortDescription:
      "Global open-source foundation driving innovation in cloud, IoT, automotive, and developer tooling.",
    technologies: ["Java", "JavaScript", "C", "C++", "Python", "Kotlin"],
    programs: ["GSoC"],
    status: "active",
    beginnerFriendly: true,
    founded: "2004",
    github: "https://github.com/eclipse",
    website: "https://eclipse.org",
    stars: "40k+",
    repositories: "400+",
    about:
      "The Eclipse Foundation is one of the largest open-source foundations in the world, hosting over 400 projects including the Eclipse IDE, Jakarta EE (formerly Java EE), Eclipse Che, Eclipse Mosquitto (IoT), and many others. It provides governance, infrastructure, and community services for its projects.",
    contributionInfo:
      "Eclipse projects welcome contributions through Gerrit, GitHub, and GitLab. New contributors should review the Eclipse Contributor Agreement (ECA), then find a project that interests them. Eclipse participates in Google Summer of Code with multiple sub-organizations.",
    repositories_list: [
      { name: "eclipse.jdt.core", description: "Eclipse Java Development Tools Core", stars: "680", language: "Java" },
      { name: "che", description: "Eclipse Che — Cloud Dev Environments", stars: "7.3k", language: "Java" },
      { name: "mosquitto", description: "Eclipse Mosquitto MQTT broker", stars: "8.7k", language: "C" },
    ],
  },
];

/**
 * Helper: all unique technology tags across organizations
 */
export const allTechTags = [
  "All", "Java", "Python", "JavaScript", "Go", "Rust",
  "C++", "TypeScript", "Scala", "AI / ML", "Cloud", "DevOps",
];

/**
 * Helper: all program filter tags
 */
export const allProgramTags = [
  "Active", "Beginner Friendly", "GSoC", "LFX", "Hacktoberfest", "GSSoC", "Outreachy",
];
