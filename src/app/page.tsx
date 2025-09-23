"use client";
import { useState } from "react";

// --- TYPE DEFINITIONS ---
type ExperienceItem = { title: string; subtitle: string; date: string; description: string; };
type EducationItem = { institution: string; degree: string; gpa: string; date: string; };
// Removed 'communication' from the SkillSet type
type SkillSet = { programming: string; software: string; tools: string; softSkills: string; };
type ApiResponse = {
  url?: string;
  message?: string;
  error?: boolean;
};

export default function Home() {
  // --- STATE MANAGEMENT ---
  const [formData, setFormData] = useState({
    name: "", location: "", email: "", phone: "", linkedin: "", github: "", objective: "",
    internshipExperience: [{ title: "", subtitle: "", date: "", description: "" }],
    academicProjects: [{ title: "", subtitle: "", date: "", description: "" }],
    education: [{ institution: "", degree: "", gpa: "", date: "" }],
    // Removed 'communication' from the initial skills state
    skills: { programming: "", software: "", tools: "", softSkills: "" },
    certifications: [{ title: "", subtitle: "", date: "", description: "" }],
  });

  // --- FORM HANDLERS ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // Removed 'communication' from the skillKeys array
    const skillKeys = ["programming", "software", "tools", "softSkills"];
    if (skillKeys.includes(name)) {
      setFormData(prev => ({ ...prev, skills: { ...prev.skills, [name]: value } }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleArrayChange = (section: keyof typeof formData, index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const list = formData[section] as any[];
    const updatedList = list.map((item, i) => i === index ? { ...item, [name]: value } : item);
    setFormData(prev => ({ ...prev, [section]: updatedList }));
  };

  const addItem = (section: keyof typeof formData) => {
    const list = formData[section] as any[];
    let newItem: ExperienceItem | EducationItem = section === 'education' 
      ? { institution: "", degree: "", gpa: "", date: "" } 
      : { title: "", subtitle: "", date: "", description: "" };
    setFormData(prev => ({ ...prev, [section]: [...list, newItem] }));
  };

  const removeItem = (section: keyof typeof formData, index: number) => {
    const list = formData[section] as any[];
    if (list.length <= 1) return;
    const updatedList = list.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, [section]: updatedList }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    alert('Generating your PDF... This may take a moment.');

    const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL as string;

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const result: ApiResponse = await response.json();

      if (result.url) {
        window.open(result.url, '_blank');
      } else {
        const errorMessage = result.message || 'PDF URL not found in the response.';
        throw new Error(errorMessage);
      }

    } catch (error: any) {
      console.error('Error generating PDF:', error);
      alert(`Failed to generate PDF: ${error.message}`);
    }
  };

  // --- RENDER FUNCTIONS ---
  const renderDynamicSection = (sectionName: 'internshipExperience' | 'academicProjects' | 'certifications', title: string) => (
    <fieldset className="border p-4 rounded-lg">
      <legend className="text-xl font-semibold px-2">{title}</legend>
      <div className="space-y-4 pt-2">
        {(formData[sectionName] as ExperienceItem[]).map((item, index) => (
          <div key={index} className="border-b pb-4 mb-4 last:border-b-0 last:pb-0 last:mb-0">
            <input name="title" placeholder="Title" value={item.title} onChange={(e) => handleArrayChange(sectionName, index, e)} className="w-full p-2 border rounded mt-2"/>
            <input name="subtitle" placeholder="Subtitle (e.g., Company or Project Type)" value={item.subtitle} onChange={(e) => handleArrayChange(sectionName, index, e)} className="w-full p-2 border rounded mt-2"/>
            <input name="date" placeholder="Date (e.g., 2023-Present)" value={item.date} onChange={(e) => handleArrayChange(sectionName, index, e)} className="w-full p-2 border rounded mt-2"/>
            <textarea name="description" placeholder="• Description point 1" value={item.description} onChange={(e) => handleArrayChange(sectionName, index, e)} className="w-full p-2 border rounded mt-2 h-24"/>
            {formData[sectionName].length > 1 && <button type="button" onClick={() => removeItem(sectionName, index)} className="mt-2 bg-red-500 text-white py-1 px-3 rounded text-sm hover:bg-red-600">Remove</button>}
          </div>
        ))}
        <button type="button" onClick={() => addItem(sectionName)} className="mt-2 bg-blue-500 text-white py-1 px-3 rounded text-sm hover:bg-blue-600">Add {title}</button>
      </div>
    </fieldset>
  );

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100 font-sans">
      
      {/* --- FORM SIDE --- */}
      <div className="w-full md:w-2/5 p-4 sm:p-8 bg-white overflow-y-auto">
        <h1 className="text-3xl font-bold mb-6">Resume Builder</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <fieldset className="border p-4 rounded-lg">
            <legend className="text-xl font-semibold px-2">Personal Details</legend>
            <div className="space-y-4 pt-2">
              <input name="name" placeholder="Full Name" value={formData.name} onChange={handleInputChange} className="w-full p-2 border rounded" />
              <input name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleInputChange} className="w-full p-2 border rounded" />
              <input name="email" placeholder="Email Address" value={formData.email} onChange={handleInputChange} className="w-full p-2 border rounded" />
              <input name="location" placeholder="City, Country" value={formData.location} onChange={handleInputChange} className="w-full p-2 border rounded" />
              <input name="linkedin" placeholder="Full LinkedIn URL" value={formData.linkedin} onChange={handleInputChange} className="w-full p-2 border rounded" />
              <input name="github" placeholder="Full GitHub URL" value={formData.github} onChange={handleInputChange} className="w-full p-2 border rounded" />
            </div>
          </fieldset>
          
          <fieldset className="border p-4 rounded-lg">
            <legend className="text-xl font-semibold px-2">Objective</legend>
            <div className="pt-2">
              <textarea name="objective" placeholder="Your professional summary..." value={formData.objective} onChange={handleInputChange} className="w-full p-2 border rounded h-24" />
            </div>
          </fieldset>

          {renderDynamicSection('internshipExperience', 'Internship Experience')}
          {renderDynamicSection('academicProjects', 'Academic Projects')}

          <fieldset className="border p-4 rounded-lg">
            <legend className="text-xl font-semibold px-2">Education</legend>
            <div className="space-y-4 pt-2">
              {(formData.education as EducationItem[]).map((edu, index) => (
                <div key={index} className="border-b pb-4 mb-4 last:border-b-0 last:pb-0 last:mb-0">
                  <input name="institution" placeholder="Institution Name" value={edu.institution} onChange={(e) => handleArrayChange('education', index, e)} className="w-full p-2 border rounded mt-2"/>
                  <input name="degree" placeholder="Degree" value={edu.degree} onChange={(e) => handleArrayChange('education', index, e)} className="w-full p-2 border rounded mt-2"/>
                  <input name="gpa" placeholder="CGPA or Percentage" value={edu.gpa} onChange={(e) => handleArrayChange('education', index, e)} className="w-full p-2 border rounded mt-2"/>
                  <input name="date" placeholder="Date (e.g., 2022-2026)" value={edu.date} onChange={(e) => handleArrayChange('education', index, e)} className="w-full p-2 border rounded mt-2"/>
                  {formData.education.length > 1 && <button type="button" onClick={() => removeItem('education', index)} className="mt-2 bg-red-500 text-white py-1 px-3 rounded text-sm hover:bg-red-600">Remove</button>}
                </div>
              ))}
              <button type="button" onClick={() => addItem('education')} className="mt-2 bg-blue-500 text-white py-1 px-3 rounded text-sm hover:bg-blue-600">Add Education</button>
            </div>
          </fieldset>

          <fieldset className="border p-4 rounded-lg">
            <legend className="text-xl font-semibold px-2">Skills</legend>
            <div className="space-y-4 pt-2">
                <input name="programming" placeholder="Programming Languages" value={formData.skills.programming} onChange={handleInputChange} className="w-full p-2 border rounded" />
                <input name="software" placeholder="Database Management" value={formData.skills.software} onChange={handleInputChange} className="w-full p-2 border rounded" />
                <input name="tools" placeholder="Tools/Platforms" value={formData.skills.tools} onChange={handleInputChange} className="w-full p-2 border rounded" />
                <input name="softSkills" placeholder="Soft Skills" value={formData.skills.softSkills} onChange={handleInputChange} className="w-full p-2 border rounded" />
                {/* Communication skills input is now removed */}
            </div>
          </fieldset>

          {renderDynamicSection('certifications', 'Certifications')}

          <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded hover:bg-blue-700 transition">
            Generate PDF
          </button>
        </form>
      </div>
      
      {/* --- PREVIEW SIDE --- */}
      <div className="w-full md:w-3/5 p-4 sm:p-8 bg-gray-200 text-[10pt]">
        <div className="bg-white shadow-lg min-h-full p-12">
          
          {/* Header */}
          <header className="text-center pb-2.5 mb-4 border-b-2 border-black">
              <h1 className="text-2xl font-bold uppercase tracking-wider">{formData.name || 'Your Name'}</h1>
              <div className="flex justify-between items-center mt-2.5 text-[8pt]">
                  <div className="text-left">
                      <p>{formData.email}</p>
                      <p>{formData.phone}</p>
                      <p>{formData.location}</p>
                  </div>
                  <div className="text-right">
                      <p className="text-blue-600">{formData.linkedin.replace('https://www.','')}</p>
                      <p className="text-blue-600">{formData.github.replace('https://','')}</p>
                  </div>
              </div>
          </header>

          {/* Objective */}
          {formData.objective && (
            <section className="mb-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 pb-1 mb-2 border-b border-gray-300">Objective</h2>
              <p className="whitespace-pre-wrap text-[9.5pt]">{formData.objective}</p>
            </section>
          )}

          {/* Internship Experience */}
          {formData.internshipExperience[0]?.title && (
            <section className="mb-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 pb-1 mb-2 border-b border-gray-300">Internship Experience</h2>
              {formData.internshipExperience.map((item, index) => item.title && (
                <div key={index} className="mb-2.5">
                  <div className="flex justify-between items-baseline">
                    <p className="text-[10pt] font-bold">{item.title}</p>
                    <p className="text-[9pt] font-semibold text-gray-600">{item.subtitle}</p>
                  </div>
                  <ul className="list-disc pl-5 mt-1 text-[9.5pt]">
                    {item.description.split('\n').map((line, i) => line && <li key={i}>{line.replace('•','').trim()}</li>)}
                  </ul>
                </div>
              ))}
            </section>
          )}

          {/* Academic Projects */}
          {formData.academicProjects[0]?.title && (
            <section className="mb-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 pb-1 mb-2 border-b border-gray-300">Academic Projects</h2>
              {formData.academicProjects.map((item, index) => item.title && (
                <div key={index} className="mb-2.5">
                    <p className="text-[10pt] font-bold">{item.title}</p>
                    <p className="text-[9.5pt] whitespace-pre-wrap">{item.description}</p>
                    <p className="text-[9.5pt]"><strong>Technology Used:</strong> {item.subtitle}</p>
                </div>
              ))}
            </section>
          )}
          
          {/* Education */}
          {formData.education[0]?.institution && (
            <section className="mb-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 pb-1 mb-2 border-b border-gray-300">Education</h2>
              {formData.education.map((item, index) => item.institution && (
                <div key={index} className="mb-2.5">
                    <div className="flex justify-between items-baseline">
                      <p className="text-[10pt] font-bold">{item.institution}</p>
                      <p className="text-[9pt] font-semibold text-gray-600">{item.date}</p>
                    </div>
                    <p className="text-[9.5pt]">{item.degree} - {item.gpa}</p>
                </div>
              ))}
            </section>
          )}
          
          {/* Skills */}
          <section className="mb-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 pb-1 mb-2 border-b border-gray-300">Skills</h2>
            <div className="text-[9.5pt]">
              <p><strong className="inline-block w-48">Programming Languages:</strong> {formData.skills.programming}</p>
              <p><strong className="inline-block w-48">Database Management:</strong> {formData.skills.software}</p>
              <p><strong className="inline-block w-48">Tools/Platforms:</strong> {formData.skills.tools}</p>
              <p><strong className="inline-block w-48">Soft Skills:</strong> {formData.skills.softSkills}</p>
            </div>
          </section>

          {/* Certifications */}
          {formData.certifications[0]?.title && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 pb-1 mb-2 border-b border-gray-300">Certifications</h2>
              {formData.certifications.map((item, index) => item.title && (
                <div key={index} className="mb-2.5">
                    <p className="text-[10pt] font-bold">{item.title} ({item.date})</p>
                    <p className="text-[9.5pt] whitespace-pre-wrap">{item.description}</p>
                </div>
              ))}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}