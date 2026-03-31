import cors from "cors";

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import nodemailer from "nodemailer";
import PDFDocument from "pdfkit";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// 1. Load Environment Variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());

  // DEBUG: Check if .env is working
  console.log("--- SMTP CONFIG CHECK ---");
  console.log("EMAIL_USER:", process.env.EMAIL_USER || "MISSING");
  console.log("SMTP_PORT:", process.env.SMTP_PORT || "MISSING");
  console.log("-------------------------");

  app.use(express.json());

  const getTransporter = () => {
    const port = parseInt(process.env.SMTP_PORT || "465");
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: port,
      secure: port === 465,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  };

  app.post("/api/test-email", async (req, res) => {
    const { to } = req.body;
    
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return res.status(400).json({ 
        error: "SMTP credentials not found in .env file." 
      });
    }

    const transporter = getTransporter();

    try {
      await transporter.sendMail({
        from: `"Cadenx Music" <${process.env.EMAIL_USER}>`,
        to: to || process.env.EMAIL_USER,
        subject: "SMTP Test - Cadenx Music",
        text: "Your SMTP settings are working perfectly!",
        html: `<div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #000;">SMTP Test Successful</h2>
                <p>Your SMTP settings are working perfectly!</p>
               </div>`,
      });
      res.json({ success: true, message: "Test email sent successfully!" });
    } catch (error) {
      console.error("SMTP Error:", error);
      res.status(500).json({ error: "Failed to send email. Check App Password." });
    }
  });

  app.post("/api/enroll", async (req, res) => {
    const { enrollmentData, batchName } = req.body;
    
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error("SMTP credentials missing. Skipping email.");
      return res.status(200).json({ success: true, warning: "Enrollment saved but email skipped." });
    }

    try {
      const doc = new PDFDocument();
      let buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      
      doc.fontSize(25).text('Enrollment Confirmation', { align: 'center' });
      doc.moveDown();
      doc.fontSize(16).text(`Course: ${batchName || enrollmentData.course}`);
      doc.text(`Student Name: ${enrollmentData.name}`);
      doc.text(`Email: ${enrollmentData.email}`);
      doc.text(`Phone: ${enrollmentData.phone}`);
      doc.moveDown();
      doc.text(`Enrolled on: ${new Date().toLocaleString()}`);
      doc.end();

      doc.on('end', async () => {
        const pdfBuffer = Buffer.concat(buffers);
        const transporter = getTransporter();

        await transporter.sendMail({
          from: `"Cadenx Academy" <${process.env.EMAIL_USER}>`,
          to: process.env.EMAIL_USER,
          subject: `New Enrollment: ${enrollmentData.name}`,
          text: `A new student has enrolled in ${batchName}.`,
          attachments: [{
            filename: `Enrollment_${enrollmentData.name.replace(/\s+/g, '_')}.pdf`,
            content: pdfBuffer
          }]
        });

        await transporter.sendMail({
          from: `"Cadenx Academy" <${process.env.EMAIL_USER}>`,
          to: enrollmentData.email,
          subject: `Enrollment Confirmed: ${batchName}`,
          text: `Hi ${enrollmentData.name}, your enrollment for ${batchName} is confirmed!`,
        });

        res.json({ success: true, message: "Emails sent." });
      });
    } catch (error) {
      console.error("Enrollment Email Error:", error);
      res.status(500).json({ error: "SMTP Authentication failed." });
    }
  });

  // Vite middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // ✅ ONLY THIS LINE CHANGED
    const distPath = path.join(__dirname, "../dist");

    app.use(express.static(distPath));
    app.get("*", (req, res) => res.sendFile(path.join(distPath, "index.html")));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

startServer();