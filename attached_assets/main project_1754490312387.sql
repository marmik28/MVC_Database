CREATE TABLE Roles (
    RoleID INT AUTO_INCREMENT PRIMARY KEY,
    RoleName VARCHAR(50) NOT NULL
);

CREATE TABLE Locations (
    LocationID INT AUTO_INCREMENT PRIMARY KEY,
    Type ENUM('Head', 'Branch') NOT NULL,
    Name VARCHAR(100) NOT NULL,
    Address VARCHAR(255),
    City VARCHAR(100),
    Province VARCHAR(50),
    PostalCode VARCHAR(20),
    Phone VARCHAR(20),
    WebAddress VARCHAR(100),
    Capacity INT
);

CREATE TABLE Hobbies (
    HobbyID INT AUTO_INCREMENT PRIMARY KEY,
    HobbyName VARCHAR(100) NOT NULL
);

CREATE TABLE Personnel (
    PersonnelID INT AUTO_INCREMENT PRIMARY KEY,
    FirstName VARCHAR(50),
    LastName VARCHAR(50),
    DOB DATE,
    SSN VARCHAR(20) UNIQUE NOT NULL,
    MedicareCard VARCHAR(20) UNIQUE NOT NULL,
    Phone VARCHAR(20),
    Address VARCHAR(255),
    City VARCHAR(100),
    Province VARCHAR(50),
    PostalCode VARCHAR(20),
    Email VARCHAR(100),
    RoleID INT,
    Mandate ENUM('Salaried', 'Volunteer'),
    FOREIGN KEY (RoleID) REFERENCES Roles(RoleID)
);

CREATE TABLE Personnel_Location_History (
    HistoryID INT AUTO_INCREMENT PRIMARY KEY,
    PersonnelID INT,
    LocationID INT,
    StartDate DATE,
    EndDate DATE,
    FOREIGN KEY (PersonnelID) REFERENCES Personnel(PersonnelID),
    FOREIGN KEY (LocationID) REFERENCES Locations(LocationID)
);

CREATE TABLE FamilyMembers (
    FamilyID INT AUTO_INCREMENT PRIMARY KEY,
    FirstName VARCHAR(50),
    LastName VARCHAR(50),
    DOB DATE,
    SSN VARCHAR(20) UNIQUE NOT NULL,
    MedicareCard VARCHAR(20) UNIQUE NOT NULL,
    Phone VARCHAR(20),
    Address VARCHAR(255),
    City VARCHAR(100),
    Province VARCHAR(50),
    PostalCode VARCHAR(20),
    Email VARCHAR(100),
    LocationID INT,
    FOREIGN KEY (LocationID) REFERENCES Locations(LocationID)
);

CREATE TABLE SecondaryFamilyMembers (
    SecondaryID INT AUTO_INCREMENT PRIMARY KEY,
    PrimaryFamilyID INT,
    FirstName VARCHAR(50),
    LastName VARCHAR(50),
    Phone VARCHAR(20),
    Relationship ENUM('Father', 'Mother', 'Grandfather', 'Grandmother', 'Tutor', 'Partner', 'Friend', 'Other'),
    FOREIGN KEY (PrimaryFamilyID) REFERENCES FamilyMembers(FamilyID)
);

CREATE TABLE ClubMembers (
    MemberID INT AUTO_INCREMENT PRIMARY KEY,
    FirstName VARCHAR(50),
    LastName VARCHAR(50),
    DOB DATE,
    Height DECIMAL(5,2),
    Weight DECIMAL(5,2),
    SSN VARCHAR(20) UNIQUE NOT NULL,
    MedicareCard VARCHAR(20) UNIQUE NOT NULL,
    Phone VARCHAR(20),
    Address VARCHAR(255),
    City VARCHAR(100),
    Province VARCHAR(50),
    PostalCode VARCHAR(20),
    Email VARCHAR(100),
    Gender ENUM('Male', 'Female'),
    Status ENUM('Active', 'Inactive'),
    JoinDate DATE,
    LocationID INT,
    FOREIGN KEY (LocationID) REFERENCES Locations(LocationID)
);

CREATE TABLE FamilyMember_Child (
    FamilyID INT,
    MemberID INT,
    Relationship ENUM('Father', 'Mother', 'Grandfather', 'Grandmother', 'Tutor', 'Partner', 'Friend', 'Other'),
    PRIMARY KEY (FamilyID, MemberID),
    FOREIGN KEY (FamilyID) REFERENCES FamilyMembers(FamilyID),
    FOREIGN KEY (MemberID) REFERENCES ClubMembers(MemberID)
);

CREATE TABLE Member_Hobby (
    MemberID INT,
    HobbyID INT,
    PRIMARY KEY (MemberID, HobbyID),
    FOREIGN KEY (MemberID) REFERENCES ClubMembers(MemberID),
    FOREIGN KEY (HobbyID) REFERENCES Hobbies(HobbyID)
);

CREATE TABLE Payments (
    PaymentID INT AUTO_INCREMENT PRIMARY KEY,
    MemberID INT,
    PaymentDate DATE,
    Amount DECIMAL(10,2),
    Method ENUM('Cash', 'Credit', 'Debit'),
    MembershipYear YEAR,
    IsDonation BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (MemberID) REFERENCES ClubMembers(MemberID)
);

CREATE TABLE TeamFormation (
    TeamID INT AUTO_INCREMENT PRIMARY KEY,
    TeamName VARCHAR(100),
    HeadCoachID INT,
    LocationID INT,
    StartDate DATE,
    EndDate DATE,
    Gender ENUM('Male', 'Female'),
    FOREIGN KEY (HeadCoachID) REFERENCES Personnel(PersonnelID),
    FOREIGN KEY (LocationID) REFERENCES Locations(LocationID)
);

CREATE TABLE Sessions (
    SessionID INT AUTO_INCREMENT PRIMARY KEY,
    Team1ID INT,
    Team2ID INT,
    LocationID INT,
    SessionDate DATE,
    StartTime TIME,
    SessionType ENUM('Training', 'Game'),
    Address VARCHAR(255),
    ScoreTeam1 INT,
    ScoreTeam2 INT,
    FOREIGN KEY (Team1ID) REFERENCES TeamFormation(TeamID),
    FOREIGN KEY (Team2ID) REFERENCES TeamFormation(TeamID),
    FOREIGN KEY (LocationID) REFERENCES Locations(LocationID)
);

CREATE TABLE Team_Assignment (
    AssignmentID INT AUTO_INCREMENT PRIMARY KEY,
    MemberID INT,
    TeamID INT,
    SessionID INT,
    Role ENUM('Setter', 'Hitter', 'Blocker', 'Libero', 'Captain', 'Other'),
    StartTime TIME,
    FOREIGN KEY (MemberID) REFERENCES ClubMembers(MemberID),
    FOREIGN KEY (TeamID) REFERENCES TeamFormation(TeamID),
    FOREIGN KEY (SessionID) REFERENCES Sessions(SessionID)
);

CREATE TABLE Team_Members (
    TeamID INT,
    MemberID INT,
    Role ENUM('Setter', 'Hitter', 'Blocker', 'Libero', 'Captain', 'Other'),
    PRIMARY KEY (TeamID, MemberID),
    FOREIGN KEY (TeamID) REFERENCES TeamFormation(TeamID),
    FOREIGN KEY (MemberID) REFERENCES ClubMembers(MemberID)
);

CREATE TABLE ClubMember_Location_History (
    HistoryID INT AUTO_INCREMENT PRIMARY KEY,
    MemberID INT,
    LocationID INT,
    StartDate DATE,
    EndDate DATE,
    FOREIGN KEY (MemberID) REFERENCES ClubMembers(MemberID),
    FOREIGN KEY (LocationID) REFERENCES Locations(LocationID)
);

CREATE TABLE EmailLog (
    LogID INT AUTO_INCREMENT PRIMARY KEY,
    EmailDate DATETIME,
    SenderLocationID INT,
    ReceiverEmail VARCHAR(100),
    Subject VARCHAR(255),
    BodySnippet VARCHAR(100),
    FOREIGN KEY (SenderLocationID) REFERENCES Locations(LocationID)
);
