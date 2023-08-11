import AppDataSource from "./../ormconfig";
import app from "./index.app";
AppDataSource.initialize()
	.then(async () => {
		console.log("Connect DB successfully");
		app.listen(2901, () => {
			console.log("App listening on port 2901!");
		});
	})
	.catch((error) => console.error(error));
