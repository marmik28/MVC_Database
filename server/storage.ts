import { 
  locations, personnel, clubMembers, familyMembers, teamFormation, sessions, payments, roles, hobbies, emailLog,
  type Location, type InsertLocation,
  type Personnel, type InsertPersonnel,
  type ClubMember, type InsertClubMember,
  type FamilyMember, type InsertFamilyMember,
  type TeamFormation, type InsertTeamFormation,
  type Session, type InsertSession,
  type Payment, type InsertPayment,
  type Role, type Hobby
} from "@shared/schema";
import { db } from "./db";
import { eq, and, sql, desc, asc } from "drizzle-orm";

export interface IStorage {
  // Locations
  getLocations(): Promise<Location[]>;
  getLocationById(id: number): Promise<Location | undefined>;
  createLocation(location: InsertLocation): Promise<Location>;
  updateLocation(id: number, location: Partial<InsertLocation>): Promise<Location>;
  deleteLocation(id: number): Promise<void>;

  // Personnel
  getPersonnel(): Promise<Personnel[]>;
  getPersonnelById(id: number): Promise<Personnel | undefined>;
  createPersonnel(personnel: InsertPersonnel): Promise<Personnel>;
  updatePersonnel(id: number, personnel: Partial<InsertPersonnel>): Promise<Personnel>;
  deletePersonnel(id: number): Promise<void>;

  // Club Members
  getClubMembers(): Promise<ClubMember[]>;
  getClubMemberById(id: number): Promise<ClubMember | undefined>;
  createClubMember(member: InsertClubMember): Promise<ClubMember>;
  updateClubMember(id: number, member: Partial<InsertClubMember>): Promise<ClubMember>;
  deleteClubMember(id: number): Promise<void>;
  getActiveClubMembers(): Promise<ClubMember[]>;
  validateUniqueSSN(ssn: string, excludeId?: number): Promise<boolean>;
  validateUniqueMedicare(medicareCard: string, excludeId?: number): Promise<boolean>;

  // Family Members
  getFamilyMembers(): Promise<FamilyMember[]>;
  getFamilyMemberById(id: number): Promise<FamilyMember | undefined>;
  createFamilyMember(member: InsertFamilyMember): Promise<FamilyMember>;
  updateFamilyMember(id: number, member: Partial<InsertFamilyMember>): Promise<FamilyMember>;
  deleteFamilyMember(id: number): Promise<void>;

  // Team Formations
  getTeamFormations(): Promise<TeamFormation[]>;
  getTeamFormationById(id: number): Promise<TeamFormation | undefined>;
  createTeamFormation(team: InsertTeamFormation): Promise<TeamFormation>;
  updateTeamFormation(id: number, team: Partial<InsertTeamFormation>): Promise<TeamFormation>;
  deleteTeamFormation(id: number): Promise<void>;

  // Sessions
  getSessions(): Promise<Session[]>;
  getSessionById(id: number): Promise<Session | undefined>;
  createSession(session: InsertSession): Promise<Session>;
  updateSession(id: number, session: Partial<InsertSession>): Promise<Session>;
  deleteSession(id: number): Promise<void>;
  getUpcomingSessions(): Promise<Session[]>;

  // Payments
  getPayments(): Promise<Payment[]>;
  getPaymentById(id: number): Promise<Payment | undefined>;
  createPayment(payment: InsertPayment): Promise<Payment>;
  getPaymentsByMember(memberId: number): Promise<Payment[]>;

  // Roles and Hobbies
  getRoles(): Promise<Role[]>;
  getHobbies(): Promise<Hobby[]>;

  // Dashboard Statistics
  getDashboardStats(): Promise<{
    totalLocations: number;
    activeMembers: number;
    activeTeams: number;
    weekSessions: number;
  }>;

  // Recent Activity
  getRecentActivity(): Promise<any[]>;

  // Email Logs
  getEmailLogs(): Promise<any[]>;
}

export class DatabaseStorage implements IStorage {
  // Locations
  async getLocations(): Promise<Location[]> {
    return await db.select().from(locations).orderBy(asc(locations.name));
  }

  async getLocationById(id: number): Promise<Location | undefined> {
    const [location] = await db.select().from(locations).where(eq(locations.id, id));
    return location || undefined;
  }

  async createLocation(location: InsertLocation): Promise<Location> {
    const [newLocation] = await db.insert(locations).values(location).returning();
    return newLocation;
  }

  async updateLocation(id: number, location: Partial<InsertLocation>): Promise<Location> {
    const [updatedLocation] = await db
      .update(locations)
      .set(location)
      .where(eq(locations.id, id))
      .returning();
    return updatedLocation;
  }

  async deleteLocation(id: number): Promise<void> {
    await db.delete(locations).where(eq(locations.id, id));
  }

  // Personnel
  async getPersonnel(): Promise<Personnel[]> {
    return await db.select().from(personnel).orderBy(asc(personnel.lastName));
  }

  async getPersonnelById(id: number): Promise<Personnel | undefined> {
    const [person] = await db.select().from(personnel).where(eq(personnel.id, id));
    return person || undefined;
  }

  async createPersonnel(person: InsertPersonnel): Promise<Personnel> {
    const [newPersonnel] = await db.insert(personnel).values(person).returning();
    return newPersonnel;
  }

  async updatePersonnel(id: number, person: Partial<InsertPersonnel>): Promise<Personnel> {
    const [updatedPersonnel] = await db
      .update(personnel)
      .set(person)
      .where(eq(personnel.id, id))
      .returning();
    return updatedPersonnel;
  }

  async deletePersonnel(id: number): Promise<void> {
    await db.delete(personnel).where(eq(personnel.id, id));
  }

  // Club Members
  async getClubMembers(): Promise<ClubMember[]> {
    return await db.select().from(clubMembers).orderBy(asc(clubMembers.lastName));
  }

  async getClubMemberById(id: number): Promise<ClubMember | undefined> {
    const [member] = await db.select().from(clubMembers).where(eq(clubMembers.id, id));
    return member || undefined;
  }

  async createClubMember(member: InsertClubMember): Promise<ClubMember> {
    const [newMember] = await db.insert(clubMembers).values(member).returning();
    return newMember;
  }

  async updateClubMember(id: number, member: Partial<InsertClubMember>): Promise<ClubMember> {
    const [updatedMember] = await db
      .update(clubMembers)
      .set(member)
      .where(eq(clubMembers.id, id))
      .returning();
    return updatedMember;
  }

  async deleteClubMember(id: number): Promise<void> {
    await db.delete(clubMembers).where(eq(clubMembers.id, id));
  }

  async getActiveClubMembers(): Promise<ClubMember[]> {
    return await db
      .select()
      .from(clubMembers)
      .where(eq(clubMembers.status, "Active"))
      .orderBy(asc(clubMembers.lastName));
  }

  async validateUniqueSSN(ssn: string, excludeId?: number): Promise<boolean> {
    const conditions = [eq(clubMembers.ssn, ssn)];
    if (excludeId) {
      conditions.push(sql`${clubMembers.id} != ${excludeId}`);
    }
    
    const [existing] = await db
      .select()
      .from(clubMembers)
      .where(and(...conditions));
    
    return !existing;
  }

  async validateUniqueMedicare(medicareCard: string, excludeId?: number): Promise<boolean> {
    const conditions = [eq(clubMembers.medicareCard, medicareCard)];
    if (excludeId) {
      conditions.push(sql`${clubMembers.id} != ${excludeId}`);
    }
    
    const [existing] = await db
      .select()
      .from(clubMembers)
      .where(and(...conditions));
    
    return !existing;
  }

  // Family Members
  async getFamilyMembers(): Promise<FamilyMember[]> {
    return await db.select().from(familyMembers).orderBy(asc(familyMembers.lastName));
  }

  async getFamilyMemberById(id: number): Promise<FamilyMember | undefined> {
    const [member] = await db.select().from(familyMembers).where(eq(familyMembers.id, id));
    return member || undefined;
  }

  async createFamilyMember(member: InsertFamilyMember): Promise<FamilyMember> {
    const [newMember] = await db.insert(familyMembers).values(member).returning();
    return newMember;
  }

  async updateFamilyMember(id: number, member: Partial<InsertFamilyMember>): Promise<FamilyMember> {
    const [updatedMember] = await db
      .update(familyMembers)
      .set(member)
      .where(eq(familyMembers.id, id))
      .returning();
    return updatedMember;
  }

  async deleteFamilyMember(id: number): Promise<void> {
    await db.delete(familyMembers).where(eq(familyMembers.id, id));
  }

  // Team Formations
  async getTeamFormations(): Promise<TeamFormation[]> {
    return await db.select().from(teamFormation).orderBy(asc(teamFormation.teamName));
  }

  async getTeamFormationById(id: number): Promise<TeamFormation | undefined> {
    const [team] = await db.select().from(teamFormation).where(eq(teamFormation.id, id));
    return team || undefined;
  }

  async createTeamFormation(team: InsertTeamFormation): Promise<TeamFormation> {
    const [newTeam] = await db.insert(teamFormation).values(team).returning();
    return newTeam;
  }

  async updateTeamFormation(id: number, team: Partial<InsertTeamFormation>): Promise<TeamFormation> {
    const [updatedTeam] = await db
      .update(teamFormation)
      .set(team)
      .where(eq(teamFormation.id, id))
      .returning();
    return updatedTeam;
  }

  async deleteTeamFormation(id: number): Promise<void> {
    await db.delete(teamFormation).where(eq(teamFormation.id, id));
  }

  // Sessions
  async getSessions(): Promise<Session[]> {
    return await db.select().from(sessions).orderBy(desc(sessions.sessionDate));
  }

  async getSessionById(id: number): Promise<Session | undefined> {
    const [session] = await db.select().from(sessions).where(eq(sessions.id, id));
    return session || undefined;
  }

  async createSession(session: InsertSession): Promise<Session> {
    const [newSession] = await db.insert(sessions).values(session).returning();
    return newSession;
  }

  async updateSession(id: number, session: Partial<InsertSession>): Promise<Session> {
    const [updatedSession] = await db
      .update(sessions)
      .set(session)
      .where(eq(sessions.id, id))
      .returning();
    return updatedSession;
  }

  async deleteSession(id: number): Promise<void> {
    await db.delete(sessions).where(eq(sessions.id, id));
  }

  async getUpcomingSessions(): Promise<Session[]> {
    return await db
      .select()
      .from(sessions)
      .where(sql`${sessions.sessionDate} >= CURRENT_DATE`)
      .orderBy(asc(sessions.sessionDate), asc(sessions.startTime))
      .limit(10);
  }

  // Payments
  async getPayments(): Promise<Payment[]> {
    return await db.select().from(payments).orderBy(desc(payments.paymentDate));
  }

  async getPaymentById(id: number): Promise<Payment | undefined> {
    const [payment] = await db.select().from(payments).where(eq(payments.id, id));
    return payment || undefined;
  }

  async createPayment(payment: InsertPayment): Promise<Payment> {
    const [newPayment] = await db.insert(payments).values(payment).returning();
    return newPayment;
  }

  async getPaymentsByMember(memberId: number): Promise<Payment[]> {
    return await db
      .select()
      .from(payments)
      .where(eq(payments.memberId, memberId))
      .orderBy(desc(payments.paymentDate));
  }

  // Roles and Hobbies
  async getRoles(): Promise<Role[]> {
    return await db.select().from(roles).orderBy(asc(roles.name));
  }

  async getHobbies(): Promise<Hobby[]> {
    return await db.select().from(hobbies).orderBy(asc(hobbies.name));
  }

  // Dashboard Statistics
  async getDashboardStats(): Promise<{
    totalLocations: number;
    activeMembers: number;
    activeTeams: number;
    weekSessions: number;
  }> {
    const [locationCount] = await db.select({ count: sql`count(*)` }).from(locations);
    const [memberCount] = await db
      .select({ count: sql`count(*)` })
      .from(clubMembers)
      .where(eq(clubMembers.status, "Active"));
    const [teamCount] = await db.select({ count: sql`count(*)` }).from(teamFormation);
    const [sessionCount] = await db
      .select({ count: sql`count(*)` })
      .from(sessions)
      .where(sql`${sessions.sessionDate} BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days'`);

    return {
      totalLocations: Number(locationCount.count) || 0,
      activeMembers: Number(memberCount.count) || 0,
      activeTeams: Number(teamCount.count) || 0,
      weekSessions: Number(sessionCount.count) || 0
    };
  }

  // Recent Activity
  async getRecentActivity(): Promise<any[]> {
    // This would typically join multiple tables to get recent activity
    // For now, return recent member registrations
    const recentMembers = await db
      .select()
      .from(clubMembers)
      .orderBy(desc(clubMembers.joinDate))
      .limit(5);

    return recentMembers.map(member => ({
      type: 'member_registered',
      description: `New member registered: ${member.firstName} ${member.lastName}`,
      timestamp: member.joinDate,
      location: 'Unknown Location' // Would need to join with locations table
    }));
  }

  // Email Logs
  async getEmailLogs(): Promise<any[]> {
    const logs = await db
      .select({
        id: emailLog.id,
        emailDate: emailLog.emailDate,
        senderLocationId: emailLog.senderLocationId,
        receiverEmail: emailLog.receiverEmail,
        subject: emailLog.subject,
        bodySnippet: emailLog.bodySnippet,
        senderLocation: {
          name: locations.name,
          type: locations.type
        }
      })
      .from(emailLog)
      .leftJoin(locations, eq(emailLog.senderLocationId, locations.id))
      .orderBy(desc(emailLog.emailDate));
    
    return logs;
  }
}

export const storage = new DatabaseStorage();
