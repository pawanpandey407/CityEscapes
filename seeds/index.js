const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Site = require('../models/site');

mongoose.connect('mongodb://localhost:27017/escape-city', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Connected to the DataBase");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Site.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const site = new Site({
            owner: '5fb83a779bc4962af508b316',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vitae qui reiciendis minima sed autem inventore nemo provident iusto facere iste sunt eveniet ducimus rem ipsum voluptas, labore aspernatur voluptate! Vitae?',
            images: [
                {
                  url: 'https://res.cloudinary.com/dfrg6jez8/image/upload/v1606269032/CityEscapes/iaspmbr8dl0trvwbwsfa.jpg',
                  filename: 'CityEscapes/iaspmbr8dl0trvwbwsfa'
                },
                {
                  url: 'https://res.cloudinary.com/dfrg6jez8/image/upload/v1606269032/CityEscapes/loyh0ydindgqxdlmimsy.jpg',
                  filename: 'CityEscapes/loyh0ydindgqxdlmimsy'
                }
              ],
            geometry: {
                type: 'Point',
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            price
        })
        await site.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});

