CREATE TABLE Users (
	uid UUID,
	firstname VARCHAR(20),
	lastname VARCHAR(20),
	email VARCHAR(50),
	password VARCHAR(20),
	role VARCHAR(50),
  	PRIMARY KEY(uid)
);


CREATE TABLE TeamManaged (
	tid UUID,
	uid UUID UNIQUE NOT NULL,
	name VARCHAR(20),
	winrate INTEGER,
	city VARCHAR(20),
	PRIMARY KEY(tid),
	FOREIGN KEY(uid) REFERENCES Users ON DELETE CASCADE
);

CREATE TABLE CoachSalary (
	type VARCHAR(20),
	specialization VARCHAR(20),
	salary MONEY,
	PRIMARY KEY(type, specialization)
);

CREATE TABLE PlayersContract (
	yrs_of_exp INTEGER,
	status VARCHAR(20),
	contract MONEY,
	PRIMARY KEY(yrs_of_exp, status)
);

CREATE TABLE Attendee (
	aid UUID,
	firstname VARCHAR(20),
	lastname VARCHAR(20),
	email VARCHAR(50),
 	PRIMARY KEY(aid)
);

CREATE TABLE SponsorVenueContribution (
	contribution MONEY,
	status VARCHAR(20),
	PRIMARY KEY(contribution)
);

CREATE TABLE VenuePostalCode (
	postalCode VARCHAR(20),
	city VARCHAR(20),
	province VARCHAR(20),
	PRIMARY KEY(postalCode)
);

CREATE TABLE Sponsor (
	sid UUID,
	name VARCHAR(20),
	PRIMARY KEY(sid)
);

CREATE TABLE Venue (
	vid UUID,
	name VARCHAR(20),
	capacity INTEGER,
	postalCode VARCHAR(20),
	PRIMARY KEY(vid),
	FOREIGN KEY(postalCode) REFERENCES VenuePostalCode
);

CREATE TABLE SponsorVenue (
  	vid UUID,
	sid UUID,
	contribution MONEY,
	PRIMARY KEY(sid, vid),
	FOREIGN KEY(sid) REFERENCES Sponsor,
	FOREIGN KEY(vid) REFERENCES Venue ON DELETE CASCADE,
	FOREIGN KEY(contribution) REFERENCES SponsorVenueContribution
);

CREATE TABLE Game (
	gid UUID,
	vid UUID NOT NULL,
	home_tid UUID NOT NULL,
	away_tid UUID NOT NULL,
	uid UUID NOT NULL,
	date DATE UNIQUE,
	start_time TIME,
	end_time TIME,
	sport VARCHAR(20),
	PRIMARY KEY(gid),
	FOREIGN KEY(vid) REFERENCES Venue ON DELETE CASCADE,
	FOREIGN KEY(home_tid) REFERENCES TeamManaged ON DELETE CASCADE,
	FOREIGN KEY(away_tid) REFERENCES TeamManaged ON DELETE CASCADE,
	FOREIGN KEY(uid) REFERENCES Users ON DELETE CASCADE
);

CREATE TABLE Ticket (
	seat_num INTEGER,
	gid UUID NOT NULL,
	aid UUID,
	price MONEY,
  	status VARCHAR(20),
	PRIMARY KEY(seat_num, gid),
	FOREIGN KEY(gid) REFERENCES Game ON DELETE CASCADE,
	FOREIGN KEY(aid) REFERENCES Attendee
);

CREATE TABLE SportsPeople (
	pid UUID,
  	tid UUID NOT NULL,
	firstname VARCHAR(20),
	lastname VARCHAR(20),
	PRIMARY KEY(pid),
	FOREIGN KEY(tid) REFERENCES TeamManaged ON DELETE CASCADE
);

CREATE TABLE Players (
	pid UUID,
  	status VARCHAR(20),
	yrs_of_exp INTEGER,
	jersey_num INTEGER,
	position VARCHAR(20),
	PRIMARY KEY(pid),
	FOREIGN KEY(pid) REFERENCES SportsPeople ON DELETE CASCADE,
  	FOREIGN KEY(status, yrs_of_exp) REFERENCES PlayersContract(status, yrs_of_exp)
);

CREATE TABLE Coach (
	pid UUID,
  	type VARCHAR(20),
	specialization VARCHAR(20),
	PRIMARY KEY(pid),
	FOREIGN KEY(pid) REFERENCES SportsPeople ON DELETE CASCADE,
  	FOREIGN KEY(type, specialization) REFERENCES CoachSalary(type, specialization)
);

INSERT INTO Users VALUES ('25fcbd6e-335f-45d7-a1e0-71e82a9e862a', 'Sparsh', 'Trivedy', 'test-manager@test.com', 'secret', 'test-manager');
INSERT INTO Users VALUES ('7b7aca18-44f5-483d-b4ce-74e55066c0ef', 'Test', 'Manager1', 'test-manager1@test.com', 'secret', 'test-manager1');
INSERT INTO Users VALUES ('1e59d23f-4cff-422e-9395-ed3a3069bfef', 'Test', 'Manager2', 'test-manager2@test.com', 'secret', 'test-manager2');
INSERT INTO Users VALUES ('16e74722-8f44-4604-8074-48027518b075', 'Test', 'Manager3', 'test-manager3@test.com', 'secret!', 'test-manager3');
INSERT INTO Users VALUES ('d0ff4656-8251-41cd-92e2-04631c2e049c', 'Test', 'Manager4', 'test-manager4@test.com', 'Secret', 'test-manager4');
INSERT INTO Users VALUES ('f08f1056-105b-4920-a475-116856ea2685', 'Test', 'Admin1', 'test-admin1@test.com', 'secret', 'test-admin1');
INSERT INTO Users VALUES ('fdc23d35-ccc9-4113-908e-ec3da4a86535', 'Test', 'Admin2', 'test-admin2@test.com', 'secret', 'test-admin2');
INSERT INTO Users VALUES ('0c93df44-34fc-4774-a69c-c703a8a536a3', 'Sparsh', 'Trivedy', 'test-admin@test.com', 'secret', 'test-admin');
INSERT INTO TeamManaged VALUES ('d312f5fa-297e-4fe1-be3e-b1ed8d867f03', '7b7aca18-44f5-483d-b4ce-74e55066c0ef', 'Team1', 45, 'Vancouver');
INSERT INTO TeamManaged VALUES ('1a7454f5-0c02-46f1-af5b-bddb92af960c', '25fcbd6e-335f-45d7-a1e0-71e82a9e862a', 'Team2', 50, 'Vancouver');
INSERT INTO TeamManaged VALUES ('edd52c6d-176e-4c4e-9dd0-3e34ca0f0fd6', '1e59d23f-4cff-422e-9395-ed3a3069bfef', 'Team3', 40, 'Vancouver');
INSERT INTO TeamManaged VALUES ('34560299-5659-44d7-930b-d147b37ef0f2', '16e74722-8f44-4604-8074-48027518b075', 'Team4', 51, 'Toronto');
INSERT INTO TeamManaged VALUES ('2d474aac-5fb5-49d5-839e-177c1d0c590c', 'd0ff4656-8251-41cd-92e2-04631c2e049c', 'Team5', 52, 'Boston');
INSERT INTO CoachSalary VALUES('Head Coach','Offense', 300000);
INSERT INTO CoachSalary VALUES('Assistant Coach','Offense', 200000);
INSERT INTO CoachSalary VALUES('Head Coach','Defense', 250000);
INSERT INTO CoachSalary VALUES('Assistant Coach','Defense', 150000);
INSERT INTO CoachSalary VALUES('Head Coach','Mixed', 275000);
INSERT INTO PlayersContract VALUES(2,'Rookie', 200000);
INSERT INTO PlayersContract VALUES(1,'Rookie', 180000);
INSERT INTO PlayersContract VALUES(3,'Rookie', 220000);
INSERT INTO PlayersContract VALUES(5,'All-Star', 600000);
INSERT INTO PlayersContract VALUES(8,'Seasoned', 475000);
INSERT INTO Attendee VALUES('c1919c93-b81c-4baa-b04d-7fa114955881','Brock', 'Jones', 'Brock@testmail.com');
INSERT INTO Attendee VALUES('d2796800-932c-416f-b537-19d5c764c4de','Turner', 'Fring', 'TF@testmail.com');
INSERT INTO Attendee VALUES('61b4663b-3ea9-417a-9ec5-30eeb185384c','Leonard', 'Sturn', 'Leo@testmail.com');
INSERT INTO Attendee VALUES('7fe4eb9d-b0a3-4c09-9b7d-9a19c16e3a71','Mary', 'Jane', 'Jane@testmail.com');
INSERT INTO Attendee VALUES('b28739b1-cf76-41a8-b37f-18e3c67c1528','Sally', 'Sue', 'Sally@testmail.com');
INSERT INTO SponsorVenueContribution VALUES(50000000, 'Diamond');
INSERT INTO SponsorVenueContribution VALUES(10000000, 'Platinum');
INSERT INTO SponsorVenueContribution VALUES(5000000, 'Gold');
INSERT INTO SponsorVenueContribution VALUES(1000000, 'Silver');
INSERT INTO SponsorVenueContribution VALUES(500000, 'Bronze');
INSERT INTO VenuePostalCode VALUES ('E4R T73', 'Vancouver', 'British Columbia');
INSERT INTO VenuePostalCode VALUES ('H2R J53', 'Toronto', 'Ontario');
INSERT INTO VenuePostalCode VALUES ('J12 P25', 'Calgary', 'Alberta');
INSERT INTO VenuePostalCode VALUES ('R12 J45', 'Montreal', 'Quebec');
INSERT INTO VenuePostalCode VALUES ('L3K J31', 'Regina', 'saskatchewan');
INSERT INTO Sponsor VALUES ('1f0d570b-f335-4a0a-80a4-1970c790925b', 'Coca-Cola');
INSERT INTO Sponsor VALUES ('196aff35-0b03-4e5b-b24e-437e2ea54241', 'Pepsi');
INSERT INTO Sponsor VALUES ('eb74d777-b3ed-4f37-b6aa-ae3173811c5b', 'Rogers');
INSERT INTO Sponsor VALUES ('3e3d55b0-335c-47a3-a549-4d203973cf68', 'Walmart');
INSERT INTO Sponsor VALUES ('76834cb9-85a2-4b53-b08b-e51a5e9fa787', 'Nike');
INSERT INTO Venue VALUES ('ae234887-6a14-4781-8b08-5e06b36ebd4f', 'Arena1', 500, 'H2R J53');
INSERT INTO Venue VALUES ('60b5ead8-488f-4fa9-be1e-59748b0ba903', 'Rogers Arena', 19700, 'E4R T73');
INSERT INTO Venue VALUES ('bcc2eb36-8b56-428a-8418-e4cb69a26cb3', 'Medium Arena', 1000, 'J12 P25');
INSERT INTO Venue VALUES ('f07170cc-2e7a-4352-a8d2-ea485cea1a11', 'Small Arena', 200, 'R12 J45');
INSERT INTO Venue VALUES ('a9931a3f-1b49-4ade-9e0a-cee046daea09', 'Giant Arena', 30000, 'L3K J31');
INSERT INTO SponsorVenue VALUES ('ae234887-6a14-4781-8b08-5e06b36ebd4f','1f0d570b-f335-4a0a-80a4-1970c790925b',  500000);
INSERT INTO SponsorVenue VALUES ('60b5ead8-488f-4fa9-be1e-59748b0ba903','eb74d777-b3ed-4f37-b6aa-ae3173811c5b',  500000);
INSERT INTO SponsorVenue VALUES ('ae234887-6a14-4781-8b08-5e06b36ebd4f','196aff35-0b03-4e5b-b24e-437e2ea54241',  1000000);
INSERT INTO SponsorVenue VALUES ('bcc2eb36-8b56-428a-8418-e4cb69a26cb3', '3e3d55b0-335c-47a3-a549-4d203973cf68',  5000000);
INSERT INTO SponsorVenue VALUES ('ae234887-6a14-4781-8b08-5e06b36ebd4f', '76834cb9-85a2-4b53-b08b-e51a5e9fa787',  10000000);
INSERT INTO Game VALUES ('7c5de3d5-96b7-42f1-9b9e-e3950f88d775', 'ae234887-6a14-4781-8b08-5e06b36ebd4f', 
                         'd312f5fa-297e-4fe1-be3e-b1ed8d867f03', '1a7454f5-0c02-46f1-af5b-bddb92af960c',
                         'f08f1056-105b-4920-a475-116856ea2685', '2021-07-28', '09:00:00' , '12:00:00', 'basketball');
INSERT INTO Game VALUES ('bed38a51-0c9c-4a61-9756-164670e9b795', 'ae234887-6a14-4781-8b08-5e06b36ebd4f', 
                         'edd52c6d-176e-4c4e-9dd0-3e34ca0f0fd6', '1a7454f5-0c02-46f1-af5b-bddb92af960c',
                         'fdc23d35-ccc9-4113-908e-ec3da4a86535', '2021-07-27', '15:00:00' , '18:00:00', 'basketball');
INSERT INTO Game VALUES ('3e9c5dd0-b7ba-48cc-bb49-e4a50f357c59', '60b5ead8-488f-4fa9-be1e-59748b0ba903', 
                         'edd52c6d-176e-4c4e-9dd0-3e34ca0f0fd6', 'd312f5fa-297e-4fe1-be3e-b1ed8d867f03',
                         'fdc23d35-ccc9-4113-908e-ec3da4a86535', '2021-08-27', '15:00:00' , '18:00:00', 'basketball');
INSERT INTO Game VALUES ('592acfc3-bbff-41f1-b49c-22ad69b78ab0', '60b5ead8-488f-4fa9-be1e-59748b0ba903', 
                         '34560299-5659-44d7-930b-d147b37ef0f2', '2d474aac-5fb5-49d5-839e-177c1d0c590c',
                         '0c93df44-34fc-4774-a69c-c703a8a536a3', '2022-08-27', '18:00:00' , '21:00:00', 'soccer');
INSERT INTO Game VALUES ('007ce972-fbc9-4c11-8585-75131d73863f', 'bcc2eb36-8b56-428a-8418-e4cb69a26cb3', 
                         '34560299-5659-44d7-930b-d147b37ef0f2', '2d474aac-5fb5-49d5-839e-177c1d0c590c',
                         '0c93df44-34fc-4774-a69c-c703a8a536a3', '2023-08-27', '18:00:00' , '21:00:00', 'soccer');
INSERT INTO Ticket VALUES (2, '7c5de3d5-96b7-42f1-9b9e-e3950f88d775', 'c1919c93-b81c-4baa-b04d-7fa114955881', 100, 'Regular');
INSERT INTO Ticket VALUES (3, '7c5de3d5-96b7-42f1-9b9e-e3950f88d775', 'c1919c93-b81c-4baa-b04d-7fa114955881', 100, 'VIP');
INSERT INTO Ticket VALUES (60, '3e9c5dd0-b7ba-48cc-bb49-e4a50f357c59', 'b28739b1-cf76-41a8-b37f-18e3c67c1528', 1000, 'VIP');
INSERT INTO Ticket VALUES (31, '007ce972-fbc9-4c11-8585-75131d73863f', 'b28739b1-cf76-41a8-b37f-18e3c67c1528', 250, 'VIP');
INSERT INTO Ticket VALUES (22, '3e9c5dd0-b7ba-48cc-bb49-e4a50f357c59', '61b4663b-3ea9-417a-9ec5-30eeb185384c', 120, 'Regular');
INSERT INTO SportsPeople VALUES ('ca41def7-5b2e-4851-a1a8-f183f0e60ebe', 'd312f5fa-297e-4fe1-be3e-b1ed8d867f03', 'Joe', 'Smith');
INSERT INTO SportsPeople VALUES ('df087177-7b54-4339-b210-16d13d17aa69', '1a7454f5-0c02-46f1-af5b-bddb92af960c', 'Tom', 'Arby');
INSERT INTO SportsPeople VALUES ('692ff124-f0e7-4910-ba7a-144172eb0bd7', 'edd52c6d-176e-4c4e-9dd0-3e34ca0f0fd6', 'Joanna', 'Scone');
INSERT INTO SportsPeople VALUES ('5db0a37b-bbd9-472c-8c2b-bc6223cc6e7d', '34560299-5659-44d7-930b-d147b37ef0f2', 'Tim', 'Caswell');
INSERT INTO SportsPeople VALUES ('fd8a6b1e-3764-4665-ba98-858283baf2a2', '2d474aac-5fb5-49d5-839e-177c1d0c590c', 'Jerry', 'Jones');
INSERT INTO SportsPeople VALUES ('fd83c16a-c89c-4309-a3af-b8d1d066f02c', 'd312f5fa-297e-4fe1-be3e-b1ed8d867f03', 'Jay', 'Smith');
INSERT INTO SportsPeople VALUES ('bf0af4a5-423e-4308-8768-1b114f17db55', '1a7454f5-0c02-46f1-af5b-bddb92af960c', 'Tommy', 'Arby');
INSERT INTO SportsPeople VALUES ('2e5dc79a-c1ba-49fa-8b5e-acc5d58562c2', 'edd52c6d-176e-4c4e-9dd0-3e34ca0f0fd6', 'Jhon', 'Scone');
INSERT INTO SportsPeople VALUES ('7698d47b-b181-4d6e-81c1-e6dbf1be71e7', '34560299-5659-44d7-930b-d147b37ef0f2', 'Timothy', 'Caswell');
INSERT INTO SportsPeople VALUES ('3d356b5a-a524-4aab-9fe2-e5adcce16da7', '2d474aac-5fb5-49d5-839e-177c1d0c590c', 'AJ', 'Jones');
INSERT INTO Players VALUES('ca41def7-5b2e-4851-a1a8-f183f0e60ebe', 'Rookie', 2, 31, 'Point Guard');
INSERT INTO Players VALUES('df087177-7b54-4339-b210-16d13d17aa69', 'Rookie', 3, 32, 'Small Forward');
INSERT INTO Players VALUES('692ff124-f0e7-4910-ba7a-144172eb0bd7', 'All-Star', 5, 32, 'Small Forward');
INSERT INTO Players VALUES('5db0a37b-bbd9-472c-8c2b-bc6223cc6e7d', 'Seasoned', 8, 32, 'GoalKeeper');
INSERT INTO Players VALUES('fd8a6b1e-3764-4665-ba98-858283baf2a2', 'Rookie', 1, 32, 'Right Full-Back');
INSERT INTO Coach VALUES('fd83c16a-c89c-4309-a3af-b8d1d066f02c', 'Head Coach', 'Offense');
INSERT INTO Coach VALUES('bf0af4a5-423e-4308-8768-1b114f17db55', 'Assistant Coach', 'Offense');  
INSERT INTO Coach VALUES('2e5dc79a-c1ba-49fa-8b5e-acc5d58562c2', 'Head Coach', 'Defense');
INSERT INTO Coach VALUES('7698d47b-b181-4d6e-81c1-e6dbf1be71e7', 'Assistant Coach', 'Defense');
INSERT INTO Coach VALUES('3d356b5a-a524-4aab-9fe2-e5adcce16da7', 'Head Coach', 'Mixed'); 

