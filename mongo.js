const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("Please provide password");
  process.exit(1);
}

const password = process.argv[2];

const name = process.argv[3];

const number = process.argv[4];

const url = `mongodb+srv://full-stack-open-2022:${password}@cluster0.2rbfa.mongodb.net/fullstackopen?retryWrites=true&w=majority`;

const contactSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Contact = mongoose.model("Contact", contactSchema);

mongoose
  .connect(url)
  .then((result) => {
    if (name === undefined || number === undefined) {
      return Contact.find({}).then((result) => {
        console.log("phonebook:");
        result.forEach((contact) => {
          console.log(contact.name + " " + contact.number);
        });
      });
    } else {
      const contact = new Contact({
        name,
        number,
      });
      return contact.save();
    }
  })
  .then((res) => {
    if (res === undefined) {
      return mongoose.connection.close();
    } else {
      console.log(`added ${res.name} number ${res.number} to phonebook`);
      return mongoose.connection.close();
    }
  })
  .catch((err) => console.log(err));
