const products = [
  {
    _id: "1",
    name: "All veggies",
    image: "/images/allveggies.png",
    description:
    "Looking for a pizza that's packed with fresh, flavorful veggies? Look no further than our All Veggies pizza! Made with juicy tomatoes, fragrant garlic, savory onions, zesty black olives, and crisp bell peppers, this pizza is a delicious celebration of all things veggie. Topped with a generous helping of melted mozzarella cheese, every bite is a delightful explosion of flavors and textures that will leave you feeling satisfied and nourished. Whether you're a vegetarian or simply looking for a healthy, flavorful meal, our All Veggies pizza is the perfect choice for you. So why wait? Order now and treat your taste buds to a delicious and nutritious pizza experience!",
    price: 230,
    countInStock: 10,
    rating: 5,
    numReviews: 5,
  },
  {
    _id: "2",
    name: "Angeles Ultimate Cheeze",
    image: "/images/angelesultimatecheeze.png",
    description:
    "Get ready to indulge in a pizza that's bursting with cheesy goodness - Angeles Ultimate Cheese! Made with a mouthwatering blend of mozzarella cheese, creamy cream cheese, tangy regular cheese, and sharp parmesan cheese, this pizza is a true cheese lover's dream come true. Every bite is a decadent explosion of melty, gooey cheese, with each variety contributing its own unique flavor and texture to the mix. Whether you're a die-hard cheese enthusiast or simply looking for a pizza that's guaranteed to satisfy your cravings, Angeles Ultimate Cheese is the perfect choice for you. So why wait? Order now and experience the ultimate in cheesy deliciousness!",
    price: 380,
    countInStock: 10,
    rating: 5,
    numReviews: 5,
  },
  {
    _id: "3",
    name: "Beef and Mushroom",
    image: "/images/beefandmushroom.png",
    description:
    "Get ready to sink your teeth into a pizza that's loaded with savory goodness! Introducing our mouthwatering Beef and Mushroom pizza, topped with tender strips of beef and earthy mushrooms, all nestled under a blanket of melted mozzarella cheese. Every bite is a delightful explosion of flavors and textures, from the juicy beef to the chewy mushrooms and creamy cheese. Whether you're in the mood for a hearty dinner or just a satisfying snack, this pizza is the perfect choice. So why wait? Order now and experience the irresistible deliciousness of our Beef and Mushroom pizza for yourself!",
    price: 190,
    countInStock: 10,
    rating: 5,
    numReviews: 5,
  },
  {
    _id: "4",
    name: "Giean's Cheesy Chiz",
    image: "/images/cheesycheese.png",
    description:
    "Get ready to indulge in a cheese lover's dream with Giean's Cheesy Chiz pizza! This scrumptious pizza is loaded with not one, but two kinds of cheese - creamy mozzarella cheese and tangy cheddar cheese. Every bite is a symphony of flavors and textures that will leave you wanting more. Whether you're a die-hard cheese fan or simply looking for a pizza that's packed with flavor, Giean's Cheesy Chiz is the perfect choice for you. So why settle for an ordinary pizza when you can have one that's bursting with cheesy goodness? Order now and experience the cheesy bliss for yourself!",
    price: 190,
    countInStock: 10,
    rating: 5,
    numReviews: 5,
  },
  {
    _id: "5",
    name: "Ding's Dynamite Pizza",
    image: "/images/dingsdynamite.png",
    description:
    "Looking for a pizza that's guaranteed to pack a punch? Try Ding's Dynamite Pizza! Made with fiery finger chilies and savory marinated ground pork, all topped with a generous helping of melted mozzarella cheese, this pizza is a true explosion of flavor. Every bite is a deliciously spicy combination of tender pork and zesty chilies, with the gooey melted cheese adding a satisfying creaminess to each mouthwatering bite. Whether you're a fan of bold flavors or simply looking for a pizza that's guaranteed to satisfy your cravings, Ding's Dynamite Pizza is the perfect choice for you. So why wait? Order now and get ready to feel the heat!",
    price: 230,
    countInStock: 10,
    rating: 5,
    numReviews: 5,
  },
  {
    _id: "6",
    name: "Eigan's Peppaoni",
    image: "/images/eiganspeppaoni.png",
    description:
    "Looking for a pizza that's packed with flavor and sure to satisfy your cravings? Look no further than Eigan's Peppaoni! Made with only the freshest, highest-quality ingredients, this delicious pizza is topped with gooey, melted mozzarella cheese and savory pepperoni, making it the perfect choice for any pizza lover. With its bold flavors and irresistible aroma, Eigan's Peppaoni is sure to become your new go-to pizza choice. So why wait? Order now and experience the mouthwatering deliciousness for yourself!",
    price: 190,
    countInStock: 10,
    rating: 5,
    numReviews: 5,
  },
  {
    _id: "7",
    name: "Eilsel's Meaty Pizza",
    image: "/images/eilselsmeatypizza.png",
    description:
    "Looking for a pizza that's packed with meaty goodness? Look no further than Eilsel Meety Pizza! This hearty pizza is loaded with all your favorite meats - from savory pepperoni and juicy ham to crispy bacon and flavorful burger meat - all piled high on a bed of melted mozzarella cheese. Every bite is a carnivorous delight, with a symphony of bold flavors and satisfying textures that will leave you feeling full and satisfied. Whether you're a meat lover or simply looking for a pizza that's packed with protein, Eilsel Meety Pizza is the perfect choice for you. So why wait? Order now and sink your teeth into this meaty masterpiece!",
    price: 230,
    countInStock: 10,
    rating: 5,
    numReviews: 5,
  },
  {
    _id: "8",
    name: "Geline's Kawaii",
    image: "/images/gelineskawaii.png",
    description:
    "Are you ready to taste a little bit of paradise on your pizza? Look no further than Geline's Kawaii pizza! This delectable pizza is the perfect combination of sweet and savory, with succulent ham and juicy pineapple resting atop a bed of melted mozzarella cheese. Every bite is a tropical escape that will transport you to a sunny beach with each delicious taste. Whether you're craving a bit of the islands or simply looking for a pizza that's packed with flavor, Geline's Kawaii is the perfect choice for you. So why wait? Order now and experience the tropical bliss for yourself!",
    price: 190,
    countInStock: 10,
    rating: 5,
    numReviews: 5,
  },
  {
    _id: "9",
    name: "Kenneth's Craving",
    image: "/images/kennethscraving.png",
    description:
    "Are you craving something savory and indulgent? Look no further than Kenneth's Craving pizza! Made with crispy bacon and topped with a generous helping of melted mozzarella cheese, this pizza is the ultimate comfort food. Every bite is a heavenly combination of smoky, salty bacon and ooey-gooey cheese that will satisfy even the most intense cravings. Whether you're looking for a quick snack or a full meal, Kenneth's Craving pizza is the perfect choice for you. So why wait? Order now and indulge in the mouthwatering deliciousness for yourself!",
    price: 190,
    countInStock: 10,
    rating: 5,
    numReviews: 5,
  },
];

export default products;
