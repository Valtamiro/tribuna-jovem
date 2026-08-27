CREATE TABLE `editions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(220) NOT NULL,
	`issueLabel` varchar(100) NOT NULL,
	`description` text NOT NULL,
	`documentUrl` text,
	`coverUrl` text,
	`published` boolean NOT NULL DEFAULT false,
	`publishedAt` timestamp,
	`createdBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `editions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `interviews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(220) NOT NULL,
	`interviewee` varchar(180) NOT NULL,
	`presenter` varchar(180) NOT NULL,
	`description` text NOT NULL,
	`transcript` text,
	`videoUrl` text,
	`coverUrl` text,
	`published` boolean NOT NULL DEFAULT false,
	`publishedAt` timestamp,
	`createdBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `interviews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `mediaItems` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(220) NOT NULL,
	`description` text,
	`assetType` enum('image','document') NOT NULL,
	`url` text NOT NULL,
	`storageKey` varchar(512),
	`mimeType` varchar(120),
	`published` boolean NOT NULL DEFAULT false,
	`createdBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `mediaItems_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `stories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`editionId` int,
	`title` varchar(220) NOT NULL,
	`summary` text NOT NULL,
	`body` text NOT NULL,
	`authorName` varchar(160) NOT NULL,
	`category` varchar(80) NOT NULL,
	`coverUrl` text,
	`published` boolean NOT NULL DEFAULT false,
	`publishedAt` timestamp,
	`createdBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `stories_id` PRIMARY KEY(`id`)
);
