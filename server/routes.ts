import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { getResendClient } from "./resend-client";
import nodemailer from "nodemailer";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Search facilities
  app.get("/api/facilities", async (req, res) => {
    try {
      const {
        state,
        city,
        searchQuery,
        services,
        directory,
        limit = "100",
        offset = "0"
      } = req.query;

      const serviceArray = services
        ? (Array.isArray(services) ? services : [services]) as string[]
        : [];

      const result = await storage.searchFacilities({
        state: state as string | undefined,
        city: city as string | undefined,
        searchQuery: searchQuery as string | undefined,
        services: serviceArray,
        directory: directory as "mental" | "substance" | undefined,
        limit: parseInt(limit as string, 10),
        offset: parseInt(offset as string, 10),
      });

      res.json(result);
    } catch (error) {
      console.error("Error searching facilities:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get facility by ID
  app.get("/api/facilities/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid facility ID" });
      }

      const facility = await storage.getFacilityById(id);

      if (!facility) {
        return res.status(404).json({ error: "Facility not found" });
      }

      res.json(facility);
    } catch (error) {
      console.error("Error fetching facility:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get clinics for contact form dropdown
  app.get("/api/clinics", async (req, res) => {
    try {
      const { state, directory, search } = req.query;

      if (!state) {
        return res.json({ clinics: [] });
      }

      const result = await storage.searchFacilities({
        state: state as string,
        searchQuery: search as string | undefined,
        directory: directory as "mental" | "substance" | undefined,
        limit: 100,
        offset: 0,
      });

      const clinics = result.facilities.map(f => ({
        id: f.id,
        name: f.name1 + (f.name2 ? ` - ${f.name2}` : ''),
        city: f.city,
        services: f.services,
      }));

      res.json({ clinics });
    } catch (error) {
      console.error("Error fetching clinics:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Send feedback email
  app.post("/api/contact", async (req, res) => {
    try {
      const { name, email, category, agencyName, message } = req.body;

      if (!name || !email || !message) {
        return res.status(400).json({ error: "Name, email, and message are required" });
      }

      const feedbackRecipient = process.env.FEEDBACK_EMAIL || "ashriv61@asu.edu";

      const categoryLabels: Record<string, string> = {
        type_of_care: "Type of Care",
        service_setting: "Service Setting",
        facility_type: "Facility Type",
        treatment_approach: "Treatment Approach",
        payment_insurance: "Payment/Insurance",
        population_served: "Population Served",
        language_services: "Language Services",
        agency_update: "Agency Information Update",
        new_agency: "Suggest New Agency",
        general: "General Feedback",
      };

      const emailContent = `
New feedback submission from the Mental Health Facility Search application:

Name: ${name}
Email: ${email}
Category: ${categoryLabels[category] || category || "Not specified"}
${agencyName ? `Agency Name: ${agencyName}` : ""}

Message:
${message}
      `.trim();

      // Prefer Resend if configured, otherwise fall back to SMTP (nodemailer)
      if (process.env.RESEND_API_KEY) {
        const { client: resend, fromEmail } = getResendClient();
        await resend.emails.send({
          from: `Community Resource Engine <${fromEmail}>`,
          to: feedbackRecipient,
          subject: `Facility Directory Feedback: ${categoryLabels[category] || "General"}`,
          text: emailContent,
          replyTo: email,
        });
      } else if (process.env.SMTP_HOST) {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587,
          secure: process.env.SMTP_SECURE === "true",
          auth: process.env.SMTP_USER
            ? {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
              }
            : undefined,
        });

        const from = process.env.SMTP_FROM || process.env.SMTP_USER || "no-reply@example.com";
        await transporter.sendMail({
          from: `Community Resource Engine <${from}>`,
          to: feedbackRecipient,
          subject: `Facility Directory Feedback: ${categoryLabels[category] || "General"}`,
          text: emailContent,
          replyTo: email,
        });
      } else {
        throw new Error(
          "Email is not configured. Set RESEND_API_KEY (recommended) or SMTP_HOST/SMTP_USER/SMTP_PASS."
        );
      }

      res.json({ success: true, message: "Feedback sent successfully" });
    } catch (error) {
      console.error("Error sending feedback email:", error);
      res.status(500).json({ error: "Failed to send feedback" });
    }
  });

  return httpServer;
}
