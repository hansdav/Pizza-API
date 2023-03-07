import express from "express";
import fs from "fs";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const pizzas = "./pizzas.json";
const allergens = "./allergens.json";
const orders = "./orders.json";

const pizzasJSON = JSON.parse(fs.readFileSync(pizzas));
const allergensJSON = JSON.parse(fs.readFileSync(allergens));
const ordersJSON = JSON.parse(fs.readFileSync(orders));

app.get("/api/pizzas", (req, res) => {
	if (req.query.name) {
		const name = req.query.name;

		console.log(`The requested pizza is: ${name}`);
		res.send(
			pizzasJSON.pizzas.filter((pizza) => pizza.name.toLowerCase() == name)
		);
	} else if (req.query.hasOwnProperty("avoid-allergens")) {
		const avoidAllergensValue = req.query["avoid-allergens"];
		console.log(`You want to avoid allergens: ${avoidAllergensValue}`);
		res.send(
			pizzasJSON.pizzas.filter(
				(pizza) => !pizza.allergens.includes(avoidAllergensValue)
			)
		);
	} else if (req.query.hasOwnProperty("sort-ascending")) {
		res.send(
			pizzasJSON.pizzas.sort(function (a, b) {
				return parseFloat(a.price) - parseFloat(b.price);
			})
		);
	} else if (req.query.hasOwnProperty("sort-descending")) {
		res.send(
			pizzasJSON.pizzas.sort(function (a, b) {
				return parseFloat(b.price) - parseFloat(a.price);
			})
		);
	} else {
		console.log("List of all pizzas");
		res.send(pizzasJSON);
	}
});

app.get("/api/pizzas/:id", (req, res) => {
	let id = req.params.id;
	res.send(pizzasJSON.pizzas.filter((pizza) => pizza.id == id));
});

app.get("/api/allergens", (req, res) => {
	res.send(allergensJSON);
});

app.get("/api/allergens/:letter", (req, res) => {
	let letter = req.params.letter;
	res.send(
		allergensJSON.allergens.filter((allergen) => allergen.letter == letter)
	);
});

app.get("/api/orders", (req, res) => {
	res.send(ordersJSON);
});

app.get("/api/orders/:id", (req, res) => {
	let id = req.params.id;
	res.send(ordersJSON.orders.filter((order) => order.id == id));
});

app.post("/api/orders", (req, res) => {
	let { ...newOrder } = req.body;
	fs.readFile("orders.json", (err, data) => {
		if (err) throw err;

		let newOrders = [...ordersJSON.orders, newOrder];

		ordersJSON.orders = newOrders;

		fs.writeFile("orders.json", JSON.stringify(ordersJSON, null, 2), (err) => {
			if (err) throw err;
			console.log(newOrder);
			console.log("order successful");
			res.send("order successful");
		});
	});
});

app.delete("/api/orders/:id", (req, res) => {
	let idToDelete = req.params.id;

	fs.readFile("orders.json", (err, data) => {
		if (err) throw err;

		let newOrders = ordersJSON.orders.filter((order) => order.id != idToDelete);

		ordersJSON.orders = newOrders;

		fs.writeFile("orders.json", JSON.stringify(ordersJSON, null, 2), (err) => {
			if (err) throw err;

			console.log(`Deleting item no ${idToDelete} successfull`);
			res.send(`Deleting item no ${idToDelete} successfull`);
		});
	});
});

app.patch("/api/orders/:id", (req, res) => {
	let idToChange = req.params.id;
	let { ...patchData } = req.body;

	fs.readFile("orders.json", (err, data) => {
		if (err) throw err;

		let itemToChange = ordersJSON.orders.filter(
			(order) => order.id == idToChange
		);

		console.log(itemToChange[0]);
		console.log(patchData);

		for (let key1 in itemToChange[0]) {
			for (let key2 in patchData) {
				if (key1 == key2) {
					console.log(`${key1} is in both objects!`);
					itemToChange[0][key1] = patchData[key2];

					console.log(itemToChange);
				}
			}
		}

		fs.writeFile("orders.json", JSON.stringify(ordersJSON, null, 2), (err) => {
			if (err) throw err;
			console.log(`Patching item no. ${idToChange} successfull`);
			res.send(`Patching item no. ${idToChange} successfull`);
		});
	});
});

app.put("/api/orders/:id", (req, res) => {
	let idToPut = req.params.id;
	let { ...putData } = req.body;

	fs.readFile("orders.json", (err, data) => {
		if (err) throw err;

		let itemToPut = ordersJSON.orders.findIndex((order) => order.id == idToPut);

		console.log(itemToPut);
		ordersJSON.orders[itemToPut] = putData;
		console.log(ordersJSON);

		fs.writeFile("orders.json", JSON.stringify(ordersJSON, null, 2), (err) => {
			if (err) throw err;
			console.log(`Putting item no. ${idToPut} successfull`);
			res.send(`Putting item no. ${idToPut} successfull`);
		});
	});
});

app.listen(3009);
