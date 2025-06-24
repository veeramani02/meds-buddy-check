🌐 Live Demo
👉 Visit https://meds-buddy-check.netlify.app/

# 💊 Meds Buddy Check

A Medication Management App for patients and caretakers to track daily medications, log adherence, and improve health routines — built with **React + TypeScript + Supabase**.

---

## 🚀 Features

### 👤 For Patients
- ✅ View today’s medication schedule
- ✅ Mark medications as "Taken" with optional photo upload
- ✅ Track adherence and streak
- ✅ Add/Edit/Delete medications
- ✅ Visual calendar with taken/missed history
- ✅ See Monthly Progress and Streak

### 🧑‍⚕️ For Caretakers
- 👀 Monitor patient medication logs in real-time
- 📊 View adherence percentage and missed doses
- 🔔 Configure email reminders & missed alerts
- 📆 Visual calendar to track patient medication history

---

## 🛠 Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **State Management**: React Query
- **Auth**: Supabase Auth (email/password)
- **Image Upload**: Supabase Storage
- **Calendar & Date Utils**: `date-fns`

---

## 🔧 Installation

```bash
# 1. Clone the repo
git clone https://github.com/your-username/meds-buddy-check.git
cd meds-buddy-check

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.example .env
# Add your Supabase credentials to the .env file

# 4. Start development server
npm run dev


📁 Folder Structure
📁 src
├── 📁 components
│ ├── 📁 ui # Reusable UI elements
│ └── 📁 Medication # AddMedicationForm, MedicationList
├── 📁 hooks # React Query hooks (e.g., useMarkMedicationTaken)
├── 📁 pages
│ ├── 🧾 PatientDashboard.tsx
│ └── 🧾 CaretakerDashboard.tsx
├── 🧾 SupabaseClient.ts # Supabase config
```
----

## 🛡️ Security
Sensitive keys are stored in .env
JWT and user data are securely managed with Supabase Auth

----

## 📫 Contact
Made by @veeramani
📧 veeramani.r326@gmail.com
