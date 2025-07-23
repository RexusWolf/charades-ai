import { Language } from "../../language";
import { Deck } from "../Deck";

export const FAMOUS_TV_SERIES_ENGLISH_DECK = new Deck({
    id: "famous_tv_series_english",
    name: "📺 Famous TV Series",
    language: Language.english(),
    cards: [
        // Classics
        "Friends",
        "The Office",
        "Seinfeld",
        "The Simpsons",
        "The Sopranos",
        "Breaking Bad",

        // Fantasy & Sci-Fi
        "Game of Thrones",
        "Stranger Things",
        "Doctor Who",
        "The Mandalorian",
        "Black Mirror",
        "The Witcher",
        "Lost",
        "Westworld",
        "Severance",

        // Drama
        "The Crown",
        "This Is Us",
        "Mad Men",
        "The Handmaid's Tale",
        "Better Call Saul",
        "House of Cards",
        "Euphoria",

        // Crime & Thriller
        "Sherlock",
        "True Detective",
        "Narcos",
        "Mindhunter",
        "Money Heist",
        "Dexter",
        "Lupin",

        // Comedy
        "Brooklyn Nine-Nine",
        "Parks and Recreation",
        "How I Met Your Mother",
        "Modern Family",
        "Big Bang Theory",
        "Ted Lasso",
        "Arrested Development",

        // International Hits
        "Squid Game",
        "Dark",
        "Elite",
        "Sacred Games",
        "Borgen",
        "Attack on Titan",
        "One Piece"
    ]
});
