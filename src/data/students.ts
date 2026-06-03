export type Specialization = "Cybersecurity" | "Artificial Intelligence";
export type Gender = "Male" | "Female";

export interface EducationItem {
  institute: string;
  degree: string;
  period: string;
  cgpa?: string;
}

export interface WorkItem {
  role: string;
  company: string;
  period?: string;
  bullets: string[];
}

export interface ProjectItem {
  title: string;
  tag?: string;
  bullets: string[];
}

export interface SkillGroup {
  category: string;
  items: string[];
}

export interface Student {
  slug: string;
  name: string;
  headline: string;
  specialization: Specialization;
  gender: Gender;
  location?: string;
  phone?: string;
  email?: string;
  collegeEmail?: string;
  linkedin?: string;
  github?: string;
  photo?: string;
  resume?: string;
  about: string;
  education: EducationItem[];
  certifications: string[];
  skills: SkillGroup[];
  workExperience?: WorkItem[];
  projects: ProjectItem[];
  publications?: string[];
  programDates?: string;
  placement?: {
    company: string;
    role: string;
  };
}

export const students: Student[] = [
  {
    "slug": "aishwarya-l-pujeri",
    "name": "Aishwarya L Pujeri",
    "headline": "AI Engineer",
    "specialization": "Artificial Intelligence",
    "gender": "Female",
    "location": "Bengaluru, India",
    "phone": "+91 8073249441",
    "email": "aishwaryapujeri23@gmail.com",
    "linkedin": "https://www.linkedin.com/in/aishwarya-l-pujeri-74b1a9370/",
    "github": "https://github.com/aishwaryapujeri23-coder",
    "resume": "/rez/aishwarya-l-pujeri.pdf",
    "about": "Artificial Intelligence Engineer with a strong foundation in programming, algorithms, and machine learning. Skilled in building intelligent solutions using Python, TensorFlow, PyTorch, and modern AI technologies. Passionate about developing innovative, data-driven systems to solve real-world problems and create meaningful impact.",
    "education": [
      {
        "institute": "REVA University (RACE)",
        "degree": "M.Tech in Artificial Intelligence",
        "period": "Nov 2024 – Nov 2026"
      },
      {
        "institute": "GEC Ramangara",
        "degree": "B.E in Computer Science",
        "period": "Dec 2021 – Jun 2025",
        "cgpa": "8.54"
      }
    ],
    "certifications": [
      "Python 101 for Data Science",
      "SQL and Relational Database 101"
    ],
    "skills": [
      {
        "category": "Programming",
        "items": [
          "Python",
          "Java",
          "SQL",
          "HTML",
          "CSS"
        ]
      },
      {
        "category": "Libraries & Frameworks",
        "items": [
          "NumPy",
          "Pandas",
          "Scikit-learn",
          "Flask",
          "TensorFlow",
          "NLTK",
          "PyTorch",
          "OpenCV"
        ]
      },
      {
        "category": "Data Visualization",
        "items": [
          "Matplotlib",
          "Seaborn",
          "Plotly"
        ]
      },
      {
        "category": "Tools & Platforms",
        "items": [
          "VS Code",
          "Google Colab",
          "Git",
          "GitHub",
          "Jupyter",
          "Power BI",
          "MySQL",
          "MS Excel",
          "Eclipse IDE",
          "Cisco Packet Tracer"
        ]
      },
      {
        "category": "Soft Skills",
        "items": [
          "Positive Attitude",
          "Problem Solving",
          "Quick Learner",
          "Time Management",
          "Adaptability",
          "Team Collaboration",
          "Communication"
        ]
      }
    ],
    "workExperience": [
      {
        "role": "Java Developer Intern",
        "company": "Dhee Coding Lab",
        "period": "Jan 2025 – Jun 2025",
        "bullets": [
          "Completed hands-on training in Java, MySQL, HTML, and CSS, building web applications with front-end and back-end integration.",
          "Developed responsive interfaces and database-driven features to enhance application performance and user experience."
        ]
      }
    ],
    "projects": [
      {
        "title": "Suspicious Activity Recognition using DL models",
        "tag": "Personal Project",
        "bullets": [
          "Designed and developed a deep learning-based suspicious activity detection system using CNN, LSTM, and YOLOv5 to analyze surveillance videos, detect abnormal events such as fire, explosion, accidents, and weapons, and deliver real-time alerts through a Flask-based web application."
        ]
      },
      {
        "title": "Fake News Detection using ML and DL models",
        "tag": "Personal Project",
        "bullets": [
          "Developed a fake news classification system using ML and DL models with NLP techniques such as text preprocessing, tokenization, TF-IDF, and embeddings to distinguish between real and fake news articles using the ISOT and WELFake datasets."
        ]
      },
      {
        "title": "Bus Ticket Booking System",
        "tag": "Personal Project",
        "bullets": [
          "Designed and developed a full-stack bus ticket booking web application using Python, MySQL, HTML, CSS, and JavaScript, enabling users to search routes, view available buses, and book tickets in real time with secure data management and responsive user interfaces."
        ]
      },
      {
        "title": "Automated Duplicate File Finder",
        "tag": "Personal Project",
        "bullets": [
          "Developed a Python and PyQt desktop application to detect and manage duplicate files using SHA-256 hash-based comparison, multi-threaded scanning with ThreadPoolExecutor, and a rule-based NLP chatbot to provide storage insights and intelligent deletion suggestions."
        ]
      }
    ],
    "publications": [],
    "programDates": "Nov 2024 – Nov 2026"
  },
  {
    "slug": "alina-shibu",
    "name": "Alina Shibu",
    "headline": "Artificial Intelligence",
    "specialization": "Artificial Intelligence",
    "gender": "Female",
    "location": "Bengaluru, India",
    "phone": "+91 8147931652",
    "email": "alinamercy@gmail.com",
    "linkedin": "https://www.linkedin.com/in/alina-shibu-a4291b245",
    "photo": "/image/alina-shibu.png",
    "resume": "/rez/alina-shibu.pdf",
    "about": "Adaptable and curious individual passionate about solving real-world problems through innovation and data-driven thinking. Interested in exploring diverse domains, with a growing focus on healthcare analytics and genomics. Committed to continuous learning and building impactful solutions.",
    "education": [
      {
        "institute": "REVA University",
        "degree": "M.Tech in Artificial Intelligence",
        "period": "Nov 2023 – Nov 2025"
      },
      {
        "institute": "Presidency University",
        "degree": "B.E in Computer Science & Engineering",
        "period": "2021 – 2025"
      }
    ],
    "certifications": [
      "Python 101 for Data Science",
      "SQL & Relational Databases 101",
      "Machine Learning with Python",
      "Power BI for Beginners",
      "Networking Fundamentals"
    ],
    "skills": [
      {
        "category": "Programming",
        "items": [
          "Python",
          "SQL",
          "HTML/CSS"
        ]
      },
      {
        "category": "Libraries",
        "items": [
          "NumPy",
          "Pandas",
          "Seaborn",
          "Matplotlib",
          "Streamlit",
          "Scikit-Learn"
        ]
      },
      {
        "category": "Tools & Frameworks",
        "items": [
          "Jupyter",
          "Power BI",
          "MySQL",
          "Gradio",
          "VS Code",
          "PyCharm"
        ]
      }
    ],
    "workExperience": [],
    "projects": [
      {
        "title": "Instagram Content Performance & Virality Audit Dashboard",
        "bullets": [
          "Built a product analytics dashboard to identify high-engagement content drivers and optimize algorithm reach.",
          "Identified key engagement factors: posting time, hashtags, content type, and audience interaction metrics.",
          "Built interactive visualizations tracking likes, shares, reach, engagement rate, and growth trends."
        ]
      },
      {
        "title": "Automated Rental Discovery System",
        "bullets": [
          "Built an AI-powered rental intelligence system using Python, Streamlit, MySQL, Groq LLM, and Google Maps APIs.",
          "Aggregated and ranked rental listings based on affordability, commute, and lifestyle metrics.",
          "Implemented API caching, AI neighbourhood summaries, and automated WhatsApp alerts.",
          "Developed an interactive dashboard with filters, comparisons and CSV report."
        ]
      },
      {
        "title": "NGO Education Impact Analytics Dashboard",
        "bullets": [
          "Developed a Streamlit-based analytics dashboard with MySQL data mart to track school performance and program impact.",
          "Created SQL views & KPI pipelines for attendance, scores, instructor ranking, and regional insights.",
          "Built interactive Plotly visualizations (trends, scatter, comparisons) with dynamic filtering.",
          "Implemented data validation and anomaly detection for identifying low-performing schools."
        ]
      },
      {
        "title": "AI-Based Prakriti Prediction System",
        "bullets": [
          "Developed an AI-driven system integrating questionnaire data, face image analysis, and chatbot interaction.",
          "Implemented ML models to classify Ayurvedic body types (Vata, Pitta, Kapha).",
          "Integrated multilingual chatbot support for improved accessibility."
        ]
      }
    ],
    "publications": [],
    "programDates": "Nov 2023 – Nov 2025"
  },
  {
    "slug": "ambika-yallal",
    "name": "Ambika Yallal",
    "headline": "AI/ML Engineer",
    "specialization": "Artificial Intelligence",
    "gender": "Female",
    "location": "Bengaluru, India",
    "phone": "+91 9845148754",
    "email": "ambika.ry2000@gmail.com",
    "linkedin": "https://www.linkedin.com/in/ambika-yallal-16434632a/",
    "github": "https://github.com/ambika3115",
    "photo": "/image/ambika-yallal.png",
    "resume": "/rez/ambika-yallal.pdf",
    "about": "AI/ML enthusiast skilled in Python, Data Analysis, Statistics, and Machine Learning, with hands-on experience in Pandas, NumPy, SQL, and data visualization. Passionate about solving real-world problems using data and continuously learning new technologies and analytical techniques.",
    "education": [
      {
        "institute": "REVA University (RACE)",
        "degree": "M.Tech in Artificial Intelligence",
        "period": "Nov 2025 – Nov 2027"
      },
      {
        "institute": "MM Engineering College",
        "degree": "B.E. in Computer Science",
        "period": "Aug 2019 – May 2023",
        "cgpa": "8.5"
      }
    ],
    "certifications": [
      "Python 101 for Data Science from IBM",
      "SQL and Relational Database 101 from IBM",
      "Power BI for Beginners",
      "AI Tools Workshop from B10x"
    ],
    "skills": [
      {
        "category": "Programming",
        "items": [
          "Python",
          "Java",
          "SQL",
          "HTML",
          "CSS",
          "Linux"
        ]
      },
      {
        "category": "Data Analysis & ML",
        "items": [
          "NumPy",
          "Pandas",
          "Scikit-learn",
          "EDA"
        ]
      },
      {
        "category": "Data Visualization",
        "items": [
          "Power BI",
          "Matplotlib",
          "Seaborn"
        ]
      },
      {
        "category": "Tools & Platforms",
        "items": [
          "Jupyter",
          "VS Code",
          "MySQL",
          "Google Colab",
          "Excel"
        ]
      },
      {
        "category": "Soft Skills",
        "items": [
          "Self Motivated",
          "Quick Learner",
          "Team Collaboration",
          "Leadership",
          "Willingness to Learn"
        ]
      }
    ],
    "workExperience": [
      {
        "role": "Java Developer Intern",
        "company": "KodNest Learning Centre",
        "bullets": [
          "Completed hands-on Java development training using Java, MySQL, HTML, CSS, Git, and Agile practices to build and debug real-time mini projects collaboratively."
        ]
      }
    ],
    "projects": [
      {
        "title": "MRI-based Brain Tumor Classification",
        "tag": "Personal Project",
        "bullets": [
          "Developed an MRI-based brain tumor classification system using Deep Learning and Explainable AI techniques to accurately detect tumor classes.",
          "Integrated uncertainty estimation and AI-based diagnostic reporting to improve model interpretability, reliability, and clinical decision support."
        ]
      },
      {
        "title": "Customer Churn Prediction System",
        "tag": "Personal Project",
        "bullets": [
          "Built a customer churn prediction system using different algorithms, optimized with ROC-AUC, statistical testing, and GridSearchCV for accurate predictions.",
          "Deployed the best-performing model as a Streamlit app for real-time customer churn prediction."
        ]
      },
      {
        "title": "Skill-based Resume Parser",
        "tag": "Personal Project",
        "bullets": [
          "Developed a Skill-Based Resume Parsing System using Python and NLP techniques to extract skills, education, experience, and personal details from PDF/DOCX resumes."
        ]
      },
      {
        "title": "Automatic Video Summarization Using LLM",
        "tag": "Personal Project",
        "bullets": [
          "Developed an automated video summarization system using Python and Google Gemini API to extract key insights and generate structured notes from videos.",
          "Built an end-to-end pipeline with text extraction, LLM-based summarization, and automated email delivery for efficient content sharing."
        ]
      }
    ],
    "publications": [],
    "programDates": "Nov 2025 – Nov 2027"
  },
  {
    "slug": "avish-t-s",
    "name": "Avish T S",
    "headline": "AI Engineer",
    "specialization": "Artificial Intelligence",
    "gender": "Male",
    "location": "Bengaluru, India",
    "phone": "+91 7338679989",
    "email": "avishts18@gmail.com",
    "collegeEmail": "pgcet2501106@reva.edu.in",
    "linkedin": "https://www.linkedin.com/in/avish-ts/",
    "github": "https://github.com/avishts18",
    "photo": "/uploads/photos/avish-t-s.png",
    "resume": "/rez/avish-t-s.pdf",
    "about": "AI Software Engineer with strong command over Python, SQL, and predictive analytics. Hands-on experience in model building, data visualization, and API integration. Adept in data preprocessing, feature engineering, model deployment, and translating data insights into strategic business decisions. Passionate about applying AI and analytics to solve real-world challenges.",
    "education": [
      {
        "institute": "REVA University (RACE)",
        "degree": "M.Tech in Artificial Intelligence",
        "period": "Nov 2023 – Nov 2025"
      },
      {
        "institute": "Sri Siddhartha Institute of Technology, Tumakuru",
        "degree": "B.E in Computer Science",
        "period": "2020 - 2024"
      }
    ],
    "certifications": [
      "Generative AI Fundamentals - Databricks",
      "Machine Learning with Python - Coursera",
      "Python Programming & Time Management - Infosys SpringBoard",
      "Data Analytics using Python - IBM SkillsBuild",
      "Front-End Web Development - Forage"
    ],
    "skills": [
      {
        "category": "Generative AI & NLP",
        "items": [
          "Hugging Face Transformers",
          "OpenAI / Gemini APIs",
          "RAG",
          "Text Summarization",
          "Agentic AI"
        ]
      },
      {
        "category": "Programming Languages",
        "items": [
          "Python",
          "SQL",
          "JavaScript",
          "TypeScript",
          "HTML5",
          "CSS3"
        ]
      },
      {
        "category": "Data Science & ML",
        "items": [
          "NumPy",
          "Pandas",
          "Scikit-Learn",
          "Matplotlib",
          "Seaborn",
          "EDA",
          "Predictive Modeling",
          "Power BI"
        ]
      },
      {
        "category": "Frameworks & Tools",
        "items": [
          "Flask",
          "Gradio",
          "Streamlit",
          "React.js",
          "Node.js",
          "Tailwind CSS",
          "MySQL Workbench",
          "Excel",
          "Flutter"
        ]
      },
      {
        "category": "Soft Skills",
        "items": [
          "Problem Solving",
          "Agile Development",
          "Technical Documentation",
          "Adaptability"
        ]
      }
    ],
    "workExperience": [
      {
        "role": "Jr. Software Engineer | Intern",
        "company": "TechnoNova Private Limited",
        "period": "Feb 2025 - May 2025",
        "bullets": [
          "Developed Angular, .NET API, and SQL Server full-stack modules.",
          "Automated vehicle inspection workflows using stored procedures and optimized queries.",
          "Built Android Java and Windows Forms tools for transport database management.",
          "Integrated Vanna AI with LLMs for predictive operational insights."
        ]
      }
    ],
    "projects": [
      {
        "title": "Chat with PDF (Streamlit + RAG)",
        "bullets": [
          "Streamlit app for uploading PDFs and asking contextual questions using Retrieval-Augmented Generation.",
          "Implemented document chunking, embeddings, semantic retrieval, and LLM-based answers."
        ]
      },
      {
        "title": "RACEOne (Full-stack Web App)",
        "bullets": [
          "Full-stack platform to streamline capstone project management for RACE administrators and students.",
          "Supports project submission, tracking, review workflows, and communication between students and coordinators."
        ]
      },
      {
        "title": "Customer Churn Prediction (Machine Learning)",
        "bullets": [
          "Churn prediction using Logistic Regression, Random Forest, and XGBoost.",
          "Feature engineering, model comparison, evaluation with ROC-AUC and F1-score."
        ]
      },
      {
        "title": "Image Caption Generator (Deep Learning)",
        "bullets": [
          "CNN + RNN pipeline to extract visual features and generate natural-language image captions.",
          "Image preprocessing, sequence modeling, embeddings."
        ]
      },
      {
        "title": "Sentiment Analysis using LSTM (NLP Classification)",
        "bullets": [
          "LSTM model trained on IMDB dataset to classify movie reviews.",
          "Tokenization, sequence padding, embedding layers, training validation, and performance analysis."
        ]
      }
    ],
    "publications": [],
    "programDates": "Nov 2023 – Nov 2025"
  },
  {
    "slug": "ayesha",
    "name": "Ayesha",
    "headline": "Cybersecurity & GRC Aspirant",
    "specialization": "Cybersecurity",
    "gender": "Female",
    "location": "Bangalore",
    "phone": "+91 8971732841",
    "email": "ayeesha0442@gmail.com",
    "resume": "/rez/ayesha.pdf",
    "about": "Aspiring cybersecurity with a background in computer engineering. Strong analytical skills and a keen interest in AI based security solutions. Known for being reliable, analytical, and goal oriented — eager to learn, grow, and contribute to real world cybersecurity challenges.",
    "education": [
      {
        "institute": "REVA University (RACE)",
        "degree": "M.Tech in CyberSecurity",
        "period": "Nov 2023 – Nov 2025"
      },
      {
        "institute": "REVA University",
        "degree": "B.Tech in Information Technology",
        "period": "2021 – 2025"
      }
    ],
    "certifications": [
      "Python for Data Science",
      "Cybersecurity Interpret Phishing Simulation",
      "Space Science and Technology - ISRO",
      "AGNIRVA Space Technology and Artificial Intelligence - ISRO",
      "Generative AI by Google Cloud",
      "Networking Basics - CISCO Networking Academy",
      "Power BI in Data Analytics",
      "Encryption and Quantum-Safe Techniques"
    ],
    "skills": [
      {
        "category": "Programming",
        "items": [
          "Python"
        ]
      },
      {
        "category": "Security",
        "items": [
          "Network Traffic Analysis",
          "Log Analysis"
        ]
      },
      {
        "category": "Tools",
        "items": [
          "VS Code",
          "Arduino IDE",
          "Cisco Packet Tracer",
          "Playwright",
          "Grafana",
          "Figma",
          "Spline",
          "Wireshark",
          "Telemetry",
          "Power BI"
        ]
      },
      {
        "category": "Soft Skills",
        "items": [
          "Strong Communication",
          "Team Management",
          "Teamwork"
        ]
      }
    ],
    "workExperience": [
      {
        "role": "Automation Engineer Intern",
        "company": "L&T Technology Services",
        "period": "Oct 2024 – Nov 2025",
        "bullets": [
          "Worked on AI-driven automation features including automated test script generation, reusable testing components, and DevOps pipeline integration to improve testing efficiency and accuracy.",
          "Contributed to live dashboards with custom analytics for test performance tracking and applied AI/ML techniques for defect classification and prioritization, enabling faster debugging and improved issue resolution through cross-functional collaboration."
        ]
      }
    ],
    "projects": [
      {
        "title": "Network Anomaly Detection for Cyber Threat Identification Using Artificial Intelligence",
        "bullets": [
          "Uses unsupervised machine learning techniques to identify unusual network behavior that may indicate cyber-attacks, such as intrusions or abnormal traffic patterns. By analyzing network data without labeled samples, the system enhances early threat detection and supports proactive network security monitoring."
        ]
      },
      {
        "title": "Home Automation System (NodeMCU and WiFi Relays)",
        "bullets": [
          "Designed and deployed a smart home automation system using NodeMCU (ESP8266) and Wi-Fi relay modules for remote appliance control via mobile apps, web interfaces, and voice assistants. Integrated secure authentication, real-time monitoring, and sensor-based environmental tracking to deliver a scalable and reliable automation solution."
        ]
      },
      {
        "title": "Improving Disease Diagnosis and Prediction Precision using Machine Learning in Genomic Data Analysis",
        "bullets": [
          "Used a machine learning-based framework to improve the diagnosis and prediction accuracy of Alzheimer's disease and brain cancer using large genomic datasets. Integrated DRAGEN for fast and accurate genomic data processing with BA-TLBO for optimized feature selection and model tuning, enabling an efficient pipeline that supports precision and personalized medicine."
        ]
      }
    ],
    "publications": [],
    "programDates": "Nov 2023 – Nov 2025"
  },
  {
    "slug": "jothika-b",
    "name": "B Jothika",
    "headline": "AI-ML Developer",
    "specialization": "Artificial Intelligence",
    "gender": "Female",
    "location": "Bengaluru, Karnataka 560005",
    "phone": "+91 9741150810",
    "email": "jothikachandra2027@gmail.com",
    "collegeEmail": "pgcet2500758@reva.edu.in",
    "linkedin": "https://www.linkedin.com/in/jothika-b-923165225",
    "github": "https://github.com/Jothika20",
    "resume": "/rez/jothika-b.pdf",
    "about": "AI/ML passionate for innovation. Successfully developed and deployed AI-driven solutions that enhance user experience and functionality. Excels in problem-solving, adapting to new technologies, and delivering high-quality software solutions.",
    "education": [
      {
        "institute": "REVA University (RACE)",
        "degree": "M.Tech in Artificial Intelligence",
        "period": "Nov 2024 – Nov 2026"
      },
      {
        "institute": "REVA University, Bengaluru, Karnataka",
        "degree": "B.Tech in Computer Science and Engineering",
        "period": "2020 - 2024"
      },
      {
        "institute": "St. Joseph's Girls' PU College, Bengaluru, Karnataka",
        "degree": "PUC",
        "period": "2019 - 2020"
      },
      {
        "institute": "St. Joseph's Convent Girls' High School, Bengaluru, Karnataka",
        "degree": "SSLC",
        "period": "2017 - 2018"
      }
    ],
    "certifications": [],
    "skills": [
      {
        "category": "AI & Machine Learning",
        "items": [
          "Data Exploration",
          "Data Preprocessing",
          "Data Visualization",
          "Machine Learning Algorithms"
        ]
      },
      {
        "category": "Programming Languages",
        "items": [
          "C",
          "Python",
          "HTML",
          "CSS",
          "JavaScript"
        ]
      },
      {
        "category": "Databases & Frameworks",
        "items": [
          "MongoDB",
          "SQL",
          "React JS",
          "Node JS"
        ]
      },
      {
        "category": "Soft Skills",
        "items": [
          "Excellent communication and presentation skills",
          "dedicated and responsible",
          "strong problem-solving"
        ]
      }
    ],
    "workExperience": [
      {
        "role": "Software Developer",
        "company": "Data Safeguard Inc",
        "period": "Jul 2023 - Jun 2024",
        "bullets": []
      }
    ],
    "projects": [
      {
        "title": "Generative AI Project (Work in Progress)",
        "bullets": [
          "Developing a Gen AI solution for enhanced user interaction through advanced language generation techniques.",
          "Designing, training, and fine-tuning large language models."
        ]
      },
      {
        "title": "Expert System for Disease in Cotton Plant Using Task-Oriented Dialogue",
        "bullets": [
          "Rule-based system that identifies potential crop diseases by analyzing weather condition parameters.",
          "Users input attribute values matched against defined rules."
        ]
      }
    ],
    "publications": [],
    "programDates": "Nov 2024 – Nov 2026",
    "placement": {
      "company": "Trmeric",
      "role": "UI Engineer"
    }
  },
  {
    "slug": "b-meenu",
    "name": "B Meenu",
    "headline": "Artificial Intelligence",
    "specialization": "Artificial Intelligence",
    "gender": "Female",
    "location": "Bengaluru, India",
    "phone": "+91 9008557126",
    "email": "meenub255@gmail.com",
    "linkedin": "https://www.linkedin.com/in/meenu-b-79ba73208",
    "github": "https://github.com/meenub255",
    "photo": "/image/b-meenu.jpeg",
    "resume": "/rez/b-meenu.pdf",
    "about": "Dynamic AI Developer skilled in Python, TensorFlow, and data analysis. Experienced in prototyping machine learning applications and building data-driven solutions to optimize business processes. Passionate about applying deep learning techniques to solve real-world problems and eager to contribute to innovative AI teams.",
    "education": [
      {
        "institute": "REVA University (RACE)",
        "degree": "M.Tech. in Artificial Intelligence",
        "period": "Nov 2024 – Nov 2026"
      },
      {
        "institute": "REVA University",
        "degree": "B.Tech in Artificial Intelligence and Machine Learning",
        "period": "Sep 2022 – Sep 2025"
      }
    ],
    "certifications": [
      "Python for Data Science (Silver Medalist) - NPTEL",
      "Deep Learning - IIT Ropar (Silver Medalist) - NPTEL",
      "Applied Accelerated Artificial Intelligence - NPTEL",
      "Natural Language Processing - NPTEL",
      "Generative AI By Google Cloud",
      "Introduction to Artificial Intelligence",
      "MATLAB for Data Processing and Visualization",
      "Machine Learning using Python",
      "Introduction To Supervised and Unsupervised Machine Learning"
    ],
    "skills": [
      {
        "category": "Programming Languages",
        "items": [
          "Python",
          "C++",
          "Java",
          "R (RStudio)",
          "MATLAB"
        ]
      },
      {
        "category": "Artificial Intelligence",
        "items": [
          "Machine Learning",
          "Generative AI",
          "NLP",
          "Computer Vision"
        ]
      },
      {
        "category": "Databases",
        "items": [
          "MySQL",
          "PostgreSQL",
          "Qdrant",
          "Redis"
        ]
      },
      {
        "category": "Task Queue / Async",
        "items": [
          "Celery (Redis)"
        ]
      },
      {
        "category": "Business Intelligence",
        "items": [
          "Power BI",
          "Excel"
        ]
      },
      {
        "category": "Soft Skills",
        "items": [
          "Leadership",
          "Quick Learner",
          "Teamwork",
          "Problem Solving",
          "Critical & Analytical Thinking",
          "Proactive Attitude",
          "Adaptability"
        ]
      }
    ],
    "workExperience": [],
    "projects": [
      {
        "title": "AI-Based Content Moderator for Devanagari Scripts",
        "tag": "Personal Project",
        "bullets": [
          "Uses advanced NLP models like mBERT, FastText, and LLMs to detect harmful content (hate speech, threats) and identify targets, focusing on Hindi, Marathi, Nepali, and Sanskrit. PR-AUC: FastText 0.92, Hate-SpeechCNERG 0.39, mBERT 0.78."
        ]
      },
      {
        "title": "Neuro-Fuzzy Autonomous Navigation System",
        "tag": "Personal Project",
        "bullets": [
          "Developed a real-time autonomous navigation system using Interval Type-2 Neuro-Fuzzy Logic (IT2-ANFIS) to process monocular vision data, modeling environmental uncertainty through a Footprint of Uncertainty (FOU) for robust decision-making in adverse weather and lighting.",
          "Engineered a perception pipeline integrating YOLOv8 for lane and obstacle detection with 90.45% accuracy, while maintaining explainability by mapping AI decisions to transparent, rule-based telemetry."
        ]
      },
      {
        "title": "Next-Generation RAG: Integrating Corrective Loops, HyDE, and Knowledge Graphs",
        "tag": "Personal Project",
        "bullets": [
          "Engineered a self-healing retrieval system using LangGraph and CRAG that autonomously evaluates document relevance and triggers a Tavily web search fallback to mitigate hallucinations.",
          "Enhanced semantic search accuracy by integrating HyDE and Query Decomposition with a Cross-Encoder reranker."
        ]
      },
      {
        "title": "Multi-Modal Road Hazard Anticipation System using Monocular Vision",
        "tag": "Personal Project",
        "bullets": [
          "Multi-modal road hazard anticipation system using monocular vision."
        ]
      }
    ],
    "publications": [
      "AI-Based Content Moderator for Devanagari Scripts",
      "Identification of Different Medicinal Plants/Raw Materials through Image Processing Using Machine Learning Algorithms",
      "A Cyber Defensive Model for Diabetic Retinopathy Using Bit-Plane Methods"
    ],
    "programDates": "Nov 2024 – Nov 2026"
  },
  {
    "slug": "bhagyashree-patil",
    "name": "Bhagyashree Patil",
    "headline": "AI Engineer",
    "specialization": "Artificial Intelligence",
    "gender": "Female",
    "location": "Bangalore",
    "phone": "+91 7676428044",
    "email": "bhagyashreepatil0903@gmail.com",
    "linkedin": "https://www.linkedin.com/in/bhagyashree-c-patil/",
    "github": "https://github.com/bhagyashree-Patil2609",
    "photo": "/image/bhagyashree-patil.png",
    "resume": "/rez/bhagyashree-patil.pdf",
    "about": "Aspiring AI Engineer with foundational knowledge of Python, machine learning, and data analysis. Interested in building intelligent systems, working with AI models, and developing data-driven solutions to solve real-world problems. Eager to learn, innovate, and grow in the field of Artificial Intelligence and emerging technologies.",
    "education": [
      {
        "institute": "REVA University",
        "degree": "M.Tech Artificial Intelligence",
        "period": "Nov 2023 – Nov 2025"
      },
      {
        "institute": "Presidency University",
        "degree": "B.Tech Computer Science and Engineering",
        "period": "2021 – 2025"
      }
    ],
    "certifications": [
      "Python 101 for Data Science",
      "SQL and Relational Database 101",
      "Machine Learning",
      "Power BI for Beginners",
      "Introduction to Cloud Computing"
    ],
    "skills": [
      {
        "category": "Programming",
        "items": [
          "Python"
        ]
      },
      {
        "category": "Database",
        "items": [
          "MySQL",
          "MongoDB"
        ]
      },
      {
        "category": "Visualization",
        "items": [
          "Power BI",
          "MS Excel"
        ]
      },
      {
        "category": "Soft Skills",
        "items": [
          "Leadership",
          "Teamwork"
        ]
      }
    ],
    "workExperience": [
      {
        "role": "Backend Development Intern",
        "company": "L&T Technology Services",
        "period": "Feb 2025 – May 2025",
        "bullets": [
          "Developed RESTful APIs using Python (FastAPI) and worked with PostgreSQL and MongoDB for backend data management.",
          "Implemented JWT authentication and AES encryption while following modular architecture and agile development practices."
        ]
      }
    ],
    "projects": [
      {
        "title": "AyurConnect – AI-Assisted Ayurvedic Wellness Platform",
        "bullets": [
          "Developed an AI-powered Ayurvedic wellness and consultation platform using React, FastAPI, and MongoDB.",
          "Implemented Prakriti assessment, conversational symptom chatbot, personalized wellness recommendations, and AI-generated wellness summary PDFs.",
          "Designed role-based patient and doctor workflows with future-ready support for RAG, LLM integration, and digital consultation services."
        ]
      },
      {
        "title": "Automated Personal Finance Management System (ML)",
        "bullets": [
          "Worked with structured financial data to analyze spending behavior using machine learning techniques.",
          "Created insights and basic reports to support data-driven decision-making and performance tracking."
        ]
      },
      {
        "title": "Blood Donation Management System",
        "bullets": [
          "Built a blood donation management system to store and manage donor data efficiently.",
          "Applied database concepts for data organization, retrieval, and basic analysis."
        ]
      },
      {
        "title": "LexiSight – Text-to-Infographic AI Tool",
        "bullets": [
          "Built an AI-based system that summarizes long text, extracts keywords, and generates visual infographics using Python (TextRank, TF-IDF, WordCloud, Streamlit)."
        ]
      }
    ],
    "publications": [],
    "programDates": "Nov 2023 – Nov 2025"
  },
  {
    "slug": "chalukya-nayaka-bk",
    "name": "Chalukya Nayaka B K",
    "headline": "Cybersecurity Engineer",
    "specialization": "Cybersecurity",
    "gender": "Male",
    "location": "Bengaluru, India",
    "phone": "+91 9591225555",
    "email": "chalukyanayakabk2@gmail.com",
    "linkedin": "https://www.linkedin.com/in/chalukya-nayaka-b-k-131b232aa/",
    "github": "https://github.com/hanicharles",
    "photo": "/image/chalukya-nayaka-bk.png",
    "resume": "/rez/chalukya-nayaka-bk.pdf",
    "about": "Aspiring Cybersecurity professional with interest in network security monitoring, anomaly detection, and DNS traffic analysis. Skilled in identifying suspicious activities and potential threats using cybersecurity tools and techniques. Passionate about Threat Detection and Cybersecurity Analysis through continuous learning and practical implementation.",
    "education": [
      {
        "institute": "REVA University (RACE)",
        "degree": "M.Tech. in Cyber Security",
        "period": "Nov 2025 – Nov 2027"
      },
      {
        "institute": "REVA University",
        "degree": "B.Tech in Computer Science Engineering",
        "period": "Sep 2021 – Sep 2025"
      }
    ],
    "certifications": [
      "Cloud Computing Masterclass: Deployment to Administration",
      "Python 101 for Data Science",
      "SQL and Relational Databases 101",
      "Networking Basics – Cisco"
    ],
    "skills": [
      {
        "category": "Cybersecurity & Networking",
        "items": [
          "Operating Systems",
          "Networking Fundamentals",
          "DBMS",
          "Web Technologies",
          "Cybersecurity Fundamentals",
          "Vulnerability Assessment",
          "TCP/IP",
          "DNS",
          "VPNs",
          "Firewalls",
          "Packet Analysis",
          "Network Traffic Inspection",
          "Threat Identification"
        ]
      },
      {
        "category": "Soft Skills",
        "items": [
          "Analytical Thinking",
          "Problem Solving",
          "Critical Thinking",
          "Technical Report Writing",
          "Team Collaboration",
          "Communication"
        ]
      },
      {
        "category": "Tools",
        "items": [
          "MS Office",
          "MySQL Workbench",
          "Cisco Packet Tracer",
          "VS Code",
          "Wazuh",
          "Nmap",
          "Splunk",
          "MongoDB"
        ]
      }
    ],
    "workExperience": [
      {
        "role": "ML Intern – Data Annotator",
        "company": "ROBOSOFT Technologies, Bengaluru",
        "period": "Jan 2025 – Jun 2025",
        "bullets": [
          "Worked on annotating and preparing high-quality datasets for machine learning applications, ensuring accuracy and consistency.",
          "Contributed to improving model performance by maintaining well-structured and reliable data."
        ]
      }
    ],
    "projects": [
      {
        "title": "Person Tracking System",
        "tag": "Personal Project",
        "bullets": [
          "Advanced Face Recognition.",
          "Anti-Spoofing & Secure Authentication.",
          "Real-Time Monitoring."
        ]
      },
      {
        "title": "API Key Management System",
        "tag": "Personal Project",
        "bullets": [
          "Secure storage and protection: API keys are securely stored using encryption and access control mechanisms to prevent unauthorized access or misuse.",
          "Access control and authentication: The system manages who can create, use, revoke, or modify API keys and ensures only authorized users or applications can access APIs."
        ]
      },
      {
        "title": "Web Vulnerability Header Scanner",
        "tag": "Personal Project",
        "bullets": [
          "Automated multi-tool web vulnerability scanner.",
          "Runs and correlates results from many security tools.",
          "Classifies and reports vulnerabilities with severity levels."
        ]
      }
    ],
    "publications": [
      "Person Tracking System (Advanced Face Recognition, Anti-Spoofing & Secure Authentication Real-Time Monitoring)"
    ],
    "programDates": "Nov 2025 – Nov 2027"
  },
  {
    "slug": "dattaguru-chettiar",
    "name": "Dattaguru Chettiar",
    "headline": "Cybersecurity Engineer",
    "specialization": "Cybersecurity",
    "gender": "Male",
    "location": "Bengaluru, India",
    "phone": "+91 9004230088",
    "email": "gurudatta229028@gmail.com",
    "github": "https://github.com/Datta-guru/",
    "photo": "/image/dattaguru-chettiar.jpeg",
    "resume": "/rez/dattaguru-chettiar.pdf",
    "about": "Security-focused individual with hands-on experience in network packet analysis, alert investigation, and vulnerability assessment. Skilled in using tools like Wireshark, Wazuh, Nmap, and Nessus, with knowledge of SIEM concepts and incident response processes. Experienced in developing a Python-based API security testing tool and committed to strengthening security operations through continuous learning and practical application.",
    "education": [
      {
        "institute": "REVA University (RACE)",
        "degree": "M.Sc. in Cyber Security",
        "period": "Nov 2024 – Nov 2026"
      },
      {
        "institute": "REVA University",
        "degree": "B.Sc. in Information Technology",
        "period": "Sep 2022 – Sep 2025"
      }
    ],
    "certifications": [
      "Certified Ethical Hacker (EC Council)",
      "Networking Basics (Cisco)",
      "Python 101 for Data Science (IBM)"
    ],
    "skills": [
      {
        "category": "Cybersecurity & Networking",
        "items": [
          "Network Packet Analysis",
          "Network Fundamentals",
          "VAPT",
          "API Security Testing",
          "HTML",
          "CSS",
          "Linux",
          "Windows",
          "IoT Fundamentals"
        ]
      },
      {
        "category": "Soft Skills",
        "items": [
          "Quick Learner",
          "Teamwork",
          "Problem Solving",
          "Critical Thinking"
        ]
      },
      {
        "category": "Tools",
        "items": [
          "Nmap",
          "Burp Suite",
          "Wireshark",
          "Metasploit",
          "SQLMap",
          "John the Ripper",
          "Subfinder",
          "Dirb",
          "Nessus",
          "Hydra",
          "Wazuh"
        ]
      }
    ],
    "workExperience": [],
    "projects": [
      {
        "title": "API Security Testing & Vulnerability Scanner",
        "tag": "Personal Project · Jan 2025 – Jun 2025",
        "bullets": [
          "Developing a Python-based automated API vulnerability scanner capable of testing multiple REST endpoints for authentication bypass, TLS/HTTPS enforcement, rate limiting, and sensitive data exposure.",
          "Adding support for JWT token-based authentication and integrating JSON/HTML report generation for audit and documentation.",
          "Building a FastAPI-based local test environment to simulate both public and secure endpoints for realistic testing scenarios."
        ]
      },
      {
        "title": "Firewall: GUI-Based Firewall (Linux)",
        "tag": "Personal Project",
        "bullets": [
          "Develop a user-friendly GUI application that allows users to create and manage firewall rules easily without using command-line tools.",
          "Simulate network traffic control by enabling users to define rules based on IP address, port number, protocol, and action (ACCEPT, DROP, REJECT).",
          "Implement rule management and validation, allowing users to add, delete, reorder rules and ensure correct inputs to avoid configuration errors."
        ]
      },
      {
        "title": "ControApp: Group Expense Management System",
        "tag": "Personal Project",
        "bullets": [
          "Manage group expenses easily by allowing users to create groups (Contro), add members, and store all expense details in one place.",
          "Automatically split expenses and track payments by dividing the total amount among members and showing who has paid and who is pending.",
          "Send reminders to pending members by notifying them (via WhatsApp/Message) to complete their payments on time."
        ]
      },
      {
        "title": "Home Automation System (Raspberry Pi)",
        "tag": "Personal Project",
        "bullets": [
          "Designed and deployed a smart home automation platform allowing remote device control and sensor monitoring via a browser-based dashboard.",
          "Achieved reliable device communication through GPIO control and logged environmental data for analytics. System supports user authentication and automatic device triggers based on sensor thresholds.",
          "Implemented device control using GPIO pins on Raspberry Pi to manage appliances such as lights, fans, and sensors."
        ]
      }
    ],
    "publications": [],
    "programDates": "Nov 2024 – Nov 2026",
    "placement": {
      "company": "Justdial",
      "role": "Security Testing Intern"
    }
  },
  {
    "slug": "dhanusha-g",
    "name": "Dhanusha G",
    "headline": "AI and Data Engineer",
    "specialization": "Artificial Intelligence",
    "gender": "Female",
    "location": "Bengaluru, India",
    "phone": "+91 9731326208",
    "email": "dhanusha.govind99@gmail.com",
    "collegeEmail": "pgcet2500907@race.reva.edu.in",
    "photo": "/image/dhanusha-g.jpeg",
    "resume": "/rez/dhanusha-g.pdf",
    "about": "AI enthusiast with expertise in machine learning, data science, and generative AI. Hands-on experience in building real-world AI solutions. Proficient in Python, SQL, NLP, and modern AI frameworks. Translates complex business problems into scalable, data-driven solutions. Brings valuable industry exposure through enterprise system experience with strong problem-solving, adaptability, and readiness for AI-driven roles.",
    "education": [
      {
        "institute": "REVA Academy for Corporate Excellence, REVA University, Bengaluru",
        "degree": "M.Tech in Artificial Intelligence",
        "period": "Nov 2023 – Nov 2025"
      },
      {
        "institute": "Nitte Meenakshi Institute of Technology, Bengaluru",
        "degree": "B.E in Information Science and Engineering",
        "period": "CGPA: 7.8"
      }
    ],
    "certifications": [
      "Python 101 For Data Science - IBM",
      "SQL and Relational Database 101 - IBM"
    ],
    "skills": [
      {
        "category": "Programming Languages",
        "items": [
          "Python",
          "SQL",
          "HTML",
          "CSS"
        ]
      },
      {
        "category": "Artificial Intelligence & GenAI",
        "items": [
          "Prompt Engineering",
          "LLM Optimization",
          "RAG",
          "NLM"
        ]
      },
      {
        "category": "Data Science & Machine Learning",
        "items": [
          "Scikit-Learn",
          "NumPy",
          "Pandas",
          "Matplotlib",
          "Seaborn",
          "EDA",
          "ML Algorithms"
        ]
      },
      {
        "category": "Computer Vision",
        "items": [
          "OpenCV",
          "Image Classification",
          "Image Segmentation",
          "Feature Extraction"
        ]
      },
      {
        "category": "Business Intelligence",
        "items": [
          "Power BI",
          "Interactive Dashboard Design",
          "Data Storytelling"
        ]
      },
      {
        "category": "Soft Skills",
        "items": [
          "Leadership",
          "Problem Solving",
          "Creative",
          "Efficient Communication",
          "Adaptability",
          "Decision Making",
          "Active Listener"
        ]
      }
    ],
    "workExperience": [
      {
        "role": "Salesforce Administrator",
        "company": "Salesforce Ecosystem",
        "period": "08/2022 - 02/2025",
        "bullets": [
          "Managed Salesforce administration: users, roles, permission sets, security controls, objects, and workflows.",
          "Designed automated business processes using Flows and Process Builder.",
          "Created reports and dashboards for decision-making."
        ]
      }
    ],
    "projects": [
      {
        "title": "RACEOne - AI-assisted Capstone Workflow Platform",
        "bullets": [
          "Secure role-based dashboards, workflow automation, AI-powered proposal and documentation assistance.",
          "Stack: Next.js, TypeScript, Prisma ORM, Tailwind CSS."
        ]
      },
      {
        "title": "Chat with PDF using RAG",
        "bullets": [
          "AI-powered PDF Q&A system using RAG architecture, FAISS vector search, and LLM integration.",
          "Semantic document retrieval and real-time interactive chat."
        ]
      },
      {
        "title": "Leaf Disease Detection using Image Processing & CNN",
        "bullets": [
          "Deep learning-based system using CNN and image processing.",
          "Image preprocessing, data augmentation, model training."
        ]
      },
      {
        "title": "AI-Powered Personalized Education and Career Path Advisory and Recommendation",
        "bullets": [
          "Deep learning-based system (CNN + image processing).",
          "Personalized education and career path recommendations."
        ]
      }
    ],
    "publications": [],
    "programDates": "Nov 2023 – Nov 2025"
  },
  {
    "slug": "janhvi-jeevan-revankar",
    "name": "Janhvi J Revankar",
    "headline": "Cybersecurity Engineer",
    "specialization": "Cybersecurity",
    "gender": "Female",
    "location": "Bengaluru, India",
    "phone": "7483790438",
    "email": "revankarjanhvi@gmail.com",
    "collegeEmail": "pgcet2501013@reva.edu.in",
    "linkedin": "Janhvi Revankar",
    "github": "Janhvi Revankar",
    "photo": "/image/janhvi-jeevan-revankar.png",
    "resume": "/rez/janhvi-jeevan-revankar.pdf",
    "about": "Cybersecurity enthusiast with a background in Electronics and Communication Engineering. Good analytical skills and hands-on experience in email security analysis, threat detection, and network vulnerability assessment. Seeking a cybersecurity engineer role to contribute to secure system design, threat mitigation, and continuous security improvement.",
    "education": [
      {
        "institute": "REVA Academy For Corporate Excellence, REVA University, Bengaluru, India",
        "degree": "M.Tech in Cybersecurity",
        "period": "Nov 2025 – Nov 2027"
      },
      {
        "institute": "Government Engineering College, Karwar",
        "degree": "B.E in Electronics and Communications",
        "period": "CGPA: 8.71"
      }
    ],
    "certifications": [
      "Introduction to Networking - Cisco",
      "Tata Group Cybersecurity Analyst Job Simulation - Tata Forage",
      "Python 101 for Data Science - IBM",
      "SQL and Relational Databases - IBM",
      "Internet of Things - Infosys Springboard"
    ],
    "skills": [
      {
        "category": "Technical Skills",
        "items": [
          "Fundamentals of Network Security",
          "Email Security Analysis",
          "Log Analysis",
          "IoT Security",
          "Python",
          "SQL",
          "Data Visualization",
          "Digital Electronics",
          "Verilog HDL"
        ]
      },
      {
        "category": "Tools",
        "items": [
          "Autopsy",
          "Nmap",
          "Wireshark",
          "Wazuh",
          "MySQL Workbench",
          "Arduino IDE",
          "Cadence Xcelium"
        ]
      }
    ],
    "workExperience": [
      {
        "role": "VLSI Design Intern",
        "company": "Rooman Technologies Pvt. Ltd",
        "period": "Sep 2024 - Feb 2025",
        "bullets": [
          "RTL coding, simulation, and verification of digital circuits using Verilog.",
          "Worked on complete ASIC design flow (RTL to GDSII).",
          "Synthesis using Yosys; netlist analysis for logic and area optimization.",
          "Place and route using OpenROAD.",
          "Layout visualization using KLayout."
        ]
      }
    ],
    "projects": [
      {
        "title": "Email Phishing Detection System and Analysis Tool",
        "bullets": [
          "Python-based phishing detection using rule-based threat indicators and email header analysis.",
          "Detects spoofing, reply-to manipulation, suspicious domains.",
          "Applied regex to identify phishing patterns, credential harvesting, and malicious payload references.",
          "Parsed .eml artifacts to validate metadata integrity."
        ]
      },
      {
        "title": "Automated Network Vulnerability Scanner",
        "bullets": [
          "Python-based automated network scanning for security assessment.",
          "Host discovery and TCP port scanning to identify exposed services.",
          "Integrated Nmap for service enumeration and vulnerability identification.",
          "Generates structured scan reports for threat hunting and attack surface visibility."
        ]
      },
      {
        "title": "Secure IoT-Based 3D Printer Emulator with Defense Mechanisms",
        "bullets": [
          "ESP32-based secure WiFi-enabled 3D printer emulator.",
          "Demonstrated cybersecurity vulnerabilities: unauthorized access, command injection, DoS attacks.",
          "Implemented TLS-based encrypted communication, authentication, and rate limiting.",
          "Input validation and command whitelisting to prevent malicious G-code execution."
        ]
      },
      {
        "title": "Optimized Design of Delay and Energy-Efficient Booth Multiplier",
        "bullets": [
          "High-speed, power-efficient Booth multiplier using hybrid Radix-4 encoding.",
          "17% reduction in delay and 7.46% reduction in power usage vs traditional designs."
        ]
      },
      {
        "title": "Multi-tasking Agriculture Robot using Microcontroller",
        "bullets": [
          "ESP32-based automated agriculture system with sensors and motor controllers.",
          "Wireless communication for remote monitoring and control.",
          "Sensor-driven automation workflows."
        ]
      }
    ],
    "publications": [],
    "programDates": "Nov 2025 – Nov 2027",
    "placement": {
      "company": "IISc Bangalore",
      "role": "Intern"
    }
  },
  {
    "slug": "kaarthikeyen-g",
    "name": "Kaarthikeyen G",
    "headline": "M.Sc CS Candidate",
    "specialization": "Cybersecurity",
    "gender": "Male",
    "location": "Bengaluru, India",
    "phone": "+91 7200845465",
    "email": "g.kaarthik12@gmail.com",
    "collegeEmail": "Kaarthikeyen.CSFT25@race.reva.edu.in",
    "about": "Passionate about computer science concepts and software technologies.",
    "education": [
      {
        "institute": "REVA University (RACE)",
        "degree": "M.Sc CS",
        "period": "Nov 2024 – Nov 2026"
      }
    ],
    "certifications": [],
    "skills": [
      {
        "category": "Skills",
        "items": [
          "Computer Science",
          "Programming",
          "Problem Solving"
        ]
      }
    ],
    "workExperience": [],
    "projects": [],
    "publications": [],
    "programDates": "Nov 2024 – Nov 2026",
    "placement": {
      "company": "AngelOne",
      "role": "GRC"
    }
  },
  {
    "slug": "lakshmi-shivani-k",
    "name": "Lakshmi Shivani K",
    "headline": "Cybersecurity Engineer",
    "specialization": "Cybersecurity",
    "gender": "Female",
    "location": "Bengaluru, India",
    "phone": "+91 9535463787",
    "email": "lakshmishivanik.19@gmail.com",
    "collegeEmail": "pgcet2500797@reva.edu.in",
    "photo": "/image/lakshmi-shivani-k.jpg",
    "resume": "/rez/lakshmi-shivani-k.pdf",
    "about": "Cybersecurity engineering enthusiast with hands-on experience in security automation, API security testing, OSINT-based attack surface analysis, and Python-based security tool development. Skilled in vulnerability assessment, network security concepts, and cybersecurity automation.",
    "education": [
      {
        "institute": "REVA University (RACE)",
        "degree": "M.Tech in Cybersecurity",
        "period": "Nov 2024 – Nov 2026"
      },
      {
        "institute": "REVA University",
        "degree": "B.E. in CSE (IoT & Cyber Security including Blockchain Technology)",
        "period": "Sep 2022 - Sep 2025"
      }
    ],
    "certifications": [
      "Cyber Security Fundamentals",
      "Networking Basics",
      "Python 101 for Data Science"
    ],
    "skills": [
      {
        "category": "Technical & Programming",
        "items": [
          "Python",
          "Embedded C",
          "Java"
        ]
      },
      {
        "category": "Security & Analysis",
        "items": [
          "Networking Fundamentals",
          "API Security",
          "Security Automation",
          "Authentication & Access Control",
          "OSINT Attack Surface Analysis",
          "Threat Intelligence",
          "Digital Footprint Analysis",
          "Threat Detection & Basic Threat Hunting",
          "Incident Investigation & Basic Incident Triage",
          "Vulnerability Assessment",
          "OWASP API Top 10"
        ]
      },
      {
        "category": "Tools & Cloud Platforms",
        "items": [
          "Nmap",
          "Nikto",
          "Postman",
          "Wazuh",
          "Wireshark",
          "Wappalyzer",
          "Arpspoof",
          "Linux & Shell Basics",
          "Git",
          "Power BI",
          "AWS Console (Lambda, API Gateway, DynamoDB)"
        ]
      },
      {
        "category": "Soft Skills",
        "items": [
          "Analytical Thinking",
          "Problem Solving",
          "Attention to Detail",
          "Communication",
          "Team Collaboration",
          "Technical Documentation"
        ]
      }
    ],
    "workExperience": [
      {
        "role": "Machine Learning Intern",
        "company": "Psitron Technologies Pvt Ltd",
        "period": "Jan 2025 - Jun 2025",
        "bullets": [
          "Contributed to Generative AI projects for scalable solutions.",
          "Evaluated LLMs to enhance response accuracy and performance.",
          "Leveraged AWS services to design and manage backend infrastructure.",
          "Developed serverless applications using AWS Lambda and API Gateway."
        ]
      }
    ],
    "projects": [
      {
        "title": "Adversary-Centric Digital Footprint Analyser (Personal)",
        "bullets": [
          "Python-based OSINT framework for analysing organisational attack surface exposure.",
          "Automated collection of subdomains, open ports, leaked credentials, technology stack details, email patterns.",
          "Designed weighted risk scoring model for composite attack surface risk scores."
        ]
      },
      {
        "title": "ARP Spoofing Detection Tool (Personal)",
        "bullets": [
          "Network security tool using Python and Scapy to detect ARP spoofing (MITM attacks).",
          "Monitored IP-MAC inconsistencies to identify suspicious network activity in real time."
        ]
      },
      {
        "title": "AI Command Line Assistant for Cybersecurity Automation (Personal)",
        "bullets": [
          "Python-based automation tool using subprocess and regex.",
          "Automated Nmap scanning, WHOIS lookup, ping, traceroute."
        ]
      },
      {
        "title": "API Security Assessment Engine - OWASP Top 10 (Personal)",
        "bullets": [
          "API security testing using Postman and Python scripts.",
          "Simulated real-world attacks to detect authentication and access control issues."
        ]
      }
    ],
    "publications": [],
    "programDates": "Nov 2024 – Nov 2026"
  },
  {
    "slug": "mevada-vinit",
    "name": "Mevada Vinit",
    "headline": "Security Testing / Penetration Tester",
    "specialization": "Cybersecurity",
    "gender": "Male",
    "location": "Bengaluru, India",
    "phone": "+91 9099442190",
    "email": "vinitharsh20@gmail.com",
    "collegeEmail": "Mevada.CSFT25@race.reva.edu.in",
    "linkedin": "Vinit Mevada",
    "github": "Vinit Mevada",
    "resume": "/rez/mevada-vinit.pdf",
    "about": "Aspiring cybersecurity professional with hands-on experience in web application security testing and vulnerability assessment. Skilled in identifying OWASP Top 10 vulnerabilities using DVWA, OverTheWire, and PortSwigger Web Security Academy. Proficient with Burp Suite, Nmap, Metasploit, and Wireshark. Strong understanding of web application security, network reconnaissance, and attack techniques. Pursuing a career as a Penetration Tester or Red Team professional.",
    "education": [
      {
        "institute": "REVA University, Bengaluru, India",
        "degree": "M.Tech in Cybersecurity",
        "period": "Nov 2024 – Nov 2026"
      },
      {
        "institute": "VSITR, Gandhinagar, India",
        "degree": "B.Tech in Computer Science and Engineering",
        "period": "Sep 2021 - Apr 2025"
      }
    ],
    "certifications": [
      "Deloitte Virtual Internship Certificate (2025)",
      "TCS Virtual Internship Certificate (2025)",
      "Certificate of Appreciation - Way2Reach (2025)",
      "Certificate of Appreciation - Versatile Technology (2025)",
      "Cyber Security Associate Certificate Program (2025)"
    ],
    "skills": [
      {
        "category": "Technical Skills",
        "items": [
          "VAPT",
          "Broken Authentication",
          "Broken Access Control",
          "SQL Injection",
          "XSS",
          "Security Misconfiguration",
          "IDOR",
          "Sensitive Data Exposure",
          "OSINT",
          "MS Office Suite",
          "Technical Report Writing",
          "Steganography",
          "Network Scanning",
          "Reconnaissance",
          "Linux OS",
          "FTP",
          "SSH"
        ]
      },
      {
        "category": "Tools",
        "items": [
          "Burp Suite",
          "Google Dorking",
          "Nmap",
          "Nikto",
          "Kali Linux",
          "Wireshark",
          "ZAP",
          "Metasploit",
          "SQLmap",
          "John the Ripper",
          "Shodan",
          "Subfinder",
          "HTTPX",
          "Waybackurls",
          "Dig",
          "Netdiscover",
          "Dirb",
          "Hydra",
          "Dirsearch",
          "Nuclei",
          "MSF Venom",
          "MSF Console",
          "Netcat"
        ]
      },
      {
        "category": "Soft Skills",
        "items": [
          "Quick Learner",
          "Teamwork",
          "Problem Solving",
          "Proactive Attitude",
          "Adaptability",
          "Leadership"
        ]
      }
    ],
    "workExperience": [
      {
        "role": "Cyber Security Intern",
        "company": "The Red Users",
        "period": "May 2025 - Jun 2025",
        "bullets": [
          "Foundational knowledge in network basics, protocols, IP addressing, and network scanning.",
          "Learned web application security basics (XSS, SQL Injection).",
          "Explored tools and techniques for assessing web security.",
          "Developed basic vulnerability reporting skills."
        ]
      },
      {
        "role": "Cyber Security Intern",
        "company": "Way2Reach",
        "period": "Jun 2025 - Sep 2025",
        "bullets": [
          "Web application security testing using OWASP ZAP.",
          "Identified and analysed SQL Injection, XSS, and other common vulnerabilities.",
          "Prepared detailed vulnerability reports with risk assessment and remediation suggestions.",
          "Gained practical experience in vulnerability assessment workflows and reporting standards."
        ]
      }
    ],
    "projects": [
      {
        "title": "Vinit_Auto_Recon - Automated Reconnaissance Tool (Dec 2025)",
        "bullets": [
          "Menu-based automated recon tool for cybersecurity learners and bug bounty hunters.",
          "Integrated: Subfinder, HTTPX, Nmap, Dirsearch, Nikto, Waybackurls.",
          "Built localhost web interface with Linux-based backend.",
          "Easy deployment on Linux (clone, install, run).",
          "Streamlined recon workflows for beginners."
        ]
      },
      {
        "title": "VinXcrypt Pentest (Ongoing, Jan 2026)",
        "bullets": [
          "Automated web application penetration testing tool focused on OWASP Top 10 vulnerabilities.",
          "Detects: SQL Injection, XSS, Broken Authentication, Security Misconfigurations, Sensitive Data Exposure.",
          "Automated recon, payload testing, and response analysis.",
          "Generates structured vulnerability findings with impact, risk, and remediation details.",
          "Beginner-friendly for practicing OWASP-based web security."
        ]
      }
    ],
    "publications": [],
    "programDates": "Nov 2024 – Nov 2026",
    "placement": {
      "company": "AngelOne",
      "role": "Security Assurance"
    }
  },
  {
    "slug": "nithya-tm",
    "name": "Nithya T M",
    "headline": "Cybersecurity & GRC Aspirant",
    "specialization": "Cybersecurity",
    "gender": "Female",
    "location": "Bengaluru, India",
    "phone": "+91 9110618926",
    "email": "nithyatm045@gmail.com",
    "linkedin": "https://www.linkedin.com/in/nithya-t-m-085525311",
    "github": "https://github.com/nithyatm",
    "photo": "/image/nithya-tm.png",
    "resume": "/rez/nithya-tm.pdf",
    "about": "Cybersecurity postgraduate with strong interest in Governance, Risk, and Compliance (GRC). Skilled in risk assessment, SIEM monitoring, network security, and cybersecurity automation. Familiar with Python, Wireshark, Splunk, and Wazuh. Passionate about threat detection, security operations, and vulnerability assessment.",
    "education": [
      {
        "institute": "REVA University (RACE)",
        "degree": "M.Tech in Cyber Security",
        "period": "Nov 2025 – Nov 2027"
      },
      {
        "institute": "Sri Taralabalu Institute of Technology",
        "degree": "B.E. in Electronics & Communication",
        "period": "Sept 2021 – Jun 2025"
      }
    ],
    "certifications": [
      "Python 101 for Data Science",
      "Networking Basics",
      "SQL and Relational Database"
    ],
    "skills": [
      {
        "category": "Programming & Scripting",
        "items": [
          "Python",
          "SQL",
          "TypeScript",
          "HTML5",
          "CSS3",
          "IoT Fundamentals"
        ]
      },
      {
        "category": "Security Concepts",
        "items": [
          "SIEM Monitoring",
          "Threat Detection",
          "Log Analysis",
          "Network Security",
          "VAPT",
          "GRC",
          "Risk Analysis",
          "Security Governance",
          "Intrusion Detection",
          "Vulnerability Assessment"
        ]
      },
      {
        "category": "Tools",
        "items": [
          "Wireshark",
          "pfSense",
          "Splunk",
          "Wazuh",
          "Cisco Packet Tracer",
          "Power BI",
          "VS Code",
          "FreeRadius",
          "Kali Linux"
        ]
      }
    ],
    "workExperience": [
      {
        "role": "Web Development Intern",
        "company": "Internz Learn",
        "period": "Feb 2025 – May 2025",
        "bullets": [
          "Built responsive web pages using HTML5 and CSS3.",
          "Designed structured layouts with Flexbox and Grid.",
          "Created user-friendly interfaces with smooth navigation and responsive design principles."
        ]
      }
    ],
    "projects": [
      {
        "title": "Network Access Control (NAC) System",
        "tag": "Personal Project",
        "bullets": [
          "Developed a NAC system to allow only authorized devices on the network.",
          "Detected and blocked unauthorized devices in real time.",
          "Monitored network traffic for security visibility using Kali Linux, Wireshark, and FreeRadius."
        ]
      },
      {
        "title": "Brute-Force Detection & SIEM Alerting",
        "tag": "Personal Project",
        "bullets": [
          "Monitored authentication logs to detect brute-force and credential stuffing attacks.",
          "Generated SIEM alerts using Wazuh/Splunk for suspicious login activity.",
          "Automated malicious IP blocking using Python scripts integrated with firewall rules."
        ]
      },
      {
        "title": "AI-Powered Cybersecurity Awareness Chatbot",
        "tag": "Personal Project",
        "bullets": [
          "Developed a full-stack AI chatbot using React.js and Groq API to educate users on cybersecurity topics.",
          "Designed structured prompts based on NIST SP 800-50 guidelines with session tracking and real-time error handling."
        ]
      },
      {
        "title": "AI-Powered News Curator CLI",
        "tag": "Personal Project",
        "bullets": [
          "Built an AI-powered news curation CLI using TypeScript, Supabase, and OpenRouter APIs to automate article ranking and filtering.",
          "Implemented intelligent duplicate detection and structured JSON logging with configurable dry-run and article limit features."
        ]
      }
    ],
    "publications": [],
    "programDates": "Nov 2025 – Nov 2027"
  },
  {
    "slug": "rajendra-rathod",
    "name": "Rajendra Rathod",
    "headline": "Cybersecurity Engineer",
    "specialization": "Cybersecurity",
    "gender": "Male",
    "location": "Bengaluru, India",
    "phone": "+91 7760199226",
    "email": "rajprathod06@gmail.com",
    "linkedin": "https://www.linkedin.com/in/rajendra-rathod-40097712b/",
    "github": "https://github.com/Rajendra-rathod06/Aboutme",
    "photo": "/image/rajendra-rathod.png",
    "resume": "/rez/rajendra-rathod.pdf",
    "about": "Cyber Security Engineer, with a deep interest in securing systems and safeguarding data in an ever-evolving threat landscape. Passionate about applying academic training to real-world security challenges — from vulnerability analysis and threat detection to secure architecture design.",
    "education": [
      {
        "institute": "REVA University (RACE)",
        "degree": "M.Tech in Cyber Security",
        "period": "Nov 2025 – Nov 2027"
      },
      {
        "institute": "CMR Institute of Technology",
        "degree": "BE in Electronics and Communication",
        "period": "Jun 2014 – Sep 2018"
      }
    ],
    "certifications": [
      "Python 101 for Data Science",
      "SQL and Relational Databases 101",
      "Cisco Networking Academy",
      "Microsoft Power BI Dashboard Certification",
      "Commonwealth Bank – Simplilearn — Introduction to Cybersecurity Job Simulation"
    ],
    "skills": [
      {
        "category": "Cybersecurity & Networking",
        "items": [
          "TCP/IP",
          "DNS",
          "HTTP/S",
          "Nmap Scanning",
          "IDS/IPS",
          "SIEM Fundamentals",
          "Log Analysis",
          "Alert Monitoring",
          "HTML",
          "CSS",
          "Python",
          "SQL"
        ]
      },
      {
        "category": "Tools",
        "items": [
          "Nmap",
          "Wireshark",
          "Splunk",
          "Cisco Packet Tracer",
          "Git/GitHub",
          "VS Code",
          "Power BI"
        ]
      }
    ],
    "workExperience": [
      {
        "role": "GIS Engineer",
        "company": "RMSI Pvt Ltd",
        "period": "Jan 2025 – Jun 2025",
        "bullets": [
          "Developed and maintained GIS data and spatial applications.",
          "Analyzed geographic datasets to support business decisions.",
          "Collaborated with teams to integrate GIS solutions.",
          "Applied GIS tools and best practices for accurate data handling."
        ]
      },
      {
        "role": "Technical Support Executive",
        "company": "United Telecom Pvt Limited",
        "period": "Jan 2025 – Jun 2025",
        "bullets": [
          "Performed system monitoring, updates, and basic maintenance.",
          "Diagnosed and resolved hardware, software, and network issues.",
          "Provided end-user technical support for desktops and infrastructure.",
          "Maintained documentation, logs, and troubleshooting records."
        ]
      }
    ],
    "projects": [
      {
        "title": "AI Security Policy Suite & Regulatory Review",
        "bullets": [
          "Built an AI suite to generate and review policies aligned with global compliance standards.",
          "Used AI to pinpoint policy weaknesses, accelerating compliance validation and security governance.",
          "Unified automated policy generation with proactive risk assessments to streamline security operations."
        ]
      },
      {
        "title": "Splunk Log Analysis & Threat Detection",
        "bullets": [
          "Implemented SIEM for centralized monitoring and configured endpoint agents for log collection.",
          "Correlated logs from multiple sources to identify anomalies and triage incidents."
        ]
      },
      {
        "title": "DNS Query Monitoring Tool",
        "bullets": [
          "Developed real-time tool to identify phishing and DNS tunneling, enhancing network visibility.",
          "Integrated dashboards using Gradio and Plotly to track domain patterns for rapid response.",
          "Simulated DNS traffic to pinpoint gaps, identifying IoT risks and exfiltration."
        ]
      },
      {
        "title": "Network Intrusion Detection System",
        "bullets": [
          "Deployed Nmap IDS/IPS for real-time traffic monitoring and packet inspection using custom configurations."
        ]
      }
    ],
    "publications": [],
    "programDates": "Nov 2025 – Nov 2027"
  },
  {
    "slug": "sai-krishna-km",
    "name": "Sai Krishna K M",
    "headline": "SOC Analyst",
    "specialization": "Cybersecurity",
    "gender": "Male",
    "location": "Bengaluru, India",
    "phone": "+91 9141428452",
    "email": "saikrish172003@gmail.com",
    "linkedin": "https://www.linkedin.com/in/sai-krishna-shetty-57aa8a2a0/",
    "github": "https://github.com/SAIkrishna1732003",
    "photo": "/image/sai-krishna-km.png",
    "resume": "/rez/sai-krishna-km.pdf",
    "about": "Aspiring Cybersecurity and SOC Analyst with hands-on experience in network security monitoring, anomaly detection, and threat analysis using AI-based techniques. Skilled in tools such as Wireshark, Splunk, Nmap, Wazuh, and Nessus for identifying suspicious activities and security threats. Developed projects in Network Anomaly Detection, DNS Traffic Monitoring, and AI-powered Log Analysis using Machine Learning algorithms like K-Means and Isolation Forest. Passionate about cybersecurity, continuous learning, and building efficient threat detection solutions.",
    "education": [
      {
        "institute": "REVA University (RACE)",
        "degree": "M.Tech. in Cyber Security",
        "period": "Nov 2023 – Nov 2025"
      },
      {
        "institute": "New Horizon College of Engineering",
        "degree": "B.Tech in AIML",
        "period": "—",
        "cgpa": "8.7"
      }
    ],
    "certifications": [
      "Python 101 For Data Science - IBM",
      "SQL and Relational Database 101 - IBM",
      "Cisco Introduction to Cybersecurity - CISCO",
      "Cisco Networking Academy program - CISCO"
    ],
    "skills": [
      {
        "category": "Cybersecurity & Networking",
        "items": [
          "Web Application Security (OWASP Top 10)",
          "Vulnerability Assessment",
          "Network Security Fundamentals",
          "TCP/IP",
          "DNS",
          "Threat Identification",
          "SOC Monitoring",
          "Threat Detection",
          "Network Traffic Analysis",
          "DNS Monitoring",
          "Log Analysis"
        ]
      },
      {
        "category": "Soft Skills",
        "items": [
          "Leadership",
          "Communication",
          "Teamwork",
          "Creative Thinking",
          "Team Management"
        ]
      },
      {
        "category": "Tools",
        "items": [
          "Nmap",
          "Wireshark",
          "John the Ripper",
          "Shodan",
          "Sublist3r",
          "Netdiscover",
          "Splunk",
          "Dirb",
          "Nessus",
          "Hydra",
          "Wazuh"
        ]
      }
    ],
    "workExperience": [
      {
        "role": "Intern",
        "company": "Hindustan Aeronautics Limited (HAL)",
        "bullets": [
          "Analyzed flight control and sensor data to support system performance evaluation and stability analysis during internship at Hindustan Aeronautics Limited.",
          "Assisted in aerospace data preprocessing, validation, and reliability improvement while gaining hands-on exposure to avionics systems and flight control architectures."
        ]
      }
    ],
    "projects": [
      {
        "title": "The AI Automation & Log Analysis Assistant",
        "bullets": [
          "Developed an AI-powered Log Analysis Assistant that automates log monitoring, threat detection, alert generation, and security reporting using AI and rule-based cybersecurity analysis techniques."
        ]
      },
      {
        "title": "Network Anomaly Detection for Cyber Threat Identification Using Artificial Intelligence",
        "bullets": [
          "Developed an AI-based Network Anomaly Detection System using Wireshark, K-Means Clustering, and Isolation Forest to analyze real-time network traffic and detect suspicious activities, traffic anomalies, and protocol misuse patterns."
        ]
      },
      {
        "title": "AI-Powered Threat Intelligence Feed Aggregator",
        "bullets": [
          "Developed an AI-powered Threat Intelligence Feed Aggregator to collect, analyze, and summarize cyber threat data from multiple sources using automated IOC extraction, LLM-based threat summarization, and a real-time Gradio monitoring dashboard."
        ]
      },
      {
        "title": "DNS Traffic Monitoring & Suspicious Domain Detection Using Wireshark",
        "bullets": [
          "Implemented a DNS Traffic Monitoring and Suspicious Domain Detection system using Wireshark to analyze live DNS traffic and detect phishing domains, DNS tunneling, abnormal query behavior, and C2 communication attempts."
        ]
      }
    ],
    "publications": [],
    "programDates": "Nov 2023 – Nov 2025"
  },
  {
    "slug": "sewana-m",
    "name": "Sewana M",
    "headline": "Cybersecurity Engineer",
    "specialization": "Cybersecurity",
    "gender": "Female",
    "location": "Bengaluru, India",
    "phone": "+91 8904488242",
    "email": "sewanamudigal@gmail.com",
    "linkedin": "https://www.linkedin.com/in/sewana-m-b9a858271/",
    "github": "https://github.com/SM09-04",
    "photo": "/image/sewana-m.jpg",
    "resume": "/rez/sewana-m.pdf",
    "about": "Cybersecurity enthusiast focused on threat detection, memory forensics, and incident analysis, with hands-on experience in identifying suspicious activities through log investigation and RAM analysis, and a strong interest in strengthening security operations and proactive defense strategies.",
    "education": [
      {
        "institute": "REVA University (RACE)",
        "degree": "M.Tech in Cyber Security",
        "period": "Nov 2023 – Nov 2025"
      },
      {
        "institute": "Sri Krishna Institute Of Technology",
        "degree": "B.Tech in CS Engineering",
        "period": "Jul 2020 – Jul 2024",
        "cgpa": "8.18"
      }
    ],
    "certifications": [
      "Introduction to Networking Concepts",
      "Python 101 For Data Science",
      "SQL And Relational Database"
    ],
    "skills": [
      {
        "category": "Technical",
        "items": [
          "Volatility Framework",
          "Memory Forensics",
          "RAM Dump Analysis",
          "Incident Log Analysis",
          "Vulnerability Assessment",
          "Security Alert Monitoring",
          "Python",
          "SQL",
          "Power BI",
          "Excel",
          "HTML & CSS"
        ]
      },
      {
        "category": "Tools",
        "items": [
          "Volatility",
          "Fail2ban",
          "Nmap",
          "Wappalyzer",
          "Nikto",
          "Wireshark",
          "Splunk",
          "Power BI",
          "Excel",
          "VS Code"
        ]
      },
      {
        "category": "Soft Skills",
        "items": [
          "Analytical Thinking",
          "Quick Learner",
          "Problem Solving",
          "Adaptability"
        ]
      }
    ],
    "workExperience": [
      {
        "role": "Data Analyst Intern",
        "company": "Edunet",
        "period": "Dec 2023 – Jan 2024",
        "bullets": [
          "Designed and developed interactive Power BI dashboards to visualize and report complex datasets, improving data accessibility and reporting efficiency.",
          "Performed structured data analysis to identify key patterns, trends, and anomalies for deeper business insights."
        ]
      }
    ],
    "projects": [
      {
        "title": "Analyzing RAM Memory Dumps to Identify Suspicious and Malicious Processes",
        "bullets": [
          "Performed advanced memory forensics using Volatility to analyze system RAM and uncover hidden, injected, and malicious processes that evade traditional detection.",
          "Investigated raw memory dumps to identify fileless malware and stealthy threat activity, leveraging process analysis and anomaly detection techniques."
        ]
      },
      {
        "title": "System for Classifying Common Vulnerabilities and Exposures and Generating Security Alerts",
        "bullets": [
          "Developed an automated CVE vulnerability analysis platform using Python and Gradio, enabling real-time classification of vulnerabilities and generation of context-aware mitigation strategies.",
          "Engineered a real-time alerting system with email notifications to proactively detect and respond to critical security threats."
        ]
      },
      {
        "title": "A Safety Device For Mankind With GPS And SOS Alert System",
        "bullets": [
          "Developed an IoT-based safety device with integrated GPS location tracking to provide real-time positioning during emergencies.",
          "Implemented GSM-based alerting system to automatically send emergency notifications and location details to predefined contacts.",
          "Designed a dual-button emergency trigger mechanism for quick and reliable activation in critical situations."
        ]
      }
    ],
    "publications": [],
    "programDates": "Nov 2023 – Nov 2025"
  },
  {
    "slug": "shaan-abraham",
    "name": "Shaan Abraham",
    "headline": "Cybersecurity Engineer",
    "specialization": "Cybersecurity",
    "gender": "Male",
    "location": "Bengaluru, India",
    "phone": "+91 8431397516",
    "email": "shaanabraham04@gmail.com",
    "linkedin": "https://www.linkedin.com/in/shaan-abraham-?utm_source=share_via&utm_content=profile&utm_medium=member_android",
    "photo": "/image/shaan-abraham.jpeg",
    "resume": "/rez/shaan-abraham.pdf",
    "about": "Cybersecurity enthusiast with hands-on experience in vulnerability assessment and security monitoring. Completed a Security Analyst internship at SECIQ Technologies, contributing to web application security testing, alert analysis, and incident response operations.",
    "education": [
      {
        "institute": "REVA University (RACE)",
        "degree": "M.Sc. in Cyber Security",
        "period": "Nov 2024 – Nov 2026"
      },
      {
        "institute": "REVA University",
        "degree": "B.Sc. in Cyber Security",
        "period": "Sep 2022 – Sep 2025",
        "cgpa": "8.54"
      }
    ],
    "certifications": [
      "CCST - Cisco",
      "IT Specialist - Cybersecurity",
      "Network Security - IT Specialist",
      "Python 101 for Data Science",
      "SQL and Relational Databases 101"
    ],
    "skills": [
      {
        "category": "Cybersecurity & Networking",
        "items": [
          "Web Application Security (OWASP Top 10)",
          "VAPT",
          "Network Security Fundamentals",
          "TCP/IP",
          "DNS",
          "VPNs",
          "Firewalls",
          "Packet Analysis",
          "Network Traffic Inspection",
          "Vulnerability Analysis",
          "Threat Identification",
          "XSS",
          "SQL Injection"
        ]
      },
      {
        "category": "Soft Skills",
        "items": [
          "Analytical Thinking",
          "Problem Solving",
          "Critical Thinking",
          "Technical Report Writing",
          "Team Collaboration",
          "Communication"
        ]
      },
      {
        "category": "Tools",
        "items": [
          "Burp Suite",
          "Nmap",
          "Wireshark",
          "Nikto",
          "OWASP ZAP",
          "SQLMap",
          "Metasploit",
          "Sublist3r",
          "Hashcat",
          "Nessus",
          "John the Ripper",
          "Wappalyzer",
          "XSStrike",
          "Nuclei",
          "Splunk",
          "Wazuh"
        ]
      }
    ],
    "workExperience": [
      {
        "role": "Security Analyst Intern",
        "company": "SECIQ Technologies",
        "period": "Jan 2025 – Jun 2025",
        "bullets": [
          "Conducted vulnerability assessments on web applications using Nmap, Burp Suite, and Nessus.",
          "Assisted in penetration testing and prepared technical reports documenting findings and remediation steps."
        ]
      }
    ],
    "projects": [
      {
        "title": "Web App Vulnerability Assessment",
        "tag": "Personal Project",
        "bullets": [
          "Performed structured security testing aligned with OWASP Top 10.",
          "Identified XSS, SQL Injection, and HTML Injection using Nmap, Nikto, SQLMap, and Burp Suite for scanning and exploitation support."
        ]
      },
      {
        "title": "Automated Network Port Scanner",
        "tag": "Personal Project",
        "bullets": [
          "Developed a multi-threaded network port scanner using TCP socket programming.",
          "Implemented scanning techniques to identify open, closed, and filtered ports with efficient logic to reduce scan time."
        ]
      },
      {
        "title": "Malicious QR Code Checker",
        "tag": "Personal Project",
        "bullets": [
          "Analyzed QR code-based attack vectors including phishing redirects.",
          "Built logic to detect suspicious links using URLScan and header analysis techniques."
        ]
      },
      {
        "title": "Cryptography Encryption & Decryption Tool",
        "tag": "Personal Project",
        "bullets": [
          "Developed a menu-driven tool implementing symmetric and asymmetric encryption techniques for encrypting and decrypting user-provided text input."
        ]
      }
    ],
    "publications": [],
    "programDates": "Nov 2024 – Nov 2026",
    "placement": {
      "company": "Justdial",
      "role": "Security Testing Intern"
    }
  },
  {
    "slug": "shashwath-ks",
    "name": "Shashwath K S",
    "headline": "AI Engineer",
    "specialization": "Artificial Intelligence",
    "gender": "Male",
    "phone": "+91 9945005114",
    "email": "shashwathkukunoor@gmail.com",
    "linkedin": "https://www.linkedin.com/in/shashwath-k-s-2b4277225/",
    "github": "https://github.com/Shashwath-K",
    "photo": "/image/shashwath-ks.png",
    "resume": "/rez/shashwath-ks.pdf",
    "about": "AI Software Engineer focused on building intelligent systems through Python-based Computer Vision and full-stack integration. Proficient in developing robust, scalable AI-driven applications and secure software architecture. Committed to deploying production-grade systems that catalyze organizational success while pioneering advanced methodologies in the AI domain.",
    "education": [
      {
        "institute": "REVA Academy for Corporate Excellence, REVA University",
        "degree": "M.Tech in AI",
        "period": "Nov 2025 – Nov 2027"
      },
      {
        "institute": "KVG College of Engineering, Sullia",
        "degree": "B.E in CS&E",
        "period": "Nov 2022 – June 2025",
        "cgpa": "9.47"
      }
    ],
    "certifications": [],
    "skills": [
      {
        "category": "Technical",
        "items": [
          "Python",
          "ML",
          "MongoDB",
          "SQL",
          "React.js",
          "Dart",
          "TypeScript",
          "Data Warehousing",
          "LLM Integration"
        ]
      },
      {
        "category": "Soft Skills",
        "items": [
          "Agile Development",
          "Quick Learner",
          "Teamwork",
          "Problem Solving",
          "Critical & Analytical Thinking",
          "Proactive Attitude",
          "Adaptability"
        ]
      },
      {
        "category": "Tools",
        "items": [
          "GitHub",
          "Docker",
          "Power BI",
          "Firebase",
          "Git",
          "VS Code",
          "IntelliJ",
          "FastAPI",
          "Django"
        ]
      }
    ],
    "workExperience": [
      {
        "role": "Internship Trainee (Full-Stack)",
        "company": "Snyce Automations",
        "period": "Mar 2025 – Jun 2025",
        "bullets": [
          "Integrated 4 backend services directly with company infrastructure, ensuring architectural consistency and secure data flow across 3 system microservices."
        ]
      },
      {
        "role": "Student Ambassador (AI & DevOps)",
        "company": "Rooman Technologies",
        "period": "Sep 2024 – Mar 2025",
        "bullets": [
          "Coordinated and supervised technical training sessions, ensuring smooth delivery of curriculum and consistent engagement from the student developer community."
        ]
      }
    ],
    "projects": [
      {
        "title": "AegisFace: Adversary Resistant Facial Recognition & Location Aware Attendance",
        "bullets": [
          "Provides a secure, location-aware attendance solution that enforces verified physical presence through multi-factor identity proofing mechanisms."
        ]
      },
      {
        "title": "Lane Detection for Autonomous Vehicles using Neuro-Fuzzy Algorithms",
        "bullets": [
          "Ensures robust, explainable navigation by combining deep learning-based perception with logic-driven reasoning to handle environmental uncertainty effectively."
        ]
      },
      {
        "title": "AutoDoc AI: Semantic-Aware File Converter with LLM Documentation",
        "bullets": [
          "Automates generation of context-aware docstrings and professional reports to maintain documentation quality and team synchronization."
        ]
      }
    ],
    "publications": [],
    "programDates": "Nov 2025 – Nov 2027",
    "placement": {
      "company": "Skyworks Solutions",
      "role": "Intern"
    }
  },
  {
    "slug": "shilpa-j",
    "name": "Shilpa J",
    "headline": "AI Engineer",
    "specialization": "Artificial Intelligence",
    "gender": "Female",
    "location": "Yelahanka, Bangalore",
    "phone": "+91 7760874405",
    "email": "shilpaj4418@gmail.com",
    "linkedin": "https://www.linkedin.com/in/shilpa-j-b85140310/",
    "github": "https://github.com/ShilpaJ18",
    "photo": "/image/shilpa-j.png",
    "resume": "/rez/shilpa-j.pdf",
    "about": "Dedicated and detail-oriented IT graduate. Passionate about software development, with strong problem-solving abilities and a drive to learn and adapt to new technologies. Looking to work in an organization that provides opportunities to expand skills and knowledge in the Software industry while working towards achieving organizational goals.",
    "education": [
      {
        "institute": "REVA University",
        "degree": "M.Tech in Artificial Intelligence",
        "period": "Nov 2023 – Nov 2025"
      },
      {
        "institute": "Sai Vidya Institute of Technology",
        "degree": "B.E in CSE (Data Science)",
        "period": "2021 – 2025"
      }
    ],
    "certifications": [
      "SQL and Relational Database 101 – IBM",
      "Python 101 for Data Science – IBM",
      "Java Programming Certification – QSpiders"
    ],
    "skills": [
      {
        "category": "Technical",
        "items": [
          "Python",
          "HTML",
          "CSS",
          "Bootstrap",
          "SQL",
          "Power BI"
        ]
      },
      {
        "category": "Tools",
        "items": [
          "VS Code",
          "Eclipse",
          "MySQL Workbench",
          "Jupyter",
          "Power BI",
          "MS Excel"
        ]
      },
      {
        "category": "Soft Skills",
        "items": [
          "Quick Learner",
          "Communication",
          "Teamwork",
          "Adaptability"
        ]
      }
    ],
    "workExperience": [],
    "projects": [
      {
        "title": "Two Way Sign Language Translation using CNN",
        "bullets": [
          "Designed and implemented a two-way sign language translator to bridge communication between the hearing-impaired and the general public.",
          "Applied CNN to recognize sign language gestures through camera and convert them into text and multilingual audio.",
          "Integrated Google Speech Recognition API for accurate voice input processing."
        ]
      },
      {
        "title": "Healthcare Appointment and Record Management System",
        "bullets": [
          "Developed a web-based system using Python, Flask, HTML, and CSS to streamline hospital operations and appointment scheduling.",
          "Integrated MySQL database for secure management of patient records, appointments, prescriptions, and feedback.",
          "Implemented appointment booking, medical record management, and PDF prescription generation using ReportLab."
        ]
      },
      {
        "title": "AI-Powered Smart Learning & Academic Support System",
        "bullets": [
          "Developed an AI-powered system using Python and Google Gemini API to automate study note generation, quiz creation, and performance evaluation.",
          "Designed an interactive UI using Gradio to enhance user engagement and provide seamless learning support.",
          "Integrated quiz, flashcard, and confidence tracking modules with automated answer evaluation.",
          "Implemented PDF processing and activity management using PyPDF, FPDF, and JSON."
        ]
      },
      {
        "title": "Employee Performance Evaluation Using ML",
        "bullets": [
          "Developed an ML-based Employee Performance Prediction system using Python to classify performance into Low, Medium, and High categories.",
          "Performed data preprocessing, EDA, and feature selection using LASSO to improve prediction accuracy.",
          "Built and trained a Random Forest model, achieving efficient and reliable classification results."
        ]
      }
    ],
    "publications": [],
    "programDates": "Nov 2023 – Nov 2025"
  },
  {
    "slug": "sneha-s",
    "name": "Sneha S",
    "headline": "M.Tech AI Candidate",
    "specialization": "Artificial Intelligence",
    "gender": "Female",
    "location": "Bengaluru, India",
    "phone": "+91 6361721470",
    "email": "nalini2952002@gmail.com",
    "about": "Creative and analytical learner interested in AI technologies and smart systems.",
    "education": [
      {
        "institute": "REVA University (RACE)",
        "degree": "M.Tech AI",
        "period": "Nov 2024 – Nov 2026"
      }
    ],
    "certifications": [],
    "skills": [
      {
        "category": "Skills",
        "items": [
          "Artificial Intelligence",
          "Data Analytics",
          "Python"
        ]
      }
    ],
    "workExperience": [],
    "projects": [],
    "publications": [],
    "programDates": "Nov 2024 – Nov 2026"
  },
  {
    "slug": "sreediya-s",
    "name": "Sreediya S",
    "headline": "Cybersecurity Analyst",
    "specialization": "Cybersecurity",
    "gender": "Female",
    "location": "Bengaluru, India",
    "phone": "+91 8015201899",
    "email": "sreediyasanjith26@gmail.com",
    "linkedin": "https://www.linkedin.com/in/sreediya-s-b8088a25a/",
    "github": "https://github.com/Sreediya1234",
    "photo": "/image/sreediya-s.jpeg",
    "resume": "/rez/sreediya-s.pdf",
    "about": "Cybersecurity Enthusiast with foundational knowledge in vulnerability analysis, HTTP security assessment, and network monitoring fundamentals. Passionate about cybersecurity technologies, threat analysis, and secure systems with a strong willingness to learn and develop practical security skills.",
    "education": [
      {
        "institute": "REVA University (RACE)",
        "degree": "M.Tech. in Cyber Security",
        "period": "Nov 2023 – Nov 2025"
      },
      {
        "institute": "GEC Kushalnagar",
        "degree": "B.E. in Electronics and Communication",
        "period": "Dec 2021 – Jun 2025",
        "cgpa": "9.2"
      }
    ],
    "certifications": [
      "Networking Basics - Cisco Networking Academy",
      "Python 101 for Data Science - IBM",
      "SQL and Relational Databases 101"
    ],
    "skills": [
      {
        "category": "Technical",
        "items": [
          "Networking Fundamentals",
          "Python",
          "SQL",
          "Data Visualization",
          "Digital Electronics",
          "IoT",
          "HTML",
          "Web Security Basics",
          "GRC Fundamentals",
          "HTTP Security Headers"
        ]
      },
      {
        "category": "Soft Skills",
        "items": [
          "Communication",
          "Teamwork",
          "Adaptability",
          "Emotional Intelligence",
          "Presentation"
        ]
      },
      {
        "category": "Tools",
        "items": [
          "Burp Suite",
          "Nmap",
          "Wireshark",
          "Nikto",
          "John The Ripper",
          "Cisco Packet Tracer",
          "Wazuh",
          "Splunk",
          "Power BI",
          "VS Code"
        ]
      }
    ],
    "workExperience": [
      {
        "role": "IoT and Embedded Systems Intern",
        "company": "Contriver, Mysore",
        "bullets": [
          "Assisted in IoT-based embedded system development using Arduino, including hardware validation, debugging, firmware testing, and technical documentation.",
          "Applied basic cybersecurity practices during IoT device testing with network behavior monitoring and vulnerability awareness."
        ]
      }
    ],
    "projects": [
      {
        "title": "Banking Testing Security Operation",
        "tag": "Personal Project",
        "bullets": [
          "Developed a Selenium-based automation framework for banking operations validation and basic security testing, including authentication checks and attack simulation.",
          "Automated workflow testing, evidence capture, and timestamp-based PDF report generation for reliable test documentation."
        ]
      },
      {
        "title": "HTTP Security Header Analyser",
        "tag": "Personal Project",
        "bullets": [
          "Developed a Python-based tool to analyze HTTP security headers and identify web security misconfigurations aligned with OWASP best practices.",
          "Automated detection of missing security headers and generated structured reports with remediation guidance."
        ]
      },
      {
        "title": "Brute Force Detection System",
        "tag": "Personal Project",
        "bullets": [
          "A Python-based security system designed to simulate, visualize, and block brute-force attacks in real-time using an adaptive threshold mechanism.",
          "Proactively traps malicious actors using integrated honeypot credentials and automatically mitigates threats by instantly blocking offending IP addresses."
        ]
      },
      {
        "title": "Underground Water Channel Detection Robot",
        "tag": "Personal Project",
        "bullets": [
          "Developed an Arduino-based mobile robot using Doppler RADAR technology to detect underground water channels through real-time signal processing and environmental noise filtering.",
          "Integrated sensor data with microcontroller-based autonomous navigation for non-invasive detection in agriculture and disaster management applications."
        ]
      }
    ],
    "publications": [],
    "programDates": "Nov 2023 – Nov 2025"
  },
  {
    "slug": "veda-shivayogi",
    "name": "Veda Shivayogi Ramagondanahalli",
    "headline": "Software Developer",
    "specialization": "Artificial Intelligence",
    "gender": "Female",
    "location": "Bengaluru, India",
    "phone": "+91 9481232907",
    "email": "vedaram2002@gmail.com",
    "linkedin": "https://www.linkedin.com/in/vedasram/",
    "github": "https://github.com/VedaShivayogi",
    "photo": "/uploads/photos/veda-shivayogi.png",
    "resume": "/rez/veda-shivayogi.pdf",
    "about": "AI and software development enthusiast with experience in Python and AI projects including facial animation, face recognition, and voice recognition systems. Interested in real-world AI applications and intelligent system development.",
    "education": [
      {
        "institute": "REVA University (RACE)",
        "degree": "M.Tech. in Artificial Intelligence",
        "period": "Nov 2024 – Nov 2026"
      },
      {
        "institute": "University BDT College of Engineering",
        "degree": "B.E in Computer Science and Engineering",
        "period": "2021 – 2025"
      }
    ],
    "certifications": [
      "Python 101 for Data Science – IBM",
      "Python and Artificial Intelligence",
      "Data Structures and Algorithms",
      "SQL and Relational Databases 101"
    ],
    "skills": [
      {
        "category": "Programming",
        "items": [
          "Python",
          "MySQL",
          "HTML",
          "CSS",
          "C",
          "JavaScript"
        ]
      },
      {
        "category": "Soft Skills",
        "items": [
          "Teamwork",
          "Time Management",
          "Problem Solving",
          "Decision Making",
          "Positive Thinking"
        ]
      },
      {
        "category": "Tools & Technologies",
        "items": [
          "MS Excel",
          "Power BI",
          "Pandas",
          "NumPy",
          "OpenCV",
          "Jupyter",
          "VS Code",
          "PyCharm",
          "MySQL Workbench",
          "Blender"
        ]
      }
    ],
    "workExperience": [
      {
        "role": "Python with AI Intern",
        "company": "PIE Infotech Pvt. Ltd.",
        "period": "Feb 2025 – June 2025",
        "bullets": [
          "Worked on Python programming and AI fundamentals.",
          "Implemented real-world applications and basic model integration."
        ]
      }
    ],
    "projects": [
      {
        "title": "Facial Animation with Motion Capture Based on Surface Blending",
        "bullets": [
          "Developed a Python–Blender system for realistic facial animation using motion capture data.",
          "Achieved smooth and lifelike facial expressions through surface blending."
        ]
      },
      {
        "title": "Face Detection and Recognition System",
        "bullets": [
          "Developed a Python-based face detection and recognition system using computer vision techniques.",
          "Implemented real-time face identification for improved accuracy and security applications."
        ]
      },
      {
        "title": "AI Based Voice-Recognition-and-Translation System",
        "bullets": [
          "Developed real-time speech-to-text for multiple Indian languages with automatic translation.",
          "Applied NLP techniques to enhance transcription and translation accuracy."
        ]
      }
    ],
    "publications": [],
    "programDates": "Nov 2024 – Nov 2026"
  }
];
