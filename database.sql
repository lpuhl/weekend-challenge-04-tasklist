CREATE TABLE tasks (
	id serial primary key,
	description varchar(200) NOT NULL,
	target_date varchar(30) NOT NULL
	);

ALTER TABLE tasks
ADD COLUMN completed
BOOLEAN;

ALTER TABLE tasks
ALTER COLUMN completed
SET DEFAULT FALSE;

ALTER TABLE tasks
DROP COLUMN target_date;
