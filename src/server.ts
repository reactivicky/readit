import "reflect-metadata";
import { createConnection } from "typeorm";
import { ApolloServer } from "apollo-server-express";
import Express from "express";
import { buildSchema, Query, Resolver } from "type-graphql";
import cors from "cors";

@Resolver()
class HelloResolver {
	@Query(() => String)
	async hello() {
		return "Hello World";
	}
}

const main = async () => {
	await createConnection();

	const schema = await buildSchema({
		resolvers: [HelloResolver],
		emitSchemaFile: true,
	});

	const apolloServer = new ApolloServer({
		schema,
		context: ({ req, res }) => ({ req, res }),
	});

	const app = Express();

	app.use(
		cors({
			credentials: true,
			origin: "http://localhost:3000",
		})
	);

	apolloServer.applyMiddleware({ app });

	app.listen(4000, () => {
		console.log("Server started on http://localhost:4000/graphql");
	});
};
main();
