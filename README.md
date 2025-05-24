# SalesFlow AI

SalesFlow AI is a Next.js application that leverages AI-powered lead processing and email generation. It integrates with FastAPI and Flask backend services for advanced data processing.

## Features

- Upload and process CSV files with AI categorization
- Automated email generation based on processed leads
- User authentication (signup, login, password reset)
- Dashboard for managing leads and emails

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Python 3.8+](https://www.python.org/) (for FastAPI and Flask services)
- [pip](https://pip.pypa.io/en/stable/)
- [Git](https://git-scm.com/)

---

## 1. Clone the Repository

```sh
git clone https://github.com/your-username/salesflow-ai.git
cd salesflow-ai
```

## 2. Install Node.js Dependencies

```sh
npm install
# or
yarn install
```

## 3. Set Up Environment Variables

Copy the example environment file and update values as needed:

```sh
cp .env.local.example .env.local
```

Edit `.env.local` to set your database URL, API endpoints, and any required secrets.

**Required fields in `.env.local`:**
- `DATABASE_URL`
- `RESEND_API_KEY`
- `APP_URL`
- `AUTH_SECRET`
- `GEMINI_API_KEY`

---

## Note: 
Setup RESEND_API_KEY for mailing purposes via [Resend](https://resend.com/).

## 4. Set Up Prisma

This project uses [Prisma](https://www.prisma.io/) for database management.

### a. Initialize Prisma (if not already done)

```sh
npx prisma init
# schema is predefined.
```

### b. Migrate Your Database

```sh
npx prisma migrate dev --name init
npx prisma generate
```

To seed the database (optional):

```sh
npm run seed
```

---

## 5. Set Up Gemini API

To use Gemini AI features, you need a Gemini API key.

- Get your Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
- Add it to your `.env.local` as `GEMINI_API_KEY=your_key_here`.

---

## 6. Start the FastAPI Service

Navigate to the `fast-api-service` directory:

```sh
cd fast-api-service
```

Create and activate a virtual environment:

```sh
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

Install dependencies:

```sh
pip install -r requirements.txt
```

Start the FastAPI server:

```sh
uvicorn main:app --reload
```

The FastAPI service should run on [http://localhost:8000](http://localhost:8000).

---

## 7. (Optional) Start the Flask Service

Navigate to the `flask-service` directory:

```sh
cd ../flask-service
```

Create and activate a virtual environment:

```sh
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

Install dependencies:

```sh
pip install -r requirements.txt
```

Run the Flask app:

```sh
python app.py
```

The Flask service should run on [http://localhost:5000](http://localhost:5000).

---

## 8. Run the Next.js App

Return to the root directory and start the development server:

```sh
cd ..
npm run dev
# or
yarn dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

---

## 9. Uploads Directory

Ensure the `uploads` directory exists in the project root for file uploads:

```sh
mkdir -p uploads
```

---

## 10. CSV Upload Requirements

**Any CSV file you upload must have the following headers, in this exact order:**

```
Lead_ID,Company_Name,Company_Client_Email,Email_Open_Rate,Click_Through_Rate,Past_Purchases,Response_Time,Marketing_Spend,Engagement_Score,Lead_Score,Lead_Source,Industry,Demo_Scheduled,Converted
```

Example:

```csv
Lead_ID,Company_Name,Company_Client_Email,Email_Open_Rate,Click_Through_Rate,Past_Purchases,Response_Time,Marketing_Spend,Engagement_Score,Lead_Score,Lead_Source,Industry,Demo_Scheduled,Converted
1,Acme Corp,client@acme.com,0.45,0.12,3,24,5000,75.5,80.2,Web,Technology,true,false
```

---

## 11. Access the App

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Troubleshooting

- Ensure all backend services (FastAPI, Flask) are running before uploading files or generating emails.
- Check `.env.local` for correct API URLs and secrets.
- For database issues, verify your database connection and run migrations.

---

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)

---

## License

MIT