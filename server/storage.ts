import { 
  locations, personnel, clubMembers, familyMembers, secondaryFamilyMembers, teamFormation, sessions, payments, roles, hobbies, emailLog,
  memberHobby, teamMembers, familyMemberChild,
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
  getClubMembers(): Promise<any[]>;
  getClubMemberById(id: number): Promise<any | undefined>;
  createClubMember(member: InsertClubMember): Promise<ClubMember>;
  updateClubMember(id: number, member: Partial<InsertClubMember>): Promise<ClubMember>;
  deleteClubMember(id: number): Promise<void>;
  getActiveClubMembers(): Promise<any[]>;
  validateUniqueSSN(ssn: string, excludeId?: number): Promise<boolean>;
  validateUniqueMedicare(medicareCard: string, excludeId?: number): Promise<boolean>;
  addMemberHobby(memberId: number, hobbyId: number): Promise<void>;
  removeMemberHobby(memberId: number, hobbyId: number): Promise<void>;
  getMemberHobbies(memberId: number): Promise<Hobby[]>;

  // Family Members
  getFamilyMembers(): Promise<any[]>;
  getFamilyMemberById(id: number): Promise<FamilyMember | undefined>;
  createFamilyMember(member: InsertFamilyMember): Promise<FamilyMember>;
  updateFamilyMember(id: number, member: Partial<InsertFamilyMember>): Promise<FamilyMember>;
  deleteFamilyMember(id: number): Promise<void>;
  createSecondaryFamilyMember(data: any): Promise<any>;
  updateSecondaryFamilyMember(id: number, data: any): Promise<any>;
  deleteSecondaryFamilyMember(id: number): Promise<void>;

  // Team Formations
  getTeamFormations(): Promise<any[]>;
  getTeamFormationById(id: number): Promise<any | undefined>;
  createTeamFormation(team: InsertTeamFormation): Promise<TeamFormation>;
  updateTeamFormation(id: number, team: Partial<InsertTeamFormation>): Promise<TeamFormation>;
  deleteTeamFormation(id: number): Promise<void>;
  addTeamMember(teamId: number, memberId: number, role: string): Promise<void>;
  removeTeamMember(teamId: number, memberId: number): Promise<void>;
  getTeamMembers(teamId: number): Promise<any[]>;
  validateTeamMemberAssignment(memberId: number, sessionDate: string, startTime: string): Promise<boolean>;

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
  async getClubMembers(): Promise<any[]> {
    const members = await db
      .select({
        id: clubMembers.id,
        firstName: clubMembers.firstName,
        lastName: clubMembers.lastName,
        dob: clubMembers.dob,
        height: clubMembers.height,
        weight: clubMembers.weight,
        ssn: clubMembers.ssn,
        medicareCard: clubMembers.medicareCard,
        phone: clubMembers.phone,
        address: clubMembers.address,
        city: clubMembers.city,
        province: clubMembers.province,
        postalCode: clubMembers.postalCode,
        email: clubMembers.email,
        gender: clubMembers.gender,
        status: clubMembers.status,
        joinDate: clubMembers.joinDate,
        locationId: clubMembers.locationId,
        locationName: locations.name
      })
      .from(clubMembers)
      .leftJoin(locations, eq(clubMembers.locationId, locations.id))
      .orderBy(asc(clubMembers.lastName));
    
    // Get hobbies for each member
    for (const member of members) {
      (member as any).hobbies = await this.getMemberHobbies(member.id);
    }
    
    return members;
  }

  async getClubMemberById(id: number): Promise<any | undefined> {
    const [member] = await db
      .select({
        id: clubMembers.id,
        firstName: clubMembers.firstName,
        lastName: clubMembers.lastName,
        dob: clubMembers.dob,
        height: clubMembers.height,
        weight: clubMembers.weight,
        ssn: clubMembers.ssn,
        medicareCard: clubMembers.medicareCard,
        phone: clubMembers.phone,
        address: clubMembers.address,
        city: clubMembers.city,
        province: clubMembers.province,
        postalCode: clubMembers.postalCode,
        email: clubMembers.email,
        gender: clubMembers.gender,
        status: clubMembers.status,
        joinDate: clubMembers.joinDate,
        locationId: clubMembers.locationId,
        locationName: locations.name
      })
      .from(clubMembers)
      .leftJoin(locations, eq(clubMembers.locationId, locations.id))
      .where(eq(clubMembers.id, id));
    
    if (member) {
      (member as any).hobbies = await this.getMemberHobbies(member.id);
    }
    
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

  async getActiveClubMembers(): Promise<any[]> {
    const members = await db
      .select({
        id: clubMembers.id,
        firstName: clubMembers.firstName,
        lastName: clubMembers.lastName,
        dob: clubMembers.dob,
        height: clubMembers.height,
        weight: clubMembers.weight,
        ssn: clubMembers.ssn,
        medicareCard: clubMembers.medicareCard,
        phone: clubMembers.phone,
        address: clubMembers.address,
        city: clubMembers.city,
        province: clubMembers.province,
        postalCode: clubMembers.postalCode,
        email: clubMembers.email,
        gender: clubMembers.gender,
        status: clubMembers.status,
        joinDate: clubMembers.joinDate,
        locationId: clubMembers.locationId,
        locationName: locations.name
      })
      .from(clubMembers)
      .leftJoin(locations, eq(clubMembers.locationId, locations.id))
      .where(eq(clubMembers.status, "Active"))
      .orderBy(asc(clubMembers.lastName));
    
    // Get hobbies for each member
    for (const member of members) {
      (member as any).hobbies = await this.getMemberHobbies(member.id);
    }
    
    return members;
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
  async getFamilyMembers(): Promise<any[]> {
    const families = await db
      .select({
        id: familyMembers.id,
        firstName: familyMembers.firstName,
        lastName: familyMembers.lastName,
        dob: familyMembers.dob,
        ssn: familyMembers.ssn,
        medicareCard: familyMembers.medicareCard,
        phone: familyMembers.phone,
        address: familyMembers.address,
        city: familyMembers.city,
        province: familyMembers.province,
        postalCode: familyMembers.postalCode,
        email: familyMembers.email,
        locationId: familyMembers.locationId,
        locationName: locations.name,
        type: sql`'primary'`.as('type')
      })
      .from(familyMembers)
      .leftJoin(locations, eq(familyMembers.locationId, locations.id))
      .orderBy(asc(familyMembers.lastName));
    
    // Get secondary family members
    const secondaryMembers = await db
      .select({
        id: secondaryFamilyMembers.id,
        firstName: secondaryFamilyMembers.firstName,
        lastName: secondaryFamilyMembers.lastName,
        phone: secondaryFamilyMembers.phone,
        relationship: secondaryFamilyMembers.relationship,
        primaryFamilyId: secondaryFamilyMembers.primaryFamilyId,
        primaryFamilyName: sql`${familyMembers.firstName} || ' ' || ${familyMembers.lastName}`.as('primaryFamilyName'),
        type: sql`'secondary'`.as('type')
      })
      .from(secondaryFamilyMembers)
      .leftJoin(familyMembers, eq(secondaryFamilyMembers.primaryFamilyId, familyMembers.id))
      .orderBy(asc(secondaryFamilyMembers.lastName));
    
    // Get children relationships
    for (const family of families) {
      const children = await db
        .select({
          memberId: familyMemberChild.memberId,
          relationship: familyMemberChild.relationship,
          memberName: sql`${clubMembers.firstName} || ' ' || ${clubMembers.lastName}`.as('memberName')
        })
        .from(familyMemberChild)
        .leftJoin(clubMembers, eq(familyMemberChild.memberId, clubMembers.id))
        .where(eq(familyMemberChild.familyId, family.id));
      
      (family as any).children = children;
    }
    
    return [...families, ...secondaryMembers];
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
  async getTeamFormations(): Promise<any[]> {
    const teams = await db
      .select({
        id: teamFormation.id,
        teamName: teamFormation.teamName,
        headCoachId: teamFormation.headCoachId,
        locationId: teamFormation.locationId,
        startDate: teamFormation.startDate,
        endDate: teamFormation.endDate,
        gender: teamFormation.gender,
        headCoachName: sql`${personnel.firstName} || ' ' || ${personnel.lastName}`.as('headCoachName'),
        locationName: locations.name
      })
      .from(teamFormation)
      .leftJoin(personnel, eq(teamFormation.headCoachId, personnel.id))
      .leftJoin(locations, eq(teamFormation.locationId, locations.id))
      .orderBy(asc(teamFormation.teamName));
    
    // Get team members for each team
    for (const team of teams) {
      (team as any).members = await this.getTeamMembers(team.id);
    }
    
    return teams;
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

  // Member Hobby Management
  async addMemberHobby(memberId: number, hobbyId: number): Promise<void> {
    await db.insert(memberHobby).values({ memberId, hobbyId });
  }

  async removeMemberHobby(memberId: number, hobbyId: number): Promise<void> {
    await db.delete(memberHobby)
      .where(and(eq(memberHobby.memberId, memberId), eq(memberHobby.hobbyId, hobbyId)));
  }

  async getMemberHobbies(memberId: number): Promise<Hobby[]> {
    const result = await db
      .select({
        id: hobbies.id,
        name: hobbies.name
      })
      .from(memberHobby)
      .innerJoin(hobbies, eq(memberHobby.hobbyId, hobbies.id))
      .where(eq(memberHobby.memberId, memberId));
    
    return result;
  }

  // Secondary Family Member Management
  async createSecondaryFamilyMember(data: any): Promise<any> {
    const [newMember] = await db.insert(secondaryFamilyMembers).values(data).returning();
    return newMember;
  }

  async updateSecondaryFamilyMember(id: number, data: any): Promise<any> {
    const [updatedMember] = await db
      .update(secondaryFamilyMembers)
      .set(data)
      .where(eq(secondaryFamilyMembers.id, id))
      .returning();
    return updatedMember;
  }

  async deleteSecondaryFamilyMember(id: number): Promise<void> {
    await db.delete(secondaryFamilyMembers).where(eq(secondaryFamilyMembers.id, id));
  }

  // Team Member Management
  async addTeamMember(teamId: number, memberId: number, role: string): Promise<void> {
    await db.insert(teamMembers).values({ 
      teamId, 
      memberId, 
      role: role as any
    });
  }

  async removeTeamMember(teamId: number, memberId: number): Promise<void> {
    await db.delete(teamMembers)
      .where(and(eq(teamMembers.teamId, teamId), eq(teamMembers.memberId, memberId)));
  }

  async getTeamMembers(teamId: number): Promise<any[]> {
    const result = await db
      .select({
        id: clubMembers.id,
        firstName: clubMembers.firstName,
        lastName: clubMembers.lastName,
        role: teamMembers.role
      })
      .from(teamMembers)
      .innerJoin(clubMembers, eq(teamMembers.memberId, clubMembers.id))
      .where(eq(teamMembers.teamId, teamId));
    
    return result;
  }

  async validateTeamMemberAssignment(memberId: number, sessionDate: string, startTime: string): Promise<boolean> {
    // Check for conflicts - member can't have sessions within 3 hours
    const existingSessions = await db
      .select()
      .from(teamMembers)
      .innerJoin(teamFormation, eq(teamMembers.teamId, teamFormation.id))
      .innerJoin(sessions, sql`${sessions.team1Id} = ${teamFormation.id} OR ${sessions.team2Id} = ${teamFormation.id}`)
      .where(and(
        eq(teamMembers.memberId, memberId),
        eq(sessions.sessionDate, sessionDate)
      ));

    if (existingSessions.length === 0) return true;

    // Check time conflicts (3+ hour difference required)
    const newSessionTime = new Date(`${sessionDate} ${startTime}`);
    
    for (const existing of existingSessions) {
      const existingTime = new Date(`${sessionDate} ${existing.sessions.startTime}`);
      const timeDiff = Math.abs(newSessionTime.getTime() - existingTime.getTime());
      const hoursDiff = timeDiff / (1000 * 60 * 60);
      
      if (hoursDiff < 3) {
        return false; // Conflict found
      }
    }
    
    return true;
  }
}

export const storage = new DatabaseStorage();
