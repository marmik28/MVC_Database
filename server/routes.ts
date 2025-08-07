import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertLocationSchema, insertPersonnelSchema, insertClubMemberSchema, insertFamilyMemberSchema, insertTeamFormationSchema, insertSessionSchema, insertPaymentSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Locations
  app.get("/api/locations", async (req, res) => {
    try {
      const locations = await storage.getLocations();
      res.json(locations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch locations" });
    }
  });

  app.get("/api/locations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const location = await storage.getLocationById(id);
      if (!location) {
        return res.status(404).json({ message: "Location not found" });
      }
      res.json(location);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch location" });
    }
  });

  app.post("/api/locations", async (req, res) => {
    try {
      const locationData = insertLocationSchema.parse(req.body);
      const location = await storage.createLocation(locationData);
      res.status(201).json(location);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid location data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create location" });
    }
  });

  app.put("/api/locations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const locationData = insertLocationSchema.partial().parse(req.body);
      const location = await storage.updateLocation(id, locationData);
      res.json(location);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid location data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update location" });
    }
  });

  app.delete("/api/locations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteLocation(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete location" });
    }
  });

  // Personnel
  app.get("/api/personnel", async (req, res) => {
    try {
      const personnel = await storage.getPersonnel();
      res.json(personnel);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch personnel" });
    }
  });

  app.post("/api/personnel", async (req, res) => {
    try {
      const personnelData = insertPersonnelSchema.parse(req.body);
      const person = await storage.createPersonnel(personnelData);
      res.status(201).json(person);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid personnel data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create personnel" });
    }
  });

  app.put("/api/personnel/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const personnelData = insertPersonnelSchema.partial().parse(req.body);
      const person = await storage.updatePersonnel(id, personnelData);
      res.json(person);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid personnel data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update personnel" });
    }
  });

  app.delete("/api/personnel/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deletePersonnel(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete personnel" });
    }
  });

  // Club Members
  app.get("/api/members", async (req, res) => {
    try {
      const members = await storage.getClubMembers();
      res.json(members);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch members" });
    }
  });

  app.get("/api/members/active", async (req, res) => {
    try {
      const members = await storage.getActiveClubMembers();
      res.json(members);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch active members" });
    }
  });

  app.post("/api/members", async (req, res) => {
    try {
      const memberData = insertClubMemberSchema.parse(req.body);
      
      const isSSNUnique = await storage.validateUniqueSSN(memberData.ssn);
      if (!isSSNUnique) {
        return res.status(400).json({ message: "SSN already exists" });
      }
      
      const isMedicareUnique = await storage.validateUniqueMedicare(memberData.medicareCard);
      if (!isMedicareUnique) {
        return res.status(400).json({ message: "Medicare card already exists" });
      }

      // Validate age >= 11
      const birthDate = new Date(memberData.dob!);
      const age = new Date().getFullYear() - birthDate.getFullYear();
      if (age < 11) {
        return res.status(400).json({ message: "Member must be at least 11 years old" });
      }

      const member = await storage.createClubMember(memberData);
      res.status(201).json(member);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid member data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create member" });
    }
  });

  app.put("/api/members/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const memberData = insertClubMemberSchema.partial().parse(req.body);
      const member = await storage.updateClubMember(id, memberData);
      res.json(member);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid member data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update member" });
    }
  });

  app.delete("/api/members/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteClubMember(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete member" });
    }
  });

  // Member Hobby Management
  app.post("/api/members/:id/hobbies", async (req, res) => {
    try {
      const memberId = parseInt(req.params.id);
      const { hobbyId } = req.body;
      await storage.addMemberHobby(memberId, hobbyId);
      res.status(201).json({ message: "Hobby added successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to add hobby" });
    }
  });

  app.delete("/api/members/:id/hobbies/:hobbyId", async (req, res) => {
    try {
      const memberId = parseInt(req.params.id);
      const hobbyId = parseInt(req.params.hobbyId);
      await storage.removeMemberHobby(memberId, hobbyId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to remove hobby" });
    }
  });

  // Family Members
  app.get("/api/families", async (req, res) => {
    try {
      const families = await storage.getFamilyMembers();
      res.json(families);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch families" });
    }
  });

  app.post("/api/families", async (req, res) => {
    try {
      const familyData = insertFamilyMemberSchema.parse(req.body);
      const family = await storage.createFamilyMember(familyData);
      res.status(201).json(family);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid family data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create family member" });
    }
  });

  app.put("/api/families/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const familyData = insertFamilyMemberSchema.partial().parse(req.body);
      const family = await storage.updateFamilyMember(id, familyData);
      res.json(family);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid family data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update family member" });
    }
  });

  app.delete("/api/families/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteFamilyMember(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete family member" });
    }
  });

  // Secondary Family Members
  app.post("/api/families/secondary", async (req, res) => {
    try {
      const secondaryData = req.body;
      const secondary = await storage.createSecondaryFamilyMember(secondaryData);
      res.status(201).json(secondary);
    } catch (error) {
      res.status(500).json({ message: "Failed to create secondary family member" });
    }
  });

  app.put("/api/families/secondary/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const secondaryData = req.body;
      const secondary = await storage.updateSecondaryFamilyMember(id, secondaryData);
      res.json(secondary);
    } catch (error) {
      res.status(500).json({ message: "Failed to update secondary family member" });
    }
  });

  app.delete("/api/families/secondary/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteSecondaryFamilyMember(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete secondary family member" });
    }
  });

  // Teams
  app.get("/api/teams", async (req, res) => {
    try {
      const teams = await storage.getTeamFormations();
      res.json(teams);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch teams" });
    }
  });

  app.post("/api/teams", async (req, res) => {
    try {
      const teamData = insertTeamFormationSchema.parse(req.body);
      const team = await storage.createTeamFormation(teamData);
      res.status(201).json(team);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid team data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create team" });
    }
  });

  app.put("/api/teams/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const teamData = insertTeamFormationSchema.partial().parse(req.body);
      const team = await storage.updateTeamFormation(id, teamData);
      res.json(team);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid team data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update team" });
    }
  });

  app.delete("/api/teams/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteTeamFormation(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete team" });
    }
  });

  // Team Member Management
  app.post("/api/teams/:id/members", async (req, res) => {
    try {
      const teamId = parseInt(req.params.id);
      const { memberId, role, sessionDate, startTime } = req.body;
      
      // Validate time conflict
      const isValid = await storage.validateTeamMemberAssignment(memberId, sessionDate, startTime);
      if (!isValid) {
        return res.status(400).json({ message: "Member has a conflicting session within 3 hours" });
      }
      
      await storage.addTeamMember(teamId, memberId, role);
      res.status(201).json({ message: "Team member added successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to add team member" });
    }
  });

  app.delete("/api/teams/:id/members/:memberId", async (req, res) => {
    try {
      const teamId = parseInt(req.params.id);
      const memberId = parseInt(req.params.memberId);
      await storage.removeTeamMember(teamId, memberId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to remove team member" });
    }
  });

  app.get("/api/teams/:id/members", async (req, res) => {
    try {
      const teamId = parseInt(req.params.id);
      const members = await storage.getTeamMembers(teamId);
      res.json(members);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch team members" });
    }
  });

  // Sessions
  app.get("/api/sessions", async (req, res) => {
    try {
      const sessions = await storage.getSessions();
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch sessions" });
    }
  });

  app.get("/api/sessions/upcoming", async (req, res) => {
    try {
      const sessions = await storage.getUpcomingSessions();
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch upcoming sessions" });
    }
  });

  app.post("/api/sessions", async (req, res) => {
    try {
      const sessionData = insertSessionSchema.parse(req.body);
      const session = await storage.createSession(sessionData);
      res.status(201).json(session);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid session data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create session" });
    }
  });

  // Payments
  app.get("/api/payments", async (req, res) => {
    try {
      const payments = await storage.getPayments();
      res.json(payments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch payments" });
    }
  });

  app.post("/api/payments", async (req, res) => {
    try {
      const paymentData = insertPaymentSchema.parse(req.body);
      const payment = await storage.createPayment(paymentData);
      res.status(201).json(payment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid payment data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create payment" });
    }
  });

  // Roles and Hobbies
  app.get("/api/roles", async (req, res) => {
    try {
      const roles = await storage.getRoles();
      res.json(roles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch roles" });
    }
  });

  app.get("/api/hobbies", async (req, res) => {
    try {
      const hobbies = await storage.getHobbies();
      res.json(hobbies);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch hobbies" });
    }
  });

  // Dashboard
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  app.get("/api/dashboard/recent-activity", async (req, res) => {
    try {
      const activity = await storage.getRecentActivity();
      res.json(activity);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recent activity" });
    }
  });

  // Email Logs
  app.get("/api/email-logs", async (req, res) => {
    try {
      const emailLogs = await storage.getEmailLogs();
      res.json(emailLogs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch email logs" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
