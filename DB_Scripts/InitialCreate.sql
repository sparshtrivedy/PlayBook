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

