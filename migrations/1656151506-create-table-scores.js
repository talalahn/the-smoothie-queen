exports.up = async (sql) => {
  await sql`
		CREATE TABLE scores (
		id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
		score integer NOT NULL UNIQUE,
		timestamp timestamp NOT NULL DEFAULT NOW(),
		user_id integer REFERENCES users (id) ON DELETE CASCADE

);
	`;
};

exports.down = async (sql) => {
  await sql`
		DROP TABLE scores;
	`;
};
