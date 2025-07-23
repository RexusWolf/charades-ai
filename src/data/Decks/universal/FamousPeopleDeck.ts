import { Language } from "../../language";
import { Deck } from "../Deck";

export const FAMOUS_PEOPLE_DECK = new Deck({
    id: "famous_people",
    name: "🌟 Famous People",
    language: Language.universal(),
    cards: [
        // Science & Innovation
        "Albert Einstein",
        "Marie Curie",
        "Isaac Newton",
        "Stephen Hawking",
        "Ada Lovelace",
        "Nikola Tesla",

        // Historical Figures & Leaders
        "Mahatma Gandhi",
        "Nelson Mandela",
        "Winston Churchill",
        "Martin Luther King Jr.",
        "Cleopatra",
        "Julius Caesar",
        "Alexander the Great",
        "Abraham Lincoln",

        // Modern Politics
        "Barack Obama",
        "Angela Merkel",
        "Jacinda Ardern",
        "Volodymyr Zelenskyy",
        "Pedro Sánchez",
        "Emmanuel Macron",
        "Donald Trump",


        // Artists & Writers
        "William Shakespeare",
        "Leo Tolstoy",
        "Frida Kahlo",
        "Pablo Picasso",
        "Gabriel García Márquez",
        "Haruki Murakami",
        "J.R.R. Tolkien",
        "Jane Austen",
        "Brandon Sanderson",
        "George R.R. Martin",
        "Stephen King",
        "Neil Gaiman",

        // Musicians
        "Beyoncé",
        "Bob Marley",
        "Taylor Swift",
        "Freddie Mercury",
        "Ludwig van Beethoven",
        "Shakira",
        "Rihanna",
        "Arctic Monkeys",
        "The Beatles",
        "The Rolling Stones",
        "The Who",
        "The Eagles",
        "The Beach Boys",
        "The Kinks",
        "Harry Styles",
        "Ed Sheeran",
        "Ariana Grande",
        "Billie Eilish",
        "Adele",
        "Bruno Mars",

        // Film & TV
        "Charlie Chaplin",
        "Jackie Chan",
        "Denzel Washington",
        "Keanu Reeves",
        "Tom Hanks",
        "Meryl Streep",
        "Denzel Washington",
        "Brad Pitt",
        "Angelina Jolie",
        "Tom Cruise",
        "Jennifer Lawrence",

        // Sports
        "Pelé",
        "Lionel Messi",
        "Serena Williams",
        "Usain Bolt",
        "Michael Jordan",
        "Naomi Osaka",
        "Cristiano Ronaldo",
        "Carlos Sainz",
        "Carlos Alcaraz",
        "Rafael Nadal",
        "Fernando Alonso",


        // Business & Tech
        "Steve Jobs",
        "Elon Musk",
        "Jeff Bezos",
        "Bill Gates",
        "Mark Zuckerberg",
    ]
});
