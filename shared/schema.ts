import { sql } from "drizzle-orm";
import { 
  pgTable, 
  text, 
  varchar, 
  integer, 
  serial, 
  date, 
  time, 
  timestamp, 
  decimal, 
  boolean,
  pgEnum
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enums
export const locationTypeEnum = pgEnum("location_type", ["Head", "Branch"]);
export const mandateEnum = pgEnum("mandate", ["Salaried", "Volunteer"]);
export const genderEnum = pgEnum("gender", ["Male", "Female"]);
export const statusEnum = pgEnum("status", ["Active", "Inactive"]);
export const relationshipEnum = pgEnum("relationship", [
  "Father", "Mother", "Grandfather", "Grandmother", "Tutor", "Partner", "Friend", "Other"
]);
export const paymentMethodEnum = pgEnum("payment_method", ["Cash", "Credit", "Debit"]);
export const sessionTypeEnum = pgEnum("session_type", ["Training", "Game"]);
export const playerRoleEnum = pgEnum("player_role", [
  "Setter", "Outside_Hitter", "Opposite_Hitter", "Middle_Blocker", "Defensive_Specialist", "Libero"
]);

// Tables
export const roles = pgTable("roles", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 50 }).notNull()
});

export const locations = pgTable("locations", {
  id: serial("id").primaryKey(),
  type: locationTypeEnum("type").notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  address: varchar("address", { length: 255 }),
  city: varchar("city", { length: 100 }),
  province: varchar("province", { length: 50 }),
  postalCode: varchar("postal_code", { length: 20 }),
  phone: varchar("phone", { length: 20 }),
  webAddress: varchar("web_address", { length: 100 }),
  capacity: integer("capacity")
});

export const hobbies = pgTable("hobbies", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull()
});

export const personnel = pgTable("personnel", {
  id: serial("id").primaryKey(),
  firstName: varchar("first_name", { length: 50 }),
  lastName: varchar("last_name", { length: 50 }),
  dob: date("dob"),
  ssn: varchar("ssn", { length: 20 }).notNull().unique(),
  medicareCard: varchar("medicare_card", { length: 20 }).notNull().unique(),
  phone: varchar("phone", { length: 20 }),
  address: varchar("address", { length: 255 }),
  city: varchar("city", { length: 100 }),
  province: varchar("province", { length: 50 }),
  postalCode: varchar("postal_code", { length: 20 }),
  email: varchar("email", { length: 100 }),
  roleId: integer("role_id").references(() => roles.id),
  mandate: mandateEnum("mandate")
});

export const personnelLocationHistory = pgTable("personnel_location_history", {
  id: serial("id").primaryKey(),
  personnelId: integer("personnel_id").references(() => personnel.id),
  locationId: integer("location_id").references(() => locations.id),
  startDate: date("start_date"),
  endDate: date("end_date")
});

export const familyMembers = pgTable("family_members", {
  id: serial("id").primaryKey(),
  firstName: varchar("first_name", { length: 50 }),
  lastName: varchar("last_name", { length: 50 }),
  dob: date("dob"),
  ssn: varchar("ssn", { length: 20 }).notNull().unique(),
  medicareCard: varchar("medicare_card", { length: 20 }).notNull().unique(),
  phone: varchar("phone", { length: 20 }),
  address: varchar("address", { length: 255 }),
  city: varchar("city", { length: 100 }),
  province: varchar("province", { length: 50 }),
  postalCode: varchar("postal_code", { length: 20 }),
  email: varchar("email", { length: 100 }),
  locationId: integer("location_id").references(() => locations.id)
});

export const secondaryFamilyMembers = pgTable("secondary_family_members", {
  id: serial("id").primaryKey(),
  primaryFamilyId: integer("primary_family_id").references(() => familyMembers.id),
  firstName: varchar("first_name", { length: 50 }),
  lastName: varchar("last_name", { length: 50 }),
  phone: varchar("phone", { length: 20 }),
  relationship: relationshipEnum("relationship")
});

export const clubMembers = pgTable("club_members", {
  id: serial("id").primaryKey(),
  firstName: varchar("first_name", { length: 50 }),
  lastName: varchar("last_name", { length: 50 }),
  dob: date("dob"),
  height: decimal("height", { precision: 5, scale: 2 }),
  weight: decimal("weight", { precision: 5, scale: 2 }),
  ssn: varchar("ssn", { length: 20 }).notNull().unique(),
  medicareCard: varchar("medicare_card", { length: 20 }).notNull().unique(),
  phone: varchar("phone", { length: 20 }),
  address: varchar("address", { length: 255 }),
  city: varchar("city", { length: 100 }),
  province: varchar("province", { length: 50 }),
  postalCode: varchar("postal_code", { length: 20 }),
  email: varchar("email", { length: 100 }),
  gender: genderEnum("gender"),
  status: statusEnum("status").default("Active"),
  joinDate: date("join_date").default(sql`CURRENT_DATE`),
  locationId: integer("location_id").references(() => locations.id)
});

export const familyMemberChild = pgTable("family_member_child", {
  familyId: integer("family_id").references(() => familyMembers.id),
  memberId: integer("member_id").references(() => clubMembers.id),
  relationship: relationshipEnum("relationship")
});

export const memberHobby = pgTable("member_hobby", {
  memberId: integer("member_id").references(() => clubMembers.id),
  hobbyId: integer("hobby_id").references(() => hobbies.id)
});

export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  memberId: integer("member_id").references(() => clubMembers.id),
  paymentDate: date("payment_date"),
  amount: decimal("amount", { precision: 10, scale: 2 }),
  method: paymentMethodEnum("method"),
  membershipYear: integer("membership_year"),
  isDonation: boolean("is_donation").default(false)
});

export const teamFormation = pgTable("team_formation", {
  id: serial("id").primaryKey(),
  teamName: varchar("team_name", { length: 100 }),
  headCoachId: integer("head_coach_id").references(() => personnel.id),
  locationId: integer("location_id").references(() => locations.id),
  startDate: date("start_date"),
  endDate: date("end_date"),
  gender: genderEnum("gender")
});

export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  team1Id: integer("team1_id").references(() => teamFormation.id),
  team2Id: integer("team2_id").references(() => teamFormation.id),
  locationId: integer("location_id").references(() => locations.id),
  sessionDate: date("session_date"),
  startTime: time("start_time"),
  sessionType: sessionTypeEnum("session_type"),
  address: varchar("address", { length: 255 }),
  scoreTeam1: integer("score_team1"),
  scoreTeam2: integer("score_team2")
});

export const teamAssignment = pgTable("team_assignment", {
  id: serial("id").primaryKey(),
  memberId: integer("member_id").references(() => clubMembers.id),
  teamId: integer("team_id").references(() => teamFormation.id),
  sessionId: integer("session_id").references(() => sessions.id),
  role: playerRoleEnum("role"),
  startTime: time("start_time")
});

export const teamMembers = pgTable("team_members", {
  teamId: integer("team_id").references(() => teamFormation.id),
  memberId: integer("member_id").references(() => clubMembers.id),
  role: playerRoleEnum("role")
});

export const clubMemberLocationHistory = pgTable("club_member_location_history", {
  id: serial("id").primaryKey(),
  memberId: integer("member_id").references(() => clubMembers.id),
  locationId: integer("location_id").references(() => locations.id),
  startDate: date("start_date"),
  endDate: date("end_date")
});

export const emailLog = pgTable("email_log", {
  id: serial("id").primaryKey(),
  emailDate: timestamp("email_date"),
  senderLocationId: integer("sender_location_id").references(() => locations.id),
  receiverEmail: varchar("receiver_email", { length: 100 }),
  subject: varchar("subject", { length: 255 }),
  bodySnippet: varchar("body_snippet", { length: 100 })
});

// Relations
export const locationsRelations = relations(locations, ({ many }) => ({
  personnel: many(personnelLocationHistory),
  familyMembers: many(familyMembers),
  clubMembers: many(clubMembers),
  teams: many(teamFormation),
  sessions: many(sessions),
  emailLogs: many(emailLog)
}));

export const personnelRelations = relations(personnel, ({ one, many }) => ({
  role: one(roles, {
    fields: [personnel.roleId],
    references: [roles.id]
  }),
  locationHistory: many(personnelLocationHistory),
  coachedTeams: many(teamFormation)
}));

export const clubMembersRelations = relations(clubMembers, ({ one, many }) => ({
  location: one(locations, {
    fields: [clubMembers.locationId],
    references: [locations.id]
  }),
  familyRelations: many(familyMemberChild),
  hobbies: many(memberHobby),
  payments: many(payments),
  teamAssignments: many(teamAssignment),
  teamMemberships: many(teamMembers),
  locationHistory: many(clubMemberLocationHistory)
}));

export const familyMembersRelations = relations(familyMembers, ({ one, many }) => ({
  location: one(locations, {
    fields: [familyMembers.locationId],
    references: [locations.id]
  }),
  children: many(familyMemberChild),
  secondaryMembers: many(secondaryFamilyMembers)
}));

export const teamFormationRelations = relations(teamFormation, ({ one, many }) => ({
  headCoach: one(personnel, {
    fields: [teamFormation.headCoachId],
    references: [personnel.id]
  }),
  location: one(locations, {
    fields: [teamFormation.locationId],
    references: [locations.id]
  }),
  sessions1: many(sessions, { relationName: "team1_sessions" }),
  sessions2: many(sessions, { relationName: "team2_sessions" }),
  assignments: many(teamAssignment),
  members: many(teamMembers)
}));

export const sessionsRelations = relations(sessions, ({ one, many }) => ({
  team1: one(teamFormation, {
    fields: [sessions.team1Id],
    references: [teamFormation.id],
    relationName: "team1_sessions"
  }),
  team2: one(teamFormation, {
    fields: [sessions.team2Id],
    references: [teamFormation.id],
    relationName: "team2_sessions"
  }),
  location: one(locations, {
    fields: [sessions.locationId],
    references: [locations.id]
  }),
  assignments: many(teamAssignment)
}));

// Insert Schemas
export const insertLocationSchema = createInsertSchema(locations).omit({ id: true });
export const insertPersonnelSchema = createInsertSchema(personnel).omit({ id: true });
export const insertClubMemberSchema = createInsertSchema(clubMembers).omit({ id: true });
export const insertFamilyMemberSchema = createInsertSchema(familyMembers).omit({ id: true });
export const insertTeamFormationSchema = createInsertSchema(teamFormation).omit({ id: true });
export const insertSessionSchema = createInsertSchema(sessions).omit({ id: true });
export const insertPaymentSchema = createInsertSchema(payments).omit({ id: true });

// Types
export type Location = typeof locations.$inferSelect;
export type InsertLocation = z.infer<typeof insertLocationSchema>;

export type Personnel = typeof personnel.$inferSelect;
export type InsertPersonnel = z.infer<typeof insertPersonnelSchema>;

export type ClubMember = typeof clubMembers.$inferSelect;
export type InsertClubMember = z.infer<typeof insertClubMemberSchema>;

export type FamilyMember = typeof familyMembers.$inferSelect;
export type InsertFamilyMember = z.infer<typeof insertFamilyMemberSchema>;

export type TeamFormation = typeof teamFormation.$inferSelect;
export type InsertTeamFormation = z.infer<typeof insertTeamFormationSchema>;

export type Session = typeof sessions.$inferSelect;
export type InsertSession = z.infer<typeof insertSessionSchema>;

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;

export type Role = typeof roles.$inferSelect;
export type Hobby = typeof hobbies.$inferSelect;
