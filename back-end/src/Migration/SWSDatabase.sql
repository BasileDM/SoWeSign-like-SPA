#------------------------------------------------------------
#        Script MySQL.
#------------------------------------------------------------


#------------------------------------------------------------
# Table: Promotion
#------------------------------------------------------------

CREATE TABLE SWS_PROMOTIONS(
        ID              Int  Auto_increment  NOT NULL ,
        START_DATE      Date NOT NULL ,
        END_DATE        Date NOT NULL ,
        AVAILABLE_SPOTS Int ,
        NAME            Varchar (50) NOT NULL
	,CONSTRAINT AK_SWS_PROMOTIONS UNIQUE (NAME)
	,CONSTRAINT PK_SWS_PROMOTIONS PRIMARY KEY (ID)
)ENGINE=InnoDB;
INSERT INTO SWS_PROMOTIONS(ID, START_DATE, END_DATE, AVAILABLE_SPOTS, NAME) VALUES (1, '2024-01-08', '2024-10-22', 15, 'DWWM3');


#------------------------------------------------------------
# Table: Class
#------------------------------------------------------------

CREATE TABLE SWS_CLASSES(
        ID           Int  Auto_increment  NOT NULL ,
        START_TIME   Date NOT NULL ,
        END_TIME     Date NOT NULL ,
        CODE         Int NOT NULL ,
        ID_PROMOTION Int NOT NULL
	,CONSTRAINT PK_SWS_CLASSES PRIMARY KEY (ID)

	,CONSTRAINT FK_SWS_CLASSES_SWS_PROMOTIONS FOREIGN KEY (ID_PROMOTION) REFERENCES SWS_PROMOTIONS(ID)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: Role
#------------------------------------------------------------

CREATE TABLE SWS_ROLES(
        ID   Int  Auto_increment  NOT NULL ,
        NAME Varchar (50) NOT NULL
	,CONSTRAINT AK_SWS_ROLES UNIQUE (NAME)
	,CONSTRAINT PK_SWS_ROLES PRIMARY KEY (ID)
)ENGINE=InnoDB;
INSERT INTO SWS_ROLES(ID, NAME) VALUES (1, 'apprenant');
INSERT INTO SWS_ROLES(ID, NAME) VALUES (2, 'formateur');


#------------------------------------------------------------
# Table: User
#------------------------------------------------------------

CREATE TABLE SWS_USERS(
        ID         Int  Auto_increment  NOT NULL ,
        FIRST_NAME Varchar (50) NOT NULL ,
        LAST_NAME  Varchar (50) NOT NULL ,
        PASSWORD   Varchar (255) ,
        ACTIVATED  Bool NOT NULL ,
        MAIL       Varchar (80) NOT NULL ,
        ID_ROLE    Int NOT NULL
	,CONSTRAINT AK_SWS_USERS UNIQUE (MAIL)
	,CONSTRAINT PK_SWS_USERS PRIMARY KEY (ID)

	,CONSTRAINT FK_SWS_USERS_SWS_ROLES FOREIGN KEY (ID_ROLE) REFERENCES SWS_ROLES(ID)
)ENGINE=InnoDB;
INSERT INTO SWS_USERS(ID, FIRST_NAME, LAST_NAME, PASSWORD, ACTIVATED, MAIL, ID_ROLE) VALUES (1, 'Form', 'Ateur', 'simplon', 1, 'formateur@simplon.fr', 2);



#------------------------------------------------------------
# Table: SWS_RELATION_USER_PROMOTION
#------------------------------------------------------------

CREATE TABLE SWS_RELATION_USER_PROMOTION(
        ID_PROMOTION    Int NOT NULL ,
        ID_USER         Int NOT NULL
	,CONSTRAINT PK_SWS_RELATION_USER_PROMOTION PRIMARY KEY (ID_PROMOTION,ID_USER)

	,CONSTRAINT FK_SWS_RELATION_USER_PROMOTION_SWS_PROMOTIONS FOREIGN KEY (ID_PROMOTION) REFERENCES SWS_PROMOTIONS(ID)
	,CONSTRAINT FK_SWS_RELATION_USER_PROMOTION_SWS_USERS0 FOREIGN KEY (ID_USER) REFERENCES SWS_USERS(ID)
)ENGINE=InnoDB;
INSERT INTO SWS_RELATION_USER_PROMOTION(ID_PROMOTION, ID_USER) VALUES (1, 1);


#------------------------------------------------------------
# Table: SWS_RELATION_USER_CLASS
#------------------------------------------------------------

CREATE TABLE SWS_RELATION_USER_CLASS(
        ID_CLASS Int NOT NULL ,
        ID_USER  Int NOT NULL ,
        STATUS   Int NOT NULL
	,CONSTRAINT PK_SWS_RELATION_USER_CLASS PRIMARY KEY (ID_CLASS,ID_USER)

	,CONSTRAINT FK_SWS_RELATION_USER_CLASS_SWS_CLASSES FOREIGN KEY (ID_CLASS) REFERENCES SWS_CLASSES(ID)
	,CONSTRAINT FK_SWS_RELATION_USER_CLASS_SWS_USERS0 FOREIGN KEY (ID_USER) REFERENCES SWS_USERS(ID)
)ENGINE=InnoDB;
