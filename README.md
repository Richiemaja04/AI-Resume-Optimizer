# AI Resume Optimizer

An intelligent web application that leverages AI to analyze, match, and tailor resumes to specific job descriptions, helping job seekers improve their chances of getting past Applicant Tracking Systems (ATS) and landing interviews.

## ✨ Features

- **Skill Extraction**: Automatically extract key skills and requirements from job descriptions
- **Resume Analysis**: Analyze how well your resume matches the job requirements
- **Detailed Feedback**: Get comprehensive insights on missing skills and improvement areas
- **Resume Tailoring**: Generate professionally tailored resumes optimized for specific jobs
- **Multiple Templates**: Choose from various resume templates (Professional, Modern, Classic, Minimal)
- **Export Options**: Download your optimized resume in PDF or DOCX format
- **Visualizations**: View match percentage and skills analysis through intuitive charts

## 🚀 Demo

![AI Resume Optimizer Demo](placeholder-for-demo-screenshot.png)

## 🛠️ Technologies Used

### Backend
- Python 3.x
- Flask (Web framework)
- Google Generative AI (Gemini Pro) for AI analysis
- PyPDF2 & python-mammoth (Document parsing)
- ReportLab & python-docx (Document generation)

### Frontend
- HTML5 / CSS3 / JavaScript

## 📋 Prerequisites

- Python 3.8+
- Google Generative AI API key

## 🔧 Installation

1. Clone the repository
   ```bash
   git clone https://github.com/Richiemaja04/ai-resume-optimizer.git
   cd ai-resume-optimizer
   ```

2. Install required Python packages
   ```bash
   pip install -r requirements.txt
   ```

3. Configure your Google Generative AI API key in `main.py`
   ```python
   genai.configure(api_key="your_api_key")  # Replace with your actual API Key
   ```

4. Run the application
   ```bash
   python main.py
   ```

5. Open your browser and navigate to `http://localhost:5000`

## 📝 Usage Guide

### 1. Enter Job Description
- Paste the job description text into the provided field
- Click "Extract Skills" to identify required skills for the position

### 2. Upload Resume
- Upload your resume file (PDF or DOCX) or paste the content
- The application will extract text from your document

### 3. Analyze Match
- Click "Analyze Matching" to see how your resume compares to the job requirements
- Review the match percentage, matched skills, and missing skills

### 4. Tailor Your Resume
- Select a template style (Professional, Modern, Classic, Minimal)
- Choose output format (PDF or DOCX)
- Click "Preview" to view the tailored content
- Click "Download" to generate and download your optimized resume

## 🔄 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/extract_skills` | POST | Extract skills from job description |
| `/upload_resume` | POST | Upload and parse resume file |
| `/analyze_resume` | POST | Analyze resume against job requirements |
| `/preview_resume` | POST | Generate preview of tailored resume |
| `/tailor_resume` | POST | Generate and download tailored resume |

## 📊 Skill Analysis

The application provides comprehensive skill analysis including:
- Overall match percentage
- Breakdown by skill categories (Technical, Soft Skills, Domain Knowledge)
- Specific recommendations for improvement
- Priority skills to add or emphasize
- Sections of the resume that need improvement

## 📄 Template Options

- **Professional**: Traditional format with clean layout and blue accents
- **Modern**: Contemporary design with centered header and teal highlights
- **Classic**: Elegant style with indigo header and serif fonts
- **Minimal**: Sleek, minimalist design with subtle gray accents

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Google Generative AI for providing the AI capabilities
- Open-source libraries that made this project possible
- All contributors who help improve this application

---

Built with ❤️ by Richie M
