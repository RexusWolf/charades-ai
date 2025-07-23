import type { Card } from "../components/Card/Card"

// Deck Library - Multiple themed decks
export const DECK_LIBRARY = {
    animals: {
        id: "animals",
        name: "🐾 Animals",
        cards: [
            { id: 1, word: "Elephant", category: "Animals" },
            { id: 2, word: "Lion", category: "Animals" },
            { id: 3, word: "Giraffe", category: "Animals" },
            { id: 4, word: "Penguin", category: "Animals" },
            { id: 5, word: "Dolphin", category: "Animals" },
            { id: 6, word: "Kangaroo", category: "Animals" },
            { id: 7, word: "Panda", category: "Animals" },
            { id: 8, word: "Tiger", category: "Animals" },
            { id: 9, word: "Monkey", category: "Animals" },
            { id: 10, word: "Zebra", category: "Animals" },
            { id: 11, word: "Crocodile", category: "Animals" },
            { id: 12, word: "Butterfly", category: "Animals" },
            { id: 13, word: "Shark", category: "Animals" },
            { id: 14, word: "Owl", category: "Animals" },
            { id: 15, word: "Snake", category: "Animals" },
        ]
    },
    food: {
        id: "food",
        name: "🍕 Food & Drinks",
        cards: [
            { id: 16, word: "Pizza", category: "Food" },
            { id: 17, word: "Hamburger", category: "Food" },
            { id: 18, word: "Sushi", category: "Food" },
            { id: 19, word: "Ice Cream", category: "Food" },
            { id: 20, word: "Spaghetti", category: "Food" },
            { id: 21, word: "Chocolate", category: "Food" },
            { id: 22, word: "Coffee", category: "Beverages" },
            { id: 23, word: "Tea", category: "Beverages" },
            { id: 24, word: "Orange Juice", category: "Beverages" },
            { id: 25, word: "Milk", category: "Beverages" },
            { id: 26, word: "Apple", category: "Food" },
            { id: 27, word: "Banana", category: "Food" },
            { id: 28, word: "Cake", category: "Food" },
            { id: 29, word: "Bread", category: "Food" },
            { id: 30, word: "Rice", category: "Food" },
        ]
    },
    sports: {
        id: "sports",
        name: "⚽ Sports",
        cards: [
            { id: 31, word: "Basketball", category: "Sports" },
            { id: 32, word: "Soccer", category: "Sports" },
            { id: 33, word: "Tennis", category: "Sports" },
            { id: 34, word: "Swimming", category: "Sports" },
            { id: 35, word: "Baseball", category: "Sports" },
            { id: 36, word: "Volleyball", category: "Sports" },
            { id: 37, word: "Golf", category: "Sports" },
            { id: 38, word: "Skiing", category: "Sports" },
            { id: 39, word: "Boxing", category: "Sports" },
            { id: 40, word: "Cycling", category: "Sports" },
            { id: 41, word: "Running", category: "Sports" },
            { id: 42, word: "Diving", category: "Sports" },
            { id: 43, word: "Hockey", category: "Sports" },
            { id: 44, word: "Rugby", category: "Sports" },
            { id: 45, word: "Cricket", category: "Sports" },
        ]
    },
    music: {
        id: "music",
        name: "🎵 Music",
        cards: [
            { id: 46, word: "Guitar", category: "Music" },
            { id: 47, word: "Piano", category: "Music" },
            { id: 48, word: "Drums", category: "Music" },
            { id: 49, word: "Violin", category: "Music" },
            { id: 50, word: "Trumpet", category: "Music" },
            { id: 51, word: "Flute", category: "Music" },
            { id: 52, word: "Saxophone", category: "Music" },
            { id: 53, word: "Bass", category: "Music" },
            { id: 54, word: "Harmonica", category: "Music" },
            { id: 55, word: "Ukulele", category: "Music" },
            { id: 56, word: "Singing", category: "Music" },
            { id: 57, word: "Dancing", category: "Music" },
            { id: 58, word: "Concert", category: "Music" },
            { id: 59, word: "Microphone", category: "Music" },
            { id: 60, word: "Headphones", category: "Music" },
        ]
    },
    technology: {
        id: "technology",
        name: "💻 Technology",
        cards: [
            { id: 61, word: "Computer", category: "Technology" },
            { id: 62, word: "Smartphone", category: "Technology" },
            { id: 63, word: "Tablet", category: "Technology" },
            { id: 64, word: "Internet", category: "Technology" },
            { id: 65, word: "Email", category: "Technology" },
            { id: 66, word: "Camera", category: "Technology" },
            { id: 67, word: "Television", category: "Technology" },
            { id: 68, word: "Robot", category: "Technology" },
            { id: 69, word: "Drone", category: "Technology" },
            { id: 70, word: "Virtual Reality", category: "Technology" },
            { id: 71, word: "Artificial Intelligence", category: "Technology" },
            { id: 72, word: "Social Media", category: "Technology" },
            { id: 73, word: "Streaming", category: "Technology" },
            { id: 74, word: "Gaming", category: "Technology" },
            { id: 75, word: "Coding", category: "Technology" },
        ]
    },
    places: {
        id: "places",
        name: "🌍 Places",
        cards: [
            { id: 76, word: "Beach", category: "Places" },
            { id: 77, word: "Mountain", category: "Places" },
            { id: 78, word: "Forest", category: "Places" },
            { id: 79, word: "Desert", category: "Places" },
            { id: 80, word: "Ocean", category: "Places" },
            { id: 81, word: "City", category: "Places" },
            { id: 82, word: "Village", category: "Places" },
            { id: 83, word: "Airport", category: "Places" },
            { id: 84, word: "Hospital", category: "Places" },
            { id: 85, word: "School", category: "Places" },
            { id: 86, word: "Library", category: "Places" },
            { id: 87, word: "Museum", category: "Places" },
            { id: 88, word: "Park", category: "Places" },
            { id: 89, word: "Restaurant", category: "Places" },
            { id: 90, word: "Hotel", category: "Places" },
        ]
    },
    professions: {
        id: "professions",
        name: "👨‍⚕️ Professions",
        cards: [
            { id: 91, word: "Doctor", category: "Professions" },
            { id: 92, word: "Teacher", category: "Professions" },
            { id: 93, word: "Engineer", category: "Professions" },
            { id: 94, word: "Chef", category: "Professions" },
            { id: 95, word: "Police Officer", category: "Professions" },
            { id: 96, word: "Firefighter", category: "Professions" },
            { id: 97, word: "Artist", category: "Professions" },
            { id: 98, word: "Musician", category: "Professions" },
            { id: 99, word: "Actor", category: "Professions" },
            { id: 100, word: "Scientist", category: "Professions" },
            { id: 101, word: "Pilot", category: "Professions" },
            { id: 102, word: "Lawyer", category: "Professions" },
            { id: 103, word: "Nurse", category: "Professions" },
            { id: 104, word: "Dentist", category: "Professions" },
            { id: 105, word: "Veterinarian", category: "Professions" },
        ]
    },
    activities: {
        id: "activities",
        name: "🎯 Activities",
        cards: [
            { id: 106, word: "Dancing", category: "Activities" },
            { id: 107, word: "Singing", category: "Activities" },
            { id: 108, word: "Painting", category: "Activities" },
            { id: 109, word: "Reading", category: "Activities" },
            { id: 110, word: "Writing", category: "Activities" },
            { id: 111, word: "Cooking", category: "Activities" },
            { id: 112, word: "Gardening", category: "Activities" },
            { id: 113, word: "Fishing", category: "Activities" },
            { id: 114, word: "Hiking", category: "Activities" },
            { id: 115, word: "Photography", category: "Activities" },
            { id: 116, word: "Yoga", category: "Activities" },
            { id: 117, word: "Meditation", category: "Activities" },
            { id: 118, word: "Shopping", category: "Activities" },
            { id: 119, word: "Traveling", category: "Activities" },
            { id: 120, word: "Sleeping", category: "Activities" },
        ]
    },
    nature: {
        id: "nature",
        name: "🌿 Nature",
        cards: [
            { id: 121, word: "Sun", category: "Nature" },
            { id: 122, word: "Moon", category: "Nature" },
            { id: 123, word: "Stars", category: "Nature" },
            { id: 124, word: "Rain", category: "Nature" },
            { id: 125, word: "Snow", category: "Nature" },
            { id: 126, word: "Wind", category: "Nature" },
            { id: 127, word: "Thunder", category: "Nature" },
            { id: 128, word: "Rainbow", category: "Nature" },
            { id: 129, word: "Flower", category: "Nature" },
            { id: 130, word: "Tree", category: "Nature" },
            { id: 131, word: "Grass", category: "Nature" },
            { id: 132, word: "Rock", category: "Nature" },
            { id: 133, word: "River", category: "Nature" },
            { id: 134, word: "Lake", category: "Nature" },
            { id: 135, word: "Volcano", category: "Nature" },
        ]
    },
    transportation: {
        id: "transportation",
        name: "🚗 Transportation",
        cards: [
            { id: 136, word: "Car", category: "Transportation" },
            { id: 137, word: "Bicycle", category: "Transportation" },
            { id: 138, word: "Motorcycle", category: "Transportation" },
            { id: 139, word: "Bus", category: "Transportation" },
            { id: 140, word: "Train", category: "Transportation" },
            { id: 141, word: "Airplane", category: "Transportation" },
            { id: 142, word: "Boat", category: "Transportation" },
            { id: 143, word: "Helicopter", category: "Transportation" },
            { id: 144, word: "Subway", category: "Transportation" },
            { id: 145, word: "Truck", category: "Transportation" },
            { id: 146, word: "Taxi", category: "Transportation" },
            { id: 147, word: "Scooter", category: "Transportation" },
            { id: 148, word: "Skateboard", category: "Transportation" },
            { id: 149, word: "Rocket", category: "Transportation" },
            { id: 150, word: "Hot Air Balloon", category: "Transportation" },
        ]
    },
    objects: {
        id: "objects",
        name: "📦 Objects",
        cards: [
            { id: 151, word: "Book", category: "Objects" },
            { id: 152, word: "Pen", category: "Objects" },
            { id: 153, word: "Phone", category: "Objects" },
            { id: 154, word: "Watch", category: "Objects" },
            { id: 155, word: "Keys", category: "Objects" },
            { id: 156, word: "Wallet", category: "Objects" },
            { id: 157, word: "Glasses", category: "Objects" },
            { id: 158, word: "Umbrella", category: "Objects" },
            { id: 159, word: "Backpack", category: "Objects" },
            { id: 160, word: "Mirror", category: "Objects" },
            { id: 161, word: "Lamp", category: "Objects" },
            { id: 162, word: "Chair", category: "Objects" },
            { id: 163, word: "Table", category: "Objects" },
            { id: 164, word: "Bed", category: "Objects" },
            { id: 165, word: "Clock", category: "Objects" },
        ]
    },
    entertainment: {
        id: "entertainment",
        name: "🎬 Entertainment",
        cards: [
            { id: 166, word: "Movie", category: "Entertainment" },
            { id: 167, word: "Theater", category: "Entertainment" },
            { id: 168, word: "Comedy", category: "Entertainment" },
            { id: 169, word: "Drama", category: "Entertainment" },
            { id: 170, word: "Action", category: "Entertainment" },
            { id: 171, word: "Horror", category: "Entertainment" },
            { id: 172, word: "Romance", category: "Entertainment" },
            { id: 173, word: "Documentary", category: "Entertainment" },
            { id: 174, word: "Cartoon", category: "Entertainment" },
            { id: 175, word: "Game Show", category: "Entertainment" },
            { id: 176, word: "Reality TV", category: "Entertainment" },
            { id: 177, word: "News", category: "Entertainment" },
            { id: 178, word: "Podcast", category: "Entertainment" },
            { id: 179, word: "Radio", category: "Entertainment" },
            { id: 180, word: "Magazine", category: "Entertainment" },
        ]
    }
};

// Legacy support - keep the original SAMPLE_DECK for backward compatibility
export const SAMPLE_DECK: Card[] = DECK_LIBRARY.animals.cards;

// Helper function to get all available decks
export function getAllDecks() {
    return Object.values(DECK_LIBRARY);
}

// Helper function to get a specific deck by ID
export function getDeckById(deckId: string) {
    return DECK_LIBRARY[deckId as keyof typeof DECK_LIBRARY];
} 