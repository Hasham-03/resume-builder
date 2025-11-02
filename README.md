# 🧾 Resume Builder Website  

A modern, web-based **Resume Builder** that allows users to easily create, customize, and download professional resumes. The application combines a sleek **Next.js frontend** with a secure, containerized **AWS backend** for automated PDF generation and data handling.  

---

## 🚀 Features  

- **Interactive Editor:** Build and preview resumes live.  
- **Professional Templates:** Choose from customizable designs.  
- **Instant PDF Download:** Generate print-ready resumes in seconds.  
- **Auto Save:** Keeps user progress safe.  
- **Cloud-Hosted:** Scalable and secure AWS infrastructure.  

---

## 🏗️ Architecture Overview  

**Frontend:**  
- Developed with **Next.js** and **Tailwind CSS**.  
- Deployed on **AWS Amplify** for CI/CD and global hosting.  

**Backend:**  
- Runs on **AWS EC2 (Ubuntu)** with **Dockerized n8n** backend for automation and PDF generation.  
- **Caddy Server** configured as a reverse proxy for **HTTPS** and routing.  
- Handles secure API requests from frontend and returns generated PDFs.  

---

## 🧰 Tech Stack  

| Layer | Technologies |
|--------|---------------|
| Frontend | Next.js, Tailwind CSS |
| Backend | n8n (Node.js), Docker, Ubuntu |
| Hosting | AWS EC2, AWS Amplify |
| Proxy | Caddy (HTTPS & Reverse Proxy) |
| Version Control | Git, GitHub |

---

## ⚙️ Deployment Summary  

1. **Frontend Deployment**  
   - Push the Next.js code to GitHub.  
   - Connect to **AWS Amplify** for auto build and deployment.  

2. **Backend Setup**  
   - Launch **EC2 Ubuntu** instance (t2.micro or t3.micro).  
   - Install **Docker** and run the n8n backend container.  
   - Configure **Caddy** for HTTPS reverse proxy.  
   - Open ports `80`, `443`, and backend API port (`5678`) in AWS Security Groups.  

---

## 🔒 Security Highlights  

- HTTPS enabled using **Caddy auto TLS**.  
- Access restricted with **AWS Security Groups**.  
- Sensitive credentials stored as environment variables.  

---

## 🌍 Live Demo  

🔗 [Resume Builder Website](https://share.google/kunL76Bvq0HtMIvbR)  

---

## 📜 License  

Released under the **MIT License**. Feel free to use or modify it.  

---

## 👤 Author  

**Mohammed Hashim**  
💼 Cloud & Full Stack Developer  
📎 [GitHub Profile](https://github.com/Hasham-03)
