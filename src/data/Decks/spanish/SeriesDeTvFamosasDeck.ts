import { Language } from "../../language";
import { Deck } from "../Deck";

export const SERIES_FAMOSAS_SPANISH_DECK = new Deck({
    id: "series_famosas_spanish",
    name: "📺 Series Famosas",
    language: Language.spanish(),
    cards: [
        // Clásicos
        "Friends",
        "The Office",
        "Seinfeld",
        "Los Simpson",
        "Los Soprano",
        "Breaking Bad",

        // Fantasía y Ciencia Ficción
        "Juego de Tronos",
        "Stranger Things",
        "Doctor Who",
        "The Mandalorian",
        "Black Mirror",
        "The Witcher",
        "Perdidos",
        "Westworld",
        "Arcane",
        "Perdidos",
        "Separación",

        // Drama
        "The Crown",
        "This Is Us",
        "Mad Men",
        "El cuento de la criada",
        "Better Call Saul",
        "House of Cards",
        "Euphoria",

        // Crimen y Suspenso
        "Sherlock",
        "True Detective",
        "Narcos",
        "Mindhunter",
        "La Casa de Papel",
        "Dexter",
        "Lupin",

        // Comedia
        "Brooklyn Nine-Nine",
        "Parks and Recreation",
        "Cómo conocí a vuestra madre",
        "Modern Family",
        "The Big Bang Theory",
        "Ted Lasso",
        "Arrested Development",

        // Éxitos Internacionales
        "El juego del calamar",
        "Dark",
        "Élite",
        "Sacred Games",
        "Borgen",
        "Ataque a los Titanes",
        "One Piece"
    ]
});
